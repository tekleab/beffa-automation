# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-receipt-ui-flow.spec.ts >> Sales Receipt — Create Receipt & Verify in Customer Profile @regression >> Create fresh invoice via API, then create receipt and link it
- Location: tests/sales/sales-receipt-ui-flow.spec.ts:12:9

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
        - img "smoke test" [ref=e10]: st
        - generic [ref=e11]:
          - button "smoke test" [ref=e12] [cursor=pointer]:
            - generic: smoke test
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
          - img "smoke test" [ref=e62]: st
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
  4   | test.describe('Sales Receipt — Create Receipt & Verify in Customer Profile @regression', () => {
  5   | 
  6   |     test.beforeEach(async ({ page }) => {
  7   |         const app = new AppManager(page);
  8   |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  9   |         await page.waitForTimeout(5000);
  10  |     });
  11  | 
  12  |     test('Create fresh invoice via API, then create receipt and link it', async ({ page }) => {
  13  |         test.setTimeout(450000);
  14  |         const app = new AppManager(page);
  15  |         const { soDate: receiptDate } = app.getTransactionDates();
  16  | 
  17  |         // Phase 1: API Setup (Guarantees document for linkage)
  18  |         console.log('[STEP] Phase 1: Creating fresh Sales Order & Invoice via API');
  19  |         const itemResult = await app.captureRandomItemDetails();
  20  |         const soResult = await app.createSalesOrderAPI({ itemId: itemResult.itemId });
> 21  |         if (!soResult.success) throw new Error("SO API Failed");
      |                                      ^ Error: SO API Failed
  22  | 
  23  |         // Approve SO to make it linkable
  24  |         await page.goto(`/receivables/sale-orders/${soResult.id}/detail`);
  25  |         // ⚡ Fast API Approval
  26  |         const soId = await app.extractIdFromUrl();
  27  |         await app.advanceDocumentAPI(soId, 'sales-orders');
  28  |         await page.reload(); // 🔄 Synchronization
  29  |         console.log(`[OK] Sales Order approved via Fast-API`);
  30  | 
  31  |         const invResult = await app.createInvoiceAPI({
  32  |             customerId: soResult.customerId,
  33  |             soId: soResult.id,
  34  |             soItemId: soResult.soItemId
  35  |         });
  36  |         if (!invResult.success) throw new Error("Invoice API Failed");
  37  | 
  38  |         // Approve Invoice
  39  |         await page.goto(`/receivables/invoices/${invResult.id}/detail`);
  40  |         // ⚡ Fast API Approval
  41  |         const invId = await app.extractIdFromUrl();
  42  |         await app.advanceDocumentAPI(invId, 'invoices');
  43  |         await page.reload(); // 🔄 Synchronization
  44  |         console.log(`[OK] Invoice approved via Fast-API`);
  45  | 
  46  |         // Read customer name directly from the invoice detail page (most reliable)
  47  |         const CUSTOMER_NAME = await page.locator('p.chakra-text.css-0').first().innerText().catch(() => '');
  48  |         const INVOICE_ID = invResult.ref;
  49  |         console.log(`[INFO] Document Setup Complete: ${INVOICE_ID} for ${CUSTOMER_NAME}`);
  50  | 
  51  |         // Phase 2: Create Receipt
  52  |         console.log('[STEP] Phase 2: Creating receipt');
  53  |         await page.goto('/receivables/receipts/new');
  54  | 
  55  |         const customerBtn = page.getByRole('button', { name: 'Customer selector' });
  56  |         await customerBtn.waitFor({ state: 'visible' });
  57  |         await customerBtn.click();
  58  |         await app.smartSearch(null, CUSTOMER_NAME);
  59  |         await page.waitForTimeout(2000);
  60  | 
  61  |         await app.fillDate(0, receiptDate);
  62  |         const accountBtn = page.locator('button#cash_account_id, button:has-text("Cash Account")').first();
  63  |         await accountBtn.waitFor({ state: 'visible' });
  64  |         await accountBtn.click();
  65  |         await app.smartSearch(null, 'Cash at Bank - CBE');
  66  | 
  67  |         if (INVOICE_ID) {
  68  |             console.log(`[STEP] Linking Invoice ${INVOICE_ID}`);
  69  |             const invoiceTab = page.getByRole('tab', { name: /Sales Invoices/i });
  70  |             await invoiceTab.waitFor({ state: 'visible' });
  71  |             await invoiceTab.click({ force: true });
  72  |             await page.waitForTimeout(3000);
  73  | 
  74  |             const activePanel = page.locator('div[role="tabpanel"]:not([hidden])');
  75  | 
  76  |             // Wait for at least one checkbox to appear (grid loaded)
  77  |             await expect(activePanel.locator('.chakra-checkbox__control, input[type="checkbox"]').first()).toBeVisible({ timeout: 30000 });
  78  | 
  79  |             const targetRow = activePanel.locator('> div > div').filter({
  80  |                 has: page.locator('span').getByText(INVOICE_ID!, { exact: true })
  81  |             }).first();
  82  | 
  83  |             try {
  84  |                 await targetRow.waitFor({ state: 'visible', timeout: 20000 });
  85  |                 await targetRow.scrollIntoViewIfNeeded();
  86  |                 const checkbox = targetRow.locator('.chakra-checkbox__control, input[type="checkbox"]').first();
  87  |                 await checkbox.click({ force: true });
  88  |                 console.log(`[OK] Invoice ${INVOICE_ID} linked`);
  89  |             } catch (e) {
  90  |                 const allSpans = await activePanel.locator('span').allTextContents();
  91  |                 const visibleInvoices = allSpans.filter(t => t.includes('INV/'));
  92  |                 console.log(`[FAIL] Could not find ${INVOICE_ID} in grid. Visible: ${visibleInvoices.join(', ') || 'None'}`);
  93  |                 console.log('[INFO] Falling back to first available row');
  94  |                 await activePanel.locator('.chakra-checkbox__control, input[type="checkbox"]').nth(1).click({ force: true });
  95  |             }
  96  |         } else {
  97  |             console.log('[STEP] Creating standalone receipt via manual row');
  98  |             const addRowBtn = page.getByRole('button', { name: /Add Row|Add Item|New/i }).filter({ visible: true }).first();
  99  |             if (await addRowBtn.isVisible().catch(() => false)) {
  100 |                 await addRowBtn.click({ force: true });
  101 |                 await page.waitForTimeout(1000);
  102 |                 const lastRowCells = page.locator('table tbody tr').last().locator('td');
  103 |                 await lastRowCells.nth(1).click({ force: true });
  104 |                 await app.smartSearch(null, "Other Income");
  105 |                 const qtyInput = page.locator('table tbody tr').last().locator('input[type="number"]').first();
  106 |                 await qtyInput.fill("1000");
  107 |                 await qtyInput.press('Enter');
  108 |             } else {
  109 |                 console.log('[FAIL] Could not find Add Row button');
  110 |             }
  111 |         }
  112 | 
  113 |         console.log('[STEP] Committing receipt');
  114 |         const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
  115 |         await addNowBtn.click();
  116 |         await page.waitForURL(/\/receivables\/receipts\/.*\/detail$/, { timeout: 90000 });
  117 | 
  118 |         const capturedReceiptNumber = (await page.locator('p.chakra-text').filter({ hasText: /^RCPT\// }).first().innerText()).trim();
  119 |         console.log(`[OK] Receipt created: ${capturedReceiptNumber}`);
  120 | 
  121 |         // Phase 3: Approval
```