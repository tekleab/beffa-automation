import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe.serial('Payment Lifecycle & Integrity @regression', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS, "sample");
        await page.waitForTimeout(3000);
    });

    /**
     * CONSOLIDATED TEST: SEED -> SETTLE -> DUPLICATE CHECK
     * Goal: Use exactly ONE bill to verify the happy path and immediately test for duplicate protection.
     */
    test('Integrated Payment Cycle & Duplicate Protection', async ({ page }, testInfo) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.switchCompany('sample');

        // --- GL AUDIT: ABSOLUTE BASELINE (Before anything happens) ---
        const meta = await app.api.purchase.discoverMetadataAPI();
        const cashAccountId = "ca359c3b-b3c8-4030-8027-7e7e03fc350f";
        const apAccountId = meta.apAccountId;
        const wtAccountId = meta.withholdingAccountId;

        console.log(`[AUDIT] Stage 0: Capturing Absolute Baseline...`);
        const balancesStart = await app.getMultiAccountBalancesAPI([cashAccountId, apAccountId, wtAccountId]);

        // --- PHASE 1: BILL CREATION ---
        console.log('[STEP 1] Creating Approved Bill via API');
        const item = await app.api.inventory.captureRandomItemDataAPI();
        const vendor = await app.api.purchase.discoverRandomVendorAPI();

        const bill = await app.api.purchase.createBillAPI({
            itemData: item,
            qty: 10,
            unitPrice: 5000,
            vendorId: vendor.id,
            apAccountId: apAccountId, // FORCE THE AP ACCOUNT
            description: `Audit Liability Bill - ${vendor.name}`
        });
        await app.advanceDocumentAPI(bill.id, 'bills');

        console.log(`[DATA] Item Name   : ${item.itemName}`);
        console.log(`[DATA] Item ID     : ${item.itemId}`);
        console.log(`[DATA] Bill Number : ${bill.ref}`);
        console.log(`[DATA] Bill UUID   : ${bill.id}`);
        console.log(`[AUDIT] Bill Line Items (1):`);
        console.log(`  - ${item.itemName} | Qty: 10 | UnitPrice: 5000 | Subtotal: 50000`);

        const billDetails = await app.api.purchase.getBillAPI(bill.id);
        const amountToPay = 50000;

        console.log(`[DATA] Target Amt  : ${amountToPay.toFixed(2)}`);

        // --- GL AUDIT: POST-BILL VERIFICATION ---
        console.log(`[INFO] Waiting 5s for Bill Ledger Posting...`);
        await page.waitForTimeout(5000);

        console.log(`[AUDIT] Stage 0.5: Verifying Bill Posting to AP...`);
        const billJournals = await app.getBillJournalEntriesAPI(bill.id);
        console.log(`[DATA] Bill Journals Found: ${billJournals.length} entries`);

        if (billJournals.length < 2) {
            console.log(`[ALARM] UNBALANCED LEDGER: Bill ${bill.ref} has only ${billJournals.length} journal entries!`);
        }

        billJournals.forEach(ej => {
            console.log(`[JOURNAL] ${ej.accountName} | Code: ${ej.accountCode} | Dr: ${ej.debit} | Cr: ${ej.credit}`);
        });

        const balancesPostBill = await app.getMultiAccountBalancesAPI([cashAccountId, apAccountId, wtAccountId]);
        const billApShift = balancesPostBill[apAccountId] - balancesStart[apAccountId];

        console.log(`[LEDGER_RECONCILIATION] Bill Posting Impact:`);
        console.log(`  - AP Shift (Credit): ${Math.abs(billApShift).toFixed(2)} (Should match 50000)`);

        if (Math.abs(billApShift) < 49000) {
            console.log(`[CRITICAL_LEDGER] Bill failed to hit Accounts Payable! Balance shift: ${billApShift.toFixed(2)}`);
        } else {
            console.log(`[SUCCESS] AP Ledger confirmed. Bill amount is now a liability.`);
        }

        // --- PHASE 2: HAPPY PATH PAYMENT ---
        console.log(`[STEP 2] Settling FULL amount: ${amountToPay}`);
        const firstPayment = await app.api.purchase.createBillPaymentAPI({
            amount: amountToPay,
            billId: bill.id,
            vendorId: billDetails.vendor_id
        });
        await app.advanceDocumentAPI(firstPayment.id, 'payments');

        // Wait for background posting engine
        console.log(`[INFO] Waiting 5s for Ledger Posting...`);
        await page.waitForTimeout(5000);

        // --- GL AUDIT: FIRST PAYMENT VERIFICATION ---
        console.log(`[AUDIT] Stage 1: Verifying Happy Path Ledger Impact...`);
        const balancesStage1 = await app.getMultiAccountBalancesAPI([cashAccountId, apAccountId, wtAccountId]);

        const cashShift = balancesStage1[cashAccountId] - balancesStart[cashAccountId];
        const wtShift = balancesStage1[wtAccountId] - balancesStart[wtAccountId];
        const totalDiscovery = Math.abs(cashShift) + Math.abs(wtShift);

        console.log(`[LEDGER_RECONCILIATION] First Payment Impact:`);
        console.log(`  - Cash Shift       : ${Math.abs(cashShift).toFixed(2)} (98%)`);
        console.log(`  - Withholding Shift: ${Math.abs(wtShift).toFixed(2)} (2%)`);
        console.log(`  - Total Reconciled : ${totalDiscovery.toFixed(2)} (Should match ${amountToPay})`);

        if (totalDiscovery < amountToPay - 1) {
            console.log(`[WARN] Recon Gap: Missing ${(amountToPay - totalDiscovery).toFixed(2)}. Check for extra taxes/fees.`);
        }

        // Audit after first payment
        const auditBill = await app.api.purchase.getBillAPI(bill.id);
        const currentBal = auditBill.balance || auditBill.unpaid_amount || '0';
        console.log(`[AUDIT] After First Payment - Remaining Balance: ${currentBal}`);
        console.log(`[DATA] Payment 1 UUID : ${firstPayment.id}`);
        console.log(`[DATA] Payment 1 Ref  : ${firstPayment.ref}`);

        // --- PHASE 3: DUPLICATE ATTEMPT (SAME BILL) ---
        console.log(`[STEP 3] VIOLATION: Attempting SECOND payment of ${amountToPay} for the SAME bill`);
        let duplicatePaymentID = '';
        try {
            const secondPayment = await app.api.purchase.createBillPaymentAPI({
                amount: amountToPay,
                billId: bill.id,
                vendorId: billDetails.vendor_id
            });
            duplicatePaymentID = secondPayment.id;
            console.log(`[REGRESSION] System allowed duplicate payment creation!`);
            console.log(`[DATA] Payment 2 UUID : ${secondPayment.id}`);
            console.log(`[DATA] Payment 2 Ref  : ${secondPayment.ref}`);
        } catch (error: any) {
            console.log(`[SUCCESS] System correctly blocked duplicate creation. Error: ${error.message}`);
            console.log(`===========================================`);
            console.log(`[RESULT] FINAL STATUS: PROTECTED`);
            console.log(`===========================================`);
            await page.close();
            return;
        }

        // --- PHASE 4: ESCALATION (CAN WE APPROVE THE DUPLICATE?) ---
        if (duplicatePaymentID) {
            console.log(`[STEP 4] ESCALATION: Checking if duplicate payment can be APPROVED`);

            try {
                await app.advanceDocumentAPI(duplicatePaymentID, 'payments');

                // Wait for background posting engine
                console.log(`[INFO] Waiting 5s for Ledger Posting...`);
                await page.waitForTimeout(5000);

                // --- GL AUDIT: DUPLICATE VERIFICATION ---
                console.log(`[AUDIT] Stage 2: Verifying Duplicate Ledger Impact...`);
                const balancesFinal = await app.getMultiAccountBalancesAPI([cashAccountId, apAccountId, wtAccountId]);

                const duplicateCashShift = Math.abs((balancesStage1[cashAccountId] || 0) - (balancesFinal[cashAccountId] || 0));
                const duplicateApShift = Math.abs((balancesStage1[apAccountId] || 0) - (balancesFinal[apAccountId] || 0));
                const duplicateWtShift = Math.abs((balancesStage1[wtAccountId] || 0) - (balancesFinal[wtAccountId] || 0));

                console.log(`[AUDIT] Duplicate Ledger Violation Summary:`);
                console.log(`  - Cash Shift (Duplicate): ${duplicateCashShift.toFixed(2)}`);
                console.log(`  - AP Shift   (Duplicate): ${duplicateApShift.toFixed(2)}`);
                console.log(`  - WT Shift   (Duplicate): ${duplicateWtShift.toFixed(2)}`);

                if (duplicateCashShift > 0 || duplicateApShift > 0 || duplicateWtShift > 0) {
                    console.error(`[CRITICAL] FINANCIAL_INTEGRITY_COMPROMISED: Duplicate payment affected GL balances!`);
                }
                console.log(`================================================================================`);
                console.log(`[VULNERABILITY DETECTED]: Double-Disbursement Approved for Bill ${bill.ref}`);
                console.log(`[FINANCIAL IMPACT]: Ledger Compromised - AP Shift: ${duplicateApShift.toFixed(2)} | Cash Shift: ${duplicateCashShift.toFixed(2)}`);
                console.log(`================================================================================`);

                // LOGIC COLLAPSE
                throw new Error(`[CRITICAL_LOGIC_BUG] Integrity Collapse: Duplicate Payment for ${bill.ref} was CREATED, APPROVED, and POSTED.`);
            } catch (error: any) {
                if (error.message.includes('[API BLOCK]')) {
                    console.log(`[PASS] Integrity Guardrail: Creation Bug exists, but Approval was BLOCKED.`);
                    console.log(`[INFO] Block Reason: ${error.message}`);
                    console.log(`===========================================`);
                    console.log(`[RESULT] FINAL STATUS: SEMI-PROTECTED`);
                    console.log(`===========================================`);
                    return;
                }
                throw error;
            }
        }
        await page.close();
    });
});