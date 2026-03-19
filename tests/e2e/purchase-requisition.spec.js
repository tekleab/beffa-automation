const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Purchase Requisition Workflow: Create -> Capture -> Approve', () => {

    let sharedPRNumber = '';
    let capturedRequester = '';

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        // Login with credentials from .env
        await app.login(process.env.BEFFA_USER || 'admin@beffa.com', process.env.BEFFA_PASS || 'Beff.$#!');
        await page.waitForTimeout(3000);
    });

    test('Step 1: Create and Fully Approve Purchase Requisition', async ({ page }) => {
        test.setTimeout(450000); // 7.5 minutes timeout for long approval flows
        const app = new AppManager(page);

        console.log("Execution: Navigating to New Purchase Requisition...");
        await page.goto('/payables/purchase-requisitions/new');

        // 1. Request Date (መጋቢት 01, 2018)
        await page.locator('button:has(span.formatted-date)').first().click();
        await page.getByRole('button', { name: '1', exact: true }).click();

        // 2. Requested By ምርጫ
        await page.getByRole('button', { name: 'Requested By selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), 'Baye');

        // 3. Priority Level (High)
        await page.locator('label').filter({ hasText: 'High' }).click();

        // 4. Suggested Vendors (Robust Selection)
        await page.getByRole('button', { name: 'Suggested Vendors selector' }).click();
        const vendorOptions = page.getByRole('dialog').getByRole('group').filter({ has: page.getByRole('checkbox') });
        await expect(vendorOptions.first()).toBeVisible({ timeout: 10000 });
        await vendorOptions.first().click();
        await page.mouse.click(0, 0); // Popover/Dialog ለመዝጋት

        // 5. Reason & Location
        await page.getByRole('textbox', { name: 'Reason for Requisition *' }).fill('Monthly Restock for Main Branch - Automated Test');
        await page.getByRole('textbox', { name: 'Location *' }).fill('Addis Ababa Warehouse');
        await page.keyboard.press('Enter');

        // 6. Add Line Item (Reasonable Quantity & Cost)
        await page.getByRole('button', { name: 'Line Item' }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Item', exact: true }).click();

        await page.getByRole('button', { name: 'Item ID selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), 'inventory/RWT-8');

        // Reasonable inputs
        await page.locator('input[name="reason"]').last().fill('Replacement parts for generator');
        await page.getByRole('group').filter({ hasText: 'Quantity' }).getByRole('spinbutton').fill('10');
        await page.getByRole('group').filter({ hasText: 'Estimated Cost' }).getByRole('spinbutton').fill('2500.75');

        await page.getByRole('button', { name: 'Add', exact: true }).click();

        // 7. Submit (Add Now)
        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await expect(addNowBtn).toBeEnabled();
        await addNowBtn.click();

        // 8. Capture Document Details (ከ Detail Page ላይ)
        console.log("Waiting for Requisition Details page to load...");
        await page.waitForURL(/\/payables\/purchase-requisitions\/.*\/detail$/, { timeout: 90000 });
        await expect(page.locator('p:text("Requisition Number:")')).toBeVisible();

        // PR Number Capture (በሰጠኸው HTML Structure መሠረት)
        sharedPRNumber = (await page.locator('div:has(> p:text("Requisition Number:")) >> p.css-0').first().innerText()).trim();

        // Requested By Capture (ከሊንክ ውስጥ "Baye Shita" የሚለውን መውሰድ)
        capturedRequester = (await page.locator('div:has(> p:text("Requested By:")) >> a p.css-0').first().innerText()).trim();

        console.log(`--------------------------------------------------`);
        console.log(`SUCCESS: Document Captured!`);
        console.log(`PR Number: ${sharedPRNumber}`);
        console.log(`Requested By: ${capturedRequester}`);
        console.log(`--------------------------------------------------`);

        // 9. Run Full Approval Flow
        console.log("Starting approval sequence...");
        await app.handleApprovalFlow();

        console.log(`Status: ${sharedPRNumber} is now fully APPROVED.`);
    });
});