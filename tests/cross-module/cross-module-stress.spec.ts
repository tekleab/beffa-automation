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
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // ── 1. CONCURRENT PO BILL + SO INVOICE — AP/AR RACE CONDITION ────────────
    test('Guardrail: Concurrent AP bill and AR invoice on same item must not corrupt stock', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const purchaseMeta = await app.api.purchase.discoverMetadataAPI();
        const salesMeta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 10, unit_cost: 100 });

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
        const expectedStock = 10 + 5 - 3;
        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId, 20);
        console.log(`[AUDIT] Final stock after concurrent AP+AR: ${finalStock} (expected: ${expectedStock})`);

        if (finalStock < 0) {
            Logger.fail(`[CRITICAL_LOGIC_BUG] Negative stock after concurrent AP bill + AR invoice: ${finalStock}`);
        }
        expect.soft(finalStock, `[CRITICAL_LOGIC_BUG] Stock desync after concurrent AP+AR. Expected ${expectedStock}, got ${finalStock}`).toBe(expectedStock);
        if (finalStock !== expectedStock) {
            console.log(`[KNOWN_BUG] AP/AR concurrent race: expected ${expectedStock}, got ${finalStock}`);
        } else {
            console.log(`[PASS] Concurrent AP+AR produced correct stock: ${finalStock}`);
        }
    });

    // ── 2. SIMULTANEOUS AP + AR SETTLEMENT — BALANCE SHEET INTEGRITY ─────────
    test('Audit: Simultaneous AP payment and AR receipt must not corrupt vendor/customer balances', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const purchaseMeta = await app.api.purchase.discoverMetadataAPI();
        const salesMeta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });

        const billAmount = 2000;
        const invoiceAmount = 3000;

        // Create and approve a bill (AP)
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: billAmount, quantity: 1, vendorId: purchaseMeta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[AP] Bill ${bill.ref} approved | amount=${billAmount}`);

        // Create and approve an invoice (AR)
        const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: salesMeta.customerId, itemId: item.itemId, quantity: 1, unitPrice: invoiceAmount, locationId: item.locationId, warehouseId: item.warehouseId });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        console.log(`[AR] Invoice ${inv.ref} approved | amount=${invoiceAmount}`);

        // Settle both simultaneously
        const apPayment = await app.api.purchase.createBillPaymentAPI({ amount: billAmount, billId: bill.id, vendorId: purchaseMeta.vendorId });
        const arReceipt = await app.api.sales.createInvoiceReceiptAPI({ invoiceId: inv.id, customerId: salesMeta.customerId, amount: invoiceAmount });

        console.log(`[CONCURRENT] Approving AP payment + AR receipt simultaneously...`);
        const [apResult, arResult] = await Promise.allSettled([
            app.advanceDocumentAPI(apPayment.id, 'payments'),
            app.advanceDocumentAPI(arReceipt.id, 'receipts')
        ]);
        console.log(`[CONCURRENT] AP: ${apResult.status} | AR: ${arResult.status}`);

        await page.waitForTimeout(3000);

        // Verify AP bill balance = 0
        const billData = await app.api.purchase.getBillAPI(bill.id);
        const apBalance = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.amount_due ?? '-1');
        console.log(`[AUDIT] AP bill balance after payment: ${apBalance} (expected: 0)`);
        expect.soft(Math.abs(apBalance), `[CRITICAL_LOGIC_BUG] AP bill ${bill.ref} balance not zeroed after payment: ${apBalance}`).toBeLessThanOrEqual(0.01);

        // Verify AR invoice balance = 0
        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        const arBalance = parseFloat(invData.net_due ?? invData.unreceived_amount ?? invData.amount_due ?? '-1');
        console.log(`[AUDIT] AR invoice balance after receipt: ${arBalance} (expected: 0)`);
        expect.soft(Math.abs(arBalance), `[CRITICAL_LOGIC_BUG] AR invoice ${inv.ref} balance not zeroed after receipt: ${arBalance}`).toBeLessThanOrEqual(0.01);

        if (Math.abs(apBalance) > 0.01) Logger.fail(`AP balance not zeroed: ${apBalance}`);
        if (Math.abs(arBalance) > 0.01) Logger.fail(`AR balance not zeroed: ${arBalance}`);

        if (Math.abs(apBalance) <= 0.01 && Math.abs(arBalance) <= 0.01) {
            console.log(`[PASS] Simultaneous AP+AR settlement: both balances correctly zeroed.`);
        }
    });
});
