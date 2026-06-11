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
        const amountA = parseFloat(billAData.balance ?? billAData.amount_due ?? billAData.unpaid_amount ?? 3000);
        const amountB = parseFloat(billBData.balance ?? billBData.amount_due ?? billBData.unpaid_amount ?? 2000);
        console.log(`[SNAPSHOT] Bill A balance: ${amountA} | Bill B balance: ${amountB}`);
        expect(amountA).toBeGreaterThan(0);
        expect(amountB).toBeGreaterThan(0);

        // 3. Create a single payment covering both bills
        const totalAmount = amountA + amountB;
        console.log(`[STEP 2] Creating single payment of ${totalAmount} covering both bills...`);
        const { apiBase, headers, qs } = await app.buildApiContext();

        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
        const acctData = await acctResp.json();
        const cashAccount = (acctData.items || acctData.data || []).find((a: any) =>
            a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')
        ) || (acctData.items || acctData.data || [])[0];

        const currResp = await page.request.get(`${apiBase}/currency?${qs}`, { headers });
        const currData = await currResp.json();
        const currency = currData.items?.[0] || currData.data?.[0];

        const paymentResp = await page.request.post(`${apiBase}/payments?${qs}`, {
            headers,
            data: {
                amount: totalAmount,
                cash_account_id: cashAccount?.id,
                vendor_id: meta.vendorId,
                date: new Date().toISOString(),
                payment_method: 'cash',
                currency_id: currency?.id,
                bill_payments: [
                    { amount: amountA, bill_id: billA.id },
                    { amount: amountB, bill_id: billB.id }
                ]
            }
        });

        if (!paymentResp.ok()) throw new Error(`Multi-bill payment failed: ${paymentResp.status()} - ${await paymentResp.text()}`);
        const payment = await paymentResp.json();
        console.log(`[SUCCESS] Multi-bill payment created: ${payment.ref} (ID: ${payment.id})`);

        await app.advanceDocumentAPI(payment.id, 'payments');

        // 4. CRITICAL CHECK: Both bills must show balance = 0
        console.log(`[AUDIT] Verifying both bills are fully reconciled...`);
        const finalBillA = await app.api.purchase.getBillAPI(billA.id);
        const finalBillB = await app.api.purchase.getBillAPI(billB.id);
        const finalBalanceA = parseFloat(finalBillA.balance ?? finalBillA.amount_due ?? finalBillA.unpaid_amount ?? -1);
        const finalBalanceB = parseFloat(finalBillB.balance ?? finalBillB.amount_due ?? finalBillB.unpaid_amount ?? -1);

        console.log(`[SNAPSHOT] Bill A final balance: ${finalBalanceA} | Bill B final balance: ${finalBalanceB}`);

        if (finalBalanceA !== 0) throw new Error(`[CRITICAL_LOGIC_BUG] Bill A not fully reconciled. Balance: ${finalBalanceA}, Expected: 0`);
        if (finalBalanceB !== 0) throw new Error(`[CRITICAL_LOGIC_BUG] Bill B not fully reconciled. Balance: ${finalBalanceB}, Expected: 0`);

        expect(finalBalanceA).toBe(0);
        expect(finalBalanceB).toBe(0);
        console.log(`[SUCCESS] Multi-Bill Reconciliation confirmed. Both bills fully settled by single payment.`);
    });
});
