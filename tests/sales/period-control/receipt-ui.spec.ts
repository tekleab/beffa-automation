import { test, expect } from'@playwright/test';
import { AppManager } from'../../../pages/AppManager';

test.describe('Sales Receipt — Create Receipt & Verify in Customer Profile @sales @smoke @full', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
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
            quantity: 1,
            locationId: itemResult.locationId,
            warehouseId: itemResult.warehouseId
        });
        if (!soResult.success) throw new Error("SO API Failed");

        // Approve SO directly via API — no navigation needed
        await app.advanceDocumentAPI(soResult.id, 'sales-orders');
        console.log(`[OK] Sales Order ${soResult.ref} approved via API`);

        const invResult = await app.createInvoiceAPI({
            customerId: soResult.customerId,
            soId: soResult.id,
            soItemId: soResult.soItemId,
            releasedQuantity: 1,
            locationId: itemResult.locationId,
            warehouseId: itemResult.warehouseId
        });
        if (!invResult.success) throw new Error("Invoice API Failed");

        // Approve Invoice directly via API
        await app.advanceDocumentAPI(invResult.id!, 'invoices');
        console.log(`[OK] Invoice ${invResult.ref} approved via API`);

        // Read customer name from API
        let CUSTOMER_NAME = await app.getCustomerNameAPI(soResult.customerId);
        if (!CUSTOMER_NAME) throw new Error(`[SETUP_BUG] Could not resolve customer name for id: ${soResult.customerId}`);
        
        const INVOICE_ID = invResult.ref;
        console.log(`[INFO] Document Setup Complete: ${INVOICE_ID} for ${CUSTOMER_NAME}`);

        // Phase 2: Create Receipt via API with retry for server 504s
        console.log('[STEP] Phase 2: Creating linked receipt via API');
        const invoiceData = await app.getInvoiceAPI(invResult.id);
        const invTotal = invoiceData.total_amount || invoiceData.net_total || 1000;

        let rcptResult: any;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                rcptResult = await app.createInvoiceReceiptAPI({
                    invoiceId: invResult.id,
                    customerId: soResult.customerId,
                    amount: invTotal
                });
                break;
            } catch (e: any) {
                if (attempt === 3) throw e;
                console.log(`[RETRY] Receipt creation attempt ${attempt} failed (${e.message.substring(0, 60)}), retrying in 5s...`);
                await page.waitForTimeout(5000);
            }
        }
        const capturedReceiptNumber = rcptResult.ref;
        const rcptId = rcptResult.id;
        console.log(`[OK] Receipt created via API: ${capturedReceiptNumber}`);

        // Phase 3: Approval
        console.log('[STEP] Phase 3: Approval flow');
        // ⚡ Fast API Approval
        await app.advanceDocumentAPI(rcptId,'receipts');
        await page.reload(); // 🔄 Synchronization
        console.log(`[OK] Receipt approved via Fast-API`);
        console.log('[OK] Receipt approved');

        // Phase 4: Customer Profile Verification
        console.log(`[STEP] Phase 4: Verifying ${capturedReceiptNumber} in customer profile`);
        await page.goto('/receivables/customers');

        const searchInput = page.locator('input[placeholder="Search for customers..."]');
        await searchInput.waitFor({ state:'visible', timeout: 10000 });
        await searchInput.fill(CUSTOMER_NAME);
        await page.waitForTimeout(3000);

        // Wait for table to load and find customer row
        const table = page.locator('table').first();
        await table.waitFor({ state:'visible', timeout: 10000 });
        
        // Try multiple selector strategies for robustness
        const customerRow = table.locator('tbody tr').filter({ hasText: CUSTOMER_NAME }).first();
        await customerRow.waitFor({ state:'visible', timeout: 10000 });
        
        // Click the customer link - try different selectors
        const customerLink = customerRow.locator('td a').first();
        if (await customerLink.isVisible({ timeout: 5000 }).catch(() => false)) {
            await customerLink.click({ force: true });
        } else {
            // Fallback: click the row itself
            await customerRow.click({ force: true });
        }
        
        await page.waitForURL(url => url.href.includes('/detail'), { timeout: 10000 });

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
