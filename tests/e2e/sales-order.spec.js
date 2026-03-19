const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Isolated Sales Order Creation', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // --- Inventory Helper ---

    async function getStockForItem(page, itemSearchTerm) {
        await page.goto('/inventories/items/?page=1&pageSize=15', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        const searchBox = page.getByRole('textbox', { name: 'Search', exact: true });
        await searchBox.waitFor({ state: 'visible', timeout: 15000 });
        await searchBox.fill(itemSearchTerm);
        await page.waitForTimeout(2500);

        // Force-click first result link to go to detail page
        const firstLink = page.locator('table tbody tr').first().locator('a').first();
        await firstLink.waitFor({ state: 'visible', timeout: 10000 });

        // Capture the exact item name shown in the table row before clicking and clean it
        let itemName = (await firstLink.innerText()).trim();
        itemName = itemName.split(' - ').pop().trim(); // Extract descriptive name
        console.log(`📦 Found item: "${itemName}"`);

        await firstLink.evaluate(node => node.click());
        await page.waitForURL(/\/inventories\/items\/.*/, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // Extract Current Stock from page body text
        let currentStock = 0;
        const bodyText = await page.locator('body').innerText();
        const stockMatch = bodyText.match(/Current Stock[^0-9]*([0-9][0-9,]*)/i);
        if (stockMatch) {
            currentStock = parseInt(stockMatch[1].replace(/,/g, ''), 10) || 0;
        }

        console.log(`📊 Current Stock for "${itemSearchTerm}": ${currentStock}`);
        return { itemName, currentStock };
    }

    // --- Line Item Helper (uses hardcoded "Control panal" - pre-verified in inventory) ---

    async function addLineItemByName(page, app, itemName, quantity) {
        console.log(`Action: Adding line item "${itemName}" with qty ${quantity} (pre-verified in inventory)...`);
        await page.click('button:has-text("Line Item")');
        await page.locator('button').filter({ hasText: /^Item$/ }).first().click();

        // Select the exact item we checked in inventory using hardcoded search
        await page.getByRole('button', { name: 'Item selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), itemName);
        await page.waitForTimeout(1000);

        // Set quantity
        await page.getByRole('group').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill(quantity.toString());

        // Use Default Warehouse / Default Warehouse Location (same as original fallback - safe since item is pre-verified)
        await page.locator('button#warehouse_id').evaluate(node => node.click());
        await page.getByText('Default Warehouse', { exact: true }).first().evaluate(node => node.click());
        await page.waitForTimeout(1000);

        await page.locator('button#location_id').evaluate(node => node.click());
        await page.getByText('Default Warehouse Location', { exact: true }).first().evaluate(node => node.click());
        await page.waitForTimeout(500);

        await app.selectRandomOption(page.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');
        await page.getByRole('button', { name: /^Add$/, exact: true }).evaluate(node => node.click());

        const validationError = page.locator('text=Insufficient stock');
        if (await validationError.isVisible({ timeout: 5000 }).catch(() => false)) {
            throw new Error(`Insufficient stock for item "${itemName}" with qty ${quantity}`);
        }

        console.log(`Action: Line item "${itemName}" at Default Warehouse Location added successfully.`);
    }

    // --- Main Test ---

    test('Standalone SO Creation and Approval', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);
        const { soDate } = app.getTransactionDates();

        // ============================================================
        // STEP 0: Pre-check Inventory
        // ============================================================
        const ITEM_SEARCH_TERM = 'control';
        console.log(`\n--- PRE-CHECK: Inventory Stock for "${ITEM_SEARCH_TERM}" ---`);
        const { itemName, currentStock: preStock } = await getStockForItem(page, ITEM_SEARCH_TERM);
        console.log(`✅ PRE-SALE Stock: ${preStock} for "${itemName}"`);

        if (preStock === 0) {
            throw new Error(`Item "${itemName}" has no stock. Cannot proceed with Sales Order.`);
        }

        // Pick a sale quantity between 1 and min(5, preStock)
        const saleQty = Math.floor(Math.random() * Math.min(5, preStock)) + 1;
        console.log(`📦 Sale Quantity: ${saleQty}`);

        // ============================================================
        // STEP 1: Create Sales Order using the exact inventory item
        // ============================================================
        console.log("\nExecution: Creating Isolated Sales Order...");
        await page.goto('/receivables/sale-orders/new');
        await app.fillDate(0, soDate);

        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        await addLineItemByName(page, app, itemName, saleQty);
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');

        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await expect(addNowBtn).toBeEnabled({ timeout: 15000 });
        await addNowBtn.click();

        await page.waitForURL(/\/receivables\/sale-orders\/.*\/detail$/, { timeout: 90000 });
        await page.getByText('Sales Order Details').first().waitFor({ timeout: 60000 });

        const sharedOrderNumber = (await page.locator('//p[text()="SO Number:"]/following-sibling::p').first().innerText({ timeout: 30000 })).trim();
        const customerLabel = page.locator('p.chakra-text').filter({ hasText: 'Customer:' });
        const customerValue = page.locator('div').filter({ has: customerLabel }).locator('p.chakra-text').nth(1);
        await customerValue.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
        const capturedCustomerName = (await customerValue.innerText().catch(() => "Unknown Customer")).trim();

        console.log(`Document Created: ${sharedOrderNumber} | Customer: ${capturedCustomerName}`);

        // ============================================================
        // STEP 2: Approve the SO
        // ============================================================
        await app.handleApprovalFlow();
        console.log(`✅ SO ${sharedOrderNumber} Approved.`);

        // ============================================================
        // STEP 3: Post-check Inventory Stock Impact
        // ============================================================
        console.log(`\n--- POST-CHECK: Inventory Stock for "${ITEM_SEARCH_TERM}" ---`);
        await page.waitForTimeout(5000);
        const { currentStock: postStock } = await getStockForItem(page, ITEM_SEARCH_TERM);

        console.log(`------------------------------------------`);
        console.log(`Pre-Sale  Stock : ${preStock}`);
        console.log(`Sale Qty        : ${saleQty}`);
        console.log(`Expected Post   : ${preStock - saleQty}`);
        console.log(`Actual Post     : ${postStock}`);
        console.log(`Impact Detected : ${postStock < preStock ? '✅ YES' : '❌ NO'}`);
        console.log(`------------------------------------------`);

        expect(postStock < preStock, `Stock should have decreased after sale. Pre: ${preStock}, Post: ${postStock}`).toBeTruthy();

        // ============================================================
        // STEP 4: Verify SO in Customer Profile
        // ============================================================
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
            if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await nextBtn.click();
                await page.waitForTimeout(2000);
            } else {
                break;
            }
        }

        expect(foundSO, `Sales Order ${sharedOrderNumber} was NOT found in ${capturedCustomerName}'s record.`).toBeTruthy();
        console.log("Status: Isolated Sales Order flow completed and verified.");
        await page.close();
    });
});