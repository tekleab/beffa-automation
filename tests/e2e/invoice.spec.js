const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Isolated Invoice Creation', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.waitForTimeout(5000);
    });

    test('SO to Invoice with Financial Verification', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);
        const { soDate, invoiceDate, dueDate } = app.getTransactionDates();

        // STEP 1: Create and Approve a Sales Order
        console.log("[STEP 1] Creating Sales Order");
        await page.goto('/receivables/sale-orders/new', { waitUntil: 'networkidle' });
        await app.fillDate(0, soDate);

        // Select Customer
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');

        // Capture Customer Search Term
        const customerFullText = (await page.locator('button[aria-label="Customer selector"]').innerText()).trim();
        const idMatch = customerFullText.match(/^([A-Z0-9\/_-]+)\s*-/i);
        const capturedCustomerSearchTerm = idMatch ? idMatch[1] : customerFullText;
        console.log(`[INFO] Customer Search Term: ${capturedCustomerSearchTerm}`);

        // Add Line Item with Stock-Aware Retry Loop
        console.log("[ACTION] Adding Line Item (Stock-Aware Selection)...");
        let itemFound = false;
        for (let attempt = 1; attempt <= 5; attempt++) {
            await page.click('button:has-text("Line Item")');
            await page.locator('button').filter({ hasText: /^Item$/ }).first().click();
            await app.selectRandomOption(page.getByRole('button', { name: 'Item selector' }), 'Item');

            await page.locator('button#warehouse_id').evaluate(node => node.click());
            await page.getByText('Default Warehouse', { exact: true }).first().evaluate(node => node.click());
            await page.waitForTimeout(500);

            await page.locator('button#location_id').evaluate(node => node.click());
            await page.getByText('Default Warehouse Location', { exact: true }).first().evaluate(node => node.click());
            await page.waitForTimeout(500);

            await page.getByRole('button', { name: 'G/L Account selector' }).click();
            await app.smartSearch(page.getByRole('dialog'), 'Sales');

            await page.getByRole('group').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill("5");
            await page.getByRole('button', { name: /^Add$/, exact: true }).evaluate(node => node.click());

            await page.waitForTimeout(3000);

            const lineModal = page.getByRole('dialog').last();
            if (await lineModal.isVisible({ timeout: 1000 }).catch(() => false)) {
                const cancelBtn = lineModal.getByRole('button', { name: 'Cancel' });
                await cancelBtn.click({ force: true }).catch(() => { });
                await lineModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
                await page.waitForTimeout(1000);
            }

            const errorRow = page.locator('table tbody tr').filter({ hasText: /Insufficient stock/i }).first();
            if (await errorRow.isVisible()) {
                console.log(`[WARNING] Attempt ${attempt}: Insufficient stock. Retrying...`);
                const deleteBtn = errorRow.locator('svg.lucide-delete, .lucide-delete, [aria-label*="delete"i]').first();
                if (await deleteBtn.isVisible()) {
                    await deleteBtn.click({ force: true });
                } else {
                    await errorRow.locator('button').last().click({ force: true });
                }
                await page.waitForTimeout(1500);
            } else {
                itemFound = true;
                break;
            }
        }

        if (!itemFound) throw new Error("[ERROR] Could not find an item with sufficient stock.");

        await page.locator('button#accounts_receivable_id').click();
        await app.smartSearch(page.getByRole('dialog'), 'Accounts Receivable');

        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await expect(addNowBtn).toBeEnabled({ timeout: 15000 });
        await addNowBtn.click();

        await page.waitForURL(/\/receivables\/sale-orders\/.*\/detail$/, { timeout: 90000 });
        const soNumber = (await page.locator('p').filter({ hasText: /SO Number:/i }).locator('xpath=following-sibling::p').first().innerText()).trim();
        console.log(`[SUCCESS] Sales Order Created: ${soNumber}`);

        await app.handleApprovalFlow();

        // STEP 2: Create and Approve Invoice from SO
        console.log("[STEP 2] Creating Invoice from SO");
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
        await row.locator('.chakra-checkbox__control').click({ force: true });

        const remainingValText = (await row.locator('td').nth(5).innerText()).trim();
        const remainingVal = parseInt(remainingValText, 10) || 5;
        const randomQty = Math.floor(Math.random() * Math.min(remainingVal, 10)) + 1;

        const qtyInput = row.locator('input[type="number"]');
        if (await qtyInput.isVisible()) {
            await qtyInput.fill(randomQty.toString());
        }

        await page.getByRole('button', { name: 'Add Now' }).first().click();
        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/, { timeout: 90000 });

        const invoiceNumber = (await page.locator('p.chakra-text').filter({ hasText: /^INV\// }).first().innerText()).trim();
        console.log(`[SUCCESS] Invoice Created: ${invoiceNumber}`);

        await app.handleApprovalFlow();

        // STEP 3: Verification
        await app.verifyDocInProfile('customer', capturedCustomerSearchTerm, invoiceNumber);

        // Financial Verification
        const journalEntries = await app.captureJournalEntries();
        await app.verifyAllJournalEntries(invoiceNumber, journalEntries);

        console.log("[STATUS] Full SO to Invoice flow completed.");
        await page.close();
    });
});