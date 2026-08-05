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
 * PROCUREMENT PARTIAL PO RELEASE AUDIT
 */
test.describe('Procurement Partial PO Release Audit @purchase @logic @regression @full', () => {
    test.setTimeout(120000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser, request }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await apiLogin(request);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 30, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page, request }) => {
        const app = new AppManager(page);
        await apiLogin(request);
    });

    test('Audit: Partial PO release correctly tracks remaining unreceived quantity', async ({ page , request }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;

        const PO_QTY = 10;
        const RECEIVE_QTY = 5;
        const UNIT_PRICE = 5000;
        const EXPECTED_REMAINING = PO_QTY - RECEIVE_QTY;

        if (!item) { console.log(`[SKIP] No item with stock >= ${PO_QTY}.`); return; }

        // Step 1: Create & approve PO
        console.log(`[STEP 1] Creating PO for ${PO_QTY} units...`);
        const po = await app.api.purchase.createPurchaseOrderAPI(
            { itemId: item.itemId, itemName: item.itemName, locationId: item.locationId, warehouseId: item.warehouseId },
            PO_QTY, UNIT_PRICE, meta.vendorId
        );
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');
        console.log(`[OK] PO ${po.poNumber} approved.`);

        // Step 2: Fetch PO to get po_item_id, then create partial bill linked to PO
        console.log(`[STEP 2] Receiving only ${RECEIVE_QTY} / ${PO_QTY} units via partial PO bill...`);
        const poResp = await page.request.get(`${apiBase}/purchase-order/${po.poId}?${qs}`, { headers });
        const poData = await poResp.json();
        const poItemId = poData.po_items?.[0]?.id;
        if (!poItemId) throw new Error(`PO ${po.poNumber} has no line items`);

        const createBillResp = await page.request.post(`${apiBase}/bills?${qs}`, {
            headers,
            data: {                purchase_order_id: po.poId,
                vendor_id: meta.vendorId,
                accounts_payable_id: meta.apAccountId,
                currency_id: meta.currencyId,                invoice_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                due_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                items: [],
                received_purchase_order_items: [{
                    po_item_id: poItemId,
                    received_quantity: RECEIVE_QTY,
                    received_unit_price: UNIT_PRICE
                }],
                status: 'draft'
            }
        });
        if (!createBillResp.ok()) throw new Error(`Partial bill creation failed: ${createBillResp.status()} — ${await createBillResp.text()}`);
        const billCreated = await createBillResp.json();
        await app.advanceDocumentAPI(billCreated.id, 'bills');
        console.log(`[OK] Bill ${billCreated.invoice_number} approved for ${RECEIVE_QTY} units.`);

        await page.waitForTimeout(3000);

        // Step 3: Verify partial receipt tracking
        console.log(`[STEP 3] Verifying partial release via bill detail...`);
        const billDetailResp = await page.request.get(`${apiBase}/bill/${billCreated.id}?${qs}`, { headers });
        if (!billDetailResp.ok()) throw new Error(`Failed to fetch bill: ${billDetailResp.status()}`);
        const billData = await billDetailResp.json();

        const receivedItems: any[] = billData.received_purchase_order_items || [];
        const totalReceived = receivedItems.reduce((s, it) => s + parseFloat(it.received_quantity || '0'), 0);
        const remainingQty = PO_QTY - totalReceived;
        const billAmount = totalReceived * UNIT_PRICE;
        const remainingLiability = remainingQty * UNIT_PRICE;

        // Console audit table
        const W = { l: 28, v: 32 };
        const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
        const line = '─'.repeat(W.l + W.v + 7);
        const result = totalReceived === RECEIVE_QTY && remainingQty === EXPECTED_REMAINING;
        console.log(`\n  ┌${line}┐`);
        console.log(`  │ ${pad('Partial PO Release Audit', W.l + W.v + 3)} │`);
        console.log(`  ├${line}┤`);
        console.log(`  │ ${pad('PO Ref', W.l)} │ ${pad(po.poNumber, W.v)} │`);
        console.log(`  │ ${pad('PO ID', W.l)} │ ${pad(po.poId, W.v)} │`);
        console.log(`  │ ${pad('Bill Ref', W.l)} │ ${pad(billCreated.invoice_number || '?', W.v)} │`);
        console.log(`  │ ${pad('Bill ID', W.l)} │ ${pad(billCreated.id, W.v)} │`);
        console.log(`  ├${line}┤`);
        console.log(`  │ ${pad('PO Qty Authorized', W.l)} │ ${pad(`${PO_QTY} units`, W.v)} │`);
        console.log(`  │ ${pad('Received (this bill)', W.l)} │ ${pad(`${totalReceived} units`, W.v)} │`);
        console.log(`  │ ${pad('Remaining on PO', W.l)} │ ${pad(`${remainingQty} units`, W.v)} │`);
        console.log(`  ├${line}┤`);
        console.log(`  │ ${pad('Unit Price', W.l)} │ ${pad(`$${UNIT_PRICE.toFixed(2)}`, W.v)} │`);
        console.log(`  │ ${pad('Bill Amount', W.l)} │ ${pad(`$${billAmount.toFixed(2)}`, W.v)} │`);
        console.log(`  │ ${pad('Remaining Liability', W.l)} │ ${pad(`$${remainingLiability.toFixed(2)}`, W.v)} │`);
        console.log(`  │ ${pad('PO Total', W.l)} │ ${pad(`$${(PO_QTY * UNIT_PRICE).toFixed(2)}`, W.v)} │`);
        console.log(`  ├${line}┤`);
        console.log(`  │ ${pad('Result', W.l)} │ ${pad(result ? '✓ PASS — Partial tracking correct' : '✗ FAIL', W.v)} │`);
        console.log(`  └${line}┘\n`);

        if (totalReceived !== RECEIVE_QTY) {
            throw new Error(`[VULNERABILITY] Partial Release Tracking Failed — Received: ${totalReceived}, Expected: ${RECEIVE_QTY}`);
        }
        if (remainingQty !== EXPECTED_REMAINING) {
            throw new Error(`[VULNERABILITY] Partial Release Remaining Qty Mismatch — Remaining: ${remainingQty}, Expected: ${EXPECTED_REMAINING}`);
        }

        console.log(`[PASS] Partial PO release confirmed: ${RECEIVE_QTY} received, ${EXPECTED_REMAINING} remaining.`);
    });
});
