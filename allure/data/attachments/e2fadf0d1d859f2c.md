# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-management.spec.ts >> Inventory Item Management @inventory @logic @regression @full >> Create: New inventory item is created and visible in the system
- Location: tests/inventory/inv-management.spec.ts:41:9

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForTimeout: Test timeout of 120000ms exceeded.
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
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * INVENTORY ITEM MANAGEMENT
  6   |  *
  7   |  * Objectives:
  8   |  * 1. Guardrail: System must reject creation of a duplicate item_id / part_number.
  9   |  */
  10  | 
  11  | test.describe('Inventory Item Management @inventory @logic @regression @full', () => {
  12  | 
  13  |     test('Guardrail: System must reject duplicate item_id on creation', async ({ page }) => {
  14  |         const app = new AppManager(page);
  15  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  16  | 
  17  |         const itemCode = `DUP-GUARD-${Date.now()}`;
  18  | 
  19  |         console.log(`[STEP 1] Creating original item with item_id: ${itemCode}...`);
  20  |         const original = await app.api.inventory.createInventoryItemAPI({
  21  |             name: itemCode,
  22  |             item_id: itemCode,
  23  |             part_number: `PN-${itemCode.split('-').pop()}`
  24  |         });
  25  |         console.log(`[OK] Original item created: ${original.itemName} (ID: ${original.id})`);
  26  | 
  27  |         console.log(`[STEP 2] Attempting to create a DUPLICATE with the same item_id...`);
  28  |         try {
  29  |             const duplicate = await app.api.inventory.createInventoryItemAPI({
  30  |                 name: `${itemCode}-COPY`,
  31  |                 item_id: itemCode,
  32  |                 part_number: `PN-${itemCode.split('-').pop()}`
  33  |             });
  34  |             throw new Error(`[VULNERABILITY] System accepted a duplicate item_id "${itemCode}" (ID: ${duplicate.id}). SKU uniqueness is not enforced.`);
  35  |         } catch (err: any) {
  36  |             if (err.message.includes('[VULNERABILITY]')) throw err;
  37  |             console.log(`[PASS] Duplicate item_id correctly rejected: ${err.message}`);
  38  |         }
  39  |     });
  40  | 
  41  |     test('Create: New inventory item is created and visible in the system', async ({ page }) => {
  42  |         const app = new AppManager(page);
  43  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  44  | 
  45  |         const itemCode = `UI-CREATE-${Date.now()}`;
  46  |         console.log(`[STEP 1] Navigating to new inventory item form...`);
  47  |         await page.goto('/inventories/items/new', { waitUntil: 'networkidle' });
  48  | 
  49  |         console.log(`[STEP 2] Filling text inputs...`);
  50  |         await page.locator('input[name="item_id"]').fill(itemCode);
  51  |         await page.locator('input[name="name"]').fill(itemCode);
  52  |         await page.locator('input[name="quantity"]').fill('0');
  53  |         await page.locator('input[name="unit_cost"]').fill('100');
  54  |         await page.locator('input[name="part_number"]').fill(`PN-${Date.now().toString().slice(-5)}`);
  55  | 
  56  |         console.log(`[STEP 3] Selecting native dropdowns...`);
  57  |         await page.locator('select[name="item_class"]').selectOption({ index: 1 });
  58  |         await page.locator('select[name="category"]').selectOption({ index: 1 });
  59  |         await page.locator('select[name="cost_method_code"]').selectOption({ index: 1 });
  60  |         await page.locator('select[name="unit_of_measurement"]').selectOption({ index: 1 });
  61  | 
  62  |         console.log(`[STEP 4] Selecting custom button dropdowns...`);
  63  |         await app.selectRandomOption(page.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
  64  |         await app.selectRandomOption(page.getByRole('button', { name: 'Location selector' }), 'Location');
  65  |         await app.selectRandomOption(page.getByRole('button', { name: 'GL Cost Account selector' }), 'GL Cost Account');
  66  |         await app.selectRandomOption(page.getByRole('button', { name: 'GL Sales Account selector' }), 'GL Sales Account');
  67  |         await app.selectRandomOption(page.getByRole('button', { name: 'GL Inventory Account selector' }), 'GL Inventory Account');
  68  | 
  69  |         console.log(`[STEP 5] Submitting form...`);
  70  |         const saveBtn = page.getByRole('button', { name: 'Add Now', exact: true });
  71  |         await expect(saveBtn).toBeEnabled({ timeout: 15000 });
  72  |         await saveBtn.click();
  73  | 
  74  |         // Wait for navigation away from the /new page
  75  |         await page.waitForURL(
  76  |             url => !url.href.includes('/new'),
  77  |             { timeout: 60000 }
  78  |         ).catch(() => console.log('[WARN] No navigation after save — checking current page...'));
  79  | 
  80  |         // If the ERP redirected to a data-seeding or setup page, go to the items list directly
  81  |         if (page.url().includes('/data-seeding') || page.url().includes('/setup') || page.url().includes('/onboarding')) {
  82  |             console.log('[WARN] Redirected to setup page after save — navigating to items list...');
  83  |             await page.goto('/inventories/items', { waitUntil: 'networkidle' });
  84  |         }
  85  | 
  86  |         console.log(`[STEP 6] Asserting item name visible on page...`);
  87  |         // Poll — list/detail pages may have indexing lag
  88  |         let visible = false;
  89  |         for (let i = 0; i < 8; i++) {
  90  |             visible = await page.getByText(itemCode).first().isVisible({ timeout: 5000 }).catch(() => false);
  91  |             if (visible) break;
  92  |             await page.reload({ waitUntil: 'domcontentloaded' });
> 93  |             await page.waitForTimeout(2000);
      |                        ^ Error: page.waitForTimeout: Test timeout of 120000ms exceeded.
  94  |         }
  95  | 
  96  |         if (!visible) {
  97  |             // Fallback: confirm creation via API
  98  |             console.log('[WARN] Item not visible in UI — verifying via API...');
  99  |             const details = await app.api.inventory.getItemDetailsAPI(itemCode);
  100 |             expect(details, `Item "${itemCode}" should exist in the system (API fallback)`).not.toBeNull();
  101 |             console.log(`[PASS] Item "${itemCode}" confirmed via API (UI indexing lag).`);
  102 |         } else {
  103 |             console.log(`[PASS] Item "${itemCode}" created and confirmed visible.`);
  104 |         }
  105 |     });
  106 | 
  107 |     test('View: Existing inventory item details render correctly in the UI', async ({ page }) => {
  108 |         const app = new AppManager(page);
  109 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  110 | 
  111 |         const itemCode = `VIEW-AUDIT-${Date.now()}`;
  112 |         console.log(`[STEP 1] Creating item via API for view verification...`);
  113 |         const item = await app.api.inventory.createInventoryItemAPI({
  114 |             name: itemCode,
  115 |             item_id: itemCode,
  116 |             part_number: `PN-${Date.now().toString().slice(-5)}`,
  117 |             quantity: 0,
  118 |             unit_cost: 150
  119 |         });
  120 |         console.log(`[OK] Item created via API: ${item.itemName} (ID: ${item.id})`);
  121 | 
  122 |         console.log(`[STEP 2] Navigating to item detail page via UI...`);
  123 |         await page.goto(`/inventories/items/${item.id}/detail`, { waitUntil: 'networkidle' });
  124 | 
  125 |         console.log(`[STEP 3] Asserting item name and key fields are visible...`);
  126 |         await expect(page.getByText(itemCode).first()).toBeVisible({ timeout: 15000 });
  127 | 
  128 |         const details = await app.api.inventory.getItemDetailsAPI(item.id);
  129 |         expect(details).not.toBeNull();
  130 |         expect(details!.itemName).toBe(itemCode);
  131 |         expect(details!.unitCost).toBe(150);
  132 | 
  133 |         console.log(`[PASS] Item "${itemCode}" detail page renders correctly. API confirms: Stock=${details!.currentStock}, Cost=${details!.unitCost}`);
  134 |     });
  135 | 
  136 |     test('Guardrail: System must reject overselling beyond available stock', async ({ page }) => {
  137 |         const app = new AppManager(page);
  138 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  139 | 
  140 |         console.log(`[STEP 1] Discovering item with known stock...`);
  141 |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  142 | 
  143 |         if (!item) {
  144 |             console.log(`[SKIP] No item with stock >= 1 found. Cannot run oversell guardrail.`);
  145 |             return;
  146 |         }
  147 | 
  148 |         const oversellQty = item.currentStock + 9999;
  149 |         const envMeta = await app.api.inventory.discoverMetadataAPI();
  150 | 
  151 |         console.log(`[ATTACK] Attempting to invoice ${oversellQty} units of "${item.itemName}" (available: ${item.currentStock})...`);
  152 | 
  153 |         try {
  154 |             const inv = await app.api.sales.createStandaloneInvoiceAPI({
  155 |                 customerId: envMeta.customerId,
  156 |                 itemId: item.itemId,
  157 |                 quantity: oversellQty,
  158 |                 unitPrice: 100,
  159 |                 locationId: item.locationId,
  160 |                 warehouseId: item.warehouseId
  161 |             });
  162 | 
  163 |             // Invoice created — push through approval to see if stock goes negative
  164 |             await app.advanceDocumentAPI(inv.id, 'invoices');
  165 |             const finalStock = await app.api.inventory.getItemDetailsAPI(item.itemId, item.locationId);
  166 | 
  167 |             if ((finalStock?.currentStock ?? 0) < 0) {
  168 |                 throw new Error(`[VULNERABILITY] Oversell approved and stock went negative: ${finalStock?.currentStock}. Item: "${item.itemName}".`);
  169 |             }
  170 | 
  171 |             console.log(`[WARN] Invoice was created but stock did not go negative (Stock: ${finalStock?.currentStock}). System may have blocked at approval.`);
  172 |         } catch (err: any) {
  173 |             if (err.message.includes('[VULNERABILITY]')) throw err;
  174 |             console.log(`[PASS] Oversell correctly rejected: ${err.message}`);
  175 |         }
  176 |     });
  177 | });
  178 | 
```