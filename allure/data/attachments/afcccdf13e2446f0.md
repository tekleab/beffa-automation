# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inventory-average-audit.spec.ts >> Weighted Average Costing Forensic Audit @inventory @security @costing @regression >> Audit: 7-Stage Average Cost Validation & COGS Accuracy
- Location: tests/inventory/inventory-average-audit.spec.ts:14:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 30
Received: 10
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "smoke test" [ref=e10]: st
        - generic [ref=e11]:
          - button "smoke test" [ref=e12] [cursor=pointer]:
            - generic: smoke test
            - img [ref=e14]
          - generic [ref=e16] [cursor=pointer]:
            - button "Company Detail" [ref=e17]:
              - img [ref=e18]
            - button "Edit Company" [ref=e21]:
              - img [ref=e22]
            - button "Company Detail" [ref=e25]:
              - img [ref=e26]
      - generic [ref=e29]:
        - button "New" [ref=e30] [cursor=pointer]:
          - text: New
          - img [ref=e32]
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: "5"
          - img "Notifications" [ref=e38]
        - button "EC" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - paragraph [ref=e44]: EC
        - button [ref=e45] [cursor=pointer]:
          - img [ref=e46]
        - generic [ref=e49] [cursor=pointer]:
          - img "System" [ref=e51]: S
          - generic [ref=e52]:
            - generic [ref=e53]: System
            - paragraph [ref=e54]: IT Administrator / User Manager
    - generic [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - img "smoke test" [ref=e62]: st
          - paragraph [ref=e63]: Welcome, System
        - paragraph [ref=e65]: From meticulous bookkeeping to seamless inventory control, we've got your back.
        - generic [ref=e66]:
          - link "Dashboard" [ref=e67] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e68] [cursor=pointer]:
            - /url: /settings/company/details
        - generic [ref=e69]:
          - link "Add Customer" [ref=e70] [cursor=pointer]:
            - /url: /receivables/customers/new
            - img [ref=e73]
            - text: Add Customer
          - link "Add Invoice" [ref=e74] [cursor=pointer]:
            - /url: /receivables/invoices/new
            - img [ref=e77]
            - text: Add Invoice
          - link "Add Receipt" [ref=e78] [cursor=pointer]:
            - /url: /receivables/receipts/new
            - img [ref=e81]
            - text: Add Receipt
          - link "Add Sales Order" [ref=e82] [cursor=pointer]:
            - /url: /receivables/sale-orders/new
            - img [ref=e85]
            - text: Add Sales Order
        - paragraph [ref=e87]: Quick Access
        - generic [ref=e88]:
          - generic [ref=e89]:
            - link "Sales Sales" [ref=e91] [cursor=pointer]:
              - /url: /receivables/overview/
              - button "Sales Sales" [ref=e92]:
                - generic [ref=e93]:
                  - img "Sales" [ref=e94]
                  - paragraph [ref=e95]: Sales
            - link "Purchase Purchase" [ref=e97] [cursor=pointer]:
              - /url: /payables/overview/
              - button "Purchase Purchase" [ref=e98]:
                - generic [ref=e99]:
                  - img "Purchase" [ref=e100]
                  - paragraph [ref=e101]: Purchase
            - link "Accounting Accounting" [ref=e103] [cursor=pointer]:
              - /url: /accounting/overview
              - button "Accounting Accounting" [ref=e104]:
                - generic [ref=e105]:
                  - img "Accounting" [ref=e106]
                  - paragraph [ref=e107]: Accounting
            - link "Leases Leases" [ref=e109] [cursor=pointer]:
              - /url: /leases/leases/?page=1&pageSize=15
              - button "Leases Leases" [ref=e110]:
                - generic [ref=e111]:
                  - img "Leases" [ref=e112]
                  - paragraph [ref=e113]: Leases
            - link "Assets Assets" [ref=e115] [cursor=pointer]:
              - /url: /assets/overview
              - button "Assets Assets" [ref=e116]:
                - generic [ref=e117]:
                  - img "Assets" [ref=e118]
                  - paragraph [ref=e119]: Assets
            - link "Budgets Budgets" [ref=e121] [cursor=pointer]:
              - /url: /public-sector-budgets/overview
              - button "Budgets Budgets" [ref=e122]:
                - generic [ref=e123]:
                  - img "Budgets" [ref=e124]
                  - paragraph [ref=e125]: Budgets
            - link "Payroll Payroll" [ref=e127] [cursor=pointer]:
              - /url: /payrolls
              - button "Payroll Payroll" [ref=e128]:
                - generic [ref=e129]:
                  - img "Payroll" [ref=e130]
                  - paragraph [ref=e131]: Payroll
            - link "Report Report" [ref=e133] [cursor=pointer]:
              - /url: /reports
              - button "Report Report" [ref=e134]:
                - generic [ref=e135]:
                  - img "Report" [ref=e136]
                  - paragraph [ref=e137]: Report
          - button "View All" [ref=e138] [cursor=pointer]:
            - text: View All
            - img [ref=e140]
      - img "Floating Icon" [ref=e143]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  1   | import { test, expect } from'@playwright/test';
  2   | import { AppManager } from'../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * 🏆 THE MASTER AVERAGE COST FORENSIC AUDIT (7 STAGES)
  6   |  * 
  7   |  * Objective: Verify that the ERP correctly calculates the Moving Average 
  8   |  * across the entire document lifecycle (Purchases -> Sales -> Adjustments).
  9   |  */
  10  | 
  11  | test.describe('Weighted Average Costing Forensic Audit @inventory @security @costing @regression', () => {
  12  |     test.describe.configure({ mode:'serial' });
  13  | 
  14  |     test('Audit: 7-Stage Average Cost Validation & COGS Accuracy', async ({ page }) => {
  15  |         process.env.BEFFA_COMPANY ='smoke test';
  16  |         const app = new AppManager(page);
  17  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  18  | 
  19  |         const envMeta = await app.api.inventory.discoverMetadataAPI();
  20  | 
  21  |         // ⚪ STAGE 1: Initial Batch (Baseline)
  22  |         const itemCode =`WAC-AUDIT-${Date.now()}`;
  23  |         console.log(`[WAC] Stage 1: Creating Item with Initial Batch (10 units @ $100)...`);
  24  |         const item = await app.api.inventory.createInventoryItemAPI({
  25  |             name: itemCode,
  26  |             item_id: itemCode,
  27  |             part_number:`PN-${itemCode.split('-').pop()}`,
  28  |             item_class:'RWT',
  29  |             cost_method_code:'WAC',
  30  |             quantity: 10,
  31  |             unit_cost: 100,
  32  |             default_location_id: envMeta.locationId,
  33  |             default_warehouse_id: envMeta.warehouseId
  34  |         });
  35  | 
  36  |         await app.api.inventory.pollStockAPI(item.id, 10);
  37  |         const stage1 = await app.api.inventory.getItemDetailsAPI(item.id);
  38  |         console.log(`[STAGE 1] Initial State: ${stage1.currentStock} @ $${stage1.unitCost}`);
  39  |         expect(stage1.currentStock).toBe(10);
  40  |         expect(stage1.unitCost).toBe(100);
  41  | 
  42  |         // 🟦 STAGE 2: Adding Batch 2 (20 units @ $200) -> Moving Average Calculation
  43  |         console.log(`[WAC] Stage 2: Adding Batch 2 (20 units @ $200)...`);
  44  |         const adj1 = await app.api.inventory.createInventoryAdjustmentAPI({
  45  |             itemId: item.id,
  46  |             quantity: 20,
  47  |             cost: 200,
  48  |             isWriteDown: false,
  49  |             warehouseId: envMeta.warehouseId,
  50  |             locationId: envMeta.locationId
  51  |         });
  52  |         if (adj1.id) {
  53  |             await app.advanceDocumentAPI(adj1.id,'inventory-adjustments');
  54  |             await app.api.inventory.processAdjustmentAPI(adj1.id);
  55  |         }
  56  |         
  57  |         await app.api.inventory.pollStockAPI(item.id, 30);
  58  |         const stage2 = await app.api.inventory.getItemDetailsAPI(item.id);
  59  |         // Math: ((10 * 100) + (20 * 200)) / 30 = 166.67
  60  |         console.log(`[STAGE 2] Stock: ${stage2?.currentStock} | New Moving Average: $${stage2?.unitCost} (Expect: $166.67)`);
> 61  |         expect(stage2?.currentStock).toBe(30);
      |                                      ^ Error: expect(received).toBe(expected) // Object.is equality
  62  |         expect(stage2?.unitCost).toBeCloseTo(166.67, 1);
  63  | 
  64  |         // 🟨 STAGE 3: Adding Batch 3 (15 units @ $300)
  65  |         console.log(`[WAC] Stage 3: Adding Batch 3 (15 units @ $300)...`);
  66  |         const adj2 = await app.api.inventory.createInventoryAdjustmentAPI({
  67  |             itemId: item.id,
  68  |             quantity: 15,
  69  |             cost: 300,
  70  |             isWriteDown: false,
  71  |             warehouseId: envMeta.warehouseId,
  72  |             locationId: envMeta.locationId
  73  |         });
  74  |         if (adj2.id) {
  75  |             await app.advanceDocumentAPI(adj2.id,'inventory-adjustments');
  76  |             await app.api.inventory.processAdjustmentAPI(adj2.id);
  77  |         }
  78  | 
  79  |         await app.api.inventory.pollStockAPI(item.id, 45);
  80  |         const stage3 = await app.api.inventory.getItemDetailsAPI(item.id);
  81  |         // Math: ((30 * 166.67) + (15 * 300)) / 45 = (5000 + 4500) / 45 = 211.11
  82  |         console.log(`[STAGE 3] Stock: ${stage3?.currentStock} | New Moving Average: $${stage3?.unitCost} (Expect: $211.11)`);
  83  |         expect(stage3?.currentStock).toBe(45);
  84  |         expect(stage3?.unitCost).toBeCloseTo(211.11, 1);
  85  | 
  86  |         // 🟩 STAGE 4: Invoice 1 — Average Cost Consumption (20 units)
  87  |         console.log(`[WAC] Stage 4: Selling 20 units at Moving Average...`);
  88  |         const inv1 = await app.api.sales.createStandaloneInvoiceAPI({
  89  |             customerId: envMeta.customerId,
  90  |             itemId: item.id,
  91  |             quantity: 20,
  92  |             unitPrice: 500,
  93  |             locationId: envMeta.locationId,
  94  |             warehouseId: envMeta.warehouseId
  95  |         });
  96  |         await app.advanceDocumentAPI(inv1.id,'invoices');
  97  | 
  98  |         await app.api.inventory.pollStockAPI(item.id, 25);
  99  |         
  100 |         // 🔍 FORENSIC AUDIT: Check Journals for Average Cost accuracy
  101 |         const journals = await app.api.inventory.getJournalEntriesAPI(inv1.id);
  102 |         const cogsEntry = journals.find(j => 
  103 |             ((j.accountType?.toLowerCase().includes('cost of sales') || j.accountName?.toLowerCase().includes('cost of others')) && parseFloat(j.debit) > 0) ||
  104 |             ((j.accountType?.toLowerCase().includes('inventories') || j.accountName?.toLowerCase().includes('inventory')) && parseFloat(j.credit) > 0)
  105 | );
  106 |         
  107 |         const actualCostImpact = parseFloat(cogsEntry?.credit || cogsEntry?.debit ||'0');
  108 |         const expectedCogs = 20 * 211.11; // 4222.20
  109 |         
  110 |         console.log(`[WAC AUDIT REPORT] ---------------------------------------`);
  111 |         console.log(`[WAC AUDIT REPORT] Invoice #: ${inv1.ref}`);
  112 |         console.log(`[WAC AUDIT REPORT] Average Impact: ${actualCostImpact}`);
  113 |         console.log(`[WAC AUDIT REPORT] Expected COGS  : ${expectedCogs} (Moving Avg)`);
  114 |         console.log(`[WAC AUDIT REPORT] Status        : ${actualCostImpact === expectedCogs ?'✅ MATCH' :'❌ DISCREPANCY'}`);
  115 |         console.log(`[WAC AUDIT REPORT] ---------------------------------------`);
  116 | 
  117 |         expect(actualCostImpact).toBeCloseTo(expectedCogs, 1);
  118 | 
  119 |         // 🟥 STAGE 5: Adjustment 1 — The Average Loss (-5 units)
  120 |         console.log(`[WAC] Stage 5: Verifying Cost of Loss (-5 units)...`);
  121 |         const adjLoss = await app.api.inventory.createInventoryAdjustmentAPI({
  122 |             itemId: item.id,
  123 |             quantity: 5,
  124 |             isWriteDown: true,
  125 |             warehouseId: envMeta.warehouseId,
  126 |             locationId: envMeta.locationId
  127 |         });
  128 |         if (adjLoss.id) {
  129 |             await app.advanceDocumentAPI(adjLoss.id,'inventory-adjustments');
  130 |             await app.api.inventory.processAdjustmentAPI(adjLoss.id);
  131 |         }
  132 | 
  133 |         await app.api.inventory.pollStockAPI(item.id, 20);
  134 |         const stage5 = await app.api.inventory.getItemDetailsAPI(item.id);
  135 |         console.log(`[STAGE 5] Stock: ${stage5?.currentStock} | Average Cost: $${stage5?.unitCost} (Expect: $211.11)`);
  136 |         expect(stage5?.currentStock).toBe(20);
  137 |         expect(stage5?.unitCost).toBeCloseTo(211.11, 1);
  138 | 
  139 |         // 🟪 STAGE 6: Adjustment 2 — Forced Average Revaluation
  140 |         console.log(`[WAC] Stage 6: Forced Revaluation to $190...`);
  141 |         const adjReval = await app.api.inventory.createInventoryAdjustmentAPI({
  142 |             itemId: item.id,
  143 |             quantity: 0,
  144 |             cost: 190, 
  145 |             isWriteDown: false,
  146 |             warehouseId: envMeta.warehouseId,
  147 |             locationId: envMeta.locationId,
  148 |             adjusted_by:'cost'
  149 |         });
  150 |         if (adjReval.id) {
  151 |             await app.advanceDocumentAPI(adjReval.id,'inventory-adjustments');
  152 |             await app.api.inventory.processAdjustmentAPI(adjReval.id);
  153 |         }
  154 | 
  155 |         const stage6 = await app.api.inventory.getItemDetailsAPI(item.id);
  156 |         console.log(`[STAGE 6] Average Cost reset to: $${stage6.unitCost} (Expect: $190)`);
  157 |         expect(stage6.unitCost).toBe(190);
  158 | 
  159 |         // 💀 STAGE 7: Invoice 2 — Final Sale (15 units)
  160 |         console.log(`[WAC] Stage 7: Final Sale at Revalued Average...`);
  161 |         const inv2 = await app.api.sales.createStandaloneInvoiceAPI({
```