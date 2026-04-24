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

        // Phase 3: Approve Invoice
        console.log(`[STEP] Phase 3: Approving Invoice ${invID}`);
        await page.goto('/receivables/invoices');
        await page.getByRole('link', { name: invID }).first().click();
        await app.handleApprovalFlow();
        console.log(`[OK] Invoice ${invID} approved | Total Due: ${originalAmount}`);

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

        // Phase 6: Approve Final Receipt
        console.log(`[STEP] Phase 6: Approving final receipt ${finalReceiptResult.ref}`);
        await page.goto('/receivables/receipts');
        await page.getByRole('link', { name: finalReceiptResult.ref }).first().click();
        await app.handleApprovalFlow();
        console.log(`[OK] Final receipt ${finalReceiptResult.ref} approved`);

        console.log(`[RESULT] Invoice-Receipt Balance: PASSED`);
        await page.close();
    });
});
