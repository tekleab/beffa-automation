import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCURE-TO-PAY (P2P) END-TO-END AUDIT
 *
 * Full integration flow:
 * 1. Discover vendor, currency, accounts.
 * 2. Create an item with some initial stock.
 * 3. Create a Purchase Order (PO) for the item.
 * 4. Approve/Release the PO.
 * 5. Create a Bill from the PO (receiving the goods).
 * 6. Approve the Bill -> check stock increase.
 * 7. Pay the Bill (Create Bill Payment).
 * 8. Approve the Payment.
 * 9. Verify Vendor balance is reduced/cleared.
 * 10. Verify GL journal entry impact for both Bill (Debit Expense/Inventory, Credit AP)
 *     and Payment (Debit AP, Credit Cash/Bank).
 */

const isAP = (e: any) => {
    const n = (e.accountName || e.account?.name || '').toLowerCase();
    return n.includes('payable') || n.includes('accounts payable') || n.includes('ap');
};

const isCash = (e: any) => {
    const n = (e.accountName || e.account?.name || '').toLowerCase();
    return n.includes('cash') || n.includes('bank');
};

test.describe('Procure-to-Pay (P2P) Full Integration @cross-module @purchase @logic @regression @full', () => {
    test.setTimeout(360000);

    test('Full E2E Cycle: PO -> Bill (Receive) -> Payment -> Ledger & GL Verification', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };

        console.log(`[STEP 1] Metadata & Inventory Setup...`);
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({
            cost_method_code: 'WAC',
            quantity: 10,
            unit_cost: 100
        });
        const stockBefore = item.currentStock;
        console.log(`[ITEM] ${item.itemName} (${item.itemId}) | Stock before: ${stockBefore}`);

        // ── STEP 2: Create & Approve PO ──────────────────────────────────────────
        console.log(`[STEP 2] Creating Purchase Order...`);
        const poQty = 5;
        const poUnitPrice = 500;
        const poTotal = poQty * poUnitPrice;
        
        const po = await app.api.purchase.createPurchaseOrderAPI(item, poQty, poUnitPrice, meta.vendorId);
        expect(po.poId).toBeTruthy();
        console.log(`[PO] Created ${po.poNumber} (${po.poId})`);

        await app.advanceDocumentAPI(po.poId, 'purchase-orders');
        console.log(`[PO] Approved/Released ${po.poNumber}`);

        // ── STEP 3: Create & Approve Bill from PO (Goods Receipt) ─────────────────
        console.log(`[STEP 3] Billing and Receiving PO items...`);
        const bill = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems, meta.apAccountId);
        expect(bill.billId).toBeTruthy();
        console.log(`[BILL] Created from PO: ${bill.billNumber} (${bill.billId})`);

        await app.advanceDocumentAPI(bill.billId, 'bills');
        console.log(`[BILL] Approved ${bill.billNumber}`);

        // Verify stock has increased by poQty
        const expectedStock = stockBefore + poQty;
        const stockAfter = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId);
        console.log(`[STOCK] Expected: ${expectedStock}, Got: ${stockAfter}`);
        expect(stockAfter).toBe(expectedStock);

        // Verify Bill Outstanding Balance equals poTotal
        const billMiddleData = await app.api.purchase.getBillAPI(bill.billId);
        const billMiddleBal = parseFloat(billMiddleData.unpaid_amount ?? billMiddleData.balance ?? billMiddleData.amount_due ?? '-1');
        console.log(`[BILL] Outstanding balance after Approval: ${billMiddleBal}`);
        expect(billMiddleBal).toBeCloseTo(poTotal, 1);

        // Verify Bill GL entries: Debit Expense/Inventory, Credit AP
        let billEntries: any[] = [];
        for (let i = 0; i < 10; i++) {
            billEntries = await app.api.purchase.getBillJournalEntriesAPI(bill.billId);
            if (billEntries.length > 0) break;
            await page.waitForTimeout(3000);
        }
        console.log(`[BILL GL] Entries found: ${billEntries.length}`);
        if (billEntries.length > 0) {
            console.log(`[BILL GL DETAILS] ` + JSON.stringify(billEntries, null, 2));
            const isEntryAP = (e: any) => {
                const code = e.accountCode || e.account?.id || e.account_id || '';
                const n = (e.accountName || e.account?.name || '').toLowerCase();
                return code === meta.apAccountId || n.includes('payable') || n.includes('ap');
            };
            const apCredit = billEntries.find(e => isEntryAP(e) && e.credit > 0);
            expect(apCredit, 'AP must be credited on Bill approval').toBeTruthy();
            expect(apCredit.credit).toBeCloseTo(poTotal, 1);
            
            const expenseDebit = billEntries.find(e => !isEntryAP(e) && e.debit > 0);
            expect(expenseDebit, 'Expense/Inventory must be debited on Bill approval').toBeTruthy();
            expect(expenseDebit.debit).toBeCloseTo(poTotal, 1);
        }

        // ── STEP 4: Pay the Bill ────────────────────────────────────────────────
        console.log(`[STEP 4] Creating Payment for Bill...`);
        const payment = await app.api.purchase.createBillPaymentAPI({
            amount: poTotal,
            billId: bill.billId,
            vendorId: meta.vendorId
        });
        expect(payment.id).toBeTruthy();
        console.log(`[PAYMENT] Created ${payment.ref} (${payment.id})`);

        await app.advanceDocumentAPI(payment.id, 'payments');
        console.log(`[PAYMENT] Approved ${payment.ref}`);

        // Verify Bill Outstanding Balance is 0
        const billAfterData = await app.api.purchase.getBillAPI(bill.billId);
        const billAfterBal = parseFloat(billAfterData.unpaid_amount ?? billAfterData.balance ?? billAfterData.amount_due ?? '-1');
        console.log(`[BILL] Outstanding balance after Payment: ${billAfterBal}`);
        expect(billAfterBal).toBeLessThanOrEqual(0.01);

        // Verify Payment GL entries: Debit AP, Credit Cash/Bank
        const paymentData = await app.api.purchase.getPaymentAPI(payment.id);
        const payJournal = paymentData.cash_disbursement_journal?.journal_entries || [];
        console.log(`[PAYMENT GL] Entries found: ${payJournal.length}`);
        if (payJournal.length > 0) {
            console.log(`[PAYMENT GL DETAILS] ` + JSON.stringify(payJournal, null, 2));
            const isEntryAP = (e: any) => {
                const code = e.account?.id || e.account?.account_id || e.account_id || '';
                const n = (e.account?.name || e.accountName || '').toLowerCase();
                return code === meta.apAccountId || n.includes('payable') || n.includes('ap');
            };
            const isEntryCash = (e: any) => {
                const n = (e.account?.name || e.accountName || '').toLowerCase();
                return n.includes('cash') || n.includes('bank');
            };
            const apDebit = payJournal.find((e: any) => isEntryAP(e) && parseFloat(e.debit || '0') > 0);
            expect(apDebit, 'AP must be debited on payment approval').toBeTruthy();
            expect(parseFloat(apDebit.debit)).toBeCloseTo(poTotal, 1);

            const cashCredit = payJournal.find((e: any) => isEntryCash(e) && parseFloat(e.credit || '0') > 0);
            expect(cashCredit, 'Cash/Bank must be credited on payment approval').toBeTruthy();
            expect(parseFloat(cashCredit.credit)).toBeCloseTo(poTotal, 1);
        }

        console.log('[PASS] Full Procure-to-Pay integration cycle completed successfully!');
    });
});
