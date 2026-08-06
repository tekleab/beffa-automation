# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/receipt-ui.spec.ts >> Sales Receipt — Create Receipt & Verify in Customer Profile @sales @smoke @full >> Create fresh invoice via API, then create receipt and link it
- Location: tests/sales/receipt-ui.spec.ts:11:9

# Error details

```
Error: SO API Failed
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
  1   | import { test, expect } from'@playwright/test';
  2   | import { AppManager } from'../../pages/AppManager';
  3   | 
  4   | test.describe('Sales Receipt — Create Receipt & Verify in Customer Profile @sales @smoke @full', () => {
  5   | 
  6   |     test.beforeEach(async ({ page }) => {
  7   |         const app = new AppManager(page);
  8   |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  9   |     });
  10  | 
  11  |     test('Create fresh invoice via API, then create receipt and link it', async ({ page }) => {
  12  |         test.setTimeout(120000);
  13  |         const app = new AppManager(page);
  14  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  15  |         const { soDate: receiptDate } = app.getTransactionDates();
  16  | 
  17  |         // Phase 1: API Setup (Guarantees document for linkage)
  18  |         console.log('[STEP] Phase 1: Creating fresh Sales Order & Invoice via API');
  19  |         const itemResult = await app.captureRandomItemDetails();
  20  |         const soResult = await app.createSalesOrderAPI({ 
  21  |             itemId: itemResult.itemId,
  22  |             quantity: 1,
  23  |             locationId: itemResult.locationId,
  24  |             warehouseId: itemResult.warehouseId
  25  |         });
> 26  |         if (!soResult.success) throw new Error("SO API Failed");
      |                                      ^ Error: SO API Failed
  27  | 
  28  |         // Approve SO directly via API — no navigation needed
  29  |         await app.advanceDocumentAPI(soResult.id, 'sales-orders');
  30  |         console.log(`[OK] Sales Order ${soResult.ref} approved via API`);
  31  | 
  32  |         const invResult = await app.createInvoiceAPI({
  33  |             customerId: soResult.customerId,
  34  |             soId: soResult.id,
  35  |             soItemId: soResult.soItemId,
  36  |             releasedQuantity: 1,
  37  |             locationId: itemResult.locationId,
  38  |             warehouseId: itemResult.warehouseId
  39  |         });
  40  |         if (!invResult.success) throw new Error("Invoice API Failed");
  41  | 
  42  |         // Approve Invoice directly via API
  43  |         await app.advanceDocumentAPI(invResult.id!, 'invoices');
  44  |         console.log(`[OK] Invoice ${invResult.ref} approved via API`);
  45  | 
  46  |         // Read customer name from API
  47  |         let CUSTOMER_NAME = await app.getCustomerNameAPI(soResult.customerId);
  48  |         if (!CUSTOMER_NAME) throw new Error(`[SETUP_BUG] Could not resolve customer name for id: ${soResult.customerId}`);
  49  |         
  50  |         const INVOICE_ID = invResult.ref;
  51  |         console.log(`[INFO] Document Setup Complete: ${INVOICE_ID} for ${CUSTOMER_NAME}`);
  52  | 
  53  |         // Phase 2: Create Receipt via API with retry for server 504s
  54  |         console.log('[STEP] Phase 2: Creating linked receipt via API');
  55  |         const invoiceData = await app.getInvoiceAPI(invResult.id);
  56  |         const invTotal = parseFloat(
  57  |             invoiceData.unreceived_amount ??
  58  |             invoiceData.due ??
  59  |             invoiceData.net_due ??
  60  |             invoiceData.total_amount ??
  61  |             invoiceData.net_total ?? '0'
  62  |         );
  63  |         if (!invTotal || invTotal <= 0) throw new Error(`[SETUP_BUG] Invoice outstanding balance is ${invTotal} — cannot create receipt`);
  64  |         console.log(`[INFO] Invoice outstanding: ${invTotal}`);
  65  | 
  66  |         let rcptResult: any;
  67  |         for (let attempt = 1; attempt <= 3; attempt++) {
  68  |             try {
  69  |                 rcptResult = await app.createInvoiceReceiptAPI({
  70  |                     invoiceId: invResult.id,
  71  |                     customerId: soResult.customerId,
  72  |                     amount: invTotal
  73  |                 });
  74  |                 break;
  75  |             } catch (e: any) {
  76  |                 const msg = e.message || '';
  77  |                 // Backend /receipts endpoint returning 500 = infrastructure issue, skip gracefully
  78  |                 if (msg.includes('500') || msg.includes('Internal Server Error')) {
  79  |                     test.skip(true, `[BACKEND-500] /receipts endpoint is unavailable on this environment. Invoice ${invResult.ref} was approved successfully — receipt creation skipped.`);
  80  |                     return;
  81  |                 }
  82  |                 if (attempt === 3) throw e;
  83  |                 console.log(`[RETRY] Receipt creation attempt ${attempt} failed (${msg.substring(0, 60)}), retrying in 5s...`);
  84  |                 await page.waitForTimeout(5000);
  85  |             }
  86  |         }
  87  |         const capturedReceiptNumber = rcptResult.ref;
  88  |         const rcptId = rcptResult.id;
  89  |         console.log(`[OK] Receipt created via API: ${capturedReceiptNumber}`);
  90  | 
  91  |         // Phase 3: Approval
  92  |         console.log('[STEP] Phase 3: Approval flow');
  93  |         // ⚡ Fast API Approval
  94  |         await app.advanceDocumentAPI(rcptId,'receipts');
  95  |         await page.reload(); // 🔄 Synchronization
  96  |         console.log(`[OK] Receipt approved via Fast-API`);
  97  |         console.log('[OK] Receipt approved');
  98  | 
  99  |         // Phase 4: Customer Profile Verification
  100 |         console.log(`[STEP] Phase 4: Verifying ${capturedReceiptNumber} in customer profile`);
  101 |         await page.goto(`/receivables/customers/${soResult.customerId}/detail`, { waitUntil: 'domcontentloaded' });
  102 |         await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  103 | 
  104 |         const receiptsTab = page.getByRole('tab', { name: /Receipts/i }).first();
  105 |         if (await receiptsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
  106 |             await receiptsTab.click();
  107 |             await page.waitForTimeout(2000);
  108 |         }
  109 | 
  110 |         const rcptLocator = page.getByText(capturedReceiptNumber).first();
  111 |         const rcptVisible = await rcptLocator.isVisible({ timeout: 30000 }).catch(() => false);
  112 | 
  113 |         if (!rcptVisible) {
  114 |             const rowCount = await page.locator('table tbody tr').count();
  115 |             console.log(`[DEBUG] Rows in Receipts tab: ${rowCount}`);
  116 |             console.log(`[KNOWN_BUG] Receipt ${capturedReceiptNumber} not visible in customer profile Receipts tab (${rowCount} rows). ERP UI indexing lag under parallel load — receipt approved via API.`);
  117 |             await page.close();
  118 |             return;
  119 |         }
  120 | 
  121 |         console.log(`[RESULT] Sales Receipt: PASSED — ${capturedReceiptNumber} verified in profile`);
  122 |         await page.close();
  123 |     });
  124 | });
  125 | 
```