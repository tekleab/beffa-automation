import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe.serial('Invoice Reversal Flow @regression', () => {
    let invID: string | null = null;
    let invUUID: string | null = null;
    let initialInfo: Awaited<ReturnType<AppManager['captureRandomItemDataAPI']>> | null = null;

    test('Stage 1: Setup via API (SO & Invoice), verify stock deduction @smoke', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        console.log('[STEP] Stage 1: Login & Setup');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // 1. Pick a random item with stock via API (High Speed)
        initialInfo = await app.captureRandomItemDataAPI();
        console.log(`[OK] Discovered: "${initialInfo.itemName}" via API | Initial Stock: ${initialInfo.currentStock}`);

        // 2. Create Sales Order via API & Approve in UI
        console.log(`[STEP] Phase 2: Creating Sales Order via API for ${initialInfo.itemName}`);
        const soData = await app.createSalesOrderAPI({ itemId: initialInfo.itemId, quantity: 1 });
        
        if (!soData.success) {
            if (soData.status === 422 && soData.error?.toLowerCase().includes('insufficient stock')) {
                console.log(`[PASS] Valid Validation: System correctly blocked order due to insufficient stock for ${initialInfo.itemName}`);
                return; // Mark as passed per user requirement
            }
            throw new Error(`SO API Creation Failed: ${soData.status} - ${soData.error}`);
        }

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
        invID = invData.ref!;
        invUUID = invData.id!;
        console.log(`[OK] Invoice ${invID} created and approved via API+UI flow`);

        console.log('[STEP] Verifying stock deduction via API');
        const postInv = await app.getItemDetailsAPI(initialInfo.itemId);
        const expectedStock = initialInfo.currentStock - 1;

        console.log(`[VERIFY] Expected: ${expectedStock} | Found: ${postInv!.currentStock}`);
        if (postInv!.currentStock !== expectedStock) {
            throw new Error(`Stock deduction failed. Expected ${expectedStock}, found ${postInv!.currentStock}`);
        }
        console.log('[OK] Stock decreased correctly after pure setup flow');
    });

    test('Stage 2: Reverse invoice, verify stock restoration @regression', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP] Navigating directly to Invoice ${invID} (${invUUID})`);
        await page.goto(`/receivables/invoices/${invUUID}/detail`, { waitUntil: 'load' });
        await page.waitForTimeout(3000);

        console.log(`[STEP] Triggering reversal for ${invID} via UI (API deferred)`);
        await page.getByRole('button', { name: 'Reverse' }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Reverse' }).click();
        await page.waitForTimeout(6000);

        const badge = page.locator('.chakra-badge').filter({ hasText: /Reversed/i }).first();
        if (await badge.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log(`[OK] ${invID} status changed to Reversed`);
        }

        console.log('[STEP] Verifying stock restoration via API');
        const finalInfo = await app.getItemDetailsAPI(initialInfo!.itemId);

        console.log(`[VERIFY] Expected (restored): ${initialInfo!.currentStock} | Found: ${finalInfo!.currentStock}`);
        if (finalInfo!.currentStock !== initialInfo!.currentStock) {
            throw new Error(`Stock restoration failed. Expected ${initialInfo!.currentStock}, found ${finalInfo!.currentStock}`);
        }
        console.log(`[RESULT] Invoice Reversal: PASSED — Stock restored to ${finalInfo!.currentStock}`);
        await page.close();
    });
});
