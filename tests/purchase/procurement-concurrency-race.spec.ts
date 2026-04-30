import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT CONCURRENCY & RACE CONDITIONS
 * 
 * Objectives:
 * 1. Verify system handles concurrent duplicate Bill payments atomically.
 * 2. Verify system enforces thread-safe serialization for stock additions (Inventory Increase).
 */

test.describe('Procurement Concurrency & Race Condition Audits @security @concurrency @purchase', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: System must handle concurrent duplicate Bill payments atomically', async ({ page }) => {
        const app = new AppManager(page);
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI();

        // 1. Create a Bill for 1000
        console.log(`[STEP 1] Creating target Bill for 1000...`);
        const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: 1, vendorId: meta.vendorId });
        await app.advanceDocumentAPI(bill.id, 'bills');

        // 2. TRIGGER RACE: Send 2 payments for 1000 at the EXACT same time
        console.log(`[ATTACK] Triggering Concurrent Payment Race...`);
        
        const pay1 = app.api.purchase.createBillPaymentAPI({ amount: 1000, billId: bill.id, vendorId: meta.vendorId });
        const pay2 = app.api.purchase.createBillPaymentAPI({ amount: 1000, billId: bill.id, vendorId: meta.vendorId });

        const results = await Promise.allSettled([pay1, pay2]);
        
        const successes = results.filter(r => r.status === 'fulfilled');
        console.log(`[SNAPSHOT] Concurrent Results: ${successes.length} / 2 requests fulfilled.`);

        if (successes.length > 1) {
            console.warn(`[VULNERABILITY] Both payment requests accepted! Checking if both can be APPROVED...`);
            
            const ids = successes.map((s: any) => s.value.id);
            const approvals = ids.map(id => app.advanceDocumentAPI(id, 'payments'));
            
            const finalApprovals = await Promise.allSettled(approvals);
            const fullyApproved = finalApprovals.filter(a => a.status === 'fulfilled');
            
            if (fullyApproved.length > 1) {
                throw new Error(`[CRITICAL_LOGIC_BUG] Concurrency Failure: System approved 2 full payments for a single Bill! Cash leak detected.`);
            }
        }
        
        console.log(`[PASS] Integrity Guardrail: System blocked or rejected the duplicate payment race.`);
    });

    test('Guardrail: System must enforce thread-safe serialization for stock additions', async ({ page }) => {
        const app = new AppManager(page);
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI();

        console.log(`[STEP 1] Capturing Baseline for "${item.itemName}"...`);
        const startStock = await app.api.inventory.pollStockAPI(item.itemId, item.locationId);
        
        // 2. Create 2 Bills for 5 units each
        const bill1 = await app.api.purchase.createBillAPI({ itemData: item, quantity: 5, vendorId: meta.vendorId });
        const bill2 = await app.api.purchase.createBillAPI({ itemData: item, quantity: 5, vendorId: meta.vendorId });

        // 3. TRIGGER RACE: Approve both at the same time
        console.log(`[ATTACK] Triggering Concurrent Stock Increase (Approval Race)...`);
        
        await Promise.all([
            app.advanceDocumentAPI(bill1.id, 'bills'),
            app.advanceDocumentAPI(bill2.id, 'bills')
        ]);

        // 4. Verify Final Stock: Must be exactly Start + 10
        console.log(`[AUDIT] Verifying Stock Integrity...`);
        await page.waitForTimeout(5000); // Wait for stock engine
        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, item.locationId);
        
        const expectedStock = startStock + 10;
        console.log(`[SNAPSHOT] Start: ${startStock} | Expected: ${expectedStock} | Final: ${finalStock}`);

        if (finalStock !== expectedStock) {
            throw new Error(`[CRITICAL_LOGIC_BUG] Stock Desync: Concurrent approvals caused lost updates. Expected ${expectedStock}, found ${finalStock}.`);
        }

        expect(finalStock).toBe(expectedStock);
        console.log(`[PASS] Stock Addition is atomic and thread-safe.`);
    });
});
