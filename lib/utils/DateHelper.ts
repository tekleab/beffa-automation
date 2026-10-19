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

  /** Returns the active fiscal year — uses cached value or env fallback. */
  static activeYear(): string {
    return _cached ? String(_cached.ecYear) : (process.env.BEFFA_YEAR || '2019');
  }

  /** Returns full query-string params using the active fiscal year. */
  static qs(): string {
    const year = DateHelper.activeYear();
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    return `year=${year}&period=${period}&calendar=${calendar}`;
  }

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
        .replace(/['\\"+ ]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
      if (!base.startsWith('http')) base = 'http://' + base;
      if (!base.endsWith('/api')) base += '/api';

      const period   = process.env.BEFFA_PERIOD   || 'yearly';
      const calendar = process.env.BEFFA_CALENDAR || 'ec';
      const baseYear = parseInt(process.env.BEFFA_YEAR || '2019', 10);

      // ── Get auth token ────────────────────────────────────────────────────
      const storageInfo = await page.evaluate(() => {
        try {
          const comp = localStorage.getItem('currentCompany') || localStorage.getItem('company');
          let tok: string | null = null;
          for (const k of ['token', 'auth-token', 'jwt', 'access_token']) {
            const v = localStorage.getItem(k);
            if (v && v.length > 50) { tok = v; break; }
          }
          if (!tok) {
            for (let i = 0; i < localStorage.length; i++) {
              const v = localStorage.getItem(localStorage.key(i)!);
              if (v?.startsWith('ey')) { tok = v; break; }
            }
          }
          return { comp, tok };
        } catch { return null; }
      }).catch(() => null);

      let resolvedToken = storageInfo?.tok || null;
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

      const baseHeaders = {
        'Authorization': `Bearer ${resolvedToken}`,
        'Content-Type': 'application/json'
      };

      // ── Scan all companies to find one with an open fiscal period ─────────
      // The configured company may not have an open period (e.g. after fiscal year rollover).
      const configuredCompany = storageInfo?.comp || process.env.BEFFA_COMPANY || 'BM Tech';
      let allCompanyNames: string[] = [configuredCompany];
      try {
        const meResp = await page.request.get(`${base}/users/me`, { headers: baseHeaders });
        if (meResp.ok()) {
          const meData = await meResp.json();
          const names: string[] = ((meData.user || meData).companies || [])
            .map((c: any) => c.name).filter(Boolean);
          // Put configured company first, then the rest
          allCompanyNames = [configuredCompany, ...names.filter((n: string) => n !== configuredCompany)];
        }
      } catch { /* use configured company only */ }

      const yearsToTry = [baseYear, baseYear + 1, baseYear - 1, baseYear + 2, baseYear - 2];

      for (const co of allCompanyNames) {
        const headers = { ...baseHeaders, 'x-company': co };

        for (const year of yearsToTry) {
          const qs = `year=${year}&period=${period}&calendar=${calendar}`;

          // Sentinel probe: use an obviously-out-of-range date to extract period bounds
          const sentinelR = await page.request.post(`${base}/purchase-orders?${qs}`, {
            headers,
            data: { po_date: '2000-01-01T00:00:00Z', purchase_type_id: 4, po_items: [] }
          }).catch(() => null);
          if (!sentinelR) continue;
          const sentinelText = await sentinelR.text().catch(() => '');
          const periodEnd = DateHelper._parsePeriodEnd(sentinelText);
          if (!periodEnd) continue; // no period bounds in response → year has no period configured

          // We have bounds. Check if today is within the period.
          const now = new Date();
          const nowIso = DateHelper._toIso(now);
          const periodStart = DateHelper._parsePeriodStart(sentinelText);

          if (periodStart && now >= periodStart && now <= periodEnd) {
            // Today is within the open period — verify with a real probe
            const todayR = await page.request.post(`${base}/purchase-orders?${qs}`, {
              headers,
              data: { po_date: nowIso, purchase_type_id: 4, po_items: [] }
            }).catch(() => null);
            const todayText = todayR ? await todayR.text().catch(() => '') : '';
            if (!DateHelper.isPeriodError(todayText)) {
              console.log(`[DateHelper] ✓ company="${co}" year=${year}: today (${nowIso}) is within open period`);
              process.env.BEFFA_COMPANY = co;
              process.env.BEFFA_YEAR = String(year);
              return DateHelper._fromDate(now, year);
            }
          }

          // Today is outside the period — use periodEnd - 75d as safe transaction date
          const candidate = new Date(periodEnd.getTime() - 75 * 24 * 60 * 60 * 1000);
          const candidateIso = DateHelper._toIso(candidate);
          const candidateR = await page.request.post(`${base}/purchase-orders?${qs}`, {
            headers,
            data: { po_date: candidateIso, purchase_type_id: 4, po_items: [] }
          }).catch(() => null);
          const candidateText = candidateR ? await candidateR.text().catch(() => '') : '';
          if (!DateHelper.isPeriodError(candidateText)) {
            console.log(`[DateHelper] ✓ company="${co}" year=${year}: using in-period date ${candidateIso}`);
            process.env.BEFFA_COMPANY = co;
            process.env.BEFFA_YEAR = String(year);
            return DateHelper._fromDate(candidate, year);
          }
        }
      }

      return null;
    } catch { return null; }
  }


  // ── Inventory GL uses the same resolved period as PO GL ─────────────────
  static async resolveForInventory(page: Page): Promise<ResolvedDate | null> {
    return DateHelper.resolve(page);
  }

  // ── Parse period bounds from ERP error messages ────────────────────────
  // Handles both:
  //   "between DD/MM/YYYY and DD/MM/YYYY"
  //   "Mon D, YYYY - Mon D, YYYY"  (e.g. "Jul 8, 2025 - Jul 7, 2026")
  private static _parsePeriodEnd(text: string): Date | null {
    // Format 1: "between DD/MM/YYYY and DD/MM/YYYY"
    const m1 = text.match(/between\s+(\d{2})\/(\d{2})\/(\d{4})\s+and\s+(\d{2})\/(\d{2})\/(\d{4})/i);
    if (m1) {
      const [, , , , p2a, p2b, y2] = m1;
      const ddmm = new Date(`${y2}-${String(p2b).padStart(2, '0')}-${String(p2a).padStart(2, '0')}T00:00:00Z`);
      if (!isNaN(ddmm.getTime())) return ddmm;
      const mmdd = new Date(`${y2}-${String(p2a).padStart(2, '0')}-${String(p2b).padStart(2, '0')}T00:00:00Z`);
      return isNaN(mmdd.getTime()) ? null : mmdd;
    }
    // Format 2: "Mon D, YYYY - Mon D, YYYY" or "Mon D, YYYY – Mon D, YYYY"
    const m2 = text.match(/(\w+ \d+,\s*\d{4})\s*[-\u2013]\s*(\w+ \d+,\s*\d{4})/);
    if (m2) {
      const endDate = new Date(m2[2]);
      if (!isNaN(endDate.getTime())) return endDate;
    }
    return null;
  }

  // ── Parse period START from ERP error messages ────────────────────────────
  private static _parsePeriodStart(text: string): Date | null {
    // Format 1: "between DD/MM/YYYY and DD/MM/YYYY"
    const m1 = text.match(/between\s+(\d{2})\/(\d{2})\/(\d{4})\s+and\s+(\d{2})\/(\d{2})\/(\d{4})/i);
    if (m1) {
      const [, p1a, p1b, y1] = m1;
      const ddmm = new Date(`${y1}-${String(p1b).padStart(2, '0')}-${String(p1a).padStart(2, '0')}T00:00:00Z`);
      if (!isNaN(ddmm.getTime())) return ddmm;
      const mmdd = new Date(`${y1}-${String(p1a).padStart(2, '0')}-${String(p1b).padStart(2, '0')}T00:00:00Z`);
      return isNaN(mmdd.getTime()) ? null : mmdd;
    }
    // Format 2: "Mon D, YYYY - Mon D, YYYY"
    const m2 = text.match(/(\w+ \d+,\s*\d{4})\s*[-\u2013]\s*(\w+ \d+,\s*\d{4})/);
    if (m2) {
      const startDate = new Date(m2[1]);
      if (!isNaN(startDate.getTime())) return startDate;
    }
    return null;
  }

  // ── Detect period error in any ERP error text ─────────────────────────────
  static isPeriodError(text: string): boolean {
    return text.includes('not within the current period') ||
           text.includes('current period') ||
           text.includes('not allowed outside the open period') ||
           text.includes('outside the open period');
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
    // Compute actual EC year from GC date:
    // EC year N starts on Meskerem 1 (~Sep 11 of GC year N+7)
    // GC Jan 1 - Sep 10 of year Y -> EC year Y-8
    // GC Sep 11 - Dec 31 of year Y -> EC year Y-7
    const month = d.getUTCMonth() + 1; // 1-12
    const day = d.getUTCDate();
    const computedEcYear = (month < 9 || (month === 9 && day < 11)) ? yyyy - 8 : yyyy - 7;
    // Use the passed ecYear only if it matches the computed one (probe confirmed it);
    // otherwise trust the computed value so the query string year is correct.
    const finalEcYear = ecYear === computedEcYear ? ecYear : computedEcYear;
    return { iso: `${yyyy}-${mm}-${dd}T00:00:00Z`, gcDate: d, dayNumber: day, ecYear: finalEcYear };
  }
}
