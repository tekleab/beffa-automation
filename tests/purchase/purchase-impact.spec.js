const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Purchase Impact Flow @regression', () => {

    test('Create PO via API, convert to Bill, verify stock addition', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);
        let poID = null;
        let selectedVendor = "";

        console.log('[STEP] Phase 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const initial = await app.captureRandomItemDetails();
        console.log(`[INFO] Item: "${initial.itemName}" | Stock: ${initial.currentStock}`);

        // Phase 2: Create PO via API
        console.log(`[STEP] Phase 2: Creating PO via API for "${initial.itemName}"`);
        const poData = await app.createPurchaseOrderAPI(initial, 10, 5000);
        poID = poData.poNumber;
        const poUUID = poData.poId;
        console.log(`[OK] PO created: ${poID}`);

        console.log(`[STEP] Approving PO ${poID}`);
        await page.goto(`/payables/purchase-orders/${poUUID}/detail`, { waitUntil: 'load' });
        selectedVendor = await app.extractDetailValue('Vendor');
        console.log(`[INFO] Vendor: "${selectedVendor}"`);

        await app.handleApprovalFlow();
        console.log(`[OK] PO ${poID} approved`);

        // Phase 3: Create Bill from PO
        console.log(`[STEP] Phase 3: Converting PO ${poID} to Bill`);
        await page.goto('/payables/bills/new', { waitUntil: 'load' });

        console.log(`[INFO] Matching vendor: "${selectedVendor}"`);
        const billVendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        await billVendorBtn.click();
        await app.smartSearch(null, selectedVendor);
        await page.waitForTimeout(1000);

        const billPOBtn = page.getByRole('button', { name: 'Purchase Order selector' });
        await billPOBtn.click();
        await app.smartSearch(null, poID);
        await page.waitForTimeout(1000);

        await app.pickDate('Invoice Date');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Account');

        const receivedQty = await app.handlePOReceiptTab();
        console.log(`[INFO] Received ${receivedQty} items`);

        console.log('[STEP] Submitting bill');
        const billSubmitBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(billSubmitBtn).toBeEnabled();
        await billSubmitBtn.click();

        await page.waitForURL(/\/payables\/bills\/.*\/detail$/, { timeout: 120000 });
        const billID = (await page.locator('p, span').filter({ hasText: /^BILL\// }).first().innerText()).trim();
        console.log(`[OK] Bill created: ${billID}`);

        await app.handleApprovalFlow();
        console.log(`[OK] Bill ${billID} approved`);

        // Phase 4: Ledger Verification
        console.log('[STEP] Phase 4: Ledger verification');
        const entries = await app.captureJournalEntries();
        console.log(`[INFO] Captured ${entries.length} ledger entries`);

        if (entries.length > 0) {
            console.log(`[INFO] Sample: ${entries[0].accountName} (${entries[0].accountCode})`);
            await app.verifyLedgerImpact(entries[0].accountCode, billID, entries[0].debit || entries[0].credit, entries[0].debit > 0 ? 'debit' : 'credit');
        }

        // Phase 5: Stock Verification
        console.log(`[STEP] Phase 5: Verifying stock for "${initial.itemName}"`);
        let final = null;
        let expectedStock = initial.currentStock + receivedQty;

        for (let i = 0; i < 6; i++) {
            await page.waitForTimeout(10000); // 10s wait for ERP background updates
            final = await app.captureItemDetails(initial.itemName);
            console.log(`[INFO] Attempt ${i + 1}: Stock ${final.currentStock} (expected: ${expectedStock})`);
            if (final.currentStock === expectedStock) break;
        }

        console.log(`[VERIFY] Item: ${initial.itemName} | Initial: ${initial.currentStock} | Received: ${receivedQty} | Final: ${final.currentStock} | Expected: ${expectedStock}`);

        expect(final.currentStock).toBe(expectedStock);
        console.log('[RESULT] Purchase Impact: PASSED');

        await page.close();
    });
});
