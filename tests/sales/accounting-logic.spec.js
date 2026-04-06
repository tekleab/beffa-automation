const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Accounting Logic — Duplicate Transaction Validation', () => {

    test('Verify duplicate invoice creation allowed, duplicate receipt blocked', async ({ page }) => {
        test.setTimeout(400000);
        const app = new AppManager(page);

        console.log('[STEP] Phase 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        let initialInfo = null;
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
        await page.evaluate((id) => { window.location.href = `/receivables/invoices/${id}`; }, duplicateInvoice1.id);
        await page.waitForTimeout(3000);
        await app.handleApprovalFlow();
        console.log(`[OK] Invoice ${duplicateInvoice1.ref} approved`);

        // Phase 3: Duplicate Receipt Blocking (should be rejected)
        console.log('[STEP] Phase 3: Testing duplicate receipt blocking');
        const validReceiptAmount = duplicateInvoice1.amountDue;

        const receiptResult1 = await app.createInvoiceReceiptAPI({
            amount: validReceiptAmount,
            customerId: customerUUID,
            invoiceId: duplicateInvoice1.id
        });
        console.log(`[OK] Initial receipt accepted: ${receiptResult1.ref}`);

        console.log('[STEP] Negative test: forcing duplicate receipt on fully-paid invoice');
        try {
            const illegalReceipt = await app.createInvoiceReceiptAPI({
                amount: validReceiptAmount,
                customerId: customerUUID,
                invoiceId: duplicateInvoice1.id
            });
            console.log(`[FAIL] BUSINESS LOGIC ERROR: Duplicate receipt was illegally accepted: ${illegalReceipt.ref}`);
            throw new Error(`Duplicate overpayment receipt accepted: ${illegalReceipt.ref}`);
        } catch (error) {
            if (error.message.includes('Duplicate overpayment')) throw error;
            console.log('[OK] API correctly rejected duplicate receipt');
        }

        console.log('[RESULT] Accounting Logic: PASSED');
        console.log('[VERIFY] Duplicate billing recognition: Accepted');
        console.log('[VERIFY] Double-entry cash restriction: Blocked');

        await page.close();
    });
});
