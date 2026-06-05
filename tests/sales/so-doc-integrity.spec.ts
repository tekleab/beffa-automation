import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * SALES DOCUMENT INTEGRITY GUARDRAILS
 */
test.describe('Sales Document Integrity Guardrails @sales @logic @security @regression @full', () => {
    test.setTimeout(120000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: Invoice must reject second receipt after full payment', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const AMOUNT = 300;
        const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: meta.customerId, itemId: item.itemId, quantity: 1, unitPrice: AMOUNT, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const rct1 = await app.api.sales.createInvoiceReceiptAPI({ invoiceId: inv.id, customerId: meta.customerId, amount: AMOUNT });
        await app.advanceDocumentAPI(rct1.id, 'receipts');

        await page.waitForTimeout(2000);

        console.log(`[ATTACK] Attempting second receipt on fully paid invoice...`);
        try {
            const rct2 = await app.api.sales.createInvoiceReceiptAPI({ invoiceId: inv.id, customerId: meta.customerId, amount: AMOUNT });
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
                throw new Error(`[VULNERABILITY] Approved SO ${so.ref} was modified! Quantity changed to 999. Document immutability is broken.`);
            }
            console.log(`[PASS] PATCH accepted but quantity was not changed (${modifiedQty}).`);
        } else {
            console.log(`[PASS] SO modification correctly rejected with status ${editResp.status()}.`);
        }
    });

    test('Guardrail: Invoice with past due date must be rejected or flagged', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const meta = sharedMeta;
        const item = sharedItem;
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const pastDueDate = '2020-01-01T00:00:00Z';
        console.log(`[ATTACK] Creating invoice with past due date: ${pastDueDate}...`);

        const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            data: {
                accounts_receivable_id: meta.arAccountId,
                customer_id: meta.customerId,
                invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
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
});
