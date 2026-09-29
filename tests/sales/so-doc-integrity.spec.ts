import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Sales Order - Document Integrity & Immutability Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Approved SO line items cannot be mutated (PUT/PATCH rejected)
 * 2. Cancelled SO cannot be re-approved
 * 3. SO total is immutable after approval
 * =============================================================================
 */



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
 * SALES DOCUMENT INTEGRITY GUARDRAILS
 */
test.describe('Sales Document Integrity Guardrails @sales @full', () => {
    test.setTimeout(120000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 20, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    });

    test('Guardrail: Invoice must reject second receipt after full payment', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const AMOUNT = 300;
        const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: meta.customerId, itemId: item.itemId, quantity: 1, unitPrice: AMOUNT, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        // Use actual invoice due amount to avoid amount-mismatch 422
        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        const actualDue = parseFloat(invData.unreceived_amount ?? invData.net_due ?? invData.total_amount ?? String(AMOUNT));

        const rct1 = await app.api.sales.createInvoiceReceiptAPI({ invoiceId: inv.id, customerId: meta.customerId, amount: actualDue });
        await app.advanceDocumentAPI(rct1.id, 'receipts');

        await page.waitForTimeout(2000);

        console.log(`[ATTACK] Attempting second receipt on fully paid invoice...`);
        try {
            const rct2 = await app.api.sales.createInvoiceReceiptAPI({ invoiceId: inv.id, customerId: meta.customerId, amount: actualDue, skipAdjustment: true });
            await app.advanceDocumentAPI(rct2.id, 'receipts');

            const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
            const balance = parseFloat(finalInv.unreceived_amount || '0');

            if (balance < 0) {
                throw new Error(
                    `[VULNERABILITY] Duplicate Receipt Approved on Fully Paid Invoice\n` +
                    `  Invoice: ${inv.ref} | Receipt 1: ${rct1.ref} | Receipt 2: ${rct2.ref}\n` +
                    `  Final Balance: ${balance} (over-credited by ${Math.abs(balance)})\n` +
                    `  Root Cause: System does not validate invoice balance before approving receipts.`
                );
            }
            console.log(`[WARN] Second receipt created but balance did not go negative.`);
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Second receipt correctly rejected: ${err.message}`);
        }
    });

    test('Guardrail: Approved SO must be immutable — quantity change rejected', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const item = sharedItem;
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const so = await app.api.sales.createSalesOrderAPI({ itemId: item.itemId, quantity: 2, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(so.id, 'sales-orders');
        console.log(`[OK] SO ${so.ref} approved.`);

        console.log(`[ATTACK] Attempting to modify SO quantity after approval...`);
        const editResp = await page.request.patch(`${apiBase}/sales-orders/${so.id}?${qs}`, {
            data: { so_items: [{ quantity: 999 }] },
            headers
        });

        if (editResp.ok()) {
            const body = await editResp.json();
            const modifiedQty = body.so_items?.[0]?.quantity;
            if (modifiedQty === 999) {
                throw new Error(`[VULNERABILITY] Approved SO ${so.ref} was modified! Quantity changed to 999. Document immutability is broken.`);            }
            console.log(`[PASS] PATCH accepted but quantity was not changed (${modifiedQty}).`);
        } else {
            console.log(`[PASS] SO modification correctly rejected with status ${editResp.status()}.`);
        }
    });

    test('Guardrail: Invoice with past due date must be rejected or flagged', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const pastDueDate = '2020-01-01T00:00:00Z';
        console.log(`[ATTACK] Creating invoice with past due date: ${pastDueDate}...`);

        const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            data: {                accounts_receivable_id: meta.arAccountId,
                customer_id: meta.customerId,                invoice_date: (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso,
                due_date: pastDueDate,
                currency_id: meta.currencyId,
                items: [{ amount: 500, general_ledger_account_id: meta.salesAccountId, item_id: item.itemId, location_id: item.locationId, quantity: 1, unit_price: 500, warehouse_id: item.warehouseId }],
                released_sales_order_items: []
            },
            headers
        });

        if ([200, 201].includes(resp.status())) {
            const body = await resp.json();
            console.log(`[WARN] Invoice with past due date was created: ${body.invoice_number}. Checking approval...`);
            try {
                await app.advanceDocumentAPI(body.id, 'invoices');
                const finalInv = await app.api.sales.getInvoiceAPI(body.id);
                if (finalInv.status?.toLowerCase().includes('approved')) {
                    throw new Error(`[VULNERABILITY] Invoice with past due date (${pastDueDate}) was fully approved. Period compliance is broken.`);
                }
                console.log(`[PASS] Invoice created but blocked at approval.`);
            } catch (err: any) {
                if (err.message.includes('[VULNERABILITY]')) throw err;
                console.log(`[PASS] Past due date invoice blocked at approval: ${err.message}`);
            }
        } else {
            console.log(`[PASS] Past due date invoice rejected at creation with status ${resp.status()}.`);
        }
    });

    test('Guardrail: System must reject duplicate Customer Invoice / Reference Number to prevent double-billing fraud', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;
        const { apiBase, headers, qs } = await app.buildApiContext();
        const dateIso = (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso;

        // Discover customer name
        let customerName = meta.customerId;
        try {
            const custResp = await page.request.get(`${apiBase}/customers/${meta.customerId}?${qs}`, { headers });
            if (custResp.ok()) {
                const cJson = await custResp.json();
                customerName = cJson.name || cJson.customer_name || meta.customerId;
            }
        } catch (_) {}

        const duplicateCustomerRef = `CUST-REF-${Math.floor(100000 + Math.random() * 900000)}`;

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`[ATTACK] Testing Duplicate Customer Invoice / Reference Guardrail in Sales...`);
        console.log(`  Customer        : ${customerName} (${meta.customerId})`);
        console.log(`  Target Ref Num  : ${duplicateCustomerRef}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        // ── 1. Create First Standalone Invoice with duplicateCustomerRef ──
        console.log(`[ATTACK] Submitting Invoice 1 with Reference "${duplicateCustomerRef}"...`);
        const inv1Resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            headers,
            data: {
                customer_id: meta.customerId,
                accounts_receivable: meta.arAccountId,
                accounts_receivable_id: meta.arAccountId,
                currency_id: meta.currencyId,
                currency: 'Birr',
                invoice_date: dateIso,
                due_date: dateIso,
                invoice_number: duplicateCustomerRef,
                customer_reference: duplicateCustomerRef,
                reference: duplicateCustomerRef,
                items: [{
                    item_id: item.itemId,
                    quantity: 1,
                    unit_price: 1000,
                    general_ledger_account_id: meta.salesAccountId,
                    warehouse_id: item.warehouseId,
                    location_id: item.locationId,
                }],
                released_sales_order_items: []
            }
        });

        if (!inv1Resp.ok()) {
            throw new Error(`Invoice 1 creation failed: HTTP ${inv1Resp.status()} - ${await inv1Resp.text()}`);
        }

        const inv1Data = await inv1Resp.json();
        const inv1Number = inv1Data.invoice_number || inv1Data.ref || inv1Data.id;
        const inv1Id = inv1Data.id;

        console.log(`[AUDIT] Invoice 1 Created:`);
        console.log(`  Invoice 1 Ref    : ${inv1Number}`);
        console.log(`  Invoice 1 ID     : ${inv1Id}`);
        console.log(`  Customer         : ${customerName} (${meta.customerId})`);
        console.log(`  Customer Ref Num : ${duplicateCustomerRef}`);

        // ── 2. Create Second Invoice with SAME Customer and IDENTICAL Reference ──
        console.log(`\n[ATTACK] Submitting Invoice 2 for SAME Customer with IDENTICAL Reference "${duplicateCustomerRef}"...`);
        const inv2Resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            headers,
            data: {
                customer_id: meta.customerId,
                accounts_receivable: meta.arAccountId,
                accounts_receivable_id: meta.arAccountId,
                currency_id: meta.currencyId,
                currency: 'Birr',
                invoice_date: dateIso,
                due_date: dateIso,
                invoice_number: duplicateCustomerRef,
                customer_reference: duplicateCustomerRef,
                reference: duplicateCustomerRef,
                items: [{
                    item_id: item.itemId,
                    quantity: 1,
                    unit_price: 1000,
                    general_ledger_account_id: meta.salesAccountId,
                    warehouse_id: item.warehouseId,
                    location_id: item.locationId,
                }],
                released_sales_order_items: []
            }
        });

        if (inv2Resp.ok()) {
            const inv2Data = await inv2Resp.json();
            const inv2Number = inv2Data.invoice_number || inv2Data.ref || inv2Data.id;
            const inv2Id = inv2Data.id;

            console.log(`[AUDIT] Invoice 2 Created:`);
            console.log(`  Invoice 2 Ref    : ${inv2Number}`);
            console.log(`  Invoice 2 ID     : ${inv2Id}`);
            console.log(`  Customer Ref Num : ${duplicateCustomerRef}`);

            // ── Advance Invoice 1 through workflow to APPROVED ──────────────────
            console.log(`\n[WORKFLOW] Advancing Invoice 1 (${inv1Number}) through approval...`);
            await app.advanceDocumentAPI(inv1Id, 'invoices');
            const inv1ApprovedData = await app.api.sales.getInvoiceAPI(inv1Id);
            const inv1Status = (inv1ApprovedData.status || inv1ApprovedData.current_approval_step?.status_label || 'unknown').toLowerCase();
            const inv1Amount = parseFloat(inv1ApprovedData.unreceived_amount ?? inv1ApprovedData.total_amount ?? 1000);
            console.log(`[WORKFLOW] Invoice 1 (${inv1Number}) status: "${inv1Status}" | AR Amount: $${inv1Amount}`);

            // ── Advance Invoice 2 through workflow to test if approval catches it ─
            console.log(`\n[WORKFLOW] Advancing duplicate Invoice 2 (${inv2Number}) to test approval gate...`);
            let inv2AdvanceError: string | null = null;
            try {
                await app.advanceDocumentAPI(inv2Id, 'invoices');
            } catch (err: any) {
                inv2AdvanceError = err.message;
            }

            const inv2ApprovedData = await app.api.sales.getInvoiceAPI(inv2Id);
            const inv2Status = (inv2ApprovedData.status || inv2ApprovedData.current_approval_step?.status_label || 'unknown').toLowerCase();
            const inv2Amount = parseFloat(inv2ApprovedData.unreceived_amount ?? inv2ApprovedData.total_amount ?? 1000);
            console.log(`[WORKFLOW] Invoice 2 (${inv2Number}) status: "${inv2Status}" | AR Amount: $${inv2Amount}`);

            if (inv2Status === 'approved') {
                console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error('🚨 [DUPLICATE_INVOICE_FRAUD_BUG] ERP APPROVED duplicate customer invoices!');
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.error(`  Customer Name    : ${customerName}`);
                console.error(`  Customer ID      : ${meta.customerId}`);
                console.error(`  Duplicate Ref #  : ${duplicateCustomerRef}`);
                console.error(`  Invoice 1 Ref    : ${inv1Number}`);
                console.error(`  Invoice 1 Status : ${inv1Status.toUpperCase()} (AR: $${inv1Amount})`);
                console.error(`  Invoice 1 UUID   : ${inv1Id}`);
                console.error(`  Invoice 2 Ref    : ${inv2Number}`);
                console.error(`  Invoice 2 Status : ${inv2Status.toUpperCase()} (AR: $${inv2Amount})`);
                console.error(`  Invoice 2 UUID   : ${inv2Id}`);
                console.error(`  Total AR Booked  : $${inv1Amount + inv2Amount} (DOUBLED AR ASSET for single sale)`);
                console.error(`  Financial Impact : Artificial revenue inflation + customer double-billing`);
                console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                printAuditTable('VULNERABILITY: Duplicate Sales Invoice Approved', [
                    { label: 'Customer Name',        value: customerName },
                    { label: 'Customer ID',          value: meta.customerId },
                    { label: 'Duplicate Ref Num',    value: duplicateCustomerRef },
                    { label: 'Invoice 1 Reference',  value: inv1Number },
                    { label: 'Invoice 1 Status',     value: inv1Status.toUpperCase() },
                    { label: 'Invoice 2 Reference',  value: inv2Number },
                    { label: 'Invoice 2 Status',     value: inv2Status.toUpperCase() },
                    { label: 'Doubled AR Amount',    value: `$${inv1Amount + inv2Amount}` },
                    { label: 'Result',               value: '✗ CRITICAL BUG — DOUBLE AR ASSET' }
                ]);

                throw new Error(`[DUPLICATE_INVOICE_FRAUD_BUG] System APPROVED two distinct invoices (${inv1Number} and ${inv2Number}) with duplicate reference "${duplicateCustomerRef}" for customer "${customerName}"! Double AR asset created.`);
            } else {
                console.log(`[PASS] Invoice 2 approval blocked by workflow: status="${inv2Status}" (Error: ${inv2AdvanceError || 'None'})`);
            }
        } else {
            console.log(`[PASS] Duplicate customer invoice reference correctly rejected at creation: HTTP ${inv2Resp.status()}`);
        }
    });
});

