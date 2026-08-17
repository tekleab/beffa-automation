import { test, expect, Browser, Page } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { apiLoginSetup } from '../../lib/utils/apiLoginSetup';

test.describe('Load: Concurrent Inventory Adjustments @inventory @load @full', () => {
    test.setTimeout(180000);

    let page: Page;
    let app: AppManager;

    test.beforeAll(async ({ browser }: { browser: Browser }) => {
        page = await browser.newPage();
        app = await apiLoginSetup(page);
        const { DateHelper } = require('../../lib/utils/DateHelper');
        DateHelper.clearCache();
        await DateHelper.resolve(page);
    });

    test.afterAll(async () => { await page.close(); });

    test('LOAD: 10 concurrent +5 adjustments must produce exactly +50 net stock', async () => {
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'WAC', quantity: 10, unit_cost: 100
        });
        const initialStock = item.currentStock;
        const CONCURRENCY = 10;
        const ADJ_QTY = 5;
        const expectedStock = initialStock + (CONCURRENCY * ADJ_QTY);

        console.log(`[LOAD] "${item.itemName}" | initial=${initialStock} | expected=${expectedStock}`);
        console.log(`[LOAD] Firing ${CONCURRENCY} concurrent +${ADJ_QTY} adjustments...`);

        const results = await Promise.allSettled(
            Array.from({ length: CONCURRENCY }, () =>
                app.api.inventory.adjustStockAPI({
                    itemId: item.itemId, quantity: ADJ_QTY, type: 'in',
                    locationId: item.locationId, warehouseId: item.warehouseId
                })
            )
        );

        const passed = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
        const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
        console.log(`[LOAD] Created: ${passed.length} | Failed: ${failed.length}`);

        await Promise.allSettled(
            passed.filter(r => r.value?.id).map(r => app.advanceDocumentAPI(r.value.id, 'inventory-adjustments'))
        );

        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId, 30);
        console.log(`[LOAD] final=${finalStock} | expected=${expectedStock} | net=+${finalStock - initialStock}`);

        expect(finalStock, `Lost update under concurrent advance: expected ${expectedStock}, got ${finalStock}`).toBe(expectedStock);
        console.log(`[PASS] All ${CONCURRENCY} adjustments applied atomically`);
    });

    test('LOAD: 10 concurrent -2 adjustments on 20-unit stock must not go below zero', async () => {
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'WAC', quantity: 20, unit_cost: 100
        });
        const initialStock = item.currentStock;
        const CONCURRENCY = 10;
        const ADJ_QTY = 2;

        console.log(`[LOAD] "${item.itemName}" | initial=${initialStock}`);
        console.log(`[LOAD] Firing ${CONCURRENCY} concurrent -${ADJ_QTY} adjustments (total drain: ${CONCURRENCY * ADJ_QTY})...`);

        const results = await Promise.allSettled(
            Array.from({ length: CONCURRENCY }, () =>
                app.api.inventory.adjustStockAPI({
                    itemId: item.itemId, quantity: ADJ_QTY, type: 'out',
                    locationId: item.locationId, warehouseId: item.warehouseId
                })
            )
        );

        const passed = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
        console.log(`[LOAD] Created: ${passed.length}`);

        await Promise.allSettled(
            passed.filter(r => r.value?.id).map(r => app.advanceDocumentAPI(r.value.id, 'inventory-adjustments'))
        );

        await page.waitForTimeout(5000);
        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, 0, item.locationId, 20);
        console.log(`[LOAD] Final stock: ${finalStock} (must be >= 0)`);

        if (finalStock < 0) {
            throw new Error(`[CRITICAL_LOGIC_BUG] Negative stock: ${finalStock}. Concurrent out-adjustments bypassed stock floor.`);
        }
        expect(finalStock, 'Stock must never go below zero').toBeGreaterThanOrEqual(0);
        console.log(`[PASS] Stock floor maintained — final: ${finalStock}`);
    });
});
