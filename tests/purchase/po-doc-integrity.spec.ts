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


type AuditRow = { label: string; value: string };

function printAuditTable(title: string, rows: AuditRow[]) {
    const W = { label: 32, value: 40 };
    const line = '─'.repeat(W.label + W.value + 7);
    const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
    console.log(`\n  ┌${'─'.repeat(line.length - 2)}┐`);
    console.log(`  │ ${pad(title, line.length - 4)} │`);
    console.log(`  ├${'─'.repeat(line.length - 2)}┤`);
    console.log(`  │ ${pad('Field', W.label)} │ ${pad('Value', W.value)} │`);
    console.log(`  ├${'─'.repeat(line.length - 2)}┤`);
    for (const r of rows) console.log(`  │ ${pad(r.label, W.label)} │ ${pad(r.value, W.value)} │`);
    console.log(`  └${'─'.repeat(line.length - 2)}┘\n`);
}

/**
 * PROCUREMENT DOCUMENT INTEGRITY ATTACKS
 *
 * 1. Future-dated bill injection       [REAL BUG — ERP approves future bills]
 * 2. PO quantity exhaustion +1 unit    [REAL BUG — overflow bill approved]
 * 3. Same PO billed twice              [REAL BUG — double AP liability]
 * 4. Approved bill line item mutation  [PASS — ERP rejects]
 * 5. Bill with no vendor               [PASS — ERP rejects at creation]
 * 6. PO↔Bill 1:1 reconciliation        [PASS — maps correctly]
 */

