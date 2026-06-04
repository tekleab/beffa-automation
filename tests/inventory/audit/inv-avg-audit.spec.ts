import { test, expect } from'@playwright/test';
import { AppManager } from'../../../pages/AppManager';

/**
 * 🏆 THE MASTER AVERAGE COST FORENSIC AUDIT (7 STAGES)
 * 
 * Objective: Verify that the ERP correctly calculates the Moving Average 
 * across the entire document lifecycle (Purchases -> Sales -> Adjustments).
 */

test.describe('Weighted Average Costing Forensic Audit @inventory @security @costing @regression @full', () => {
    test.describe.configure({ mode:'serial' });

    test('Audit: 7-Stage Average Cost Validation & COGS Accuracy', async ({ page }) => {
        process.env.BEFFA_COMPANY ='smoke test';
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const envMeta = await app.api.inventory.discoverMetadataAPI();

        // ⚪ STAGE 1: Initial Batch (Baseline)
        const itemCode =`WAC-AUDIT-${Date.now()}`;
        console.log(`[WAC] Stage 1: Creating Item with Initial Batch (10 units @ $100)...`);
        const item = await app.api.inventory.createInventoryItemAPI({
            name: itemCode,
            item_id: itemCode,
            part_number:`PN-${itemCode.split('-').pop()}`,
            item_class:'RWT',
            cost_method_code:'WAC',
            quantity: 10,
            unit_cost: 100,
            default_location_id: envMeta.locationId,
            default_warehouse_id: envMeta.warehouseId
        });

        await app.api.inventory.pollStockAPI(item.id, 10);
        const stage1 = await app.api.inventory.getItemDetailsAPI(item.id);
        console.log(`[STAGE 1] Initial State: ${stage1.currentStock} @ $${stage1.unitCost}`);
        expect(stage1.currentStock).toBe(10);
        expect(stage1.unitCost).toBe(100);

        // 🟦 STAGE 2: Adding Batch 2 (20 units @ $200) -> Moving Average Calculation
        console.log(`[WAC] Stage 2: Adding Batch 2 (20 units @ $200)...`);
        const adj1 = await app.api.inventory.createInventoryAdjustmentAPI({
            itemId: item.id,
            quantity: 20,
            cost: 200,
            isWriteDown: false,
            warehouseId: envMeta.warehouseId,
            locationId: envMeta.locationId
        });
        if (adj1.id) {
            await app.advanceDocumentAPI(adj1.id,'inventory-adjustments');
            await app.api.inventory.processAdjustmentAPI(adj1.id);
        }
        
        await app.api.inventory.pollStockAPI(item.id, 30);
        const stage2 = await app.api.inventory.getItemDetailsAPI(item.id);
        // Math: ((10 * 100) + (20 * 200)) / 30 = 166.67
        console.log(`[STAGE 2] Stock: ${stage2?.currentStock} | New Moving Average: $${stage2?.unitCost} (Expect: $166.67)`);
        expect(stage2?.currentStock).toBe(30);
        expect(stage2?.unitCost).toBeCloseTo(166.67, 1);

        // 🟨 STAGE 3: Adding Batch 3 (15 units @ $300)
        console.log(`[WAC] Stage 3: Adding Batch 3 (15 units @ $300)...`);
        const adj2 = await app.api.inventory.createInventoryAdjustmentAPI({
            itemId: item.id,
            quantity: 15,
            cost: 300,
            isWriteDown: false,
            warehouseId: envMeta.warehouseId,
            locationId: envMeta.locationId
        });
        if (adj2.id) {
            await app.advanceDocumentAPI(adj2.id,'inventory-adjustments');
            await app.api.inventory.processAdjustmentAPI(adj2.id);
        }

        await app.api.inventory.pollStockAPI(item.id, 45);
        const stage3 = await app.api.inventory.getItemDetailsAPI(item.id);
        // Math: ((30 * 166.67) + (15 * 300)) / 45 = (5000 + 4500) / 45 = 211.11
        console.log(`[STAGE 3] Stock: ${stage3?.currentStock} | New Moving Average: $${stage3?.unitCost} (Expect: $211.11)`);
        expect(stage3?.currentStock).toBe(45);
        expect(stage3?.unitCost).toBeCloseTo(211.11, 1);

        // 🟩 STAGE 4: Invoice 1 — Average Cost Consumption (20 units)
        console.log(`[WAC] Stage 4: Selling 20 units at Moving Average...`);
        const inv1 = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: envMeta.customerId,
            itemId: item.id,
            quantity: 20,
            unitPrice: 500,
            locationId: envMeta.locationId,
            warehouseId: envMeta.warehouseId
        });
        await app.advanceDocumentAPI(inv1.id,'invoices');

        await app.api.inventory.pollStockAPI(item.id, 25);
        
        // 🔍 FORENSIC AUDIT: Check Journals for Average Cost accuracy
        const journals = await app.api.inventory.getJournalEntriesAPI(inv1.id);
        const cogsEntry = journals.find(j => 
            ((j.accountType?.toLowerCase().includes('cost of sales') || j.accountName?.toLowerCase().includes('cost of others')) && parseFloat(j.debit) > 0) ||
            ((j.accountType?.toLowerCase().includes('inventories') || j.accountName?.toLowerCase().includes('inventory')) && parseFloat(j.credit) > 0)
);
        
        const actualCostImpact = parseFloat(cogsEntry?.credit || cogsEntry?.debit ||'0');
        const expectedCogs = 20 * 211.11; // 4222.20
        
        console.log(`[WAC AUDIT REPORT] ---------------------------------------`);
        console.log(`[WAC AUDIT REPORT] Invoice #: ${inv1.ref}`);
        console.log(`[WAC AUDIT REPORT] Average Impact: ${actualCostImpact}`);
        console.log(`[WAC AUDIT REPORT] Expected COGS  : ${expectedCogs} (Moving Avg)`);
        console.log(`[WAC AUDIT REPORT] Status        : ${actualCostImpact === expectedCogs ?'✅ MATCH' :'❌ DISCREPANCY'}`);
        console.log(`[WAC AUDIT REPORT] ---------------------------------------`);

        expect(actualCostImpact).toBeCloseTo(expectedCogs, 1);

        // 🟥 STAGE 5: Adjustment 1 — The Average Loss (-5 units)
        console.log(`[WAC] Stage 5: Verifying Cost of Loss (-5 units)...`);
        const adjLoss = await app.api.inventory.createInventoryAdjustmentAPI({
            itemId: item.id,
            quantity: 5,
            isWriteDown: true,
            warehouseId: envMeta.warehouseId,
            locationId: envMeta.locationId
        });
        if (adjLoss.id) {
            await app.advanceDocumentAPI(adjLoss.id,'inventory-adjustments');
            await app.api.inventory.processAdjustmentAPI(adjLoss.id);
        }

        await app.api.inventory.pollStockAPI(item.id, 20);
        const stage5 = await app.api.inventory.getItemDetailsAPI(item.id);
        console.log(`[STAGE 5] Stock: ${stage5?.currentStock} | Average Cost: $${stage5?.unitCost} (Expect: $211.11)`);
        expect(stage5?.currentStock).toBe(20);
        expect(stage5?.unitCost).toBeCloseTo(211.11, 1);

        // 🟪 STAGE 6: Adjustment 2 — Forced Average Revaluation
        console.log(`[WAC] Stage 6: Forced Revaluation to $190...`);
        const adjReval = await app.api.inventory.createInventoryAdjustmentAPI({
            itemId: item.id,
            quantity: 0,
            cost: 190, 
            isWriteDown: false,
            warehouseId: envMeta.warehouseId,
            locationId: envMeta.locationId,
            adjusted_by:'cost'
        });
        if (adjReval.id) {
            await app.advanceDocumentAPI(adjReval.id,'inventory-adjustments');
            await app.api.inventory.processAdjustmentAPI(adjReval.id);
        }

        const stage6 = await app.api.inventory.getItemDetailsAPI(item.id);
        console.log(`[STAGE 6] Average Cost reset to: $${stage6.unitCost} (Expect: $190)`);
        expect(stage6.unitCost).toBe(190);

        // 💀 STAGE 7: Invoice 2 — Final Sale (15 units)
        console.log(`[WAC] Stage 7: Final Sale at Revalued Average...`);
        const inv2 = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: envMeta.customerId,
            itemId: item.id,
            quantity: 15,
            unitPrice: 600,
            locationId: envMeta.locationId,
            warehouseId: envMeta.warehouseId
        });
        await app.advanceDocumentAPI(inv2.id,'invoices');

        await app.api.inventory.pollStockAPI(item.id, 5);
        const finalState = await app.api.inventory.getItemDetailsAPI(item.id);
        console.log(`[FINAL] Audit Complete. Stock: ${finalState?.currentStock} | Final Average: $${finalState?.unitCost}`);
        expect(finalState?.currentStock).toBe(5);
        expect(finalState?.unitCost).toBe(190);
    });
});
