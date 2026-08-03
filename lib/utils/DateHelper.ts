/**
 * DateHelper — resolves a valid in-period date by probing the ERP API.
 *
 * Strategy:
 *   1. POST a minimal PO with a sentinel date (2099-01-01) → ERP returns 422 with
 *      "between DD/MM/YYYY and DD/MM/YYYY" → parse period start → use that date.
 *   2. Fallback: derive from BEFFA_YEAR env (EC year N starts ~Aug 7 of GC year N+7).
 *   3. Last resort: today.
 *
 * The probe is cheap (one failed POST, no document created) and self-healing —
 * it always returns a date the ERP will accept regardless of when the period rolls.
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
    console.log(`[DateHelper] Resolved in-period date: ${result.iso} (day=${result.dayNumber})`);
    return result;
  }

  // ── Strategy 1: probe API with sentinel date, parse period bounds from 422 ──
  // Tries env year first; if the resolved period start is in the past, increments
  // year until a current/future period is found (handles stale BEFFA_YEAR env).
  private static async _probeAPI(page: Page): Promise<ResolvedDate | null> {
    try {
      let base = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
        .replace(/['"+ ]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
      if (!base.startsWith('http')) base = 'http://' + base;
      if (!base.endsWith('/api')) base += '/api';

      const period   = process.env.BEFFA_PERIOD   || 'yearly';
      const calendar = process.env.BEFFA_CALENDAR || 'ec';
      const company  = process.env.BEFFA_COMPANY  || '';
      const baseYear = parseInt(process.env.BEFFA_YEAR || '2018', 10);

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

      // If localStorage is empty (blank page / API-only test), try a login probe
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

      const now = new Date();

      // Try env year, then env+1, then env+2 — stops as soon as period end is in the future
      for (let yearOffset = 0; yearOffset <= 2; yearOffset++) {
        const year = baseYear + yearOffset;
        const qs = `year=${year}&period=${period}&calendar=${calendar}`;

        // Discover vendor + account + currency for this year's context
        const [vendorResp, acctResp, currResp] = await Promise.all([
          page.request.get(`${base}/vendors?page=1&pageSize=1&${qs}`, { headers }).catch(() => null),
          page.request.get(`${base}/accounts?page=1&pageSize=1&${qs}`, { headers }).catch(() => null),
          page.request.get(`${base}/currency?${qs}`, { headers }).catch(() => null),
        ]);

        const vendorId = ((await vendorResp?.json().catch(() => ({}))) as any)?.data?.[0]?.id
          ?? ((await vendorResp?.json().catch(() => ({}))) as any)?.items?.[0]?.id;
        const acctId = ((await acctResp?.json().catch(() => ({}))) as any)?.data?.[0]?.id
          ?? ((await acctResp?.json().catch(() => ({}))) as any)?.items?.[0]?.id;
        const currId = ((await currResp?.json().catch(() => ({}))) as any)?.data?.[0]?.id
          ?? ((await currResp?.json().catch(() => ({}))) as any)?.items?.[0]?.id;

        if (!vendorId || !acctId || !currId) continue;

        // POST with sentinel date 2099-01-01 — guaranteed out of period → 422 with bounds
        const probeResp = await page.request.post(`${base}/purchase-orders?${qs}`, {
          headers,
          data: {
            vendor_id: vendorId,
            accounts_payable_id: acctId,
            currency_id: currId,
            po_date: '2099-01-01T00:00:00Z',
            purchase_type_id: 4,
            po_items: []
          }
        }).catch(() => null);

        if (!probeResp) continue;

        const errText = await probeResp.text().catch(() => '');
        // Parse "between DD/MM/YYYY and DD/MM/YYYY"
        const match = errText.match(/between\s+(\d{2})\/(\d{2})\/(\d{4})\s+and\s+(\d{2})\/(\d{2})\/(\d{4})/i);
        if (!match) continue;

        const [, d1, m1, y1, d2, m2, y2] = match;
        const periodStart = new Date(`${y1}-${m1}-${d1}T00:00:00Z`);
        const periodEnd   = new Date(`${y2}-${m2}-${d2}T00:00:00Z`);

        // Skip if this period has already ended — try next year
        if (periodEnd < now) {
          console.log(`[DateHelper] Year ${year} period ended ${y2}-${m2}-${d2} — trying year ${year + 1}`);
          continue;
        }

        // Use period start if it's today or future; otherwise use today (we're mid-period)
        const useDate = periodStart > now ? periodStart : now;
        console.log(`[DateHelper] Period bounds (year=${year}): ${match[0]} → using ${useDate.toISOString().slice(0, 10)}`);
        return DateHelper._fromDate(useDate, year);
      }

      return null;
    } catch { return null; }
  }

  // ── Strategy 2: derive from BEFFA_YEAR (EC year N starts ~Aug 7 of GC N+7) ──
  // Walks years until it finds one whose period end is in the future.
  private static _fromEnv(): ResolvedDate | null {
    const baseYear = parseInt(process.env.BEFFA_YEAR || '', 10);
    if (!baseYear || isNaN(baseYear)) return null;
    const now = new Date();
    for (let offset = 0; offset <= 3; offset++) {
      const ecYear = baseYear + offset;
      // EC year N: Hamle 1 (Jul 8) of GC year N+7 to Sene 30 (Jul 7) of GC year N+8
      const gcYear = ecYear + 7;
      const periodStart = new Date(`${gcYear}-07-08T00:00:00Z`);
      const periodEnd   = new Date(`${gcYear + 1}-07-07T00:00:00Z`);
      if (periodEnd < now) continue;
      const useDate = periodStart > now ? periodStart : now;
      console.log(`[DateHelper] _fromEnv: EC year ${ecYear} → using ${useDate.toISOString().slice(0, 10)}`);
      return DateHelper._fromDate(useDate, ecYear);
    }
    return null;
  }

  // ── Strategy 3: today ────────────────────────────────────────────────────────
  private static _today(): ResolvedDate {
    const baseYear = parseInt(process.env.BEFFA_YEAR || '2018', 10);
    return DateHelper._fromDate(new Date(), baseYear);
  }

  private static _fromDate(d: Date, ecYear: number): ResolvedDate {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return { iso: `${yyyy}-${mm}-${dd}T00:00:00Z`, gcDate: d, dayNumber: d.getUTCDate(), ecYear };
  }
}
