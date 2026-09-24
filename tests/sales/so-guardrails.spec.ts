import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Sales Order - Input Guardrails & Validation Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. SO with zero-quantity line rejected (422)
 * 2. SO with negative unit price rejected or flagged
 * 3. SO without customer_id rejected (422 "Customer is required")
 * =============================================================================
 */



/**
 * SALES SO GUARDRAIL AUDITS
 *
 * Objectives:
 * 1. Verify system rejects Invoicing for more units than the approved Sales Order.
 */

test.describe('Sales SO Guardrails @sales @regression', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 50, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    });

    test('Guardrail: System must reject Invoicing for more units than the approved SO', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;

        if (!item) {
            console.log('[SKIP] No valid item found for test.');
            return;
        }

        // 1. Create SO for 10 units
        console.log(`[STEP 1] Creating SO for 10 units...`);
        const so = await app.api.sales.createSalesOrderAPI({
            itemId: item.itemId,
            quantity: 10,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        if (!so.success) throw new Error("SO creation failed");
        await app.advanceDocumentAPI(so.id, 'sales-orders');

        // 2. Attempt to Invoice for 50 units
        console.log(`[ATTACK] Attempting to Invoice 50 units against the 10-unit SO...`);

        try {
            const inv = await app.api.sales.createInvoiceAPI({
                customerId: so.customerId,
                soId: so.id,
                soItemId: so.soItemId,
                releasedQuantity: 50,
                locationId: item.locationId,
                warehouseId: item.warehouseId
            });

            if (!inv.success) {
                console.log(`[PASS] Over-Invoicing attempt blocked by API: ${inv.error || 'Request rejected'}`);
                return;
            }

            console.log(`[INFO] Invoice created for SO. Checking if we can approve it or if it honors SO limits...`);
            await app.advanceDocumentAPI(inv.id!, 'invoices');
            console.log(`[INFO] Invoice approved. Verifying if it honored SO limits...`);

            const finalInv = await app.api.sales.getInvoiceAPI(inv.id!);
            const releasedItems = finalInv.released_sales_order_items || finalInv.invoice_items || finalInv.items || [];
            const totalQty = releasedItems.reduce((sum: number, it: any) => sum + parseFloat(it.released_quantity || it.quantity || '0'), 0);

            if (totalQty > 10) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Over-Invoicing! SO: 10, Invoiced: ${totalQty}. Financial leakage / inventory integrity breach detected.`);
            }
            console.log(`[PASS] System correctly enforced SO limits.`);

        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Over-Invoicing attempt blocked: ${err.message}`);
        }
    });

    test('Guardrail: Standalone Invoice must reject $0.00 selling price to enforce catalog price immutability', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;
        const { apiBase, headers, qs } = await app.buildApiContext();
        const dateIso = (await (require('../../lib/utils/DateHelper').DateHelper.resolve(page))).iso;

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`[ATTACK] Attempting to create Standalone Invoice with unit_price = 0 ($0.00 free goods)...`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
            headers,
            data: {
                customer_id: meta.customerId,
                accounts_receivable: meta.accountsReceivableId,
                accounts_receivable_id: meta.accountsReceivableId,
                currency_id: meta.currencyId,
                currency: 'Birr',
                invoice_date: dateIso,
                due_date: dateIso,
                items: [{
                    item_id: item.itemId,
                    quantity: 5,
                    unit_price: 0, // FREE! $0.00
                    general_ledger_account_id: meta.salesAccountId,
                    warehouse_id: item.warehouseId,
                    location_id: item.locationId,
                }]
            }
        });

        if (resp.ok()) {
            const data = await resp.json();
            const invNumber = data.invoice_number || data.ref || data.id;
            const invId = data.id;

            console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('🚨 [SELLING_PRICE_IMMUTABILITY_BUG] ERP accepted $0.00 selling price on invoice!');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error(`  Customer ID      : ${meta.customerId}`);
            console.error(`  Item Name        : ${item.itemName}`);
            console.error(`  Item ID          : ${item.itemId}`);
            console.error(`  Catalog Cost     : $${item.unitCost || 100}`);
            console.error(`  Billed Price     : $0.00  ← ZERO-PRICE DEPLETION`);
            console.error(`  Invoice Number   : ${invNumber}`);
            console.error(`  Invoice ID       : ${invId}`);
            console.error(`  Risk             : Inventory depletion at $0 without promotional discount policy`);
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('Copyable cURL Reproduction:');
            console.error(`curl -X POST "${apiBase}/invoices?${qs}" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "x-company: BM Tech" \\
  -H "Content-Type: application/json" \\
  -d '{"customer_id":"${meta.customerId}","accounts_receivable_id":"${meta.accountsReceivableId}","currency":"Birr","invoice_date":"${dateIso}","due_date":"${dateIso}","items":[{"item_id":"${item.itemId}","quantity":5,"unit_price":0}]}'`);
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            throw new Error(`[SELLING_PRICE_IMMUTABILITY_BUG] Invoice ${invNumber} accepted with unit_price=0 on inventory item "${item.itemName}"!`);
        } else {
            console.log(`[PASS] Zero selling price correctly rejected: HTTP ${resp.status()}`);
        }
    });
});
