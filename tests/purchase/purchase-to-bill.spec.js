const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Purchase to Bill — Full PO → Bill Lifecycle', () => {

    test('Create PO via UI, approve, create linked bill, verify in vendor profile', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);

        console.log('[STEP] Phase 1: Login & PO Creation');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.goto('/payables/purchase-orders/new', { waitUntil: 'networkidle' });

        await app.pickDate('Purchase Order Date');
        console.log('[OK] Order date set');

        const vendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        await app.selectRandomOption(vendorBtn, 'Vendor');
        const selectedVendor = (await vendorBtn.textContent({ timeout: 5000 })).trim() || 'Unknown Vendor';
        console.log(`[INFO] Vendor: ${selectedVendor}`);

        // Quotes (optional)
        try {
            const quotesBtn = page.getByRole('button', { name: 'Quotes selector' });
            await quotesBtn.scrollIntoViewIfNeeded();
            await quotesBtn.click({ timeout: 5000 });
            await page.waitForTimeout(1500);
            const quoteOptions = page.locator('button, div[role="group"], [role="option"], [role="menuitem"]').filter({ hasText: /^QTE\/\d{4}/ }).filter({ visible: true });
            const quoteCount = await quoteOptions.count();
            if (quoteCount > 0) {
                await quoteOptions.nth(Math.floor(Math.random() * quoteCount)).click({ force: true });
                console.log(`[OK] Quote selected (${quoteCount} available)`);
            } else {
                await page.keyboard.press('Escape');
                console.log('[INFO] No quotes available');
            }
        } catch {
            await page.keyboard.press('Escape').catch(() => {});
            console.log('[INFO] Quotes not interactable');
        }

        // Financial Mappings
        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
        await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
        await app.selectRandomOption(page.getByRole('button', { name: 'Discount Term selector' }), 'Discount Term', true);

        // Line Item
        console.log('[STEP] Adding line item');
        await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible', timeout: 15000 });

        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        await app.selectRandomOption(modal.getByRole('button', { name: 'Item selector' }), 'Item');
        await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
        await app.selectRandomOption(modal.getByRole('button', { name: 'G/L Account selector' }), 'G/L Account');

        const qty = (Math.floor(Math.random() * 10) + 1).toString();
        await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill(qty);
        const unitPrice = (Math.floor(Math.random() * 9000) + 1000).toString();
        await modal.getByRole('group').filter({ hasText: /Unit Price/i }).getByRole('spinbutton').fill(unitPrice);
        await app.selectRandomOption(modal.getByRole('button', { name: 'Tax selector' }), 'Tax', true);

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible({ timeout: 15000 });
        console.log(`[OK] Line item added (Price: ${unitPrice})`);

        // Submit PO
        console.log('[STEP] Submitting PO');
        const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addNowBtn).toBeEnabled({ timeout: 15000 });
        await addNowBtn.evaluate((node) => {
            node.click();
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('input', { bubbles: true }));
        });

        await page.waitForURL(/\/payables\/purchase-orders\/.*\/detail$/, { timeout: 120000 });
        const poElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^PO\/\d{4}\// }).first();
        await poElement.waitFor({ state: 'attached', timeout: 30000 });
        const poText = await poElement.textContent();
        const poNumber = (poText.match(/PO\/\d{4}\/\d{2}\/\d{2}\/\d+/) || [poText.trim()])[0];
        console.log(`[OK] PO created: ${poNumber} | Vendor: ${selectedVendor}`);

        await app.handleApprovalFlow();
        console.log(`[OK] PO ${poNumber} approved`);

        // Phase 2: Bill Creation
        console.log(`[STEP] Phase 2: Creating Bill from PO ${poNumber}`);
        await page.reload({ waitUntil: 'networkidle' });
        await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });

        console.log(`[INFO] Matching vendor: ${selectedVendor}`);
        const billVendorBtn = page.getByRole('button', { name: 'Vendor selector' });
        await billVendorBtn.waitFor({ state: 'visible' });
        await billVendorBtn.click({ timeout: 5000 });
        await app.smartSearch(null, selectedVendor);
        await page.waitForTimeout(1000);

        console.log(`[INFO] Linking PO: ${poNumber}`);
        const billPOBtn = page.getByRole('button', { name: 'Purchase Order selector' });
        await expect(billPOBtn).toBeEnabled({ timeout: 15000 });
        await billPOBtn.click({ timeout: 5000 });
        await app.smartSearch(null, poNumber);
        await page.keyboard.press('Escape');

        const todayDay = await app.getActiveCalendarDay();
        const dueDay = Math.min(30, todayDay + Math.floor(Math.random() * 4) + 2);
        await app.pickDate('Invoice Date', todayDay);
        await app.pickDate('Due Date', dueDay);
        console.log(`[INFO] Dates: Invoice Day ${todayDay}, Due Day ${dueDay}`);

        await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
        await app.handlePOReceiptTab();

        console.log('[STEP] Submitting bill');
        const addBillBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(addBillBtn).toBeEnabled({ timeout: 10000 });
        await addBillBtn.evaluate(node => node.click());

        await page.waitForURL(/\/payables\/bills\/.*\/detail$/, { timeout: 120000 });
        const billElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^BILL\/\d{4}\// }).first();
        await billElement.waitFor({ state: 'attached', timeout: 30000 });
        const billText = await billElement.textContent();
        const billNumber = (billText.match(/BILL\/\d{4}\/\d{2}\/\d{2}\/\d+/) || [billText.trim()])[0];
        console.log(`[OK] Bill created: ${billNumber} | Vendor: ${selectedVendor}`);

        await app.handleApprovalFlow();
        console.log(`[OK] Bill ${billNumber} approved`);

        // Phase 3: Vendor Profile Verification
        console.log(`[STEP] Phase 3: Verifying ${billNumber} in vendor profile`);
        await app.verifyDocInProfile('vendor', selectedVendor, billNumber);

        console.log(`[RESULT] Purchase to Bill: PASSED — PO ${poNumber} -> Bill ${billNumber}`);
        await page.close();
    });
});
