# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-ui.spec.ts >> Purchase to Bill Flow @purchase @smoke @full >> Create PO via UI, approve, create linked bill, verify in vendor profile
- Location: tests/purchase/bill-ui.spec.ts:6:9

# Error details

```
TimeoutError: page.waitForURL: Timeout 120000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://168.119.175.142:4173/payables/purchase-orders/new"
============================================================
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
          - generic [ref=e173]:
            - navigation "breadcrumb" [ref=e174]:
              - list [ref=e175]:
                - navigation "breadcrumb" [ref=e176]:
                  - list [ref=e177]:
                    - listitem [ref=e178]:
                      - link "Home" [ref=e179] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e180]:
                      - link "Payables" [ref=e181] [cursor=pointer]:
                        - /url: /payables/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "Purchase Orders" [ref=e183] [cursor=pointer]:
                        - /url: /payables/purchase-orders/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "New" [ref=e185] [cursor=pointer]:
                        - /url: /payables/purchase-orders/new
            - button "2018" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2018"
              - img [ref=e189]
          - generic [ref=e192]:
            - img [ref=e193]
            - heading "Ooops Error!" [level=1] [ref=e195]
            - paragraph [ref=e196]: There seems to be an error handling your request. Please try again, or contact support.
        - generic [ref=e197]: BM Technology © 2026
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
  - generic:
    - option "1950"
    - option "1951"
    - option "1952"
    - option "1953"
    - option "1954"
    - option "1955"
    - option "1956"
    - option "1957"
    - option "1958"
    - option "1959"
    - option "1960"
    - option "1961"
    - option "1962"
    - option "1963"
    - option "1964"
    - option "1965"
    - option "1966"
    - option "1967"
    - option "1968"
    - option "1969"
    - option "1970"
    - option "1971"
    - option "1972"
    - option "1973"
    - option "1974"
    - option "1975"
    - option "1976"
    - option "1977"
    - option "1978"
    - option "1979"
    - option "1980"
    - option "1981"
    - option "1982"
    - option "1983"
    - option "1984"
    - option "1985"
    - option "1986"
    - option "1987"
    - option "1988"
    - option "1989"
    - option "1990"
    - option "1991"
    - option "1992"
    - option "1993"
    - option "1994"
    - option "1995"
    - option "1996"
    - option "1997"
    - option "1998"
    - option "1999"
    - option "2000"
    - option "2001"
    - option "2002"
    - option "2003"
    - option "2004"
    - option "2005"
    - option "2006"
    - option "2007"
    - option "2008"
    - option "2009"
    - option "2010"
    - option "2011"
    - option "2012"
    - option "2013"
    - option "2014"
    - option "2015"
    - option "2016"
    - option "2017"
    - option "2018 (open)" [selected]
    - option "2019"
    - option "2020"
    - option "2021"
    - option "2022"
    - option "2023"
    - option "2024"
    - option "2025"
    - option "2026"
    - option "2027"
    - option "2028"
    - option "2029"
    - option "2030"
    - option "2031"
    - option "2032"
    - option "2033"
    - option "2034"
    - option "2035"
    - option "2036"
    - option "2037"
    - option "2038"
    - option "2039"
    - option "2040"
    - option "2041"
    - option "2042"
    - option "2043"
    - option "2044"
    - option "2045"
    - option "2046"
    - option "2047"
    - option "2048"
    - option "2049"
```

# Test source

