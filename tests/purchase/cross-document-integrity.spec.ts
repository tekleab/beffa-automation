import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * CROSS-DOCUMENT INTEGRITY SUITE
 * 
 * Objective: Verify if reversing a parent correctly handles child documents.
 * 1. Purchase: Voiding a PAID Bill (Confirmed BLOCKED).
 * 2. Sales: Voiding a PAID Invoice (Testing for Vulnerability).
 */

test.describe('Cross-Document Integrity @regression', () => {

    test('Purchase Check: Guardrail for PAID Bill', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = await app.api.purchase.discoverMetadataAPI();

        console.log('[STEP 1] Setup: Paid Bill');
        const itemInfo = await app.api.inventory.captureRandomItemDataAPI({ minStock: 2 });
        const bill = await app.api.purchase.createBillAPI({
            vendorId: meta.vendorId,
            itemId: itemInfo.itemId,
            quantity: 1,
            unitPrice: 500,
            apAccountId: meta.apAccountId
        });
        await app.advanceDocumentAPI(bill.id, 'bills');
        
        const pay = await app.api.purchase.createBillPaymentAPI({
            amount: 500,
            vendorId: meta.vendorId,
            billId: bill.id
        });
        await app.advanceDocumentAPI(pay.id, 'payments');

        console.log('[STEP 2] REVERSAL ATTACK: Voiding a Paid Bill');
        const voidSuccess = await app.api.purchase.reverseBillAPI(bill.id);
        
        expect(voidSuccess).toBe(false);
        console.log(`[PASSED] Purchase Guardrail: System correctly blocked reversal of a paid bill.`);
    });

    test('Sales Check: Vulnerability for PAID Invoice', async ({ page }) => {
        test.setTimeout(240000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = await app.api.sales.discoverMetadataAPI();

        console.log('[STEP 1] Setup: Paid Invoice');
        const itemInfo = await app.api.inventory.captureRandomItemDataAPI({ minStock: 2 });
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: itemInfo.itemId,
            quantity: 1,
            unitPrice: 3000,
            locationId: meta.locationId,
            warehouseId: meta.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            amount: 3000,
            customerId: meta.customerId,
            invoiceId: inv.id
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');
        console.log(`[SUCCESS] Invoice ${inv.ref} is fully PAID.`);

        console.log('[STEP 2] REVERSAL ATTACK: Voiding a Paid Invoice');
        const voidSuccess = await app.api.sales.reverseInvoiceAPI(inv.id);

        if (voidSuccess) {
            console.error(`[CRITICAL VULNERABILITY]: ORPHANED RECEIPT DETECTED!`);
            console.log(`================================================================================`);
            console.log(`[INVOICE]: ${inv.ref} was VOIDED successfully.`);
            console.log(`[RECEIPT]: The money was already received, but the invoice no longer exists!`);
            console.log(`[IMPACT]: Financial Fraud Risk - System allows deleting sales after receiving cash.`);
            console.log(`================================================================================`);
            throw new Error(`[ORPHAN_RECEIPT_BUG] System allowed voiding a paid invoice.`);
        }

        console.log(`[PASSED] Sales Guardrail: System blocked reversal of a paid invoice.`);
    });

});
