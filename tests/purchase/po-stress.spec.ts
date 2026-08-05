import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { Logger } from '../../lib/utils/Logger';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

async function apiLogin(request: any): Promise<string> {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('apiLogin failed');
    return token;
}


/**
 * PROCUREMENT STRESS & FINANCIAL EDGE CASES
 *
 * Scenarios designed to expose financial integrity bugs:
 * 1. Overpayment attack — pay more than bill total         [CONFIRMED BUG: balance goes negative]
 * 2. Double-billing same PO — duplicate liability
 * 3. Payment against fully-paid bill — ghost payment
 * 4. Bill reversal after payment — stock & ledger rollback
 * 5. Partial payment sequence — balance drift
 * 6. Orphan bill — cancel PO after bill approved
 */

test.describe('Procurement Stress & Financial Edge Cases @purchase @logic @security @regression @full', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;

    test.beforeAll(async ({ browser, request }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await apiLogin(request);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
        await page.close();
    });

    test.beforeEach(async ({ page, request }) => {
        const app = new AppManager(page);
        await apiLogin(request);
    });

    // ── 1. OVERPAYMENT ATTACK ─────────────────────────────────────────────────
    test('Guardrail: System must reject payment exceeding bill total', async ({ page , request }) => {
        // CONFIRMED BUG: system accepts overpayment and creates negative balance (vendor credit injection)
        test.fail(true, '[CONFIRMED BUG] Overpayment accepted — balance goes negative. Vendor credit injection possible.');

        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const billAmount = 3000;
        console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);

        const overpayAmount = billAmount * 2;
        console.log(`[ATTACK] Overpayment of ${overpayAmount} against bill ${bill.ref} (total: ${billAmount})...`);
        const payment = await app.api.purchase.createBillPaymentAPI({ amount: overpayAmount, billId: bill.id, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(payment.id, 'payments');
        console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${overpayAmount}`);

        const billData = await app.api.purchase.getBillAPI(bill.id);
        const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? 0);
        console.log(`[RESULT] Bill ${bill.ref} balance after overpayment: ${balance} (expected: >= 0)`);

        expect.soft(balance, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Overpayment of ${overpayAmount} on ${billAmount} bill created negative balance=${balance}. Vendor credit injection possible.`).toBeGreaterThanOrEqual(0);
        if (balance < 0) Logger.fail(`Bill ${bill.ref} overpayment bug confirmed: balance=${balance}`);
        else console.log(`[PASS] Balance capped at 0 — overpayment handled correctly.`);
    });

    // ── 2. DOUBLE-BILLING SAME PO ─────────────────────────────────────────────
    test('Guardrail: System must prevent double-billing the same PO', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Creating & approving PO...`);
        const po = await app.api.purchase.createPurchaseOrderAPI(item, 5, 1000, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');
        console.log(`[PO] ${po.poNumber} (${po.poId})`);

        console.log(`[STEP 2] Creating first Bill from PO...`);
        const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId);
        await app.advanceDocumentAPI(bill1.billId, 'bills');
        console.log(`[BILL 1] ${bill1.billNumber} (${bill1.billId}) — approved`);

        console.log(`[ATTACK] Attempting second Bill from same PO ${po.poNumber}...`);
        try {
            const bill2 = await app.api.purchase.createBillFromPoAPI(po.poId);
            await app.advanceDocumentAPI(bill2.billId, 'bills');
            expect.soft(false, `[CRITICAL_LOGIC_BUG] Double-billing allowed! PO ${po.poNumber} billed twice: ${bill1.billNumber} + ${bill2.billNumber}. Duplicate liability created.`).toBe(true);
            Logger.fail(`Double-billing bug confirmed on PO ${po.poNumber}`);
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) Logger.fail(err.message);
            else console.log(`[PASS] Double-billing correctly blocked: ${err.message}`);
        }
    });

    // ── 3. PAYMENT AGAINST FULLY-PAID BILL ───────────────────────────────────
    test('Guardrail: System must reject payment against a fully-paid bill', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const billAmount = 2000;
        console.log(`[STEP 1] Creating & approving Bill for ${billAmount}...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id}) | Amount: ${billAmount}`);

        console.log(`[STEP 2] Fully paying bill ${bill.ref}...`);
        const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(payment.id, 'payments');
        console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);

        const billData = await app.api.purchase.getBillAPI(bill.id);
        const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? 0);
        console.log(`[AUDIT] Bill ${bill.ref} balance after full payment: ${balance}`);
        expect(balance).toBe(0);

        console.log(`[ATTACK] Attempting ghost payment against fully-paid bill ${bill.ref}...`);
        try {
            const ghost = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
            await app.advanceDocumentAPI(ghost.id, 'payments');
            console.log(`[GHOST PAYMENT] ${ghost.ref} (${ghost.id})`);
            expect.soft(false, `[CRITICAL_LOGIC_BUG] Ghost payment ${ghost.ref} accepted on fully-paid bill ${bill.ref}! Vendor credit manipulation possible.`).toBe(true);
            Logger.fail(`Ghost payment bug confirmed on bill ${bill.ref}`);
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) Logger.fail(err.message);
            else console.log(`[PASS] Ghost payment correctly blocked: ${err.message}`);
        }
    });

    // ── 4. BILL REVERSAL AFTER PAYMENT — STOCK & LEDGER ROLLBACK ─────────────
    test('Audit: Bill reversal after payment must roll back stock and restore balance', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const qty = 3;
        const stockBefore = item.currentStock;
        console.log(`[ITEM] "${item.itemName}" | Stock before: ${stockBefore}`);

        console.log(`[STEP 1] Creating & approving Bill for ${qty} units...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: qty, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id}) | Qty: ${qty}`);

        await page.waitForTimeout(3000);
        const stockAfterBill = await app.api.inventory.pollStockAPI(item.itemId, stockBefore + qty, item.locationId);
        console.log(`[AUDIT] Stock after bill approval: ${stockAfterBill} (expected: ${stockBefore + qty})`);
        expect(stockAfterBill).toBe(stockBefore + qty);

        console.log(`[STEP 2] Paying bill ${bill.ref}...`);
        const billData = await app.api.purchase.getBillAPI(bill.id);
        const billAmount = parseFloat(billData.unpaid_amount ?? billData.net_due ?? billData.total ?? 3000);
        const payment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(payment.id, 'payments');
        console.log(`[PAYMENT] ${payment.ref} (${payment.id}) | Amount: ${billAmount}`);

        // CRITICAL: Payment must be voided first — bill reversal only works when no active payments are linked
        console.log(`[STEP 3] Voiding payment ${payment.ref} before reversing bill...`);
        const voidSuccess = await app.api.purchase.reversePaymentAPI(payment.id);
        expect(voidSuccess).toBe(true);
        console.log(`[PAYMENT VOIDED] ${payment.ref}`);

        await page.waitForTimeout(3000); // Allow ledger to process void

        console.log(`[STEP 4] Reversing bill ${bill.ref}...`);
        const reversed = await app.api.purchase.reverseBillAPI(bill.id);
        console.log(`[REVERSAL] Result: ${reversed}`);
        expect(reversed).toBeTruthy();

        await page.waitForTimeout(5000); // Allow stock index to sync
        const stockAfterReversal = await app.api.inventory.pollStockAPI(item.itemId, stockBefore, item.locationId);
        console.log(`[AUDIT] Stock after reversal: ${stockAfterReversal} (expected: ${stockBefore})`);

        expect.soft(stockAfterReversal, `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Stock not rolled back after reversal. Expected ${stockBefore}, got ${stockAfterReversal}`).toBe(stockBefore);
        if (stockAfterReversal !== stockBefore) Logger.fail(`Stock rollback bug: expected ${stockBefore}, got ${stockAfterReversal}`);
        expect(stockAfterReversal).toBe(stockBefore);
        console.log(`[PASS] Bill ${bill.ref}: payment voided → bill reversed → stock and ledger correctly rolled back.`);
    });

    // ── 5. PARTIAL PAYMENT SEQUENCE — BALANCE DRIFT ──────────────────────────
    test('Audit: Three partial payments must exactly zero out bill balance', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const billTotal = 9000;
        const partials = [3000, 3000, 3000];
        console.log(`[STEP 1] Creating & approving Bill for ${billTotal}...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billTotal, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id}) | Total: ${billTotal}`);

        let expectedBalance = billTotal;
        for (let i = 0; i < partials.length; i++) {
            console.log(`[STEP ${i + 2}] Partial payment ${i + 1} of ${partials[i]} against bill ${bill.ref}...`);
            const payment = await app.api.purchase.createBillPaymentAPI({ amount: partials[i], billId: bill.id, vendorId: meta.vendorId });
            await app.advanceDocumentAPI(payment.id, 'payments');
            console.log(`[PAYMENT ${i + 1}] ${payment.ref} (${payment.id}) | Amount: ${partials[i]}`);
            await page.waitForTimeout(2000);

            expectedBalance -= partials[i];
            const billData = await app.api.purchase.getBillAPI(bill.id);
            const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? -1);
            console.log(`[AUDIT] Bill ${bill.ref} balance after payment ${i + 1}: ${balance} (expected: ${expectedBalance})`);

            expect.soft(
                Math.abs(balance - expectedBalance),
                `[CRITICAL_LOGIC_BUG] Bill ${bill.ref}: Balance drift after partial payment ${i + 1}. Expected ${expectedBalance}, got ${balance}`
            ).toBeLessThanOrEqual(0.01);
            if (Math.abs(balance - expectedBalance) > 0.01) Logger.fail(`Balance drift: expected ${expectedBalance}, got ${balance}`);
        }

        const finalBill = await app.api.purchase.getBillAPI(bill.id);
        const finalBalance = parseFloat(finalBill.unpaid_amount ?? finalBill.balance ?? finalBill.amount_due ?? -1);
        console.log(`[AUDIT] Bill ${bill.ref} final balance after 3 partial payments: ${finalBalance} (expected: 0)`);
        expect(Math.abs(finalBalance)).toBeLessThanOrEqual(0.01);
        console.log(`[PASS] Bill ${bill.ref} partial payment sequence correctly zeroed balance.`);
    });

    // ── 6. ORPHAN BILL — CANCEL PO AFTER BILL APPROVED ───────────────────────
    test('Audit: Cancelling a PO after its linked bill is approved must not corrupt ledger', async ({ page , request }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;
        const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

        console.log(`[STEP 1] Creating & approving PO...`);
        const po = await app.api.purchase.createPurchaseOrderAPI(item, 2, 1500, meta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');
        console.log(`[PO] ${po.poNumber} (${po.poId})`);

        console.log(`[STEP 2] Creating & approving linked Bill...`);
        const bill = await app.api.purchase.createBillFromPoAPI(po.poId);
        await app.advanceDocumentAPI(bill.billId, 'bills');
        console.log(`[BILL] ${bill.billNumber} (${bill.billId}) — approved`);

        console.log(`[ATTACK] Attempting to cancel source PO ${po.poNumber} after bill ${bill.billNumber} is approved...`);
        const headers = {
            'Authorization': `Bearer ${await app._getAuthToken()}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const cancelResp = await page.request.patch(
            `${app.apiBase}/purchase-orders/${po.poId}/cancel?${params}`,
            { headers, data: {} }
        );
        console.log(`[INFO] PO ${po.poNumber} cancel attempt: HTTP ${cancelResp.status()}`);

        const billData = await app.api.purchase.getBillAPI(bill.billId);
        const billStatus = billData.status?.toLowerCase();
        console.log(`[AUDIT] Bill ${bill.billNumber} status after PO cancel: ${billStatus}`);

        expect.soft(billStatus, `[CRITICAL_LOGIC_BUG] Bill ${bill.billNumber}: Cancelling source PO ${po.poNumber} corrupted bill status to "${billStatus}"`).toBe('approved');
        if (billStatus !== 'approved') Logger.fail(`Bill status corruption: expected approved, got ${billStatus}`);
        expect(billStatus).toBe('approved');
        console.log(`[PASS] Bill ${bill.billNumber} integrity maintained after PO ${po.poNumber} cancel attempt.`);
    });
});
