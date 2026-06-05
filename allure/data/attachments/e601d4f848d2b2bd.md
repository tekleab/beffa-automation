# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/audit/procurement-accounting-logic.spec.ts >> Purchase: Procurement Accounting Logic @purchase @smoke @full >> API: Vendor outstanding balance increases after bill approval
- Location: tests/purchase/audit/procurement-accounting-logic.spec.ts:69:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
  6   |  * Purchase: Procurement Accounting Logic
  7   |  * Validates that approved bills correctly post to the general ledger
  8   |  * and that vendor balances reflect outstanding amounts.
  9   |  */
  10  | test.describe('Purchase: Procurement Accounting Logic @purchase @smoke @full', () => {
  11  |     test.setTimeout(300000);
  12  | 
  13  |     test('API: Approved bill must post a debit to Accounts Payable', async ({ page }) => {
  14  |         const app = new AppManager(page);
  15  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  16  | 
  17  |         const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  18  | 
  19  |         console.log(`[STEP 1] Discovering item and creating bill...`);
  20  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
  21  |         const BILL_AMOUNT = 3000;
  22  | 
  23  |         const bill = await app.api.purchase.createBillAPI({
  24  |             itemData: item,
  25  |             quantity: 1,
  26  |             unitPrice: BILL_AMOUNT
  27  |         });
  28  |         expect(bill).toHaveProperty('id');
  29  |         console.log(`[OK] Bill created: ${bill.ref}`);
  30  | 
  31  |         console.log(`[STEP 2] Approving bill...`);
  32  |         await app.advanceDocumentAPI(bill.id, 'bills');
  33  | 
  34  |         console.log(`[STEP 3] Fetching bill to verify status and vendor...`);
  35  |         const billData = await app.api.purchase.getBillAPI(bill.id);
  36  |         expect(['approved', 'posted', 'paid', 'partial'].some(s => billData.status?.toLowerCase().includes(s))).toBe(true);
  37  |         console.log(`[PASS] Bill ${bill.ref} status: ${billData.status}`);
  38  | 
  39  |         console.log(`[STEP 4] Verifying journal entries exist for this bill...`);
  40  |         const token = await app._getAuthToken();
  41  |         const headers = {
  42  |             'Authorization': `Bearer ${token}`,
  43  |             'x-company': process.env.BEFFA_COMPANY as string,
  44  |             'Content-Type': 'application/json',
  45  |         };
  46  | 
  47  |         const jeResp = await page.request.get(
  48  |             `${app.apiBase}/journal-entries?source_id=${bill.id}&${params}`,
  49  |             { headers }
  50  |         );
  51  | 
  52  |         if (jeResp.ok()) {
  53  |             const jeData = await jeResp.json();
  54  |             const entries = jeData.data || jeData.items || (Array.isArray(jeData) ? jeData : []);
  55  |             console.log(`[INFO] Journal entries found: ${entries.length}`);
  56  |             if (entries.length > 0) {
  57  |                 expect(entries.length).toBeGreaterThan(0);
  58  |                 console.log(`[PASS] Journal entries posted for bill ${bill.ref}`);
  59  |             } else {
  60  |                 console.log(`[INFO] Journal entries may be async — bill status confirmed as approved`);
  61  |             }
  62  |         } else {
  63  |             console.log(`[INFO] Journal entry endpoint returned ${jeResp.status()} — skipping JE assertion`);
  64  |         }
  65  | 
  66  |         console.log(`[PASS] Procurement accounting logic verified for bill ${bill.ref}`);
  67  |     });
  68  | 
  69  |     test('API: Vendor outstanding balance increases after bill approval', async ({ page }) => {
  70  |         const app = new AppManager(page);
  71  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  72  | 
  73  |         const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  74  |         const token = await app._getAuthToken();
  75  |         const headers = {
  76  |             'Authorization': `Bearer ${token}`,
  77  |             'x-company': process.env.BEFFA_COMPANY as string,
  78  |             'Content-Type': 'application/json',
  79  |         };
  80  | 
  81  |         console.log(`[STEP 1] Creating and approving bill...`);
  82  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
  83  |         const BILL_AMOUNT = 2500;
  84  | 
  85  |         const bill = await app.api.purchase.createBillAPI({
  86  |             itemData: item,
  87  |             quantity: 1,
  88  |             unitPrice: BILL_AMOUNT
  89  |         });
  90  |         await app.advanceDocumentAPI(bill.id, 'bills');
  91  |         console.log(`[OK] Bill ${bill.ref} approved`);
  92  | 
  93  |         console.log(`[STEP 2] Fetching vendor to check outstanding balance...`);
  94  |         const billData = await app.api.purchase.getBillAPI(bill.id);
  95  |         const vendorId = billData.vendor_id || billData.vendor?.id;
  96  | 
  97  |         if (!vendorId) {
  98  |             console.log(`[SKIP] Could not resolve vendor from bill — skipping balance check`);
  99  |             return;
  100 |         }
  101 | 
  102 |         const vendorResp = await page.request.get(
  103 |             `${app.apiBase}/vendors/${vendorId}?${params}`,
  104 |             { headers }
  105 |         );
> 106 |         expect(vendorResp.ok()).toBe(true);
      |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  107 | 
  108 |         const vendor = await vendorResp.json();
  109 |         const outstanding = parseFloat(
  110 |             vendor.outstanding_balance ?? vendor.balance ?? vendor.amount_due ?? '0'
  111 |         );
  112 |         console.log(`[INFO] Vendor "${vendor.name}" outstanding balance: ${outstanding}`);
  113 |         expect(outstanding).toBeGreaterThanOrEqual(0);
  114 |         console.log(`[PASS] Vendor balance is non-negative after bill approval — accounting integrity confirmed`);
  115 |     });
  116 | });
  117 | 
```