import { test, expect } from'@playwright/test';
import { AppManager } from'../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Inventory - Concurrent Adjustment & Race Condition Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Simultaneous adjustments on same item do not corrupt stock levels
 * 2. Stock balance remains accurate under concurrent reads/writes
 * =============================================================================
 */



/**
 * INVENTORY CONCURRENCY & RACE CONDITIONS
 * 
 * Objectives:
 * 1. Verify simultaneous stock adjustments don't result in lost updates.
 * 2. Verify thread-safe locking on the item stock row.
 */

test.describe('Inventory Concurrency & Race Condition Audits @inventory @full', () => {

    test('Guardrail: System must handle concurrent stock adjustments atomically', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 20, unit_cost: 100 });
        const initialStock = item.currentStock;
        const adjustment = 10;
        const expectedStock = initialStock + (adjustment * 2);

        console.log(`[ATTACK] Triggering 2 CONCURRENT adjustments (+10 each) for ${item.itemName}...`);
        
        // Fire both at once - use both locationId and warehouseId to ensure item exists in the location
        const [res1, res2] = await Promise.allSettled([
            app.api.inventory.adjustStockAPI({ itemId: item.itemId, quantity: adjustment, type:'in', locationId: item.locationId, warehouseId: item.warehouseId }),
            app.api.inventory.adjustStockAPI({ itemId: item.itemId, quantity: adjustment, type:'in', locationId: item.locationId, warehouseId: item.warehouseId })
        ]);

        // Log adjustment IDs for manual tracking
        const adj1Id = res1.status === 'fulfilled' && res1.value.success ? res1.value.id : 'FAILED';
        const adj2Id = res2.status === 'fulfilled' && res2.value.success ? res2.value.id : 'FAILED';
        console.log(`[INFO] Adjustment 1 ID: ${adj1Id} | Adjustment 2 ID: ${adj2Id}`);

        // Advance both adjustments to approved status
        if (adj1Id !== 'FAILED') {
            await app.advanceDocumentAPI(adj1Id, 'inventory-adjustments');
            console.log(`[SUCCESS] Advanced Adjustment 1 to approved: ${adj1Id}`);
        }
        if (adj2Id !== 'FAILED') {
            await app.advanceDocumentAPI(adj2Id, 'inventory-adjustments');
            console.log(`[SUCCESS] Advanced Adjustment 2 to approved: ${adj2Id}`);
        }

        console.log(`[ACTION] Verifying Final Stock Integrity...`);
        const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId, 4);
        
        console.log(`[SNAPSHOT] Start: ${initialStock} | Final: ${finalStock} | Expected: ${expectedStock}`);

        expect(finalStock, `Concurrent adjustments caused lost updates: expected ${expectedStock}, got ${finalStock}`).toBe(expectedStock);
        console.log(`[PASS] Inventory Concurrency verified. No lost updates detected.`);
    });
});
