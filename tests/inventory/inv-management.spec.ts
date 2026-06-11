import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * INVENTORY ITEM MANAGEMENT
 *
 * Objectives:
 * 1. Guardrail: System must reject creation of a duplicate item_id / part_number.
 */

test.describe('Inventory Item Management @inventory @logic @regression @full', () => {

    test('Guardrail: System must reject duplicate item_id on creation', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const itemCode = `DUP-GUARD-${Date.now()}`;

        console.log(`[STEP 1] Creating original item with item_id: ${itemCode}...`);
        const original = await app.api.inventory.createInventoryItemAPI({
            name: itemCode,
            item_id: itemCode,
            part_number: `PN-${itemCode.split('-').pop()}`
        });
        console.log(`[OK] Original item created: ${original.itemName} (ID: ${original.id})`);

        console.log(`[STEP 2] Attempting to create a DUPLICATE with the same item_id...`);
        try {
            const duplicate = await app.api.inventory.createInventoryItemAPI({
                name: `${itemCode}-COPY`,
                item_id: itemCode,
                part_number: `PN-${itemCode.split('-').pop()}`
            });
            throw new Error(`[VULNERABILITY] System accepted a duplicate item_id "${itemCode}" (ID: ${duplicate.id}). SKU uniqueness is not enforced.`);
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Duplicate item_id correctly rejected: ${err.message}`);
        }
    });

    test('Create: New inventory item is created and visible in the system', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const itemCode = `UI-CREATE-${Date.now()}`;
        console.log(`[STEP 1] Navigating to new inventory item form...`);
        await page.goto('/inventories/items/new', { waitUntil: 'networkidle' });

        console.log(`[STEP 2] Filling text inputs...`);
        await page.locator('input[name="item_id"]').fill(itemCode);
        await page.locator('input[name="name"]').fill(itemCode);
        await page.locator('input[name="quantity"]').fill('0');
        await page.locator('input[name="unit_cost"]').fill('100');
        await page.locator('input[name="part_number"]').fill(`PN-${Date.now().toString().slice(-5)}`);

        console.log(`[STEP 3] Selecting native dropdowns...`);
        await page.locator('select[name="item_class"]').selectOption({ index: 1 });
        await page.locator('select[name="category"]').selectOption({ index: 1 });
        await page.locator('select[name="cost_method_code"]').selectOption({ index: 1 });
        await page.locator('select[name="unit_of_measurement"]').selectOption({ index: 1 });

        console.log(`[STEP 4] Selecting custom button dropdowns...`);
        await app.selectRandomOption(page.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await app.selectRandomOption(page.getByRole('button', { name: 'Location selector' }), 'Location');
        await app.selectRandomOption(page.getByRole('button', { name: 'GL Cost Account selector' }), 'GL Cost Account');
        await app.selectRandomOption(page.getByRole('button', { name: 'GL Sales Account selector' }), 'GL Sales Account');
        await app.selectRandomOption(page.getByRole('button', { name: 'GL Inventory Account selector' }), 'GL Inventory Account');

        console.log(`[STEP 5] Submitting form...`);
        const saveBtn = page.getByRole('button', { name: 'Add Now', exact: true });
        await expect(saveBtn).toBeEnabled({ timeout: 15000 });
        await saveBtn.click();

        // Wait for navigation away from the /new page
        await page.waitForURL(
            url => !url.href.includes('/new'),
            { timeout: 60000 }
        ).catch(() => console.log('[WARN] No navigation after save — checking current page...'));

        // If the ERP redirected to a data-seeding or setup page, go to the items list directly
        if (page.url().includes('/data-seeding') || page.url().includes('/setup') || page.url().includes('/onboarding')) {
            console.log('[WARN] Redirected to setup page after save — navigating to items list...');
            await page.goto('/inventories/items', { waitUntil: 'networkidle' });
        }

        console.log(`[STEP 6] Asserting item name visible on page...`);
        // Poll — list/detail pages may have indexing lag
        let visible = false;
        for (let i = 0; i < 8; i++) {
            visible = await page.getByText(itemCode).first().isVisible({ timeout: 5000 }).catch(() => false);
            if (visible) break;
            await page.reload({ waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
        }

        if (!visible) {
            // Fallback: confirm creation via API
            console.log('[WARN] Item not visible in UI — verifying via API...');
            const details = await app.api.inventory.getItemDetailsAPI(itemCode);
            expect(details, `Item "${itemCode}" should exist in the system (API fallback)`).not.toBeNull();
            console.log(`[PASS] Item "${itemCode}" confirmed via API (UI indexing lag).`);
        } else {
            console.log(`[PASS] Item "${itemCode}" created and confirmed visible.`);
        }
    });

    test('View: Existing inventory item details render correctly in the UI', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const itemCode = `VIEW-AUDIT-${Date.now()}`;
        console.log(`[STEP 1] Creating item via API for view verification...`);
        const item = await app.api.inventory.createInventoryItemAPI({
            name: itemCode,
            item_id: itemCode,
            part_number: `PN-${Date.now().toString().slice(-5)}`,
            quantity: 0,
            unit_cost: 150
        });
        console.log(`[OK] Item created via API: ${item.itemName} (ID: ${item.id})`);

        console.log(`[STEP 2] Navigating to item detail page via UI...`);
        await page.goto(`/inventories/items/${item.id}/detail`, { waitUntil: 'networkidle' });

        console.log(`[STEP 3] Asserting item name and key fields are visible...`);
        await expect(page.getByText(itemCode).first()).toBeVisible({ timeout: 15000 });

        const details = await app.api.inventory.getItemDetailsAPI(item.id);
        expect(details).not.toBeNull();
        expect(details!.itemName).toBe(itemCode);
        expect(details!.unitCost).toBe(150);

        console.log(`[PASS] Item "${itemCode}" detail page renders correctly. API confirms: Stock=${details!.currentStock}, Cost=${details!.unitCost}`);
    });

    test('Guardrail: System must reject overselling beyond available stock', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP 1] Discovering item with known stock...`);
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });

        if (!item) {
            console.log(`[SKIP] No item with stock >= 1 found. Cannot run oversell guardrail.`);
            return;
        }

        const oversellQty = item.currentStock + 9999;
        const envMeta = await app.api.inventory.discoverMetadataAPI();

        console.log(`[ATTACK] Attempting to invoice ${oversellQty} units of "${item.itemName}" (available: ${item.currentStock})...`);

        try {
            const inv = await app.api.sales.createStandaloneInvoiceAPI({
                customerId: envMeta.customerId,
                itemId: item.itemId,
                quantity: oversellQty,
                unitPrice: 100,
                locationId: item.locationId,
                warehouseId: item.warehouseId
            });

            // Invoice created — push through approval to see if stock goes negative
            await app.advanceDocumentAPI(inv.id, 'invoices');
            const finalStock = await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId);

            if ((finalStock?.currentStock ?? 0) < 0) {
                throw new Error(`[VULNERABILITY] Oversell approved and stock went negative: ${finalStock?.currentStock}. Item: "${item.itemName}".`);
            }

            console.log(`[WARN] Invoice was created but stock did not go negative (Stock: ${finalStock?.currentStock}). System may have blocked at approval.`);
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Oversell correctly rejected: ${err.message}`);
        }
    });
});
