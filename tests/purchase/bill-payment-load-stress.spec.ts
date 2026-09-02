import { test, expect, Browser, Page } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { apiLoginSetup } from '../../lib/utils/apiLoginSetup';
import { Logger } from '../../lib/utils/Logger';

/**
 * =============================================================================
 * MODULE: Bill Payment - Load & Stress Performance Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Concurrent bill payment creation under high load
 * 2. AP sub-ledger balance accuracy under concurrent payments
 * 3. Bulk bill payment list response time thresholds
 * =============================================================================
 */


/**
 * BILL PAYMENT LOAD & STRESS SUITE
 * 
 * Verifies AP payment performance, concurrency safety, and transaction integrity under load.
 * 
 * Scenarios:
 * 1. LOAD: Approve multiple bill payments concurrently for the same vendor.
 * 2. STRESS: Concurrent submission of duplicate payments against the same bill (double payment avoidance).
 * 3. STRESS: Payment against a bill that was reversed mid-flight.
 */

test.describe('Bill Payment Load & Stress Audits @purchase @load @stress @regression @full', () => {
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
        try {
            await page.close();
        } catch (e) {}
    });

    // ── 1. LOAD: CONCURRENT BILL PAYMENT APPROVALS ────────────────────────────
    test('LOAD: Concurrently approving 5 bill payments must succeed without database deadlocks', async () => {
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO', quantity: 100, unit_cost: 100
        });

        const CONCURRENCY = 5;
        const BILL_AMOUNT = 1000;

        // Create 5 separate bills
        const bills: any[] = [];
        for (let i = 0; i < CONCURRENCY; i++) {
            const bill = await app.api.purchase.createBillAPI({
                itemData: item,
                quantity: 1,
                unitPrice: BILL_AMOUNT,
                vendorId: meta.vendorId
            });
            await app.advanceDocumentAPI(bill.id, 'bills');
            bills.push(bill);
        }

        console.log(`[LOAD] Created ${CONCURRENCY} approved bills. Creating payments...`);

        // Pre-seed cash account to avoid 422 insufficient balance during concurrent approvals
        const accounts = await app.base.getAllAccountsAPI();
        const cashAccount = accounts.find((a: any) =>
            (a.type || a.account_type || '').toLowerCase().includes('cash') || 
            (a.type || a.account_type || '').toLowerCase().includes('bank')
        ) || accounts[0];
        console.log(`[LOAD] Pre-seeding Cash Account ${cashAccount.name} with ${BILL_AMOUNT * CONCURRENCY}...`);
        await app.base.seedCashBalanceAPI(BILL_AMOUNT * CONCURRENCY, cashAccount.id);

        // Create 5 corresponding draft payments
        const payments: any[] = [];
        for (const bill of bills) {
            const payment = await app.api.purchase.createBillPaymentAPI({
                amount: BILL_AMOUNT,
                billId: bill.id,
                vendorId: meta.vendorId
            });
            payments.push(payment);
        }

        console.log(`[LOAD] Approving ${CONCURRENCY} payments concurrently...`);
        const start = Date.now();
        const results = await Promise.allSettled(
            payments.map(p => app.advanceDocumentAPI(p.id, 'payments'))
        );
        const elapsed = Date.now() - start;

        const passed = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

        console.log(`[LOAD] Payments approval: ${passed} passed | ${failed.length} failed in ${elapsed}ms`);
        
        if (failed.length > 0) {
            failed.forEach((f, idx) => console.log(`[FAIL ${idx + 1}] ${f.reason?.message}`));
        }

        expect(failed.length, 'Database deadlocks/concurrency errors during concurrent payment approvals').toBe(0);

        // Verify all bills are now fully paid
        for (const bill of bills) {
            const billData = await app.api.purchase.getBillAPI(bill.id);
            const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? '-1');
            expect(balance).toBeLessThanOrEqual(0.01);
        }
        console.log(`[PASS] All ${CONCURRENCY} bills verified paid in full.`);
    });

    // ── 2. STRESS: CONCURRENT DUPLICATE PAYMENTS (RACE CONDITION) ──────────────
    test('STRESS: Concurrent duplicate payment submittals against same bill must be blocked', async () => {
        test.fail(true, '[CONFIRMED BUG] Double payment race condition in ERP backend');
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO', quantity: 20, unit_cost: 100
        });

        const BILL_AMOUNT = 2500;
        const bill = await app.api.purchase.createBillAPI({
            itemData: item,
            quantity: 1,
            unitPrice: BILL_AMOUNT,
            vendorId: meta.vendorId
        });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[STRESS] Bill ${bill.ref} approved | amount: ${BILL_AMOUNT}`);

        // Fire 2 concurrent payments for the full bill amount
        console.log(`[STRESS] Creating 2 concurrent payments for full amount...`);
        const p1Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
        const p2Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });

        const [p1Res, p2Res] = await Promise.allSettled([p1Promise, p2Promise]);
        
        const validPayments: any[] = [];
        if (p1Res.status === 'fulfilled') validPayments.push(p1Res.value);
        if (p2Res.status === 'fulfilled') validPayments.push(p2Res.value);

        console.log(`[STRESS] Created ${validPayments.length} payment documents.`);

        if (validPayments.length === 2) {
            console.log(`[STRESS] Approving both payments concurrently to trigger race condition...`);
            const approveRes = await Promise.allSettled(
                validPayments.map(p => app.advanceDocumentAPI(p.id, 'payments'))
            );

            const approvedCount = approveRes.filter(r => r.status === 'fulfilled').length;
            console.log(`[STRESS] Approved ${approvedCount} of 2 payments.`);

            // Fetch final bill status
            const billData = await app.api.purchase.getBillAPI(bill.id);
            const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? '0');
            console.log(`[STRESS] Final bill balance: ${balance}`);

            if (approvedCount === 2) {
                throw new Error(`[DOUBLE_PAYMENT_BUG] Race condition allowed: both payments approved concurrently for bill ${bill.ref}!`);
            }

            expect(approvedCount).toBeLessThan(2);
        } else {
            console.log(`[PASS] Concurrent draft creation rejected duplicate call correctly.`);
        }
    });

    // ── 3. STRESS: PAYMENT AGAINST MID-FLIGHT REVERSED BILL ──────────────────
    test('STRESS: Payment against a bill reversed mid-flight must be rejected', async () => {
        test.fail(true, '[CONFIRMED BUG] Payment approved against reversed bill');
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'FIFO', quantity: 20, unit_cost: 100
        });

        const BILL_AMOUNT = 3000;
        const bill = await app.api.purchase.createBillAPI({
            itemData: item,
            quantity: 1,
            unitPrice: BILL_AMOUNT,
            vendorId: meta.vendorId
        });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[STRESS] Bill ${bill.ref} approved.`);

        // Create draft payment
        const payment = await app.api.purchase.createBillPaymentAPI({
            amount: BILL_AMOUNT,
            billId: bill.id,
            vendorId: meta.vendorId
        });
        console.log(`[STRESS] Draft payment ${payment.ref} created.`);

        // Reverse the bill
        const reversed = await app.api.purchase.reverseBillAPI(bill.id);
        expect(reversed).toBe(true);
        console.log(`[STRESS] Bill ${bill.ref} reversed successfully.`);

        // Now attempt to approve the payment against the reversed bill
        console.log(`[STRESS] Attempting to approve payment ${payment.ref} against reversed bill...`);
        let approved = false;
        try {
            await app.advanceDocumentAPI(payment.id, 'payments');
            approved = true;
        } catch (err: any) {
            console.log(`[PASS] Payment rejected correctly: ${err.message}`);
        }

        if (approved) {
            throw new Error(`[REVERSED_BILL_BUG] Payment ${payment.ref} approved against reversed bill ${bill.ref}!`);
        }
    });
});
