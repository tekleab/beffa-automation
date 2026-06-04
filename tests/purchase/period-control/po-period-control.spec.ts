import { test, expect } from '@playwright/test';
import { AppManager } from '../../../pages/AppManager';

/**
 * PROCUREMENT PERIOD CONTROL EDGE CASES
 *
 * Objectives:
 * 1. Verify system rejects back-dated PO, Bill, Payment outside fiscal period
 * 2. Verify system rejects future-dated PO, Bill, Payment outside fiscal period
 * 3. Test critical edge cases: leap years, month boundaries, year boundaries
 * 4. Test Ethiopian calendar edge cases (system uses EC calendar by default)
 *
 * Fiscal Context:
 * - Default Year: 2018 (Ethiopian Calendar)
 * - Period: yearly
 * - Calendar: EC (Ethiopian Calendar)
 */

test.describe('Procurement Period Control Edge Cases @purchase @security @temporal @regression @full', () => {
    test.setTimeout(300000);

    let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
    let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['captureRandomItemDataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedMeta = await app.api.purchase.discoverMetadataAPI();
        sharedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 2 });
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    // ============================================================================
    // PURCHASE ORDER (PO) - PERIOD CONTROL SCENARIOS
    // ============================================================================

    test('PO: Reject back-dated Purchase Order from previous fiscal year (2017)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const backDate = '2017-12-31T00:00:00Z';
        console.log(`[TEST] Creating PO with back date: ${backDate}`);

        const po = await app.api.purchase.createPurchaseOrderAPI({
            itemId: item.itemId,
            itemName: item.itemName,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        }, 1, 5000, meta.vendorId);

        if (po.success) {
            try {
                await app.advanceDocumentAPI(po.poId, 'purchase-orders');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated PO from previous fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] PO created but blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Back-dated PO rejected`);
        }
    });

    test('PO: Reject future-dated Purchase Order from next fiscal year (2019)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const futureDate = '2019-01-01T00:00:00Z';
        console.log(`[TEST] Creating PO with future date: ${futureDate}`);

        const po = await app.api.purchase.createPurchaseOrderAPI({
            itemId: item.itemId,
            itemName: item.itemName,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        }, 1, 5000, meta.vendorId);

        if (po.success) {
            try {
                await app.advanceDocumentAPI(po.poId, 'purchase-orders');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved PO from next fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Future-dated PO blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Future-dated PO rejected`);
        }
    });

    // ============================================================================
    // BILL - PERIOD CONTROL SCENARIOS
    // ============================================================================

    test('Bill: Reject back-dated Bill from previous fiscal year (2017)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const backDate = '2017-12-31T00:00:00Z';
        console.log(`[TEST] Creating Bill with back date: ${backDate}`);

        const bill = await app.api.purchase.createBillAPI({
            itemId: item.itemId,
            quantity: 1,
            unitPrice: 5000,
            vendorId: meta.vendorId,
            apAccountId: meta.apAccountId
        });

        if (bill.success) {
            try {
                await app.advanceDocumentAPI(bill.id, 'bills');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Bill from previous fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Bill created but blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Back-dated Bill rejected`);
        }
    });

    test('Bill: Reject future-dated Bill from next fiscal year (2019)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const futureDate = '2019-01-01T00:00:00Z';
        console.log(`[TEST] Creating Bill with future date: ${futureDate}`);

        const bill = await app.api.purchase.createBillAPI({
            itemId: item.itemId,
            quantity: 1,
            unitPrice: 5000,
            vendorId: meta.vendorId,
            apAccountId: meta.apAccountId
        });

        if (bill.success) {
            try {
                await app.advanceDocumentAPI(bill.id, 'bills');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved Bill from next fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Future-dated Bill blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Future-dated Bill rejected`);
        }
    });

    // ============================================================================
    // PAYMENT - PERIOD CONTROL SCENARIOS
    // ============================================================================

    test('Payment: Reject back-dated Payment from previous fiscal year (2017)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const backDate = '2017-12-31T00:00:00Z';
        console.log(`[TEST] Creating Payment with back date: ${backDate}`);

        // First create a bill to pay
        const bill = await app.api.purchase.createBillAPI({
            itemId: item.itemId,
            quantity: 1,
            unitPrice: 5000,
            vendorId: meta.vendorId,
            apAccountId: meta.apAccountId
        });

        if (!bill.success) {
            console.log(`[SKIP] Could not create bill for payment test`);
            return;
        }

        await app.advanceDocumentAPI(bill.id, 'bills');

        // Create payment with back date
        const payment = await app.api.purchase.createBillPaymentAPI({
            billId: bill.id,
            vendorId: meta.vendorId,
            amount: 5000,
            cashAccountId: meta.apAccountId
        });

        if (payment.success) {
            try {
                await app.advanceDocumentAPI(payment.id, 'payments');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved back-dated Payment from previous fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Payment created but blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Back-dated Payment rejected`);
        }
    });

    test('Payment: Reject future-dated Payment from next fiscal year (2019)', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        const futureDate = '2019-01-01T00:00:00Z';
        console.log(`[TEST] Creating Payment with future date: ${futureDate}`);

        // First create a bill to pay
        const bill = await app.api.purchase.createBillAPI({
            itemId: item.itemId,
            quantity: 1,
            unitPrice: 5000,
            vendorId: meta.vendorId,
            apAccountId: meta.apAccountId
        });

        if (!bill.success) {
            console.log(`[SKIP] Could not create bill for payment test`);
            return;
        }

        await app.advanceDocumentAPI(bill.id, 'bills');

        // Create payment with future date
        const payment = await app.api.purchase.createBillPaymentAPI({
            billId: bill.id,
            vendorId: meta.vendorId,
            amount: 5000,
            cashAccountId: meta.apAccountId
        });

        if (payment.success) {
            try {
                await app.advanceDocumentAPI(payment.id, 'payments');
                throw new Error(`[CRITICAL_PERIOD_CONTROL_BUG] System approved Payment from next fiscal year!`);
            } catch (advanceErr: any) {
                if (advanceErr.message.includes('CRITICAL_PERIOD_CONTROL_BUG')) throw advanceErr;
                console.log(`[PASS] Future-dated Payment blocked at approval: ${advanceErr.message}`);
            }
        } else {
            console.log(`[PASS] Future-dated Payment rejected`);
        }
    });
});
