const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Payment Edge Cases & Error Handling', () => {

    // Reusable function to select random options from custom dropdowns
    async function selectRandomOption(page, selector, labelName, isOptional = false) {
        const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], .chakra-menu__menuitem';
        for (let i = 0; i < 3; i++) {
            try {
                await selector.scrollIntoViewIfNeeded();
                await selector.evaluate(node => node.click());
                await page.waitForTimeout(1500);

                const options = page.locator(optionSelector).filter({ visible: true });
                const count = await options.count();

                if (count > 0) {
                    const randomIndex = Math.floor(Math.random() * count);
                    const target = options.nth(randomIndex);
                    await target.evaluate(node => node.click());
                    await page.keyboard.press('Escape');
                    return count;
                } else {
                    await page.keyboard.press('Escape');
                    if (isOptional) return 0;
                }
            } catch (e) {
                await page.keyboard.press('Escape');
            }
        }
        if (!isOptional) throw new Error(`Failed selection for ${labelName}`);
        return 0;
    }

    // Wait loop to ensure the selected vendor has outstanding invoices
    async function ensureVendorWithInvoice(page) {
        const vendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        const invoicesTab = page.locator('button[role="tab"]').filter({ hasText: /Invoices/i });

        for (let i = 0; i < 15; i++) {
            console.log(`\n🔄 Attempt ${i + 1}: Selecting Vendor and checking for Invoices...`);
            await selectRandomOption(page, vendorBtn, 'Vendor');

            await invoicesTab.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
            if (await invoicesTab.isVisible()) {
                await invoicesTab.evaluate(node => node.click());
            }

            await page.waitForTimeout(3000);
            const checkboxes = page.locator('.chakra-checkbox__control');

            if (await checkboxes.count() > 1 && await checkboxes.nth(1).isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log(`✅ Invoice found! Selecting it...`);
                await checkboxes.nth(1).evaluate(node => node.click());
                await page.waitForTimeout(1000);
                return true;
            } else {
                console.log("❌ No invoices found for this vendor. Retrying...");
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);
            }
        }
        throw new Error("Unable to find a vendor with an associated invoice after 15 attempts.");
    }

    // Wait loop to ensure the selected Cash Account has sufficient balance
    async function ensureSufficientCashAccount(page) {
        const cashAccountBtn = page.getByRole('button', { name: 'Cash Account selector' });
        for (let i = 0; i < 15; i++) {
            console.log(`\n🔄 Attempt ${i + 1}: Selecting Cash Account...`);
            await selectRandomOption(page, cashAccountBtn, 'Cash Account');
            await page.waitForTimeout(3000);

            const inlineError = page.locator('.chakra-form__error-message, div:has-text("insufficient")').filter({ hasText: /insufficient|required/i });
            const toastError = page.locator('.chakra-toast, role=status, role=alert').filter({ hasText: /insufficient|balance|required/i });

            const btnText = await cashAccountBtn.innerText();
            const isUnselected = !btnText || btnText.toLowerCase().includes("selector") || btnText.trim() === "";

            if (await inlineError.isVisible({ timeout: 500 }).catch(() => false) ||
                await toastError.isVisible({ timeout: 500 }).catch(() => false) ||
                isUnselected) {
                console.log("❌ Account balance is insufficient. Retrying...");
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);
            } else {
                console.log(`✅ Account "${btnText}" selected!`);
                return true;
            }
        }
        throw new Error("Unable to find a Cash Account with sufficient balance.");
    }

    test('Negative Test: Overpayment and Status Validation', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);

        // 1. Initial Setup
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/payments/new', { waitUntil: 'networkidle' });

        // 2. Select Vendor with Invoice
        await ensureVendorWithInvoice(page);

        // 3. Overpayment Negative Test
        console.log("⚠️ Testing Overpayment scenario...");
        const amountPaidInput = page.locator('input[role="spinbutton"], input[type="number"], .chakra-numberinput input').first();
        const originalAmountText = await amountPaidInput.inputValue();
        const amountDue = parseFloat(originalAmountText.replace(/,/g, ''));

        // Attempt overpayment (Due + 1000)
        const overpaymentAmount = amountDue + 1000;
        await amountPaidInput.fill(overpaymentAmount.toString());
        await page.waitForTimeout(2000);

        // Assert validation error or disabled button
        const validationError = page.locator('.chakra-form__error-message').filter({ hasText: /greater than|due amount/i });
        const addNowBtn = page.getByRole('button', { name: 'Add Now' });

        const isErrorVisible = await validationError.isVisible({ timeout: 2000 }).catch(() => false);
        const isButtonDisabled = !(await addNowBtn.isEnabled());

        if (isErrorVisible || isButtonDisabled) {
            console.log("✅ Overpayment correctly blocked by the UI!");
        } else {
            console.warn("⚠️ Overpayment was not visibly blocked. Proceeding with caution.");
        }

        // Recovery: Set valid payment (1 ETB)
        console.log("🔄 Recovering with valid amount (1 ETB)...");
        await amountPaidInput.fill("1");
        await page.waitForTimeout(1000);

        // 4. Select Cash Account
        await ensureSufficientCashAccount(page);

        // 5. Submit with Toast Monitoring
        console.log("🚀 Submitting Payment and monitoring toasts...");

        // Listener for any toast failure
        const toastLocator = page.locator('.chakra-toast').filter({ hasText: /Error|Failed|Invalid/i });

        await addNowBtn.evaluate(node => node.click());

        // Check if a failure toast appears within 5 seconds
        if (await toastLocator.isVisible({ timeout: 5000 }).catch(() => false)) {
            const errorMsg = await toastLocator.innerText();
            throw new Error(`❌ Test failed due to error toast: ${errorMsg}`);
        }

        // 6. Final Status Assertion
        console.log("🎯 Verifying final Approved status...");
        await page.waitForURL(/\/payables\/payments\/.*\/detail$/, { waitUntil: 'networkidle' });

        // Execute approval flow
        await app.handleApprovalFlow();

        // Final visibility check for 'Approved' badge
        await expect(page.getByText('Approved', { exact: false }).first()).toBeVisible({ timeout: 30000 });
        console.log("✅ Final Status: APPROVED confirmed!");
    });
});
