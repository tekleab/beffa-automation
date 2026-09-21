/**
 * DateHelper — resolves a valid in-period date by probing the ERP API.
 *
 * Strategy (multi-year flexible probe):
 *   1. POST a PO with po_date = TODAY across years [BEFFA_YEAR, +1, -1, +2, -2].
 *      - If the year's open period contains today → today is accepted (only po_items
 *        validation fires, no period error) → use today for that year.
 *        Today's date guarantees the monthly GL posting period is also open.
 *      - If period error fires → today is outside that year's period → try next year.
 *   2. If no year accepts today (edge case: fiscal gap between years):
 *      Probe with sentinel date 2000-01-01 on BEFFA_YEAR to get open bounds,
 *      then walk back from periodEnd in 30-day steps until a valid date is found
 *      (handles partially-closed monthly GL periods within the fiscal year).
 *   3. Fallback: today with BEFFA_YEAR (last resort, no API available).
 *
 * The probe is cheap (one failed POST per year, no document created) and
 * self-healing — it automatically follows fiscal year rollovers.
 */

import { Page } from '@playwright/test';

export interface ResolvedDate {
  iso: string;       // "YYYY-MM-DDT00:00:00Z" — for API payloads
  gcDate: Date;      // JS Date object
  dayNumber: number; // UTC day-of-month for UI calendar grid click
  ecYear: number;    // EC fiscal year this date belongs to
}

let _cached: ResolvedDate | null = null;

export class DateHelper {
  static clearCache() { _cached = null; }

  static async resolve(page: Page): Promise<ResolvedDate> {
    if (_cached) return _cached;
    const result = await DateHelper._probeAPI(page)
      ?? DateHelper._fromEnv()
      ?? DateHelper._today();
    _cached = result;
    // Write resolved year back to env so all existing process.env.BEFFA_YEAR
    // references across API files automatically use the correct fiscal year.
    process.env.BEFFA_YEAR = String(result.ecYear);
    console.log(`[DateHelper] Resolved in-period date: ${result.iso} (day=${result.dayNumber}, ecYear=${result.ecYear})`);
    return result;
  }

