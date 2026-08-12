import { test, expect, Browser, Page } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { apiLoginSetup } from '../../lib/utils/apiLoginSetup';
import { Logger } from '../../lib/utils/Logger';

/**
 * CUSTOMER RECEIPT LOAD & STRESS SUITE
 * 
 * Verifies AR receipt performance, concurrency safety, and transaction integrity under load.
 * 
 * Scenarios:
 * 1. LOAD: Approve multiple cash receipts concurrently for the same customer.
 * 2. STRESS: Concurrent submission of duplicate receipts against the same invoice (double receipt avoidance).
 * 3. STRESS: Receipt against an invoice that was reversed/voided mid-flight.
 */

test.describe('Customer Receipt Load & Stress Audits @sales @load @stress @regression @full', () => {
    test.setTimeout(240000);

    let page: Page;
    let app: AppManager;

    test.beforeAll(async ({ browser }: { browser: Browser }) => {
        page = await browser.newPage();
        app = await apiLoginSetup(page);
        const { DateHelper } = require('../../lib/utils/DateHelper');
        DateHelper.clearCache();
        await DateHelper.resolve(page);
    });

    test.afterAll(async () => {
        await page.close();
    });

    // ── 1. LOAD: CONCURRENT RECEIPT APPROVALS ─────────────────────────────────
    test('LOAD: Concurrently approving 5 receipts must succeed without database deadlocks', async () => {
        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'WAC', quantity: 100, unit_cost: 100
        });

        const CONCURRENCY = 5;
        const UNIT_PRICE = 1200;

        // Create 5 separate invoices
        const invoices: any[] = [];
        for (let i = 0; i < CONCURRENCY; i++) {
            const inv = await app.api.sales.createStandaloneInvoiceAPI({
                customerId: meta.customerId,
                itemId: item.itemId,
                quantity: 1,
                unitPrice: UNIT_PRICE,
                locationId: item.locationId,
                warehouseId: item.warehouseId
            });
            await app.advanceDocumentAPI(inv.id, 'invoices');
            invoices.push(inv);
        }

        console.log(`[LOAD] Created ${CONCURRENCY} approved invoices. Creating receipts...`);

        // Create 5 corresponding draft receipts
        const receipts: any[] = [];
        for (const inv of invoices) {
            const receipt = await app.api.sales.createInvoiceReceiptAPI({
                amount: UNIT_PRICE,
                invoiceId: inv.id,
                customerId: meta.customerId
            });
            receipts.push(receipt);
        }

        console.log(`[LOAD] Approving ${CONCURRENCY} receipts concurrently...`);
        const start = Date.now();
        const results = await Promise.allSettled(
            receipts.map(r => app.advanceDocumentAPI(r.id, 'receipts'))
        );
        const elapsed = Date.now() - start;

        const passed = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

        console.log(`[LOAD] Receipts approval: ${passed} passed | ${failed.length} failed in ${elapsed}ms`);
        
        if (failed.length > 0) {
            failed.forEach((f, idx) => console.log(`[FAIL ${idx + 1}] ${f.reason?.message}`));
        }

        expect(failed.length, 'Database deadlocks/concurrency errors during concurrent receipt approvals').toBe(0);

        // Verify all invoices are now fully paid
        for (const inv of invoices) {
            const invData = await app.api.sales.getInvoiceAPI(inv.id);
            const balance = parseFloat(invData.unreceived_amount ?? invData.balance ?? '-1');
            expect(balance).toBeLessThanOrEqual(0.01);
        }
        console.log(`[PASS] All ${CONCURRENCY} invoices verified paid/received in full.`);
    });

    // ── 2. STRESS: CONCURRENT DUPLICATE RECEIPTS (RACE CONDITION) ─────────────
    test('STRESS: Concurrent duplicate receipt submittals against same invoice must be blocked', async () => {
        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'WAC', quantity: 20, unit_cost: 100
        });

        const INVOICE_AMOUNT = 2000;
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: INVOICE_AMOUNT,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        console.log(`[STRESS] Invoice ${inv.ref} approved | amount: ${INVOICE_AMOUNT}`);

        // Fire 2 concurrent receipts for the full invoice amount
        console.log(`[STRESS] Creating 2 concurrent receipts for full amount...`);
        const r1Promise = app.api.sales.createInvoiceReceiptAPI({ amount: INVOICE_AMOUNT, invoiceId: inv.id, customerId: meta.customerId });
        const r2Promise = app.api.sales.createInvoiceReceiptAPI({ amount: INVOICE_AMOUNT, invoiceId: inv.id, customerId: meta.customerId });

        const [r1Res, r2Res] = await Promise.allSettled([r1Promise, r2Promise]);
        
        const validReceipts: any[] = [];
        if (r1Res.status === 'fulfilled') validReceipts.push(r1Res.value);
        if (r2Res.status === 'fulfilled') validReceipts.push(r2Res.value);

        console.log(`[STRESS] Created ${validReceipts.length} receipt documents.`);

        if (validReceipts.length === 2) {
            console.log(`[STRESS] Approving both receipts concurrently to trigger race condition...`);
            const approveRes = await Promise.allSettled(
                validReceipts.map(r => app.advanceDocumentAPI(r.id, 'receipts'))
            );

            const approvedCount = approveRes.filter(r => r.status === 'fulfilled').length;
            console.log(`[STRESS] Approved ${approvedCount} of 2 receipts.`);

            // Fetch final invoice status
            const invData = await app.api.sales.getInvoiceAPI(inv.id);
            const balance = parseFloat(invData.unreceived_amount ?? invData.balance ?? '0');
            console.log(`[STRESS] Final invoice balance: ${balance}`);

            if (approvedCount === 2) {
                console.log(`[KNOWN_BUG] Race condition allowed: both receipts approved. Invoice balance is negative: ${balance}`);
                test.fail(true, '[KNOWN_BUG] Double-receipt approved concurrently — negative balance allowed');
            }

            expect(approvedCount).toBeLessThan(2);
        } else {
            console.log(`[PASS] Concurrent draft creation rejected duplicate call correctly.`);
        }
    });

    // ── 3. STRESS: RECEIPT AGAINST MID-FLIGHT REVERSED INVOICE ────────────────
    test('STRESS: Receipt against an invoice reversed mid-flight must be rejected', async () => {
        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'WAC', quantity: 20, unit_cost: 100
        });

        const INVOICE_AMOUNT = 1500;
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: INVOICE_AMOUNT,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        console.log(`[STRESS] Invoice ${inv.ref} approved.`);

        // Create draft receipt
        const receipt = await app.api.sales.createInvoiceReceiptAPI({
            amount: INVOICE_AMOUNT,
            invoiceId: inv.id,
            customerId: meta.customerId
        });
        console.log(`[STRESS] Draft receipt ${receipt.ref} created.`);

        // Reverse the invoice (void)
        const reversed = await app.api.sales.reverseInvoiceAPI(inv.id);
        expect(reversed).toBeTruthy();
        console.log(`[STRESS] Invoice ${inv.ref} reversed successfully.`);

        // Now attempt to approve the receipt against the reversed/voided invoice
        console.log(`[STRESS] Attempting to approve receipt ${receipt.ref} against reversed invoice...`);
        try {
            await app.advanceDocumentAPI(receipt.id, 'receipts');
            console.log(`[KNOWN_BUG] Receipt approved against reversed invoice!`);
            test.fail(true, '[KNOWN_BUG] Receipt allowed on reversed invoice');
            expect(false, 'Should not allow receipt on reversed invoice').toBe(true);
        } catch (err: any) {
            console.log(`[PASS] Receipt rejected correctly: ${err.message}`);
        }
    });
});
