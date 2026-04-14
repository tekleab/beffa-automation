import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Sales — Credit Note (Return Flow) @regression', () => {

    test('Create Invoice, Approve, then Create Credit Note and Verify Stock', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // Stage 1: Setup Invoice via API (High Speed)
        console.log('[STEP] Stage 1: Creating fresh Invoice via API');
        const itemResult = await app.captureRandomItemDataAPI();
        const so = await app.createSalesOrderAPI({ itemId: itemResult.itemId });
        await page.goto(`/receivables/sale-orders/${so.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();

        const inv = await app.createInvoiceAPI({
            customerId: so.customerId,
            soId: so.id,
            soItemId: so.soItemId,
            releasedQuantity: 1
        });

        if (!inv.success) throw new Error(`Invoice setup failed: ${inv.error}`);

        await page.goto(`/receivables/invoices/${inv.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Base Invoice Approved: ${inv.ref}`);

        // Stage 2: Create Credit Note (Return)
        console.log('[STEP] Stage 2: Creating Credit Note (Return)');
        // TODO: Implement createCreditNoteAPI once the user shares the POST capture
        console.log('[INFO] Waiting for user to share Sales Credit Note POST capture...');

        // Placeholder for the return logic
        await page.goto(`/receivables/invoices/${inv.id}/detail`);
        const reverseBtn = page.getByRole('button', { name: /Reverse|Return|Credit Note/i }).first();
        if (await reverseBtn.isVisible()) {
            await reverseBtn.click();
            // ... logic to fill credit note ...
        }

        console.log('[RESULT] Sales Credit Note: (Pending Implementation)');
    });
});
