# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-concurrency.spec.ts >> Inventory Concurrency & Race Condition Audits @inventory @concurrency @security @regression @full >> Guardrail: System must handle concurrent stock adjustments atomically
- Location: tests/inventory/inv-concurrency.spec.ts:25:9

# Error details

```
Error: Concurrent adjustments caused lost updates: expected 40, got 30

expect(received).toBe(expected) // Object.is equality

Expected: 40
Received: 30
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
  1  | import { test, expect } from'@playwright/test';
  2  | import { AppManager } from'../../pages/AppManager';
  3  | 
  4  | /**
  5  |  * =============================================================================
  6  |  * MODULE: Inventory - Concurrent Adjustment & Race Condition Suite
  7  |  * ARCHITECTURAL SCOPE & COVERAGE:
  8  |  * 1. Simultaneous adjustments on same item do not corrupt stock levels
  9  |  * 2. Stock balance remains accurate under concurrent reads/writes
  10 |  * =============================================================================
  11 |  */
  12 | 
  13 | 
  14 | 
  15 | /**
  16 |  * INVENTORY CONCURRENCY & RACE CONDITIONS
  17 |  * 
  18 |  * Objectives:
  19 |  * 1. Verify simultaneous stock adjustments don't result in lost updates.
  20 |  * 2. Verify thread-safe locking on the item stock row.
  21 |  */
  22 | 
  23 | test.describe('Inventory Concurrency & Race Condition Audits @inventory @concurrency @security @regression @full', () => {
  24 | 
  25 |     test('Guardrail: System must handle concurrent stock adjustments atomically', async ({ page }) => {
  26 |         const app = new AppManager(page);
  27 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  28 | 
  29 |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  30 |         const initialStock = item.currentStock;
  31 |         const adjustment = 10;
  32 |         const expectedStock = initialStock + (adjustment * 2);
  33 | 
  34 |         console.log(`[ATTACK] Triggering 2 CONCURRENT adjustments (+10 each) for ${item.itemName}...`);
  35 |         
  36 |         // Fire both at once - use both locationId and warehouseId to ensure item exists in the location
  37 |         const [res1, res2] = await Promise.allSettled([
  38 |             app.api.inventory.adjustStockAPI({ itemId: item.itemId, quantity: adjustment, type:'in', locationId: item.locationId, warehouseId: item.warehouseId }),
  39 |             app.api.inventory.adjustStockAPI({ itemId: item.itemId, quantity: adjustment, type:'in', locationId: item.locationId, warehouseId: item.warehouseId })
  40 |         ]);
  41 | 
  42 |         // Log adjustment IDs for manual tracking
  43 |         const adj1Id = res1.status === 'fulfilled' && res1.value.success ? res1.value.id : 'FAILED';
  44 |         const adj2Id = res2.status === 'fulfilled' && res2.value.success ? res2.value.id : 'FAILED';
  45 |         console.log(`[INFO] Adjustment 1 ID: ${adj1Id} | Adjustment 2 ID: ${adj2Id}`);
  46 | 
  47 |         // Advance both adjustments to approved status
  48 |         if (adj1Id !== 'FAILED') {
  49 |             await app.advanceDocumentAPI(adj1Id, 'inventory-adjustments');
  50 |             console.log(`[SUCCESS] Advanced Adjustment 1 to approved: ${adj1Id}`);
  51 |         }
  52 |         if (adj2Id !== 'FAILED') {
  53 |             await app.advanceDocumentAPI(adj2Id, 'inventory-adjustments');
  54 |             console.log(`[SUCCESS] Advanced Adjustment 2 to approved: ${adj2Id}`);
  55 |         }
  56 | 
  57 |         console.log(`[ACTION] Verifying Final Stock Integrity...`);
  58 |         const finalStock = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId, 4);
  59 |         
  60 |         console.log(`[SNAPSHOT] Start: ${initialStock} | Final: ${finalStock} | Expected: ${expectedStock}`);
  61 | 
> 62 |         expect(finalStock, `Concurrent adjustments caused lost updates: expected ${expectedStock}, got ${finalStock}`).toBe(expectedStock);
     |                                                                                                                        ^ Error: Concurrent adjustments caused lost updates: expected 40, got 30
  63 |         console.log(`[PASS] Inventory Concurrency verified. No lost updates detected.`);
  64 |     });
  65 | });
  66 | 
```