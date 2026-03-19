const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Bill Creation - Automated PO Search and Line Item Management', () => {


    // Wait loop to ensure the selected vendor has an associated PO
    async function ensureVendorWithPO(page, app) {
        const vendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        const poBtn = page.getByRole('button', { name: 'Purchase Order selector' });
        const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], .chakra-menu__menuitem';

        for (let i = 0; i < 15; i++) {
            console.log(`\n🔄 Attempt ${i + 1}: Selecting Vendor...`);

            // 1. Select a random vendor
            await app.selectRandomOption(vendorBtn, 'Vendor');

            // 2. Wait for the PO list to reflect the new vendor selection
            // PO Stability: wait for the PO selector to be enabled and the list to fully populate
            await expect(poBtn).toBeEnabled({ timeout: 10000 });
            await page.waitForTimeout(3000);

            // 3. Open the PO selector
            await poBtn.evaluate(node => node.click()); // Bypass actionability

            // Wait specifically for the first option to become visible to account for latency
            const poOptions = page.locator(optionSelector).filter({ visible: true });

            try {
                // Wait up to 5 seconds for the list elements to actually populate
                await poOptions.first().waitFor({ state: 'visible', timeout: 5000 });
            } catch (error) {
                // If it times out, the list is empty (or extreme latency)
            }

            const poCount = await poOptions.count();

            if (poCount > 0) {
                console.log(`✅ Found ${poCount} POs. Selecting one...`);
                // evaluate for PO selection
                await poOptions.first().evaluate(node => node.click());
                await page.keyboard.press('Escape');
                console.log("🎯 PO Successfully Selected!");
                return true;
            } else {
                console.log("❌ No POs available for this vendor. Pressing Escape and retrying...");
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);
            }
        }
        throw new Error("Unable to find a vendor with an associated PO after 15 attempts.");
    }

    test('Create Bill with PO and Capture Data', async ({ page }) => {
        test.setTimeout(500000);
        const app = new AppManager(page);

        // 1. Login and Navigation
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });

        // 2. Select Vendor and associated PO
        await ensureVendorWithPO(page, app);

        // 3. Select Dates (Set Due Date and Invoice Date to today)
        console.log("📅 Configuring dates...");
        const datePickers = page.locator('button:has(span.formatted-date), button:has(img)');
        const today = new Date().getDate().toString();

        await datePickers.nth(1).evaluate(node => node.click()); // Invoice Date
        await page.getByRole('button', { name: today, exact: true }).first().evaluate(node => node.click());

        await page.waitForTimeout(1000);
        await datePickers.nth(0).evaluate(node => node.click()); // Due Date
        await page.getByRole('button', { name: today, exact: true }).first().evaluate(node => node.click());

        // 4. Select Accounts Payable
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');

        // 5. Link items from Received Purchase Order Tab
        console.log("📦 Selecting items from the Received Purchase Order...");
        const receivedPoTab = page.getByRole('tab', { name: 'Received Purchase Order' });
        await receivedPoTab.waitFor({ state: 'visible', timeout: 5000 });
        await receivedPoTab.evaluate(node => node.click());
        await page.waitForTimeout(2000);

        const checkbox = page.locator('.chakra-checkbox__control').first();
        if (await checkbox.isVisible()) {
            await checkbox.evaluate(node => node.click());
            await page.waitForTimeout(1000);

            // Re-fetch the row to get the remaining quantity info (usually the cell right before the input)
            // It's robust to just find the input and then grab its value or adjacent limit.
            // Since we know the input has an id with "received_quantity", it typically has a max attribute or we can read the row.
            // Beffa's setup sometimes puts the max remaining quantity straight into the input value upon clicking the checkbox.
            const qtyInput = page.locator('input[id*="received_quantity"]').first();

            if (await qtyInput.isVisible()) {
                // If it auto-filled with the max remaining quantity upon checking
                const currentValStr = await qtyInput.inputValue();
                const currentVal = parseFloat(currentValStr);

                if (!isNaN(currentVal) && currentVal > 1) {
                    // Just take a portion, e.g., half of what's left, or default back to 1 if it's 1
                    const fillValue = Math.floor(currentVal / 2) || 1;
                    await qtyInput.fill(fillValue.toString());
                    console.log(`📦 Filled Dynamic Quantity: ${fillValue} (Originally ${currentVal})`);
                } else {
                    // Fallback to 1 if undefined/NaN or already 1
                    await qtyInput.fill('1');
                    console.log(`📦 Filled Fallback Quantity: 1`);
                }
            }
        }

        // 6. Add Standalone Line Items (Purchases Tab)
        console.log("➕ Adding standalone line items in Purchases tab...");
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
        console.log(`➕ Filled Standalone Line Item: Qty = ${randomQty}, Unit Price = ${randomPrice}`);
        await app.selectRandomOption(modal.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');

        await modal.getByRole('button', { name: 'Add', exact: true }).evaluate(node => node.click());
        await expect(modal).not.toBeVisible({ timeout: 15000 });

        // 7. Submit (Add Now)
        console.log("🚀 Submitting the Bill...");
        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await page.waitForTimeout(2000);
        await expect(addNowBtn).toBeEnabled();
        await addNowBtn.evaluate(node => node.click());

        // --- 8. Data Capture (Before Approval) ---
        await page.waitForURL(/\/payables\/bills\/.*\/detail$/, { waitUntil: 'networkidle' });
        console.log("Detail page loaded. Capturing information...");

        // Capture Bill Number
        const billNumLocator = page.locator('p.chakra-text').filter({ hasText: /BILL\/\d{4}/ }).first();
        await billNumLocator.waitFor({ state: 'visible', timeout: 30000 });
        const capturedBillNumber = await billNumLocator.innerText();

        // Capture Vendor Name
        const vendorLabel = page.locator('p.chakra-text').filter({ hasText: 'Vendor:' });
        const vendorValue = page.locator('div').filter({ has: vendorLabel }).locator('p.chakra-text').nth(1);

        await vendorValue.waitFor({ state: 'visible', timeout: 15000 });
        const capturedVendor = await vendorValue.innerText();

        // Display captured report
        console.log("------------------------------------------");
        console.log(`📍 DATA CAPTURED BEFORE APPROVAL:`);
        console.log(`📌 Bill ID: ${capturedBillNumber}`);
        console.log(`📌 Vendor: ${capturedVendor}`);
        console.log("------------------------------------------");

        // 9. Approval Flow
        console.log("Starting Approval process for " + capturedBillNumber);
        await app.handleApprovalFlow();

        // 10. Summary
        console.log(`✅ Bill ${capturedBillNumber} has been captured and approved!`);
    });
});