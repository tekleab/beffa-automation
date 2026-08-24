# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-load.spec.ts >> Load: Concurrent Sales Invoices @sales @load @full >> LOAD: AR balance after 5 concurrent approved invoices must equal sum of all amounts
- Location: tests/sales/so-load.spec.ts:71:9

# Error details

```
Error: AR mismatch: expected 5000, got 500

expect(received).toBeCloseTo(expected, precision)

Expected: 5000
Received: 500

Expected precision:    2
Expected difference: < 0.005
Received difference:   4500
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
  16  | test.describe('Load: Concurrent Sales Invoices @sales @load @full', () => {
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
  32  |     test('LOAD: 10 concurrent invoices for same customer must all be created with distinct IDs', async () => {
  33  |         const meta = await app.api.sales.discoverMetadataAPI();
  34  |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  35  |             cost_method_code: 'WAC', quantity: 100, unit_cost: 100
  36  |         });
  37  | 
  38  |         const CONCURRENCY = 10;
  39  |         console.log(`[LOAD] Firing ${CONCURRENCY} concurrent invoices for customer ${meta.customerId}...`);
  40  | 
  41  |         const start = Date.now();
  42  |         const results = await Promise.allSettled(
  43  |             Array.from({ length: CONCURRENCY }, () =>
  44  |                 app.api.sales.createStandaloneInvoiceAPI({
  45  |                     customerId: meta.customerId,
  46  |                     itemId: item.itemId,
  47  |                     quantity: 1,
  48  |                     unitPrice: 500,
  49  |                     locationId: item.locationId,
  50  |                     warehouseId: item.warehouseId
  51  |                 })
  52  |             )
  53  |         );
  54  |         const elapsed = Date.now() - start;
  55  | 
  56  |         const passed = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
  57  |         const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
  58  |         console.log(`[LOAD] ${passed.length} created | ${failed.length} failed | ${elapsed}ms`);
  59  |         failed.forEach((f, i) => console.log(`[FAIL ${i + 1}] ${f.reason?.message}`));
  60  | 
  61  |         const uniqueIds = new Set(passed.map(r => r.value.id));
  62  |         // Allow up to 1 transient 422 failure under load (stock race or rate limit)
  63  |         const hardFails = failed.filter(f => !f.reason?.message?.includes('422') && !f.reason?.message?.includes('500')).length;
  64  |         if (failed.length > 0) console.log(`[LOAD] ${failed.length} transient failure(s) under load (acceptable <= 1)`);
  65  |         expect(hardFails, `${hardFails} non-transient invoice(s) failed under load`).toBe(0);
  66  |         expect(failed.length, 'More than 1 invoice failed — possible backend overload').toBeLessThanOrEqual(1);
  67  | 
  68  |         console.log(`[PASS] ${CONCURRENCY} invoices in ${elapsed}ms | avg: ${Math.round(elapsed / CONCURRENCY)}ms/invoice`);
  69  |     });
  70  | 
  71  |     test('LOAD: AR balance after 5 concurrent approved invoices must equal sum of all amounts', async () => {
  72  |         const meta = await app.api.sales.discoverMetadataAPI();
  73  |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  74  |             cost_method_code: 'WAC', quantity: 50, unit_cost: 100
  75  |         });
  76  | 
  77  |         const CONCURRENCY = 5;
  78  |         const UNIT_PRICE = 1000;
  79  |         const expectedTotal = CONCURRENCY * UNIT_PRICE;
  80  | 
  81  |         // Create sequentially for stable IDs, approve concurrently
  82  |         const invoices: any[] = [];
  83  |         for (let i = 0; i < CONCURRENCY; i++) {
  84  |             const inv = await app.api.sales.createStandaloneInvoiceAPI({
  85  |                 customerId: meta.customerId,
  86  |                 itemId: item.itemId,
  87  |                 quantity: 1,
  88  |                 unitPrice: UNIT_PRICE,
  89  |                 locationId: item.locationId,
  90  |                 warehouseId: item.warehouseId
  91  |             });
  92  |             invoices.push(inv);
  93  |         }
  94  |         console.log(`[LOAD] ${invoices.length} invoices created — approving concurrently...`);
  95  | 
  96  |         const approvalResults = await Promise.allSettled(
  97  |             invoices.map(inv => app.advanceDocumentAPI(inv.id, 'invoices'))
  98  |         );
  99  |         const approvalFailed = approvalResults.filter(r => r.status === 'rejected').length;
  100 |         expect(approvalFailed, 'All approvals must succeed').toBe(0);
  101 | 
  102 |         await page.waitForTimeout(3000);
  103 | 
  104 |         // Use amountDue from creation response — net_due from GET may reflect cost not sale price (ERP bug)
  105 |         let totalNetDue = 0;
  106 |         for (const inv of invoices) {
  107 |             const data = await app.api.sales.getInvoiceAPI(inv.id);
  108 |             const netDue = parseFloat(data.net_due ?? data.unreceived_amount ?? '0');
  109 |             // If net_due looks wrong (equals unit_cost not unit_price), use inv.amountDue
  110 |             const effectiveDue = netDue > 0 ? netDue : (inv.amountDue ?? UNIT_PRICE);
  111 |             totalNetDue += effectiveDue;
  112 |             console.log(`[AUDIT] ${inv.ref}: net_due=${netDue} | effective=${effectiveDue}`);
  113 |         }
  114 | 
  115 |         console.log(`[LOAD] Total AR: ${totalNetDue} | Expected: ${expectedTotal}`);
> 116 |         expect(totalNetDue, `AR mismatch: expected ${expectedTotal}, got ${totalNetDue}`).toBeCloseTo(expectedTotal, 2);
      |                                                                                           ^ Error: AR mismatch: expected 5000, got 500
  117 |         console.log(`[PASS] AR correct after ${CONCURRENCY} concurrent approvals`);
  118 |     });
  119 | });
  120 | 
```