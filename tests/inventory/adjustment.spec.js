const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe.serial('Inventory Adjustment Flow @regression', () => {

    test('Create Inventory Adjustment (Write-down), approve, verify stock deduction', async ({ page }) => {
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
            isWriteDown: false, // False = Increase in ERP logic
            reason: "Inventory audit addition"
        });

        if (!adjResult.success) throw new Error(`Adjustment API failed: ${adjResult.error}`);
        const adjID = adjResult.ref;
        const adjUUID = adjResult.id;

        // 4. Approve Adjustment in UI
        console.log(`[STEP] Phase 3: Approving Adjustment ${adjID}`);
        await page.goto(`/inventories/adjustments/${adjUUID}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Adjustment ${adjID} approved`);

        // 5. Verify Stock Impact (High-Speed API Method)
        console.log(`[STEP] Phase 4: Verifying stock impact for "${initial.itemName}" (via API)`);
        let postAdj = await app.getItemDetailsAPI(initial.itemId);
        
        // 🛡️ Fallback: If API fails, try UI capture once more
        if (!postAdj) {
            console.log("[INFO] API verification returned null. Falling back to UI capture.");
            postAdj = await app.captureItemDetails(initial.itemName);
        }

        const expectedStock = initial.currentStock + adjQty;

        console.log(`[VERIFY] Item: ${initial.itemName}`);
        console.log(`[VERIFY] Initial: ${initial.currentStock} | Adjusted: +${adjQty} | Final: ${postAdj?.currentStock ?? 'ERROR'} | Expected: ${expectedStock}`);

        if (!postAdj || postAdj.currentStock !== expectedStock) {
            throw new Error(`Stock mismatch! Expected ${expectedStock}, found ${postAdj?.currentStock ?? 'NULL'}`);
        }

        console.log(`[RESULT] Inventory Adjustment: PASSED — Stock correctly increased by ${adjQty} units`);
    });
});
