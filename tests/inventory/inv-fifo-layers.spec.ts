/// <reference types="node" />
import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';


/**
 * FIFO Layer Integrity Audit
 *
 * Scenario A — Received Purchase Order:
 *   1. Create item (Pencil) with initial batch: 10 units @ $15  → import layer
 *   2. Create PO: 5 units @ $25
 *   3. Create Bill from PO:
 *      - 2 bill items @ $40  (direct bill line)
 *      - 3 received PO items @ $25
 *   4. Approve bill → verify 3 FIFO layers, qty=15, cost=$15 (oldest layer)
 *      layers: import(10@15) + bill-direct(2@40) + received-PO(3@25)
 *
 * Scenario B — Released Sales Order:
 *   Setup: build same 3-layer item (15 units)
 *   1. Create SO: 10 units @ $15
 *   2. Create Invoice:
 *      - 4 direct invoice items
 *      - 9 released SO items
 *   3. Approve invoice → 13 units consumed FIFO order → remaining qty=2 @ $25
 *      remaining layers: import(0), bill@40(0), received-PO@25(remaining=2)
 *      consumed on invoice items:      [{qty:4,  doc_type:'import'}]
 *      consumed on released SO items:  [{qty:6,  doc_type:'import'},
 *                                       {qty:2,  doc_type:'bill'  },
 *                                       {qty:1,  doc_type:'bill'  }]
 */
