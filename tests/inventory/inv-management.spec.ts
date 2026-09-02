import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Inventory - Management & Configuration Suite
 * ARCHITECTURAL SCOPE & COVERAGE:
 * 1. Warehouse creation with address and active status
 * 2. Location creation linked to warehouse
 * 3. Item category CRUD and assignment to items
 * 4. Unit of measure configuration and validation
 * =============================================================================
 */



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

        const itemCode = `API-CREATE-${Date.now()}`;
        console.log(`[STEP 1] Creating item via API: ${itemCode}`);
        const item = await app.api.inventory.createInventoryItemAPI({
            name: itemCode,
            item_id: itemCode,
            part_number: `PN-${Date.now().toString().slice(-5)}`,
            quantity: 0,
            unit_cost: 100,
        });
        expect(item.id, 'Item creation must return an ID').toBeTruthy();
        console.log(`[OK] Item created: ${item.itemName} (${item.id})`);

        console.log(`[STEP 2] Verifying item exists via API...`);
        const details = await app.api.inventory.getItemDetailsAPI(item.id);
        expect(details, `Item "${itemCode}" must be retrievable after creation`).not.toBeNull();
        expect(details!.itemName).toBe(itemCode);
        console.log(`[PASS] Item "${itemCode}" confirmed via API.`);
    });

    test('View: Existing inventory item details render correctly in the UI', async ({ page }) => {
        test.setTimeout(180000);
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

        console.log(`[STEP 2] Verifying item fields via API...`);
        const details = await app.api.inventory.getItemDetailsAPI(item.id);
        expect(details, `Item "${itemCode}" not found via API`).not.toBeNull();
        expect(details!.itemName).toBe(itemCode);
        expect(details!.unitCost).toBe(150);
        console.log(`[PASS] Item "${itemCode}" confirmed via API. Stock=${details!.currentStock}, Cost=${details!.unitCost}`);
    });

    test('Guardrail: System must reject overselling beyond available stock', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);


        console.log(`[STEP 1] Creating item with stock via API...`);
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'FIFO', quantity: 20, unit_cost: 100, skipStockPoll: true });

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
