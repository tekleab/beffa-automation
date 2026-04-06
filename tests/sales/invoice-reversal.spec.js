const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe.serial('Invoice Reversal — Create, Approve, Reverse, Verify Stock Restoration', () => {
    let invID = null;
    let invUUID = null;
    let initialInfo = null;

    test('Stage 1: Setup via API (SO & Invoice), verify stock deduction', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        console.log('[STEP] Stage 1: Login & Setup');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // 1. Pick a random item with stock
        while (true) {
            initialInfo = await app.captureRandomItemDetails();
            if (initialInfo.currentStock >= 2) break;
            console.log(`[INFO] Item "${initialInfo.itemName}" stock too low. Retrying...`);
        }
        console.log(`[INFO] Item: "${initialInfo.itemName}" | Initial Stock: ${initialInfo.currentStock}`);

        // 2. Create Sales Order via API & Approve in UI
        console.log(`[STEP] Phase 2: Creating Sales Order via API for ${initialInfo.itemName}`);
        const soData = await app.createSalesOrderAPI({ itemId: initialInfo.itemId, quantity: 1 });
        await page.goto(`/receivables/sale-orders/${soData.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Sales Order ${soData.ref} approved (Released)`);

        // 3. Create Invoice via API (linked to SO) & Approve in UI
        console.log(`[STEP] Phase 3: Creating Invoice via API from SO ${soData.ref}`);
        const invData = await app.createInvoiceAPI({
            customerId: soData.customerId,
            soItemId: soData.soItemId,
            releasedQuantity: 1
        });
        
        await page.goto(`/receivables/invoices/${invData.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        invID = invData.ref;
        invUUID = invData.id;
        console.log(`[OK] Invoice ${invID} created and approved via API+UI flow`);

        console.log('[STEP] Verifying stock deduction');
        const { currentStock: postInvStock } = await app.captureItemDetails(initialInfo.itemName);
        const expectedStock = initialInfo.currentStock - 1;

        console.log(`[VERIFY] Expected: ${expectedStock} | Found: ${postInvStock}`);
        if (postInvStock !== expectedStock) {
            throw new Error(`Stock deduction failed. Expected ${expectedStock}, found ${postInvStock}`);
        }
        console.log('[OK] Stock decreased correctly after pure setup flow');
    });

    test('Stage 2: Reverse invoice, verify stock restoration', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP] Navigating directly to Invoice ${invID} (${invUUID})`);
        await page.goto(`/receivables/invoices/${invUUID}/detail`, { waitUntil: 'load' });
        await page.waitForTimeout(3000);

        console.log(`[STEP] Triggering reversal for ${invID}`);
        await page.getByRole('button', { name: 'Reverse' }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Reverse' }).click();
        await page.waitForTimeout(6000);

        const badge = page.locator('.chakra-badge').filter({ hasText: /Reversed/i }).first();
        if (await badge.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log(`[OK] ${invID} status changed to Reversed`);
        } else {
            console.log(`[INFO] Reversal badge not visible yet, proceeding to verify stock`);
        }

        console.log('[STEP] Verifying stock restoration');
        const { currentStock: finalStock } = await app.captureItemDetails(initialInfo.itemName);

        console.log(`[VERIFY] Expected (restored): ${initialInfo.currentStock} | Found: ${finalStock}`);
        if (finalStock !== initialInfo.currentStock) {
            throw new Error(`Stock restoration failed. Expected ${initialInfo.currentStock}, found ${finalStock}`);
        }
        console.log(`[RESULT] Invoice Reversal: PASSED — Stock restored to ${finalStock}`);
        await page.close();
    });
});
