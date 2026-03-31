const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Sales Inventory & Ledger Impact', () => {

    test('Verify Stock and Journal Impact for Sales Workflow', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        // 1. Login and Identify a Random Item with Stock
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let initial = null;
        while (true) {
            initial = await app.captureRandomItemDetails();
            if (initial.currentStock > 2) {
                console.log(`[TARGET] Item: "${initial.itemName}" | Initial Stock: ${initial.currentStock}`);
                break;
            }
            console.log(`[INFO] Item "${initial.itemName}" low stock (${initial.currentStock}). Retrying...`);
        }

        // 2. Create Sales Order
        console.log("Action: Navigating to New Sales Order...");
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'load' });

        const customerBtn = page.getByRole('button', { name: 'Customer selector' });
        await app.selectRandomOption(customerBtn, 'Customer');
        const selectedCustomer = (await customerBtn.innerText()).trim();
        console.log(`[DATA] Saved Customer: "${selectedCustomer}"`);

        await app.pickDate('Sale Order Date', 21);
        await page.waitForTimeout(600);

        // Fill mandatory form fields for the SO (Skip Budget as per instruction)
        console.log("Action: Selecting Accounts Receivable...");
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');

        await page.waitForTimeout(1000);

        // Add Line Item for our specific item
        console.log(`Action: Adding Line Item for "${initial.itemName}"...`);
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });

        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        const itemSelector = modal.getByRole('button', { name: 'Item selector' });
        await itemSelector.click();
        await app.smartSearch(null, initial.itemName);
        await page.waitForTimeout(800);

        await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
        await app.selectRandomOption(modal.getByRole('button', { name: 'G/L Account selector' }), 'Sales Account');

        // Sale quantity (random 1-2)
        const saleQty = Math.floor(Math.random() * 2) + 1;
        await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill(String(saleQty));

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible();

        // Submit SO
        console.log("Action: Submitting Sales Order...");
        const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addNowBtn).toBeEnabled();
        await addNowBtn.click();

        // 3. Approval Flow for SO
        await page.waitForURL(/\/receivables\/sale-orders\/.*\/detail$/, { timeout: 120000 });
        const soElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^SO\/\d{4}\// }).first();
        await soElement.waitFor({ state: 'attached' });
        const soID = (await soElement.textContent()).match(/SO\/\d{4}\/\d{2}\/\d{2}\/\d+/)[0];

        await app.handleApprovalFlow();
        console.log(`[✓] SO ${soID} approved.`);

        // 4. Create Invoice from SO
        console.log(`Action: Converting SO ${soID} to Invoice...`);
        await page.goto('/receivables/invoices/new', { waitUntil: 'load' });

        // Match Customer
        const invCustBtn = page.getByRole('button', { name: 'Customer selector' });
        await invCustBtn.click();
        await app.smartSearch(null, selectedCustomer);

        await app.pickDate('Invoice Date', 21);
        await app.pickDate('Due Date', 21);
        
        // Use flexible targeting for Invoice screen labels (Account vs Accounts)
        const arBtn = page.getByRole('button', { name: /Account(s)? Receivable selector/i });
        await app.selectRandomOption(arBtn, 'AR Account');

        // Link SO - Add buffer for list to populate after customer match
        await page.waitForTimeout(1000);
        const invSOBtn = page.getByRole('button', { name: /Sale(s)? Order selector/i });
        await invSOBtn.click();
        await app.smartSearch(null, soID);
        await page.waitForTimeout(1000);

        // ⚡ Handle the Released Tab (Mirror of Purchase Receipt logic)
        const releasedQty = await app.handleSOReleasedTab();
        console.log(`[ACTION] Processed ${releasedQty} items from SO.`);

        // Submit Invoice
        const invSubmitBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(invSubmitBtn).toBeEnabled();
        await invSubmitBtn.click();

        // 5. Verify Impact
        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/, { timeout: 120000 });
        const invElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^INV\// }).first();
        const invID = (await invElement.textContent()).match(/INV\/\d{4}\/\d{2}\/\d{2}\/\d+/)[0];
        console.log(`[✓] Invoice ${invID} created.`);

        await app.handleApprovalFlow();

        // Ledger Entry Verification (Optimize for 1 account)
        const entries = await app.captureJournalEntries();
        if (entries.length > 0) {
            console.log(`[VERIFY] Ledger check: ${entries[0].accountName}`);
            await app.verifyLedgerImpact(entries[0].accountCode, invID, entries[0].debit || entries[0].credit, entries[0].debit > 0 ? 'debit' : 'credit');
        }

        // Final Stock Verification
        console.log(`[VERIFY] Final Stock Check for "${initial.itemName}"...`);
        const final = await app.captureItemDetails(initial.itemName);
        const expectedStock = initial.currentStock - releasedQty;

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
