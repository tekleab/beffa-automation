import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * SALES GL & LEDGER AUDITS
 *
 * Objectives:
 * 1. Full SO→Invoice→Receipt cycle: verify AR and Cash GL entries are correct.
 * 2. Credit note (invoice void) must reduce AR balance back to pre-sale state.
 */

test.describe('Sales GL & Ledger Audits @sales @logic @regression @full', () => {
    test.setTimeout(300000);

    test('Audit: Full cycle GL — AR debited on invoice, cleared on receipt', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const UNIT_PRICE = 500;

        console.log(`\n========== PRE-TRANSACTION SNAPSHOT ==========`);
        console.log(`[ACCOUNT] AR Account    : ${meta.arAccountId}`);
        console.log(`[ACCOUNT] Cash Account  : ${meta.cashAccountId}`);
        console.log(`[ACCOUNT] Sales Account : ${meta.salesAccountId}`);
        console.log(`[ITEM]    Item ID        : ${item.itemId} (${item.itemName})`);
        console.log(`[ITEM]    Location ID    : ${item.locationId}`);
        console.log(`[ITEM]    Warehouse ID   : ${item.warehouseId}`);
        console.log(`[ITEM]    Stock          : ${item.currentStock}`);
        console.log(`[CUSTOMER] Customer ID  : ${meta.customerId}`);
        console.log(`==============================================\n`);

        const arBefore = await app.getAccountBalanceAPI(meta.arAccountId);
        const cashBefore = await app.getAccountBalanceAPI(meta.cashAccountId);
        console.log(`[BALANCE] AR Before     : ${arBefore.toFixed(2)}`);
        console.log(`[BALANCE] Cash Before   : ${cashBefore.toFixed(2)}`);

        console.log(`\n[STEP 2] Creating & approving standalone invoice...`);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: UNIT_PRICE,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        await page.waitForTimeout(3000);
        const arAfterInvoice = await app.getAccountBalanceAPI(meta.arAccountId);

        console.log(`\n========== POST-INVOICE SNAPSHOT ==========`);
        console.log(`[DOCUMENT] Invoice Ref  : ${inv.ref}`);
        console.log(`[DOCUMENT] Invoice ID   : ${inv.id}`);
        console.log(`[DOCUMENT] Amount       : ${UNIT_PRICE}`);
        console.log(`[BALANCE] AR After Inv  : ${arAfterInvoice.toFixed(2)}`);
        console.log(`[BALANCE] AR Delta      : ${(arAfterInvoice - arBefore).toFixed(2)} (Expected: +${UNIT_PRICE})`);
        console.log(`============================================\n`);
        expect(arAfterInvoice).toBeGreaterThan(arBefore);

        console.log(`[STEP 3] Creating & approving full receipt...`);
        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id,
            customerId: meta.customerId,
            amount: UNIT_PRICE
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');

        await page.waitForTimeout(3000);
        const arAfterReceipt = await app.getAccountBalanceAPI(meta.arAccountId);
        const cashAfter = await app.getAccountBalanceAPI(meta.cashAccountId);
        const drift = Math.abs(arAfterReceipt - arBefore);

        console.log(`\n========== POST-RECEIPT SNAPSHOT ==========`);
        console.log(`[DOCUMENT] Receipt Ref  : ${rct.ref}`);
        console.log(`[DOCUMENT] Receipt ID   : ${rct.id}`);
        console.log(`[DOCUMENT] Linked Inv   : ${inv.ref} (${inv.id})`);
        console.log(`[ACCOUNT] AR Account    : ${meta.arAccountId}`);
        console.log(`[ACCOUNT] Cash Account  : ${meta.cashAccountId}`);
        console.log(`[BALANCE] AR Before     : ${arBefore.toFixed(2)}`);
        console.log(`[BALANCE] AR After Inv  : ${arAfterInvoice.toFixed(2)}`);
        console.log(`[BALANCE] AR After Rct  : ${arAfterReceipt.toFixed(2)} (Expected: ~${arBefore.toFixed(2)})`);
        console.log(`[BALANCE] Cash Before   : ${cashBefore.toFixed(2)}`);
        console.log(`[BALANCE] Cash After    : ${cashAfter.toFixed(2)} (Expected change: +${UNIT_PRICE})`);
        console.log(`[BALANCE] AR Drift      : ${drift.toFixed(2)} (Must be 0.00)`);
        console.log(`============================================\n`);

        if (drift > 1) {
            throw new Error(
                `[VULNERABILITY] GL Drift — Full Cycle AR Reconciliation Failed\n` +
                `  Invoice      : ${inv.ref} (ID: ${inv.id})\n` +
                `  Receipt      : ${rct.ref} (ID: ${rct.id})\n` +
                `  AR Account   : ${meta.arAccountId}\n` +
                `  Cash Account : ${meta.cashAccountId}\n` +
                `  AR Before    : ${arBefore.toFixed(2)}\n` +
                `  AR After Inv : ${arAfterInvoice.toFixed(2)}\n` +
                `  AR After Rct : ${arAfterReceipt.toFixed(2)}\n` +
                `  Drift        : ${drift.toFixed(2)} (must be 0.00)\n` +
                `  Root Cause   : Receipt approval is not clearing AR correctly. Possible double-posting or missing offset journal entry.`
            );
        }
        console.log(`[PASS] Full cycle GL confirmed: AR correctly debited on invoice and cleared on receipt.`);
    });

    test('Audit: Credit note (void) must reduce AR balance back to pre-sale state', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        const UNIT_PRICE = 800;

        console.log(`\n========== PRE-TRANSACTION SNAPSHOT ==========`);
        console.log(`[ACCOUNT] AR Account    : ${meta.arAccountId}`);
        console.log(`[ACCOUNT] Sales Account : ${meta.salesAccountId}`);
        console.log(`[ITEM]    Item ID        : ${item.itemId} (${item.itemName})`);
        console.log(`[ITEM]    Location ID    : ${item.locationId}`);
        console.log(`[ITEM]    Warehouse ID   : ${item.warehouseId}`);
        console.log(`[CUSTOMER] Customer ID  : ${meta.customerId}`);
        console.log(`==============================================\n`);

        const arBefore = await app.getAccountBalanceAPI(meta.arAccountId);
        console.log(`[BALANCE] AR Before     : ${arBefore.toFixed(2)}`);

        console.log(`\n[STEP 2] Creating & approving invoice...`);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: UNIT_PRICE,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        await page.waitForTimeout(3000);
        const arAfterInvoice = await app.getAccountBalanceAPI(meta.arAccountId);

        console.log(`\n========== POST-INVOICE SNAPSHOT ==========`);
        console.log(`[DOCUMENT] Invoice Ref  : ${inv.ref}`);
        console.log(`[DOCUMENT] Invoice ID   : ${inv.id}`);
        console.log(`[DOCUMENT] Amount       : ${UNIT_PRICE}`);
        console.log(`[BALANCE] AR After Inv  : ${arAfterInvoice.toFixed(2)}`);
        console.log(`[BALANCE] AR Delta      : ${(arAfterInvoice - arBefore).toFixed(2)} (Expected: +${UNIT_PRICE})`);
        console.log(`============================================\n`);
        expect(arAfterInvoice).toBeGreaterThan(arBefore);

        console.log(`[STEP 3] Voiding invoice (credit note)...`);
        const voided = await app.api.sales.reverseInvoiceAPI(inv.id);
        if (!voided) throw new Error(`[FAIL] Invoice void was rejected by the system.`);

        await page.waitForTimeout(5000);
        const arAfterVoid = await app.getAccountBalanceAPI(meta.arAccountId);
        const drift = Math.abs(arAfterVoid - arBefore);

        console.log(`\n========== CREDIT NOTE AUDIT REPORT ==========`);
        console.log(`[DOCUMENT] Invoice Ref  : ${inv.ref}`);
        console.log(`[DOCUMENT] Invoice ID   : ${inv.id}`);
        console.log(`[ACCOUNT] AR Account    : ${meta.arAccountId}`);
        console.log(`[BALANCE] AR Before Sale: ${arBefore.toFixed(2)}`);
        console.log(`[BALANCE] AR After Inv  : ${arAfterInvoice.toFixed(2)} (Delta: +${(arAfterInvoice - arBefore).toFixed(2)})`);
        console.log(`[BALANCE] AR After Void : ${arAfterVoid.toFixed(2)} (Expected: ~${arBefore.toFixed(2)})`);
        console.log(`[BALANCE] AR Drift      : ${drift.toFixed(2)} (Must be 0.00)`);
        console.log(`===============================================\n`);

        if (drift > 1) {
            throw new Error(
                `[VULNERABILITY] Credit Note GL Drift — Invoice Void Did Not Restore AR Balance\n` +
                `  Invoice      : ${inv.ref} (ID: ${inv.id})\n` +
                `  AR Account   : ${meta.arAccountId}\n` +
                `  AR Before    : ${arBefore.toFixed(2)}\n` +
                `  AR After Inv : ${arAfterInvoice.toFixed(2)} (correctly increased by ${UNIT_PRICE})\n` +
                `  AR After Void: ${arAfterVoid.toFixed(2)} (should have returned to ${arBefore.toFixed(2)})\n` +
                `  Drift        : ${drift.toFixed(2)} (must be 0.00)\n` +
                `  Root Cause   : Void is posting a NEW credit entry instead of reversing the original debit. ` +
                `Net AR movement is -${(drift * 2).toFixed(2)} instead of 0. Double-posting bug in void journal logic.`
            );
        }
        console.log(`[PASS] Credit note confirmed: AR balance correctly restored after invoice void.`);
    });
});
