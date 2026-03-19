const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();

test.describe('Quotes Creation - Capture then Approve', () => {

    // የጋራ ምርጫዎችን ለመምረጥ የሚያገለግል ፈንክሽን
    async function selectRandomOption(page, selector, labelName, isOptional = false) {
        const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], .chakra-menu__menuitem';
        for (let i = 0; i < 3; i++) {
            try {
                await selector.scrollIntoViewIfNeeded();
                await selector.click({ timeout: 5000 });
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

    test('Create Quote, Capture Data, then Approve', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);

        // 1. መግቢያና መረጃ መሙላት
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/quotes/new', { waitUntil: 'networkidle' });

        await page.locator('button:has(span.formatted-date)').first().click();
        await page.getByRole('button', { name: '2', exact: true }).first().click();
        await selectRandomOption(page, page.getByRole('button', { name: 'Purchase Requisition selector' }), 'PR');
        await selectRandomOption(page, page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');

        // 2. Line Item መሙላት
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });

        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        await selectRandomOption(page, modal.getByRole('button', { name: 'Item selector' }), 'Inventory Item');

        await page.waitForTimeout(2000);
        await selectRandomOption(page, modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await page.waitForTimeout(3000);
        await selectRandomOption(page, modal.getByRole('button', { name: 'Location selector' }), 'Location');

        await modal.locator('div.chakra-form-control').filter({ hasText: /^Unit Price \*/ }).getByRole('spinbutton').fill('1250');
        await modal.locator('div.chakra-form-control').filter({ hasText: /^Quantity \*/ }).getByRole('spinbutton').fill('3');
        await selectRandomOption(page, modal.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible({ timeout: 15000 });

        // 3. Accounts Payable (የመጨረሻ ምርጫ)
        await selectRandomOption(page, page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');

        // 4. Submit (Add Now)
        const addNowBtn = page.getByRole('button', { name: 'Add Now' });
        await page.waitForTimeout(2000);
        await expect(addNowBtn).toBeEnabled();
        await addNowBtn.click();

        // --- 5. DATA CAPTURE (ከ Approval በፊት) ---
        await page.waitForURL(/\/payables\/quotes\/.*\/detail$/, { waitUntil: 'networkidle' });
        console.log("Detail page loaded. Capturing information...");

        // Quote Number መያዝ
        const quoteNumLocator = page.locator('p.chakra-text').filter({ hasText: /QTE\/\d{4}/ }).first();
        await quoteNumLocator.waitFor({ state: 'visible', timeout: 30000 });
        const capturedQuoteNumber = await quoteNumLocator.innerText();

        // Vendor Name መያዝ (ተለዋዋጭ እንዲሆን በ 'vendor:' ሌብል በኩል መፈለግ)
        const vendorLabel = page.locator('p.chakra-text').filter({ hasText: /^vendor:$/i });
        const vendorValue = page.locator('div').filter({ has: vendorLabel }).locator('p.chakra-text').nth(1);

        await vendorValue.waitFor({ state: 'visible', timeout: 15000 });
        const capturedVendor = await vendorValue.innerText();

        // በሪፖርት መልክ ማሳየት
        console.log("------------------------------------------");
        console.log(`📍 DATA CAPTURED BEFORE APPROVAL:`);
        console.log(`📌 Quote ID: ${capturedQuoteNumber}`);
        console.log(`📌 Vendor: ${capturedVendor}`);
        console.log("------------------------------------------");

        // 6. APPROVAL FLOW
        console.log("Starting Approval process for " + capturedQuoteNumber);
        await app.handleApprovalFlow();

        // 7. ማጠቃለያ
        console.log(`✅ Quote ${capturedQuoteNumber} has been captured and approved!`);
        await page.screenshot({ path: `Final_Approved_${capturedQuoteNumber.replace(/\//g, '_')}.png` });
    });
});