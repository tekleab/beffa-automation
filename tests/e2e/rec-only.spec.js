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

        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');

        await app.fillDate(0, receiptDate);

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

        await page.waitForURL(/\/receivables\/receipts\/.*\/detail$/, { timeout: 120000 });

        const capturedReceiptNumber = (await page.locator('p.chakra-text').filter({ hasText: /^RCPT\// }).first().innerText({ timeout: 30000 })).trim();

        // Direct sibling locator: finds the <p> that follows the "Customer:" label
        const customerValueLocator = page.locator('p:has-text("Customer:") + p').first();
        await customerValueLocator.waitFor({ state: 'visible', timeout: 20000 });
        const capturedCustomerName = (await customerValueLocator.innerText()).trim();

        console.log(`Document Created: ${capturedReceiptNumber} | Customer: ${capturedCustomerName}`);

        await app.handleApprovalFlow();

        // 7. FINAL CROSS-VERIFICATION in Customer Profile
        await app.verifyDocInProfile('customer', capturedCustomerName, capturedReceiptNumber);

        await page.close();
    });
});
