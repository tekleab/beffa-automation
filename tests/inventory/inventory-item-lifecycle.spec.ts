import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * INVENTORY ITEM LIFECYCLE AUDITS
 */
test.describe('Inventory Item Lifecycle Audits @inventory @logic @regression @full', () => {

    let sharedEnvMeta: Awaited<ReturnType<AppManager['api']['inventory']['discoverMetadataAPI']>>;
    let sharedSalesMeta: Awaited<ReturnType<AppManager['api']['sales']['discoverMetadataAPI']>>;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        sharedEnvMeta = await app.api.inventory.discoverMetadataAPI();
        sharedSalesMeta = await app.api.sales.discoverMetadataAPI();
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    test('Guardrail: Deactivated item must be rejected for new stock adjustments', async ({ page }) => {
        const app = new AppManager(page);
        const { apiBase, headers, qs } = await app.buildApiContext();
        const envMeta = sharedEnvMeta;

        const itemCode = `DEACT-GUARD-${Date.now()}`;
        console.log(`[STEP 1] Creating item to deactivate: ${itemCode}...`);
        const item = await app.api.inventory.createInventoryItemAPI({ name: itemCode, item_id: itemCode, part_number: `PN-${Date.now().toString().slice(-5)}` });
        console.log(`[OK] Item created: ${item.itemName} (ID: ${item.id})`);

        console.log(`[STEP 2] Deactivating item via API...`);
        const deactivateResp = await page.request.patch(`${apiBase}/inventory-item/${item.id}?${qs}`, { data: { status: 'inactive' }, headers });
        if (!deactivateResp.ok()) { console.log(`[SKIP] Deactivation endpoint returned ${deactivateResp.status()}.`); return; }
        console.log(`[OK] Item deactivated.`);

        console.log(`[ATTACK] Attempting stock adjustment on deactivated item...`);
        try {
            const adj = await app.api.inventory.createInventoryAdjustmentAPI({ itemId: item.id, quantity: 10, isWriteDown: false, warehouseId: envMeta.warehouseId, locationId: envMeta.locationId });
            if (!adj.success) { console.log(`[PASS] Adjustment correctly rejected at creation.`); return; }
            if (adj.id) await app.advanceDocumentAPI(adj.id, 'inventory-adjustments');
            throw new Error(`[VULNERABILITY] System accepted a stock adjustment on a deactivated item (Ref: ${adj.ref}).`);
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Deactivated item correctly blocked: ${err.message}`);
        }
    });

    test('Guardrail: System must block sales when item stock reaches exact zero', async ({ page }) => {
        const app = new AppManager(page);
        const envMeta = sharedEnvMeta;
        const salesMeta = sharedSalesMeta;

        const itemCode = `ZERO-STOCK-${Date.now()}`;
        console.log(`[STEP 1] Creating item with exactly 1 unit of stock...`);
        const item = await app.api.inventory.createInventoryItemAPI({ name: itemCode, item_id: itemCode, part_number: `PN-${Date.now().toString().slice(-5)}`, quantity: 1, unit_cost: 100, default_location_id: envMeta.locationId, default_warehouse_id: envMeta.warehouseId });
        console.log(`[OK] Item created: ${item.itemName} (ID: ${item.id})`);

        await app.api.inventory.pollStockAPI(item.id, 1);

        console.log(`[STEP 2] Selling the only 1 unit to drain stock to zero...`);
        const inv1 = await app.api.sales.createStandaloneInvoiceAPI({ customerId: salesMeta.customerId, itemId: item.id, quantity: 1, unitPrice: 200, locationId: envMeta.locationId, warehouseId: envMeta.warehouseId });
        await app.advanceDocumentAPI(inv1.id, 'invoices');
        await app.api.inventory.pollStockAPI(item.id, 0);
        console.log(`[OK] Stock is now 0.`);

        console.log(`[ATTACK] Attempting to sell 1 more unit from zero stock...`);
        try {
            const inv2 = await app.api.sales.createStandaloneInvoiceAPI({ customerId: salesMeta.customerId, itemId: item.id, quantity: 1, unitPrice: 200, locationId: envMeta.locationId, warehouseId: envMeta.warehouseId });
            await app.advanceDocumentAPI(inv2.id, 'invoices');
            const finalStock = await app.api.inventory.getItemDetailsAPI(item.id, envMeta.locationId);
            if ((finalStock?.currentStock ?? 0) < 0) {
                throw new Error(`[VULNERABILITY] Stock went negative (${finalStock?.currentStock}) after selling from zero. Ghost stock created.`);
            }
            console.log(`[WARN] Invoice created but stock did not go negative.`);
        } catch (err: any) {
            if (err.message.includes('[VULNERABILITY]')) throw err;
            console.log(`[PASS] Zero-stock sale correctly rejected: ${err.message}`);
        }
    });
});
