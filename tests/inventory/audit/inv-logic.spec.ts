import { test, expect } from '@playwright/test';
import { AppManager } from '../../../pages/AppManager';

/**
 * LOCATION TRANSFER (MOVE ORDER) AUDITS
 *
 * Uses the dedicated /api/move-orders endpoint — the same backend
 * that powers the UI at /move-orders/location-transfer/new.
 *
 * Test Coverage:
 * 1. Stock atomicity  — source decreases exactly by transfer qty
 * 2. Destination gain — destination receives exactly transfer qty
 * 3. Conservation     — total stock across both locations is unchanged
 * 4. Zero qty guard   — move order with qty=0 must be rejected by API
 * 5. Excess qty guard — move order exceeding available stock must be rejected
 */

test.describe('Location Transfer (Move Order) Audits @inventory @logic @regression @full', () => {
    test.describe.configure({ mode: 'serial' });

    let app: AppManager;
    let item: Awaited<ReturnType<AppManager['captureRandomItemDataAPI']>>;
    let destLocationId: string;
    let destWarehouseId: string;
    let srcStockBefore: number;
    let destStockBefore: number;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 10 });
        if (!item) throw new Error('[SETUP] No item with minStock=10 found.');

        const dest = await app.api.inventory.ensureTransferDestinationAPI(item.locationId!);
        destLocationId  = dest.locationId;
        destWarehouseId = dest.warehouseId;

        // Snapshot stock at both locations before any transfer
        const srcDetails  = await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId);
        const destDetails = await app.api.inventory.getItemDetailsAPI(item.itemId, destLocationId);
        srcStockBefore  = srcDetails?.currentStock  ?? item.currentStock;
        destStockBefore = destDetails?.currentStock ?? 0;

        console.log(`[SETUP] Item: "${item.itemName}" | Src stock: ${srcStockBefore} | Dest stock: ${destStockBefore}`);
        console.log(`[SETUP] Src loc: ${item.locationId} | Dest loc: ${destLocationId}`);
    });

    test('TC-01: Source stock must decrease by exact transfer quantity', async () => {
        const qty = 5;

        await app.api.inventory.createMoveOrderAPI({
            itemId:          item.itemId,
            quantity:        qty,
            fromLocationId:  item.locationId!,
            fromWarehouseId: item.warehouseId!,
            toLocationId:    destLocationId,
            toWarehouseId:   destWarehouseId
        });

        const finalSrc = await app.api.inventory.pollStockAPI(item.itemId, srcStockBefore - qty, item.locationId);
        console.log(`[TC-01] Source: ${srcStockBefore} → ${finalSrc} (expected: ${srcStockBefore - qty})`);
        expect(finalSrc).toBe(srcStockBefore - qty);

        // Update snapshot for next tests
        srcStockBefore = finalSrc;
    });

    test('TC-02: Destination stock must increase by exact transfer quantity', async () => {
        const qty = 5;
        const expectedDest = destStockBefore + qty;

        const destDetails = await app.api.inventory.getItemDetailsAPI(item.itemId, destLocationId);
        const finalDest = destDetails?.currentStock ?? 0;
        console.log(`[TC-02] Dest: ${destStockBefore} → ${finalDest} (expected: ${expectedDest})`);
        expect(finalDest).toBe(expectedDest);

        // Update snapshot for next tests
        destStockBefore = finalDest;
    });

    test('TC-03: Total stock conservation — sum across locations unchanged', async () => {
        const qty = 3;
        const totalBefore = srcStockBefore + destStockBefore;

        await app.api.inventory.createMoveOrderAPI({
            itemId:          item.itemId,
            quantity:        qty,
            fromLocationId:  item.locationId!,
            fromWarehouseId: item.warehouseId!,
            toLocationId:    destLocationId,
            toWarehouseId:   destWarehouseId
        });

        await app.api.inventory.pollStockAPI(item.itemId, srcStockBefore - qty, item.locationId);
        const srcFinal  = (await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId))?.currentStock ?? 0;
        const destFinal = (await app.api.inventory.getItemDetailsAPI(item.itemId, destLocationId))?.currentStock ?? 0;
        const totalAfter = srcFinal + destFinal;

        console.log(`[TC-03] Total before: ${totalBefore} | Total after: ${totalAfter} | Src: ${srcFinal} | Dest: ${destFinal}`);
        expect(totalAfter).toBe(totalBefore);

        srcStockBefore  = srcFinal;
        destStockBefore = destFinal;
    });

    test('TC-04: Move order with quantity=0 must be rejected', async () => {
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await app.page.request.post(`${apiBase}/move-orders?${qs}`, {
            headers,
            data: {
                inventory_item_id:       item.itemId,
                quantity:                0,
                from_warehouse_id:       item.warehouseId,
                from_location_id:        item.locationId,
                destination_warehouse_id: destWarehouseId,
                destination_location_id:  destLocationId
            }
        });
        console.log(`[TC-04] Zero qty response: ${resp.status()}`);
        expect(resp.status()).toBeGreaterThanOrEqual(400);
    });

    test('TC-05: Move order exceeding available stock must be rejected', async () => {
        const excessQty = srcStockBefore + 9999;
        const { apiBase, headers, qs } = await app.buildApiContext();
        const resp = await app.page.request.post(`${apiBase}/move-orders?${qs}`, {
            headers,
            data: {
                inventory_item_id:       item.itemId,
                quantity:                excessQty,
                from_warehouse_id:       item.warehouseId,
                from_location_id:        item.locationId,
                destination_warehouse_id: destWarehouseId,
                destination_location_id:  destLocationId
            }
        });
        const body = await resp.text();
        console.log(`[TC-05] Excess qty (${excessQty}) response: ${resp.status()} | ${body.substring(0, 120)}`);
        expect(resp.status()).toBeGreaterThanOrEqual(400);
    });
});
