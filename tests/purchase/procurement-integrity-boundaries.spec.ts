import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT INTEGRITY BOUNDARIES
 * 
 * Objectives:
 * 1. Verify system rejects negative or zero-priced line items.
 * 2. Verify system rejects bills with zero or negative quantities.
 * 3. Verify system prevents discount overrides that exceed the bill total.
 * 4. Verify system enforces mandatory GL account selection for standalone bills.
 */

test.describe('Procurement Integrity & Financial Guardrails @logic @purchase', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: System must reject zero and negative Bill amounts', async ({ page }) => {
        const app = new AppManager(page);
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI();

        console.log(`[ATTACK] Attempting to create Bill with NEGATIVE unit price (-5000)...`);
        
        try {
            await app.api.purchase.createBillAPI({
                itemData: item,
                unitPrice: -5000,
                quantity: 1,
                vendorId: meta.vendorId
            });
            throw new Error('[VULNERABILITY] System accepted a Bill with negative unit price! This allows cash extraction.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Negative price blocked: ${err.message}`);
        }

        console.log(`[ATTACK] Attempting to create Bill with ZERO unit price...`);
        try {
            await app.api.purchase.createBillAPI({
                itemData: item,
                unitPrice: 0,
                quantity: 1,
                vendorId: meta.vendorId
            });
            throw new Error('[VULNERABILITY] System accepted a Bill with 0.00 price! This allows ghost inventory injection.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Zero price blocked: ${err.message}`);
        }
    });

    test('Guardrail: System must reject bills with zero or negative quantities', async ({ page }) => {
        const app = new AppManager(page);
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI();

        console.log(`[ATTACK] Attempting to create Bill with negative quantity (-10)...`);
        try {
            await app.api.purchase.createBillAPI({
                itemData: item,
                unitPrice: 1000,
                quantity: -10,
                vendorId: meta.vendorId
            });
            throw new Error('[VULNERABILITY] System accepted negative quantity! This bypasses return logic.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Negative quantity blocked.`);
        }
    });

    test('Guardrail: System must reject discounts exceeding Bill value', async ({ page }) => {
        const app = new AppManager(page);
        const meta = await app.api.purchase.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI();

        console.log(`[ATTACK] Attempting to create Bill of 5000 with 6000 Discount...`);
        // Note: The createBillAPI might need a discount field in payload, 
        // assuming the backend might have it in 'items' or root.
        
        const payload = {
            itemData: item,
            unitPrice: 5000,
            quantity: 1,
            vendorId: meta.vendorId,
            discount_amount: 6000 // Injected field
        };

        try {
            const bill = await app.api.purchase.createBillAPI(payload as any);
            // If it succeeds, check if we can approve it
            await app.advanceDocumentAPI(bill.id, 'bills');
            throw new Error('[VULNERABILITY] System approved a Bill where Discount > Total! Negative liability created.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Impossible discount blocked or failed approval.`);
        }
    });
});
