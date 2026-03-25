const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Bill Creation - Automated PO Search and Line Item Management', () => {

    /**
     * Helper to find a vendor that has at least one associated Purchase Order.
     * Retries up to 15 times with different random vendors.
     */
    async function ensureVendorWithPO(page, app) {
        const vendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        const poBtn = page.getByRole('button', { name: 'Purchase Order selector' });
        const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], [role="menuitem"], .chakra-menu__menuitem';

        for (let i = 0; i < 15; i++) {
            console.log(`\nAttempt ${i + 1}: Selecting Vendor...`);

            // Select a random vendor
            await app.selectRandomOption(vendorBtn, 'Vendor');

            // Wait for PO list to update
            await expect(poBtn).toBeEnabled({ timeout: 10000 });
            await page.waitForTimeout(3000);

            // Open PO selector
            await poBtn.evaluate(node => node.click());

            const poOptions = page.locator(optionSelector).filter({ visible: true });
            try {
                await poOptions.first().waitFor({ state: 'visible', timeout: 5000 });
            } catch (error) {
                // Ignore timeout if list is empty
            }

            const poCount = await poOptions.count();
            if (poCount > 0) {
                console.log(`Status: Found ${poCount} POs. Selecting first available.`);
                await poOptions.first().evaluate(node => node.click());
                await page.keyboard.press('Escape');
                console.log("Status: PO linked successfully.");
                return true;
            } else {
                console.log("Info: No POs available for this vendor. Retrying...");
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);
            }
        }
        throw new Error("Unable to identify a vendor with associated POs after 15 attempts.");
    }

    test('Create Bill with PO and Capture Data', async ({ page }) => {
        test.setTimeout(500000);
        const app = new AppManager(page);

        // 1. Login and Navigation
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        console.log("Execution: Navigating to New Bill...");
        await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });

        // 2. Resource linking
        await ensureVendorWithPO(page, app);

        // 3. Date Configuration
        console.log("Action: Configuring Bill dates...");
        const datePickers = page.locator('button:has(span.formatted-date), button:has(img)');
        const today = new Date().getDate().toString();

        await datePickers.nth(1).evaluate(node => node.click()); // Invoice Date
        await page.getByRole('button', { name: today, exact: true }).first().evaluate(node => node.click());

        await page.waitForTimeout(1000);
        await datePickers.nth(0).evaluate(node => node.click()); // Due Date
        await page.getByRole('button', { name: today, exact: true }).first().evaluate(node => node.click());

        // 4. Financial Configuration
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');

        // 5. Link items in Received Purchase Order Tab
        console.log("Action: Receiving items from linked Purchase Order...");
        const receivedPoTab = page.getByRole('tab', { name: 'Received Purchase Order' });
        await receivedPoTab.waitFor({ state: 'visible', timeout: 5000 });
        await receivedPoTab.evaluate(node => node.click());
        await page.waitForTimeout(2000);

        const checkbox = page.locator('.chakra-checkbox__control').first();
        if (await checkbox.isVisible()) {
            await checkbox.evaluate(node => node.click());
            await page.waitForTimeout(1000);

            const qtyInput = page.locator('input[id*="received_quantity"]').first();
            if (await qtyInput.isVisible()) {
                const currentValStr = await qtyInput.inputValue();
                const currentVal = parseFloat(currentValStr);
                if (!isNaN(currentVal) && currentVal > 1) {
                    const fillValue = Math.floor(currentVal / 2) || 1;
                    await qtyInput.fill(fillValue.toString());
                    console.log(`Info: Adjusted Quantity to: ${fillValue}`);
                } else {
                    await qtyInput.fill('1');
                    console.log(`Info: Set Quantity to default: 1`);
                }
            }
        }

        // 6. Add Standalone Line Items
        console.log("Action: Adding direct Purchase Line Item...");
        await page.getByRole('tab', { name: 'Purchases' }).evaluate(node => node.click());
        await page.waitForTimeout(1000);

        await page.getByRole('button', { name: 'Line Item' }).evaluate(node => node.click());
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });

        await modal.getByRole('button', { name: 'Item', exact: true }).evaluate(node => node.click());
        await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Inventory Item');

        await page.waitForTimeout(2000);
        await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await page.waitForTimeout(3000);
        await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');

        const randomPrice = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        const randomQty = Math.floor(Math.random() * 5) + 1;
        await modal.locator('div.chakra-form-control').filter({ hasText: /^Unit Price \*/ }).getByRole('spinbutton').fill(randomPrice.toString());
        await modal.locator('div.chakra-form-control').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill(randomQty.toString());
        await app.selectRandomOption(modal.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');

        await modal.getByRole('button', { name: 'Add', exact: true }).evaluate(node => node.click());
        await expect(modal).not.toBeVisible({ timeout: 15000 });

        // 7. Submission
        console.log("Action: Submitting Bill...");
        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await page.waitForTimeout(2000);
        await expect(addNowBtn).toBeEnabled();
        await addNowBtn.evaluate(node => node.click());

        // --- 8. Verification and Capture ---
        await page.waitForURL(/\/payables\/bills\/.*\/detail$/, { waitUntil: 'networkidle' });
        console.log("Status: Detail page loaded. Capturing registration info...");

        const billNumLocator = page.locator('p.chakra-text').filter({ hasText: /BILL\/\d{4}/ }).first();
        await billNumLocator.waitFor({ state: 'visible', timeout: 30000 });
        const capturedBillNumber = (await billNumLocator.innerText()).trim();

        const vendorValue = page.locator('p').filter({ hasText: /vendor:/i }).locator('xpath=following-sibling::p').first();
        await vendorValue.waitFor({ state: 'visible', timeout: 15000 });
        const capturedVendor = (await vendorValue.innerText()).trim();

        console.log("------------------------------------------");
        console.log(`Summary: Documents Created:`);
        console.log(`Bill ID: ${capturedBillNumber}`);
        console.log(`Vendor: ${capturedVendor}`);
        console.log("------------------------------------------");

        // 9. Execute Approval Flow
        await app.handleApprovalFlow();

        // 10. Status Verification
        const statusValue = page.locator('p').filter({ hasText: /Status:/i }).locator('xpath=following-sibling::p').first();
        await expect(statusValue).toContainText('Approved', { timeout: 15000 });

        // 11. Cross-Verification
        await app.verifyDocInProfile('vendor', capturedVendor, capturedBillNumber);

        console.log(`Status: Bill ${capturedBillNumber} verified successfully.`);
        await page.close();
    });
});