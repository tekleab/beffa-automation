# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-integrity.spec.ts >> Inventory Integrity & Boundary Audits @inventory @logic @regression @full >> Audit: Negative stock adjustment must correctly reduce stock and apply GL impact
- Location: tests/inventory/inv-integrity.spec.ts:21:9

# Error details

```
Error: Stock should have decreased by 50

expect(received).toBe(expected) // Object.is equality

Expected: 50
Received: 0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "BM Tech" [ref=e10]: BT
        - generic [ref=e11]:
          - button "BM Tech" [ref=e12] [cursor=pointer]:
            - generic: BM Tech
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
          - img "BM Tech" [ref=e62]: BT
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
  1  | import { test, expect } from'@playwright/test';
  2  | import { AppManager } from'../../pages/AppManager';
  3  | 
  4  | 
  5  | /**
  6  |  * INVENTORY INTEGRITY & BOUNDARY AUDITS
  7  |  * 
  8  |  * Objectives:
  9  |  * 1. Audit: negative stock adjustments are processed with correct stock & GL financial impact.
  10 |  * 2. Guardrail: system must reject zero-quantity movements.
  11 |  */
  12 | 
  13 | test.describe('Inventory Integrity & Boundary Audits @inventory @logic @regression @full', () => {
  14 | 
  15 |     test.beforeEach(async ({ page }) => {
  16 |         const app = new AppManager(page);
  17 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  18 | 
  19 |     });
  20 | 
  21 |     test('Audit: Negative stock adjustment must correctly reduce stock and apply GL impact', async ({ page }) => {
  22 |         const app = new AppManager(page);
  23 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  24 |         // Pick an item with at least 51 units so -50 reduction is physically possible
  25 |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 100, unit_cost: 100 });
  26 | 
  27 |         if (!item) {
  28 |             console.log('[SKIP] No item found with stock >= 51. Skipping.');
  29 |             return;
  30 |         }
  31 | 
  32 |         const stockBefore = item.currentStock;
  33 |         const adjustQty = -50;
  34 |         console.log(`[STEP 1] Creating negative adjustment (${adjustQty}) for: ${item.itemName} | Stock before: ${stockBefore}`);
  35 | 
  36 |         const adj = await app.api.inventory.adjustStockAPI({
  37 |             itemId:      item.itemId,
  38 |             quantity:    adjustQty,
  39 |             type:        'in',
  40 |             warehouseId: item.warehouseId,
  41 |             locationId:  item.locationId
  42 |         });
  43 | 
  44 |         // If the API rejects at creation — that is also an acceptable outcome
  45 |         if (!adj || !adj.id || adj.success === false) {
  46 |             console.log(`[PASS] System rejected negative adjustment at creation — guardrail active.`);
  47 |             return;
  48 |         }
  49 | 
  50 |         console.log(`[STEP 2] Adjustment created: ${adj.ref} | Approving...`);
  51 |         await app.advanceDocumentAPI(adj.id, 'inventory-adjustments');
  52 | 
  53 |         console.log(`[STEP 3] Verifying stock reduced correctly...`);
  54 |         const expectedStock = stockBefore + adjustQty; // stockBefore - 50
  55 |         const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId, 20);
  56 | 
  57 |         console.log(`[AUDIT] Stock before: ${stockBefore} | Adjustment: ${adjustQty} | Expected: ${expectedStock} | Final: ${finalStock}`);
> 58 |         expect(finalStock, `Stock should have decreased by ${Math.abs(adjustQty)}`).toBe(expectedStock);
     |                                                                                     ^ Error: Stock should have decreased by 50
  59 |         console.log(`[PASS] Negative adjustment applied correctly — stock reduced from ${stockBefore} to ${finalStock}.`);
  60 |     });
  61 | 
  62 |     test('Guardrail: System must reject zero-quantity adjustments', async ({ page }) => {
  63 |         const app = new AppManager(page);
  64 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  65 |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  66 | 
  67 |         console.log(`[ATTACK] Attempting zero-quantity adjustment for item: ${item.itemName}`);
  68 | 
  69 |         try {
  70 |             const adj = await app.api.inventory.adjustStockAPI({
  71 |                 itemId:      item.itemId,
  72 |                 quantity:    0,
  73 |                 type:'in',
  74 |                 warehouseId: item.warehouseId,
  75 |                 locationId:  item.locationId
  76 |             });
  77 | 
  78 |             // If the API correctly rejected it at creation, the guardrail worked!
  79 |             if (!adj.success) {
  80 |                 console.log(`[PASS] Zero adjustment correctly rejected at creation.`);
  81 |                 return;
  82 |             }
  83 | 
  84 |             // --- VULNERABILITY CONFIRMED: System created the adjustment ---
  85 |             console.log(`[VULNERABILITY] Zero-qty Adjustment was CREATED: Ref=${adj.ref} | ID=${adj.id}`);
  86 | 
  87 |             // Push all the way through the full approval cycle
  88 |             if (adj.id) {
  89 |                 await app.advanceDocumentAPI(adj.id,'inventory-adjustments');
  90 |                 console.log(`[VULNERABILITY] Zero-qty Adjustment was FULLY APPROVED: Ref=${adj.ref} | ID=${adj.id}`);
  91 |             }
  92 |             throw new Error(`[VULNERABILITY] System accepted and fully approved 0-quantity adjustment (Ref: ${adj.ref} | ID: ${adj.id})! Ledger bloat possible.`);
  93 |         } catch (err: any) {
  94 |             if (err.message.includes('[VULNERABILITY]')) throw err;
  95 |             console.log(`[PASS] Zero adjustment correctly rejected.`);
  96 |         }
  97 |     });
  98 | });
  99 | 
```