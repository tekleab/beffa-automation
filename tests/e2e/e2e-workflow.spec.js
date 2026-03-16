const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('End-to-End Business Flow: SO -> Invoice -> Receipt', () => {

    test('Complete Sales to Receipt Workflow', async ({ page }) => {
        test.setTimeout(600000); // 10 minutes for the full flow
        const app = new AppManager(page);
        const { soDate, invoiceDate, dueDate } = app.getTransactionDates();

        // 1. LOGIN
        console.log("Execution: Initiating E2E Workflow...");
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.waitForTimeout(3000);

        // --- STEP 1: CREATE AND APPROVE SALES ORDER ---
        console.log("\n--- STEP 1: SALES ORDER ---");
        await page.goto('/receivables/sale-orders/new');
        await app.fillDate(0, soDate);

        // Standardized Selection
        await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');

        // Add Line Item
        await addLineItem(page, app, {
            item: 'Control panal',
            quantity: '1',
            warehouse: 'Default Warehouse',
            location: 'Default Warehouse Location',
            glAccount: 'Cash at Bank - CBE'
        });

        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');

        const addNowSOBtn = page.getByRole('button', { name: 'Add Now' });
        await expect(addNowSOBtn).toBeEnabled({ timeout: 15000 });
        await addNowSOBtn.click();

        await page.waitForURL(/\/receivables\/sale-orders\/.*\/detail$/, { timeout: 90000 });
        await page.getByText('Sales Order Details').first().waitFor({ timeout: 60000 });

        const sharedOrderNumber = (await page.locator('//p[text()="SO Number:"]/following-sibling::p').first().innerText()).trim();
        const capturedCustomerName = (await page.locator('//p[text()="Customer:"]/following-sibling::p').first().innerText()).trim();

        console.log(`Step 1 Complete: ${sharedOrderNumber} | Customer: ${capturedCustomerName}`);
        await app.handleApprovalFlow();

        // --- STEP 2: CREATE AND APPROVE INVOICE ---
        console.log("\n--- STEP 2: INVOICE ---");
        await page.goto('/receivables/invoices/new');

        // Link to Customer from Step 1
        await page.getByRole('button', { name: 'Customer selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), capturedCustomerName);

        await app.fillDate(0, invoiceDate);
        await app.fillDate(1, dueDate);
        await app.selectRandomOption(page.locator('button#accounts_receivable_id'), 'Accounts Receivable');

        console.log(`Action: Selecting Sales Order ${sharedOrderNumber}...`);
        await page.getByText('Sales Order', { exact: true }).click();
        await app.smartSearch(page.getByRole('dialog'), sharedOrderNumber);

        // Process Items
        const releasedTab = page.getByRole('tab', { name: /Released Sales Order/i });
        await releasedTab.waitFor({ state: 'visible' });
        await releasedTab.click({ force: true });

        const releasedTabPanel = page.getByRole('tabpanel', { name: 'Released Sales Order' });
        await releasedTabPanel.locator('tbody').waitFor({ state: 'visible', timeout: 30000 });

        const rows = releasedTabPanel.locator('table tbody tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const currentRow = rows.nth(i);
            await currentRow.locator('.chakra-checkbox__control').waitFor({ state: 'visible' });
            await currentRow.locator('.chakra-checkbox__control').click({ force: true });

            const remainingVal = await currentRow.locator('td').nth(5).innerText();
            let qty = remainingVal.replace(/[^0-9.]/g, '').split('.')[0] || "1";
            const qtyInput = currentRow.locator('input[type="number"], input[id*="quantity"]');
            if (await qtyInput.isVisible()) {
                await qtyInput.click({ clickCount: 3 });
                await qtyInput.fill(qty);
                await page.keyboard.press('Enter');
            }
        }

        const addNowInvBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addNowInvBtn).toBeEnabled();
        await addNowInvBtn.click();
        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/, { timeout: 90000 });

        const sharedInvoiceNumber = (await page.locator('p.chakra-text').filter({ hasText: /^INV\// }).first().innerText()).trim();

        console.log(`Step 2 Complete: ${sharedInvoiceNumber}`);
        await app.handleApprovalFlow();

        // --- STEP 3: CREATE AND APPROVE RECEIPT ---
        console.log("\n--- STEP 3: RECEIPT ---");
        await page.goto('/receivables/receipts/new');
        await app.fillDate(0, soDate); // Using current date

        // Link to Customer from Step 1
        await page.getByRole('button', { name: 'Customer selector' }).click();
        await app.smartSearch(page.getByRole('dialog'), capturedCustomerName);

        await app.selectRandomOption(page.locator('button#cash_account_id'), 'Cash Account');

        console.log(`Action: Linking Invoice ${sharedInvoiceNumber}...`);
        const invoiceTab = page.getByRole('tab', { name: /Sales Invoices/i });
        await invoiceTab.waitFor({ state: 'visible' });
        await invoiceTab.click({ force: true });
        await page.waitForTimeout(3000);

        const targetInvoiceRow = page.locator('.css-i8wwa4').filter({ hasText: sharedInvoiceNumber }).first();
        await expect(targetInvoiceRow).toBeVisible({ timeout: 20000 });
        await targetInvoiceRow.scrollIntoViewIfNeeded();
        await targetInvoiceRow.locator('span.chakra-checkbox__control').first().click({ force: true });

        const addNowRcptBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addNowRcptBtn).toBeEnabled();
        await addNowRcptBtn.click();
        await page.waitForURL(/\/receivables\/receipts\/.*\/detail$/, { timeout: 90000 });

        const capturedReceiptNumber = (await page.locator('p.chakra-text').filter({ hasText: /^RCPT\// }).first().innerText()).trim();

        console.log(`Step 3 Complete: ${capturedReceiptNumber}. Finalizing approval...`);
        await app.handleApprovalFlow();
        console.log("\n✅ SUCCESS: Full End-to-End Workflow Completed!");
    });
});

async function addLineItem(page, app, data) {
    console.log(`Action: Adding line item - ${data.item}`);
    await page.click('button:has-text("Line Item")');
    await page.locator('button').filter({ hasText: /^Item$/ }).first().click();

    await page.getByRole('button', { name: 'Item selector' }).click();
    await app.smartSearch(page.getByRole('dialog'), data.item);

    await page.getByRole('group').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill(data.quantity);

    await page.locator('button#warehouse_id').evaluate(node => node.click());
    await page.getByText(data.warehouse, { exact: true }).first().evaluate(node => node.click());

    await page.locator('button#location_id').evaluate(node => node.click());
    await page.getByText(data.location, { exact: true }).first().evaluate(node => node.click());

    await app.selectRandomOption(page.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');

    await page.getByRole('button', { name: 'Tax selector' }).click();
    await page.getByText('VAT').first().click();
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: /^Add$/, exact: true }).click();
    await page.waitForTimeout(2000);
}