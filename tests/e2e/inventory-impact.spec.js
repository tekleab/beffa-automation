const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Inventory Impact Verification', () => {

    test('Pre/Post Stock Verification via Complete Sales Cycle', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);
        const { soDate } = app.getTransactionDates();
        const { invoiceDate, dueDate } = app.getInvoiceDates();

        console.log("[ACTION] Attempting login for: " + process.env.BEFFA_USER);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // PATIENCE: Wait for login redirect to stabilize
        console.log("[WAIT] Patience after login...");
        await page.waitForTimeout(5000);

        // STEP 1: Capture Pre-Sale Data
        console.log("[STEP 1] Capturing PRE-SALE Inventory Data (Random Selection)");
        let itemDetails = null;

        while (true) {
            itemDetails = await app.captureRandomItemDetails();
            if (itemDetails.currentStock > 0) {
                console.log(`[SUCCESS] Selected item with stock: ${itemDetails.itemName} (${itemDetails.currentStock} units)`);
                break;
            }
            console.log(`[INFO] Item "${itemDetails.itemName}" has 0 stock. Picking another random item...`);
        }

        // STEP 2: Create Sales Order
        console.log("[STEP 2] Creating Sales Order");
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        await app.fillDate(0, soDate);

        // Select Customer
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        const customerFullText = (await page.locator('button[aria-label="Customer selector"]').innerText()).trim();
        const capturedCustomerSearchTerm = customerFullText.match(/^([A-Z0-9\/_-]+)\s*-/i)?.[1] || customerFullText;

        const saleQty = Math.floor(Math.random() * Math.min(itemDetails.currentStock, 5)) + 1;
        console.log(`[INFO] Targeted Sale Quantity: ${saleQty}`);

        // Add the captured item
        console.log(`[ACTION] Adding "${itemDetails.itemName}" to SO...`);
        const lineItemBtn = page.getByRole('button', { name: 'Line Item' });
        await lineItemBtn.click();

        await page.locator('button').filter({ hasText: /^Item$/ }).first().click();
        const itemSelector = page.getByRole('button', { name: 'Item selector' });
        let itemStuck = false;
        for (let retry = 1; retry <= 3; retry++) {
            await itemSelector.click();
            await app.smartSearch(page.getByRole('dialog'), itemDetails.itemName);
            await page.waitForTimeout(2000);
            const val = (await itemSelector.innerText()).trim();
            console.log(`[INFO] Item selection (Retry ${retry}): "${val}"`);
            if (val.length > 2) { itemStuck = true; break; }
        }

        // Warehouse & Location
        await page.locator('button#warehouse_id').click();
        await page.getByText('Default Warehouse', { exact: true }).first().click();
        await page.waitForTimeout(500);

        await page.locator('button#location_id').click();
        await page.getByText('Default Warehouse Location', { exact: true }).first().click();
        await page.waitForTimeout(500);

        // Sales Account
        console.log(`[ACTION] Selecting appropriate G/L Account: Sales`);
        const glSelector = page.getByRole('button', { name: 'G/L Account selector' });
        await glSelector.click();
        await app.smartSearch(page.getByRole('dialog'), 'Sales');
        console.log("[WAIT] Stabilizing after G/L selection...");
        await page.waitForTimeout(2000);
        const val = (await glSelector.innerText()).trim();
        console.log(`[INFO] G/L Account selection: "${val}"`);

        await page.getByRole('group').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill(saleQty.toString());

        const addBtn = page.getByRole('button', { name: /^Add$/, exact: true });
        await addBtn.click({ force: true });
        await page.waitForTimeout(3000);

        // Force-close modal if still visible (prevents browser closure)
        const lineModal = page.getByRole('dialog').last();
        if (await lineModal.isVisible({ timeout: 1000 }).catch(() => false)) {
            console.log("[WAIT] Modal still visible after Add. Closing...");
            const cancelBtn = lineModal.getByRole('button', { name: 'Cancel' });
            await cancelBtn.click({ force: true }).catch(() => { });
            await lineModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
            await page.waitForTimeout(1000);
        }

        // Finalize SO
        console.log("[ACTION] Finalizing SO...");
        await page.locator('button#accounts_receivable_id').click();
        await page.waitForTimeout(500);
        await app.smartSearch(page.getByRole('dialog'), 'Accounts Receivable');

        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await expect(addNowBtn).toBeEnabled({ timeout: 15000 });
        await addNowBtn.click();

        await page.waitForURL(/\/receivables\/sale-orders\/.*\/detail$/, { timeout: 90000 });
        const soNumber = (await page.locator('//p[text()="SO Number:"]/following-sibling::p').first().innerText()).trim();
        console.log(`[SUCCESS] Sales Order Created: ${soNumber}`);

        await app.handleApprovalFlow();
        console.log(`[SUCCESS] Sales Order Approved: ${soNumber}`);

        // STEP 3: Create Invoice from SO
        console.log("[STEP 3] Creating Invoice from SO");
        await page.goto('/receivables/invoices/new', { waitUntil: 'networkidle' });

        await page.getByRole('button', { name: 'Customer selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), capturedCustomerSearchTerm);

        await app.fillDate(0, invoiceDate);
        await app.fillDate(1, dueDate);
        await page.locator('button#accounts_receivable_id').click();
        await app.smartSearch(page.getByRole('dialog'), 'Accounts Receivable');

        console.log(`[ACTION] Linking Sales Order ${soNumber}...`);
        await page.getByText('Sales Order', { exact: true }).click();
        await app.smartSearch(page.getByRole('dialog'), soNumber);
        await page.waitForTimeout(1500);

        const releasedTab = page.getByRole('tab', { name: /Released Sales Order/i });
        await releasedTab.waitFor({ state: 'visible' });
        await releasedTab.click({ force: true });

        const releasedTabPanel = page.getByRole('tabpanel', { name: 'Released Sales Order' });
        await releasedTabPanel.locator('tbody').waitFor({ state: 'visible' });
        const row = releasedTabPanel.locator('table tbody tr').first();
        const checkboxEl = row.locator('input[type="checkbox"], [role="checkbox"], .chakra-checkbox__control, .chakra-checkbox').first();
        await checkboxEl.evaluate(node => node.click());
        await page.waitForTimeout(500);

        // Read the "Remaining" quantity from the 6th column (index 5)
        const remainingVal = await row.locator('td').nth(5).innerText();
        let remainingQty = remainingVal.replace(/[^0-9.]/g, '').split('.')[0] || saleQty.toString();
        console.log(`[INFO] Filling Received Quantity with Remaining: ${remainingQty}`);

        // Fill received quantity dynamically based on Remaining
        const qtyInput = row.locator('input[type="number"], input.chakra-input').first();
        if (await qtyInput.isVisible()) {
            await qtyInput.fill(remainingQty);
            await qtyInput.evaluate(node => node.dispatchEvent(new Event('input', { bubbles: true }))); // Ensure React detects the change
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500);
        }

        await page.getByRole('button', { name: 'Add Now' }).first().click({ force: true });
        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/, { timeout: 90000 });

        const invoiceNumber = (await page.locator('p.chakra-text').filter({ hasText: /^INV\// }).first().innerText()).trim();
        console.log(`[SUCCESS] Invoice Created: ${invoiceNumber}`);

        await app.handleApprovalFlow();
        console.log(`[SUCCESS] Invoice Approved: ${invoiceNumber}`);

        // STEP 4: Financial Verification (Invoice)
        console.log("[STEP 4] Financial Verification");
        const journalEntries = await app.captureJournalEntries();
        await app.verifyAllJournalEntries(invoiceNumber, journalEntries);

        // STEP 5: Post-Flow Stock Verification
        console.log("[STEP 5] Verifying POST-FLOW Stock Impact");
        const postDetails = await app.captureItemDetails(itemDetails.itemName);
        const expectedStock = itemDetails.currentStock - saleQty;
        console.log(`[INFO] Pre-Sale: ${itemDetails.currentStock} | Sold: ${saleQty} | Expected: ${expectedStock} | Actual: ${postDetails.currentStock}`);

        expect(postDetails.currentStock).toBe(expectedStock);
        console.log("[STATUS] Full Inventory Impact and Financial Flow Verified Successfully.");
        await page.close();
    });
});
