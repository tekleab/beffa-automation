import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Sales Impact Flow @regression', () => {

    test('Create SO + Invoice via API, approve both, verify stock decrease', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        // Phase 1: Login & Item Discovery
        console.log('[STEP] Phase 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const initial = await app.captureRandomItemDataAPI();
        console.log(`[INFO] Item: "${initial.itemName}" | UUID: ${initial.itemId} | Stock: ${initial.currentStock}`);

        // Phase 2: Create Sales Order via API
        const saleQty = Math.floor(Math.random() * 2) + 1;
        console.log(`[STEP] Phase 2: Creating SO via API for ${saleQty} x "${initial.itemName}"`);

        const soResult = await app.createSalesOrderAPI({
            itemId: initial.itemId,
            quantity: saleQty,
        });
        const soID = soResult.ref;
        const soItemId = soResult.soItemId;
        console.log(`[OK] SO created: ${soID} | Customer: ${soResult.customerId}`);

        // Phase 3: Approve SO
        console.log(`[STEP] Phase 3: Approving SO ${soID}`);
        await page.goto(`/receivables/sale-orders/${soResult.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] SO ${soID} approved`);

        // Phase 4: Create Invoice via API
        console.log(`[STEP] Phase 4: Creating Invoice via API from SO ${soID}`);
        const invResult = await app.createInvoiceAPI({
            customerId: soResult.customerId,
            soItemId: soItemId, // Use SO Item ID for linking
            releasedQuantity: saleQty
        });

        if (!invResult.success) {
            throw new Error(`Invoice Creation Failed: ${invResult.error}`);
        }

        const invID = invResult.ref;
        const invUUID = invResult.id;
        console.log(`[OK] Invoice created: ${invID} (UUID: ${invUUID})`);

        // Phase 5: Approve Invoice
        console.log(`[STEP] Phase 5: Approving Invoice ${invID}`);
        await page.goto(`/receivables/invoices/${invUUID}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Invoice ${invID} approved`);

        // Phase 6: Verify stock decrease via API (fast, no UI navigation needed)
        console.log(`[STEP] Phase 6: Verifying stock for "${initial.itemName}" via API`);
        await page.waitForTimeout(3000); // Allow backend to settle post-approval
        const final = await app.getItemDetailsAPI(initial.itemId);
        const expectedStock = initial.currentStock - saleQty;

        console.log(`[VERIFY] Item: ${initial.itemName} | Initial: ${initial.currentStock} | Sold: ${saleQty} | Final: ${final!.currentStock} | Expected: ${expectedStock}`);

        if (final!.currentStock !== expectedStock) {
            throw new Error(`Stock deduction failed. Expected ${expectedStock}, found ${final!.currentStock}`);
        }
        console.log(`[RESULT] Sales Impact: PASSED - Stock correctly decreased from ${initial.currentStock} to ${final!.currentStock}`);

        await page.close();
    });
});
