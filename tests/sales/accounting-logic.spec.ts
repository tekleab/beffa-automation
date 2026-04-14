import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Accounting Logic Flow @regression', () => {

    test('Verify duplicate invoice creation allowed, duplicate receipt blocked', async ({ page }) => {
        test.setTimeout(400000);
        const app = new AppManager(page);

        console.log('[STEP] Phase 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let initialInfo: Awaited<ReturnType<typeof app.captureRandomItemDetails>> | null = null;
        while (true) {
            initialInfo = await app.captureRandomItemDetails();
            if (initialInfo.currentStock >= 2 && initialInfo.itemId) break;
        }
        console.log(`[INFO] Item: "${initialInfo.itemName}" | Stock: ${initialInfo.currentStock}`);

        // Fetch random customer via API
        console.log('[STEP] Fetching random customer via API');
        const token = await app._getAuthToken();
        const custRes = await page.request.get(`http://157.180.20.112:8001/api/customers?year=2018&period=yearly&calendar=ec&page=1&pageSize=30`, {
            headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
        });
        const custJson = await custRes.json();
        const randomCustomer = custJson.data[Math.floor(Math.random() * custJson.data.length)];
        const customerUUID = randomCustomer.id;
        console.log(`[INFO] Customer: ${randomCustomer.name || 'Unknown'} (UUID: ${customerUUID})`);

        // Phase 2: Duplicate Invoice Recognition (should be allowed)
        console.log('[STEP] Phase 2: Testing duplicate invoice creation (should succeed)');
        const invPayload = {
            itemId: initialInfo.itemId,
            quantity: 1,
            unitPrice: 1545.50,
            customerId: customerUUID
        };

        const duplicateInvoice1 = await app.createStandaloneInvoiceAPI(invPayload);
        const duplicateInvoice2 = await app.createStandaloneInvoiceAPI(invPayload);

        console.log(`[OK] Two identical invoices created: ${duplicateInvoice1.ref} & ${duplicateInvoice2.ref}`);
        expect(duplicateInvoice1.id).not.toEqual(duplicateInvoice2.id);

        // Approve Invoice 1
        console.log(`[STEP] Approving Invoice 1: ${duplicateInvoice1.ref}`);
        await page.goto(`/receivables/invoices/Detail`);
        await page.waitForSelector('text=Invoice Details', { timeout: 30000, state: 'attached' }).catch(() => { });
        await page.evaluate((id: string) => { window.location.href = `/receivables/invoices/${id}`; }, duplicateInvoice1.id);
        await page.waitForTimeout(5000);
        await app.handleApprovalFlow();
        console.log(`[OK] Invoice ${duplicateInvoice1.ref} approved`);

        // Phase 3: Duplicate Receipt Blocking (should be rejected)
        console.log('[STEP] Phase 3: Testing duplicate receipt blocking');
        const validReceiptAmount = duplicateInvoice1.amountDue;

        const rct1 = await app.createInvoiceReceiptAPI({
            amount: validReceiptAmount,
            customerId: customerUUID,
            invoiceId: duplicateInvoice1.id
        });
        console.log(`[OK] Initial receipt accepted: ${rct1.ref}. Approving via UI...`);

        // Approve Receipt 1 (UI)
        await page.goto(`/receivables/receipts/${rct1.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Receipt 1 Approved.`);

        console.log('[STEP] Negative test: Attempting duplicate receipt on fully-paid invoice');
        let rct2: Awaited<ReturnType<typeof app.createInvoiceReceiptAPI>> | null = null;
        try {
            rct2 = await app.createInvoiceReceiptAPI({
                amount: validReceiptAmount,
                customerId: customerUUID,
                invoiceId: duplicateInvoice1.id
            });

            console.log(`[WARNING] System allowed Draft duplicate: ${rct2.ref}. Attempting illegal UI Approval...`);
            await page.goto(`/receivables/receipts/${rct2.id}/detail`, { waitUntil: 'load' });

            // Attempt illegal approval
            await app.handleApprovalFlow();

            // Check if status became Approved
            const statusBadge = page.locator('span.chakra-badge').filter({ hasText: /Approved/i }).first();
            if (await statusBadge.isVisible({ timeout: 5000 })) {
                console.error(`[FAIL] CRITICAL BUSINESS LOGIC ERROR: Duplicate receipt APPROVED via UI.`);
                throw new Error(`Business Logic Violation: Invoice ${duplicateInvoice1.ref} allowed multiple APPROVED receipts via UI.`);
            } else {
                console.log(`[SUCCESS] UI correctly blocked or prevented approval of duplicate receipt.`);
            }

        } catch (error: any) {
            if (error.message.includes('Business Logic Violation')) throw error;
            console.log(`[OK] System protected against duplicate: ${error.message}`);
        }

        console.log('[RESULT] Accounting Logic: PASSED (Strict Approval Flow)');
        await page.close();
    });
});
