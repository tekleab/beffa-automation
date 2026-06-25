# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-payment-attacks.spec.ts >> Procurement Payment Attack Vectors @purchase @security @logic @regression @full >> Guardrail: System must reject payment where split array does not match total
- Location: tests/purchase/po-payment-attacks.spec.ts:155:9

# Error details

```
"beforeAll" hook timeout of 120000ms exceeded.
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
  1   | import { test } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * PROCUREMENT PAYMENT ATTACK VECTORS
  6   |  *
  7   |  * Scenarios targeting payment manipulation vulnerabilities:
  8   |  * 1. Zero-amount payment approval — ghost accounting entry
  9   |  * 2. Negative payment amount — reverse cash flow injection
  10  |  * 3. Payment split array mismatch — bill_payments sum != payment total
  11  |  */
  12  | 
  13  | test.describe('Procurement Payment Attack Vectors @purchase @security @logic @regression @full', () => {
  14  | 
  15  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  16  |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  17  | 
  18  |     // ── Shared audit table printer ─────────────────────────────────────────
  19  |     const printAuditTable = (title: string, rows: [string, string][], result: boolean, verdict: string) => {
  20  |         const W = { l: 32, v: 36 };
  21  |         const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
  22  |         const line = '─'.repeat(W.l + W.v + 7);
  23  |         console.log(`\n  ┌${line}┐`);
  24  |         console.log(`  │ ${pad(title, W.l + W.v + 3)} │`);
  25  |         console.log(`  ├${line}┤`);
  26  |         for (const [label, value] of rows) {
  27  |             console.log(`  │ ${pad(label, W.l)} │ ${pad(value, W.v)} │`);
  28  |         }
  29  |         console.log(`  ├${line}┤`);
  30  |         console.log(`  │ ${pad('Result', W.l)} │ ${pad(result ? `✓ PASS — ${verdict}` : `✗ FAIL — ${verdict}`, W.v)} │`);
  31  |         console.log(`  └${line}┘\n`);
  32  |     };
  33  | 
> 34  |     test.beforeAll(async ({ browser }) => {
      |          ^ "beforeAll" hook timeout of 120000ms exceeded.
  35  |         const page = await browser.newPage();
  36  |         const app = new AppManager(page);
  37  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  38  |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  39  |         sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  40  |         await page.close();
  41  |     });
  42  | 
  43  |     test.beforeEach(async ({ page }) => {
  44  |         const app = new AppManager(page);
  45  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  46  |     });
  47  | 
  48  |     // ── 1. ZERO-AMOUNT PAYMENT APPROVAL ──────────────────────────────────────
  49  |     test('Guardrail: System must reject approval of a zero-amount payment', async ({ page }) => {
  50  |         const app = new AppManager(page);
  51  |         const meta = sharedMeta;
  52  |         const item = sharedItem;
  53  |         const BILL_AMOUNT = 5000;
  54  |         const ATTACK_AMOUNT = 0;
  55  | 
  56  |         console.log(`[STEP 1] Creating & approving Bill for ${BILL_AMOUNT}...`);
  57  |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: BILL_AMOUNT, quantity: 1, vendorId: meta.vendorId });
  58  |         await app.advanceDocumentAPI(bill.id, 'bills');
  59  |         console.log(`[BILL] ${bill.ref} (${bill.id})`);
  60  | 
  61  |         console.log(`[ATTACK] Attempting to create and approve a ${ATTACK_AMOUNT}.00 payment against live bill...`);
  62  |         let blocked = false;
  63  |         let blockReason = '';
  64  |         let balance: number | null = null;
  65  | 
  66  |         try {
  67  |             const zeroPayment = await app.api.purchase.createBillPaymentAPI({ amount: ATTACK_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  68  |             console.log(`[INFO] Zero payment created: ${zeroPayment.ref} (${zeroPayment.id})`);
  69  |             await app.advanceDocumentAPI(zeroPayment.id, 'payments');
  70  | 
  71  |             const billData = await app.api.purchase.getBillAPI(bill.id);
  72  |             balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? -1);
  73  |             console.log(`[RESULT] Bill balance after 0.00 payment: ${balance}`);
  74  | 
  75  |             if (balance === BILL_AMOUNT) {
  76  |                 blocked = false;
  77  |                 blockReason = `Ghost entry: payment approved but balance unchanged at ${balance}`;
  78  |             } else if (balance < BILL_AMOUNT) {
  79  |                 blocked = false;
  80  |                 blockReason = `Accounting corruption: 0.00 payment reduced balance to ${balance}`;
  81  |             }
  82  |         } catch (err: any) {
  83  |             blocked = true;
  84  |             blockReason = err.message.substring(0, 60);
  85  |         }
  86  | 
  87  |         printAuditTable('Zero-Amount Payment Guardrail', [
  88  |             ['Bill Ref', bill.ref],
  89  |             ['Bill ID', bill.id],
  90  |             ['Bill Amount', `$${BILL_AMOUNT.toFixed(2)}`],
  91  |             ['Attack Payment Amount', `$${ATTACK_AMOUNT.toFixed(2)}`],
  92  |             ['Bill Balance After', balance !== null ? `$${balance.toFixed(2)}` : 'N/A (blocked at creation)'],
  93  |             ['Block Reason', blockReason || 'Rejected at API layer'],
  94  |         ], blocked, blocked ? 'Zero-amount payment blocked' : 'VULNERABILITY CONFIRMED');
  95  | 
  96  |         if (!blocked) {
  97  |             throw new Error(`[CRITICAL_LOGIC_BUG] Zero-amount payment approved. ${blockReason}`);
  98  |         }
  99  |         console.log(`[PASS] Zero-amount payment correctly blocked.`);
  100 |     });
  101 | 
  102 |     // ── 2. NEGATIVE PAYMENT AMOUNT ────────────────────────────────────────────
  103 |     test('Guardrail: System must reject a negative payment amount', async ({ page }) => {
  104 |         const app = new AppManager(page);
  105 |         const meta = sharedMeta;
  106 |         const item = sharedItem;
  107 |         const BILL_AMOUNT = 5000;
  108 |         const ATTACK_AMOUNT = -5000;
  109 | 
  110 |         console.log(`[STEP 1] Creating & approving Bill for ${BILL_AMOUNT}...`);
  111 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: BILL_AMOUNT, quantity: 1, vendorId: meta.vendorId });
  112 |         await app.advanceDocumentAPI(bill.id, 'bills');
  113 |         console.log(`[BILL] ${bill.ref} (${bill.id})`);
  114 | 
  115 |         console.log(`[ATTACK] Attempting to create a payment of ${ATTACK_AMOUNT}...`);
  116 |         let blocked = false;
  117 |         let blockReason = '';
  118 |         let balance: number | null = null;
  119 | 
  120 |         try {
  121 |             const negPayment = await app.api.purchase.createBillPaymentAPI({ amount: ATTACK_AMOUNT, billId: bill.id, vendorId: meta.vendorId });
  122 |             console.log(`[INFO] Negative payment created: ${negPayment.ref} (${negPayment.id})`);
  123 |             await app.advanceDocumentAPI(negPayment.id, 'payments');
  124 | 
  125 |             const billData = await app.api.purchase.getBillAPI(bill.id);
  126 |             balance = parseFloat(billData.balance ?? billData.amount_due ?? billData.unpaid_amount ?? -1);
  127 |             console.log(`[RESULT] Bill balance after ${ATTACK_AMOUNT} payment: ${balance}`);
  128 | 
  129 |             if (balance > BILL_AMOUNT) {
  130 |                 blockReason = `Balance INFLATED to ${balance} — reverse cash flow injection confirmed`;
  131 |             } else {
  132 |                 blockReason = `Negative payment accepted. Balance: ${balance}`;
  133 |             }
  134 |         } catch (err: any) {
```