const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Integrated Workflow: Bill Creation to Payment', () => {

    // --- Core Helper Functions ---

    async function selectRandomOption(page, selector, labelName, isOptional = false) {
        const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], .chakra-menu__menuitem';

        for (let i = 0; i < 3; i++) {
            try {
                await selector.scrollIntoViewIfNeeded();
                await selector.evaluate(node => node.click());
                await page.waitForTimeout(2000);

                // Priority: Use portal/menu if active to avoid background clicks (Invoices list)
                let options = page.locator('.chakra-portal, [role="menu"], [role="listbox"]').locator(optionSelector).filter({ visible: true });
                let count = await options.count();

                // Fallback: Use page-wide search if no portal is active (keeps Vendor selection working)
                if (count === 0) {
                    options = page.locator(optionSelector).filter({ visible: true });
                    count = await options.count();
                }

                if (count > 0) {
                    const randomIndex = Math.floor(Math.random() * count);
                    const target = options.nth(randomIndex);
                    const optText = await target.innerText().catch(() => "an option");
                    console.log(`Action: Selecting ${optText} for ${labelName}`);
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

    async function ensureVendorWithPO(page) {
        const vendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        const poBtn = page.getByRole('button', { name: 'Purchase Order selector' });
        const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], .chakra-menu__menuitem';

        for (let i = 0; i < 15; i++) {
            console.log(`\n🔄 Attempt ${i + 1}: Selecting Vendor...`);
            await selectRandomOption(page, vendorBtn, 'Vendor');

            // Wait for PO button to be available/stable
            await page.waitForTimeout(2000);
            await poBtn.waitFor({ state: 'visible', timeout: 15000 });

            // Check if it's enabled after waiting
            const isEnabled = await poBtn.isEnabled();
            if (!isEnabled) {
                console.log("⚠️ PO Selector not enabled yet, waiting briefly...");
                await page.waitForTimeout(2000);
            }

            await poBtn.evaluate(node => node.click());

            const poOptions = page.locator(optionSelector).filter({ visible: true });
            try {
                await poOptions.first().waitFor({ state: 'visible', timeout: 5000 });
            } catch (error) { }

            const poCount = await poOptions.count();
            if (poCount > 0) {
                console.log(`✅ Found ${poCount} POs. Selecting one...`);
                await poOptions.first().evaluate(node => node.click());
                await page.keyboard.press('Escape');
                return true;
            } else {
                console.log("❌ No POs available for this vendor. Retrying...");
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);
            }
        }
        throw new Error("Unable to find a vendor with an associated PO.");
    }

    async function ensureSufficientCashAccount(page) {
        const cashAccountBtn = page.getByRole('button', { name: 'Cash Account selector' });
        for (let i = 0; i < 20; i++) {
            console.log(`\n🔄 Attempt ${i + 1}: Selecting Cash Account...`);
            await selectRandomOption(page, cashAccountBtn, 'Cash Account');
            await page.waitForTimeout(3000);

            // Targeted error detection based on screenshot
            const errorMsg = page.locator('.chakra-form__error-message, .css-1klfsl3, .css-dgbujh').filter({ hasText: /insufficient|balance|money/i });
            const toastError = page.locator('.chakra-toast, role=status, role=alert').filter({ hasText: /insufficient|balance|required/i });
            const btnText = await cashAccountBtn.innerText();
            const isUnselected = !btnText || btnText.toLowerCase().includes("selector") || btnText.trim() === "";

            if (await errorMsg.isVisible({ timeout: 1000 }).catch(() => false) ||
                await toastError.isVisible({ timeout: 1000 }).catch(() => false) ||
                isUnselected) {
                console.log(`⚠️ Account "${btnText}" has insufficient funds. Retrying...`);
                await page.keyboard.press('Escape');
                await page.waitForTimeout(1000);
            } else {
                console.log(`✅ Account "${btnText}" selected and appear funded!`);
                return true;
            }
        }
        throw new Error("Unable to find a funded Cash Account after 20 attempts.");
    }

    // --- Main Integrated Test ---

    test('Full Flow: Create Bill -> Approve -> Pay Bill -> Approve', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        // 1. Login (Once for the entire flow)
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // PART A: Create Bill
        console.log("\n--- PART A: Creating Bill ---");
        await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });
        await ensureVendorWithPO(page);

        console.log("📅 Configuring bill dates...");
        const datePickers = page.locator('button:has(span.formatted-date), button:has(img)');
        const today = new Date().getDate().toString();
        await datePickers.nth(1).evaluate(node => node.click());
        await page.getByRole('button', { name: today, exact: true }).first().evaluate(node => node.click());
        await page.waitForTimeout(1000);
        await datePickers.nth(0).evaluate(node => node.click());
        await page.getByRole('button', { name: today, exact: true }).first().evaluate(node => node.click());

        await selectRandomOption(page, page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');

        console.log("📦 Linking PO Items...");
        const receivedPoTab = page.getByRole('tab', { name: 'Received Purchase Order' });
        await receivedPoTab.evaluate(node => node.click());
        await page.waitForTimeout(2000);
        const poCheckbox = page.locator('.chakra-checkbox__control').first();
        if (await poCheckbox.isVisible()) {
            await poCheckbox.evaluate(node => node.click());
            await page.waitForTimeout(1000);
            const qtyInput = page.locator('input[id*="received_quantity"]').first();
            if (await qtyInput.isVisible()) {
                const currentVal = parseFloat(await qtyInput.inputValue());
                const fillValue = Math.floor(currentVal / 2) || 1;
                await qtyInput.fill(fillValue.toString());
            }
        }

        console.log("➕ Adding standalone line item...");
        await page.getByRole('tab', { name: 'Purchases' }).evaluate(node => node.click());
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Line Item' }).evaluate(node => node.click());
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });
        await modal.getByRole('button', { name: 'Item', exact: true }).evaluate(node => node.click());
        await selectRandomOption(page, modal.getByRole('button', { name: 'Item selector' }), 'Inventory Item');
        await page.waitForTimeout(2000);

        // Warehouse retry loop
        let locFound = false;
        for (let w = 0; w < 5; w++) {
            await selectRandomOption(page, modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
            await page.waitForTimeout(3000);
            if (await selectRandomOption(page, modal.getByRole('button', { name: 'Location selector' }), 'Location', true) > 0) {
                locFound = true; break;
            }
        }
        if (!locFound) throw new Error("No warehouse with locations.");

        await modal.locator('div.chakra-form-control').filter({ hasText: /^Unit Price \*/ }).getByRole('spinbutton').fill("1000");
        await modal.locator('div.chakra-form-control').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill("2");
        await selectRandomOption(page, modal.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');
        await modal.getByRole('button', { name: 'Add', exact: true }).evaluate(node => node.click());
        await expect(modal).not.toBeVisible({ timeout: 15000 });

        console.log("🚀 Submitting Bill...");
        const addNowBill = page.getByRole('button', { name: 'Add Now' });
        await expect(addNowBill).toBeEnabled();
        await addNowBill.evaluate(node => node.click());

        await page.waitForURL(/\/payables\/bills\/.*\/detail$/, { waitUntil: 'networkidle' });
        await page.waitForSelector('text=Bill Detail', { timeout: 60000 });
        await page.waitForTimeout(3000);

        console.log("🔍 Capturing Bill and Vendor details...");
        const container = page.locator('div.css-1pnc0bn').first();
        await container.waitFor({ state: 'visible', timeout: 30000 });
        const generalColumn = container.locator('> div').first();

        // Vendor name
        const vValueSelector = generalColumn.locator('> div:nth-child(2) p').last();
        await vValueSelector.waitFor({ state: 'visible', timeout: 15000 });
        const vendorName = (await vValueSelector.innerText()).trim();

        // Bill ID
        const bValueSelector = generalColumn.locator('> div:nth-child(3) p').last();
        await bValueSelector.waitFor({ state: 'visible', timeout: 15000 });
        const billNumFull = (await bValueSelector.innerText()).trim();
        const billMatch = billNumFull.match(/BILL\/[^\s,]+/);
        const billNum = billMatch ? billMatch[0] : billNumFull;

        console.log(`📍 Captured Data: Bill=[${billNum}], Vendor=[${vendorName}]`);

        await app.handleApprovalFlow();
        console.log(`✅ Bill ${billNum} Approved.`);

        // PART B: Create Payment (Mirrors payment.spec.js "well-worked" flow)
        console.log(`\n--- PART B: Creating Payment for Bill ${billNum} ---`);
        await page.goto('/payables/payments/new', { waitUntil: 'networkidle' });

        // 1. Select specific Vendor
        console.log(`🏪 Selecting specific Vendor: ${vendorName}`);
        const vendorBtnPayment = page.getByRole('button', { name: 'Vendor selector' });
        await vendorBtnPayment.evaluate(node => node.click());
        await page.waitForTimeout(1500);

        const vendorModal = page.getByRole('dialog').last();
        const searchBox = vendorModal.getByPlaceholder(/Search/i);
        if (await searchBox.isVisible()) {
            await searchBox.clear();
            await searchBox.fill(vendorName);
            await page.waitForTimeout(2000);
        }

        const vendorOption = vendorModal.locator('div, p, span, [role="option"], .chakra-checkbox').filter({ hasText: new RegExp(`^${vendorName}$`, 'i') }).last();
        await vendorOption.scrollIntoViewIfNeeded();
        await vendorOption.evaluate(node => node.click());
        await page.keyboard.press('Escape');

        // 2. Select the specific Bill in Invoices Tab
        console.log(`🧾 Locating and selecting Bill ${billNum} in Invoices tab...`);
        const invoicesTab = page.locator('button[role="tab"]').filter({ hasText: /Invoices/i });
        await invoicesTab.evaluate(node => node.click());
        await page.waitForTimeout(3000);

        const billRow = page.locator('div, tr, [role="row"]').filter({ hasText: billNum })
            .filter({ has: page.locator('.chakra-checkbox, input[type="checkbox"]') }).first();

        await billRow.scrollIntoViewIfNeeded();
        await expect(billRow).toBeVisible({ timeout: 20000 });

        const billCheckbox = billRow.locator('.chakra-checkbox, input[type="checkbox"]').first();
        await billCheckbox.evaluate(node => node.click());
        await page.waitForTimeout(1000);

        // 3. Fill Payment Amount
        const paymentInput = page.locator('input[role="spinbutton"], input[type="number"], .chakra-numberinput input').first();
        const amtDueRaw = await paymentInput.inputValue();
        const amtToPay = Math.floor(parseFloat(amtDueRaw.replace(/,/g, '')) / 2) || 1;
        await paymentInput.fill(amtToPay.toString());

        // 4. Standalone Expense Item (Exact payment.spec.js pattern)
        console.log("➕ Adding supplemental expense item...");
        const expensesTab = page.getByRole('tab', { name: /Expenses/i });
        if (await expensesTab.isVisible()) {
            await expensesTab.evaluate(node => node.click());
            await page.waitForTimeout(1000);
            await page.getByRole('button', { name: /Line Item/i }).first().evaluate(node => node.click());
            const exModal = page.getByRole('dialog').last();
            await exModal.waitFor({ state: 'visible' });
            await exModal.getByRole('button', { name: 'Item', exact: true }).evaluate(node => node.click());

            await selectRandomOption(page, exModal.getByRole('button', { name: 'Item selector' }), 'Inventory Item');
            await page.waitForTimeout(2000);

            let locFoundEx = false;
            for (let w = 0; w < 5; w++) {
                await selectRandomOption(page, exModal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
                await page.waitForTimeout(3000);
                if (await selectRandomOption(page, exModal.getByRole('button', { name: 'Location selector' }), 'Location', true) > 0) {
                    locFoundEx = true; break;
                }
            }

            await exModal.locator('div.chakra-form-control').filter({ hasText: /^Unit Price \*/ }).getByRole('spinbutton').fill("500");
            await exModal.locator('div.chakra-form-control').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill("1");
            await selectRandomOption(page, exModal.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');
            await exModal.getByRole('button', { name: 'Add', exact: true }).evaluate(node => node.click());

            // Return to Invoices tab as per payment.spec
            const invTabReturn = page.locator('button[role="tab"]').filter({ hasText: /Invoices/i });
            await invTabReturn.evaluate(node => node.click());
        }

        // 5. Select funded Cash Account
        console.log("💳 Configuring payment method and bank...");
        const methodSelect = page.getByLabel('Payment Method *');
        if (await methodSelect.isVisible()) await methodSelect.selectOption('cash');

        await ensureSufficientCashAccount(page);

        // 6. Submit and Approve
        console.log("🚀 Submitting Payment...");
        const addNowPayment = page.getByRole('button', { name: 'Add Now' });
        await expect(addNowPayment).toBeEnabled();
        await addNowPayment.evaluate(node => node.click());

        await page.waitForURL(/\/payables\/payments\/.*\/detail$/, { waitUntil: 'networkidle' });
        const payRef = await page.locator('p.chakra-text').filter({ hasText: /PAY\/\d{4}/ }).first().innerText();
        console.log(`📍 Captured Payment Ref: ${payRef}`);

        await app.handleApprovalFlow();
        console.log(`✅ Payment ${payRef} for Bill ${billNum} successfully Approved!`);
    });
});
