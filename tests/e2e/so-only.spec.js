const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Isolated Sales Order Creation', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });




    // --- Core Helper Functions ---


    test('Standalone SO Creation and Approval', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        const { soDate } = app.getTransactionDates();

        console.log("Execution: Creating Isolated Sales Order...");
        await page.goto('/receivables/sale-orders/new');

        await app.fillDate(0, soDate);

        // 1. Dynamic Customer Selection
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');

        // 2. Tiered Line Item Selection (Random then Falling back to hardcoded)
        await addLineItem(page, app);

        // 3. Dynamic Accounts Receivable
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');

        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await expect(addNowBtn).toBeEnabled({ timeout: 15000 });
        await addNowBtn.click();

        // Wait for page transition and header
        await page.waitForURL(/\/receivables\/sale-orders\/.*\/detail$/, { timeout: 90000 });
        await page.getByText('Sales Order Details').first().waitFor({ timeout: 60000 });

        const sharedOrderNumber = (await page.locator('//p[text()="SO Number:"]/following-sibling::p').first().innerText()).trim();
        const capturedCustomerName = (await page.locator('//p[text()="Customer:"]/following-sibling::p').first().innerText()).trim();

        console.log(`Document Created: ${sharedOrderNumber} | Customer: ${capturedCustomerName}`);

        await app.handleApprovalFlow();

        // -- VERIFICATION: Check Customer Sales Order Tab --
        console.log(`Verification: Searching for ${sharedOrderNumber} in Customer Details (${capturedCustomerName})...`);

        await page.goto('/receivables/customers');

        const searchInput = page.locator('input[placeholder="Search for customers..."]');
        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await searchInput.fill(capturedCustomerName);
        await page.waitForTimeout(2000);

        const customerLink = page.locator('table tbody tr').filter({ hasText: capturedCustomerName }).first().locator('td a').first();
        await customerLink.click({ force: true });

        await page.waitForSelector('text=Customer Details', { timeout: 30000 });

        await page.getByRole('tab', { name: 'Sales Orders' }).click();
        await page.waitForTimeout(2000);

        let foundSO = false;
        let pageLoops = 0;

        while (!foundSO && pageLoops < 10) {
            pageLoops++;

            const soLink = page.locator(`a:has-text("${sharedOrderNumber}")`);

            if (await soLink.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log(`Success: Found ${sharedOrderNumber} on page ${pageLoops}.`);
                foundSO = true;
                break;
            }

            const nextBtnShape = 'M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z';
            const nextBtn = page.locator(`button:not([disabled]):has(svg > path[d="${nextBtnShape}"])`).first();
            const fallbackNextBtn = page.getByRole('button', { name: /next page/i });

            let clickedNext = false;

            if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await nextBtn.click();
                clickedNext = true;
            } else if (await fallbackNextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await fallbackNextBtn.click();
                clickedNext = true;
            }

            if (clickedNext) {
                console.log(`Pagination: Advancing to next page for ${sharedOrderNumber}...`);
                await page.waitForTimeout(2000);
            } else {
                console.log(`Status: Reached end of pagination. Document not found.`);
                break;
            }
        }

        expect(foundSO, `Sales Order ${sharedOrderNumber} was NOT found in ${capturedCustomerName}'s record.`).toBeTruthy();

        console.log("Status: Isolated Sales Order flow completed and verified.");

        await page.close();
    });

    async function addLineItem(page, app, forceHardcoded = false) {
        if (!forceHardcoded) {
            console.log("Action: Attempting to add a random line item...");
            await page.click('button:has-text("Line Item")');
            await page.locator('button').filter({ hasText: /^Item$/ }).first().click();

            await app.selectRandomOption(page.getByRole('button', { name: 'Item selector' }), 'Item');
            await page.getByRole('group').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill('1');

            let locationCount = 0;
            let attempts = 0;
            while (locationCount === 0 && attempts < 5) {
                attempts++;
                await app.selectRandomOption(page.locator('button#warehouse_id'), `WH Attempt ${attempts}`);
                await page.waitForTimeout(1000);
                locationCount = await app.selectRandomOption(page.locator('button#location_id'), 'Location', true);
            }

            await app.selectRandomOption(page.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');
            await page.getByRole('button', { name: /^Add$/, exact: true }).evaluate(node => node.click());

            // Validation check for stock
            const validationError = page.locator('text=Insufficient stock');
            if (await validationError.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log("Status: Insufficient stock detected. Removing items and performing fallback...");

                // Remove the failed line item using the specific "X" / delete button
                const removeBtn = page.locator('svg.lucide-delete, [d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"]').first();
                await removeBtn.click();
                await page.waitForTimeout(1000);

                // Fallback attempt
                return addLineItem(page, app, true);
            }
            console.log("Action: Random line item added successfully.");
        } else {
            console.log("Action: Adding reliable line item (Control panal)...");
            await page.click('button:has-text("Line Item")');
            await page.locator('button').filter({ hasText: /^Item$/ }).first().click();

            await page.getByRole('button', { name: 'Item selector' }).click();
            await app.smartSearch(page.getByRole('dialog'), 'Control panal');

            await page.getByRole('group').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill('1');

            await page.locator('button#warehouse_id').evaluate(node => node.click());
            await page.getByText('Default Warehouse', { exact: true }).first().evaluate(node => node.click());

            await page.locator('button#location_id').evaluate(node => node.click());
            await page.getByText('Default Warehouse Location', { exact: true }).first().evaluate(node => node.click());

            await app.selectRandomOption(page.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');
            await page.getByRole('button', { name: /^Add$/, exact: true }).evaluate(node => node.click());
            console.log("Action: Fallback line item added successfully.");
        }
    }
});