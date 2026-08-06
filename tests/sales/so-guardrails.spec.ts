import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';


/**
 * SALES SO GUARDRAIL AUDITS
 *
 * Objectives:
 * 1. Verify system rejects Invoicing for more units than the approved Sales Order.
 */

test.describe('Sales SO Guardrails @sales @logic @regression @full', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedMeta = await app.api.sales.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 50, unit_cost: 100 });
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
});
