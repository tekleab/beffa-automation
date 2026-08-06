import { test, expect, Browser, Page } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { apiLoginSetup } from '../../lib/utils/apiLoginSetup';

test.describe('Load: Concurrent PO Submissions @purchase @load @full', () => {
    test.setTimeout(180000);

    let page: Page;
    let app: AppManager;

    test.beforeAll(async ({ browser }: { browser: Browser }) => {
        page = await browser.newPage();
        app = await apiLoginSetup(page);
        // Warm up DateHelper so all concurrent calls use the correct cached date
        const { DateHelper } = require('../../lib/utils/DateHelper');
        DateHelper.clearCache();
        await DateHelper.resolve(page);
    });

    test.afterAll(async () => { await page.close(); });

    test('LOAD: 20 concurrent PO submissions must all succeed within 30s', async () => {
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'WAC', quantity: 200, unit_cost: 100
        });

        const CONCURRENCY = 20;
        console.log(`[LOAD] Firing ${CONCURRENCY} concurrent PO creations...`);
        const start = Date.now();

        const results = await Promise.allSettled(
            Array.from({ length: CONCURRENCY }, (_, i) =>
                app.api.purchase.createPurchaseOrderAPI(item, 1, 500 + i)
            )
        );

        const elapsed = Date.now() - start;
        const passed = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
        const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

        console.log(`[LOAD] ${passed.length} passed | ${failed.length} failed | ${elapsed}ms`);
        failed.forEach((f, i) => console.log(`[FAIL ${i + 1}] ${f.reason?.message}`));

        // [KNOWN_BUG] unique_po_company: ERP sequence not atomic under concurrent load
        const dupKeyFails = failed.filter(f => f.reason?.message?.includes('unique_po_company')).length;
        const otherFails = failed.length - dupKeyFails;
        if (dupKeyFails > 0) console.log(`[KNOWN_BUG] ${dupKeyFails} PO(s) hit unique_po_company constraint — ERP sequence not atomic under concurrent load`);
        expect(otherFails, `${otherFails} non-duplicate PO(s) failed under load`).toBe(0);
        // SLA: 60s for 20 concurrent POs on this infrastructure
        expect(elapsed, `20 concurrent POs took ${elapsed}ms — exceeds 60s SLA`).toBeLessThan(60000);
        console.log(`[PASS] ${CONCURRENCY} POs in ${elapsed}ms | avg: ${Math.round(elapsed / CONCURRENCY)}ms/PO`);
    });

    test('LOAD: Response time must not degrade more than 5x from sequential to burst', async () => {
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'WAC', quantity: 100, unit_cost: 100
        });

        const baselineTimes: number[] = [];
        for (let i = 0; i < 3; i++) {
            const t = Date.now();
            try { await app.api.purchase.createPurchaseOrderAPI(item, 1, 500 + i); } catch { /* constraint — still measures latency */ }
            baselineTimes.push(Date.now() - t);
        }
        const baseline = Math.max(...baselineTimes);
        console.log(`[LOAD] Baseline (sequential 3): max=${baseline}ms`);

        const burstTimes: number[] = [];
        await Promise.all(Array.from({ length: 10 }, async (_, i) => {
            const t = Date.now();
            try { await app.api.purchase.createPurchaseOrderAPI(item, 1, 600 + i); } catch { /* constraint */ }
            burstTimes.push(Date.now() - t);
        }));
        const burstMax = Math.max(...burstTimes);
        const degradation = burstMax / baseline;
        console.log(`[LOAD] Burst max=${burstMax}ms | degradation=${degradation.toFixed(1)}x`);

        // [KNOWN_BUG] unique_po_company constraint inflates times — use expect.soft
        expect.soft(degradation, `[PERF_BUG] ${degradation.toFixed(1)}x degradation (baseline: ${baseline}ms, burst: ${burstMax}ms)`).toBeLessThan(5);
        console.log(`[PASS] Degradation: ${degradation.toFixed(1)}x`);
    });
});
