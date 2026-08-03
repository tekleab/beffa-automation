/**
 * DateHelper — resolves a valid in-period date for the active ERP fiscal year.
 *
 * Problem: new Date() returns today's Gregorian date which may be outside the
 * open fiscal period (e.g. EC 2018 ended Dec 2025 GC but today is Aug 2026 GC).
 *
 * Strategy (in priority order):
 *   1. Fetch an existing approved document (bill/SO/PO) — its date is guaranteed valid.
 *   2. Derive from BEFFA_YEAR env var using EC→GC offset (EC year N starts Sep 11, GC year N+7).
 *   3. Fall back to today (works when the period is still open).
 *
 * Usage:
 *   const d = await DateHelper.resolve(page);
 *   d.iso          // "2025-11-15T00:00:00Z"  — for API payloads
 *   d.gcDate       // Date object
 *   d.dayNumber    // 15                       — for UI calendar click
 */

import { Page } from '@playwright/test';

export interface ResolvedDate {
  iso: string;
  gcDate: Date;
  dayNumber: number;
}

// Module-level cache — resolved once per worker process
let _cached: ResolvedDate | null = null;

export class DateHelper {
  /** Clear cache (call in beforeAll if you need a fresh resolution per test file). */
  static clearCache() { _cached = null; }

  /**
   * Resolve a valid in-period date. Cached after first call.
   */
  static async resolve(page: Page): Promise<ResolvedDate> {
    if (_cached) return _cached;

    const result = await DateHelper._resolveFromAPI(page)
      ?? DateHelper._resolveFromEnv()
      ?? DateHelper._resolveToday();

    _cached = result;
    console.log(`[DateHelper] Resolved in-period date: ${result.iso} (day=${result.dayNumber})`);
    return result;
  }

  // ── Strategy 1: pull date from an existing approved document ──────────────
  private static async _resolveFromAPI(page: Page): Promise<ResolvedDate | null> {
    try {
      let base = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
        .replace(/['"+ ]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
      if (!base.startsWith('http')) base = 'http://' + base;
      if (!base.endsWith('/api')) base += '/api';

      const year = process.env.BEFFA_YEAR || '2018';
      const qs = `year=${year}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
      const company = process.env.BEFFA_COMPANY || '';

      // Get token from localStorage
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

      const headers = { 'x-company': company, 'Authorization': `Bearer ${token}` };

      // Try bills, then purchase-orders, then sales-orders — pick first date found
      for (const [ep, field] of [['bills', 'invoice_date'], ['purchase-orders', 'po_date'], ['sales-orders', 'so_date']] as const) {
        const resp = await page.request.get(`${base}/${ep}?page=1&pageSize=1&status=approved&${qs}`, { headers })
          .catch(() => null);
        if (!resp?.ok()) continue;
        const data = await resp.json().catch(() => ({}));
        const items: any[] = data.data || data.items || [];
        const dateStr: string | undefined = items[0]?.[field];
        if (dateStr) return DateHelper._fromIso(dateStr);
      }
    } catch { /* fall through */ }
    return null;
  }

  // ── Strategy 2: derive mid-year date from BEFFA_YEAR (EC→GC) ─────────────
  private static _resolveFromEnv(): ResolvedDate | null {
    const ecYear = parseInt(process.env.BEFFA_YEAR || '', 10);
    if (!ecYear || isNaN(ecYear)) return null;

    // EC year N starts on Sep 11 of GC year (N + 7), ends Sep 10 of GC year (N + 8)
    // Use the midpoint: ~Mar 1 of GC year (N + 8) = safely within the EC year
    const gcYear = ecYear + 8;
    const midYear = new Date(`${gcYear}-03-01T00:00:00Z`);
    const today = new Date();

    // If today is already within the EC year range, prefer today
    const ecStart = new Date(`${ecYear + 7}-09-11T00:00:00Z`);
    const ecEnd = new Date(`${ecYear + 8}-09-10T00:00:00Z`);
    const useDate = today >= ecStart && today <= ecEnd ? today : midYear;

    return DateHelper._fromDate(useDate);
  }

  // ── Strategy 3: today (works when period is still open) ───────────────────
  private static _resolveToday(): ResolvedDate {
    return DateHelper._fromDate(new Date());
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private static _fromIso(isoStr: string): ResolvedDate {
    const d = new Date(isoStr);
    return DateHelper._fromDate(d);
  }

  private static _fromDate(d: Date): ResolvedDate {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return {
      iso: `${yyyy}-${mm}-${dd}T00:00:00Z`,
      gcDate: d,
      dayNumber: d.getUTCDate()
    };
  }
}
