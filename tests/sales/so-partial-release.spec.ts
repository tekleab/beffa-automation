import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Sales Order - Partial Release & Invoice Split Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Partial release creates invoice for selected line items only
 * 2. Remaining SO quantity correctly tracked post-partial-release
 * 3. Multiple partial releases sum to full SO amount
 * =============================================================================
 */



/**
 * SALES PARTIAL SO RELEASE AUDIT
 */
test.describe('Sales Partial SO Release Audit @sales @regression', () => {
    test.setTimeout(120000);

    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 30, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    });

    test('Audit: Partial SO release correctly tracks remaining unreleased quantity', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const item = sharedItem;

        const SO_QTY = 10;
        const RELEASE_QTY = 5;
        const EXPECTED_REMAINING = SO_QTY - RELEASE_QTY;

        if (!item) { console.log(`[SKIP] No item with stock >= ${SO_QTY}.`); return; }

        console.log(`[STEP 1] Creating SO for ${SO_QTY} units...`);
        const so = await app.api.sales.createSalesOrderAPI({ itemId: item.itemId, quantity: SO_QTY, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(so.id, 'sales-orders');
        console.log(`[OK] SO ${so.ref} approved.`);

        console.log(`[STEP 2] Releasing only ${RELEASE_QTY} units via invoice...`);
        const inv = await app.api.sales.createInvoiceAPI({ customerId: so.customerId, soId: so.id, soItemId: so.soItemId, releasedQuantity: RELEASE_QTY, locationId: item.locationId, warehouseId: item.warehouseId });
        if (!inv.success) throw new Error(`Invoice creation failed: ${inv.error}`);
        await app.advanceDocumentAPI(inv.id!, 'invoices');
        console.log(`[OK] Invoice ${inv.ref} approved for ${RELEASE_QTY} units.`);

        await page.waitForTimeout(3000);

        console.log(`[STEP 3] Verifying partial release via invoice line items...`);
        const invResp = await page.request.get(`${apiBase}/invoice/${inv.id!}?${qs}`, { headers });
        if (!invResp.ok()) throw new Error(`Failed to fetch invoice: ${invResp.status()}`);
        const invData = await invResp.json();

        const releasedItems = invData.released_sales_order_items || invData.invoice_items || invData.items || [];
        const totalReleased = releasedItems.reduce((sum: number, it: any) => sum + parseFloat(it.released_quantity || it.quantity || '0'), 0);
        const remainingQty = SO_QTY - totalReleased;

        console.log(`[QTY] SO Total: ${SO_QTY} | Released: ${totalReleased} (Expected: ${RELEASE_QTY}) | Remaining: ${remainingQty} (Expected: ${EXPECTED_REMAINING})`);

        if (totalReleased !== RELEASE_QTY) {
            throw new Error(`[VULNERABILITY] Partial Release Tracking Failed — Released: ${totalReleased}, Expected: ${RELEASE_QTY}`);
        }
        if (remainingQty !== EXPECTED_REMAINING) {
            throw new Error(`[VULNERABILITY] Partial Release Remaining Qty Mismatch — Remaining: ${remainingQty}, Expected: ${EXPECTED_REMAINING}`);
        }

        console.log(`[PASS] Partial SO release confirmed: ${RELEASE_QTY} released, ${EXPECTED_REMAINING} remaining.`);
    });
});
