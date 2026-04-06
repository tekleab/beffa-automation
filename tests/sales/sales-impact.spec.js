const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Sales Impact — SO → Invoice → Stock Deduction', () => {

    test('Create SO + Invoice via API, approve both, verify stock decrease', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        // Phase 1: Login & Item Discovery
        console.log('[STEP] Phase 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let initial = null;
        while (initial === null) {
            initial = await app.captureRandomItemDetails();
            if (initial.currentStock > 2 && initial.itemId) {
                console.log(`[INFO] Item: "${initial.itemName}" | UUID: ${initial.itemId} | Stock: ${initial.currentStock}`);
                break;
            }
            console.log(`[INFO] Item "${initial.itemName}" stock too low (${initial.currentStock}). Retrying...`);
            initial = null;
        }

        // Phase 2: Create Sales Order via API
        const saleQty = Math.floor(Math.random() * 2) + 1;
        console.log(`[STEP] Phase 2: Creating SO via API for ${saleQty} x "${initial.itemName}"`);

        const soResult = await app.createSalesOrderAPI({
            itemId: initial.itemId,
            quantity: saleQty,
        });
        const soID = soResult.ref;
        console.log(`[OK] SO created: ${soID} | Customer: ${soResult.customerId}`);

        // Phase 3: Approve SO
        console.log(`[STEP] Phase 3: Approving SO ${soID}`);
        await page.goto(`/receivables/sale-orders/${soResult.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] SO ${soID} approved`);

        // Phase 4: Create Invoice via API
        console.log(`[STEP] Phase 4: Creating Invoice via API from SO ${soID}`);
        const invResult = await app.createInvoiceAPI({
            itemId: initial.itemId,
            quantity: saleQty,
            customerId: soResult.customerId
        });
        const invID = invResult.ref;
        const invUUID = invResult.id;
        console.log(`[OK] Invoice created: ${invID}`);

        // Phase 5: Approve Invoice
        console.log(`[STEP] Phase 5: Approving Invoice ${invID}`);
        await page.goto(`/receivables/invoices/${invUUID}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Invoice ${invID} approved`);

        // Phase 6: Stock Verification
        console.log(`[STEP] Phase 6: Verifying stock for "${initial.itemName}"`);
        const final = await app.captureItemDetails(initial.itemName);
        const expectedStock = initial.currentStock - saleQty;

        console.log(`[VERIFY] Item: ${initial.itemName}`);
        console.log(`[VERIFY] Initial: ${initial.currentStock} | Sold: ${saleQty} | Final: ${final.currentStock} | Expected: ${expectedStock}`);

        expect(final.currentStock).toBe(expectedStock);
        console.log(`[RESULT] Sales Impact: PASSED`);

        await page.close();
    });
});
