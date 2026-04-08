const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/AppManager');

test.describe.serial('Receipt Reversal — GL Ledger Impact @regression', () => {
    let rctID = null;
    let rctUUID = null;
    let initialEntries = [];

    test('Stage 1: Create and approve receipt, capture GL entries', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);

        console.log('[STEP] Stage 1: Login & Receipt Creation');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log('[STEP] Creating receipt via API');
        const { ref, id } = await app.createReceiptAPI();
        rctID = ref;
        rctUUID = id;
        console.log(`[OK] Receipt created: ${rctID} (UUID: ${rctUUID})`);

        console.log('[STEP] Approving receipt via UI');
        await app.page.goto(`/receivables/receipts`);
        await app.page.waitForSelector(`text=${rctID}`, { timeout: 30000 });
        await app.page.getByRole('link', { name: rctID }).first().click();
        await app.handleApprovalFlow();
        console.log(`[OK] ${rctID} approved`);

        console.log('[STEP] Capturing initial GL entries');
        initialEntries = await app.captureJournalEntries(/CRJ/i);

        if (initialEntries.length > 0) {
            const sample = initialEntries[0];
            console.log(`[INFO] GL Entry: ${sample.accountName} | Debit: ${sample.debit} | Credit: ${sample.credit}`);
        } else {
            throw new Error('No GL entries found after approval');
        }
    });

    test('Stage 2: Reverse receipt, verify GL offsets', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP] Locating receipt ${rctID} for reversal`);
        await app.page.goto(`/receivables/receipts`);
        await app.page.getByRole('link', { name: rctID }).first().click();

        console.log(`[STEP] Triggering reversal for ${rctID}`);
        await app.page.getByRole('button', { name: 'Reverse' }).click();
        await app.page.getByRole('dialog').getByRole('button', { name: 'Reverse' }).click();
        await page.waitForTimeout(6000);

        const badge = page.locator('.chakra-badge').filter({ hasText: /Reversed/i }).first();
        if (await badge.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log(`[OK] ${rctID} status changed to Reversed`);
        }

        console.log('[STEP] Verifying reversed GL entries');
        if (initialEntries.length > 0) {
            const reversedEntries = initialEntries.map(e => ({
                accountCode: e.accountCode,
                accountName: e.accountName,
                debit: e.credit,
                credit: e.debit
            }));
            await app.verifyAllJournalEntries(rctID, reversedEntries);
            console.log('[OK] Reverse offsetting entries verified in sub-ledgers');
        } else {
            console.log('[INFO] No initial entries to verify against');
        }

        console.log(`[RESULT] Receipt Reversal GL Impact: PASSED`);
        await page.close();
    });
});
