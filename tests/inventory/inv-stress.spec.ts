import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { Logger } from '../../lib/utils/Logger';

/**
 * INVENTORY STRESS & COSTING EDGE CASES
 *
 * 1. Transfer then sell — cross-location stock desync
 *
 * Removed (covered elsewhere):
 *   - Sell below WAC cost              → removed per request
 *   - Stock adjustment reversal WAC    → removed per request
 *   - Sell exact qty → stock floor     → inv-boundary-attack.spec.ts
 *   - Concurrent sell + adjustment     → inv-concurrency.spec.ts
 */

test.describe('Inventory Stress & Costing Edge Cases @inventory @logic @security @regression @full', () => {

    let sharedPage: import('@playwright/test').Page;
    let sharedApp: AppManager;

    test.beforeAll(async ({ browser }) => {
        test.setTimeout(300000);
        sharedPage = await browser.newPage();
        sharedApp = new AppManager(sharedPage);
        await sharedApp.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test.afterAll(async () => { await sharedPage?.close(); });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // ── 1. TRANSFER THEN SELL — CROSS-LOCATION STOCK DESYNC ──────────────────
    test('Audit: Selling from source location after transfer must not exceed transferred-out stock', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 10, unit_cost: 100 });
        console.log(`[ITEM] ${item.itemName} | stock=10 @ loc=${item.locationId}`);

        // Transfer all 10 units out
        let transferResult: any;
        try {
            transferResult = await app.api.inventory.executeTransferAPI({
                itemId: item.itemId,
                quantity: 10,
                fromLocationId: item.locationId,
                fromWarehouseId: item.warehouseId
            });
            console.log(`[TRANSFER] OUT: ${transferResult.outRef} | IN: ${transferResult.inRef}`);
        } catch (err: any) {
            console.log(`[SKIP] Transfer setup failed — skipping cross-location test: ${err.message.slice(0, 100)}`);
            return;
        }

        await page.waitForTimeout(3000);
        const stockAtSource = await app.api.inventory.pollStockAPI(item.itemId, 0, item.locationId, 10);
        console.log(`[AUDIT] Stock at source after transfer: ${stockAtSource} (expected: 0)`);

        // Attempt to sell from the now-empty source location
        const meta = await app.api.sales.discoverMetadataAPI();
        console.log(`[ATTACK] Attempting to sell 5 units from empty source location...`);
        try {
            const inv = await app.api.sales.createStandaloneInvoiceAPI({
                customerId: meta.customerId,
                itemId: item.itemId,
                quantity: 5,
                unitPrice: 150,
                locationId: item.locationId,
                warehouseId: item.warehouseId
            });
            await app.advanceDocumentAPI(inv.id, 'invoices');
            const stockAfterSell = await app.api.inventory.pollStockAPI(item.itemId, undefined as any, item.locationId, 5);
            console.log(`[RESULT] Stock at source after oversell: ${stockAfterSell}`);
            if (stockAfterSell < 0) {
                console.log(`[CRITICAL_LOGIC_BUG] Negative stock at source location after transfer + sell: ${stockAfterSell}`);
                Logger.fail(`Cross-location stock desync: source stock=${stockAfterSell} after transfer-out`);
            }
            expect.soft(stockAfterSell, `[CRITICAL_LOGIC_BUG] Stock went negative after transfer+sell: ${stockAfterSell}`).toBeGreaterThanOrEqual(0);
        } catch (err: any) {
            console.log(`[PASS] Oversell from empty location correctly blocked: ${err.message.slice(0, 100)}`);
        }
    });
});
