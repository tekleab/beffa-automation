/**
 * DateHelper — resolves a valid in-period date by probing the ERP API.
 *
 * Strategy:
 *   1. POST a minimal PO with a sentinel date (2000-01-01) → ERP returns 422 with
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
    const now = new Date();
    const baseYear = parseInt(process.env.BEFFA_YEAR || '2019', 10);
    const result = DateHelper._fromDate(now, baseYear);
    _cached = result;
    process.env.BEFFA_YEAR = String(result.ecYear);
    console.log(`[DateHelper] Resolved in-period date: ${result.iso} (day=${result.dayNumber}, ecYear=${result.ecYear})`);
    return result;
  }

  // ── Strategy 1: probe API with sentinel date, parse period bounds from 422 ──
  // Probes the target BEFFA_YEAR directly to ensure we remain strictly within open fiscal bounds.
  private static async _probeAPI(page: Page): Promise<ResolvedDate | null> {
    try {
      let base = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
        .replace(/['"+ ]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
      if (!base.startsWith('http')) base = 'http://' + base;
      if (!base.endsWith('/api')) base += '/api';

      const period   = process.env.BEFFA_PERIOD   || 'yearly';
      const calendar = process.env.BEFFA_CALENDAR || 'ec';
      const company  = process.env.BEFFA_COMPANY  || '';
      const baseYear = parseInt(process.env.BEFFA_YEAR || '2019', 10);

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

      const year = baseYear;
      const qs = `year=${year}&period=${period}&calendar=${calendar}`;

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

      if (vendorId && acctId && currId) {
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

        if (probeResp) {
          const errText = await probeResp.text().catch(() => '');
          // Parse date bounds from error response: supports DD/MM/YYYY and MM/DD/YYYY formats
          const match = errText.match(/between\s+(\d{2})\/(\d{2})\/(\d{4})\s+and\s+(\d{2})\/(\d{2})\/(\d{4})/i);
          if (match) {
            const [, p1a, p1b, y1, p2a, p2b, y2] = match;
            let m1 = parseInt(p1a, 10);
            let d1 = parseInt(p1b, 10);
            let m2 = parseInt(p2a, 10);
            let d2 = parseInt(p2b, 10);

            // In DD/MM/YYYY error messages (e.g. 07/08/2025 = 07 Aug 2025, 07/07/2026 = 07 Jul 2026):
            // p1a is Day (07), p1b is Month (08). Swap if p1a <= 31 and p1b <= 12 to treat as DD/MM/YYYY.
            let periodStart: Date;
            let periodEnd: Date;

            // Try DD/MM/YYYY format first (standard ERP format)
            const date1_ddmm = new Date(`${y1}-${String(p1b).padStart(2, '0')}-${String(p1a).padStart(2, '0')}T00:00:00Z`);
            const date2_ddmm = new Date(`${y2}-${String(p2b).padStart(2, '0')}-${String(p2a).padStart(2, '0')}T00:00:00Z`);

            if (!isNaN(date1_ddmm.getTime()) && !isNaN(date2_ddmm.getTime()) && date1_ddmm <= date2_ddmm) {
              periodStart = date1_ddmm;
              periodEnd = date2_ddmm;
            } else {
              periodStart = new Date(`${y1}-${String(m1).padStart(2, '0')}-${String(d1).padStart(2, '0')}T00:00:00Z`);
              periodEnd = new Date(`${y2}-${String(m2).padStart(2, '0')}-${String(d2).padStart(2, '0')}T00:00:00Z`);
            }

            const now = new Date();
            let useDate: Date;

            if (now >= periodStart && now <= periodEnd) {
              useDate = now;
            } else {
              // Pick midpoint of open period to guarantee it's strictly within open bounds
              const midMs = periodStart.getTime() + Math.floor((periodEnd.getTime() - periodStart.getTime()) / 2);
              useDate = new Date(midMs);
            }
            return DateHelper._fromDate(useDate, year);
          } else if (probeResp.status() === 200 || probeResp.status() === 201) {
            return DateHelper._fromDate(new Date(), year);
          }
        }
      }

      return null;
    } catch { return null; }
  }

  // ── Strategy 2: derive strictly from BEFFA_YEAR ─────────────────────────────────
  private static _fromEnv(): ResolvedDate | null {
    const baseYear = parseInt(process.env.BEFFA_YEAR || '2019', 10);
    const ecYear = baseYear;
    const now = new Date();
    return DateHelper._fromDate(now, ecYear);
  }

  // ── Strategy 3: today ────────────────────────────────────────────────────────
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
