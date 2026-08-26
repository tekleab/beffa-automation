# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-load.spec.ts >> Load: Concurrent Inventory Adjustments @inventory @load @full >> LOAD: 10 concurrent +5 adjustments must produce exactly +50 net stock
- Location: tests/inventory/inv-load.spec.ts:32:9

# Error details

```
Error: Lost update under concurrent advance: expected 60, got 45

expect(received).toBe(expected) // Object.is equality

Expected: 60
Received: 45
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - img [ref=e8]
      - generic [ref=e11]:
        - heading "Welcome to, befa" [level=3] [ref=e12]
        - paragraph [ref=e13]: Empower Your Finances, Simplify Your Success
        - paragraph [ref=e14]: From meticulous bookkeeping to seamless inventory control, we've got your back.
    - generic [ref=e16]:
      - heading "Login To Your Account" [level=2] [ref=e17]
      - generic [ref=e18]:
        - text: Not a member?
        - link "Register" [ref=e19] [cursor=pointer]:
          - /url: /users/register
      - generic [ref=e21]:
        - group [ref=e22]:
          - generic [ref=e23]: Email *
          - textbox "Email *" [ref=e25]:
            - /placeholder: Enter your email
        - group [ref=e26]:
          - generic [ref=e27]: Password *
          - generic [ref=e28]:
            - textbox "Password *" [ref=e29]:
              - /placeholder: Enter your password
            - button "Show password" [ref=e31] [cursor=pointer]:
              - img [ref=e32]
        - link "Forget Password?" [ref=e37] [cursor=pointer]:
          - /url: forget-password
        - button "Login" [ref=e39] [cursor=pointer]
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
  1   | import { test, expect, Browser, Page } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | import { apiLoginSetup } from '../../lib/utils/apiLoginSetup';
  4   | 
  5   | /**
  6   |  * =============================================================================
  7   |  * MODULE: Inventory - Load & Performance Suite
  8   |  * ARCHITECTURAL SCOPE & COVERAGE:
  9   |  * 1. Bulk inventory item list responds within latency threshold
  10  |  * 2. Adjustment history pagination under large dataset
  11  |  * 3. Stock level query performance across multiple locations
  12  |  * =============================================================================
  13  |  */
  14  | 
  15  | 
  16  | test.describe('Load: Concurrent Inventory Adjustments @inventory @load @full', () => {
  17  |     test.setTimeout(180000);
  18  | 
  19  |     let page: Page;
  20  |     let app: AppManager;
  21  | 
  22  |     test.beforeAll(async ({ browser }: { browser: Browser }) => {
  23  |         page = await browser.newPage();
  24  |         app = await apiLoginSetup(page);
  25  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  26  |         DateHelper.clearCache();
  27  |         await DateHelper.resolve(page);
  28  |     });
  29  | 
  30  |     test.afterAll(async () => { await page.close(); });
  31  | 
  32  |     test('LOAD: 10 concurrent +5 adjustments must produce exactly +50 net stock', async () => {
  33  |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  34  |             cost_method_code: 'WAC', quantity: 10, unit_cost: 100
  35  |         });
  36  |         const initialStock = item.currentStock;
  37  |         const CONCURRENCY = 10;
  38  |         const ADJ_QTY = 5;
  39  |         const expectedStock = initialStock + (CONCURRENCY * ADJ_QTY);
  40  | 
  41  |         console.log(`[LOAD] "${item.itemName}" | initial=${initialStock} | expected=${expectedStock}`);
  42  |         console.log(`[LOAD] Firing ${CONCURRENCY} concurrent +${ADJ_QTY} adjustments...`);
  43  | 
  44  |         const results = await Promise.allSettled(
  45  |             Array.from({ length: CONCURRENCY }, () =>
  46  |                 app.api.inventory.adjustStockAPI({
  47  |                     itemId: item.itemId, quantity: ADJ_QTY, type: 'in',
  48  |                     locationId: item.locationId, warehouseId: item.warehouseId
  49  |                 })
  50  |             )
  51  |         );
  52  | 
  53  |         const passed = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
  54  |         const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
  55  |         console.log(`[LOAD] Created: ${passed.length} | Failed: ${failed.length}`);
  56  | 
  57  |         await Promise.allSettled(
  58  |             passed.filter(r => r.value?.id).map(r => app.advanceDocumentAPI(r.value.id, 'inventory-adjustments'))
  59  |         );
  60  | 
  61  |         const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId, 30);
  62  |         console.log(`[LOAD] final=${finalStock} | expected=${expectedStock} | net=+${finalStock - initialStock}`);
  63  | 
> 64  |         expect(finalStock, `Lost update under concurrent advance: expected ${expectedStock}, got ${finalStock}`).toBe(expectedStock);
      |                                                                                                                  ^ Error: Lost update under concurrent advance: expected 60, got 45
  65  |         console.log(`[PASS] All ${CONCURRENCY} adjustments applied atomically`);
  66  |     });
  67  | 
  68  |     test('LOAD: 10 concurrent -2 adjustments on 20-unit stock must not go below zero', async () => {
  69  |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  70  |             cost_method_code: 'WAC', quantity: 20, unit_cost: 100
  71  |         });
  72  |         const initialStock = item.currentStock;
  73  |         const CONCURRENCY = 10;
  74  |         const ADJ_QTY = 2;
  75  | 
  76  |         console.log(`[LOAD] "${item.itemName}" | initial=${initialStock}`);
  77  |         console.log(`[LOAD] Firing ${CONCURRENCY} concurrent -${ADJ_QTY} adjustments (total drain: ${CONCURRENCY * ADJ_QTY})...`);
  78  | 
  79  |         const results = await Promise.allSettled(
  80  |             Array.from({ length: CONCURRENCY }, () =>
  81  |                 app.api.inventory.adjustStockAPI({
  82  |                     itemId: item.itemId, quantity: ADJ_QTY, type: 'out',
  83  |                     locationId: item.locationId, warehouseId: item.warehouseId
  84  |                 })
  85  |             )
  86  |         );
  87  | 
  88  |         const passed = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
  89  |         console.log(`[LOAD] Created: ${passed.length}`);
  90  | 
  91  |         await Promise.allSettled(
  92  |             passed.filter(r => r.value?.id).map(r => app.advanceDocumentAPI(r.value.id, 'inventory-adjustments'))
  93  |         );
  94  | 
  95  |         await page.waitForTimeout(5000);
  96  |         const finalStock = await app.api.inventory.pollStockAPI(item.itemId, 0, item.locationId, 20);
  97  |         console.log(`[LOAD] Final stock: ${finalStock} (must be >= 0)`);
  98  | 
  99  |         if (finalStock < 0) {
  100 |             throw new Error(`[CRITICAL_LOGIC_BUG] Negative stock: ${finalStock}. Concurrent out-adjustments bypassed stock floor.`);
  101 |         }
  102 |         expect(finalStock, 'Stock must never go below zero').toBeGreaterThanOrEqual(0);
  103 |         console.log(`[PASS] Stock floor maintained — final: ${finalStock}`);
  104 |     });
  105 | });
  106 | 
```