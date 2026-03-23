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
        }

        // STEP 2: Create Sales Order
        console.log("[STEP 2] Creating Sales Order");
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'networkidle' });
        await app.fillDate(0, soDate);

        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        const customerFullText = (await page.locator('button[aria-label="Customer selector"]').innerText()).trim();
        const capturedCustomerSearchTerm = customerFullText.match(/^([A-Z0-9\/_-]+)\s*-/i)?.[1] || customerFullText;

        const saleQty = Math.floor(Math.random() * Math.min(itemDetails.currentStock, 5)) + 1;
        console.log(`[INFO] Targeted Sale Quantity: ${saleQty}`);

        await page.getByRole('button', { name: 'Line Item' }).click();
        await page.locator('button').filter({ hasText: /^Item$/ }).first().click();
        await app.selectRandomOption(page.getByRole('button', { name: 'Item selector' }), 'Item');

        // Use smart search for the specific item to be sure
        await page.getByRole('button', { name: 'Item selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), itemDetails.itemName);

        await page.locator('button#warehouse_id').click();
        await page.getByText('Default Warehouse', { exact: true }).first().click();
        await page.locator('button#location_id').click();
        await page.getByText('Default Warehouse Location', { exact: true }).first().click();

        await page.getByRole('button', { name: 'G/L Account selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), 'Sales');

        await page.getByRole('group').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill(saleQty.toString());
        await page.getByRole('button', { name: /^Add$/, exact: true }).click({ force: true });
        await page.waitForTimeout(3000);

        await page.locator('button#accounts_receivable_id').click();
        await app.smartSearch(page.getByRole('dialog'), 'Accounts Receivable');

        await page.getByRole('button', { name: 'Add Now' }).click();
        await page.waitForURL(/\/receivables\/sale-orders\/.*\/detail$/, { timeout: 90000 });

        const soNumber = (await page.locator('p').filter({ hasText: /SO Number:/i }).locator('xpath=following-sibling::p').first().innerText()).trim();
        console.log(`[SUCCESS] Sales Order Created: ${soNumber}`);

        await app.handleApprovalFlow();

        // STEP 3: Create Invoice from SO
        console.log("[STEP 3] Creating Invoice from SO");
        await page.goto('/receivables/invoices/new', { waitUntil: 'networkidle' });

        await page.getByRole('button', { name: 'Customer selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), capturedCustomerSearchTerm);

        await app.fillDate(0, invoiceDate);
        await app.fillDate(1, dueDate);
        await page.locator('button#accounts_receivable_id').click();
        await app.smartSearch(page.getByRole('dialog'), 'Accounts Receivable');

        await page.getByText('Sales Order', { exact: true }).click();
        await app.smartSearch(page.getByRole('dialog'), soNumber);
        await page.waitForTimeout(1500);

        const releasedTab = page.getByRole('tab', { name: /Released Sales Order/i });
        await releasedTab.click({ force: true });

        const row = page.getByRole('tabpanel', { name: 'Released Sales Order' }).locator('table tbody tr').first();
        await row.locator('.chakra-checkbox__control').click({ force: true });

        const remainingVal = await row.locator('td').nth(5).innerText();
        let remainingQty = remainingVal.replace(/[^0-9.]/g, '').split('.')[0] || saleQty.toString();

        const qtyInput = row.locator('input[type="number"], input.chakra-input').first();
        if (await qtyInput.isVisible()) {
            await qtyInput.fill(remainingQty);
            await page.keyboard.press('Enter');
        }

        await page.getByRole('button', { name: 'Add Now' }).first().click({ force: true });
        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/, { timeout: 90000 });

        const invoiceNumber = (await page.locator('p.chakra-text').filter({ hasText: /^INV\// }).first().innerText()).trim();
        console.log(`[SUCCESS] Invoice Created: ${invoiceNumber}`);

        await app.handleApprovalFlow();

        // STEP 4: Financial Verification
        const journalEntries = await app.captureJournalEntries();
        await app.verifyAllJournalEntries(invoiceNumber, journalEntries);

        // STEP 5: Post-Flow Stock Verification
        console.log("[STEP 5] Verifying POST-FLOW Stock Impact");
        const postDetails = await app.captureItemDetails(itemDetails.itemName);
        const expectedStock = itemDetails.currentStock - saleQty;
        console.log(`[INFO] Pre-Sale: ${itemDetails.currentStock} | Sold: ${saleQty} | Expected: ${expectedStock} | Actual: ${postDetails.currentStock}`);

        expect(postDetails.currentStock).toBe(expectedStock);

        // STEP 6: Cross-Verification in Profile
        await app.verifyDocInProfile('customer', capturedCustomerSearchTerm, invoiceNumber);

        console.log("[STATUS] Full Inventory Impact and Financial Flow Verified Successfully.");
        await page.close();
    });
});
