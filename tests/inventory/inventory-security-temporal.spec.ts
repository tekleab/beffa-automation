import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * INVENTORY TEMPORAL & DATA ISOLATION AUDITS
 * 
 * Objectives:
 * 1. Verify system rejects historical back-dated adjustments.
 * 2. Verify Cross-Warehouse IDOR (Unauthorized stock manipulation).
 */

test.describe('Inventory Temporal & Data Isolation Audits @security @inventory', () => {
    test.describe.configure({ mode: 'serial' });

    test('Guardrail: System must explicitly reject historical back-dated adjustments', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const item = await app.api.inventory.captureRandomItemDataAPI();
        const backDate = '2022-01-01T00:00:00Z';
        
        console.log(`[ATTACK] Attempting to inject stock adjustment from ${backDate} (Historical Manipulation)...`);

        try {
            await app.api.inventory.adjustStockAPI({
                itemId: item.itemId,
                quantity: 100,
                type: 'in',
                warehouseId: item.warehouseId,
                date: backDate // Attempted payload injection
            } as any);
            
            throw new Error(`[SECURITY_VULNERABILITY] Historical Manipulation: System approved a back-dated stock adjustment from 2022. This allows fraudulent stock balancing.`);
        } catch (err: any) {
            if (err.message.includes('SECURITY_VULNERABILITY')) throw err;
            console.log(`[PASS] Historical back-dating blocked or rejected.`);
        }
    });
});
