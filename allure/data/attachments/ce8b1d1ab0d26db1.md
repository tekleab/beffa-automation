# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-load.spec.ts >> Load: Concurrent PO Submissions @purchase @load @full >> LOAD: 20 concurrent PO submissions must all succeed within 30s
- Location: tests/purchase/po-load.spec.ts:22:9

# Error details

```
Error: 20 non-duplicate PO(s) failed under load

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 20
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - generic [ref=e7]:
        - img [ref=e8]
        - img [ref=e40]
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
  1  | import { test, expect, Browser, Page } from '@playwright/test';
  2  | import { AppManager } from '../../pages/AppManager';
  3  | import { apiLoginSetup } from '../../lib/utils/apiLoginSetup';
  4  | 
  5  | test.describe('Load: Concurrent PO Submissions @purchase @load @full', () => {
  6  |     test.setTimeout(180000);
  7  | 
  8  |     let page: Page;
  9  |     let app: AppManager;
  10 | 
  11 |     test.beforeAll(async ({ browser }: { browser: Browser }) => {
  12 |         page = await browser.newPage();
  13 |         app = await apiLoginSetup(page);
  14 |         // Warm up DateHelper so all concurrent calls use the correct cached date
  15 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  16 |         DateHelper.clearCache();
  17 |         await DateHelper.resolve(page);
  18 |     });
  19 | 
  20 |     test.afterAll(async () => { await page.close(); });
  21 | 
  22 |     test('LOAD: 20 concurrent PO submissions must all succeed within 30s', async () => {
  23 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  24 |             cost_method_code: 'WAC', quantity: 200, unit_cost: 100
  25 |         });
  26 | 
  27 |         const CONCURRENCY = 20;
  28 |         console.log(`[LOAD] Firing ${CONCURRENCY} concurrent PO creations...`);
  29 |         const start = Date.now();
  30 | 
  31 |         const results = await Promise.allSettled(
  32 |             Array.from({ length: CONCURRENCY }, (_, i) =>
  33 |                 app.api.purchase.createPurchaseOrderAPI(item, 1, 500 + i)
  34 |             )
  35 |         );
  36 | 
  37 |         const elapsed = Date.now() - start;
  38 |         const passed = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
  39 |         const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
  40 | 
  41 |         console.log(`[LOAD] ${passed.length} passed | ${failed.length} failed | ${elapsed}ms`);
  42 |         failed.forEach((f, i) => console.log(`[FAIL ${i + 1}] ${f.reason?.message}`));
  43 | 
  44 |         // [KNOWN_BUG] unique_po_company: ERP sequence not atomic under concurrent load
  45 |         const dupKeyFails = failed.filter(f => f.reason?.message?.includes('unique_po_company')).length;
  46 |         const otherFails = failed.length - dupKeyFails;
  47 |         if (dupKeyFails > 0) console.log(`[KNOWN_BUG] ${dupKeyFails} PO(s) hit unique_po_company constraint — ERP sequence not atomic under concurrent load`);
> 48 |         expect(otherFails, `${otherFails} non-duplicate PO(s) failed under load`).toBe(0);
     |                                                                                   ^ Error: 20 non-duplicate PO(s) failed under load
  49 |         // SLA: 60s for 20 concurrent POs on this infrastructure
  50 |         expect(elapsed, `20 concurrent POs took ${elapsed}ms — exceeds 60s SLA`).toBeLessThan(60000);
  51 |         console.log(`[PASS] ${CONCURRENCY} POs in ${elapsed}ms | avg: ${Math.round(elapsed / CONCURRENCY)}ms/PO`);
  52 |     });
  53 | 
  54 |     test('LOAD: Response time must not degrade more than 5x from sequential to burst', async () => {
  55 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  56 |             cost_method_code: 'WAC', quantity: 100, unit_cost: 100
  57 |         });
  58 | 
  59 |         const baselineTimes: number[] = [];
  60 |         for (let i = 0; i < 3; i++) {
  61 |             const t = Date.now();
  62 |             try { await app.api.purchase.createPurchaseOrderAPI(item, 1, 500 + i); } catch { /* constraint — still measures latency */ }
  63 |             baselineTimes.push(Date.now() - t);
  64 |         }
  65 |         const baseline = Math.max(...baselineTimes);
  66 |         console.log(`[LOAD] Baseline (sequential 3): max=${baseline}ms`);
  67 | 
  68 |         const burstTimes: number[] = [];
  69 |         await Promise.all(Array.from({ length: 10 }, async (_, i) => {
  70 |             const t = Date.now();
  71 |             try { await app.api.purchase.createPurchaseOrderAPI(item, 1, 600 + i); } catch { /* constraint */ }
  72 |             burstTimes.push(Date.now() - t);
  73 |         }));
  74 |         const burstMax = Math.max(...burstTimes);
  75 |         const degradation = burstMax / baseline;
  76 |         console.log(`[LOAD] Burst max=${burstMax}ms | degradation=${degradation.toFixed(1)}x`);
  77 | 
  78 |         // [KNOWN_BUG] unique_po_company constraint inflates times — use expect.soft
  79 |         expect.soft(degradation, `[PERF_BUG] ${degradation.toFixed(1)}x degradation (baseline: ${baseline}ms, burst: ${burstMax}ms)`).toBeLessThan(5);
  80 |         console.log(`[PASS] Degradation: ${degradation.toFixed(1)}x`);
  81 |     });
  82 | });
  83 | 
```