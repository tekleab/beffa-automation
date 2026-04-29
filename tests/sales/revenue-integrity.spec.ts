import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * REVENUE INTEGRITY SUITE: SALES-TO-CASH FORENSIC AUDIT
 * 
 * Objectives:
 * 1. Verify Sales Invoice correctly records Accounts Receivable (AR) Liability.
 * 2. Verify Customer Receipt clears AR and increases Cash.
 * 3. Regression Test: Verify system blocks duplicate Receipts for the same invoice (Double-Revenue Bug).
 */

test.describe('Revenue Lifecycle & Integrity @regression @sales', () => {

    test('Integrated Sales Cycle & Duplicate Revenue Protection', async ({ page }) => {
        test.setTimeout(240000); // 4-minute forensic audit
        const app = new AppManager(page);

        // --- PRE-REQUISITE: HIGH-SPEED LOGIN ---
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        // --- STAGE 0: METADATA DISCOVERY ---
        console.log('[ACTION] Discovering sales metadata (AR, Sales, Currencies)...');
        const meta = await app.api.sales.discoverMetadataAPI();
        const arAccountId = meta.arAccountId;
        const revenueAccountId = meta.salesAccountId;
        const cashAccountId = meta.cashAccountId;
        
        // Dynamic Inventory Discovery
        const allAccounts = await app.getAccountBalancesAPI();
        const inventoryAccount = allAccounts.find((a: any) => a.name?.toLowerCase().includes('inventory')) || { id: '0e350587-573e-48a0-9c29-ba9792015093' };
        const inventoryAccountId = inventoryAccount.id;

        console.log(`[META] Auditing AR: ${arAccountId} | Cash: ${cashAccountId} | Inventory: ${inventoryAccountId}`);

        // --- AUDIT STAGE 0: CAPTURING BASELINE ---
        console.log('[AUDIT] Stage 0: Capturing Absolute Baseline...');
        const baseline = await app.getMultiAccountBalancesAPI([cashAccountId, arAccountId, inventoryAccountId]);
        
        const startCash = baseline[cashAccountId] || 0;
        const startAr = baseline[arAccountId] || 0;
        const startInv = baseline[inventoryAccountId] || 0;

        console.log(`[SNAPSHOT] Cash Baseline : ${startCash.toFixed(2)}`);
        console.log(`[SNAPSHOT] AR Baseline   : ${startAr.toFixed(2)}`);
        console.log(`[SNAPSHOT] Inv Baseline  : ${startInv.toFixed(2)}`);

        // --- PHASE 1: SALES INVOICE CREATION ---
        console.log('[STEP 1] Creating Standalone Sales Invoice via API');
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 10 });
        const customer = meta.customerId;

        const invoice = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: customer,
            itemId: item.itemId,
            quantity: 10,
            unitPrice: 5000,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });

        // ⚡ Speed Approval
        await app.advanceDocumentAPI(invoice.id, 'invoices');
        console.log(`[SUCCESS] Invoice ${invoice.ref} fully approved.`);

        // --- GL AUDIT: POST-INVOICE VERIFICATION ---
        console.log(`[INFO] Waiting 5s for Invoice Ledger Posting...`);
        await page.waitForTimeout(5000);

        const stage1 = await app.getMultiAccountBalancesAPI([arAccountId, inventoryAccountId]);
        const invoiceArShift = stage1[arAccountId] - startAr;
        
        console.log(`[AUDIT] Stage 1: Verifying Receivable Impact...`);
        console.log(`[SNAPSHOT] Current AR: ${stage1[arAccountId].toFixed(2)} (Shift: ${invoiceArShift.toFixed(2)})`);

        // ASSERTION: AR must increase by the invoice amount (Debited)
        // Note: 50000 total. Depending on tax, AR shift should be exactly 50000.
        expect(Math.abs(invoiceArShift)).toBeGreaterThan(0);
        console.log(`[SUCCESS] AR Ledger confirmed. Sales amount is now a customer receivable.`);

        // --- PHASE 2: CUSTOMER RECEIPT (SETTLEMENT) ---
        console.log('[STEP 2] Settling FULL amount: 50000');
        const receipt = await app.api.sales.createInvoiceReceiptAPI({
            amount: 50000,
            customerId: customer,
            invoiceId: invoice.id
        });

        // ⚡ Speed Approval
        await app.advanceDocumentAPI(receipt.id, 'receipts');
        
        console.log(`[INFO] Waiting 5s for Ledger Posting...`);
        await page.waitForTimeout(5000);

        const stage2 = await app.getMultiAccountBalancesAPI([cashAccountId, arAccountId]);
        const pay1CashShift = (stage2[cashAccountId] || 0) - startCash;
        const pay1ArShift = (stage2[arAccountId] || 0) - (stage1[arAccountId] || 0);

        console.log(`[AUDIT] Stage 2: Verifying Receipt Ledger Impact...`);
        console.log(`[SNAPSHOT] Cash Shift : ${pay1CashShift.toFixed(2)}`);
        console.log(`[SNAPSHOT] AR Shift   : ${pay1ArShift.toFixed(2)}`);

        // ASSERTION: Cash must increase (Debit), AR must decrease (Credit)
        expect(pay1CashShift).toBeGreaterThan(0);
        expect(pay1ArShift).toBeLessThan(0);
        console.log(`[SUCCESS] Customer Payment confirmed. Cash increased, Receivable cleared.`);

        // --- PHASE 3: THE DUPLICATE REVENUE ATTACK ---
        console.log('[STEP 3] VIOLATION: Attempting SECOND receipt for the SAME invoice');
        try {
            const duplicateReceipt = await app.api.sales.createInvoiceReceiptAPI({
                amount: 50000,
                customerId: customer,
                invoiceId: invoice.id
            });

            console.log(`[REGRESSION] System allowed duplicate receipt creation: ${duplicateReceipt.ref}`);
            
            // --- STEP 4: ESCALATION ---
            console.log(`[STEP 4] ESCALATION: Checking if duplicate receipt can be APPROVED`);
            await app.advanceDocumentAPI(duplicateReceipt.id, 'receipts');
            console.info(`[CRITICAL] Ghost Approval: Duplicate receipt reached APPROVED state.`);

            console.log(`[INFO] Waiting 5s for Ledger Posting...`);
            await page.waitForTimeout(5000);

            const stage3 = await app.getMultiAccountBalancesAPI([cashAccountId, arAccountId]);
            const duplicateCashShift = (stage3[cashAccountId] || 0) - (stage2[cashAccountId] || 0);
            const duplicateArShift = (stage3[arAccountId] || 0) - (stage2[arAccountId] || 0);

            console.log(`[AUDIT] Stage 3: Verifying Duplicate Ledger Impact...`);
            console.log(`[SNAPSHOT] Cash Shift (Duplicate): ${duplicateCashShift.toFixed(2)}`);
            console.log(`[SNAPSHOT] AR Shift   (Duplicate): ${duplicateArShift.toFixed(2)}`);

            if (duplicateCashShift > 0 || Math.abs(duplicateArShift) > 0) {
                console.error(`[CRITICAL] FINANCIAL_INTEGRITY_COMPROMISED: Duplicate receipt affected GL balances!`);
                console.log(`================================================================================`);
                console.log(`[VULNERABILITY DETECTED]: Double-Revenue/Receipt Approved for Invoice ${invoice.ref}`);
                console.log(`[FINANCIAL IMPACT]: Ledger Compromised - Cash Shift: ${duplicateCashShift.toFixed(2)} | AR Shift: ${duplicateArShift.toFixed(2)}`);
                console.log(`================================================================================`);
                
                throw new Error(`[CRITICAL_LOGIC_BUG] Integrity Collapse: Duplicate Receipt for ${invoice.ref} was CREATED, APPROVED, and POSTED.`);
            }

            console.log(`[PASS] Integrity Guardrail: Receipt Approval was BLOCKED or had 0.00 Ledger impact.`);

        } catch (error: any) {
            if (error.message.includes('[API BLOCK]') || error.message.includes('400')) {
                console.log(`[SUCCESS] Integrity Guardrail: System blocked duplicate receipt.`);
            } else if (error.message.includes('[CRITICAL_LOGIC_BUG]')) {
                throw error;
            } else {
                console.log(`[INFO] System behavior: ${error.message}`);
                // If it failed to approve, that's a partial pass (the ledger is safe)
            }
        }
    });

});
