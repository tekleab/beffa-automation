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

        // 1. Pick a random item with stock via API (with Retry for Availability)
        let soData;
        for (let attempt = 0; attempt < 5; attempt++) {
            initialInfo = await app.captureRandomItemDataAPI();
            console.log(`[ACTION] Discovery Attempt ${attempt + 1}: Testing "${initialInfo.itemName}" (Stock: ${initialInfo.currentStock})`);
            
            soData = await app.createSalesOrderAPI({ itemId: initialInfo.itemId, quantity: 1 });
            if (soData.success) break;
            
            if (soData.status === 422 && soData.error?.toLowerCase().includes('insufficient stock')) {
                console.log(`[WARN] "${initialInfo.itemName}" has physical stock but 0 available. Retrying discovery...`);
                continue;
            }
            throw new Error(`SO API Creation Failed: ${soData.status} - ${soData.error}`);
        }

        if (!soData || !soData.success) throw new Error('Failed to find an available item after 5 attempts.');

        // ⚡ Fast API Approval
        await app.advanceDocumentAPI(soData.id, 'sales-orders');
        console.log(`[OK] Sales Order ${soData.ref} approved via Fast-API`);

        // 3. Create Invoice via API (linked to SO)
        console.log(`[STEP] Phase 3: Creating Invoice via API from SO ${soData.ref}`);
        const invData = await app.createInvoiceAPI({
            customerId: soData.customerId,
            soItemId: soData.soItemId,
            releasedQuantity: 1
        });

        // ⚡ Fast API Approval
        await app.advanceDocumentAPI(invData.id, 'invoices');
        invID = invData.ref!;
        invUUID = invData.id!;
        console.log(`[OK] Invoice ${invID} approved via Fast-API`);

        console.log('[STEP] Verifying stock deduction via API Polling');
        const expectedStock = initialInfo.currentStock - 1;
        const currentStock = await app.pollStockAPI(initialInfo.itemId, expectedStock);

        console.log(`[VERIFY] Expected: ${expectedStock} | Found: ${currentStock}`);
        expect(currentStock).toBe(expectedStock);
        console.log('[OK] Stock decreased correctly after setup.');
    });

    test('Stage 2: Reverse invoice, verify stock restoration @regression', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        if (!invUUID) throw new Error('Stage 2 Failed: No invoice was created in Stage 1.');

        console.log(`[STEP] Phase 2: Reversing Invoice ${invID} via API`);
        const success = await app.reverseInvoiceAPI(invUUID);
        expect(success).toBe(true);
        console.log(`[OK] Invoice ${invID} successfully reversed via Backend API`);

        console.log('[STEP] Verifying stock restoration via API Polling');
        const expectedStock = initialInfo!.currentStock;
        const finalStock = await app.pollStockAPI(initialInfo!.itemId, expectedStock);

        console.log(`[VERIFY] Expected (restored): ${expectedStock} | Found: ${finalStock}`);
        expect(finalStock).toBe(expectedStock);
        console.log(`[RESULT] Invoice Reversal: PASSED — Stock restored to ${finalStock}`);
        
        await page.close();
    });
});
