# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-payment-load-stress.spec.ts >> Bill Payment Load & Stress Audits @purchase @load @stress @regression @full >> LOAD: Concurrently approving 5 bill payments must succeed without database deadlocks
- Location: tests/purchase/bill-payment-load-stress.spec.ts:49:9

# Error details

```
Error: Database deadlocks/concurrency errors during concurrent payment approvals

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
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
  9   |  * ARCHITECTURAL SCOPE & COVERAGE:
  10  |  * 1. Concurrent bill payment creation under high load
  11  |  * 2. AP sub-ledger balance accuracy under concurrent payments
  12  |  * 3. Bulk bill payment list response time thresholds
  13  |  * =============================================================================
  14  |  */
  15  | 
  16  | 
  17  | /**
  18  |  * BILL PAYMENT LOAD & STRESS SUITE
  19  |  * 
  20  |  * Verifies AP payment performance, concurrency safety, and transaction integrity under load.
  21  |  * 
  22  |  * Scenarios:
  23  |  * 1. LOAD: Approve multiple bill payments concurrently for the same vendor.
  24  |  * 2. STRESS: Concurrent submission of duplicate payments against the same bill (double payment avoidance).
  25  |  * 3. STRESS: Payment against a bill that was reversed mid-flight.
  26  |  */
  27  | 
  28  | test.describe('Bill Payment Load & Stress Audits @purchase @load @stress @regression @full', () => {
  29  |     test.setTimeout(240000);
  30  | 
  31  |     let page: Page;
  32  |     let app: AppManager;
  33  | 
  34  |     test.beforeAll(async ({ browser }: { browser: Browser }) => {
  35  |         page = await browser.newPage();
  36  |         app = await apiLoginSetup(page);
  37  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  38  |         DateHelper.clearCache();
  39  |         await DateHelper.resolve(page);
  40  |     });
  41  | 
  42  |     test.afterAll(async () => {
  43  |         try {
  44  |             await page.close();
  45  |         } catch (e) {}
  46  |     });
  47  | 
  48  |     // ── 1. LOAD: CONCURRENT BILL PAYMENT APPROVALS ────────────────────────────
  49  |     test('LOAD: Concurrently approving 5 bill payments must succeed without database deadlocks', async () => {
  50  |         const meta = await app.api.purchase.discoverMetadataAPI();
  51  |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  52  |             cost_method_code: 'FIFO', quantity: 100, unit_cost: 100
  53  |         });
  54  | 
  55  |         const CONCURRENCY = 5;
  56  |         const BILL_AMOUNT = 1000;
  57  | 
  58  |         // Create 5 separate bills
  59  |         const bills: any[] = [];
  60  |         for (let i = 0; i < CONCURRENCY; i++) {
  61  |             const bill = await app.api.purchase.createBillAPI({
  62  |                 itemData: item,
  63  |                 quantity: 1,
  64  |                 unitPrice: BILL_AMOUNT,
  65  |                 vendorId: meta.vendorId
  66  |             });
  67  |             await app.advanceDocumentAPI(bill.id, 'bills');
  68  |             bills.push(bill);
  69  |         }
  70  | 
  71  |         console.log(`[LOAD] Created ${CONCURRENCY} approved bills. Creating payments...`);
  72  | 
  73  |         // Pre-seed cash account to avoid 422 insufficient balance during concurrent approvals
  74  |         const accounts = await app.base.getAllAccountsAPI();
  75  |         const cashAccount = accounts.find((a: any) =>
  76  |             (a.type || a.account_type || '').toLowerCase().includes('cash') || 
  77  |             (a.type || a.account_type || '').toLowerCase().includes('bank')
  78  |         ) || accounts[0];
  79  |         console.log(`[LOAD] Pre-seeding Cash Account ${cashAccount.name} with ${BILL_AMOUNT * CONCURRENCY}...`);
  80  |         await app.base.seedCashBalanceAPI(BILL_AMOUNT * CONCURRENCY, cashAccount.id);
  81  | 
  82  |         // Create 5 corresponding draft payments
  83  |         const payments: any[] = [];
  84  |         for (const bill of bills) {
  85  |             const payment = await app.api.purchase.createBillPaymentAPI({
  86  |                 amount: BILL_AMOUNT,
  87  |                 billId: bill.id,
  88  |                 vendorId: meta.vendorId
  89  |             });
  90  |             payments.push(payment);
  91  |         }
  92  | 
  93  |         console.log(`[LOAD] Approving ${CONCURRENCY} payments concurrently...`);
  94  |         const start = Date.now();
  95  |         const results = await Promise.allSettled(
  96  |             payments.map(p => app.advanceDocumentAPI(p.id, 'payments'))
  97  |         );
  98  |         const elapsed = Date.now() - start;
  99  | 
  100 |         const passed = results.filter(r => r.status === 'fulfilled').length;
  101 |         const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
  102 | 
  103 |         console.log(`[LOAD] Payments approval: ${passed} passed | ${failed.length} failed in ${elapsed}ms`);
  104 |         
  105 |         if (failed.length > 0) {
  106 |             failed.forEach((f, idx) => console.log(`[FAIL ${idx + 1}] ${f.reason?.message}`));
  107 |         }
  108 | 
> 109 |         expect(failed.length, 'Database deadlocks/concurrency errors during concurrent payment approvals').toBe(0);
      |                                                                                                            ^ Error: Database deadlocks/concurrency errors during concurrent payment approvals
  110 | 
  111 |         // Verify all bills are now fully paid
  112 |         for (const bill of bills) {
  113 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  114 |             const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? '-1');
  115 |             expect(balance).toBeLessThanOrEqual(0.01);
  116 |         }
  117 |         console.log(`[PASS] All ${CONCURRENCY} bills verified paid in full.`);
  118 |     });
  119 | 
  120 |     // ── 2. STRESS: CONCURRENT DUPLICATE PAYMENTS (RACE CONDITION) ──────────────
  121 |     test('STRESS: Concurrent duplicate payment submittals against same bill must be blocked', async () => {
  122 |         test.fail(true, '[CONFIRMED BUG] Double payment race condition in ERP backend');
  123 |         const meta = await app.api.purchase.discoverMetadataAPI();
  124 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  125 |             cost_method_code: 'FIFO', quantity: 20, unit_cost: 100
  126 |         });
  127 | 
  128 |         const BILL_AMOUNT = 2500;
  129 |         const bill = await app.api.purchase.createBillAPI({
  130 |             itemData: item,
  131 |             quantity: 1,
  132 |             unitPrice: BILL_AMOUNT,
  133 |             vendorId: meta.vendorId
  134 |         });
  135 |         await app.advanceDocumentAPI(bill.id, 'bills');
  136 |         console.log(`[STRESS] Bill ${bill.ref} approved | amount: ${BILL_AMOUNT}`);
  137 | 
  138 |         // Fire 2 concurrent payments for the full bill amount
  139 |         console.log(`[STRESS] Creating 2 concurrent payments for full amount...`);
  140 |         const p1Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  141 |         const p2Promise = app.api.purchase.createBillPaymentAPI({ amount: BILL_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  142 | 
  143 |         const [p1Res, p2Res] = await Promise.allSettled([p1Promise, p2Promise]);
  144 |         
  145 |         const validPayments: any[] = [];
  146 |         if (p1Res.status === 'fulfilled') validPayments.push(p1Res.value);
  147 |         if (p2Res.status === 'fulfilled') validPayments.push(p2Res.value);
  148 | 
  149 |         console.log(`[STRESS] Created ${validPayments.length} payment documents.`);
  150 | 
  151 |         if (validPayments.length === 2) {
  152 |             console.log(`[STRESS] Approving both payments concurrently to trigger race condition...`);
  153 |             const approveRes = await Promise.allSettled(
  154 |                 validPayments.map(p => app.advanceDocumentAPI(p.id, 'payments'))
  155 |             );
  156 | 
  157 |             const approvedCount = approveRes.filter(r => r.status === 'fulfilled').length;
  158 |             console.log(`[STRESS] Approved ${approvedCount} of 2 payments.`);
  159 | 
  160 |             // Fetch final bill status
  161 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  162 |             const balance = parseFloat(billData.unpaid_amount ?? billData.balance ?? '0');
  163 |             console.log(`[STRESS] Final bill balance: ${balance}`);
  164 | 
  165 |             if (approvedCount === 2) {
  166 |                 throw new Error(`[DOUBLE_PAYMENT_BUG] Race condition allowed: both payments approved concurrently for bill ${bill.ref}!`);
  167 |             }
  168 | 
  169 |             expect(approvedCount).toBeLessThan(2);
  170 |         } else {
  171 |             console.log(`[PASS] Concurrent draft creation rejected duplicate call correctly.`);
  172 |         }
  173 |     });
  174 | 
  175 |     // ── 3. STRESS: PAYMENT AGAINST MID-FLIGHT REVERSED BILL ──────────────────
  176 |     test('STRESS: Payment against a bill reversed mid-flight must be rejected', async () => {
  177 |         test.fail(true, '[CONFIRMED BUG] Payment approved against reversed bill');
  178 |         const meta = await app.api.purchase.discoverMetadataAPI();
  179 |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  180 |             cost_method_code: 'FIFO', quantity: 20, unit_cost: 100
  181 |         });
  182 | 
  183 |         const BILL_AMOUNT = 3000;
  184 |         const bill = await app.api.purchase.createBillAPI({
  185 |             itemData: item,
  186 |             quantity: 1,
  187 |             unitPrice: BILL_AMOUNT,
  188 |             vendorId: meta.vendorId
  189 |         });
  190 |         await app.advanceDocumentAPI(bill.id, 'bills');
  191 |         console.log(`[STRESS] Bill ${bill.ref} approved.`);
  192 | 
  193 |         // Create draft payment
  194 |         const payment = await app.api.purchase.createBillPaymentAPI({
  195 |             amount: BILL_AMOUNT,
  196 |             billId: bill.id,
  197 |             vendorId: meta.vendorId
  198 |         });
  199 |         console.log(`[STRESS] Draft payment ${payment.ref} created.`);
  200 | 
  201 |         // Reverse the bill
  202 |         const reversed = await app.api.purchase.reverseBillAPI(bill.id);
  203 |         expect(reversed).toBe(true);
  204 |         console.log(`[STRESS] Bill ${bill.ref} reversed successfully.`);
  205 | 
  206 |         // Now attempt to approve the payment against the reversed bill
  207 |         console.log(`[STRESS] Attempting to approve payment ${payment.ref} against reversed bill...`);
  208 |         let approved = false;
  209 |         try {
```