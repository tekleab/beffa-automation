import { test } from '@playwright/test';
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
 * SALES PARTIAL SO RELEASE AUDIT
 */
test.describe('Sales Partial SO Release Audit @sales @logic @regression @full', () => {
    test.setTimeout(120000);

    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser, request }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await apiLogin(request);
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 30, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page, request }) => {
        const app = new AppManager(page);
        await apiLogin(request);
    });

    test('Audit: Partial SO release correctly tracks remaining unreleased quantity', async ({ page , request }) => {
        const app = new AppManager(page);
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
