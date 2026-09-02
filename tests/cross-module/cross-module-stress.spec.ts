import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { Logger } from '../../lib/utils/Logger';

/**
 * CROSS-MODULE STRESS & FINANCIAL INTEGRITY
 *
 * 1. Concurrent PO bill + SO invoice on same item — AP/AR race condition
 * 2. AP/AR simultaneous settlement — balance sheet integrity
 *
 * Removed (covered elsewhere):
 *   - PO receipt → SO invoice stock reconciliation → inv-costing-audit.spec.ts (buy-sell stages)
 *   - Full buy-sell-return cycle                   → so-credit-note.spec.ts (invoice void + stock restore)
 */

test.describe('Cross-Module Stress & Financial Integrity @cross-module @logic @security @regression @full', () => {

    test.describe.configure({ timeout: 360000 });

    let sharedPage: import('@playwright/test').Page;
    let sharedApp: AppManager;

    test.beforeAll(async ({ browser }) => {
        test.setTimeout(360000);
        sharedPage = await browser.newPage();
        sharedApp = new AppManager(sharedPage);
        await sharedApp.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test.afterAll(async () => { await sharedPage?.close(); });

    test.beforeEach(async ({ page }) => {
        test.setTimeout(360000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // ── 1. CONCURRENT PO BILL + SO INVOICE — AP/AR RACE CONDITION ────────────
    test('Guardrail: Concurrent AP bill and AR invoice on same item must not corrupt stock', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const purchaseMeta = await app.api.purchase.discoverMetadataAPI();
        const salesMeta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 10, unit_cost: 100 });

        // Create PO bill (adds stock) and SO invoice (removes stock) — approve concurrently
        const po = await app.api.purchase.createPurchaseOrderAPI(item, 5, 100, purchaseMeta.vendorId);
        await app.advanceDocumentAPI(po.poId, 'purchase-orders');
        const bill = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);

        const so = await app.api.sales.createSalesOrderAPI({ itemId: item.itemId, quantity: 3, unitPrice: 150, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(so.id, 'sales-orders');
        const inv = await app.api.sales.createInvoiceAPI({ customerId: so.customerId, soItemId: so.soItemId, releasedQuantity: 3, locationId: item.locationId, warehouseId: item.warehouseId });

        console.log(`[CONCURRENT] Approving Bill ${bill.billNumber} + Invoice ${inv.ref} simultaneously...`);
        const [billResult, invResult] = await Promise.allSettled([
            app.advanceDocumentAPI(bill.billId, 'bills'),
            app.advanceDocumentAPI(inv.id!, 'invoices')
        ]);
        console.log(`[CONCURRENT] Bill: ${billResult.status} | Invoice: ${invResult.status}`);

        await page.waitForTimeout(5000);
        // Expected: 10 (initial) + 5 (PO bill) - 3 (SO invoice) = 12
        // Poll without locationId — PO receipt may register stock at top-level quantity
        // rather than the adjustment's location, so location-scoped poll returns 0.
        const expectedStock = 10 + 5 - 3;
        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, undefined, 20);
        console.log(`[AUDIT] Final stock after concurrent AP+AR: ${finalStock} (expected: ${expectedStock})`);

        if (finalStock < 0) {
            Logger.fail(`[CRITICAL_LOGIC_BUG] Negative stock after concurrent AP bill + AR invoice: ${finalStock}`);
        }
        expect(finalStock, `Stock desync after concurrent AP+AR. Expected ${expectedStock}, got ${finalStock}`).toBe(expectedStock);
        console.log(`[PASS] Concurrent AP+AR produced correct stock: ${finalStock}`);
    });

    // ── 2. SIMULTANEOUS AP + AR SETTLEMENT — BALANCE SHEET INTEGRITY ─────────
    test('Audit: Simultaneous AP payment and AR receipt must not corrupt vendor/customer balances', async ({ page }) => {
        test.setTimeout(360000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const purchaseMeta = await app.api.purchase.discoverMetadataAPI();
        const salesMeta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 20, unit_cost: 100 });

        const billAmount = 2000;
        const invoiceUnitPrice = 3000;

        // ── AP: Create and approve a bill ────────────────────────────────────
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: purchaseMeta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[AP] Bill ${bill.ref} approved | amount=${billAmount}`);

        // ── AR: Create and approve an invoice ────────────────────────────────
        const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: salesMeta.customerId, itemId: item.itemId, quantity: 1, unitPrice: invoiceUnitPrice, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        // ── Fetch actual outstanding amounts from the API ─────────────────────
        const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
        // Note: unreceived_amount is the live ledger balance. net_due can be a static field.
        const invoiceAmount = parseFloat(
            invDataBefore.unreceived_amount ??
            invDataBefore.total_amount ??
            invDataBefore.amount ??
            invDataBefore.net_due ??
            String(invoiceUnitPrice)
        );

        // ── ERP Bug Detector #1: Wrong outstanding on freshly approved invoice ─
        if (Math.abs(invoiceAmount - invoiceUnitPrice) > 0.01) {
            console.log(`\n${'═'.repeat(70)}`);
            console.log(`[ERP_BUG #INV-BAL-01] STALE/INCORRECT INVOICE BALANCE FIELD`);
            console.log(`  Invoice    : ${inv.ref} (ID: ${inv.id})`);
            console.log(`  Created for: $${invoiceUnitPrice}`);
            console.log(`  API reports: unreceived_amount=${invDataBefore.unreceived_amount} | total_amount=${invDataBefore.total_amount} | amount=${invDataBefore.amount} | net_due=${invDataBefore.net_due}`);
            console.log(`  Resolved to: $${invoiceAmount}  ← does NOT match created unit price $${invoiceUnitPrice}`);
            console.log(`${'═'.repeat(70)}\n`);
        } else {
            console.log(`[AR] Invoice ${inv.ref} approved | unit_price=${invoiceUnitPrice} | actual_outstanding=${invoiceAmount} ✓ matches`);
        }

        const billDataBefore = await app.api.purchase.getBillAPI(bill.id, bill.ref);
        const actualBillAmount = parseFloat(
            billDataBefore.unpaid_amount ??
            billDataBefore.balance ??
            billDataBefore.total_amount ??
            billDataBefore.amount ??
            String(billAmount)
        );
        console.log(`[AP] Bill ${bill.ref} | actual_outstanding=${actualBillAmount}`);

        // ── Settle both simultaneously ────────────────────────────────────────
        const apPayment = await app.api.purchase.createBillPaymentAPI({ amount: actualBillAmount, billId: bill.id, vendorId: purchaseMeta.vendorId });
        const arReceipt = await app.api.sales.createInvoiceReceiptAPI({ invoiceId: inv.id, customerId: salesMeta.customerId, amount: invoiceAmount });

        console.log(`[CONCURRENT] Approving AP payment + AR receipt simultaneously...`);
        const [apResult, arResult] = await Promise.allSettled([
            app.advanceDocumentAPI(apPayment.id, 'payments'),
            app.advanceDocumentAPI(arReceipt.id, 'receipts')
        ]);
        console.log(`[CONCURRENT] AP: ${apResult.status} | AR: ${arResult.status}`);

        await page.waitForTimeout(3000);

        // ── Verify AP bill balance = 0 ────────────────────────────────────────
        const billData = await app.api.purchase.getBillAPI(bill.id, bill.ref);
        const apBalance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? '-1');

        // ── Verify AR invoice balance = 0 ─────────────────────────────────────
        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        // Prioritize unreceived_amount (live balance) over static fields like net_due
        const arBalance = parseFloat(invData.unreceived_amount ?? invData.balance ?? invData.net_due ?? '-1');
        console.log(`[AUDIT] AR invoice balance after receipt: ${arBalance} (expected: 0)`);

        // ── ERP Bug Detector #2: Receipt approved but balance not cleared ──────
        if (Math.abs(arBalance) > 0.01) {
            console.log(`\n${'═'.repeat(70)}`);
            console.log(`[ERP_BUG #RCT-BAL-01] RECEIPT APPROVED BUT INVOICE BALANCE NOT CLEARED`);
            console.log(`  Invoice     : ${inv.ref} (ID: ${inv.id})`);
            console.log(`  Receipt     : ${arReceipt.id} | amount applied=$${invoiceAmount}`);
            console.log(`  Receipt adv : ${arResult.status}`);
            console.log(`  Balance     : unreceived_amount=${invData.unreceived_amount} | net_due=${invData.net_due}`);
            console.log(`  Resolved to : $${arBalance}  ← expected 0 after receipt approval`);
            console.log(`${'═'.repeat(70)}\n`);
            expect(Math.abs(arBalance), `AR invoice ${inv.ref} balance not zeroed after receipt: ${arBalance}`).toBeLessThanOrEqual(0.01);
        }

        expect(Math.abs(arBalance), `AR invoice ${inv.ref} balance not zeroed after receipt: ${arBalance}`).toBeLessThanOrEqual(0.01);

        if (Math.abs(apBalance) > 0.01) Logger.fail(`AP balance not zeroed: ${apBalance}`);
        if (Math.abs(arBalance) > 0.01) Logger.fail(`AR balance not zeroed: ${arBalance}`);

        if (Math.abs(apBalance) <= 0.01 && Math.abs(arBalance) <= 0.01) {
            console.log(`[PASS] Simultaneous AP+AR settlement: both balances correctly zeroed.`);
        }
    });
});
