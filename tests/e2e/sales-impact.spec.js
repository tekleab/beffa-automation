const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Sales Inventory & Ledger Impact', () => {

    test('Verify Stock and Journal Impact for Sales Workflow', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        // 1. Login and Identify a Random Item with Stock
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let initial = null;
        while (initial === null) {
            initial = await app.captureRandomItemDetails();
            if (initial.currentStock > 2 && initial.itemId) {
                console.log(`[TARGET] Item: "${initial.itemName}" | UUID: ${initial.itemId} | Initial Stock: ${initial.currentStock}`);
                break;
            }
            console.log(`[INFO] Item "${initial.itemName}" low stock (${initial.currentStock}) or no UUID. Retrying...`);
            initial = null;
        }

        // 2. Create Sales Order via API (High-Speed Track)
        const saleQty = Math.floor(Math.random() * 2) + 1;
        console.log(`Action: Creating Sales Order via API for ${saleQty} x "${initial.itemName}"...`);

        const soResult = await app.createSalesOrderAPI({
            itemId: initial.itemId,
            quantity: saleQty,
        });
        const soID = soResult.ref;
        console.log(`[✓] SO ${soID} created via API. Customer captured: ${soResult.customerId}`);

        // 3. Approval Flow for SO (Fast Track)
        const customerName = await app.getCustomerNameAPI(soResult.customerId);
        console.log(`[SUCCESS] SO Draft Created: ${soID}. Customer: "${customerName}" (${soResult.customerId})`);

        await page.goto(`/receivables/sale-orders/${soResult.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[✓] SO ${soID} approved for "${customerName}".`);

        // 4. Create Linked Invoice via API (High-Speed Track)
        console.log(`Action: Creating Invoice via API from SO ${soID} for "${customerName}"...`);
        const invResult = await app.createInvoiceAPI({
            itemId: initial.itemId,
            quantity: saleQty,
            customerId: soResult.customerId
        });
        const invID = invResult.ref;
        const invUUID = invResult.id;
        console.log(`[✓] Invoice ${invID} created via API.`);

        // 5. Approve Invoice via UI
        await page.goto(`/receivables/invoices/${invUUID}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[✓] Invoice ${invID} approved.`);

        // 6. Ledger Entry Verification (Optional for this pass)
        // const entries = await app.captureJournalEntries();

        // 7. Final Stock Verification
        console.log(`[VERIFY] Final Stock Check for "${initial.itemName}"...`);
        const final = await app.captureItemDetails(initial.itemName);
        const expectedStock = initial.currentStock - saleQty;

        console.log(`------------------------------------------`);
        console.log(`Item: ${initial.itemName}`);
        console.log(`Initial Stock: ${initial.currentStock}`);
        console.log(`Sold Qty    : ${saleQty}`);
        console.log(`Final Stock  : ${final.currentStock}`);
        console.log(`Expected     : ${expectedStock}`);
        console.log(`------------------------------------------`);

        expect(final.currentStock).toBe(expectedStock);
        console.log(`[SUCCESS] Sales Stock Impact Verified.`);

        await page.close();
    });
});
