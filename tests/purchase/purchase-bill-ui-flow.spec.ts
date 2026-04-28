import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Purchase to Bill Flow @smoke', () => {

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
        const selectedVendor = (await vendorBtn.textContent({ timeout: 5000 }))?.trim() || 'Unknown Vendor';
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
        
        // Pre-wait to ensure dropdown is fully attached to DOM before interacting (fixes the "Failed selection G/L" flakiness)
        const glBtn = modal.getByRole('button', { name: 'G/L Account selector' });
        await glBtn.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
        await app.selectRandomOption(glBtn, 'G/L Account');

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
        await addNowBtn.evaluate((node: HTMLElement) => {
            node.click();
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('input', { bubbles: true }));
        });

        await page.waitForURL(/\/payables\/purchase-orders\/.*\/detail$/, { timeout: 120000 });
        const poElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^PO\/\d{4}\// }).first();
        await poElement.waitFor({ state: 'attached', timeout: 30000 });
        const poText = await poElement.textContent();
        const poNumber = (poText!.match(/PO\/\d{4}\/\d{2}\/\d{2}\/\d+/) || [poText!.trim()])[0];
        console.log(`[OK] PO created: ${poNumber} | Vendor: ${selectedVendor}`);
 
        // ⚡ HYBRID 70/30: Fast API Approval
        const poId = await app.extractIdFromUrl();
        await app.advanceDocumentAPI(poId, 'purchase-orders');
        await page.reload(); // 🔄 Synchronize: Force UI to see the 'Approved' state
        console.log(`[OK] PO ${poNumber} approved via Fast-API`);

        // ⚡ Phase 2: Pure API Bill Creation
        console.log(`[STEP] Phase 2: Generating linked Bill for PO ${poNumber} via API`);
        const { billNumber, billId } = await app.createBillFromPoAPI(poId);
        
        // ⚡ Fast API Approval
        await app.advanceDocumentAPI(billId, 'bills');
        console.log(`[OK] Linked Bill ${billNumber} successfully generated and officially approved instantly via Fast-API!`);
        
        await page.waitForTimeout(2000); // 🔄 Synchronize indexing for backend before verifying profile

        // Phase 3: Verifying the Bill in the Vendor profile via API
        console.log(`[STEP] Phase 3: Verifying ${billNumber} in vendor profile via API`);
        await app.verifyBillInVendorAPI(selectedVendor, billNumber);
        console.log(`[RESULT] Purchase to Bill: PASSED — PO ${poNumber} -> Bill ${billNumber}`);
        await page.close();
    });
});
