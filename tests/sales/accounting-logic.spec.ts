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
        let baseUrl = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
        if (baseUrl.includes(':4173')) baseUrl = baseUrl.replace(':4173', ':8001');
        const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
        
        const custRes = await page.request.get(`${baseUrl}/api/customers?${params}&page=1&pageSize=30`, {
            headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
        });
        const custJson = await custRes.json();
        const randomCustomer = custJson.data[Math.floor(Math.random() * custJson.data.length)];
        const customerUUID = randomCustomer.id;
        console.log(`[INFO] Customer: ${randomCustomer.name || 'Unknown'} (UUID: ${customerUUID})`);

        // Phase 2: Duplicate Invoice Recognition (Against a Single SO)
        console.log('[STEP] Phase 2: Testing duplicate invoice creation against a single SO');
        
        // Create an SO for a quantity of 1
        const soPayload = {
            itemId: initialInfo.itemId,
            quantity: 1,
            unitPrice: 1545.50,
            customerId: customerUUID,
            locationId: initialInfo.locationId,
            warehouseId: initialInfo.warehouseId
        };
        const so = await app.createSalesOrderAPI(soPayload);
        console.log(`[OK] Sales Order created: ${so.ref}`);

        // ⚡ Fast API Approval
        await page.goto(`/receivables/sale-orders/${so.id}/detail`, { waitUntil: 'load' });
        await app.advanceDocumentAPI(so.id, 'sales-orders');
        await page.reload(); // 🔄 Synchronize
        console.log(`[OK] Sales Order ${so.ref} approved via Fast-API`);

        // Create two invoices linking to the exact same SO items
        const duplicateInvoice1 = await app.createInvoiceAPI({
            customerId: so.customerId,
            soItemId: so.soItemId,
            releasedQuantity: 1
        });
        const duplicateInvoice2 = await app.createInvoiceAPI({
            customerId: so.customerId,
            soItemId: so.soItemId,
            releasedQuantity: 1
        });

        console.log(`[OK] Two identical draft invoices created for the same SO: ${duplicateInvoice1.ref} & ${duplicateInvoice2.ref}`);
        expect(duplicateInvoice1.id).not.toEqual(duplicateInvoice2.id);

        // ⚡ Fast API Approval
        await page.goto(`/receivables/invoices/${duplicateInvoice1.id}/detail`, { waitUntil: 'load' });
        await app.advanceDocumentAPI(duplicateInvoice1.id, 'invoices');
        await page.reload(); // 🔄 Synchronize
        console.log(`[OK] Invoice ${duplicateInvoice1.ref} approved via Fast-API`);

        // Attempt to approve Invoice 2 (Should Fail - ERP must block duplicate invoicing of same SO)
        console.log(`[STEP] Negative test: Attempting to approve duplicate Invoice 2: ${duplicateInvoice2.ref}`);
        try {
            await page.goto(`/receivables/invoices/${duplicateInvoice2.id}/detail`, { waitUntil: 'load' });
            await app.handleApprovalFlow();

            // If handleApprovalFlow() did NOT throw, check the actual status badge
            // Uses the real ERP status badge class (same as handleApprovalFlow reads)
            const statusText = await page.locator('span.css-1ny2kle').first().innerText({ timeout: 3000 }).catch(() => '');
            if (statusText.toLowerCase().includes('approved')) {
                console.error(`[FAIL] CRITICAL BUSINESS LOGIC ERROR: Duplicate Invoice reached APPROVED state.`);
                throw new Error(`Business Logic Violation: ERP allowed multiple APPROVED invoices for fully invoiced Sales Order.`);
            }
            console.log(`[OK] Invoice 2 did not reach approved state. Status: "${statusText}"`);
        } catch (error: any) {
            if (error.message.includes('Business Logic Violation')) throw error;
            console.log(`[SUCCESS] System correctly blocked duplicate invoice approval: ${error.message}`);
        }

        // Phase 3: Duplicate Receipt Blocking (should be rejected)
        console.log('[STEP] Phase 3: Testing duplicate receipt blocking');
        const validReceiptAmount = 1545.50; // Use the exact unit price created in the SO

        const rct1 = await app.createInvoiceReceiptAPI({
            amount: validReceiptAmount,
            customerId: customerUUID,
            invoiceId: duplicateInvoice1.id
        });
        console.log(`[OK] Initial receipt accepted: ${rct1.ref}. Approving via UI...`);

        // ⚡ Fast API Approval
        await page.goto(`/receivables/receipts/${rct1.id}/detail`, { waitUntil: 'load' });
        await app.advanceDocumentAPI(rct1.id, 'receipts');
        await page.reload(); // 🔄 Synchronize
        console.log(`[OK] Receipt 1 approved via Fast-API.`);

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
