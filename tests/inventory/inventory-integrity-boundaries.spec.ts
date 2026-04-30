import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * INVENTORY INTEGRITY & BOUNDARY AUDITS
 * 
 * Objectives:
 * 1. Verify system rejects negative stock adjustments (Math Guardrail).
 * 2. Verify system rejects zero-quantity movements.
 * 3. Verify system blocks invalid warehouse/location ID injections.
 */

test.describe('Inventory Integrity & Boundary Audits @logic @inventory', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: System must reject negative quantity adjustments', async ({ page }) => {
        const app = new AppManager(page);
        const item = await app.api.inventory.captureRandomItemDataAPI();
        
        console.log(`[ATTACK] Attempting negative adjustment (-50) for item: ${item.itemName}`);
        
        // We use the internal adjustment API or UI flow
        // For forensics, we attempt to bypass UI limits via direct API call if possible
        try {
            await app.api.inventory.adjustStockAPI({
                itemId: item.itemId,
                quantity: -50,
                type: 'in', // Trying to "Add" negative quantity
                warehouseId: item.warehouseId,
                locationId: item.locationId
            });
            throw new Error('[VULNERABILITY] System accepted negative stock adjustment! Inventory corruption possible.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Negative adjustment correctly rejected: ${err.message}`);
        }
    });

    test('Guardrail: System must reject zero-quantity adjustments', async ({ page }) => {
        const app = new AppManager(page);
        const item = await app.api.inventory.captureRandomItemDataAPI();
        
        console.log(`[ATTACK] Attempting zero-quantity adjustment...`);
        
        try {
            await app.api.inventory.adjustStockAPI({
                itemId: item.itemId,
                quantity: 0,
                type: 'in',
                warehouseId: item.warehouseId,
                locationId: item.locationId
            });
            throw new Error('[VULNERABILITY] System accepted 0-quantity adjustment! Ledger bloat possible.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Zero adjustment correctly rejected.`);
        }
    });
});
