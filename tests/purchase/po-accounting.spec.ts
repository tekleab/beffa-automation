import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';


/**
 * PROCUREMENT LEDGER & PAYMENT AUDITS
 *
 * Objectives:
 * 1. Verify Multi-Bill reconciliation: One payment correctly impacts multiple unpaid bills.
 *
 * NOTE: Bill balance restore after payment reversal is covered in procurement-stress-edge-cases.spec.ts
 * (test 4 — Bill reversal after payment, which also validates stock rollback).
 */

test.describe('Procurement Ledger & Payment Audits @purchase @logic @regression @full', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    });

    test('Audit: Single payment must correctly reconcile multiple unpaid bills', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        const meta = sharedMeta;
        const item = sharedItem;

        // 1. Create and approve two bills
        console.log(`[STEP 1] Creating Bill A (3000) and Bill B (2000)...`);
        const billA = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 3000, quantity: 1, vendorId: meta.vendorId });
        const billB = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 2000, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(billA.id, 'bills');
        await app.advanceDocumentAPI(billB.id, 'bills');

        // 2. Verify both bills have non-zero balances
        const billAData = await app.api.purchase.getBillAPI(billA.id);
        const billBData = await app.api.purchase.getBillAPI(billB.id);
        const amountA = parseFloat(billAData.unpaid_amount ?? billAData.amount_due ?? billAData.balance ?? 3000);
        const amountB = parseFloat(billBData.unpaid_amount ?? billBData.amount_due ?? billBData.balance ?? 2000);
        console.log(`[SNAPSHOT] Bill A balance: ${amountA} | Bill B balance: ${amountB}`);
        expect(amountA).toBeGreaterThan(0);
        expect(amountB).toBeGreaterThan(0);

        // 3. Create a single payment covering both bills (auto top-up on insufficient cash balance)
        const totalAmount = amountA + amountB;
        console.log(`[STEP 2] Creating single payment of ${totalAmount} covering both bills...`);
        const payment = await app.api.purchase.createMultiBillPaymentAPI({
            amount: totalAmount,
            vendorId: meta.vendorId,
            billPayments: [
                { amount: amountA, bill_id: billA.id },
                { amount: amountB, bill_id: billB.id }
            ]
        });

        await app.advanceDocumentAPI(payment.id, 'payments');

        // 4. CRITICAL CHECK: Both bills must show balance = 0
        console.log(`[AUDIT] Verifying both bills are fully reconciled...`);
        const finalBillA = await app.api.purchase.getBillAPI(billA.id);
        const finalBillB = await app.api.purchase.getBillAPI(billB.id);
        const finalBalanceA = parseFloat(finalBillA.unpaid_amount ?? finalBillA.balance ?? finalBillA.amount_due ?? -1);
        const finalBalanceB = parseFloat(finalBillB.unpaid_amount ?? finalBillB.balance ?? finalBillB.amount_due ?? -1);

        console.log(`[SNAPSHOT] Bill A final balance: ${finalBalanceA} | Bill B final balance: ${finalBalanceB}`);

        if (finalBalanceA !== 0) throw new Error(`[CRITICAL_LOGIC_BUG] Bill A not fully reconciled. Balance: ${finalBalanceA}, Expected: 0`);
        if (finalBalanceB !== 0) throw new Error(`[CRITICAL_LOGIC_BUG] Bill B not fully reconciled. Balance: ${finalBalanceB}, Expected: 0`);

        expect(finalBalanceA).toBe(0);
        expect(finalBalanceB).toBe(0);
        console.log(`[SUCCESS] Multi-Bill Reconciliation confirmed. Both bills fully settled by single payment.`);
    });
});
