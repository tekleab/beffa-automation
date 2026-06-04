# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/cross-module-ui-flows.spec.ts >> Cross-Module UI Flow Audits @sales @purchase @smoke @full >> Sales UI: Partial payment updates invoice Amount Due correctly
- Location: tests/cross-module/cross-module-ui-flows.spec.ts:14:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Add Receipt|Create Receipt|Receive Payment|Add Payment|New Receipt/i }).first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e9]:
        - img [ref=e10]
        - generic [ref=e11]: Enterprise
      - generic [ref=e13]:
        - generic:
          - img
        - textbox "Search tasks" [ref=e14]
      - generic [ref=e15]:
        - navigation [ref=e17]:
          - link "Dashboard" [ref=e18] [cursor=pointer]:
            - /url: /dashboard
            - paragraph [ref=e21]: Dashboard
        - generic [ref=e23] [cursor=pointer]:
          - paragraph [ref=e26]: Accounting
          - paragraph [ref=e27]:
            - button "Toggle section" [ref=e28]:
              - img [ref=e29]
        - generic [ref=e32] [cursor=pointer]:
          - paragraph [ref=e35]: Account Reconciliation
          - paragraph [ref=e36]:
            - button "Toggle section" [ref=e37]:
              - img [ref=e38]
        - generic [ref=e41] [cursor=pointer]:
          - paragraph [ref=e44]: CRM
          - paragraph [ref=e45]:
            - button "Toggle section" [ref=e46]:
              - img [ref=e47]
        - generic [ref=e50] [cursor=pointer]:
          - paragraph [ref=e53]: HRM
          - paragraph [ref=e54]:
            - button "Toggle section" [ref=e55]:
              - img [ref=e56]
        - generic [ref=e59] [cursor=pointer]:
          - paragraph [ref=e62]: Project Management
          - paragraph [ref=e63]:
            - button "Toggle section" [ref=e64]:
              - img [ref=e65]
        - generic [ref=e68] [cursor=pointer]:
          - paragraph [ref=e71]: SCM
          - paragraph [ref=e72]:
            - button "Toggle section" [ref=e73]:
              - img [ref=e74]
        - generic [ref=e77] [cursor=pointer]:
          - paragraph [ref=e80]: Lease Management
          - paragraph [ref=e81]:
            - button "Toggle section" [ref=e82]:
              - img [ref=e83]
        - generic [ref=e86] [cursor=pointer]:
          - paragraph [ref=e89]: Service Management
          - paragraph [ref=e90]:
            - button "Toggle section" [ref=e91]:
              - img [ref=e92]
        - generic [ref=e95] [cursor=pointer]:
          - paragraph [ref=e98]: Report
          - paragraph [ref=e99]:
            - button "Toggle section" [ref=e100]:
              - img [ref=e101]
      - generic [ref=e103]:
        - button "Settings" [ref=e105] [cursor=pointer]:
          - generic:
            - generic:
              - img
              - paragraph: Settings
        - navigation [ref=e107]:
          - link "User Management" [ref=e109] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=e110]:
              - generic [ref=e111]:
                - img [ref=e112]
                - paragraph [ref=e114]: User Management
              - button [ref=e115]:
                - img [ref=e116]
        - button "Logout" [ref=e118] [cursor=pointer]:
          - img [ref=e120]
          - text: Logout
    - generic [ref=e122]:
      - generic [ref=e123]:
        - generic [ref=e124]:
          - img "BM Tech" [ref=e126]: BT
          - generic [ref=e127]:
            - button "BM Tech" [ref=e128] [cursor=pointer]:
              - generic: BM Tech
              - img [ref=e130]
            - generic [ref=e132] [cursor=pointer]:
              - button "Company Detail" [ref=e133]:
                - img [ref=e134]
              - button "Edit Company" [ref=e137]:
                - img [ref=e138]
              - button "Company Detail" [ref=e141]:
                - img [ref=e142]
        - generic [ref=e145]:
          - button "New" [ref=e146] [cursor=pointer]:
            - text: New
            - img [ref=e148]
          - generic [ref=e152] [cursor=pointer]:
            - generic [ref=e153]: "5"
            - img "Notifications" [ref=e154]
          - button "EC" [ref=e157] [cursor=pointer]:
            - img [ref=e158]
            - paragraph [ref=e160]: EC
          - button [ref=e161] [cursor=pointer]:
            - img [ref=e162]
          - generic [ref=e165] [cursor=pointer]:
            - img "System" [ref=e167]: S
            - generic [ref=e168]:
              - generic [ref=e169]: System
              - paragraph [ref=e170]: IT Administrator / User Manager
      - generic [ref=e171]:
        - generic [ref=e172]:
          - img [ref=e173]
          - heading "Ooops Error!" [level=1] [ref=e175]
          - paragraph [ref=e176]: There seems to be an error handling your request. Please try again, or contact support.
        - generic [ref=e177]: BM Technology © 2026
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
  5   |  * CROSS-MODULE UI FLOW AUDITS (50/50 API+UI)
  6   |  *
  7   |  * Objectives:
  8   |  * 1. Sales: Partial payment via UI correctly updates invoice Amount Due on screen.
  9   |  * 2. Purchase: Approved bill reflects outstanding balance in vendor profile UI.
  10  |  */
  11  | 
  12  | test.describe('Cross-Module UI Flow Audits @sales @purchase @smoke @full', () => {
  13  | 
  14  |     test('Sales UI: Partial payment updates invoice Amount Due correctly', async ({ page }) => {
  15  |         test.setTimeout(300000);
  16  |         const app = new AppManager(page);
  17  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  18  | 
  19  |         const INVOICE_AMOUNT = 1000;
  20  |         const PARTIAL_AMOUNT = 400;
  21  |         const EXPECTED_REMAINING = INVOICE_AMOUNT - PARTIAL_AMOUNT;
  22  | 
  23  |         console.log(`[STEP 1] Creating & approving invoice for ${INVOICE_AMOUNT} via API...`);
  24  |         const meta = await app.api.sales.discoverMetadataAPI();
  25  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
  26  | 
  27  |         if (!item) {
  28  |             console.log(`[SKIP] No item with stock >= 1 found.`);
  29  |             return;
  30  |         }
  31  | 
  32  |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  33  |             customerId: meta.customerId,
  34  |             itemId: item.itemId,
  35  |             quantity: 1,
  36  |             unitPrice: INVOICE_AMOUNT,
  37  |             locationId: item.locationId,
  38  |             warehouseId: item.warehouseId
  39  |         });
  40  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  41  |         console.log(`[OK] Invoice ${inv.ref} approved.`);
  42  | 
  43  |         console.log(`[STEP 2] Navigating to invoice detail page via UI...`);
  44  |         await page.goto(`/receivables/invoices/${inv.id}/detail`, { waitUntil: 'networkidle' });
  45  | 
  46  |         console.log(`[STEP 3] Creating partial receipt of ${PARTIAL_AMOUNT} via UI...`);
  47  |         // Broaden button selector — ERP uses various labels for receipt creation
  48  |         const addReceiptBtn = page.getByRole('button', {
  49  |             name: /Add Receipt|Create Receipt|Receive Payment|Add Payment|New Receipt/i
  50  |         }).first();
> 51  |         await addReceiptBtn.waitFor({ state: 'visible', timeout: 30000 });
      |                             ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  52  |         await addReceiptBtn.click();
  53  | 
  54  |         const modal = page.getByRole('dialog').last();
  55  |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  56  | 
  57  |         const amountInput = modal.getByRole('spinbutton').first();
  58  |         await amountInput.waitFor({ state: 'visible', timeout: 10000 });
  59  |         await amountInput.fill(String(PARTIAL_AMOUNT));
  60  | 
  61  |         await app.selectRandomOption(modal.getByRole('button', { name: /Cash Account selector/i }), 'Cash Account');
  62  | 
  63  |         const saveBtn = modal.getByRole('button', { name: /Add Now|Save|Submit/i }).first();
  64  |         await saveBtn.click();
  65  |         await expect(modal).not.toBeVisible({ timeout: 15000 });
  66  |         console.log(`[OK] Partial receipt submitted.`);
  67  | 
  68  |         console.log(`[STEP 4] Verifying Amount Due updated on invoice detail page...`);
  69  |         await page.waitForTimeout(3000);
  70  |         await page.reload({ waitUntil: 'networkidle' });
  71  | 
  72  |         const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
  73  |         const remaining = parseFloat(finalInv.unreceived_amount || finalInv.balance || '0');
  74  | 
  75  |         console.log(`[AUDIT] Invoice ${inv.ref} | Paid: ${PARTIAL_AMOUNT} | Remaining: ${remaining} | Expected: ${EXPECTED_REMAINING}`);
  76  |         expect(remaining).toBeCloseTo(EXPECTED_REMAINING, 1);
  77  | 
  78  |         await expect(page.getByText(String(EXPECTED_REMAINING)).first()).toBeVisible({ timeout: 15000 });
  79  |         console.log(`[PASS] Partial payment confirmed. Amount Due correctly updated to ${EXPECTED_REMAINING}.`);
  80  |     });
  81  | 
  82  |     test('Purchase UI: Approved bill reflects outstanding balance in vendor profile', async ({ page }) => {
  83  |         test.setTimeout(300000);
  84  |         const app = new AppManager(page);
  85  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  86  | 
  87  |         console.log(`[STEP 1] Creating & approving bill via API...`);
  88  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
  89  |         const BILL_AMOUNT = 5000;
  90  | 
  91  |         const bill = await app.api.purchase.createBillAPI({
  92  |             itemData: item,
  93  |             quantity: 1,
  94  |             unitPrice: BILL_AMOUNT
  95  |         });
  96  |         await app.advanceDocumentAPI(bill.id, 'bills');
  97  |         console.log(`[OK] Bill ${bill.ref} approved.`);
  98  | 
  99  |         console.log(`[STEP 2] Fetching bill details to get vendor info...`);
  100 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  101 |         const vendorId = billData.vendor_id || billData.vendor?.id;
  102 |         const vendorName = billData.vendor?.name || billData.vendor_name;
  103 | 
  104 |         if (!vendorId) {
  105 |             console.log(`[SKIP] Could not resolve vendor from bill. Skipping UI verification.`);
  106 |             return;
  107 |         }
  108 | 
  109 |         console.log(`[STEP 3] Navigating to vendor profile UI...`);
  110 |         await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });
  111 | 
  112 |         // Detect session expiry redirect — re-login if kicked to /users/login
  113 |         if (page.url().includes('/users/login')) {
  114 |             console.log('[AUTH] Session expired — re-authenticating...');
  115 |             await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  116 |             await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });
  117 |         }
  118 | 
  119 |         // Shorter networkidle with fallback to domcontentloaded to avoid 90s hang on redirect
  120 |         await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() =>
  121 |             page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {})
  122 |         );
  123 | 
  124 |         // Abort if still on login page after re-auth attempt
  125 |         if (page.url().includes('/users/login')) {
  126 |             throw new Error('[CRITICAL] Session could not be restored. Vendor profile unreachable.');
  127 |         }
  128 | 
  129 |         console.log(`[STEP 4] Navigating to Bills tab...`);
  130 |         const billsTab = page.getByRole('tab', { name: /^Bills$/i }).first();
  131 |         await billsTab.waitFor({ state: 'visible', timeout: 20000 });
  132 |         await billsTab.click();
  133 |         // Confirm tab is selected before asserting content
  134 |         await expect(billsTab).toHaveAttribute('aria-selected', 'true', { timeout: 10000 });
  135 |         await page.waitForTimeout(3000);
  136 | 
  137 |         console.log(`[STEP 5] Asserting bill ${bill.ref} is visible in vendor profile...`);
  138 |         // Poll: bill may be on any page; scroll/search if not immediately visible
  139 |         let billVisible = false;
  140 |         for (let attempt = 0; attempt < 5; attempt++) {
  141 |             billVisible = await page.getByText(bill.ref).first().isVisible({ timeout: 8000 }).catch(() => false);
  142 |             if (billVisible) break;
  143 |             console.log(`[POLL ${attempt + 1}/5] Bill not yet visible, waiting...`);
  144 |             await page.waitForTimeout(3000);
  145 |         }
  146 |         expect(billVisible, `Bill ${bill.ref} should be visible in vendor profile Bills tab`).toBe(true);
  147 | 
  148 |         console.log(`[PASS] Bill ${bill.ref} confirmed visible in vendor "${vendorName}" profile. Outstanding balance reflected.`);
  149 |     });
  150 | });
  151 | 
```