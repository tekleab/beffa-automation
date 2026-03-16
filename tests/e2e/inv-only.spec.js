const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Isolated Invoice Creation', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.waitForTimeout(5000);
    });


    test('Standalone Invoice Creation and Approval Flow', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        const { invoiceDate, dueDate } = app.getInvoiceDates();

        console.log("Execution: Initiating Isolated Invoice creation...");
        await page.goto('/receivables/invoices/new');

        // Dynamic selections
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');

        await app.fillDate(0, invoiceDate);
        await app.fillDate(1, dueDate);

        await app.selectRandomOption(page.locator('button#accounts_receivable_id'), 'Accounts Receivable');

        console.log("Action: Selecting Sales Order...");
        await app.selectRandomOption(page.getByText('Sales Order', { exact: true }), 'Sales Order');

        // Processing items
        const releasedTab = page.getByRole('tab', { name: /Released Sales Order/i });
        await releasedTab.waitFor({ state: 'visible' });
        await releasedTab.click({ force: true });

        const releasedTabPanel = page.getByRole('tabpanel', { name: 'Released Sales Order' });
        await releasedTabPanel.locator('tbody').waitFor({ state: 'visible' });
        const rows = releasedTabPanel.locator('table tbody tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const currentRow = rows.nth(i);
            await currentRow.locator('.chakra-checkbox__control').click({ force: true });
            const remainingVal = await currentRow.locator('td').nth(2).innerText();
            let qty = remainingVal.trim() || "1";
            const qtyInput = currentRow.locator('input[type="number"]');
            if (await qtyInput.isVisible()) {
                await qtyInput.fill(qty);
            }
        }

        const addBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addBtn).toBeEnabled({ timeout: 15000 });
        await addBtn.click();

        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/, { timeout: 90000 });

        const capturedInvoiceNumber = (await page.locator('p.chakra-text').filter({ hasText: /^INV\// }).first().innerText()).trim();
        const capturedCustomerName = (await page.locator('//p[text()="Customer:"]/following-sibling::p').first().innerText()).trim();

        console.log(`Document Created: ${capturedInvoiceNumber} | Customer: ${capturedCustomerName}`);

        await app.handleApprovalFlow();

        // Verification
        await page.goto('/receivables/customers');
        const searchInput = page.locator('input[placeholder="Search for customers..."]');
        await searchInput.waitFor({ state: 'visible' });
        await searchInput.fill(capturedCustomerName);
        await page.waitForTimeout(2000);
        await page.locator('table tbody tr').filter({ hasText: capturedCustomerName }).first().locator('td a').first().click({ force: true });

        await page.getByRole('tab', { name: 'Invoices' }).click();
        const invLink = page.locator(`a:has-text("${capturedInvoiceNumber}")`);
        await expect(invLink.first()).toBeVisible({ timeout: 15000 });

        console.log("Status: Isolated Invoice flow completed and verified.");
        await page.close();
    });
});