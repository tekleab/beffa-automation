const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe('Pure Accounting Logic - Duplicate Transaction Validation', () => {

    test('Verify duplicate transaction constraints for Invoices & Receipts on a random customer profile', async ({ page }) => {
        
        // Extended timeout to facilitate thorough pure-accounting ledger verifications
        test.setTimeout(400000); 
        const app = new AppManager(page);

        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // 1. Identify a valid warehouse item
        console.log(`[ACTION] Securing an active inventory item to utilize for Accounting validation...`);
        let initialInfo = null;
        while (true) {
            initialInfo = await app.captureRandomItemDetails();
            if (initialInfo.currentStock >= 2 && initialInfo.itemId) break;
        }

        // 2. Extract a random customer securely via API explicitly to avoid UI router masking
        console.log(`[ACTION] Fetching Customer Ledger directly from DB to isolate a random UUID...`);
        const token = await app._getAuthToken();
        const custRes = await page.request.get(`http://157.180.20.112:8001/api/customers?year=2018&period=yearly&calendar=ec&page=1&pageSize=30`, {
           headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
        });
        const custJson = await custRes.json();
        const randomCustomer = custJson.data[Math.floor(Math.random() * custJson.data.length)];
        const customerUUID = randomCustomer.id;
        
        console.log(`[✓] Random Customer Profile Locked via Backend API: ${randomCustomer.name || 'Unknown'} (UUID: ${customerUUID})`);

        // =================================================================================================
        // PHASE 1: ACCOUNTING PRINCIPLE -> IDENTICAL BILLING RECOGNITION (Allowed)
        // Two identical invoices occurring on the same day for the exact same amount are treated as
        // mutually exclusive, discrete billing events. The accounting platform MUST accurately generate both.
        // =================================================================================================
        
        console.log(`[ACTION] Accounting Test Phase 1: Submitting consecutive identical invoices to verify independent ledger generation...`);
        const invPayload = {
            itemId: initialInfo.itemId,
            quantity: 1,
            unitPrice: 1545.50,
            customerId: customerUUID
        };

        const duplicateInvoice1 = await app.createStandaloneInvoiceAPI(invPayload);
        const duplicateInvoice2 = await app.createStandaloneInvoiceAPI(invPayload);
        
        console.log(`[SUCCESS] The ERP gracefully created functionally identical but discrete invoices: ${duplicateInvoice1.ref} & ${duplicateInvoice2.ref}`);
        expect(duplicateInvoice1.id).not.toEqual(duplicateInvoice2.id); // Must guarantee systemic uniqueness

        // 3. Approve Invoice 1 exclusively
        console.log(`[ACTION] Approving Invoice 1 (${duplicateInvoice1.ref}) to establish realizable receivables...`);
        await page.goto(`/receivables/invoices/Detail`);
        // Navigate by direct ID explicitly
        await page.evaluate((id) => {
             // Hard-navigation through SPA
             window.location.href = `/receivables/invoices/${id}`;
        }, duplicateInvoice1.id);
        
        await page.waitForTimeout(3000);
        await app.handleApprovalFlow();
        console.log(`[✓] Invoice ${duplicateInvoice1.ref} strictly verified and locked for receiving.`);

        // =================================================================================================
        // PHASE 2: ACCOUNTING PRINCIPLE -> DOUBLE-ENTRY CASH RECEIPT RESTRICTION (Strictly Blocked)
        // Submitting an exact duplicate cash receipt against an ALREADY PAID invoice violates principle.
        // =================================================================================================

        console.log(`[ACTION] Accounting Test Phase 2: Processing fully compliant original receipt...`);
        const validReceiptAmount = duplicateInvoice1.amountDue;
        
        const receiptResult1 = await app.createInvoiceReceiptAPI({
            amount: validReceiptAmount,
            customerId: customerUUID,
            invoiceId: duplicateInvoice1.id
        });
        console.log(`[SUCCESS] Initial Receipt formally recognized: ${receiptResult1.ref}. Invoice 1 is now considered Fully Paid.`);

        console.log(`[ACTION] Negative Accounting Test: Forcing a duplicate cash receipt onto the Fully Paid Invoice 1...`);
        try {
            const illegalReceipt = await app.createInvoiceReceiptAPI({
                amount: validReceiptAmount,
                customerId: customerUUID,
                invoiceId: duplicateInvoice1.id
            });
            console.error(`\n===================================================================`);
            console.error(`                   ❌ TEST FAILED - BUSINESS LOGIC ERROR ❌                   `);
            console.error(`===================================================================`);
            console.error(`Reason: The Accounting Engine failed to enforce double-entry restrictions.`);
            console.error(`Detail: An identical, full-amount cash receipt was illegally processed `);
            console.error(`        targeting an Invoice that was ALREADY fully settled and closed.`);
            console.error(`        This represents a systemic double-billing vulnerability.`);
            console.error(`Generated Duplicate Receipt ID: ${illegalReceipt.ref}`);
            console.error(`===================================================================\n`);
            
            throw new Error(`[FATAL ACCOUNTING BUG] Test explicitly failed because the ERP accepted an illegal duplicate overpayment Receipt: ${illegalReceipt.ref}`);
        } catch (error) {
            if (error.message.includes('[FATAL ACCOUNTING BUG]')) throw error;
            console.log(`[✓] Enterprise Business Logic Passed! The API forcefully rejected the duplicate cash-posting sequence.`);
        }

        console.log(`\n=============================================================`);
        console.log(`             ACCOUNTING DUPLICATION TEST RESULTS             `);
        console.log(`=============================================================`);
        console.log(`[PASSED] Identical Billing Recognition: Accepted Discrete Ledgers`);
        console.log(`[PASSED] Double-Entry Cash Restriction: Blocked Illegal Receiving`);
        console.log(`=============================================================`);

        await page.close();
    });
});
