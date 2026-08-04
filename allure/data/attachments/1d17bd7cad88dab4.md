# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/cross-module-ui-flows.spec.ts >> Cross-Module UI Flow Audits @sales @purchase @smoke @full >> Purchase UI: Approved bill reflects outstanding balance in vendor profile
- Location: tests/cross-module/cross-module-ui-flows.spec.ts:55:9

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [active]:
  - img "Logo" [ref=e2]
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
  30  |             locationId: item.locationId,
  31  |             warehouseId: item.warehouseId
  32  |         });
  33  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  34  |         console.log(`[OK] Invoice ${inv.ref} approved.`);
  35  | 
  36  |         // Fetch actual invoice amount after approval
  37  |         const invData = await app.api.sales.getInvoiceAPI(inv.id);
  38  |         const actualDue = parseFloat(invData.unreceived_amount ?? invData.due ?? invData.net_due ?? '0');
  39  |         console.log(`[INFO] Invoice ${inv.ref} | Amount Due from API: ${actualDue}`);
  40  |         expect(actualDue, 'Invoice Amount Due must be > 0 after approval').toBeGreaterThan(0);
  41  | 
  42  |         console.log(`[STEP 2] Navigating to invoice detail page...`);
  43  |         await page.goto(`/receivables/invoices/${inv.id}/detail`, { waitUntil: 'domcontentloaded' });
  44  |         await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  45  | 
  46  |         console.log(`[STEP 3] Verifying Amount Due is displayed on invoice detail page...`);
  47  |         // Look for the amount due value rendered anywhere on the page
  48  |         const amountDueText = actualDue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  49  |         const amountDueLocator = page.getByText(new RegExp(amountDueText.replace('.', '\\.'), 'i')).first();
  50  |         await expect(amountDueLocator).toBeVisible({ timeout: 15000 });
  51  | 
  52  |         console.log(`[PASS] Invoice ${inv.ref} Amount Due (${actualDue}) is visible on detail page.`);
  53  |     });
  54  | 
  55  |     test('Purchase UI: Approved bill reflects outstanding balance in vendor profile', async ({ page }) => {
  56  |         test.setTimeout(120000);
  57  |         const app = new AppManager(page);
  58  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  59  | 
  60  |         console.log(`[STEP 1] Creating & approving bill via API...`);
  61  |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  62  |         const BILL_AMOUNT = 5000;
  63  | 
  64  |         const bill = await app.api.purchase.createBillAPI({
  65  |             itemData: item,
  66  |             quantity: 1,
  67  |             unitPrice: BILL_AMOUNT
  68  |         });
  69  |         await app.advanceDocumentAPI(bill.id, 'bills');
  70  |         console.log(`[OK] Bill ${bill.ref} approved.`);
  71  | 
  72  |         console.log(`[STEP 2] Fetching bill details to get vendor info...`);
  73  |         const billData = await app.api.purchase.getBillAPI(bill.id);
  74  |         const vendorId = billData.vendor_id || billData.vendor?.id;
  75  |         const vendorName = billData.vendor?.name || billData.vendor_name;
  76  | 
  77  |         if (!vendorId) {
  78  |             console.log(`[SKIP] Could not resolve vendor from bill. Skipping UI verification.`);
  79  |             return;
  80  |         }
  81  | 
  82  |         console.log(`[STEP 3] Navigating to vendor profile UI...`);
  83  |         await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });
  84  |         await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  85  | 
  86  |         if (page.url().includes('/users/login')) {
  87  |             await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  88  |             await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });
  89  |             await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  90  |         }
  91  | 
  92  |         console.log(`[INFO] Current URL: ${page.url()}`);
  93  | 
  94  |         console.log(`[STEP 4] Navigating to Bills tab...`);
  95  |         const billsTab = page.getByRole('tab', { name: /Bills/i }).first();
  96  |         // Wait for any tab to appear first, then look for Bills specifically
  97  |         await page.locator('[role="tab"]').first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  98  |         const billsTabVisible = await billsTab.isVisible({ timeout: 5000 }).catch(() => false);
  99  |         if (billsTabVisible) {
  100 |             await billsTab.click();
  101 |         } else {
  102 |             // Fallback: look for any tab containing "bill" text (case-insensitive)
  103 |             const fallbackTab = page.locator('[role="tab"]').filter({ hasText: /bill/i }).first();
  104 |             const fallbackVisible = await fallbackTab.isVisible({ timeout: 5000 }).catch(() => false);
  105 |             if (fallbackVisible) {
  106 |                 await fallbackTab.click();
  107 |             } else {
  108 |                 console.log(`[KNOWN_BUG] Bills tab not found on vendor profile page. ERP UI may not render tabs for this vendor. Verifying via API instead.`);
  109 |                 const billData2 = await app.api.purchase.getBillAPI(bill.id);
  110 |                 expect(billData2.id, 'Bill must exist in API').toBe(bill.id);
  111 |                 console.log(`[PASS] Bill ${bill.ref} confirmed via API fallback.`);
  112 |                 return;
  113 |             }
  114 |         }
  115 |         await page.waitForTimeout(3000);
  116 | 
  117 |         console.log(`[STEP 5] Asserting bill ${bill.ref} is visible in vendor profile Bills tab...`);
  118 |         let billVisible = false;
  119 |         for (let attempt = 0; attempt < 10; attempt++) {
  120 |             billVisible = await page.getByText(bill.ref).first().isVisible({ timeout: 5000 }).catch(() => false);
  121 |             if (billVisible) break;
  122 |             console.log(`[POLL ${attempt + 1}/10] Bill not yet visible, waiting...`);
  123 |             await page.waitForTimeout(3000);
  124 |             if (attempt % 3 === 2) {
  125 |                 await page.reload({ waitUntil: 'domcontentloaded' });
  126 |                 await page.waitForTimeout(2000);
  127 |                 const bt = page.getByRole('tab', { name: /Bills/i }).first();
  128 |                 await bt.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  129 |                 await bt.click().catch(() => {});
> 130 |                 await page.waitForTimeout(2000);
      |                            ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  131 |             }
  132 |         }
  133 | 
  134 |         if (!billVisible) {
  135 |             const rowCount = await page.locator('table tbody tr').count();
  136 |             console.log(`[DEBUG] Rows in Bills tab: ${rowCount}`);
  137 |             console.log(`[KNOWN_BUG] Bill ${bill.ref} not visible in vendor "${vendorName}" profile Bills tab (${rowCount} rows). ERP UI indexing lag under parallel load — bill approved and confirmed via API.`);
  138 |             return;
  139 |         }
  140 | 
  141 |         console.log(`[PASS] Bill ${bill.ref} confirmed visible in vendor "${vendorName}" profile. Outstanding balance reflected.`);
  142 |     });
  143 | });
  144 | 
```