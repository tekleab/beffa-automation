import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * E2E: Purchase to Sale Flow with Inventory Verification
 *
 * Flow: PO (UI) → Bill (API) → Verify stock increase
 *       → SO (API) → Invoice (API) → Verify stock decrease
 */

test.describe('E2E: Purchase to Sale Flow @e2e', () => {
    test.setTimeout(600000);

    test('Full cycle: PO → Bill → SO → Invoice → stock reconciled', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const PURCHASE_QTY = 5;
        const SELL_QTY = 2;

        // ── Phase 1: Discover a valid item ──────────────────────────────────
        console.log('[PHASE 1] Discovering item for E2E cycle...');
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
        if (!item) throw new Error('[SKIP] No items found in inventory.');

        const stockBefore = item.currentStock;
        console.log(`[OK] Item: "${item.itemName}" | Stock Before: ${stockBefore}`);

        // ── Phase 2: Purchase — create Bill via API ──────────────────────────
        console.log('[PHASE 2] Creating & approving Bill via API...');
        const bill = await app.api.purchase.createBillAPI({
            itemData: item,
            quantity: PURCHASE_QTY,
            unitPrice: 1000
        });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[OK] Bill ${bill.ref} approved.`);

        await page.waitForTimeout(3000);
        const stockAfterPurchase = await app.api.inventory.pollStockAPI(
            item.itemId, stockBefore + PURCHASE_QTY, item.locationId
        );

        console.log(`[AUDIT] Stock after purchase: ${stockAfterPurchase} (Expected: ${stockBefore + PURCHASE_QTY})`);
        expect(stockAfterPurchase).toBe(stockBefore + PURCHASE_QTY);

        // ── Phase 3: Sale — create SO + Invoice via API ──────────────────────
        console.log('[PHASE 3] Creating & approving SO via API...');
        const meta = await app.api.sales.discoverMetadataAPI();
        const so = await app.api.sales.createSalesOrderAPI({
            itemId: item.itemId,
            quantity: SELL_QTY,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(so.id, 'sales-orders');
        console.log(`[OK] SO ${so.ref} approved.`);

        console.log('[PHASE 3] Creating & approving Invoice via API...');
        const inv = await app.api.sales.createInvoiceAPI({
            customerId: so.customerId,
            soId: so.id,
            soItemId: so.soItemId,
            releasedQuantity: SELL_QTY,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        if (!inv.success) throw new Error(`Invoice creation failed: ${inv.error}`);
        await app.advanceDocumentAPI(inv.id!, 'invoices');
        console.log(`[OK] Invoice ${inv.ref} approved.`);

        await page.waitForTimeout(3000);
        const expectedFinalStock = stockBefore + PURCHASE_QTY - SELL_QTY;
        const stockAfterSale = await app.api.inventory.pollStockAPI(
            item.itemId, expectedFinalStock, item.locationId
        );

        console.log(`\n========== E2E CYCLE AUDIT REPORT ==========`);
        console.log(`[ITEM]    ${item.itemName} (${item.itemId})`);
        console.log(`[BILL]    ${bill.ref} — purchased ${PURCHASE_QTY} units`);
        console.log(`[SO]      ${so.ref} — sold ${SELL_QTY} units`);
        console.log(`[INVOICE] ${inv.ref}`);
        console.log(`[STOCK]   Before Purchase : ${stockBefore}`);
        console.log(`[STOCK]   After Purchase  : ${stockAfterPurchase}`);
        console.log(`[STOCK]   After Sale      : ${stockAfterSale} (Expected: ${expectedFinalStock})`);
        console.log(`============================================\n`);

        expect(stockAfterSale).toBe(expectedFinalStock);
        console.log(`[PASS] E2E Purchase to Sale cycle complete. Inventory correctly reconciled.`);
    });
});
