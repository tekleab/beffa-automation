import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe.serial('Invoice Reversal Flow @regression', () => {
    let invID: string | null = null;
    let invUUID: string | null = null;
    let initialInfo: Awaited<ReturnType<AppManager['captureRandomItemDataAPI']>> | null = null;

    test('Stage 1: Setup via API (SO & Invoice), verify stock deduction @smoke', async ({ page }) => {
        test.setTimeout(600000);
        const app = new AppManager(page);

        console.log('[STEP] Stage 1: Login & Setup');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // 1. Pick a random item with stock via API (with Retry & Auto-Seeding)
        let soData;
        for (let attempt = 0; attempt < 5; attempt++) {
            initialInfo = await app.captureRandomItemDataAPI({ minStock: 1 });
            
            if (!initialInfo) {
                console.log(`[ACTION] Discovery Attempt ${attempt + 1}: No items with stock found. Retrying...`);
                await page.waitForTimeout(2000);
                continue;
            }

            console.log(`[ACTION] Discovery Attempt ${attempt + 1}: Testing "${initialInfo.itemName}" (Stock: ${initialInfo.currentStock})`);
            
            soData = await app.createSalesOrderAPI({ 
                itemId: initialInfo.itemId, 
                quantity: 1,
                locationId: initialInfo.locationId,
                warehouseId: initialInfo.warehouseId
            });
            if (soData.success) break;
            
            if (soData.status === 422 && (soData.error?.toLowerCase().includes('insufficient stock') || soData.error?.toLowerCase().includes('quantity'))) {
                console.log(`[WARN] "${initialInfo.itemName}" failed availability check. Retrying discovery...`);
                continue;
            }
            throw new Error(`SO API Creation Failed: ${soData.status} - ${soData.error}`);
        }

        // --- SELF-HEALING FALLBACK: If discovery failed, create fresh stock via Purchase API ---
        if (!soData || !soData.success) {
            console.log('[ACTION] 🔧 Inventory Seeding Triggered: Warehouse appears empty. Buying stock via API...');
            const meta = await app.api.purchase.discoverMetadataAPI();
            
            // Re-discover any item (even if 0 stock) to buy, and capture its specific location
            const seedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
            
            // Buy 50 units into the SEED ITEM'S specific location
            const purchase = await app.createBillAPI({
                itemData: seedItem,
                quantity: 50,
                unitPrice: 1000
            }); 
            
            // Advance to Approved to increase physical stock
            await app.advanceDocumentAPI(purchase.id, 'bills');
            console.log(`[SUCCESS] 🔧 Seeding Complete: Purchased 50 units of "${seedItem.itemName}" into Loc: ${seedItem.locationId}`);
            
            // ⏳ WAIT FOR STOCK ENGINE SYNC
            console.log('[INFO] ⏳ Waiting for Stock engine to process purchase (Max 30s)...');
            await app.api.inventory.pollStockAPI(seedItem.itemId, 50, seedItem.locationId);
            
            // Re-discover the now-stocked item and SELL from THAT EXACT SAME LOCATION
            initialInfo = seedItem;
            soData = await app.createSalesOrderAPI({ 
                itemId: seedItem.itemId, 
                quantity: 1,
                locationId: seedItem.locationId,
                warehouseId: seedItem.warehouseId
            });
            
            if (!soData.success) throw new Error(`Self-Healing Failed: Could not sell seeded stock from Loc ${seedItem.locationId}. Error: ${soData.error}`);
        }

        // ⚡ Fast API Approval
        await app.advanceDocumentAPI(soData.id, 'sales-orders');
        console.log(`[OK] Sales Order ${soData.ref} approved via Fast-API`);

        // 3. Create Invoice via API (linked to SO)
        console.log(`[STEP] Phase 3: Creating Invoice via API from SO ${soData.ref}`);
        const invData = await app.createInvoiceAPI({
            customerId: soData.customerId,
            soItemId: soData.soItemId,
            releasedQuantity: 1,
            locationId: initialInfo!.locationId,
            warehouseId: initialInfo!.warehouseId
        });

        // ⚡ Fast API Approval
        await app.advanceDocumentAPI(invData.id, 'invoices');
        invID = invData.ref!;
        invUUID = invData.id!;
        console.log(`[OK] Invoice ${invID} approved via Fast-API`);

        console.log('[STEP] Verifying stock deduction via API Polling');
        const expectedStock = initialInfo!.currentStock - 1;
        const currentStock = await app.pollStockAPI(initialInfo!.itemId, expectedStock, initialInfo!.locationId);

        console.log(`[VERIFY] Expected: ${expectedStock} | Found: ${currentStock}`);
        expect(currentStock).toBe(expectedStock);
        console.log('[OK] Stock decreased correctly after setup.');
    });

    test('Stage 2: Reverse invoice, verify stock restoration @regression', async ({ page }) => {
        test.setTimeout(450000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        if (!invUUID) throw new Error('Stage 2 Failed: No invoice was created in Stage 1.');

        console.log(`[STEP] Phase 2: Reversing Invoice ${invID} via API`);
        const success = await app.reverseInvoiceAPI(invUUID);
        expect(success).toBe(true);
        console.log(`[OK] Invoice ${invID} successfully reversed via Backend API`);

        console.log('[STEP] Verifying stock restoration via API Polling');
        const expectedStockRestored = initialInfo!.currentStock;
        const finalStock = await app.pollStockAPI(initialInfo!.itemId, expectedStockRestored, initialInfo!.locationId);

        console.log(`[VERIFY] Expected (restored): ${expectedStockRestored} | Found: ${finalStock}`);
        expect(finalStock).toBe(expectedStockRestored);
        console.log(`[RESULT] Invoice Reversal: PASSED — Stock restored to ${finalStock}`);
        
        await page.close();
    });
});
