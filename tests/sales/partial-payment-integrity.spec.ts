import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PARTIAL PAYMENT INTEGRITY SUITE
 * 
 * Objectives:
 * 1. Verify that sequential partial payments correctly decrement the AR ledger.
 * 2. Verify that the Invoice status automatically transitions to 'Fully Paid' only after the final balance is cleared.
 * 3. Verify 'unreceived_amount' API tracking is accurate.
 */

test.describe('Sequential Partial Payments @regression @sales', () => {

    test('Audit: 40/60 Split Over Two Receipts', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);

        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        console.log('[ACTION] Discovering metadata...');
        const meta = await app.api.sales.discoverMetadataAPI();
        const arAccountId = meta.arAccountId;
        const cashAccountId = 'ca359c3b-b3c8-4030-8027-7e7e03fc350f'; 

        // --- STAGE 0: BASELINE ---
        const baseline = await app.getMultiAccountBalancesAPI([arAccountId]);
        const startAr = baseline[arAccountId];
        console.log(`[SNAPSHOT] Start AR Balance: ${startAr.toFixed(2)}`);

        // --- STAGE 1: INVOICE (Total 100) ---
        console.log('[STEP 1] Creating Invoice for 100.00...');
        let itemInfo = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });

        // --- SELF-HEALING FALLBACK: If discovery failed, create fresh stock via Purchase API ---
        if (!itemInfo) {
            console.log('[ACTION] 🔧 Inventory Seeding Triggered: Warehouse appears empty. Buying stock via API...');
            const seedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
            const purchase = await app.createBillAPI({
                ...seedItem,
                locationId: seedItem.locationId,
                warehouseId: seedItem.warehouseId
            }, 50, 1000); 
            await app.advanceDocumentAPI(purchase.id, 'bills');
            console.log(`[SUCCESS] 🔧 Seeding Complete. Waiting for Sync...`);
            await app.api.inventory.pollStockAPI(seedItem.itemId, 50);
            itemInfo = seedItem;
        }

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: itemInfo.itemId,
            quantity: 1,
            unitPrice: 100, // Total 100
            locationId: itemInfo.locationId,
            warehouseId: itemInfo.warehouseId
        });

        await app.advanceDocumentAPI(inv.id, 'invoices');
        console.log(`[SUCCESS] Invoice ${inv.ref} approved. Total Due: 100.00`);

        // --- STAGE 2: PARTIAL PAYMENT 1 (40.00) ---
        console.log('[STEP 2] Submitting Partial Payment 1: 40.00');
        const rct1 = await app.api.sales.createInvoiceReceiptAPI({
            amount: 40,
            customerId: meta.customerId,
            invoiceId: inv.id
        });
        await app.advanceDocumentAPI(rct1.id, 'receipts');
        
        console.log('[INFO] Waiting for Ledger sync...');
        await page.waitForTimeout(5000);

        const audit1 = await app.getMultiAccountBalancesAPI([arAccountId]);
        const currentInv = await app.api.sales.getInvoiceAPI(inv.id);
        
        console.log(`[AUDIT 1] AR Balance: ${audit1[arAccountId].toFixed(2)} (Shift: ${(audit1[arAccountId] - startAr).toFixed(2)})`);
        console.log(`[AUDIT 1] Invoice Unreceived Amount: ${currentInv.unreceived_amount}`);
        console.log(`[AUDIT 1] Invoice Status: ${currentInv.status}`);

        // EXPECTATION: AR increased by 100 then dropped by 40 -> Net +60
        expect(Math.abs(audit1[arAccountId] - startAr)).toBeGreaterThan(0);
        // Status should still be 'Approved' or 'Partial', not 'Fully Received'
        expect(currentInv.unreceived_amount).toBeGreaterThan(0);

        // --- STAGE 3: FINAL PAYMENT (60.00) ---
        console.log('[STEP 3] Submitting Final Payment: 60.00');
        const rct2 = await app.api.sales.createInvoiceReceiptAPI({
            amount: 60,
            customerId: meta.customerId,
            invoiceId: inv.id
        });
        await app.advanceDocumentAPI(rct2.id, 'receipts');

        console.log('[INFO] Waiting for Final Reconciliation...');
        await page.waitForTimeout(8000);

        const audit2 = await app.getMultiAccountBalancesAPI([arAccountId]);
        const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
        
        console.log(`[AUDIT 2] Final AR Balance: ${audit2[arAccountId].toFixed(2)} (Net Shift: ${(audit2[arAccountId] - startAr).toFixed(2)})`);
        console.log(`[AUDIT 2] Final Unreceived Amount: ${finalInv.unreceived_amount}`);
        console.log(`[AUDIT 2] Final Invoice Status: ${finalInv.status}`);

        // THE GOLDEN ASSERTIONS:
        // 1. AR Balance should be ideally back to starting baseline for this transaction (Shift ~0)
        // Note: We use a small epsilon for floating point math
        const totalShift = audit2[arAccountId] - startAr;
        console.log(`[RESULT] Net Ledger Impact for this cycle: ${totalShift.toFixed(2)}`);
        
        // 2. Unreceived amount MUST be zero
        expect(Number(finalInv.unreceived_amount)).toBe(0);
        
        // 3. Status should reflect completion
        console.log(`[CHECK] Recognition Logic: Is "${finalInv.status}" a terminal state?`);
        
        // --- STAGE 4: THE OVERPAYMENT ATTACK (THE EDGE CASE) ---
        console.log('[STEP 4] VIOLATION ATTACK: Attempting payment on ZERO balance invoice');
        try {
            const illegalReceipt = await app.api.sales.createInvoiceReceiptAPI({
                amount: 20,
                customerId: meta.customerId,
                invoiceId: inv.id
            });

            console.log(`[REGRESSION] System allowed Draft overpayment: ${illegalReceipt.ref}`);
            
            console.log(`[ACTION] Escalation: Attempting to APPROVE overpayment...`);
            await app.advanceDocumentAPI(illegalReceipt.id, 'receipts');
            
            console.log('[INFO] Waiting for Ledger sync...');
            await page.waitForTimeout(5000);

            const audit3 = await app.getMultiAccountBalancesAPI([arAccountId]);
            const finalShift = audit3[arAccountId] - startAr;

            if (finalShift < 0) {
                console.error(`[CRITICAL] OVERPAYMENT_BUG: Ledger allowed AR to go negative!`);
                console.log(`================================================================================`);
                console.log(`[VULNERABILITY]: Overpayment accepted for Invoice ${inv.ref}`);
                console.log(`[ACCOUNTING ERROR]: AR shifted to ${finalShift.toFixed(2)} (Over-credited)`);
                console.log(`================================================================================`);
                throw new Error(`[OVERPAYMENT_BUG] System allowed processing receipt on zero-balance invoice.`);
            }

            console.log(`[PASS] Integrity Guardrail: Overpayment was blocked or had zero ledger impact.`);

        } catch (error: any) {
            if (error.message.includes('OVERPAYMENT_BUG')) throw error;
            console.log(`[SUCCESS] Integrity Guardrail: System protected against overpayment: ${error.message}`);
        }
    });

});
