import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT PARTIAL PO RELEASE AUDIT
 */
test.describe('Procurement Partial PO Release Audit @purchase @logic @regression @full', () => {
    test.setTimeout(300000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 10 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Audit: Partial PO release correctly tracks remaining unreceived quantity', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;

        const PO_QTY = 10;
        const RECEIVE_QTY = 5;
        const EXPECTED_REMAINING = PO_QTY - RECEIVE_QTY;

        if (!item) { console.log(`[SKIP] No item with stock >= ${PO_QTY}.`); return; }

        console.log(`[STEP 1] Creating PO for ${PO_QTY} units...`);
        const po = await app.api.purchase.createPurchaseOrderAPI({
            itemId: item.itemId,
            itemName: item.itemName,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        }, PO_QTY, 5000, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');
        console.log(`[OK] PO ${po.poNumber} approved.`);

        console.log(`[STEP 2] Receiving only ${RECEIVE_QTY} units via bill...`);
        const bill = await app.api.purchase.createBillAPI({
            vendorId: meta.vendorId,
            itemId: item.itemId,
            quantity: RECEIVE_QTY,
            unitPrice: 5000,
            apAccountId: meta.apAccountId
        });
        if (!bill.success) throw new Error(`Bill creation failed`);
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[OK] Bill ${bill.ref} approved for ${RECEIVE_QTY} units.`);

        await page.waitForTimeout(3000);

        console.log(`[STEP 3] Verifying partial release via bill line items...`);
        const billResp = await page.request.get(`${apiBase}/bill/${bill.id}?${qs}`, { headers });
        if (!billResp.ok()) throw new Error(`Failed to fetch bill: ${billResp.status()}`);
        const billData = await billResp.json();

        const receivedItems = billData.received_purchase_order_items || billData.bill_items || billData.items || [];
        const totalReceived = receivedItems.reduce((sum: number, it: any) => sum + parseFloat(it.received_quantity || it.quantity || '0'), 0);
        const remainingQty = PO_QTY - totalReceived;

        console.log(`[QTY] PO Total: ${PO_QTY} | Received: ${totalReceived} (Expected: ${RECEIVE_QTY}) | Remaining: ${remainingQty} (Expected: ${EXPECTED_REMAINING})`);

        if (totalReceived !== RECEIVE_QTY) {
            throw new Error(`[VULNERABILITY] Partial Release Tracking Failed — Received: ${totalReceived}, Expected: ${RECEIVE_QTY}`);
        }
        if (remainingQty !== EXPECTED_REMAINING) {
            throw new Error(`[VULNERABILITY] Partial Release Remaining Qty Mismatch — Remaining: ${remainingQty}, Expected: ${EXPECTED_REMAINING}`);
        }

        console.log(`[PASS] Partial PO release confirmed: ${RECEIVE_QTY} received, ${EXPECTED_REMAINING} remaining.`);
    });
});
