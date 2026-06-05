import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * 🏆 COSTING FORENSIC AUDIT (7 STAGES)
 * 
 * Objective: Verify that the ERP correctly calculates costs across 
 * the entire document lifecycle (Purchases -> Sales -> Adjustments).
 * 
 * Tests both Weighted Average Cost (WAC) and FIFO costing methods.
 */

const costingMethods = [
  { name: 'WAC', costMethod: 'WAC', itemClass: 'RWT', description: 'Weighted Average Costing' },
  { name: 'FIFO', costMethod: 'FIFO', itemClass: 'MER', description: 'First-In-First-Out' }
];

for (const method of costingMethods) {
  test.describe(`${method.description} Forensic Audit @inventory @security @costing @regression @full`, () => {

    test(`Audit: 7-Stage ${method.name} Cost Validation & COGS Accuracy`, async ({ page }) => {
      process.env.BEFFA_COMPANY = 'smoke test';
      const app = new AppManager(page);
      await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

      const envMeta = await app.api.inventory.discoverMetadataAPI();

      // ⚪ STAGE 1: Initial Batch (Baseline)
      const itemCode = `${method.name}-AUDIT-${Date.now()}`;
      console.log(`[${method.name}] Stage 1: Creating Item with Initial Batch (10 units @ $100)...`);
      const item = await app.api.inventory.createInventoryItemAPI({
        name: itemCode,
        item_id: itemCode,
        part_number: `PN-${itemCode.split('-').pop()}`,
        item_class: method.itemClass,
        cost_method_code: method.costMethod,
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

      // 🟦 STAGE 2: Adding Batch 2 (20 units @ $200)
      console.log(`[${method.name}] Stage 2: Adding Batch 2 (20 units @ $200)...`);
      const adj1 = await app.api.inventory.createInventoryAdjustmentAPI({
        itemId: item.id,
        quantity: 20,
        cost: 200,
        isWriteDown: false,
        warehouseId: envMeta.warehouseId,
        locationId: envMeta.locationId
      });
      if (adj1.id) {
        await app.advanceDocumentAPI(adj1.id, 'inventory-adjustments');
        await app.api.inventory.processAdjustmentAPI(adj1.id);
      }
      
      await app.api.inventory.pollStockAPI(item.id, 30);
      const stage2 = await app.api.inventory.getItemDetailsAPI(item.id);
      
      if (method.name === 'WAC') {
        // Math: ((10 * 100) + (20 * 200)) / 30 = 166.67
        console.log(`[STAGE 2] Stock: ${stage2?.currentStock} | New Moving Average: $${stage2?.unitCost} (Expect: $166.67)`);
        expect(stage2?.currentStock).toBe(30);
        expect(stage2?.unitCost).toBeCloseTo(166.67, 1);
      } else {
        // FIFO: Master cost stays at beginning balance cost
        console.log(`[STAGE 2] Stock: ${stage2?.currentStock} | Master Cost: $${stage2?.unitCost} (Expect: $100)`);
        expect(stage2?.currentStock).toBe(30);
        expect(stage2?.unitCost).toBe(100);
      }

      // 🟨 STAGE 3: Adding Batch 3 (15 units @ $300)
      console.log(`[${method.name}] Stage 3: Adding Batch 3 (15 units @ $300)...`);
      const adj2 = await app.api.inventory.createInventoryAdjustmentAPI({
        itemId: item.id,
        quantity: 15,
        cost: 300,
        isWriteDown: false,
        warehouseId: envMeta.warehouseId,
        locationId: envMeta.locationId
      });
      if (adj2.id) {
        await app.advanceDocumentAPI(adj2.id, 'inventory-adjustments');
        await app.api.inventory.processAdjustmentAPI(adj2.id);
      }

      await app.api.inventory.pollStockAPI(item.id, 45);
      const stage3 = await app.api.inventory.getItemDetailsAPI(item.id);
      
      if (method.name === 'WAC') {
        // Math: ((30 * 166.67) + (15 * 300)) / 45 = (5000 + 4500) / 45 = 211.11
        console.log(`[STAGE 3] Stock: ${stage3?.currentStock} | New Moving Average: $${stage3?.unitCost} (Expect: $211.11)`);
        expect(stage3?.currentStock).toBe(45);
        expect(stage3?.unitCost).toBeCloseTo(211.11, 1);
      } else {
        // FIFO: Master cost still at beginning balance
        console.log(`[STAGE 3] Stock: ${stage3?.currentStock} | Master Cost: $${stage3?.unitCost} (Expect: $100)`);
        expect(stage3?.currentStock).toBe(45);
        expect(stage3?.unitCost).toBe(100);
      }

      // 🟩 STAGE 4: Invoice 1 — Cost Consumption (20 units)
      console.log(`[${method.name}] Stage 4: Selling 20 units...`);
      const inv1 = await app.api.sales.createStandaloneInvoiceAPI({
        customerId: envMeta.customerId,
        itemId: item.id,
        quantity: 20,
        unitPrice: 500,
        locationId: envMeta.locationId,
        warehouseId: envMeta.warehouseId
      });
      await app.advanceDocumentAPI(inv1.id, 'invoices');

      await app.api.inventory.pollStockAPI(item.id, 25);
      
      // 🔍 FORENSIC AUDIT: Check Journals for cost accuracy
      const journals = await app.api.inventory.getJournalEntriesAPI(inv1.id);
      const cogsEntry = journals.find(j => 
        ((j.accountType?.toLowerCase().includes('cost of sales') || j.accountName?.toLowerCase().includes('cost of others')) && parseFloat(j.debit) > 0) ||
        ((j.accountType?.toLowerCase().includes('inventories') || j.accountName?.toLowerCase().includes('inventory')) && parseFloat(j.credit) > 0)
      );
      
      const actualCostImpact = parseFloat(cogsEntry?.credit || cogsEntry?.debit || '0');
      let expectedCogs: number;
      
      if (method.name === 'WAC') {
        expectedCogs = 20 * 211.11; // 4222.20
      } else {
        // FIFO: Drains 10 units from BB ($100) + 10 units from Layer 1 ($200) = 3000
        expectedCogs = (10 * 100) + (10 * 200);
      }
      
      console.log(`[${method.name} AUDIT REPORT] ---------------------------------------`);
      console.log(`[${method.name} AUDIT REPORT] Invoice #: ${inv1.ref}`);
      console.log(`[${method.name} AUDIT REPORT] Cost Impact: ${actualCostImpact}`);
      console.log(`[${method.name} AUDIT REPORT] Expected COGS: ${expectedCogs} (${method.description})`);
      console.log(`[${method.name} AUDIT REPORT] Status: ${actualCostImpact === expectedCogs ? '✅ MATCH' : '❌ DISCREPANCY'}`);
      console.log(`[${method.name} AUDIT REPORT] ---------------------------------------`);

      expect(actualCostImpact).toBeCloseTo(expectedCogs, method.name === 'WAC' ? 1 : 2);

      const stage4 = await app.api.inventory.getItemDetailsAPI(item.id);
      if (method.name === 'WAC') {
        console.log(`[STAGE 4] Stock: ${stage4?.currentStock} | Average Cost: $${stage4?.unitCost} (Expect: $211.11)`);
        expect(stage4?.currentStock).toBe(25);
        expect(stage4?.unitCost).toBeCloseTo(211.11, 1);
      } else {
        console.log(`[STAGE 4] Stock: ${stage4?.currentStock} | Master Cost Jump: $${stage4?.unitCost} (Expect: $200)`);
        expect(stage4?.currentStock).toBe(25);
        expect(stage4?.unitCost).toBe(200);
      }

      // 🟥 STAGE 5: Adjustment 1 — The Loss (-5 units)
      console.log(`[${method.name}] Stage 5: Verifying Cost of Loss (-5 units)...`);
      const adjLoss = await app.api.inventory.createInventoryAdjustmentAPI({
        itemId: item.id,
        quantity: 5,
        isWriteDown: true,
        warehouseId: envMeta.warehouseId,
        locationId: envMeta.locationId
      });
      if (adjLoss.id) {
        await app.advanceDocumentAPI(adjLoss.id, 'inventory-adjustments');
        await app.api.inventory.processAdjustmentAPI(adjLoss.id);
      }

      await app.api.inventory.pollStockAPI(item.id, 20);
      const stage5 = await app.api.inventory.getItemDetailsAPI(item.id);
      
      if (method.name === 'WAC') {
        console.log(`[STAGE 5] Stock: ${stage5?.currentStock} | Average Cost: $${stage5?.unitCost} (Expect: $211.11)`);
        expect(stage5?.currentStock).toBe(20);
        expect(stage5?.unitCost).toBeCloseTo(211.11, 1);
      } else {
        console.log(`[STAGE 5] Stock: ${stage5?.currentStock} | Master Cost: $${stage5?.unitCost} (Expect: $200)`);
        expect(stage5?.currentStock).toBe(20);
        expect(stage5?.unitCost).toBe(200);
      }

      // 🟪 STAGE 6: Adjustment 2 — Cost Revaluation
      console.log(`[${method.name}] Stage 6: Forced Revaluation to $190...`);
      const adjReval = await app.api.inventory.createInventoryAdjustmentAPI({
        itemId: item.id,
        quantity: 0,
        cost: 190, 
        isWriteDown: false,
        warehouseId: envMeta.warehouseId,
        locationId: envMeta.locationId,
        adjusted_by: 'cost'
      });
      if (adjReval.id) {
        await app.advanceDocumentAPI(adjReval.id, 'inventory-adjustments');
        await app.api.inventory.processAdjustmentAPI(adjReval.id);
      }

      const stage6 = await app.api.inventory.getItemDetailsAPI(item.id);
      console.log(`[STAGE 6] Cost reset to: $${stage6.unitCost} (Expect: $190)`);
      expect(stage6.unitCost).toBe(190);

      // 💀 STAGE 7: Invoice 2 — Final Sale (15 units)
      console.log(`[${method.name}] Stage 7: Final Sale at Revalued Cost...`);
      const inv2 = await app.api.sales.createStandaloneInvoiceAPI({
        customerId: envMeta.customerId,
        itemId: item.id,
        quantity: 15,
        unitPrice: 600,
        locationId: envMeta.locationId,
        warehouseId: envMeta.warehouseId
      });
      await app.advanceDocumentAPI(inv2.id, 'invoices');

      await app.api.inventory.pollStockAPI(item.id, 5);
      const finalState = await app.api.inventory.getItemDetailsAPI(item.id);
      console.log(`[FINAL] Audit Complete. Stock: ${finalState?.currentStock} | Final Cost: $${finalState?.unitCost}`);
      expect(finalState?.currentStock).toBe(5);
      expect(finalState?.unitCost).toBe(190);
    });
  });
}
