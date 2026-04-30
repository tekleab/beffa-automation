import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * INVENTORY CONCURRENCY & RACE CONDITIONS
 * 
 * Objectives:
 * 1. Verify simultaneous stock adjustments don't result in lost updates.
 * 2. Verify thread-safe locking on the item stock row.
 */

test.describe('Inventory Concurrency & Race Condition Audits @security @inventory', () => {
    test.describe.configure({ mode: 'serial' });

    test('Guardrail: System must handle concurrent stock adjustments atomically', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const item = await app.api.inventory.captureRandomItemDataAPI();
        const initialStock = item.currentStock;
        const adjustment = 10;
        const expectedStock = initialStock + (adjustment * 2);

        console.log(`[ATTACK] Triggering 2 CONCURRENT adjustments (+10 each) for ${item.itemName}...`);
        
        // Fire both at once
        const [res1, res2] = await Promise.allSettled([
            app.api.inventory.adjustStockAPI({ itemId: item.itemId, quantity: adjustment, type: 'in', warehouseId: item.warehouseId }),
            app.api.inventory.adjustStockAPI({ itemId: item.itemId, quantity: adjustment, type: 'in', warehouseId: item.warehouseId })
        ]);

        console.log(`[ACTION] Verifying Final Stock Integrity...`);
        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.warehouseId);
        
        console.log(`[SNAPSHOT] Start: ${initialStock} | Final: ${finalStock} | Expected: ${expectedStock}`);

        if (finalStock !== expectedStock) {
            throw new Error(`[CRITICAL_LOGIC_BUG] Stock Race Condition: Concurrent adjustments caused lost updates. Expected ${expectedStock}, found ${finalStock}.`);
        }

        expect(finalStock).toBe(expectedStock);
        console.log(`[PASS] Inventory Concurrency verified. No lost updates detected.`);
    });
});
