const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Receipt Creation and Customer Verification', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        // Allow the application state to stabilize after login
        await page.waitForTimeout(5000);
    });

    test('Standalone Receipt Creation and Verification Flow', async ({ page }) => {
        test.setTimeout(450000);

        const app = new AppManager(page);
        const { soDate: receiptDate } = app.getTransactionDates();
        // --- Step 0: Find a customer with an existing invoice ---
        console.log("Action: Finding a customer with an existing invoice...");
        await page.goto('/receivables/invoices');
        await page.waitForTimeout(3000); // Wait for table to load
        
        // Target the second column (Customer Name) of the first row (assuming column 0 is checkbox/ID)
        const firstRow = page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 15000 });
        
        // We scan across the columns of the first row to reliably find the Customer Name
        // (Ignoring Invoice IDs like "INV/...", Dates like "03/30/2026", Amounts, and Statuses)
        const cols = firstRow.locator('td');
        const numCols = await cols.count();
        let CUSTOMER_NAME = "";
        
        for (let i = 1; i < numCols; i++) {
            const text = (await cols.nth(i).innerText()).trim();
            // Basic heuristic to skip non-customer fields
            if (text && !text.includes('INV/') && !text.match(/^(\d{2}\/\d{2}\/\d{4}|[A-Za-z]{3}\s*\d{1,2},\s*\d{4})$/) && !text.match(/^[\d,]+\.\d{2}/) && !['Draft', 'Approved', 'Posted', 'Void', 'Paid', 'Partially Paid'].includes(text) && !text.includes('ETB')) {
                CUSTOMER_NAME = text;
                break;
            }
        }
        
        if (!CUSTOMER_NAME) CUSTOMER_NAME = "Base Ethiopia"; // Ultra-safe fallback
        console.log(`[DATA] Found dynamic customer with invoice: "${CUSTOMER_NAME}"`);

        // --- Step 1: Receipt Creation ---
        console.log("Execution: Navigating to New Receipt...");
        // Use relative path since baseURL is defined in config
        await page.goto('/receivables/receipts/new');

        // Select Customer
        const customerBtn = page.getByRole('button', { name: 'Customer selector' });
        await customerBtn.waitFor({ state: 'visible' });
        await customerBtn.click();
        await page.waitForTimeout(2000); // Wait for dropdown data to load
        await page.getByText(CUSTOMER_NAME).first().click({ force: true });

        // Fill Date and Account
        await app.fillDate(0, receiptDate);
        const accountBtn = page.locator('button#cash_account_id');
        await accountBtn.waitFor({ state: 'visible' });
        await accountBtn.click();
        await page.getByText('Cash at Bank - CBE').first().click({ force: true });

        // Select Invoice
        console.log("Action: Opening Sales Invoices tab...");
        const invoiceTab = page.getByRole('tab', { name: /Sales Invoices/i });
        await invoiceTab.waitFor({ state: 'visible' });
        await invoiceTab.click({ force: true });
        await page.waitForTimeout(3000); // Wait for invoice table to populate

        // Select the first specific invoice checkbox (index 1 is usually the first row, 0 is header)
        console.log("Action: Selecting the first specific invoice checkbox...");
        const invoiceCheckbox = page.locator('div[role="tabpanel"]:not([hidden]) .chakra-checkbox__control').nth(1);
        await invoiceCheckbox.waitFor({ state: 'attached', timeout: 30000 });
        await invoiceCheckbox.evaluate(node => node.click());

        // Save Receipt
        console.log("Action: Committing Receipt...");
        const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await addNowBtn.click();

        // Wait for detail view redirection
        await page.waitForURL(/\/receivables\/receipts\/.*\/detail$/, { timeout: 90000 });

        const capturedReceiptNumber = (await page.locator('p.chakra-text').filter({ hasText: /^RCPT\// }).first().innerText()).trim();
        console.log(`Document Created: ${capturedReceiptNumber}`);

        // --- Step 2: Approval Flow ---
        console.log("Execution: Starting Approval Flow via AppManager...");
        await app.handleApprovalFlow();
        console.log("Status: Approval process completed.");

        // --- Step 3: Verification ---
        console.log(`Verification: Searching for ${capturedReceiptNumber} in Customer Details...`);
        // Navigate using relative path
        await page.goto('/receivables/customers');

        const searchInput = page.locator('input[placeholder="Search for customers..."]');
        await searchInput.waitFor({ state: 'visible' });
        await searchInput.fill(CUSTOMER_NAME);
        await page.waitForTimeout(3000);

        // Open Customer Detail page
        await page.locator('table tbody tr').filter({ hasText: CUSTOMER_NAME }).first().locator('td a').first().click({ force: true });
        await page.waitForSelector('text=Customer Details');

        // Check Receipts tab
        console.log("Action: Checking Receipts tab...");
        await page.getByRole('tab', { name: /Receipts|Transactions/i }).click();

        // Reload to ensure data sync after approval
        await page.reload();
        await page.waitForTimeout(3000);
        await page.getByRole('tab', { name: /Receipts|Transactions/i }).click();

        const rcptLocator = page.locator('table').getByText(capturedReceiptNumber);

        // Assertion
        await expect(rcptLocator.first()).toBeVisible({ timeout: 30000 });
        console.log(`Status: ${capturedReceiptNumber} verified in customer profile.`);

        await page.close();
    });
});