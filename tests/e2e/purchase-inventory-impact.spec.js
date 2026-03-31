const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Purchase Inventory & Ledger Impact', () => {

    test('Verify Stock and Journal Impact for Purchase Workflow', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        // 1. Login and Identify a Random Item
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const initial = await app.captureRandomItemDetails();
        console.log(`[TARGET] Item: "${initial.itemName}" | Initial Stock: ${initial.currentStock}`);

        // 2. Create Purchase Order for this item
        console.log("Action: Navigating to New Purchase Order...");
        await page.goto('/payables/purchase-orders/new', { waitUntil: 'load' });
        await page.waitForURL(/\/payables\/purchase-orders\/new/);

        // Setup Vendor - Save the selected vendor name for Bill creation match
        const vendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        await app.selectRandomOption(vendorBtn, 'Vendor');
        const selectedVendor = (await vendorBtn.innerText()).trim();
        console.log(`[DATA] Saved Vendor: "${selectedVendor}"`);

        // Set Date (Matches Ethiopian Cal logic in appManager)
        await app.pickDate('Purchase Order Date', 21);
        await page.waitForTimeout(600);

        // Fill mandatory form fields for the PO
        console.log("Action: Selecting Accounts Payable and Purchase Type...");
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
        
        await page.waitForTimeout(1000);

        // Add Line Item specifically for our captured item
        console.log(`Action: Adding Line Item for "${initial.itemName}"...`);
        await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });

        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        
        // ⚡ EXACT SEARCH - smartSearch handles the click automatically
        const itemSelector = modal.getByRole('button', { name: 'Item selector' });
        await itemSelector.click();
        await app.smartSearch(null, initial.itemName);
        await page.waitForTimeout(1000);

        await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
        
        // ⚡ Use the specific G/L Account captured from the item (if available) or random if not
        const glBtn = modal.getByRole('button', { name: 'G/L Account selector' });
        if (initial.inventoryAccountCode) {
            await glBtn.click();
            await app.smartSearch(null, initial.inventoryAccountCode);
        } else {
            await app.selectRandomOption(glBtn, 'G/L Account');
        }

        // Quantity (random 1-5 to be safe)
        const qtyToOrder = "10";
        await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill(qtyToOrder);
        await modal.getByRole('group').filter({ hasText: /Unit Price/i }).getByRole('spinbutton').fill("5000");

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible();

        // Submit PO
        console.log("Action: Submitting PO...");
        const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addNowBtn).toBeEnabled();
        await addNowBtn.click();

        // 3. Capture and Approve PO
        await page.waitForURL(/\/payables\/purchase-orders\/.*\/detail$/, { timeout: 120000 });
        
        // Robust PO Number Extraction (matches purchase-order.spec logic)
        const poElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^PO\/\d{4}\// }).first();
        await poElement.waitFor({ state: 'attached', timeout: 30000 });
        const poText = await poElement.textContent();
        const poMatch = poText.match(/PO\/\d{4}\/\d{2}\/\d{2}\/\d+/);
        const poID = poMatch ? poMatch[0] : (poText || '').trim();
        
        console.log(`[ACTION] Document Created: ${poID}. Starting Approval...`);
        await app.handleApprovalFlow();
        console.log(`[✓] PO ${poID} workflow completed.`);

        // 4. Create Bill and Process Receipt
        console.log(`Action: Converting PO ${poID} to Bill...`);
        await page.goto('/payables/bills/new', { waitUntil: 'load' });
        
        // Match Vendor precisely from the PO we just did
        console.log(`Action: Matching Vendor: "${selectedVendor}"...`);
        const billVendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        await billVendorBtn.click();
        await app.smartSearch(null, selectedVendor);
        await page.waitForTimeout(1000); // ⚡ Allow PO list to update after vendor selection
        
        // Link PO
        const billPOBtn = page.getByRole('button', { name: 'Purchase Order selector' });
        await billPOBtn.click();
        await app.smartSearch(null, poID);
        await page.waitForTimeout(1000);

        // Dates & Accounts
        await app.pickDate('Invoice Date', 21);
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Account');

        // ⚡ Handle the Receipt Tab (Crucial for Stock impact!)
        const receivedQty = await app.handlePOReceiptTab();
        console.log(`[ACTION] Received ${receivedQty} items.`);

        // Submit Bill
        console.log("Action: Submitting Bill...");
        const billSubmitBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(billSubmitBtn).toBeEnabled();
        await billSubmitBtn.click();

        // 5. Verify Ledger and Final Stock Impact
        await page.waitForURL(/\/payables\/bills\/.*\/detail$/, { timeout: 120000 });
        const billID = (await page.locator('p, span').filter({ hasText: /^BILL\// }).first().innerText()).trim();
        console.log(`[✓] Bill ${billID} created.`);
        
        // Approval for Bill (to commit to Ledger)
        await app.handleApprovalFlow();

        // Capture Journal Entries
        const entries = await app.captureJournalEntries();
        console.log(`[INFO] Captured ${entries.length} Ledger entries.`);

        // Verification A: Ledger Impact (Check one entry, e.g., the inventory account)
        if (entries.length > 0) {
            console.log(`[VERIFY] Ledger check: ${entries[0].accountName} (${entries[0].accountCode})`);
            await app.verifyLedgerImpact(entries[0].accountCode, billID, entries[0].debit || entries[0].credit, entries[0].debit > 0 ? 'debit' : 'credit');
        }

        // Verification B: Final Stock Impact
        console.log(`[VERIFY] Final Stock Check for "${initial.itemName}"...`);
        const final = await app.captureItemDetails(initial.itemName);
        const expectedStock = initial.currentStock + receivedQty;
        
        console.log(`------------------------------------------`);
        console.log(`Item: ${initial.itemName}`);
        console.log(`Initial Stock: ${initial.currentStock}`);
        console.log(`Received Qty : ${receivedQty}`);
        console.log(`Final Stock   : ${final.currentStock}`);
        console.log(`Expected      : ${expectedStock}`);
        console.log(`------------------------------------------`);

        expect(final.currentStock).toBe(expectedStock);
        console.log(`[SUCCESS] Stock Impact Verified.`);

        await page.close();
    });
});
