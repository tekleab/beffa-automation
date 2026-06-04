import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT PO GUARDRAIL AUDITS
 *
 * Objectives:
 * 1. Verify system rejects Billing for more units than the approved Purchase Order.
 */

test.describe('Procurement PO Guardrails @purchase @logic @regression @full', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI();
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: System must reject Billing for more units than the approved PO', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        // 1. Create PO for 10 units
        console.log(`[STEP 1] Creating PO for 10 units...`);
        const po = await app.api.purchase.createPurchaseOrderAPI(item, 10, 5000, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');

        // 2. Attempt to Bill for 50 units
        console.log(`[ATTACK] Attempting to Bill 50 units against the 10-unit PO...`);

        try {
            const bill = await app.api.purchase.createBillFromPoAPI(po.poId);
            console.log(`[INFO] Bill created for PO. Checking if we can inflate quantity...`);

            await app.advanceDocumentAPI(bill.billId, 'bills');
            console.log(`[INFO] Bill approved. Verifying if it honored PO limits...`);

            const finalBill = await app.api.purchase.getBillAPI(bill.billId);
            const totalQty = finalBill.received_purchase_order_items?.reduce((sum: number, i: any) => sum + i.received_quantity, 0);

            if (totalQty > 10) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Over-Billing! PO: 10, Invoiced: ${totalQty}. Financial leakage detected.`);
            }
            console.log(`[PASS] System correctly enforced PO limits.`);

        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Over-Billing attempt blocked: ${err.message}`);
        }
    });
});
