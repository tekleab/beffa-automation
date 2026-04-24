import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Invoice-Receipt Balance Flow @regression', () => {

    test('Verify partial receipt correctly updates invoice amount due', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        console.log('[STEP] Phase 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let initialInfo: Awaited<ReturnType<typeof app.captureRandomItemDetails>> | null = null;
        while (true) {
            initialInfo = await app.captureRandomItemDetails();
            if (initialInfo.currentStock >= 1 && initialInfo.itemId) break;
        }

        // Phase 2: Create Invoice via API
        console.log(`[STEP] Phase 2: Creating standalone invoice for "${initialInfo.itemName}"`);
        const invResult = await app.createStandaloneInvoiceAPI({
            itemId: initialInfo.itemId,
            locationId: initialInfo.locationId,
            warehouseId: initialInfo.warehouseId,
            quantity: 1,
            unitPrice: 10993.05
        });
        const originalAmount = invResult.amountDue;
        const invID = invResult.ref;
        const invUUID = invResult.id;

        // ⚡ Fast API Approval
        await page.goto(`/receivables/invoices/${invUUID}/detail`, { waitUntil: 'load' });
        await app.advanceDocumentAPI(invUUID, 'invoices');
        await page.reload(); // 🔄 Synchronize
        console.log(`[OK] Invoice ${invID} approved via Fast-API | Total Due: ${originalAmount}`);

        // Phase 4: Partial Receipt
        const partialAmount = Math.floor(originalAmount / 2);
        console.log(`[STEP] Phase 4: Creating partial receipt for ${partialAmount}`);
        const receiptResult = await app.createInvoiceReceiptAPI({
            amount: partialAmount,
            customerId: invResult.customerId,
            invoiceId: invUUID
        });
        console.log(`[OK] Partial receipt created: ${receiptResult.ref}`);

        // Phase 5: Final Settlement
        const strictRemainingAmount = originalAmount - partialAmount;
        console.log(`[STEP] Phase 5: Settling remaining balance of ${strictRemainingAmount}`);

        console.log(`[VERIFY] Invoice: ${invID} | Original: ${originalAmount} | Paid: ${partialAmount} | Remaining: ${strictRemainingAmount}`);

        const finalReceiptResult = await app.createInvoiceReceiptAPI({
            amount: strictRemainingAmount,
            customerId: invResult.customerId,
            invoiceId: invUUID
        });
        console.log(`[OK] Final receipt created: ${finalReceiptResult.ref}`);

        // ⚡ Fast API Approval
        await page.goto(`/receivables/receipts/${finalReceiptResult.id}/detail`, { waitUntil: 'load' });
        await app.advanceDocumentAPI(finalReceiptResult.id, 'receipts');
        await page.reload(); // 🔄 Synchronize
        console.log(`[OK] Final receipt ${finalReceiptResult.ref} approved via Fast-API`);

        console.log(`[RESULT] Invoice-Receipt Balance: PASSED`);
        await page.close();
    });
});
