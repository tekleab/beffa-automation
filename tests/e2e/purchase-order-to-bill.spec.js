const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Purchase Order - Standalone Workflow', () => {

    test('Create Purchase Order and Verify Lifecycle', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);

        // 1. Login and Navigation
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        console.log('Execution: Navigating to New Purchase Order...');
        await page.goto('/payables/purchase-orders/new', { waitUntil: 'networkidle' });

        // 2. Order Date Setup
        console.log('Action: Setting Order Date...');
        // Parse the day number from the date button text (e.g. "Month 16, Year")
        const orderBtn = page.locator('div, [role="group"]')
            .filter({ has: page.getByText(/^Purchase Order Date$/i) })
            .last()
            .locator('button').first();
        const orderBtnName = await orderBtn.getAttribute('aria-label')
            .catch(() => null)
            || await orderBtn.locator('generic, div, span').last().textContent({ timeout: 5000 }).catch(() => '');
        const orderDay = parseInt((orderBtnName || '').trim().split(/[\s,]+/)[1], 10) || 16;
        await app.pickDate('Purchase Order Date', orderDay);
        console.log(`Status: Order Date set to day ${orderDay}.`);


        // 3. Vendor Selection
        const vendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        await app.selectRandomOption(vendorBtn, 'Vendor');
        // The button text updates to the selected vendor's name
        const selectedVendor = (await vendorBtn.textContent({ timeout: 5000 })).trim() || 'Unknown Vendor';
        console.log(`Info: Selected Vendor: ${selectedVendor}`);

        // 4. Quotes Selection (Optional)
        console.log('Action: Checking for available Quotes...');
        try {
            const quotesBtn = page.getByRole('button', { name: 'Quotes selector' });
            await quotesBtn.scrollIntoViewIfNeeded();
            await quotesBtn.click({ timeout: 5000 });
            await page.waitForTimeout(1500);

            // Quotes explicitly start with QTE/YYYY
            const quoteOptions = page.locator('button, div[role="group"], [role="option"], [role="menuitem"]').filter({ hasText: /^QTE\/\d{4}/ }).filter({ visible: true });
            const quoteCount = await quoteOptions.count();

            if (quoteCount > 0) {
                const randomIdx = Math.floor(Math.random() * quoteCount);
                await quoteOptions.nth(randomIdx).click({ force: true });
                await page.waitForTimeout(500);
                console.log(`Status: Quote selected (${quoteCount} available).`);
            } else {
                await page.keyboard.press('Escape');
                console.log('Info: No Quotes available — skipping.');
            }
        } catch (err) {
            await page.keyboard.press('Escape').catch(() => { });
            console.log('Info: Quotes field not interactable — skipping.');
        }

        // 5. Financial Mappings
        await app.selectRandomOption(
            page.getByRole('button', { name: 'Accounts Payable selector' }),
            'Accounts Payable'
        );

        // Purchase Type (required)
        await app.selectRandomOption(
            page.getByRole('button', { name: 'Purchase Type selector' }),
            'Purchase Type'
        );

        // Discount Term (optional)
        await app.selectRandomOption(
            page.getByRole('button', { name: 'Discount Term selector' }),
            'Discount Term',
            true
        );

        // 6. Add Purchase Order Line Item
        console.log('Action: Adding Line Item...');
        await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible', timeout: 15000 });

        // Item tab inside modal
        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Item');

        // Warehouse
        await app.selectRandomOption(
            modal.getByRole('button', { name: 'Warehouse selector' }),
            'Warehouse'
        );

        // Location
        await app.selectRandomOption(
            modal.getByRole('button', { name: 'Location selector' }),
            'Location'
        );

        // G/L Account
        await app.selectRandomOption(
            modal.getByRole('button', { name: 'G/L Account selector' }),
            'G/L Account'
        );

        // Quantity (random between 1-10)
        const qty = (Math.floor(Math.random() * 10) + 1).toString();
        await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill(qty);

        // Unit Price (random between 1000–9999)
        const unitPrice = (Math.floor(Math.random() * 9000) + 1000).toString();
        await modal.getByRole('group').filter({ hasText: /Unit Price/i }).getByRole('spinbutton').fill(unitPrice);

        // Tax (optional)
        await app.selectRandomOption(
            modal.getByRole('button', { name: 'Tax selector' }),
            'Tax',
            true
        );

        // Confirm line item
        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible({ timeout: 15000 });
        console.log(`Status: Line item added (Unit Price: ${unitPrice}).`);

        // 7. Order Submission
        console.log('Action: Submitting Purchase Order...');
        const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addNowBtn).toBeEnabled({ timeout: 15000 });
        await addNowBtn.evaluate((node) => {
            node.click();
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // 8. Capture and Verify Details
        await page.waitForURL(/\/payables\/purchase-orders\/.*\/detail$/, { timeout: 120000 });

        // Wait specifically for the element containing the generated PO number to attach to the DOM
        const poElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^PO\/\d{4}\// }).first();
        await poElement.waitFor({ state: 'attached', timeout: 30000 });

        // Robust PO Number Extraction using textContent to bypass CSS-hiding
        const poText = await poElement.textContent();
        const poMatch = poText.match(/PO\/\d{4}\/\d{2}\/\d{2}\/\d+/);
        const poNumber = poMatch ? poMatch[0] : (poText || '').trim();

        console.log(`Status: [SUCCESS] Purchase Order Created: ${poNumber} | Vendor: ${selectedVendor}`);

        // 9. Execute Approval Flow
        await app.handleApprovalFlow();

        console.log(`Status: Purchase Order ${poNumber} workflow completed.`);

        // ==========================================
        //         BILL CREATION WORKFLOW
        // ==========================================
        console.log("------------------------------------------");
        console.log(`Action: Starting Bill Creation for PO: ${poNumber}...`);

        // Force a page unmount/reload to prevent SPA routing deadlocks when jumping between intense forms
        await page.reload({ waitUntil: 'networkidle' });
        await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });

        // Bill details selection matching the PO
        console.log(`Action: Matching Vendor: ${selectedVendor}...`);
        const billVendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        await billVendorBtn.waitFor({ state: 'visible' });
        await billVendorBtn.click({ timeout: 5000 });
        
        // ⚡ Use Smart Search to filter and select the exact vendor
        // Note: smartSearch already handles the click for exact matches
        await app.smartSearch(null, selectedVendor);
        await page.waitForTimeout(1000); // ⚡ Allow PO list to update after vendor selection

        console.log(`Action: Linking PO Number: ${poNumber}...`);
        const billPOBtn = page.getByRole('button', { name: 'Purchase Order selector' });
        await expect(billPOBtn).toBeEnabled({ timeout: 15000 });
        await billPOBtn.click({ timeout: 5000 });
        
        // ⚡ Use Smart Search to filter and select the exact PO
        await app.smartSearch(null, poNumber);
        await page.keyboard.press('Escape');

        // Date configuration
        console.log("Action: Configuring Bill dates...");
        const todayNum = new Date().getDate();
        await app.pickDate('Invoice Date', todayNum);
        await app.pickDate('Due Date', todayNum);

        // Accounts Payable
        console.log("Action: Selecting Accounts Payable...");
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');

        // Handle Item Receipt logic using the robust AppManager helper
        await app.handlePOReceiptTab();

        // Committing Bill creation
        console.log("Action: Submitting the Bill...");
        const addBillBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addBillBtn).toBeEnabled({ timeout: 10000 });
        await addBillBtn.evaluate(node => node.click());

        // Final verification
        await page.waitForURL(/\/payables\/bills\/.*\/detail$/, { timeout: 120000 });
        console.log("Status: Detail page loaded. Capturing Bill info...");

        const billElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^BILL\/\d{4}\// }).first();
        await billElement.waitFor({ state: 'attached', timeout: 30000 });

        const billText = await billElement.textContent();
        const billMatch = billText.match(/BILL\/\d{4}\/\d{2}\/\d{2}\/\d+/);
        const billNumber = billMatch ? billMatch[0] : (billText || '').trim();

        console.log("------------------------------------------");
        console.log(`Summary: Documents Created:`);
        console.log(`Bill ID: ${billNumber}`);
        console.log(`Vendor: ${selectedVendor}`);
        console.log("------------------------------------------");

        // Bill Approval Flow
        await app.handleApprovalFlow();

        // Vendor Profile Verification
        console.log(`Action: Verifying ${billNumber} inside Vendor Profile (${selectedVendor})...`);
        await app.verifyDocInProfile('vendor', selectedVendor, billNumber);

        console.log(`Status: Full Cycle Success! PO ${poNumber} -> Bill ${billNumber}.`);
        await page.close();
    });
});
