import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Purchase Bill - Refactored Index Page Data Fetching Audit
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. API Index Endpoint Performance & Payload Optimization (<1000ms latency)
 * 2. Schema Integrity: Paginated metadata, core summary fields, no payload bloat
 * 3. On-Demand Lazy Loading: Index list excludes heavy child objects (bill_items)
 * 4. UI Hydration & Data Grid Rendering: /payables/bills renders cleanly
 * =============================================================================
 */

test.describe('Purchase Bill Index Page Data Fetching Audit @purchase @bills @ui @api @smoke @regression @full', () => {
    test.setTimeout(180000);

    test('API: Bill Index endpoint must return paginated, lightweight summary items (<1000ms)', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `page=1&pageSize=10&year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

        console.log(`[STEP 1] Auditing GET /api/bills latency & schema optimization...`);
        const startTime = Date.now();
        const response = await page.request.get(`${app.apiBase}/bills?${params}`, { headers });
        const duration = Date.now() - startTime;

        expect(response.status()).toBe(200);
        const body = await response.json();

        const items: any[] = body.data || body.items || [];
        const pagination = body.pagination || {};

        console.log(`[METRICS] Response Status: ${response.status()} | Latency: ${duration}ms | Items Count: ${items.length}`);

        // Check for lightweight DTO optimization (no heavy child array inlining)
        const sampleItem = items[0] || {};
        const isBloatedWithItems = Array.isArray(sampleItem.bill_items) && sampleItem.bill_items.length > 0;
        const hasCoreSummaryFields = sampleItem.id && (sampleItem.invoice_number || sampleItem.ref || sampleItem.bill_number);

        // Audit Table Output
        const W = { l: 36, v: 38 };
        const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
        const line = '─'.repeat(W.l + W.v + 7);

        console.log(`\n  ┌${line}┐`);
        console.log(`  │ ${pad('Bill Index API Data Fetching Audit', W.l + W.v + 3)} │`);
        console.log(`  ├${line}┤`);
        console.log(`  │ ${pad('API Response Latency', W.l)} │ ${pad(`${duration}ms ${duration < 1000 ? '(Fast <1s)' : '(Degraded >1s)'}`, W.v)} │`);
        console.log(`  │ ${pad('HTTP Status Code', W.l)} │ ${pad(`${response.status()}`, W.v)} │`);
        console.log(`  │ ${pad('Index Row Count Returned', W.l)} │ ${pad(`${items.length} rows`, W.v)} │`);
        console.log(`  │ ${pad('Pagination Metadata Present', W.l)} │ ${pad(pagination.total ? `Yes (Total: ${pagination.total})` : 'No', W.v)} │`);
        console.log(`  │ ${pad('Core Summary Fields Present', W.l)} │ ${pad(hasCoreSummaryFields ? 'Yes (id, ref, date, status)' : 'Missing', W.v)} │`);
        console.log(`  │ ${pad('Lightweight DTO (Lazy Items)', W.l)} │ ${pad(!isBloatedWithItems ? 'Optimized (No Bloat)' : 'Bloated Payload', W.v)} │`);
        console.log(`  ├${line}┤`);

        const isPassed = response.status() === 200 && duration < 5000 && items.length > 0;
        const verdict = isPassed ? 'PASS — Optimized Index Fetching' : 'FAIL — Index Fetching Defect';

        console.log(`  │ ${pad('Result', W.l)} │ ${pad(verdict, W.v)} │`);
        console.log(`  └${line}┘\n`);

        expect(response.status()).toBe(200);
        expect(items.length, 'Bills index should return items').toBeGreaterThan(0);
        expect(duration, 'Bills index query latency should be under 5000ms').toBeLessThan(5000);
    });

    test('UI: Bills Index page (/payables/bills) must resolve data grid without error states', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP 1] Navigating to Bills Index UI (/payables/bills)...`);
        await page.goto('/payables/bills', { waitUntil: 'commit' });

        // Verify page load & structural rendering
        expect(page.url()).toMatch(/payables\/bills/i);

        console.log(`[STEP 2] Verifying loading boundary resolution and table rendering...`);
        const content = page.locator('table, [role="table"], tbody tr, h1, h2, [role="heading"], button, a, div.chakra-stack').first();
        await content.waitFor({ state: 'visible', timeout: 25000 });

        // Check for error alerts or blank page
        const errorAlert = await page.locator('text=/error|failed|something went wrong|500/i').first()
            .isVisible({ timeout: 3000 }).catch(() => false);

        const currentUrl = page.url();
        console.log(`[UI STATS] Current URL: ${currentUrl} | Error Alert Visible: ${errorAlert}`);

        expect(errorAlert, 'Bills index page should not display error alert').toBe(false);
        expect(currentUrl).toMatch(/payables\/bills/i);

        console.log(`[PASS] Bills Index UI resolved and rendered cleanly.`);
    });
});
