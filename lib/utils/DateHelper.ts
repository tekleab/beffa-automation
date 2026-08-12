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
    // Write resolved year back to env so all existing process.env.BEFFA_YEAR
    // references across API files automatically use the correct fiscal year.
    process.env.BEFFA_YEAR = String(result.ecYear);
    console.log(`[DateHelper] Resolved in-period date: ${result.iso} (day=${result.dayNumber}, ecYear=${result.ecYear})`);
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

      // Try env year first (yearOffset = 0), then past and future years
      for (const yearOffset of [0, 1, 2, 3, -1, -2]) {
        const year = baseYear + yearOffset;
        const qs = `year=${year}&period=${period}&calendar=${calendar}`;

        // Discover vendor + account + currency for this year's context
        const [vendorResp, acctResp, currResp] = await Promise.all([
          page.request.get(`${base}/vendors?page=1&pageSize=1&${qs}`, { headers }).catch(() => null),
          page.request.get(`${base}/accounts?page=1&pageSize=1&${qs}`, { headers }).catch(() => null),
          page.request.get(`${base}/currency?${qs}`, { headers }).catch(() => null),
        ]);

        const vendorData = await vendorResp?.json().catch(() => ({})) as any;
        const acctData   = await acctResp?.json().catch(() => ({})) as any;
        const currData   = await currResp?.json().catch(() => ({})) as any;

        const vendorId = vendorData?.data?.[0]?.id ?? vendorData?.items?.[0]?.id;
        const acctId   = acctData?.data?.[0]?.id   ?? acctData?.items?.[0]?.id;
        const currId   = currData?.data?.[0]?.id   ?? currData?.items?.[0]?.id;

        if (!vendorId || !acctId || !currId) continue;

        // POST with sentinel date far in the past — guaranteed out of period → 422 with bounds
        const probeResp = await page.request.post(`${base}/purchase-orders?${qs}`, {
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

        if (!probeResp) continue;

        const errText = await probeResp.text().catch(() => '');
        // Parse date bounds from error response: supports both MM/DD/YYYY and DD/MM/YYYY formats.
        const match = errText.match(/between\s+(\d{2})\/(\d{2})\/(\d{4})\s+and\s+(\d{2})\/(\d{2})\/(\d{4})/i);
        if (!match) {
          if (probeResp.status() === 200 || probeResp.status() === 201) {
            return DateHelper._fromDate(now, year);
          }
          continue;
        }

        const [, val1_1, val1_2, y1, val2_1, val2_2, y2] = match;
        let m1 = parseInt(val1_1, 10);
        let d1 = parseInt(val1_2, 10);
        let m2 = parseInt(val2_1, 10);
        let d2 = parseInt(val2_2, 10);

        // If the parsed month is > 12, it must be DD/MM/YYYY format
        if (m1 > 12 || m2 > 12) {
          m1 = parseInt(val1_2, 10);
          d1 = parseInt(val1_1, 10);
          m2 = parseInt(val2_2, 10);
          d2 = parseInt(val2_1, 10);
        }

        const periodStart = new Date(`${y1}-${String(m1).padStart(2, '0')}-${String(d1).padStart(2, '0')}T00:00:00Z`);
        const periodEnd   = new Date(`${y2}-${String(m2).padStart(2, '0')}-${String(d2).padStart(2, '0')}T00:00:00Z`);

        let useDate: Date;
        if (now >= periodStart && now <= periodEnd) {
          useDate = now;
        } else {
          // Select an early day in the valid open period to guarantee date is within bounds
          const safeInPeriod = new Date(periodStart.getTime() + 5 * 86400000);
          useDate = (safeInPeriod >= periodStart && safeInPeriod <= periodEnd) ? safeInPeriod : periodStart;
        }
        return DateHelper._fromDate(useDate, year);
      }

      return null;
    } catch { return null; }
  }

  // ── Strategy 2: derive from BEFFA_YEAR (EC year N starts Sep 11 of GC year N+7) ──
  // Uses Sep 15 (Meskerem ~5) as the safe UI-compatible date within the EC year.
  private static _fromEnv(): ResolvedDate | null {
    const baseYear = parseInt(process.env.BEFFA_YEAR || '', 10);
    if (!baseYear || isNaN(baseYear)) return null;
    const now = new Date();
    for (const offset of [0, 1, 2, 3, -1, -2]) {
      const ecYear = baseYear + offset;
      // EC year N: Sep 11 of GC year N+7 to Sep 10 of GC year N+8
      const gcYear = ecYear + 7;
      const periodStart = new Date(`${gcYear}-09-11T00:00:00Z`);
      const periodEnd   = new Date(`${gcYear + 1}-09-10T00:00:00Z`);

      const safeDate = new Date(`${gcYear}-09-15T00:00:00Z`);
      let useDate: Date;
      if (now >= periodStart && now <= periodEnd) {
        useDate = now;
      } else {
        useDate = safeDate >= periodStart && safeDate <= periodEnd ? safeDate : periodStart;
      }
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
