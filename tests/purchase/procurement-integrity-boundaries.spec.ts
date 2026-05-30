import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * PROCUREMENT INTEGRITY BOUNDARIES
 *
 * Objectives:
 * 1. Verify system rejects negative or zero-priced line items.
 * 2. Verify system rejects bills with zero or negative quantities.
 * 3. Verify system enforces mandatory GL account selection for standalone bills.
 */

test.describe('Procurement Integrity & Financial Guardrails @purchase @logic @regression', () => {
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

    test('Guardrail: System must reject zero and negative Bill amounts', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[ATTACK] Attempting to create Bill with NEGATIVE unit price (-5000)...`);
        try {
            await app.api.purchase.createBillAPI({ itemData: item, unitPrice: -5000, quantity: 1, vendorId: meta.vendorId });
            throw new Error('[VULNERABILITY] System accepted a Bill with negative unit price! This allows cash extraction.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Negative price blocked: ${err.message}`);
        }

        console.log(`[ATTACK] Attempting to create Bill with ZERO unit price...`);
        try {
            await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 0, quantity: 1, vendorId: meta.vendorId });
            throw new Error('[VULNERABILITY] System accepted a Bill with 0.00 price! This allows ghost inventory injection.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Zero price blocked: ${err.message}`);
        }
    });

    test('Guardrail: System must reject bills with zero or negative quantities', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[ATTACK] Attempting to create Bill with negative quantity (-10)...`);
        try {
            await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: -10, vendorId: meta.vendorId });
            throw new Error('[VULNERABILITY] Backend mutates negative quantity to positive instead of rejecting with 422.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Negative quantity blocked. Error: ${err.message}`);
        }
    });

    /*
    test('Guardrail: System must reject discounts exceeding Bill value', async ({ page }) => {
        // [KNOWN BUG] API allows discounts greater than the total bill amount, causing negative liability.
        test.fail(true, 'Backend allows discount > total (Security Vulnerability)');
        ...
    });
    */

    test('Guardrail: System must enforce mandatory GL account selection for standalone bills', async ({ page }) => {
        const app = new AppManager(page);
        const meta = sharedMeta;
        const item = sharedItem;

        console.log(`[ATTACK] Attempting to create Bill with missing GL Account...`);
        try {
            await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 5000, quantity: 2, vendorId: meta.vendorId, glAccountId: null });
            throw new Error('[VULNERABILITY] System accepted Bill without a GL Account. This breaks accounting ledger sync.');
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Missing GL account correctly blocked.`);
        }
    });
});
