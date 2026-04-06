const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe.serial('Invoice Reversal — Create, Approve, Reverse, Verify Stock Restoration', () => {
    let invID = null;
    let initialInfo = null;
    let invoicedQty = 0;

    test('Stage 1: Create and approve SO, link to Invoice, verify stock deduction', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        console.log('[STEP] Stage 1: Login & Setup');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // 1. Pick a random item with stock
        while (true) {
            initialInfo = await app.captureRandomItemDetails();
            if (initialInfo.currentStock >= 2) break;
            console.log(`[INFO] Item "${initialInfo.itemName}" stock too low. Retrying...`);
        }
        console.log(`[INFO] Item: "${initialInfo.itemName}" | Initial Stock: ${initialInfo.currentStock}`);

        // 2. Create Sales Order via API
        console.log(`[STEP] Phase 2: Creating Sales Order via API for ${initialInfo.itemName}`);
        const soData = await app.createSalesOrderAPI({ itemId: initialInfo.itemId, quantity: 1 });
        console.log(`[OK] Sales Order created: ${soData.ref}`);

        // 3. Approve Sales Order in UI
        console.log(`[STEP] Phase 3: Approving SO ${soData.ref}`);
        await page.goto(`/receivables/sales-orders/${soData.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Sales Order ${soData.ref} approved (Released)`);

        // 4. Create Invoice using the SO
        console.log(`[STEP] Phase 4: Creating Invoice from Released SO ${soData.ref}`);
        await page.goto('/receivables/invoices/new', { waitUntil: 'load' });

        // Select Customer from SO
        console.log(`[INFO] Selecting Customer UI...`);
        const invCustBtn = page.getByRole('button', { name: 'Customer selector' });
        await invCustBtn.waitFor({ state: 'visible' });
        await invCustBtn.click();

        // Use a generic customer selector or wait for dropdown
        await page.waitForTimeout(2000);
        await app.smartSearch(null, "Desta Alamirew"); // Or a dynamic name if we captured it

        // Link to Released SO
        console.log(`[STEP] Switching to "Released Sales Order" tab`);
        const soTab = page.getByRole('tab', { name: /Released Sales Order/i });
        await soTab.click();

        console.log(`[INFO] Searching for SO ${soData.ref}`);
        const panel = page.locator('div[role="tabpanel"]:not([hidden])');
        await expect(panel.locator('.chakra-checkbox, input[role="checkbox"]').first()).toBeVisible({ timeout: 30000 });

        const targetRow = panel.locator('> div > div').filter({
            has: page.locator('span').getByText(soData.ref, { exact: true })
        }).first();

        await targetRow.locator('.chakra-checkbox, [role="checkbox"]').first().click({ force: true });
        console.log(`[OK] SO ${soData.ref} linked to Invoice`);

        console.log('[STEP] Submitting Invoice');
        const invSubmitBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(invSubmitBtn).toBeEnabled({ timeout: 15000 });
        await invSubmitBtn.click();

        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/, { timeout: 120000 });
        const invElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^INV\// }).first();
        invID = (await invElement.textContent()).match(/INV\/\d{4}\/\d{2}\/\d{2}\/\d+/)[0];
        console.log(`[OK] Invoice created: ${invID}`);

        await app.handleApprovalFlow();
        console.log(`[OK] Invoice ${invID} approved`);

        console.log('[STEP] Verifying stock deduction');
        const { currentStock: postInvStock } = await app.captureItemDetails(initialInfo.itemName);
        const expectedStock = initialInfo.currentStock - 1;

        console.log(`[VERIFY] Expected: ${expectedStock} | Found: ${postInvStock}`);
        if (postInvStock !== expectedStock) {
            throw new Error(`Stock deduction failed. Expected ${expectedStock}, found ${postInvStock}`);
        }
        console.log('[OK] Stock decreased correctly after full flow invoice approval');
    });

    test('Stage 2: Reverse invoice, verify stock restoration', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP] Locating Invoice ${invID} for reversal`);
        await page.goto(`/receivables/invoices/?page=1&pageSize=15`);

        // Wait for grid to be interactive
        await page.waitForSelector('table tbody tr', { timeout: 30000 });
        await page.waitForTimeout(2000);

        await app.smartSearch(page.locator('body'), invID);
        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/);
        await page.waitForTimeout(3000);

        console.log(`[STEP] Triggering reversal for ${invID}`);
        await page.getByRole('button', { name: 'Reverse' }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Reverse' }).click();
        await page.waitForTimeout(6000);

        const badge = page.locator('.chakra-badge').filter({ hasText: /Reversed/i }).first();
        if (await badge.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log(`[OK] ${invID} status changed to Reversed`);
        } else {
            console.log(`[INFO] Reversal badge not visible yet, proceeding to verify stock`);
        }

        console.log('[STEP] Verifying stock restoration');
        const { currentStock: finalStock } = await app.captureItemDetails(initialInfo.itemName);

        console.log(`[VERIFY] Expected (restored): ${initialInfo.currentStock} | Found: ${finalStock}`);
        if (finalStock !== initialInfo.currentStock) {
            throw new Error(`Stock restoration failed. Expected ${initialInfo.currentStock}, found ${finalStock}`);
        }
        console.log(`[RESULT] Invoice Reversal: PASSED — Stock restored to ${finalStock}`);
        await page.close();
    });
});
