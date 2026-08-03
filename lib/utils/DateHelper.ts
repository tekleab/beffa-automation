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
  private static async _probeAPI(page: Page): Promise<ResolvedDate | null> {
    try {
      let base = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
        .replace(/['"+ ]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
      if (!base.startsWith('http')) base = 'http://' + base;
      if (!base.endsWith('/api')) base += '/api';

      const year = process.env.BEFFA_YEAR || '2019';
      const qs = `year=${year}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
      const company = process.env.BEFFA_COMPANY || '';

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

      if (!token) return null;

      const headers = {
        'x-company': company,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Discover vendor + account + currency (needed for a valid PO shape)
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

      if (!vendorId || !acctId || !currId) return null;

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

      if (!probeResp) return null;

      const errText = await probeResp.text().catch(() => '');
      // Parse "between DD/MM/YYYY and DD/MM/YYYY"
      const match = errText.match(/between\s+(\d{2})\/(\d{2})\/(\d{4})\s+and\s+(\d{2})\/(\d{2})\/(\d{4})/i);
      if (!match) return null;

      // Use period start date (first bound) — always valid
      const [, d1, m1, y1] = match;
      const periodStart = new Date(`${y1}-${m1}-${d1}T00:00:00Z`);
      console.log(`[DateHelper] Period bounds from API: ${match[0]} → using start ${y1}-${m1}-${d1}`);
      return DateHelper._fromDate(periodStart);
    } catch { return null; }
  }

  // ── Strategy 2: derive from BEFFA_YEAR (EC year N starts ~Aug 7 of GC N+7) ──
  private static _fromEnv(): ResolvedDate | null {
    const ecYear = parseInt(process.env.BEFFA_YEAR || '', 10);
    if (!ecYear || isNaN(ecYear)) return null;
    // EC year N: Meskerem 1 = ~Sep 11 of GC year (N+7), ends ~Sep 10 of GC year (N+8)
    // Use Sep 15 of GC year (N+7) as a safe mid-start date
    const gcYear = ecYear + 7;
    const safeStart = new Date(`${gcYear}-09-15T00:00:00Z`);
    const today = new Date();
    const ecStart = new Date(`${gcYear}-09-11T00:00:00Z`);
    const ecEnd = new Date(`${gcYear + 1}-09-10T00:00:00Z`);
    const useDate = today >= ecStart && today <= ecEnd ? today : safeStart;
    return DateHelper._fromDate(useDate);
  }

  // ── Strategy 3: today ────────────────────────────────────────────────────────
  private static _today(): ResolvedDate {
    return DateHelper._fromDate(new Date());
  }

  private static _fromDate(d: Date): ResolvedDate {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return { iso: `${yyyy}-${mm}-${dd}T00:00:00Z`, gcDate: d, dayNumber: d.getUTCDate() };
  }
}
