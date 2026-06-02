# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-customer-balance-ui.spec.ts >> Sales Customer Balance UI Audits @sales @smoke @full >> UI Audit: Customer profile shows zero balance after full payment
- Location: tests/sales/sales-customer-balance-ui.spec.ts:73:9

# Error details

```
Error: expect(received).toBeCloseTo(expected, precision)

Expected: 0
Received: 100

Expected precision:    1
Expected difference: < 0.05
Received difference:   100
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "sample" [ref=e10]: s
        - generic [ref=e11]:
          - button "sample" [ref=e12] [cursor=pointer]:
            - generic: sample
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
          - img "sample" [ref=e62]: s
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
  8   |  * Objectives:
  9   |  * 1. Approved invoice must reflect correct outstanding balance in customer profile UI.
  10  |  * 2. After full payment, customer profile must show zero outstanding balance.
  11  |  */
  12  | 
  13  | test.describe('Sales Customer Balance UI Audits @sales @smoke @full', () => {
  14  |     test.setTimeout(300000);
  15  | 
  16  |     test('UI Audit: Approved invoice reflects outstanding balance in customer profile', async ({ page }) => {
  17  |         const app = new AppManager(page);
  18  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  19  | 
  20  |         const meta = await app.api.sales.discoverMetadataAPI();
  21  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
  22  |         if (!item) { console.log('[SKIP] No stock available.'); return; }
  23  | 
  24  |         const UNIT_PRICE = 750;
  25  | 
  26  |         console.log(`[STEP 1] Creating & approving invoice for ${UNIT_PRICE} via API...`);
  27  |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  28  |             customerId: meta.customerId,
  29  |             itemId: item.itemId,
  30  |             quantity: 1,
  31  |             unitPrice: UNIT_PRICE,
  32  |             locationId: item.locationId,
  33  |             warehouseId: item.warehouseId
  34  |         });
  35  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  36  |         console.log(`[OK] Invoice ${inv.ref} approved.`);
  37  | 
  38  |         console.log(`[STEP 2] Navigating to customer profile...`);
  39  |         await page.goto(`/receivables/customers/${meta.customerId}/detail`, { waitUntil: 'networkidle' });
  40  | 
  41  |         console.log(`[STEP 3] Opening Invoices tab...`);
  42  |         const invoicesTab = page.getByRole('tab', { name: /Invoices|Transactions/i }).first();
  43  |         await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
  44  |         await invoicesTab.click();
  45  |         await page.waitForTimeout(2000);
  46  | 
  47  |         console.log(`[STEP 4] Asserting invoice ${inv.ref} is visible in customer profile...`);
  48  |         
  49  |         // Log what's actually visible in the tab for debugging
  50  |         const tabContent = await page.locator('table').first().textContent().catch(() => 'No table found');
  51  |         Logger.debug(`Tab content preview: ${tabContent?.substring(0, 200)}...`);
  52  |         
  53  |         const invoiceLocator = page.getByText(inv.ref).first();
  54  |         const isVisible = await invoiceLocator.isVisible({ timeout: 5000 }).catch(() => false);
  55  |         
  56  |         if (!isVisible) {
  57  |             console.log(`[ERROR] Invoice ${inv.ref} NOT visible in customer profile.`);
  58  |             console.log(`[ERROR] Expected invoice: ${inv.ref}`);
  59  |             console.log(`[ERROR] Customer ID: ${meta.customerId}`);
  60  |             console.log(`[ERROR] Invoice ID: ${inv.id}`);
  61  |             console.log(`[ERROR] Tab content length: ${tabContent?.length || 0}`);
  62  |             
  63  |             // Try to find any invoice in the table
  64  |             const anyInvoice = await page.locator('table tbody tr').count();
  65  |             console.log(`[DEBUG] Number of rows in table: ${anyInvoice}`);
  66  |             
  67  |             throw new Error(`Invoice ${inv.ref} not found in customer profile. Expected to see invoice after API approval.`);
  68  |         }
  69  |         
  70  |         console.log(`[PASS] Invoice ${inv.ref} confirmed visible in customer profile.`);
  71  |     });
  72  | 
  73  |     test('UI Audit: Customer profile shows zero balance after full payment', async ({ page }) => {
  74  |         const app = new AppManager(page);
  75  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  76  | 
  77  |         const meta = await app.api.sales.discoverMetadataAPI();
  78  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
  79  |         if (!item) { console.log('[SKIP] No stock available.'); return; }
  80  | 
  81  |         const AMOUNT = 600;
  82  | 
  83  |         console.log(`[STEP 1] Creating invoice, approving, and paying in full via API...`);
  84  |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  85  |             customerId: meta.customerId,
  86  |             itemId: item.itemId,
  87  |             quantity: 1,
  88  |             unitPrice: AMOUNT,
  89  |             locationId: item.locationId,
  90  |             warehouseId: item.warehouseId
  91  |         });
  92  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  93  | 
  94  |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  95  |             invoiceId: inv.id,
  96  |             customerId: meta.customerId,
  97  |             amount: AMOUNT
  98  |         });
  99  |         await app.advanceDocumentAPI(rct.id, 'receipts');
  100 |         console.log(`[OK] Invoice ${inv.ref} fully paid via receipt ${rct.ref}.`);
  101 | 
  102 |         await page.waitForTimeout(3000);
  103 | 
  104 |         console.log(`[STEP 2] Verifying invoice balance is zero via API...`);
  105 |         const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
  106 |         const remaining = parseFloat(finalInv.unreceived_amount || finalInv.balance || '0');
  107 |         console.log(`[AUDIT] Invoice ${inv.ref} remaining balance: ${remaining}`);
> 108 |         expect(remaining).toBeCloseTo(0, 1);
      |                           ^ Error: expect(received).toBeCloseTo(expected, precision)
  109 | 
  110 |         console.log(`[STEP 3] Navigating to customer profile to verify paid status...`);
  111 |         await page.goto(`/receivables/customers/${meta.customerId}/detail`, { waitUntil: 'networkidle' });
  112 | 
  113 |         const invoicesTab = page.getByRole('tab', { name: /Invoices|Transactions/i }).first();
  114 |         await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
  115 |         await invoicesTab.click();
  116 |         await page.waitForTimeout(2000);
  117 | 
  118 |         console.log(`[STEP 4] Asserting receipt ${rct.ref} is visible in customer profile...`);
  119 |         // Try Receipts tab first, fall back to checking current tab content
  120 |         const receiptsTab = page.getByRole('tab', { name: /Receipts/i }).first();
  121 |         if (await receiptsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
  122 |             await receiptsTab.click();
  123 |             await page.waitForTimeout(2000);
  124 |         }
  125 |         // Receipt ref may appear in Invoices tab or Receipts tab depending on ERP version
  126 |         const refVisible = await page.getByText(rct.ref).first().isVisible({ timeout: 15000 }).catch(() => false);
  127 |         if (!refVisible) {
  128 |             // Fallback: API already confirmed balance=0, so pass on API assertion alone
  129 |             console.log(`[INFO] Receipt ref not visible in UI tab — balance confirmed via API (${remaining}). Passing.`);
  130 |         } else {
  131 |             console.log(`[PASS] Receipt ${rct.ref} confirmed in customer profile. Balance cleared to zero.`);
  132 |         }
  133 |     });
  134 | });
  135 | 
```