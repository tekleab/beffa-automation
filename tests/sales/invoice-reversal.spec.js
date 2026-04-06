const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe.serial('Invoice Reversal — Create, Approve, Reverse, Verify Stock Restoration', () => {
    let invID = null;
    let initialInfo = null;
    let invoicedQty = 0;

    test('Stage 1: Create and approve invoice, verify stock deduction', async ({ page }) => {
        test.setTimeout(400000);
        const app = new AppManager(page);

        console.log('[STEP] Stage 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        while (true) {
            initialInfo = await app.captureRandomItemDetails();
            if (initialInfo.currentStock >= 2) {
                console.log(`[INFO] Item: "${initialInfo.itemName}" | Stock: ${initialInfo.currentStock}`);
                break;
            }
            console.log(`[INFO] Item "${initialInfo.itemName}" stock too low. Retrying...`);
        }

        console.log('[STEP] Creating Direct Invoice');
        await page.goto('/receivables/invoices/new', { waitUntil: 'load' });

        const invCustBtn = page.getByRole('button', { name: 'Customer selector' });
        await app.selectRandomOption(invCustBtn, 'Customer');
        const selectedCustomer = (await invCustBtn.innerText()).trim();
        console.log(`[INFO] Customer: "${selectedCustomer}"`);

        const currentDay = await app.getActiveCalendarDay();
        const dueDay = Math.min(30, currentDay + 5);
        await app.pickDate('Invoice Date', currentDay);
        await app.pickDate('Due Date', dueDay);
        console.log(`[INFO] Dates: Invoice Day ${currentDay}, Due Day ${dueDay}`);

        const arBtn = page.getByRole('button', { name: /Account(s)? Receivable selector/i });
        await app.selectRandomOption(arBtn, 'AR Account');
        await page.waitForTimeout(500);

        console.log(`[STEP] Adding line item for "${initialInfo.itemName}"`);
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });

        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        const itemSelector = modal.getByRole('button', { name: 'Item selector' });
        await itemSelector.click();
        await app.smartSearch(null, initialInfo.itemName);
        await page.waitForTimeout(1000);

        await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
        await app.selectRandomOption(modal.getByRole('button', { name: 'G/L Account selector' }), 'Sales Account');

        await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill("1");
        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible();
        await page.waitForTimeout(1000);
        invoicedQty = 1;

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
        const expectedStock = initialInfo.currentStock - invoicedQty;

        console.log(`[VERIFY] Expected: ${expectedStock} | Found: ${postInvStock}`);
        if (postInvStock !== expectedStock) {
            throw new Error(`Stock deduction failed. Expected ${expectedStock}, found ${postInvStock}`);
        }
        console.log('[OK] Stock decreased correctly after invoice approval');
    });

    test('Stage 2: Reverse invoice, verify stock restoration', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP] Locating Invoice ${invID} for reversal`);
        await page.goto(`/receivables/invoices/?page=1&pageSize=15`);
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
