import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT CONCURRENCY & RACE CONDITIONS
 *
 * Objectives:
 * 1. Verify system handles concurrent duplicate Bill payments atomically.
 * 2. Verify system enforces thread-safe serialization for stock additions.
 */

test.describe('Procurement Concurrency & Race Condition Audits @purchase @concurrency @security @regression @full', () => {
    test.describe.configure({ mode: 'serial' });

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

    test('Guardrail: System must handle concurrent duplicate Bill payments atomically', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Creating target Bill for 1000...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');

        console.log(`[ATTACK] Triggering Concurrent Payment Race...`);
        const pay1 = app.api.purchase.createBillPaymentAPI({ amount: 1000, billId: bill.id, vendorId: meta.vendorId });
        const pay2 = app.api.purchase.createBillPaymentAPI({ amount: 1000, billId: bill.id, vendorId: meta.vendorId });

        const results = await Promise.allSettled([pay1, pay2]);
        const successes = results.filter(r => r.status === 'fulfilled');
        console.log(`[SNAPSHOT] Concurrent Results: ${successes.length} / 2 requests fulfilled.`);

        if (successes.length > 1) {
            console.warn(`[VULNERABILITY] Both payment requests accepted! Checking if both can be APPROVED...`);

            const ids = successes.map((s: any) => s.value.id);
            const finalApprovals = await Promise.allSettled(ids.map(id => app.advanceDocumentAPI(id, 'payments')));
            const fullyApproved = finalApprovals.filter(a => a.status === 'fulfilled');

            if (fullyApproved.length > 1) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Concurrency Failure: System approved 2 full payments for a single Bill! Cash leak detected.`);
            }
        }

        console.log(`[PASS] Integrity Guardrail: System blocked or rejected the duplicate payment race.`);
    });

    test('Guardrail: System must enforce thread-safe serialization for stock additions', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[STEP 1] Capturing Baseline for "${item.itemName}"...`);
        const startStock = item.currentStock;

        const bill1 = await app.api.purchase.createBillAPI({ itemData: item, quantity: 5, vendorId: meta.vendorId });
        const bill2 = await app.api.purchase.createBillAPI({ itemData: item, quantity: 5, vendorId: meta.vendorId });

        console.log(`[ATTACK] Triggering Concurrent Stock Increase (Approval Race)...`);
        await Promise.all([
            app.advanceDocumentAPI(bill1.id, 'bills'),
            app.advanceDocumentAPI(bill2.id, 'bills')
        ]);

        console.log(`[AUDIT] Verifying Stock Integrity...`);
        const expectedStock = startStock + 10;
        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId);

        console.log(`[SNAPSHOT] Start: ${startStock} | Expected: ${expectedStock} | Final: ${finalStock}`);

        if (finalStock !== expectedStock) {
            throw new Error(`[CRITICAL_LOGIC_BUG] Stock Desync: Concurrent approvals caused lost updates. Expected ${expectedStock}, found ${finalStock}.`);
        }

        expect(finalStock).toBe(expectedStock);
        console.log(`[PASS] Stock Addition is atomic and thread-safe.`);
    });
});
