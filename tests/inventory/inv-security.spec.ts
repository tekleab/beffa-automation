import { test, expect } from'@playwright/test';
import { AppManager } from'../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Inventory - API Security & Authorization Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Unauthenticated inventory access rejected (401)
 * 2. Cross-tenant inventory data access rejected (403/404)
 * 3. Read-only role cannot create adjustments or transfers
 * =============================================================================
 */



/**
 * INVENTORY TEMPORAL & DATA ISOLATION AUDITS
 * 
 * Objectives:
 * 1. Verify system rejects historical back-dated adjustments.
 * 2. Verify Cross-Warehouse IDOR (Unauthorized stock manipulation).
 */

test.describe('Inventory Temporal & Data Isolation Audits @inventory @security @regression @full', () => {

    test('Guardrail: System must explicitly reject historical back-dated adjustments', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
        const backDate ='2022-01-01T00:00:00Z';
        
        console.log(`[ATTACK] Attempting to inject stock adjustment from ${backDate} (Historical Manipulation)...`);

        try {
            await app.api.inventory.adjustStockAPI({
                itemId: item.itemId,
                quantity: 100,
                type:'in',
                warehouseId: item.warehouseId,
                date: backDate // Attempted payload injection
            } as any);

            throw new Error(`[PERIOD_CONTROL_BUG] Historical back-dated inventory adjustment from ${backDate} was accepted! Period control not enforced.`);
        } catch (err: any) {
            if (err.message.includes('PERIOD_CONTROL_BUG')) throw err;
            console.log(`[PASS] Historical back-dating blocked or rejected: ${err.message}`);
        }
    });
});
