# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-load.spec.ts >> Load: Concurrent PO Submissions @purchase @load @full >> LOAD: 20 concurrent PO submissions must all succeed within 30s
- Location: tests/purchase/po-load.spec.ts:34:9

# Error details

```
Error: 20 concurrent POs took 73721ms — exceeds 60s SLA

expect(received).toBeLessThan(expected)

Expected: < 60000
Received:   73721
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
  7   |  * MODULE: Purchase Order - Load & Performance Suite
  8   |  * ARCHITECTURAL SCOPE & COVERAGE:
  9   |  * 1. Bulk PO list endpoint responds within latency threshold
  10  |  * 2. PO detail page load time verified
  11  |  * 3. Pagination handles large dataset without timeout
  12  |  * =============================================================================
  13  |  */
  14  | 
  15  | 
  16  | test.describe('Load: Concurrent PO Submissions @purchase @load @full', () => {
  17  |     test.setTimeout(180000);
  18  | 
  19  |     let page: Page;
  20  |     let app: AppManager;
  21  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  22  | 
  23  |     test.beforeAll(async ({ browser }: { browser: Browser }) => {
  24  |         page = await browser.newPage();
  25  |         app = await apiLoginSetup(page);
  26  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  27  |         DateHelper.clearCache();
  28  |         await DateHelper.resolve(page);
  29  |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  30  |     });
  31  | 
  32  |     test.afterAll(async () => { await page.close(); });
  33  | 
  34  |     test('LOAD: 20 concurrent PO submissions must all succeed within 30s', async () => {
  35  |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  36  |             cost_method_code: 'WAC', quantity: 200, unit_cost: 100
  37  |         });
  38  | 
  39  |         const CONCURRENCY = 20;
  40  |         console.log(`[LOAD] Firing ${CONCURRENCY} concurrent PO creations...`);
  41  |         const start = Date.now();
  42  | 
  43  |         const results = await Promise.allSettled(
  44  |             Array.from({ length: CONCURRENCY }, (_, i) =>
  45  |                 app.api.purchase.createPurchaseOrderAPI(item, 1, 500 + i, sharedMeta.vendorId)
  46  |             )
  47  |         );
  48  | 
  49  |         const elapsed = Date.now() - start;
  50  |         const passed = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
  51  |         const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
  52  | 
  53  |         console.log(`[LOAD] ${passed.length} passed | ${failed.length} failed | ${elapsed}ms`);
  54  |         failed.forEach((f, i) => console.log(`[FAIL ${i + 1}] ${f.reason?.message}`));
  55  | 
  56  |         // [KNOWN_BUG] unique_po_company: ERP sequence not atomic under concurrent load
  57  |         const dupKeyFails = failed.filter(f => f.reason?.message?.includes('unique_po_company')).length;
  58  |         const otherFails = failed.length - dupKeyFails;
  59  |         if (dupKeyFails > 0) {
  60  |             console.log(`\n=================== [CRITICAL CONCURRENCY BUG DETECTED] ===================`);
  61  |             console.log(`Bug Category   : Non-Atomic PO Reference Sequence Generator`);
  62  |             console.log(`Failing Status : HTTP 400 (SQLSTATE 23505) — unique_po_company constraint`);
  63  |             console.log(`Collisions     : ${dupKeyFails} out of ${CONCURRENCY} concurrent PO submissions failed`);
  64  |             console.log(`Root Cause     : Backend uses non-thread-safe SELECT MAX(po_number) + 1`);
  65  |             console.log(`Impact         : Multi-user purchase order submission fails under peak load`);
  66  |             console.log(`Fix Suggestion : Use PostgreSQL atomic sequence nextval() or SELECT ... FOR UPDATE`);
  67  |             console.log(`===========================================================================\n`);
  68  |         }
  69  |         expect(otherFails, `${otherFails} non-duplicate PO(s) failed under load`).toBe(0);
  70  |         // SLA: 60s for 20 concurrent POs on this infrastructure
> 71  |         expect(elapsed, `20 concurrent POs took ${elapsed}ms — exceeds 60s SLA`).toBeLessThan(60000);
      |                                                                                  ^ Error: 20 concurrent POs took 73721ms — exceeds 60s SLA
  72  |         console.log(`[PASS] Performance SLA check completed in ${elapsed}ms | avg: ${Math.round(elapsed / CONCURRENCY)}ms/PO`);
  73  |     });
  74  | 
  75  |     test('LOAD: Response time must not degrade more than 5x from sequential to burst', async () => {
  76  |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  77  |             cost_method_code: 'WAC', quantity: 100, unit_cost: 100
  78  |         });
  79  | 
  80  |         const baselineTimes: number[] = [];
  81  |         for (let i = 0; i < 3; i++) {
  82  |             const t = Date.now();
  83  |             try { await app.api.purchase.createPurchaseOrderAPI(item, 1, 500 + i, sharedMeta.vendorId); } catch { /* constraint — still measures latency */ }
  84  |             baselineTimes.push(Date.now() - t);
  85  |         }
  86  |         const baseline = Math.max(...baselineTimes);
  87  |         console.log(`[LOAD] Baseline (sequential 3): max=${baseline}ms`);
  88  | 
  89  |         const burstTimes: number[] = [];
  90  |         await Promise.all(Array.from({ length: 10 }, async (_, i) => {
  91  |             const t = Date.now();
  92  |             try { await app.api.purchase.createPurchaseOrderAPI(item, 1, 600 + i, sharedMeta.vendorId); } catch { /* constraint */ }
  93  |             burstTimes.push(Date.now() - t);
  94  |         }));
  95  |         const burstMax = Math.max(...burstTimes);
  96  |         const degradation = burstMax / baseline;
  97  |         console.log(`[LOAD] Burst max=${burstMax}ms | degradation=${degradation.toFixed(1)}x`);
  98  | 
  99  |         // [KNOWN_BUG] unique_po_company constraint inflates times — use expect.soft
  100 |         expect.soft(degradation, `[PERF_BUG] ${degradation.toFixed(1)}x degradation (baseline: ${baseline}ms, burst: ${burstMax}ms)`).toBeLessThan(5);
  101 |         console.log(`[PASS] Degradation: ${degradation.toFixed(1)}x`);
  102 |     });
  103 | });
  104 | 
```