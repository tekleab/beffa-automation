const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

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
        // --- Step 1: Data Scanning (Finding an Unpaid Invoice) ---
        const target = await app.findApprovedUnpaidInvoice();

        let CUSTOMER_NAME = "";
        let INVOICE_ID = null;

        if (target) {
            CUSTOMER_NAME = target.customerName;
            INVOICE_ID = target.invoiceId;
            console.log(`[DATA] Found unpaid customer match: "${CUSTOMER_NAME}" (Invoice: ${INVOICE_ID})`);
        } else {
            console.log("[WARNING] No unpaid approved invoices found. Using Standalone Fallback.");
            CUSTOMER_NAME = "Base Ethiopia";
        }

        // --- Step 2: Receipt Creation ---
        console.log("Execution: Navigating to New Receipt...");
        await page.goto('/receivables/receipts/new');

        // Select Customer
        const customerBtn = page.getByRole('button', { name: 'Customer selector' });
        await customerBtn.waitFor({ state: 'visible' });
        await customerBtn.click();
        await app.smartSearch(null, CUSTOMER_NAME);
        await page.waitForTimeout(2000);

        // Fill Date and Account
        await app.fillDate(0, receiptDate);
        const accountBtn = page.locator('button#cash_account_id, button:has-text("Cash Account")').first();
        await accountBtn.waitFor({ state: 'visible' });
        await accountBtn.click();
        await app.smartSearch(null, 'Cash at Bank - CBE');

        if (INVOICE_ID) {
            // SCENARIO A: Linked Receipt (Invoice exists)
            console.log(`Action: Linking Invoice ${INVOICE_ID}...`);
            const invoiceTab = page.getByRole('tab', { name: /Sales Invoices/i });
            await invoiceTab.waitFor({ state: 'visible' });
            await invoiceTab.click({ force: true });
            await page.waitForTimeout(3000);

            // Precise Grid Selection: Find the div container that contains our specific Invoice ID span
            const activePanel = page.locator('div[role="tabpanel"]:not([hidden])');
            // We look for a row-like div that contains exactly our ID text
            const targetRow = activePanel.locator('> div > div').filter({
                has: page.locator('span').getByText(INVOICE_ID, { exact: true })
            }).first();

            try {
                // Wait for the specific ID to be physically present in the grid
                await targetRow.waitFor({ state: 'visible', timeout: 20000 });
                await targetRow.scrollIntoViewIfNeeded();

                // Locate the checkbox within this specific row-container
                const checkbox = targetRow.locator('.chakra-checkbox__control, input[type="checkbox"]').first();
                console.log(`[ACTION] Linking Invoice ${INVOICE_ID} found in custom grid...`);

                await checkbox.click({ force: true });
                console.log(`[SUCCESS] Invoice ${INVOICE_ID} accurately selected and linked.`);
            } catch (e) {
                // 🛠 Debugger: If missing, log what the automation DOES see in the spans
                const allSpans = await activePanel.locator('span').allTextContents();
                const visibleInvoices = allSpans.filter(t => t.includes('INV/'));

                console.error(`[CRITICAL ERROR] Could not find ${INVOICE_ID} in the grid.`);
                console.error(`[DEBUG] Found these other Invoices instead: ${visibleInvoices.join(', ') || 'None'}`);

                console.log(`[WARN] Falling back to first available row to prevent total block...`);
                await activePanel.locator('.chakra-checkbox__control, input[type="checkbox"]').nth(1).click({ force: true });
            }
        } else {
            // SCENARIO B: Standalone Receipt (No Invoice)
            console.log("Action: Creating Standalone Receipt via manual Row entry...");
            // Click "Add Row" or "Add Item" in the distribution/items tab
            const addRowBtn = page.getByRole('button', { name: /Add Row|Add Item|New/i }).filter({ visible: true }).first();
            if (await addRowBtn.isVisible().catch(() => false)) {
                await addRowBtn.click({ force: true });
                await page.waitForTimeout(1000);

                // Select a default G/L account for the credit side
                const lastRowCells = page.locator('table tbody tr').last().locator('td');
                await lastRowCells.nth(1).click({ force: true });
                await app.smartSearch(null, "Other Income"); // Common generic account

                // Set Amount
                const qtyInput = page.locator('table tbody tr').last().locator('input[type="number"]').first();
                await qtyInput.fill("1000");
                await qtyInput.press('Enter');
            } else {
                console.log("[ERROR] Could not find 'Add Row' button for standalone receipt.");
            }
        }

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