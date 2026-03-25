const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Purchase Requisition - Standalone Workflow', () => {

    test('Create Purchase Requisition and Verify Lifecycle', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);

        // 1. Login and Navigation
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        console.log("Execution: Navigating to New Purchase Requisition...");
        await page.goto('/payables/purchase-requisitions/new', { waitUntil: 'networkidle' });

        // 2. Date Setup
        // Dynamically calculate dates based on current field values
        console.log("Action: Setting Request and Delivery dates...");
        const reqBtn = page.locator('div, [role="group"]').filter({ has: page.getByText(/^Request Date$/i) }).last().locator('button').first();
        const reqDateText = await reqBtn.locator('div, span, *').last().textContent();
        const reqDay = parseInt((reqDateText || "").trim().split(/[\s,]+/)[1], 10) || 16;
        const delDay = reqDay + 2;
        console.log(`Info: Calculated Request Day: ${reqDay} -> Delivery Day: ${delDay}`);

        await app.pickDate('Request Date', reqDay);
        await app.pickDate('Delivery Date', delDay);
        console.log(`Status: Dates set successfully.`);

        await app.selectRandomOption(page.getByRole('button', { name: 'Requested By selector' }), 'Requested By');

        // Priority Level selection (randomized for testing range)
        const priorities = ['Low', 'Medium', 'High'];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        console.log(`Action: Setting Priority level to: ${priority}`);
        await page.getByText(priority, { exact: true }).click();

        // Optional Segment and Vendor selection
        await app.selectRandomOption(page.getByRole('button', { name: 'Segment selector' }), 'Segment', true);
        await app.selectRandomOption(page.getByRole('button', { name: 'Suggested Vendors selector' }), 'Suggested Vendors', true);

        // Fill supplementary info
        await page.getByRole('textbox', { name: /Reason for Requisition/i }).fill('Automated PR for inventory replenishment.');
        await page.getByRole('textbox', { name: /Location/i }).fill('Addis Ababa');

        // 3. Add Line Item via Modal
        console.log("Action: Adding Line Item...");
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });

        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        await app.selectRandomOption(modal.getByRole('button', { name: 'Item ID selector' }), 'Item ID');

        const qty = (Math.floor(Math.random() * 10) + 1).toString();
        const cost = (Math.floor(Math.random() * 5000) + 1000).toString();

        await modal.getByRole('group').filter({ hasText: /Quantity/i }).getByRole('spinbutton').fill(qty);
        await modal.getByRole('group').filter({ hasText: /Estimated Cost/i }).getByRole('spinbutton').fill(cost);
        await modal.locator('textarea, input[type="text"]').last().fill('Project Requirement');

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible({ timeout: 15000 });

        // 4. Submission
        console.log("Action: Submitting Purchase Requisition...");
        const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addNowBtn).toBeEnabled({ timeout: 15000 });

        // Use deep click to ensure submission state commits
        await addNowBtn.evaluate((node) => {
            node.click();
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // 5. Verification of successful creation
        await page.waitForURL(/\/payables\/purchase-requisitions\/.*\/detail$/, { timeout: 120000 });

        const prNumber = (await page.locator('p.chakra-text').filter({ hasText: /^PR\// }).first().innerText({ timeout: 30000 })).trim();
        console.log(`Status: [SUCCESS] Purchase Requisition Created: ${prNumber}`);

        // 6. Execute Approval Workflow
        await app.handleApprovalFlow();

        console.log(`Status: Purchase Requisition ${prNumber} workflow completed.`);
        await page.close();
    });
});
