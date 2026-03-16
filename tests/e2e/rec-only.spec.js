const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Receipt Creation and Customer Verification', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.waitForTimeout(5000);
    });


    test('Standalone Receipt Creation and Verification Flow', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        const { soDate: receiptDate } = app.getTransactionDates();

        console.log("Execution: Navigating to New Receipt...");
        await page.goto('/receivables/receipts/new');

        // Dynamic selections
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');

        await app.fillDate(0, receiptDate);

        // Randomize the Cash Account selection
        const cashAccountBtn = page.locator('button#cash_account_id');
        await app.selectRandomOption(cashAccountBtn, 'Cash Account');

        console.log("Action: Opening Sales Invoices tab...");
        const invoiceTab = page.getByRole('tab', { name: /Sales Invoices/i });
        await invoiceTab.waitFor({ state: 'visible' });
        await invoiceTab.click({ force: true });
        await page.waitForTimeout(3000);

        console.log("Action: Selecting the first specific invoice checkbox...");
        const invoiceCheckbox = page.locator('div[role="tabpanel"] .chakra-checkbox__control').nth(1);
        await invoiceCheckbox.waitFor({ state: 'visible' });
        await invoiceCheckbox.click({ force: true });

        const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addNowBtn).toBeEnabled({ timeout: 15000 });
        await addNowBtn.click();

        await page.waitForURL(/\/receivables\/receipts\/.*\/detail$/, { timeout: 90000 });

        const capturedReceiptNumber = (await page.locator('p.chakra-text').filter({ hasText: /^RCPT\// }).first().innerText()).trim();
        const capturedCustomerName = (await page.locator('//p[text()="Customer:"]/following-sibling::p').first().innerText()).trim();

        console.log(`Document Created: ${capturedReceiptNumber} | Customer: ${capturedCustomerName}`);

        await app.handleApprovalFlow();

        // Verification
        console.log(`Verification: Searching for ${capturedReceiptNumber} in Customer Details...`);
        await page.goto('/receivables/customers');
        const searchInput = page.locator('input[placeholder="Search for customers..."]');
        await searchInput.waitFor({ state: 'visible' });
        await searchInput.fill(capturedCustomerName);
        await page.waitForTimeout(3000);

        await page.locator('table tbody tr').filter({ hasText: capturedCustomerName }).first().locator('td a').first().click({ force: true });
        await page.waitForSelector('text=Customer Details');

        await page.getByRole('tab', { name: /Receipts|Transactions/i }).click();
        await page.reload();
        await page.waitForTimeout(3000);
        await page.getByRole('tab', { name: /Receipts|Transactions/i }).click();

        const rcptLocator = page.locator('table').getByText(capturedReceiptNumber);
        await expect(rcptLocator.first()).toBeVisible({ timeout: 30000 });
        console.log(`Status: ${capturedReceiptNumber} verified in customer profile.`);

        await page.close();
    });
});