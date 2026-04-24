import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Payment Cycle Flow @regression', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS, "smoke test");
        await page.waitForTimeout(5000);
    });

    test('Find unpaid bill, create payment, approve, verify in vendor profile', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);

        // Phase 1: Find Unpaid Bill
        console.log('[STEP] Phase 1: Scanning for unpaid approved bill');
        const target = await app.findApprovedUnpaidBill();

        let VENDOR_NAME = "";
        let BILL_NUMBER = "";

        if (target) {
            VENDOR_NAME = target.vendorName;
            BILL_NUMBER = target.billNumber;
        } else {
            console.log('[INFO] No unpaid approved bills found. Defaulting to first vendor.');
            await page.goto('http://157.180.20.112:4173/payables/bills/?page=1&pageSize=15');
            VENDOR_NAME = (await page.locator('table tbody tr').first().locator('td').nth(2).innerText()).trim();
        }

        // Phase 2: Create Payment
        console.log('[STEP] Phase 2: Creating payment');
        await page.goto('/payables/payments/new');

        console.log(`[INFO] Selecting vendor: "${VENDOR_NAME}"`);
        await page.getByRole('button', { name: 'Vendor selector' }).click();
        await page.waitForTimeout(2000);
        await app.smartSearch(null, VENDOR_NAME);
        await page.waitForTimeout(3000);

        if (!page.url().includes('payments/new')) {
            console.log('[INFO] Page drifted. Recovering...');
            await page.goto('/payables/payments/new');
            await page.getByRole('button', { name: 'Vendor selector' }).click();
            await page.waitForTimeout(2000);
            await app.smartSearch(null, VENDOR_NAME);
            await page.waitForTimeout(2000);
        }

        console.log('[STEP] Selecting bank account');
        await page.getByRole('button', { name: /Cash Account/i }).first().click();
        await page.waitForTimeout(2000);
        await app.smartSearch(null, "CBE");
        await page.waitForTimeout(1500);

        const accBox = page.getByRole('button', { name: /Cash Account/i }).first();
        const selectedAcc = (await accBox.innerText()).trim();
        if (!selectedAcc.toLowerCase().includes("cbe")) {
            console.log('[INFO] Account selection retry');
            await accBox.click({ force: true });
            await page.locator('[role="option"], [role="menuitem"]').filter({ hasText: /CBE/i }).first().click({ force: true });
        }
        console.log(`[OK] Account: "${selectedAcc}"`);

        console.log('[STEP] Selecting bill');
        const billTab = page.getByRole('tab').filter({ hasText: /Invoices|Bills/i }).first();
        await billTab.click({ force: true });

        // Wait for grid to populate
        const activePanel = page.locator('[role="tabpanel"]').filter({ visible: true }).first();
        await expect(activePanel.locator('.chakra-checkbox, [role="checkbox"], input[type="checkbox"]').first()).toBeVisible({ timeout: 30000 });

        await page.waitForTimeout(2000);

        if (BILL_NUMBER) {
            console.log(`[INFO] Locating bill: ${BILL_NUMBER}`);
            await page.waitForTimeout(2000);

            const activePanel2 = page.locator('[role="tabpanel"]').filter({ visible: true }).first();
            let checked = false;

            for (let retry = 0; retry < 3; retry++) {
                const billNode = activePanel2.getByText(BILL_NUMBER, { exact: false }).filter({ visible: true }).first();

                if (await billNode.isVisible({ timeout: 3000 }).catch(() => false)) {
                    console.log(`[INFO] Found ${BILL_NUMBER}. Locating row checkbox...`);
                    await billNode.scrollIntoViewIfNeeded();

                    const targetRow = billNode.locator('xpath=./ancestor::*[contains(@class, "row") or contains(@role, "row") or self::tr or self::div][.//*[contains(@class, "checkbox") or @role="checkbox"]][1]');

                    if (await targetRow.isVisible().catch(() => false)) {
                        const targetCheckbox = targetRow.locator('.chakra-checkbox, [role="checkbox"], input[type="checkbox"]').first();
                        const hiddenInput = targetRow.locator('input[type="checkbox"]').first();

                        if (!(await hiddenInput.isChecked().catch(() => false))) {
                            await targetCheckbox.click({ force: true });
                            await page.waitForTimeout(1000);
                        }

                        if (await hiddenInput.isChecked().catch(() => true)) {
                            console.log(`[OK] Bill ${BILL_NUMBER} selected`);
                            checked = true;
                            break;
                        }
                    }
                } else {
                    console.log(`[INFO] Attempt ${retry + 1}: ${BILL_NUMBER} not visible. Scrolling...`);
                    await activePanel2.evaluate((node: HTMLElement) => node.scrollTo(0, 1000));
                    await page.waitForTimeout(1000);
                    await activePanel2.evaluate((node: HTMLElement) => node.scrollTo(0, 0));
                    await page.waitForTimeout(1000);
                }
            }

            if (!checked) {
                console.log(`[FAIL] Precise row selection failed for ${BILL_NUMBER}. Using fallback.`);
                const fallbackRow = activePanel2.locator('tr, [role="row"], div').filter({ hasText: BILL_NUMBER }).filter({ has: page.locator('.chakra-checkbox') }).first();
                if (await fallbackRow.isVisible()) {
                    await fallbackRow.scrollIntoViewIfNeeded();
                    await fallbackRow.locator('.chakra-checkbox').first().click({ force: true });
                }
            }
        } else {
            console.log('[INFO] Selecting first available bill');
            const firstRowCb = page.locator('[role="tabpanel"]').filter({ visible: true }).locator('.chakra-checkbox, [role="checkbox"]').first();
            await firstRowCb.waitFor({ state: 'visible' });
            await firstRowCb.click({ force: true });
        }
        await page.waitForTimeout(1500);

        console.log('[STEP] Finalizing payment');
        const processBtn = page.getByRole('button', { name: /Add Now|Process|Submit|Save/i }).filter({ visible: true }).first();
        await processBtn.click({ force: true });
        await page.waitForTimeout(3000);

        if (page.url().includes('/new')) {
            const insufficientError = page.getByText(/Account balance is insufficient/i).first();
            if (await insufficientError.isVisible().catch(() => false)) {
                console.log('[OK] Transaction correctly blocked — insufficient balance');
                await page.close();
                return;
            }
            console.log('[INFO] Retrying submit');
            await processBtn.click({ force: true });
            await page.waitForTimeout(3000);
        }

        await page.waitForURL(/\/payables\/payments\/.*\/detail/, { timeout: 30000 }).catch(() => {
            console.log('[INFO] Navigation to detail timed out');
        });

        // Phase 3: Approval
        console.log('[STEP] Phase 3: Approval flow');
        await app.handleApprovalFlow();

        if (!page.url().includes('/detail')) {
            await page.waitForURL(/\/detail$/, { timeout: 30000 }).catch(() => { });
        }
        const capturedPaymentNumber = (await page.locator('p.chakra-text').filter({ hasText: /^PAY\// }).first().innerText()).trim();
        console.log(`[OK] Payment finalized: ${capturedPaymentNumber} for ${VENDOR_NAME}`);

        // Phase 4: Vendor Profile Verification
        console.log(`[STEP] Phase 4: Verifying ${capturedPaymentNumber} in vendor profile`);
        await page.goto('/payables/vendors');
        await page.waitForTimeout(4000);

        const listSearch = page.getByPlaceholder(/Search for vendor/i).first();
        await listSearch.waitFor({ state: 'visible' });
        await listSearch.fill(VENDOR_NAME);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);

        const vendorRow = page.locator('table tbody tr').filter({ hasText: VENDOR_NAME }).first();
        await vendorRow.waitFor({ state: 'visible', timeout: 20000 });
        await vendorRow.locator('td a').first().click({ force: true });
        await page.waitForURL(/\/detail/, { timeout: 30000 });

        const paymentsTab = page.getByRole('tab', { name: /Payments|Transactions/i }).first();
        await paymentsTab.click({ force: true });
        await page.waitForTimeout(2000);

        const docInTable = page.locator('table').getByText(capturedPaymentNumber);
        await expect(docInTable.first()).toBeVisible({ timeout: 15000 });
        console.log(`[RESULT] Payment Cycle: PASSED — ${capturedPaymentNumber} verified in vendor profile`);

        await page.close();
    });
});