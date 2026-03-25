const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Quotes Creation - Capture then Approve', () => {

    test('Create Quote, Capture Data, then Approve', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);

        // 1. Entry and Selection
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        console.log("Execution: Navigating to New Quote...");
        await page.goto('/payables/quotes/new', { waitUntil: 'networkidle' });

        await page.locator('button:has(span.formatted-date)').first().click();
        await page.getByRole('button', { name: '2', exact: true }).first().click();
        await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Requisition selector' }), 'PR');
        await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');

        // 2. Line Item configuration
        console.log("Action: Adding Line Item...");
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });

        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Inventory Item');

        await page.waitForTimeout(2000);
        await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await page.waitForTimeout(3000);
        await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');

        await modal.locator('div.chakra-form-control').filter({ hasText: /^Unit Price \*/ }).getByRole('spinbutton').fill('1250');
        await modal.locator('div.chakra-form-control').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill('3');
        await app.selectRandomOption(modal.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible({ timeout: 15000 });

        // 3. Accounts Payable selection
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');

        // 4. Submission
        console.log("Action: Submitting Quote...");
        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await page.waitForTimeout(2000);
        await expect(addNowBtn).toBeEnabled();
        await addNowBtn.click();

        // --- 5. DATA CAPTURE ---
        await page.waitForURL(/\/payables\/quotes\/.*\/detail$/, { waitUntil: 'networkidle' });
        console.log("Status: Detail page loaded. Capturing information...");

        // Extract Quote Number
        const quoteNumLocator = page.locator('p.chakra-text').filter({ hasText: /QTE\/\d{4}/ }).first();
        await quoteNumLocator.waitFor({ state: 'visible', timeout: 30000 });
        const capturedQuoteNumber = await quoteNumLocator.innerText();

        // Vendor Name Capture
        const vendorValue = page.locator('p').filter({ hasText: /vendor:/i }).locator('xpath=following-sibling::p').first();
        await vendorValue.waitFor({ state: 'visible', timeout: 15000 });
        const capturedVendor = (await vendorValue.innerText()).trim();

        console.log("------------------------------------------");
        console.log(`Summary: Captured Data:`);
        console.log(`Quote ID: ${capturedQuoteNumber}`);
        console.log(`Vendor: ${capturedVendor}`);
        console.log("------------------------------------------");

        // 6. APPROVAL FLOW
        console.log(`Action: Executing approval for ${capturedQuoteNumber}...`);
        await app.handleApprovalFlow();

        // 7. VERIFICATION
        const statusValue = page.locator('p').filter({ hasText: /Status:/i }).locator('xpath=following-sibling::p').first();
        await expect(statusValue).toContainText('Approved', { timeout: 15000 });

        // 8. FINAL CROSS-VERIFICATION in Vendor Profile
        await app.verifyDocInProfile('vendor', capturedVendor, capturedQuoteNumber);

        console.log(`Status: Quote ${capturedQuoteNumber} verified successfully.`);
        await page.close();
    });
});