const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Purchase Inventory & Ledger Impact', () => {

    test('Verify Stock and Journal Impact for Purchase Workflow', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);
        let poID = null;
        let selectedVendor = "";

        // 1. Identify Random Item
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const initial = await app.captureRandomItemDetails();
        console.log(`[TARGET] Item: "${initial.itemName}" | Initial Stock: ${initial.currentStock}`);

        // 2. Create Purchase Order VIA API (Fast & Stable)
        console.log(`Action: Creating PO via API for "${initial.itemName}"...`);
        const poData = await app.createPurchaseOrderAPI(initial, 10, 5000);
        poID = poData.poNumber;
        const poUUID = poData.poId;
        
        console.log(`[SUCCESS] PO Created: ${poID}. Navigating to Approval UI...`);
        await page.goto(`/payables/purchase-orders/${poUUID}/detail`, { waitUntil: 'load' });
        
        // ⚡ PRECISION LIVE VENDOR CAPTURE
        selectedVendor = await app.extractDetailValue('Vendor');
        console.log(`[DATA] Captured Live Vendor: "${selectedVendor}"`);

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
        await app.pickDate('Invoice Date');
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

        // Verification B: Final Stock Impact (with Retry for background processing)
        console.log(`[VERIFY] Final Stock Check for "${initial.itemName}"...`);
        let final = null;
        let expectedStock = initial.currentStock + receivedQty;
        
        // 🔄 Retry loop: ERP background ledger might take a few seconds to update stock
        for (let i = 0; i < 3; i++) {
            await page.waitForTimeout(5000); // Wait 5s for ledger sync
            final = await app.captureItemDetails(initial.itemName);
            console.log(`[CHECK] Attempt ${i+1}: Stock is ${final.currentStock} (Expected: ${expectedStock})`);
            if (final.currentStock === expectedStock) break;
            console.log(`[WARN] Stock not updated yet. Retrying in 5s...`);
        }
        
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