  // ── Strategy 1: multi-year flexible probe ─────────────────────────────────
  private static async _probeAPI(page: Page): Promise<ResolvedDate | null> {
    try {
      let base = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
        .replace(/['\"+ ]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
      if (!base.startsWith('http')) base = 'http://' + base;
      if (!base.endsWith('/api')) base += '/api';

      const period   = process.env.BEFFA_PERIOD   || 'yearly';
      const calendar = process.env.BEFFA_CALENDAR || 'ec';
      const company  = process.env.BEFFA_COMPANY  || '';
      const baseYear = parseInt(process.env.BEFFA_YEAR || '2019', 10);

      // ── Resolve auth token ──────────────────────────────────────────────
      const token = await page.evaluate(() => {
        for (const k of ['token', 'auth-token', 'jwt', 'access_token']) {
          const v = localStorage.getItem(k);
          if (v && v.length > 50) return v;
        }
        for (let i = 0; i < localStorage.length; i++) {
          const v = localStorage.getItem(localStorage.key(i)!);
          if (v?.startsWith('ey')) return v;
        }
        return null;
      }).catch(() => null);

      let resolvedToken = token;
      if (!resolvedToken) {
        try {
          const loginResp = await page.request.post(
            `${base}/users/login?year=${baseYear}&period=${period}&calendar=${calendar}&month=6`,
            { data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
              headers: { 'Content-Type': 'application/json' } }
          );
          if (loginResp.ok()) {
            const d = await loginResp.json();
            resolvedToken = d.auth_token || d.token || null;
          }
        } catch { /* ignore */ }
      }

      if (!resolvedToken) return null;

      const headers = {
        'x-company': company,
        'Authorization': `Bearer ${resolvedToken}`,
        'Content-Type': 'application/json'
      };

      // ── Discover vendor / account / currency IDs (use baseYear for lookup) ──
      const baseQs = `year=${baseYear}&period=${period}&calendar=${calendar}`;
      const [vendorResp, acctResp, currResp] = await Promise.all([
        page.request.get(`${base}/vendors?page=1&pageSize=1&${baseQs}`, { headers }).catch(() => null),
        page.request.get(`${base}/accounts?page=1&pageSize=1&${baseQs}`, { headers }).catch(() => null),
        page.request.get(`${base}/currency?${baseQs}`, { headers }).catch(() => null),
      ]);

      const vendorData = await vendorResp?.json().catch(() => ({})) as any;
      const acctData   = await acctResp?.json().catch(() => ({})) as any;
      const currData   = await currResp?.json().catch(() => ({})) as any;

      const vendorId = vendorData?.data?.[0]?.id ?? vendorData?.items?.[0]?.id;
      const acctId   = acctData?.data?.[0]?.id   ?? acctData?.items?.[0]?.id;
      const currId   = currData?.data?.[0]?.id   ?? currData?.items?.[0]?.id;

      if (!vendorId || !acctId || !currId) return null;

      const now = new Date();
      const nowIso = DateHelper._toIso(now);

      // ── Phase 1: probe with TODAY across multiple EC years ────────────────
      // Try baseYear first, then ±1, ±2 to handle fiscal year rollovers.
      const yearsToTry = [baseYear, baseYear + 1, baseYear - 1, baseYear + 2, baseYear - 2];

      for (const year of yearsToTry) {
        const qs = `year=${year}&period=${period}&calendar=${calendar}`;
        const probe = await page.request.post(`${base}/purchase-orders?${qs}`, {
          headers,
          data: {
            vendor_id: vendorId,
            accounts_payable_id: acctId,
            currency_id: currId,
            po_date: nowIso,
            purchase_type_id: 4,
            po_items: []
          }
        }).catch(() => null);

        if (!probe) continue;
        const text = await probe.text().catch(() => '');

        // If the response does NOT contain a period error for po_date,
        // today is within this year's open fiscal period → use it.
        // (Only po_items error fires when date is valid.)
        if (!text.includes('not within the current period') && !text.includes('current period')) {
          console.log(`[DateHelper] ✓ Year ${year}: today (${nowIso}) is within open fiscal period`);
          return DateHelper._fromDate(now, year);
        }

        // Period error fired → today is outside this year's period → try next year
        const match = text.match(/between\s+(\d{2})\/(\d{2})\/(\d{4})\s+and\s+(\d{2})\/(\d{2})\/(\d{4})/i);
        const bounds = match ? `${match[0]}` : '(bounds unparseable)';
        console.log(`[DateHelper] Year ${year}: today is outside period ${bounds} — trying next year...`);
      }

      // ── Phase 2: no year accepted today — fiscal gap scenario ────────────
      // Use sentinel probe on baseYear to get its period bounds, then walk back
      // from periodEnd in 30-day steps to find a date the GL will accept.
      console.log(`[DateHelper] ⚠ No year accepts today. Using sentinel probe to find best date within known period...`);

      const sentinelQs = `year=${baseYear}&period=${period}&calendar=${calendar}`;
      const sentinelProbe = await page.request.post(`${base}/purchase-orders?${sentinelQs}`, {
        headers,
        data: {
          vendor_id: vendorId,
          accounts_payable_id: acctId,
          currency_id: currId,
          po_date: '2000-01-01T00:00:00Z',
          purchase_type_id: 4,
          po_items: []
        }
      }).catch(() => null);

      if (sentinelProbe) {
        const sentinelText = await sentinelProbe.text().catch(() => '');
        const periodEnd = DateHelper._parsePeriodEnd(sentinelText);

        if (periodEnd) {
          // Walk back from periodEnd in 30-day steps — pick the first date that
          // the ERP doesn't reject for period reasons (stops at periodStart).
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          for (let offset = 30; offset <= 330; offset += 30) {
            const candidate = new Date(periodEnd.getTime() - offset * 24 * 60 * 60 * 1000);
            const candidateIso = DateHelper._toIso(candidate);
            const candidateQs = `year=${baseYear}&period=${period}&calendar=${calendar}`;
            const candidateProbe = await page.request.post(`${base}/purchase-orders?${candidateQs}`, {
              headers,
              data: {
                vendor_id: vendorId,
                accounts_payable_id: acctId,
                currency_id: currId,
                po_date: candidateIso,
                purchase_type_id: 4,
                po_items: []
              }
            }).catch(() => null);

            if (candidateProbe) {
              const cText = await candidateProbe.text().catch(() => '');
              if (!cText.includes('not within the current period') && !cText.includes('current period')) {
                console.log(`[DateHelper] ✓ Fallback date found: ${candidateIso} (periodEnd - ${offset}d, year=${baseYear})`);
                return DateHelper._fromDate(candidate, baseYear);
              }
            }
          }

          // Absolute last resort: use periodEnd - 30d even if not confirmed
          const fallback = new Date(periodEnd.getTime() - thirtyDays);
          console.log(`[DateHelper] ⚠ Using unconfirmed fallback: ${DateHelper._toIso(fallback)}`);
          return DateHelper._fromDate(fallback, baseYear);
        }
      }

      return null;
    } catch { return null; }
  }

  // ── Parse "between DD/MM/YYYY and DD/MM/YYYY" → return the end date ──────
  private static _parsePeriodEnd(text: string): Date | null {
    const match = text.match(/between\s+(\d{2})\/(\d{2})\/(\d{4})\s+and\s+(\d{2})\/(\d{2})\/(\d{4})/i);
    if (!match) return null;
    const [, , , , p2a, p2b, y2] = match;
    // DD/MM/YYYY format: p2a = day, p2b = month
    const ddmm = new Date(`${y2}-${String(p2b).padStart(2, '0')}-${String(p2a).padStart(2, '0')}T00:00:00Z`);
    if (!isNaN(ddmm.getTime())) return ddmm;
    // MM/DD/YYYY fallback
    const mmdd = new Date(`${y2}-${String(p2a).padStart(2, '0')}-${String(p2b).padStart(2, '0')}T00:00:00Z`);
    return isNaN(mmdd.getTime()) ? null : mmdd;
  }

  // ── Format a Date as YYYY-MM-DDT00:00:00Z ────────────────────────────────
  private static _toIso(d: Date): string {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T00:00:00Z`;
  }

  // ── Strategy 2: derive from BEFFA_YEAR env ────────────────────────────────
  private static _fromEnv(): ResolvedDate | null {
    const baseYear = parseInt(process.env.BEFFA_YEAR || '2019', 10);
    return DateHelper._fromDate(new Date(), baseYear);
  }

  // ── Strategy 3: today (last resort) ──────────────────────────────────────
  private static _today(): ResolvedDate {
    const baseYear = parseInt(process.env.BEFFA_YEAR || '2019', 10);
    return DateHelper._fromDate(new Date(), baseYear);
  }

  private static _fromDate(d: Date, ecYear: number): ResolvedDate {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return { iso: `${yyyy}-${mm}-${dd}T00:00:00Z`, gcDate: d, dayNumber: d.getUTCDate(), ecYear };
  }
}
