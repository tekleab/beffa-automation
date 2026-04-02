const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe.serial('Receipt Reversal & GL Ledger Impact (Modular)', () => {
    let rctID = null;
    let rctUUID = null;
    let initialEntries = [];

    /**
     * Stage 1: Accelerated Receipt Creation and Approval
     */
    test('Stage 1: Accelerated Receipt Creation and Approval', async ({ page }) => {
        test.setTimeout(300000); 
        const app = new AppManager(page);

        // 1. System Authentication
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        // 2. Receipt Creation (High-Speed API Track)
        console.log("Execution: Bootstrapping Receipt via API...");
        const { ref, id } = await app.createReceiptAPI(); 
        rctID = ref;
        rctUUID = id;
        console.log(`[SUCCESS] Receipt ${rctID} (UUID: ${rctUUID}) created.`);

        // 3. Approval Flow (UI Track for E2E Integrity)
        await app.page.goto(`/receivables/receipts`);
        await app.page.getByRole('link', { name: rctID }).first().click();
        
        await app.handleApprovalFlow();
        console.log(`[✓] ${rctID} Approved.`);

        // 4. Initial GL Impact Capture (UI Track)
        console.log("Action: Checking Initial GL Ledger Impact via UI...");
        initialEntries = await app.captureJournalEntries(/CRJ/i);
        
        if (initialEntries.length > 0) {
            const sample = initialEntries[0];
            console.log(`[VERIFY] Ledger check: ${sample.accountName} | Debit: ${sample.debit} | Credit: ${sample.credit}`);
        } else {
            throw new Error("No Journal Entries found via UI after approval.");
        }
    });

    /**
     * Stage 2: Document Reversal and Ledger Verification
     */
    test('Stage 2: Document Reversal and Ledger Verification', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`Action: Locating Receipt ${rctID} for Reversal...`);
        await app.page.goto(`/receivables/receipts`);
        await app.page.getByRole('link', { name: rctID }).first().click();

        // 1. Trigger Reversal (UI Track)
        console.log(`Action: Triggering Reversal for Receipt ${rctID}...`);
        await app.page.getByRole('button', { name: 'Reverse' }).click();
        await app.page.getByRole('dialog').getByRole('button', { name: 'Reverse' }).click();
        
        console.log("Action: Waiting for backend Reversal finalization...");
        await page.waitForTimeout(6000); 
        
        const badge = page.locator('.chakra-badge').filter({ hasText: /Reversed/i }).first();
        if (await badge.isVisible({ timeout: 5000 }).catch(()=>false)) {
            console.log(`[SUCCESS] Status for ${rctID} successfully flipped to Reversed.`);
        }

        // 3. Mathematical Reversal Verification
        console.log("Action: Checking Reversed GL Ledger Impact...");
        if (initialEntries.length > 0) {
            console.log(`[VERIFY] Ledger check (Reversed): Enacting mathematical offsets...`);
            
            const reversedEntries = initialEntries.map(e => ({
                accountCode: e.accountCode,
                accountName: e.accountName,
                debit: e.credit, 
                credit: e.debit  
            }));

            await app.verifyAllJournalEntries(rctID, reversedEntries);
            console.log(`[SUCCESS] Reverse offsetting entries successfully proved in Sub-Ledgers.`);
        } else {
            console.log(`[WARN] No initial journal entries captured. Ensure Stage 1 passed.`);
        }

        console.log(`[✓] Complete Receipt Reversal GL Impact test finished.`);
        await page.close();
    });
});
