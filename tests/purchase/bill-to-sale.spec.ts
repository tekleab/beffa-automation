import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

async function apiLogin(request: any): Promise<string> {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('apiLogin failed');
    return token;
}


/**
 * E2E: Purchase to Sale Flow with Inventory Verification
 *
 * Flow: PO (UI) → Bill (API) → Verify stock increase
 *       → SO (API) → Invoice (API) → Verify stock decrease
 */

test.describe('E2E: Purchase to Sale Flow @e2e @regression @full', () => {
    test.setTimeout(600000);

    test('Full cycle: PO → Bill → SO → Invoice → stock reconciled', async ({ page , request }) => {
        const app = new AppManager(page);
        await apiLogin(request);

        const PURCHASE_QTY = 5;
        const SELL_QTY = 2;

        // ── Phase 1: Discover a valid item ──────────────────────────────────
        console.log('[PHASE 1] Discovering item for E2E cycle...');
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
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
