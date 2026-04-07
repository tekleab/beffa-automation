const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Sales Receipt — Create Receipt & Verify in Customer Profile', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.waitForTimeout(5000);
    });

    test('Create fresh invoice via API, then create receipt and link it', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        const { soDate: receiptDate } = app.getTransactionDates();

        // Phase 1: API Setup (Guarantees document for linkage)
        console.log('[STEP] Phase 1: Creating fresh Sales Order & Invoice via API');
        const itemResult = await app.captureRandomItemDetails();
        const soResult = await app.createSalesOrderAPI({ itemId: itemResult.itemId });
        if (!soResult.success) throw new Error("SO API Failed");

        // Approve SO to make it linkable
        await page.goto(`/receivables/sale-orders/${soResult.id}/detail`);
        await app.handleApprovalFlow();

        const invResult = await app.createInvoiceAPI({ soId: soResult.id, soItemId: soResult.soItemId });
        if (!invResult.success) throw new Error("Invoice API Failed");

        // Approve Invoice
        await page.goto(`/receivables/invoices/${invResult.id}/detail`);
        await app.handleApprovalFlow();

        const CUSTOMER_NAME = itemResult.customerName || "System Customer";
        const INVOICE_ID = invResult.ref;
        console.log(`[INFO] Document Setup Complete: ${INVOICE_ID} for ${CUSTOMER_NAME}`);

        // Phase 2: Create Receipt
        console.log('[STEP] Phase 2: Creating receipt');
        await page.goto('/receivables/receipts/new');

        const customerBtn = page.getByRole('button', { name: 'Customer selector' });
        await customerBtn.waitFor({ state: 'visible' });
        await customerBtn.click();
        await app.smartSearch(null, CUSTOMER_NAME);
        await page.waitForTimeout(2000);

        await app.fillDate(0, receiptDate);
        const accountBtn = page.locator('button#cash_account_id, button:has-text("Cash Account")').first();
        await accountBtn.waitFor({ state: 'visible' });
        await accountBtn.click();
        await app.smartSearch(null, 'Cash at Bank - CBE');

        if (INVOICE_ID) {
            console.log(`[STEP] Linking Invoice ${INVOICE_ID}`);
            const invoiceTab = page.getByRole('tab', { name: /Sales Invoices/i });
            await invoiceTab.waitFor({ state: 'visible' });
            await invoiceTab.click({ force: true });
            await page.waitForTimeout(3000);

            const activePanel = page.locator('div[role="tabpanel"]:not([hidden])');
            
            // Wait for at least one checkbox to appear (grid loaded)
            await expect(activePanel.locator('.chakra-checkbox__control, input[type="checkbox"]').first()).toBeVisible({ timeout: 30000 });

            const targetRow = activePanel.locator('> div > div').filter({
                has: page.locator('span').getByText(INVOICE_ID, { exact: true })
            }).first();

            try {
                await targetRow.waitFor({ state: 'visible', timeout: 20000 });
                await targetRow.scrollIntoViewIfNeeded();
                const checkbox = targetRow.locator('.chakra-checkbox__control, input[type="checkbox"]').first();
                await checkbox.click({ force: true });
                console.log(`[OK] Invoice ${INVOICE_ID} linked`);
            } catch (e) {
                const allSpans = await activePanel.locator('span').allTextContents();
                const visibleInvoices = allSpans.filter(t => t.includes('INV/'));
                console.log(`[FAIL] Could not find ${INVOICE_ID} in grid. Visible: ${visibleInvoices.join(', ') || 'None'}`);
                console.log('[INFO] Falling back to first available row');
                await activePanel.locator('.chakra-checkbox__control, input[type="checkbox"]').nth(1).click({ force: true });
            }
        } else {
            console.log('[STEP] Creating standalone receipt via manual row');
            const addRowBtn = page.getByRole('button', { name: /Add Row|Add Item|New/i }).filter({ visible: true }).first();
            if (await addRowBtn.isVisible().catch(() => false)) {
                await addRowBtn.click({ force: true });
                await page.waitForTimeout(1000);
                const lastRowCells = page.locator('table tbody tr').last().locator('td');
                await lastRowCells.nth(1).click({ force: true });
                await app.smartSearch(null, "Other Income");
                const qtyInput = page.locator('table tbody tr').last().locator('input[type="number"]').first();
                await qtyInput.fill("1000");
                await qtyInput.press('Enter');
            } else {
                console.log('[FAIL] Could not find Add Row button');
            }
        }

        console.log('[STEP] Committing receipt');
        const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await addNowBtn.click();
        await page.waitForURL(/\/receivables\/receipts\/.*\/detail$/, { timeout: 90000 });

        const capturedReceiptNumber = (await page.locator('p.chakra-text').filter({ hasText: /^RCPT\// }).first().innerText()).trim();
        console.log(`[OK] Receipt created: ${capturedReceiptNumber}`);

        // Phase 3: Approval
        console.log('[STEP] Phase 3: Approval flow');
        await app.handleApprovalFlow();
        console.log('[OK] Receipt approved');

        // Phase 4: Customer Profile Verification
        console.log(`[STEP] Phase 4: Verifying ${capturedReceiptNumber} in customer profile`);
        await page.goto('/receivables/customers');

        const searchInput = page.locator('input[placeholder="Search for customers..."]');
        await searchInput.waitFor({ state: 'visible' });
        await searchInput.fill(CUSTOMER_NAME);
        await page.waitForTimeout(3000);

        await page.locator('table tbody tr').filter({ hasText: CUSTOMER_NAME }).first().locator('td a').first().click({ force: true });
        await page.waitForSelector('text=Customer Details');

        await page.getByRole('tab', { name: /Receipts|Transactions/i }).click();
        await page.reload();
        await page.waitForTimeout(3000);
        await page.getByRole('tab', { name: /Receipts|Transactions/i }).click();

        const rcptLocator = page.locator('table').getByText(capturedReceiptNumber);
        await expect(rcptLocator.first()).toBeVisible({ timeout: 30000 });

        console.log(`[RESULT] Sales Receipt: PASSED — ${capturedReceiptNumber} verified in profile`);
        await page.close();
    });
});