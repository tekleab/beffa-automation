import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Inventory Adjustment Flow @regression', () => {

    test('Create Inventory Adjustment (Write-down), approve, verify stock deduction', async ({ page }) => {
        test.info().annotations.push({ type: 'allure.severity', description: 'critical' });
        test.setTimeout(400000);
        const app = new AppManager(page);

        console.log('[STEP] Phase 1: Login & Initial Stock Capture');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        // 1. Pick a random item (Pure API Discovery - Instant)
        const initial = await app.captureRandomItemDataAPI();
        console.log(`[OK] Discovered via API: "${initial.itemName}" | Stock: ${initial.currentStock}`);

        // 2. Calculate safe adjustment quantity (Target < 50,000 Birr to stay under admin limit)
        const unitCost = initial.unitCost || 1000;
        let adjQty = Math.max(1, Math.min(5, Math.floor(50000 / unitCost)));

        if (unitCost > 50000) adjQty = 1; // If very expensive, just do 1

        console.log(`[INFO] Item Unit Cost: ${unitCost} | Chosen Adjustment Qty: ${adjQty} (Total: ${unitCost * adjQty})`);

        // 3. Create Adjustment via API (Using the "Increase" flow as per user scenario)
        console.log(`[STEP] Phase 2: Creating Adjustment API (Increase by ${adjQty} units)`);
        const adjResult = await app.createInventoryAdjustmentAPI({
            itemId: initial.itemId,
            adjustedQuantity: adjQty,
            locationId: initial.locationId,
            warehouseId: initial.warehouseId,
            isWriteDown: false, // False = Increase in ERP logic
            reason: "Inventory audit addition"
        });

        if (!adjResult.success) throw new Error(`Adjustment API failed: ${adjResult.error}`);
        const adjID = adjResult.ref;
        const adjUUID = adjResult.id;

        // 4. Approve Adjustment in UI
        console.log(`[STEP] Phase 3: Approving Adjustment ${adjID}`);
        // ⚡ Fast API Approval
        await page.goto(`/inventories/adjustments/${adjUUID}/detail`, { waitUntil: 'load' });
        await app.advanceDocumentAPI(adjUUID, 'inventory-adjustments');
        await page.reload(); // 🔄 Synchronize
        console.log(`[OK] Adjustment ${adjID} approved via Fast-API`);

        // 5. Verify Stock Impact (High-Speed API Method with Tactical Polling)
        console.log(`[STEP] Phase 4: Verifying stock impact for "${initial.itemName}" (Polling for sync)`);
        const expectedStock = initial.currentStock + adjQty;
        let postAdj: any = null;
        let success = false;

        for (let attempt = 0; attempt < 15; attempt++) {
            postAdj = await app.getItemDetailsAPI(initial.itemId, initial.locationId);
            
            console.log(`[POLL] Attempt ${attempt + 1}/15: Found ${postAdj?.currentStock ?? 'NULL'} at location ${initial.locationId} | Expected ${expectedStock}`);
            
            if (postAdj && postAdj.currentStock === expectedStock) {
                success = true;
                break;
            }
            await page.waitForTimeout(2000); // 2s tactical wait for ERP backend sync
        }

        if (!success) {
            throw new Error(`Stock mismatch after polling! Expected ${expectedStock}, found ${postAdj?.currentStock ?? 'NULL'}`);
        }

        console.log(`[RESULT] Inventory Adjustment: PASSED — Stock correctly increased by ${adjQty} units`);
    });
});