```ts
  1   | import { test, expect } from'@playwright/test';
  2   | import { AppManager } from'../../pages/AppManager';
  3   | 
  4   | test.describe('Purchase to Bill Flow @purchase @smoke @full', () => {
  5   | 
  6   |     test('Create PO via UI, approve, create linked bill, verify in vendor profile', async ({ page }) => {
  7   |         test.setTimeout(450000);
  8   |         const app = new AppManager(page);
  9   | 
  10  |         console.log('[STEP] Phase 1: Login & PO Creation');
  11  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  12  |         await page.goto('/payables/purchase-orders/new', { waitUntil:'networkidle' });
  13  | 
  14  |         await app.pickDate('Purchase Order Date');
  15  |         console.log('[OK] Order date set');
  16  | 
  17  |         const vendorBtn = page.getByRole('button', { name:'Vendor selector' });
  18  |         await app.selectRandomOption(vendorBtn,'Vendor');
  19  |         const selectedVendor = (await vendorBtn.textContent({ timeout: 5000 }))?.trim() ||'Unknown Vendor';
  20  |         console.log(`[INFO] Vendor: ${selectedVendor}`);
  21  | 
  22  |         // Quotes (optional)
  23  |         try {
  24  |             const quotesBtn = page.getByRole('button', { name:'Quotes selector' });
  25  |             await quotesBtn.scrollIntoViewIfNeeded();
  26  |             await quotesBtn.click({ timeout: 5000 });
  27  |             await page.waitForTimeout(1500);
  28  |             const quoteOptions = page.locator('button, div[role="group"], [role="option"], [role="menuitem"]').filter({ hasText: /^QTE\/\d{4}/ }).filter({ visible: true });
  29  |             const quoteCount = await quoteOptions.count();
  30  |             if (quoteCount > 0) {
  31  |                 await quoteOptions.nth(Math.floor(Math.random() * quoteCount)).click({ force: true });
  32  |                 console.log(`[OK] Quote selected (${quoteCount} available)`);
  33  |             } else {
  34  |                 await page.keyboard.press('Escape');
  35  |                 console.log('[INFO] No quotes available');
  36  |             }
  37  |         } catch {
  38  |             await page.keyboard.press('Escape').catch(() => {});
  39  |             console.log('[INFO] Quotes not interactable');
  40  |         }
  41  | 
  42  |         // Financial Mappings
  43  |         await app.selectRandomOption(page.getByRole('button', { name:'Accounts Payable selector' }),'Accounts Payable');
  44  |         await app.selectRandomOption(page.getByRole('button', { name:'Purchase Type selector' }),'Purchase Type');
  45  |         await app.selectRandomOption(page.getByRole('button', { name:'Discount Term selector' }),'Discount Term', true);
  46  | 
  47  |         // Line Item
  48  |         console.log('[STEP] Adding line item');
  49  |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  50  |         await page.getByRole('button', { name:'Line Item' }).click();
  51  |         const modal = page.getByRole('dialog').last();
  52  |         await modal.waitFor({ state:'visible', timeout: 15000 });
  53  | 
  54  |         await modal.getByRole('button', { name:'Item', exact: true }).click();
  55  |         await app.selectRandomOption(modal.getByRole('button', { name:'Item selector' }),'Item');
  56  |         await app.selectRandomOption(modal.getByRole('button', { name:'Warehouse selector' }),'Warehouse');
  57  |         await app.selectRandomOption(modal.getByRole('button', { name:'Location selector' }),'Location');
  58  |         
  59  |         // Pre-wait to ensure dropdown is fully attached to DOM before interacting (fixes the "Failed selection G/L" flakiness)
  60  |         const glBtn = modal.getByRole('button', { name:'G/L Account selector' });
  61  |         await glBtn.waitFor({ state:'attached', timeout: 5000 }).catch(() => {});
  62  |         await app.selectRandomOption(glBtn,'G/L Account');
  63  | 
  64  |         const qty = (Math.floor(Math.random() * 10) + 1).toString();
  65  |         await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill(qty);
  66  |         const unitPrice = (Math.floor(Math.random() * 9000) + 1000).toString();
  67  |         await modal.getByRole('group').filter({ hasText: /Unit Price/i }).getByRole('spinbutton').fill(unitPrice);
  68  |         await app.selectRandomOption(modal.getByRole('button', { name:'Tax selector' }),'Tax', true);
  69  | 
  70  |         await modal.getByRole('button', { name:'Add', exact: true }).click();
  71  |         await expect(modal).not.toBeVisible({ timeout: 15000 });
  72  |         console.log(`[OK] Line item added (Price: ${unitPrice})`);
  73  | 
  74  |         // Submit PO
  75  |         console.log('[STEP] Submitting PO');
  76  |         const addNowBtn = page.getByRole('button', { name:'Add Now' }).first();
  77  |         await expect(addNowBtn).toBeEnabled({ timeout: 15000 });
  78  |         await addNowBtn.evaluate((node: HTMLElement) => {
  79  |             node.click();
  80  |             node.dispatchEvent(new Event('change', { bubbles: true }));
  81  |             node.dispatchEvent(new Event('input', { bubbles: true }));
  82  |         });
  83  | 
> 84  |         await page.waitForURL(/\/payables\/purchase-orders\/.*\/detail$/, { timeout: 120000 });
      |                    ^ TimeoutError: page.waitForURL: Timeout 120000ms exceeded.
  85  |         const poElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^PO\/\d{4}\// }).first();
  86  |         await poElement.waitFor({ state:'attached', timeout: 30000 });
  87  |         const poText = await poElement.textContent();
  88  |         const poNumber = (poText!.match(/PO\/\d{4}\/\d{2}\/\d{2}\/\d+/) || [poText!.trim()])[0];
  89  |         console.log(`[OK] PO created: ${poNumber} | Vendor: ${selectedVendor}`);
  90  |  
  91  |         // ⚡ HYBRID 70/30: Fast API Approval
  92  |         const poId = await app.extractIdFromUrl();
  93  |         await app.advanceDocumentAPI(poId,'purchase-orders');
  94  |         await page.reload(); // 🔄 Synchronize: Force UI to see the'Approved' state
  95  |         console.log(`[OK] PO ${poNumber} approved via Fast-API`);
  96  | 
  97  |         // ⚡ Phase 2: Pure API Bill Creation
  98  |         console.log(`[STEP] Phase 2: Generating linked Bill for PO ${poNumber} via API`);
  99  |         const { billNumber, billId } = await app.createBillFromPoAPI(poId);
  100 |         
  101 |         // ⚡ Fast API Approval
  102 |         await app.advanceDocumentAPI(billId,'bills');
  103 |         console.log(`[OK] Linked Bill ${billNumber} successfully generated and officially approved instantly via Fast-API!`);
  104 |         
  105 |         await page.waitForTimeout(2000); // 🔄 Synchronize indexing for backend before verifying profile
  106 | 
  107 |         // Phase 3: Verifying the Bill in the Vendor profile via API
  108 |         console.log(`[STEP] Phase 3: Verifying ${billNumber} in vendor profile via API`);
  109 |         await app.verifyBillInVendorAPI(selectedVendor, billNumber);
  110 |         console.log(`[RESULT] Purchase to Bill: PASSED — PO ${poNumber} -> Bill ${billNumber}`);
  111 |         await page.close();
  112 |     });
  113 | });
  114 | 
```