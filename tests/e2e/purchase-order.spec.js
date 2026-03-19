const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Purchase Order with Specific Selector Check and Approval', () => {

    test('Step 2: Create and Approve PO using Status Selector', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);

        // 1. Login
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/purchase-orders/new', { waitUntil: 'networkidle' });

        // 2. Header Section
        await page.locator('button:has(span.formatted-date)').first().click();
        await page.getByRole('button', { name: '1', exact: true }).click();

        await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');

        // Verification: Ensure the selection holds and is not empty or default
        for (let i = 0; i < 3; i++) {
            const btnText = await page.getByRole('button', { name: 'Purchase Type selector' }).innerText();
            if (btnText && !btnText.toLowerCase().includes('selector')) {
                console.log(`  [Verify] Purchase Type holds: "${btnText}"`);
                break;
            }
            console.log(`  [Retry] Purchase Type was cleared or not set, retrying...`);
            await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
        }

        // 3. Line Item Modal
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });
        await modal.getByRole('button', { name: 'Item', exact: true }).click();

        await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Inventory Item');

        let locationCount = 0;
        let attempts = 0;
        while (locationCount === 0 && attempts < 5) {
            attempts++;
            await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), `WH Attempt ${attempts}`);
            await page.waitForTimeout(1000);
            locationCount = await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location', true);
        }

        await modal.locator('div.chakra-form-control').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill('2');
        await modal.locator('div.chakra-form-control').filter({ hasText: /^Unit Price \*/ }).getByRole('spinbutton').fill('1500');
        await app.selectRandomOption(modal.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');

        // Tax (VAT) Selection
        await modal.getByRole('button', { name: 'Tax selector' }).click();
        const vatOption = page.locator('button').filter({ hasText: 'VAT' }).locator('.chakra-checkbox').first();
        await vatOption.evaluate(node => node.click());
        await page.keyboard.press('Escape');

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible({ timeout: 15000 });

        // 4. Save and Navigate
        console.log("Saving Purchase Order...");
        await page.getByRole('button', { name: 'Add Now' }).click();
        await page.waitForURL(/\/payables\/purchase-orders\/.*\/detail$/, { waitUntil: 'networkidle' });

        // Status Verification Selector
        const draftStatusSelector = '#root > div > div > div > div.css-wcnchi > div.css-1rnfd1a > div.css-6wlb7p > div.css-15y92lb > div > div.css-dgbujh > div > div > div > div.css-1klfsl3 > div > div > div.css-cf3le8 > div > div';

        console.log("Verifying status via specific CSS selector...");
        const statusLabel = page.locator(draftStatusSelector);

        await statusLabel.scrollIntoViewIfNeeded();
        await expect(statusLabel).toBeVisible({ timeout: 20000 });
        const statusText = await statusLabel.innerText();
        console.log(`Current Document Status: ${statusText}`);

        console.log("Scrolling to top for action buttons...");
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(1500);

        console.log("Starting Approval Flow...");
        await app.handleApprovalFlow();

        // 6. Final Verification
        const approvedStatus = page.locator(app.approvedStatus).first();
        await expect(approvedStatus).toBeVisible({ timeout: 60000 });
        console.log("✅ SUCCESS: PO Created and Fully Approved!");
    });
});