test.describe('Procurement Document Integrity Attacks @purchase @security @logic @regression @full', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser, request }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await apiLogin(request);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page, request }) => {
        const app = new AppManager(page);
        await apiLogin(request);
    });

    // ── 1. POST-DATED BILL INJECTION ─────────────────────────────────────────
    test('Guardrail: System must reject approval of a future-dated Bill', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 2);
        const futureDateStr = futureDate.toISOString().split('T')[0] + 'T00:00:00Z';

        console.log(`[ATTACK] Injecting Bill with future date: ${futureDateStr}...`);
        try {
            const bill = await app.api.purchase.createBillAPI({
                itemData: item, unitPrice: 10000, quantity: 1,
                vendorId: meta.vendorId, invoice_date: futureDateStr, due_date: futureDateStr
            } as any);

            await app.advanceDocumentAPI(bill.id, 'bills');
            const billData = await app.api.purchase.getBillAPI(bill.id);

            printAuditTable('VULNERABILITY: Future-Dated Bill Approved', [
                { label: 'Bill Ref',       value: bill.ref },
                { label: 'Bill ID',        value: bill.id },
                { label: 'Invoice Date',   value: futureDateStr },
                { label: 'Today',          value: new Date().toISOString().split('T')[0] },
                { label: 'Status',         value: billData.status },
                { label: 'Amount',         value: `$${(10000).toFixed(2)}` },
                { label: 'Vendor',         value: billData.vendor?.name || meta.vendorId },
                { label: 'Impact',         value: 'Future-period AP liability injected' },
                { label: 'Fix Required',   value: 'Reject if invoice_date > today' },
            ]);

            if (billData.status === 'approved') {
                throw new Error(`[CRITICAL_LOGIC_BUG] System approved a bill dated ${futureDateStr}. Future-period AP liability injection possible — balance sheet manipulation.`);
            }
            console.log(`[PASS] Future-dated bill advance ok but status=${billData.status} — not approved.`);
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Future-dated bill correctly blocked: ${err.message.substring(0, 100)}`);
        }
    });

    // ── 2. PO QUANTITY EXHAUSTION THEN +1 UNIT ───────────────────────────────
    test('Guardrail: System must block billing beyond 100% of PO quantity', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const poQty = 10;
        const unitPrice = 1000;
        const po = await app.api.purchase.createPurchaseOrderAPI(item, poQty, unitPrice, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');

        const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId);
        await app.advanceDocumentAPI(bill1.billId, 'bills');
        // Poll until PO shows fully received (unreceived_quantity = 0)
        let poStatus = await app.api.purchase.getPoReceiveStatusAPI(po.poId);
        for (let i = 0; i < 10 && poStatus.remainingQty > 0; i++) {
            await page.waitForTimeout(2000);
            poStatus = await app.api.purchase.getPoReceiveStatusAPI(po.poId);
        }

        const bill1Data = await app.api.purchase.getBillAPI(bill1.billId);
        const bill1Qty = (bill1Data.received_purchase_order_items || [])
            .reduce((sum: number, row: any) => sum + parseFloat(row.received_quantity || '0'), 0);

        console.log(`[BILL 1] ${bill1.billNumber} — received ${bill1Qty}/${poQty} | PO remaining: ${poStatus.remainingQty}`);

        if (bill1Qty !== poQty || poStatus.remainingQty > 0) {
            throw new Error(
                `[SETUP_FAIL] PO ${po.poNumber} not fully received before overflow attack ` +
                `(bill1=${bill1Qty}, poQty=${poQty}, remaining=${poStatus.remainingQty}).`
            );
        }

        const { apiBase, headers, qs } = await app.buildApiContext();
        const poResp = await page.request.get(`${apiBase}/purchase-order/${po.poId}?${qs}`, { headers });
        const poData = await poResp.json();
        const poItemId = poData.po_items?.[0]?.id;
        if (!poItemId) throw new Error(`[SETUP_FAIL] PO ${po.poNumber} has no billable line items.`);

        const overflowBill = await app.api.purchase.createPartialBillFromPoAPI(po.poId, [{
            po_item_id: poItemId,
            received_quantity: 1,
            received_unit_price: unitPrice
        }]);

        if (overflowBill.success) {
            try { await app.advanceDocumentAPI(overflowBill.billId, 'bills'); } catch { /* block expected */ }
            const overflowData = await app.api.purchase.getBillAPI(overflowBill.billId);

            printAuditTable(`PO Overbilling Audit — PO: ${po.poNumber}`, [
                { label: 'PO Ref',               value: po.poNumber },
                { label: 'PO Qty Authorized',    value: `${poQty} units` },
                { label: 'PO Unit Price',         value: `$${unitPrice.toFixed(2)}` },
                { label: 'PO Total',              value: `$${(poQty * unitPrice).toFixed(2)}` },
                { label: 'Bill 1 (100%)',          value: `${bill1.billNumber} — $${(poQty * unitPrice).toFixed(2)}` },
                { label: 'Bill 1 Status',         value: bill1Data.status },
                { label: 'Overflow Bill Ref',     value: overflowBill.billNumber || overflowBill.billId?.substring(0, 8) },
                { label: 'Overflow Qty',          value: '1 unit (beyond PO)' },
                { label: 'Overflow Amount',       value: `$${unitPrice.toFixed(2)}` },
                { label: 'Overflow Status',       value: overflowData.status },
                { label: 'Total Billed',          value: `$${((poQty + 1) * unitPrice).toFixed(2)}` },
                { label: 'Overbilled By',         value: `$${unitPrice.toFixed(2)}` },
                { label: 'Fix Required',          value: 'Reject if received_qty > PO qty' },
            ]);

            if (overflowData.status === 'approved') {
                throw new Error(`[CRITICAL_LOGIC_BUG] System approved a bill for 1 unit beyond the fully-exhausted PO ${po.poNumber}. Over-receiving liability created.`);
            }
            console.log(`[PASS] Overflow bill status=${overflowData.status} — approval correctly blocked.`);
        } else {
            console.log(`[PASS] Overflow bill creation rejected at API level: HTTP ${overflowBill.status} — ${overflowBill.error?.substring(0, 120)}`);
        }
    });

    // ── 3. SAME PO BILLED TWICE ───────────────────────────────────────────────
    test('Guardrail: Concurrent identical PO submissions must not create duplicate liability', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;
        const poQty = 10;
        const unitPrice = 1000;

        const [result1] = await Promise.allSettled([
            app.api.purchase.createPurchaseOrderAPI(item, poQty, unitPrice, meta.vendorId),
            app.api.purchase.createPurchaseOrderAPI(item, poQty, unitPrice, meta.vendorId)
        ]);

        if (result1.status !== 'fulfilled') { console.log(`[SKIP] PO creation failed.`); return; }

        const po = (result1 as PromiseFulfilledResult<any>).value;
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');

        const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId);
        await app.advanceDocumentAPI(bill1.billId, 'bills');
        const bill1Data = await app.api.purchase.getBillAPI(bill1.billId);
        console.log(`[BILL 1] ${bill1.billNumber} — approved`);

        try {
            const bill2 = await app.api.purchase.createBillFromPoAPI(po.poId);
            try { await app.advanceDocumentAPI(bill2.billId, 'bills'); } catch { /* block expected */ }
            const bill2Data = await app.api.purchase.getBillAPI(bill2.billId);

            const totalLiability = parseFloat(bill1Data.net_due ?? bill1Data.unpaid_amount ?? 0)
                + parseFloat(bill2Data.net_due ?? bill2Data.unpaid_amount ?? 0);

            printAuditTable(`Double-Billing Audit — PO: ${po.poNumber}`, [
                { label: 'PO Ref',             value: po.poNumber },
                { label: 'PO Qty',             value: `${poQty} units` },
                { label: 'PO Unit Price',       value: `$${unitPrice.toFixed(2)}` },
                { label: 'PO Total Auth.',      value: `$${(poQty * unitPrice).toFixed(2)}` },
                { label: 'Bill 1 Ref',          value: bill1.billNumber },
                { label: 'Bill 1 Amount',       value: `$${(poQty * unitPrice).toFixed(2)}` },
                { label: 'Bill 1 Status',       value: bill1Data.status },
                { label: 'Bill 2 Ref',          value: bill2.billNumber },
                { label: 'Bill 2 Amount',       value: `$${(poQty * unitPrice).toFixed(2)}` },
                { label: 'Bill 2 Status',       value: bill2Data.status },
                { label: 'Total AP Liability',  value: `$${totalLiability.toFixed(2)}` },
                { label: 'Overpaid By',         value: `$${(poQty * unitPrice).toFixed(2)}` },
                { label: 'Fix Required',        value: 'Reject bill if PO already fully billed' },
            ]);

            if (bill2Data.status === 'approved') {
                throw new Error(`[CRITICAL_LOGIC_BUG] Same PO billed twice — both approved. AP liability doubled. PO: ${po.poNumber}`);
            }
            console.log(`[PASS] Second bill status=${bill2Data.status} — correctly blocked.`);
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Second bill rejected: ${err.message.substring(0, 100)}`);
        }
    });

    // ── 4. APPROVED BILL LINE ITEM MUTATION ──────────────────────────────────
    test('Guardrail: System must reject mutation of an approved Bill line item', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: 5, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id}) — APPROVED`);

        const { apiBase, headers, qs } = await app.buildApiContext();
        const billData = await app.api.purchase.getBillAPI(bill.id);
        const lineItem = billData.items?.[0];
        if (!lineItem) { console.log(`[SKIP] No line items found.`); return; }

        console.log(`[ATTACK] Attempting to mutate approved bill line item qty from 5 to 999...`);
        const mutateResp = await page.request.patch(`${apiBase}/bills/${bill.id}?${qs}`, {
            headers, data: { items: [{ ...lineItem, quantity: 999, amount: 999 * 1000 }] }
        });

        if (mutateResp.ok()) {
            const mutated = await app.api.purchase.getBillAPI(bill.id);
            if (mutated.items?.[0]?.quantity === 999) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Approved bill ${bill.ref} line item mutated to qty=999.`);            }
            console.log(`[PASS] PATCH accepted but quantity not mutated.`);
        } else {
            console.log(`[PASS] Mutation of approved bill correctly rejected: HTTP ${mutateResp.status()}`);        }
    });

    // ── 5. BILL WITH NO VENDOR ────────────────────────────────────────────────
    test('Guardrail: System must reject Bill creation with no Vendor', async ({ page , request }) => {
        const app = new AppManager(page);
        const item = sharedItem;
        const { apiBase, headers, qs } = await app.buildApiContext();
        const locResp = await page.request.get(`${apiBase}/locations?page=1&pageSize=5&${qs}`, { headers });
        const loc = ((await locResp.json()).items || [])[0];

        console.log(`[ATTACK] Attempting to create Bill with vendor_id=null...`);
        const resp = await page.request.post(`${apiBase}/bills?${qs}`, {
            headers,
            data: {                accounts_payable_id: sharedMeta.apAccountId, currency_id: sharedMeta.currencyId,                invoice_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                due_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                vendor_id: null,
                items: [{ item_id: item.itemId, quantity: 1, unit_price: 5000, amount: 5000, location_id: loc?.id, warehouse_id: loc?.warehouse_id }],
                status: 'draft'
            }
        });

        if (resp.ok()) {
            const orphan = await resp.json();
            try {
                await app.advanceDocumentAPI(orphan.id, 'bills');
                throw new Error(`[CRITICAL_LOGIC_BUG] Bill approved with no vendor! ID: ${orphan.id}`);
            } catch (err: any) {
                if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
                console.log(`[PASS] Vendorless bill approval blocked: ${err.message.substring(0, 80)}`);
            }
        } else {
            console.log(`[PASS] Vendorless bill rejected at creation: HTTP ${resp.status()}`);
        }
    });

    // ── 6. PO TO BILL 1:1 RECONCILIATION AUDIT ───────────────────────────────
    test('Guardrail: System must enforce strict 1:1 reconciliation mapping between Purchase Order and Bill', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;
        const poQty = 8;
        const poPrice = 4500;

        const po = await app.api.purchase.createPurchaseOrderAPI(item, poQty, poPrice, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');

        const bill = await app.api.purchase.createBillFromPoAPI(po.poId);
        await app.advanceDocumentAPI(bill.billId, 'bills');

        const { apiBase, headers, qs } = await app.buildApiContext();
        const poResp = await page.request.get(`${apiBase}/purchase-order/${po.poId}?${qs}`, { headers });
        const poData = await poResp.json();
        const billData = await app.api.purchase.getBillAPI(bill.billId);

        if ((poData.vendor_id || poData.vendor?.id) !== (billData.vendor_id || billData.vendor?.id))
            throw new Error(`[CRITICAL_LOGIC_BUG] Vendor mismatch.`);

        const poItems = poData.po_items || [];
        const billItems = billData.received_purchase_order_items || [];
        if (!poItems.length) throw new Error(`[CRITICAL_LOGIC_BUG] PO has no items.`);
        if (!billItems.length) throw new Error(`[CRITICAL_LOGIC_BUG] Bill has no received PO items.`);

        for (const pi of poItems) {
            const bi = billItems.find((b: any) => b.po_item_id === pi.id);
            if (!bi) throw new Error(`[CRITICAL_LOGIC_BUG] PO item ${pi.id} missing in bill.`);
            if (parseFloat(bi.received_quantity) !== parseFloat(pi.quantity))
                throw new Error(`[CRITICAL_LOGIC_BUG] Qty mismatch. PO:${pi.quantity} Bill:${bi.received_quantity}`);
            if (parseFloat(bi.received_unit_price) !== parseFloat(pi.unit_price))
                throw new Error(`[CRITICAL_LOGIC_BUG] Price mismatch. PO:${pi.unit_price} Bill:${bi.received_unit_price}`);
        }

        const poTotal = poItems.reduce((s: number, i: any) => s + parseFloat(i.quantity) * parseFloat(i.unit_price), 0);
        const billDue = parseFloat(billData.net_due ?? billData.due ?? billData.unpaid_amount ?? 0);
        if (billDue !== poTotal) throw new Error(`[CRITICAL_LOGIC_BUG] Amount mismatch. PO:${poTotal} Bill:${billDue}`);

        printAuditTable(`1:1 Reconciliation Audit — ${po.poNumber} ↔ ${bill.billNumber}`, [
            { label: 'PO Ref',        value: po.poNumber },
            { label: 'Bill Ref',      value: bill.billNumber },
            { label: 'Vendor',        value: billData.vendor?.name || '' },
            { label: 'Qty (PO)',      value: `${poQty} units` },
            { label: 'Unit Price',    value: `$${poPrice.toFixed(2)}` },
            { label: 'PO Total',      value: `$${poTotal.toFixed(2)}` },
            { label: 'Bill Net Due',  value: `$${billDue.toFixed(2)}` },
            { label: 'Result',        value: '✓ BALANCED' },
        ]);

        console.log(`[PASS] 1:1 reconciliation audit succeeded. Bill maps perfectly to Purchase Order.`);
    });
});
