const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Payment Creation and Vendor Verification', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        // Login and switch to befa tutorial specifically for this data-dependent test
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS, "befa tutorial");
        // Stabilization delay to avoid hydration mismatches
        await page.waitForTimeout(5000);
    });

    /**
     * Scenario: Standalone Payment Creation and Verification Flow
     * 1. Finds an unpaid approved bill from the Bills list.
     * 2. Creates a new Payment for that vendor.
     * 3. Allocates the payment to the 'Inventory' account and selects the bill.
     * 4. Orchestrates the full approval flow (Draft -> Approved).
     * 5. Verifies the document exists in the Vendor's profile.
     */
    test('Standalone Payment Creation and Verification Flow', async ({ page }) => {
        test.setTimeout(450000); // 7.5 Minutes for slow approval cycles
        const app = new AppManager(page);

        // --- Phase 1: Data Scanning (Finding an Unpaid Bill) ---
        const target = await app.findApprovedUnpaidBill();
        
        let VENDOR_NAME = "";
        let BILL_NUMBER = "";

        if (target) {
            VENDOR_NAME = target.vendorName;
            BILL_NUMBER = target.billNumber;
        } else {
            console.log("[WARNING] No unpaid approved bills found. Defaulting to first available vendor for general flow check.");
            await page.goto('http://157.180.20.112:4173/payables/bills/?page=1&pageSize=15');
            VENDOR_NAME = (await page.locator('table tbody tr').first().locator('td').nth(2).innerText()).trim();
        }

        // --- Phase 2: Create Payment ---
        console.log("Execution: Navigating to New Payment...");
        await page.goto('/payables/payments/new');
        
        console.log(`[ACTION] Selecting Vendor: "${VENDOR_NAME}"...`);
        await page.getByRole('button', { name: 'Vendor selector' }).click();
        await app.smartSearch(null, VENDOR_NAME);
        await page.waitForTimeout(3000); // Wait for form to react

        // Safety navigation guard
        if (!page.url().includes('payments/new')) {
            console.log("[WARNING] Page drifted away from /new. Recovering navigation...");
            await page.goto('/payables/payments/new');
            await page.getByRole('button', { name: 'Vendor selector' }).click();
            await app.smartSearch(null, VENDOR_NAME);
            await page.waitForTimeout(2000);
        }

        console.log("Action: Selecting 'Inventory' as default account...");
        await page.getByRole('button', { name: /Cash Account/i }).first().click();
        await app.smartSearch(null, "Inventory");
        await page.waitForTimeout(1500);

        // Verification of selection
        const accBox = page.getByRole('button', { name: /Cash Account/i }).first();
        const selectedAcc = (await accBox.innerText()).trim();
        if (!selectedAcc.toLowerCase().includes("inventory")) {
            console.log("[RETRY] Selection failed. Retrying 'Inventory'...");
            await accBox.click({ force: true });
            await page.locator('[role="option"], [role="menuitem"]').filter({ hasText: /^Inventory$/i }).first().click({ force: true });
        }
        console.log(`[INFO] Current account selected: "${selectedAcc}"`);

        console.log("Action: Switching to Bills/Invoices tab...");
        const billTab = page.getByRole('tab').filter({ hasText: /Invoices|Bills/i }).first();
        await billTab.click({ force: true });
        await page.waitForTimeout(4000); 

        console.log("Action: Selecting the target bill checkbox...");
        if (BILL_NUMBER) {
            console.log(`Action: Locating visible text for target bill: ${BILL_NUMBER}...`);
            await page.waitForTimeout(2000); // Give rows time to fully render
            
            // Step 1: Find the exact visible text node on the screen
            const visibleBillText = page.getByText(BILL_NUMBER, { exact: false }).filter({ visible: true }).first();
            
            if (await visibleBillText.isVisible({ timeout: 10000 }).catch(() => false)) {
                console.log(`[SUCCESS] Found visible text for Bill ${BILL_NUMBER}. Navigating to parent row...`);
                // Step 2: Use an intersecting layout query to find the nearest container holding both the exact text and a checkbox
                const targetRow = page.locator('div, tr, [role="row"]').filter({ hasText: BILL_NUMBER }).filter({ has: page.locator('.chakra-checkbox__control, [role="checkbox"], input[type="checkbox"]') }).last();
                
                // Once the row boundary is found, extract and click its checkbox control
                const targetCheckbox = targetRow.locator('.chakra-checkbox__control, [role="checkbox"]').first();
                await targetCheckbox.click({ force: true });
            } else {
                console.log(`[WARN] Bill ${BILL_NUMBER} is not explicitly visible. Falling back to first available row.`);
                // Secure fallback explicitly isolated to the active Invoices panel
                const activePanel = page.locator('[role="tabpanel"]').filter({ visible: true }).first();
                const firstRowCb = activePanel.locator('.chakra-checkbox__control, [role="checkbox"]').first();
                if (await firstRowCb.isVisible()) await firstRowCb.click({ force: true });
            }
        } else {
            console.log("Action: Selecting the first explicitly visible bill checkbox (Fallback)...");
            const activePanel = page.locator('[role="tabpanel"]').filter({ visible: true }).first();
            const firstRowCb = activePanel.locator('.chakra-checkbox__control, [role="checkbox"]').first();
            await firstRowCb.waitFor({ state: 'visible' });
            await firstRowCb.click({ force: true });
        }
        await page.waitForTimeout(1500);

        console.log("Action: Finalizing Payment (Process)...");
        const processBtn = page.getByRole('button', { name: /Add Now|Process|Submit|Save/i }).filter({ visible: true }).first();
        await processBtn.click({ force: true });

        // --- Phase 3: Approval Flow ---
        await app.handleApprovalFlow();
        
        await page.waitForURL(/\/detail$/, { timeout: 60000 });
        const capturedPaymentNumber = (await page.locator('p.chakra-text').filter({ hasText: /^PAY\// }).first().innerText()).trim();
        console.log(`[SUCCESS] Payment finalized for: ${VENDOR_NAME}`);
        console.log(`Document Created: ${capturedPaymentNumber}`);

        // --- Phase 4: Final Vendor Verification ---
        console.log(`Verification: Checking for ${capturedPaymentNumber} in Vendor profile...`);
        await page.goto('/payables/vendors');
        await page.waitForTimeout(4000); // Wait for list initialization
        
        // Use precise placeholder locator for list search
        const listSearch = page.getByPlaceholder(/Search for vendor/i).first();
        await listSearch.waitFor({ state: 'visible' });
        await listSearch.fill(VENDOR_NAME);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000); // Allow list refresh

        // Find the specific vendor row and navigate back to detail
        const vendorRow = page.locator('table tbody tr').filter({ hasText: VENDOR_NAME }).first();
        await vendorRow.waitFor({ state: 'visible', timeout: 20000 });
        await vendorRow.locator('td a').first().click({ force: true });
        await page.waitForURL(/\/detail/, { timeout: 30000 });

        console.log("Action: Checking Payments tab in profile...");
        const paymentsTab = page.getByRole('tab', { name: /Payments|Transactions/i }).first();
        await paymentsTab.click({ force: true });
        await page.waitForTimeout(2000);
        
        const docInTable = page.locator('table').getByText(capturedPaymentNumber);
        await expect(docInTable.first()).toBeVisible({ timeout: 15000 });
        console.log(`[VERIFIED] ${capturedPaymentNumber} is visible in vendor profile.`);

        await page.close();
    });
});
