import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Sales Receipt — Create Receipt & Verify in Customer Profile @regression', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.waitForTimeout(5000);
    });

    test('Create fresh invoice via API, then create receipt and link it', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        const { soDate: receiptDate } = app.getTransactionDates();

        // Phase 1: API Setup (Guarantees document for linkage)
        console.log('[STEP] Phase 1: Creating fresh Sales Order & Invoice via API');
        const itemResult = await app.captureRandomItemDetails();
        const soResult = await app.createSalesOrderAPI({ 
            itemId: itemResult.itemId,
            locationId: itemResult.locationId,
            warehouseId: itemResult.warehouseId
        });
        if (!soResult.success) throw new Error("SO API Failed");

        // Approve SO to make it linkable
        await page.goto(`/receivables/sale-orders/${soResult.id}/detail`);
        // ⚡ Fast API Approval
        const soId = await app.extractIdFromUrl();
        await app.advanceDocumentAPI(soId, 'sales-orders');
        await page.reload(); // 🔄 Synchronization
        console.log(`[OK] Sales Order approved via Fast-API`);

        const invResult = await app.createInvoiceAPI({
            customerId: soResult.customerId,
            soId: soResult.id,
            soItemId: soResult.soItemId,
            locationId: itemResult.locationId,
            warehouseId: itemResult.warehouseId
        });
        if (!invResult.success) throw new Error("Invoice API Failed");

        // Approve Invoice
        await page.goto(`/receivables/invoices/${invResult.id}/detail`);
        // ⚡ Fast API Approval
        const invId = await app.extractIdFromUrl();
        await app.advanceDocumentAPI(invId, 'invoices');
        await page.reload(); // 🔄 Synchronization
        console.log(`[OK] Invoice approved via Fast-API`);

        // Read customer name directly from the invoice detail page (most reliable)
        const CUSTOMER_NAME = await page.locator('p.chakra-text.css-0').first().innerText().catch(() => '');
        const INVOICE_ID = invResult.ref;
        console.log(`[INFO] Document Setup Complete: ${INVOICE_ID} for ${CUSTOMER_NAME}`);

        // Phase 2: Create Receipt via API (Bypass UI for linkage reliability)
        console.log('[STEP] Phase 2: Creating linked receipt via API');
        const invoiceData = await app.getInvoiceAPI(invResult.id);
        const invTotal = invoiceData.total_amount || invoiceData.net_total || 1000; // Fallback if meta missing

        const rcptResult = await app.createInvoiceReceiptAPI({
            invoiceId: invResult.id,
            customerId: soResult.customerId,
            amount: invTotal
        });
        
        if (!rcptResult.success) throw new Error("Receipt API Creation Failed");
        const capturedReceiptNumber = rcptResult.ref;
        const rcptId = rcptResult.id;
        console.log(`[OK] Receipt created via API: ${capturedReceiptNumber}`);

        // Phase 3: Approval
        console.log('[STEP] Phase 3: Approval flow');
        // ⚡ Fast API Approval
        await app.advanceDocumentAPI(rcptId, 'receipts');
        await page.reload(); // 🔄 Synchronization
        console.log(`[OK] Receipt approved via Fast-API`);
        console.log('[OK] Receipt approved');

        // Phase 4: Customer Profile Verification
        console.log(`[STEP] Phase 4: Verifying ${capturedReceiptNumber} in customer profile`);
        await page.goto('/receivables/customers');

        const searchInput = page.locator('input[placeholder="Search for customers..."]');
        await searchInput.waitFor({ state: 'visible' });
        await searchInput.fill(CUSTOMER_NAME);
        await page.waitForTimeout(3000);

        await page.locator('table tbody tr').filter({ hasText: CUSTOMER_NAME }).first().locator('td a').first().click({ force: true });
        await page.waitForSelector('text=Customer Details');

        await page.getByRole('tab', { name: /Receipts|Transactions/i }).click();
        await page.reload();
        await page.waitForTimeout(3000);
        await page.getByRole('tab', { name: /Receipts|Transactions/i }).click();

        const rcptLocator = page.locator('table').getByText(capturedReceiptNumber);
        await expect(rcptLocator.first()).toBeVisible({ timeout: 30000 });

        console.log(`[RESULT] Sales Receipt: PASSED — ${capturedReceiptNumber} verified in profile`);
        await page.close();
    });
});
