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
        console.log("Action: Capturing pre-sale inventory data via random selection...");
        let itemDetails = null;

        while (true) {
            itemDetails = await app.captureRandomItemDetails();
            // Ensure we have at least 2 units to allow selling less than total
            if (itemDetails.currentStock > 1) {
                console.log(`Status: Selected item with available stock: ${itemDetails.itemName} (${itemDetails.currentStock} units)`);
                break;
            }
            console.log(`Info: Item "${itemDetails.itemName}" has insufficient stock (${itemDetails.currentStock}). Retrying...`);
        }

        // STEP 2: Create Sales Order
        console.log("Action: Creating Sales Order...");
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'networkidle' });
        await app.fillDate(0, soDate);

        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
        const customerFullText = (await page.locator('button[aria-label="Customer selector"]').innerText()).trim();
        const capturedCustomerSearchTerm = customerFullText.match(/^([A-Z0-9\/_-]+)\s*-/i)?.[1] || customerFullText;

        // Sale quantity must be at least 1 and strictly less than currentStock
        const saleQty = Math.max(1, Math.floor(Math.random() * (itemDetails.currentStock - 1)) + 1);
        console.log(`Info: Targeted Quantity for Sale: ${saleQty} (Stock available: ${itemDetails.currentStock})`);

        await page.getByRole('button', { name: 'Line Item' }).click();
        await page.locator('button').filter({ hasText: /^Item$/ }).first().click();
        await app.selectRandomOption(page.getByRole('button', { name: 'Item selector' }), 'Item');

        // Target the specific pre-sale item
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

        // Enhanced Navigation Handling
        try {
            await page.waitForURL(/\/receivables\/sale-orders\/.*\/detail$/, { timeout: 60000 });
        } catch (error) {
            const errorToast = page.locator('.chakra-alert__title, [role="alert"]').first();
            if (await errorToast.isVisible()) {
                const errorMsg = await errorToast.innerText();
                throw new Error(`Submission failed with error: "${errorMsg}"`);
            }
            throw error;
        }

        const soNumber = (await page.locator('p').filter({ hasText: /SO Number:/i }).locator('xpath=following-sibling::p').first().innerText()).trim();
        console.log(`Status: Sales Order created successfully: ${soNumber}`);

        await app.handleApprovalFlow();

        // STEP 3: Create Invoice from SO
        console.log("Action: Generating Invoice from the approved Sales Order...");
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
        console.log(`Status: Invoice created successfully: ${invoiceNumber}`);

        await app.handleApprovalFlow();

        // STEP 4: Financial Verification
        const journalEntries = await app.captureJournalEntries();
        await app.verifyAllJournalEntries(invoiceNumber, journalEntries);

        // STEP 5: Post-Flow Stock Verification
        console.log("Action: Verifying post-flow stock impact...");
        const postDetails = await app.captureItemDetails(itemDetails.itemName);
        const expectedStock = itemDetails.currentStock - saleQty;
        console.log(`Summary: Pre-Sale: ${itemDetails.currentStock} | Sold: ${saleQty} | Expected: ${expectedStock} | Actual: ${postDetails.currentStock}`);

        expect(postDetails.currentStock).toBe(expectedStock);

        // STEP 6: Final Verification
        await app.verifyDocInProfile('customer', capturedCustomerSearchTerm, invoiceNumber);

        console.log("Status: Full Inventory Impact and Financial Flow Verified.");
        await page.close();
    });
});
