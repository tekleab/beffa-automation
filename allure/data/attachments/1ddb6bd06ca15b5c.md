# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-accounting.spec.ts >> Procurement Ledger & Payment Audits @purchase @logic @regression @full >> Audit: Single payment must correctly reconcile multiple unpaid bills
- Location: tests/purchase/po-accounting.spec.ts:33:9

# Error details

```
Error: Multi-bill payment failed: 422 - {
	"code": 422,
	"details": {
		"cash_account_id": [
			"insufficient balance in account Cash - Main Office: available -159926.16, required 5000.00"
		]
	},
	"message": "Validation error when creating payment"
}

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
  5   |  * PROCUREMENT LEDGER & PAYMENT AUDITS
  6   |  *
  7   |  * Objectives:
  8   |  * 1. Verify Multi-Bill reconciliation: One payment correctly impacts multiple unpaid bills.
  9   |  *
  10  |  * NOTE: Bill balance restore after payment reversal is covered in procurement-stress-edge-cases.spec.ts
  11  |  * (test 4 — Bill reversal after payment, which also validates stock rollback).
  12  |  */
  13  | 
  14  | test.describe('Procurement Ledger & Payment Audits @purchase @logic @regression @full', () => {
  15  | 
  16  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  17  |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  18  | 
  19  |     test.beforeAll(async ({ browser }) => {
  20  |         const page = await browser.newPage();
  21  |         const app = new AppManager(page);
  22  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  23  |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  24  |         sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  25  |         await page.close();
  26  |     });
  27  | 
  28  |     test.beforeEach(async ({ page }) => {
  29  |         const app = new AppManager(page);
  30  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  31  |     });
  32  | 
  33  |     test('Audit: Single payment must correctly reconcile multiple unpaid bills', async ({ page }) => {
  34  |         const app = new AppManager(page);
  35  |         const meta = sharedMeta;
  36  |         const item = sharedItem;
  37  | 
  38  |         // 1. Create and approve two bills
  39  |         console.log(`[STEP 1] Creating Bill A (3000) and Bill B (2000)...`);
  40  |         const billA = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 3000, quantity: 1, vendorId: meta.vendorId });
  41  |         const billB = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 2000, quantity: 1, vendorId: meta.vendorId });
  42  |         await app.advanceDocumentAPI(billA.id, 'bills');
  43  |         await app.advanceDocumentAPI(billB.id, 'bills');
  44  | 
  45  |         // 2. Verify both bills have non-zero balances
  46  |         const billAData = await app.api.purchase.getBillAPI(billA.id);
  47  |         const billBData = await app.api.purchase.getBillAPI(billB.id);
  48  |         const amountA = parseFloat(billAData.balance ?? billAData.amount_due ?? billAData.unpaid_amount ?? 3000);
  49  |         const amountB = parseFloat(billBData.balance ?? billBData.amount_due ?? billBData.unpaid_amount ?? 2000);
  50  |         console.log(`[SNAPSHOT] Bill A balance: ${amountA} | Bill B balance: ${amountB}`);
  51  |         expect(amountA).toBeGreaterThan(0);
  52  |         expect(amountB).toBeGreaterThan(0);
  53  | 
  54  |         // 3. Create a single payment covering both bills
  55  |         const totalAmount = amountA + amountB;
  56  |         console.log(`[STEP 2] Creating single payment of ${totalAmount} covering both bills...`);
  57  |         const { apiBase, headers, qs } = await app.buildApiContext();
  58  | 
  59  |         const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
  60  |         const acctData = await acctResp.json();
  61  |         const cashAccount = (acctData.items || acctData.data || []).find((a: any) =>
  62  |             a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')
  63  |         ) || (acctData.items || acctData.data || [])[0];
  64  | 
  65  |         const currResp = await page.request.get(`${apiBase}/currency?${qs}`, { headers });
  66  |         const currData = await currResp.json();
  67  |         const currency = currData.items?.[0] || currData.data?.[0];
  68  | 
  69  |         const paymentResp = await page.request.post(`${apiBase}/payments?${qs}`, {
  70  |             headers,
  71  |             data: {
  72  |                 amount: totalAmount,
  73  |                 cash_account_id: cashAccount?.id,
  74  |                 vendor_id: meta.vendorId,
  75  |                 date: new Date().toISOString(),
  76  |                 payment_method: 'cash',
  77  |                 currency_id: currency?.id,
  78  |                 bill_payments: [
  79  |                     { amount: amountA, bill_id: billA.id },
  80  |                     { amount: amountB, bill_id: billB.id }
  81  |                 ]
  82  |             }
  83  |         });
  84  | 
> 85  |         if (!paymentResp.ok()) throw new Error(`Multi-bill payment failed: ${paymentResp.status()} - ${await paymentResp.text()}`);
      |                                      ^ Error: Multi-bill payment failed: 422 - {
  86  |         const payment = await paymentResp.json();
  87  |         console.log(`[SUCCESS] Multi-bill payment created: ${payment.ref} (ID: ${payment.id})`);
  88  | 
  89  |         await app.advanceDocumentAPI(payment.id, 'payments');
  90  | 
  91  |         // 4. CRITICAL CHECK: Both bills must show balance = 0
  92  |         console.log(`[AUDIT] Verifying both bills are fully reconciled...`);
  93  |         const finalBillA = await app.api.purchase.getBillAPI(billA.id);
  94  |         const finalBillB = await app.api.purchase.getBillAPI(billB.id);
  95  |         const finalBalanceA = parseFloat(finalBillA.balance ?? finalBillA.amount_due ?? finalBillA.unpaid_amount ?? -1);
  96  |         const finalBalanceB = parseFloat(finalBillB.balance ?? finalBillB.amount_due ?? finalBillB.unpaid_amount ?? -1);
  97  | 
  98  |         console.log(`[SNAPSHOT] Bill A final balance: ${finalBalanceA} | Bill B final balance: ${finalBalanceB}`);
  99  | 
  100 |         if (finalBalanceA !== 0) throw new Error(`[CRITICAL_LOGIC_BUG] Bill A not fully reconciled. Balance: ${finalBalanceA}, Expected: 0`);
  101 |         if (finalBalanceB !== 0) throw new Error(`[CRITICAL_LOGIC_BUG] Bill B not fully reconciled. Balance: ${finalBalanceB}, Expected: 0`);
  102 | 
  103 |         expect(finalBalanceA).toBe(0);
  104 |         expect(finalBalanceB).toBe(0);
  105 |         console.log(`[SUCCESS] Multi-Bill Reconciliation confirmed. Both bills fully settled by single payment.`);
  106 |     });
  107 | });
  108 | 
```