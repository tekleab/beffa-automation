import { test, expect } from'@playwright/test';
import { AppManager } from'../../pages/AppManager';

/**
 * INVENTORY INTEGRITY & BOUNDARY AUDITS
 * 
 * Objectives:
 * 1. Audit: negative stock adjustments are processed with correct stock & GL financial impact.
 * 2. Guardrail: system must reject zero-quantity movements.
 */

test.describe('Inventory Integrity & Boundary Audits @inventory @logic @regression', () => {

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: System must reject negative stock adjustments', async ({ page }) => {
        const app = new AppManager(page);
        // Pick an item with at least 51 units so -50 will always be physically possible
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 51 });

        if (!item) {
            throw new Error('[FAIL] No item found with stock >= 51. Cannot perform this guardrail test.');
        }

        const stockBefore = item.currentStock;
        console.log(`[ATTACK] Attempting negative adjustment (-50) for item: ${item.itemName} (Stock Before: ${stockBefore})`);

        try {
            const adj = await app.api.inventory.adjustStockAPI({
                itemId:      item.itemId,
                quantity:    -50,
                type:'in',
                warehouseId: item.warehouseId,
                locationId:  item.locationId
            });

            // If the API correctly rejected it at creation, the guardrail worked!
            if (!adj.success) {
                console.log(`[PASS] Negative adjustment correctly rejected at creation.`);
                return;
            }

            // System allowed it — push through the full approval cycle
            if (adj.id) {
                await app.advanceDocumentAPI(adj.id,'inventory-adjustments');
            }

            throw new Error(`[CRITICAL_LOGIC_BUG] System accepted and fully approved negative stock adjustment (Ref: ${adj.ref} | ID: ${adj.id})! Inventory can go negative.`);
        } catch (err: any) {
            if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
            console.log(`[PASS] Negative adjustment correctly rejected: ${err.message}`);
        }
    });

    test('Guardrail: System must reject zero-quantity adjustments', async ({ page }) => {
        const app = new AppManager(page);
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });

        console.log(`[ATTACK] Attempting zero-quantity adjustment for item: ${item.itemName}`);

        try {
            const adj = await app.api.inventory.adjustStockAPI({
                itemId:      item.itemId,
                quantity:    0,
                type:'in',
                warehouseId: item.warehouseId,
                locationId:  item.locationId
            });

            // If the API correctly rejected it at creation, the guardrail worked!
            if (!adj.success) {
                console.log(`[PASS] Zero adjustment correctly rejected at creation.`);
                return;
            }

            // --- VULNERABILITY CONFIRMED: System created the adjustment ---
            console.log(`[VULNERABILITY] Zero-qty Adjustment was CREATED: Ref=${adj.ref} | ID=${adj.id}`);

            // Push all the way through the full approval cycle
            if (adj.id) {
                await app.advanceDocumentAPI(adj.id,'inventory-adjustments');
                console.log(`[VULNERABILITY] Zero-qty Adjustment was FULLY APPROVED: Ref=${adj.ref} | ID=${adj.id}`);
            }
            throw new Error(`[VULNERABILITY] System accepted and fully approved 0-quantity adjustment (Ref: ${adj.ref} | ID: ${adj.id})! Ledger bloat possible.`);
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Zero adjustment correctly rejected.`);
        }
    });
});