test.describe('FIFO Layer Integrity @inventory @fifo @regression @full', () => {
    test.setTimeout(480000);

    const getHeaders = async (app: AppManager) => ({
        'Authorization': `Bearer ${await app._getAuthToken()}`,
        'x-company': process.env.BEFFA_COMPANY as string,
        'Content-Type': 'application/json',
    });
    const qp = () =>
        `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

    // ── shared setup helper: create item + build 3 FIFO layers ───────────────
    async function buildThreeLayerItem(page: any, app: AppManager, suffix: string) {
        const h = await getHeaders(app);
        const p = qp();
        const ts = Date.now();
        const envMeta  = await app.api.inventory.discoverMetadataAPI();
        const salesMeta = await app.api.sales.discoverMetadataAPI();
        const currencyId = salesMeta.currencyId;

        // 1. Create FIFO item with initial import batch: 10 @ $15
        const freshItem = await app.api.inventory.createFreshItemWithStockAPI({
            name: `Pencil-${suffix}-${ts}`,
            cost_method_code: 'FIFO',
            quantity: 10,
            unit_cost: 15,
            locationId: envMeta.locationId,
            warehouseId: envMeta.warehouseId,
        });
        const itemId = freshItem.id;
        console.log(`[SETUP] Item: ${freshItem.itemName} (${itemId})`);

        // 2. Discover vendor + AP account
        const vendorJson = await (await page.request.get(
            `${app.apiBase}/vendors?page=1&pageSize=10&${p}`, { headers: h }
        )).json();
        const vendor = (vendorJson.data || vendorJson.items || [])[0];
        expect(vendor, 'A vendor must exist').toBeTruthy();

        const acctJson = await (await page.request.get(
            `${app.apiBase}/accounts?page=1&pageSize=50&${p}`, { headers: h }
        )).json();
        const accounts: any[] = acctJson.items || acctJson.data || [];
        const apAccount = accounts.find((a: any) => /payable/i.test(a.account_type || '')) || accounts[0];
        const glAccount = accounts.find((a: any) => /expense/i.test(a.account_type || '')) || accounts[1] || accounts[0];

        // 3. Create PO: 5 units @ $25
        const poResp = await page.request.post(`${app.apiBase}/purchase-orders?${p}`, {
            headers: h,
            data: {                vendor_id: vendor.id,
                accounts_payable_id: apAccount?.id,
                currency_id: currencyId,                po_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                delivery_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                status: 'draft',
                purchase_type_id: 4,
                po_items: [{
                    item_id: itemId,
                    quantity: 5,
                    unit_price: 25,
                    general_ledger_account_id: glAccount?.id,
                    warehouse_id: envMeta.warehouseId,
                    location_id: envMeta.locationId,
                    description: 'purchase order item for pencil x5 @25',
                }],
            },
        });
        expect(poResp.ok(), `PO creation failed: ${await poResp.text()}`).toBe(true);
        const poId = (await poResp.json()).id;
        await app.advanceDocumentAPI(poId, 'purchase-orders');

        const poDetailJson = await (await page.request.get(
            `${app.apiBase}/purchase-order/${poId}?${p}`, { headers: h }
        )).json();
        let poItemId = (poDetailJson.po_items || [])[0]?.id;
        if (!poItemId) {
            const subResp = await page.request.get(`${app.apiBase}/purchase-orders/${poId}/items?${p}`, { headers: h });
            if (subResp.ok()) {
                const subData = await subResp.json();
                poItemId = (subData.data || subData.items || [])[0]?.id;
            }
        }
        expect(poItemId, 'PO item id must be resolvable').toBeTruthy();

        // 4. Create Bill: 2 direct bill items @$40 + 3 received-PO items @$25
        const billResp = await page.request.post(`${app.apiBase}/bills?${p}`, {
            headers: h,
            data: {
                vendor_id: vendor.id,
                accounts_payable_id: apAccount?.id,
                currency_id: currencyId,
                purchase_order_id: poId,
                invoice_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                due_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                status: 'draft',
                items: [{
                    item_id: itemId,
                    quantity: 2,
                    unit_price: 40,
                    general_ledger_account_id: glAccount?.id,
                    warehouse_id: envMeta.warehouseId,
                    location_id: envMeta.locationId,
                    description: 'pencil bill item x2 @40',
                }],
                received_purchase_order_items: [{
                    po_item_id: poItemId,
                    received_quantity: 3,
                    received_unit_price: 25,
                }],
            },
        });
        expect(billResp.ok(), `Bill creation failed: ${await billResp.text()}`).toBe(true);
        const billId = (await billResp.json()).id;
        await app.advanceDocumentAPI(billId, 'bills');
        await app.api.inventory.pollStockAPI(itemId, 15, envMeta.locationId);
        console.log(`[SETUP] Layers built: import(10@$15) + bill(2@$40) + received-PO(3@$25) → qty=15`);

        return { itemId, billId, poItemId, envMeta, salesMeta, h, p };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCENARIO A: Received PO → FIFO layer accumulation
    // ─────────────────────────────────────────────────────────────────────────
    test('FIFO-A: Approved bill via PO receipt creates correct FIFO layers', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        const { itemId, envMeta, h, p } = await buildThreeLayerItem(page, app, 'A');

        // ── Verify item state after bill approval ─────────────────────────────
        const itemResp = await page.request.get(
            `${app.apiBase}/inventory-item/${itemId}?${p}`, { headers: h }
        );
        expect(itemResp.ok()).toBe(true);
        const itemData = await itemResp.json();

        const qty  = itemData.quantity ?? itemData.current_stock ?? itemData.stock;
        const cost = Number(itemData.unit_cost ?? itemData.cost ?? 0);
        console.log(`[AUDIT-A] qty=${qty} (exp:15) | cost=$${cost} (exp:$15)`);
        expect(qty).toBe(15);
        expect(cost).toBe(15);

        const layers: any[] = itemData.fifo_layers || itemData.layers || itemData.costing_layers || [];
        const fmtLayer = (l: any) => `${l.doc_type}(orig:${l.original_qty} rem:${l.remaining_qty} @$${l.unit_cost} id:${l.doc_id?.slice(0,8)})`;
        console.log(`[AUDIT-A] Layers: ${layers.map(fmtLayer).join(' | ')}`);

        // import layer: 10 @ $15, fully intact
        const importL = layers.find((l: any) => l.doc_type === 'import');
        expect(importL, 'Import layer must exist').toBeTruthy();
        expect(Number(importL.unit_cost)).toBe(15);
        expect(importL.original_qty).toBe(10);
        expect(importL.remaining_qty ?? importL['remaining_q ty']).toBe(10);

        const billLayers = layers.filter((l: any) => l.doc_type === 'bill');
        expect(billLayers.length).toBe(2);

        // bill-direct layer: 2 @ $40
        const billDirect = billLayers.find((l: any) => Number(l.unit_cost) === 40);
        expect(billDirect, 'Bill direct layer @$40 must exist').toBeTruthy();
        expect(billDirect.original_qty).toBe(2);
        expect(billDirect.remaining_qty).toBe(2);

        // received-PO layer: 3 @ $25
        const receivedPo = billLayers.find((l: any) => Number(l.unit_cost) === 25);
        expect(receivedPo, 'Received-PO layer @$25 must exist').toBeTruthy();
        expect(receivedPo.original_qty).toBe(3);
        expect(receivedPo.remaining_qty).toBe(3);

        console.log(`[PASS] FIFO-A ✓ import(10@$15,rem:10) | bill(2@$40,rem:2) | received-PO(3@$25,rem:3)`);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // SCENARIO B: Released SO → FIFO layer consumption
    // ─────────────────────────────────────────────────────────────────────────
    test('FIFO-B: Approved invoice via SO release drains FIFO layers in order', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        const { itemId, envMeta, salesMeta, h, p } = await buildThreeLayerItem(page, app, 'B');

        // ── STEP 1: Create Sales Order — 10 units @ $15 ───────────────────────
        console.log(`[STEP 1] SO: 10 units @ $15`);
        const soResp = await page.request.post(`${app.apiBase}/sales-orders?${p}`, {
            headers: h,
            data: {
                customer_id: salesMeta.customerId,
                accounts_receivable_id: salesMeta.arAccountId,
                currency_id: salesMeta.currencyId,
                so_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                delivery_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                status: 'draft',
                so_items: [{
                    item_id: itemId,
                    quantity: 10,
                    unit_price: 15,
                    general_ledger_account_id: salesMeta.salesAccountId,
                    warehouse_id: envMeta.warehouseId,
                    location_id: envMeta.locationId,
                }],
            },
        });
        expect(soResp.ok(), `SO creation failed: ${await soResp.text()}`).toBe(true);
        const soJson = await soResp.json();
        const soId = soJson.id;
        const soItemId = (soJson.so_items || [])[0]?.id;
        expect(soId).toBeTruthy();
        expect(soItemId).toBeTruthy();
        console.log(`[PASS] SO: ${soJson.so_number || soId} | item:${soItemId?.slice(0,8)}`);

        await app.advanceDocumentAPI(soId, 'sales-orders');

        // ── STEP 2: Create Invoice — 4 direct + 9 released SO items ──────────
        console.log(`[STEP 2] Invoice: 4 direct + 9 released SO items`);
        const invoiceResp = await page.request.post(`${app.apiBase}/invoices?${p}`, {
            headers: h,
            data: {
                customer_id: salesMeta.customerId,
                accounts_receivable_id: salesMeta.arAccountId,
                currency_id: salesMeta.currencyId,
                invoice_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                due_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                status: 'draft',
                items: [{
                    item_id: itemId,
                    quantity: 4,
                    unit_price: 15,
                    warehouse_id: envMeta.warehouseId,
                    location_id: envMeta.locationId,
                    general_ledger_account_id: salesMeta.salesAccountId,
                    amount: 60,
                }],
                released_sales_order_items: [{
                    so_item_id: soItemId,
                    released_quantity: 9,
                    warehouse_id: envMeta.warehouseId,
                    location_id: envMeta.locationId,
                }],
            },
        });
        expect(invoiceResp.ok(), `Invoice creation failed: ${await invoiceResp.text()}`).toBe(true);
        const invoiceJson = await invoiceResp.json();
        const invoiceId = invoiceJson.id;
        expect(invoiceId).toBeTruthy();
        console.log(`[PASS] Invoice: ${invoiceJson.invoice_number || invoiceId} (${invoiceId?.slice(0,8)})`);

        await app.advanceDocumentAPI(invoiceId, 'invoices');

        // 4 direct + 9 released = 13 consumed from 15 → remaining = 2
        await app.api.inventory.pollStockAPI(itemId, 2, envMeta.locationId);

        // ── Verify remaining item state ───────────────────────────────────────
        const itemResp = await page.request.get(
            `${app.apiBase}/inventory-item/${itemId}?${p}`, { headers: h }
        );
        expect(itemResp.ok()).toBe(true);
        const itemData = await itemResp.json();

        const qty  = itemData.quantity ?? itemData.current_stock ?? itemData.stock;
        const cost = Number(itemData.unit_cost ?? itemData.cost ?? 0);
        console.log(`[AUDIT-B] qty=${qty} (exp:2) | cost=$${cost} (exp:$25)`);
        expect(qty).toBe(2);
        expect(cost).toBe(25);

        const layers: any[] = itemData.fifo_layers || itemData.layers || itemData.costing_layers || [];
        const fmtLayer = (l: any) => `${l.doc_type}(orig:${l.original_qty} rem:${l.remaining_qty} @$${l.unit_cost})`;
        console.log(`[AUDIT-B] Layers: ${layers.map(fmtLayer).join(' | ')}`);

        // import layer → remaining = 0
        const importL = layers.find((l: any) => l.doc_type === 'import');
        if (importL) {
            expect(importL.remaining_qty ?? importL['remaining_q ty']).toBe(0);
        }
        // bill-direct layer @$40 → remaining = 0
        const billDirect = layers.find((l: any) => l.doc_type === 'bill' && Number(l.unit_cost) === 40);
        if (billDirect) {
            expect(billDirect.remaining_qty).toBe(0);
        }
        // received-PO layer @$25 → original=3, remaining=2
        const receivedPo = layers.find((l: any) => l.doc_type === 'bill' && Number(l.unit_cost) === 25);
        if (receivedPo) {
            expect(receivedPo.original_qty).toBe(3);
            expect(receivedPo.remaining_qty).toBe(2);
        }

        // ── Verify fifo_consumed_layers on invoice detail ─────────────────────
        const invDetailResp = await page.request.get(
            `${app.apiBase}/invoices/${invoiceId}?${p}`, { headers: h }
        );
        if (invDetailResp.ok()) {
            const invDetail = await invDetailResp.json();
            const invItems: any[]     = invDetail.items || invDetail.invoice_items || [];
            const releasedItems: any[] = invDetail.released_sales_order_items || [];

            // Invoice items consumed: [{qty:4, doc_type:'import'}]
            const invConsumed: any[] = invItems[0]?.fifo_consumed_layers || [];
            const fmtConsumed = (c: any) => `${c.doc_type}(qty:${c.qty} id:${c.doc_id?.slice(0,8)})`;
            console.log(`[AUDIT-B] Invoice consumed: ${invConsumed.map(fmtConsumed).join(' | ') || 'none'}`);
            if (invConsumed.length > 0) {
                const c = invConsumed.find((x: any) => x.doc_type === 'import');
                expect(c, 'Invoice items must consume from import layer').toBeTruthy();
                expect(c.qty).toBe(4);
            }

            const soConsumed: any[] = releasedItems[0]?.fifo_consumed_layers || [];
            console.log(`[AUDIT-B] SO release consumed: ${soConsumed.map(fmtConsumed).join(' | ') || 'none'}`);
            if (soConsumed.length > 0) {
                const fromImport = soConsumed.find((x: any) => x.doc_type === 'import');
                expect(fromImport, 'SO release must consume from import layer').toBeTruthy();
                expect(fromImport.qty).toBe(6);

                const fromBill2 = soConsumed.find((x: any) => x.doc_type === 'bill' && x.qty === 2);
                expect(fromBill2, 'SO release must consume 2 from bill @$40 layer').toBeTruthy();

                const fromBill1 = soConsumed.find((x: any) => x.doc_type === 'bill' && x.qty === 1);
                expect(fromBill1, 'SO release must consume 1 from received-PO @$25 layer').toBeTruthy();
            }
        }

        console.log(`[PASS] FIFO-B ✓ import(10→0) | bill@$40(2→0) | received-PO@$25(3→2) | remaining:2@$25`);
    });
});
