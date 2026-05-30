import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT PAYMENT ATTACK VECTORS
 *
 * Scenarios targeting payment manipulation vulnerabilities:
 * 1. Zero-amount payment approval — ghost accounting entry
 * 2. Negative payment amount — reverse cash flow injection
 * 3. Payment split array mismatch — bill_payments sum != payment total
 */

test.describe('Procurement Payment Attack Vectors @purchase @security @logic @regression', () => {

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI();
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // ── 1. ZERO-AMOUNT PAYMENT APPROVAL ──────────────────────────────────────
    test('Guardrail: System must reject approval of a zero-amount payment', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Creating & approving Bill for 5000...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 5000, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id})`);

        console.log(`[ATTACK] Attempting to create and approve a 0.00 payment against live bill...`);
        try {
            const zeroPayment = await app.api.purchase.createBillPaymentAPI({ amount: 0, billId: bill.id, vendorId: meta.vendorId });
            console.log(`[INFO] Zero payment created: ${zeroPayment.ref} (${zeroPayment.id})`);
            await app.advanceDocumentAPI(zeroPayment.id, 'payments');

            const billData = await app.api.purchase.getBillAPI(bill.id);
            const balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? -1);
            console.log(`[RESULT] Bill balance after 0.00 payment: ${balance}`);

            if (balance === 5000) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Zero-amount payment approved and created a ghost journal entry. Bill balance unchanged at ${balance} but a payment record exists.`);
            }
            if (balance < 5000) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Zero-amount payment of 0.00 reduced bill balance to ${balance}! Accounting corruption.`);
            }
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Zero-amount payment correctly blocked: ${err.message}`);
        }
    });

    // ── 2. NEGATIVE PAYMENT AMOUNT ────────────────────────────────────────────
    test('Guardrail: System must reject a negative payment amount', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Creating & approving Bill for 5000...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 5000, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id})`);

        console.log(`[ATTACK] Attempting to create a payment of -5000...`);
        try {
            const negPayment = await app.api.purchase.createBillPaymentAPI({ amount: -5000, billId: bill.id, vendorId: meta.vendorId });
            console.log(`[INFO] Negative payment created: ${negPayment.ref} (${negPayment.id})`);
            await app.advanceDocumentAPI(negPayment.id, 'payments');

            const billData = await app.api.purchase.getBillAPI(bill.id);
            const balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? -1);
            console.log(`[RESULT] Bill balance after -5000 payment: ${balance}`);

            if (balance > 5000) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Negative payment of -5000 INCREASED bill balance to ${balance}. Cash injection via reverse payment possible.`);
            }
            throw new Error(`[CRITICAL_LOGIC_BUG] Negative payment of -5000 was accepted and approved. Balance: ${balance}. Reverse cash flow attack vector confirmed.`);
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Negative payment correctly blocked: ${err.message}`);
        }
    });

    // ── 3. PAYMENT SPLIT ARRAY MISMATCH ──────────────────────────────────────
    test('Guardrail: System must reject payment where split array does not match total', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Creating & approving Bill for 5000...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 5000, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[BILL] ${bill.ref} (${bill.id})`);

        const { apiBase, headers, qs } = await app.buildApiContext();

        const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
        const acctData = await acctResp.json();
        const cashAccount = (acctData.items || acctData.data || []).find((a: any) =>
            a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')
        ) || (acctData.items || acctData.data || [])[0];

        console.log(`[ATTACK] Sending payment total=5000 but bill_payments sum=3000 (2000 unaccounted)...`);
        const mismatchResp = await page.request.post(`${apiBase}/payments?${qs}`, {
            headers,
            data: {
                amount: 5000,
                cash_account_id: cashAccount?.id,
                vendor_id: meta.vendorId,
                date: new Date().toISOString(),
                payment_method: 'cash',
                currency_id: sharedMeta.currencyId,
                bill_payments: [{ amount: 3000, bill_id: bill.id }]
            }
        });

        if (mismatchResp.ok()) {
            const mismatchPayment = await mismatchResp.json();
            console.log(`[INFO] Mismatch payment created: ${mismatchPayment.ref} (${mismatchPayment.id})`);
            await app.advanceDocumentAPI(mismatchPayment.id, 'payments');

            const billData = await app.api.purchase.getBillAPI(bill.id);
            const balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? -1);
            console.log(`[RESULT] Bill balance after mismatch payment: ${balance}`);

            if (balance === 2000) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Payment mismatch accepted: total=5000 but only 3000 allocated to bill. Balance=${balance}. 2000 extracted from cash with no liability offset — funds vanish.`);
            }
            if (balance === 0) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Payment mismatch accepted and bill fully cleared despite only 3000 allocated. 2000 in free cash extracted.`);
            }
        } else {
            console.log(`[PASS] Mismatched payment correctly rejected: HTTP ${mismatchResp.status()}`);
        }
    });
});
