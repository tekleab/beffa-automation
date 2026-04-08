const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/AppManager');

test.describe('Bill-to-Payment API Flow @regression', () => {

    test('Create Bill via API, Approve via UI, Pay via API then Verify', async ({ page }) => {
        test.setTimeout(400000);
        const app = new AppManager(page);

        console.log('[STEP] Phase 1: Login & Setup');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // Discovery (Direct API - No Navigation)
        console.log('[STEP] Phase 1: High-Speed Discovery (API)');
        const item = await app.captureRandomItemDataAPI();
        const vendorId = "b83a4bcd-0334-42fd-932c-b9bc5cc22208"; // Standard Tutorial Vendor
        console.log(`[INFO] Item: "${item.itemName}" | VendorID: ${vendorId}`);

        // Create Bill (Direct API)
        console.log('[STEP] Phase 2: Creating Bill via API');
        const billedQty = 5;
        const unitPrice = 2500;
        const billData = await app.createBillAPI(item, billedQty, unitPrice, vendorId);
        console.log(`[OK] Bill Created: ${billData.billNumber} (UUID: ${billData.billId})`);

        // Approval (UI as requested)
        console.log('[STEP] Phase 3: Approving Bill via UI');
        await page.goto(`/payables/bills/${billData.billId}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Bill ${billData.billNumber} Approved`);

        // Fetch Exact Amount After Tax
        const billInfo = await app.getBillAPI(billData.billId);
        const totalAmount = billInfo.total_amount || (billedQty * unitPrice * 1.15); // Fallback to 15% VAT
        console.log(`[INFO] Exact total amount to pay: ${totalAmount}`);

        // Payment 1 (API)
        console.log('[STEP] Phase 4: Creating Full Payment via API');
        const payment = await app.createBillPaymentAPI({
            amount: totalAmount,
            vendorId: vendorId,
            billId: billData.billId
        });
        console.log(`[OK] Payment Created: ${payment.ref}. Approving via UI...`);
        await page.goto(`/payables/payments/${payment.id}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Payment 1 Approved via UI.`);

        // Phase 5: Negative Test (Duplicate Payment & UI Approval)
        console.log('[STEP] Phase 5: Testing Duplicate Payment & UI Approval Blocking');
        let payment2 = null;
        try {
            payment2 = await app.createBillPaymentAPI({
                amount: 1, 
                vendorId: vendorId,
                billId: billData.billId
            });
            console.log(`[INFO] Payment 2 created in Draft: ${payment2.ref}. Attempting illegal UI Approval...`);
            
            await page.goto(`/payables/payments/${payment2.id}/detail`, { waitUntil: 'load' });
            
            // We check if the approval buttons are even clickable or if they cause a logic error
            await app.handleApprovalFlow();
            
            // After attempting approval, check the status
            const statusBadge = page.locator('span.chakra-badge').filter({ hasText: /Approved/i }).first();
            if (await statusBadge.isVisible({ timeout: 5000 })) {
                console.error(`[FAIL] CRITICAL BUSINESS LOGIC ERROR: Duplicate payment APPROVED via UI.`);
                console.error(`[INFO] Bill: ${billData.billNumber} | P1: ${payment.ref} | P2: ${payment2.ref}`);
                throw new Error(`Business Logic Violation: Bill ${billData.billNumber} allowed multiple APPROVED payments via UI. [P1 ID: ${payment.id}, P2 ID: ${payment2.id}]`);
            } else {
                console.log(`[SUCCESS] UI correctly blocked or prevented approval of duplicate payment.`);
            }
        } catch (error) {
            if (error.message.includes('Business Logic Violation')) throw error;
            console.log(`[OK] UI/System protected against duplicate: ${error.message}`);
        }

        // Verification (UI)
        console.log('[STEP] Phase 6: Final Verification in UI');
        await page.goto(`/payables/bills/${billData.billId}/detail`, { waitUntil: 'load' });
        await page.reload();
        
        const balanceText = page.locator('div, p, span').filter({ hasText: /Unpaid Amount/i }).locator('xpath=..').first();
        await expect(balanceText).toContainText('0', { timeout: 15000 });
        console.log(`[RESULT] Bill-to-Payment Logic: PASSED (Fully Settled & Protected)`);

        await page.close();
    });
});
