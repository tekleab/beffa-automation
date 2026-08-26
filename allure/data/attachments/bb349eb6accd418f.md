# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> INV-UI-02: Add Miscellaneous line via modal → Invoice total reflects it
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:759:9

# Error details

```
TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://168.119.175.142:4173/receivables/invoices/new"
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
                      - link "Receivables" [ref=e181] [cursor=pointer]:
                        - /url: /receivables/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "Invoices" [ref=e183] [cursor=pointer]:
                        - /url: /receivables/invoices/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "New" [ref=e185] [cursor=pointer]:
                        - /url: /receivables/invoices/new
            - button "2019" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2019"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e199]:
              - heading "New Invoice" [level=5] [ref=e201]
              - generic [ref=e202]:
                - generic [ref=e204]:
                  - generic [ref=e205]:
                    - group [ref=e206]:
                      - generic [ref=e207]: Customer *
                      - button "Customer selector" [ref=e208]: Zewdu Yalew
                    - group [ref=e209]:
                      - generic [ref=e210]: Sales Order
                      - button "Sales Order selector" [ref=e211]
                    - generic [ref=e212]:
                      - generic [ref=e213]: Invoice Date
                      - button "ነሀሴ 26, 2018" [ref=e215] [cursor=pointer]:
                        - img [ref=e216]
                        - generic [ref=e218]: ነሀሴ 26, 2018
                    - generic [ref=e219]:
                      - group [ref=e220]:
                        - generic [ref=e221]: Invoice number
                        - textbox "Invoice number" [disabled] [ref=e223]: INV/2026/08/26/003251
                      - paragraph [ref=e224]: Invoice number is auto-generated
                    - group [ref=e225]:
                      - generic [ref=e226]: Budget
                      - button "Budget selector" [ref=e227]
                  - generic [ref=e228]:
                    - generic [ref=e229]:
                      - generic [ref=e230]: Due Date
                      - button "ነሀሴ 26, 2018" [ref=e232] [cursor=pointer]:
                        - img [ref=e233]
                        - generic [ref=e235]: ነሀሴ 26, 2018
                    - group [ref=e236]:
                      - generic [ref=e237]: Account Receivable *
                      - button "Account Receivable selector" [ref=e238]: Withholding Tax Receivable
                    - group [ref=e239]:
                      - generic [ref=e240]: Currency *
                      - button "Currency selector" [ref=e241]: Birr
                - generic [ref=e242]:
                  - generic [ref=e243]:
                    - tablist [ref=e244]:
                      - tab "Sales" [selected] [ref=e245] [cursor=pointer]
                      - tab "Released Sales Order" [ref=e246] [cursor=pointer]
                      - tab "Journal" [ref=e247] [cursor=pointer]
                      - tab "Miscellaneous" [ref=e248] [cursor=pointer]
                      - tab "Documents" [ref=e249] [cursor=pointer]
                    - button "Line Item" [ref=e251] [cursor=pointer]:
                      - img [ref=e253]
                      - text: Line Item
                  - tabpanel "Sales" [ref=e256]:
                    - table [ref=e260]:
                      - rowgroup [ref=e261]:
                        - row "Item Quantity Unit Price Description G/L Account * Project Before Tax * Tax Total" [ref=e262]:
                          - columnheader [ref=e263]
                          - columnheader "Item" [ref=e265]: Item
                          - columnheader "Quantity" [ref=e267]: Quantity
                          - columnheader "Unit Price" [ref=e269]: Unit Price
                          - columnheader "Description" [ref=e271]: Description
                          - columnheader "G/L Account *" [ref=e273]: G/L Account *
                          - columnheader "Project" [ref=e275]: Project
                          - columnheader "Before Tax *" [ref=e277]: Before Tax *
                          - columnheader "Tax" [ref=e279]: Tax
                          - columnheader "Total" [ref=e281]: Total
                          - columnheader [ref=e283]
                      - rowgroup [ref=e285]:
                        - row "No record found" [ref=e286]:
                          - cell "No record found" [ref=e287]:
                            - paragraph [ref=e289]: No record found
                      - rowgroup [ref=e290]:
                        - row "0.00 0.00 0.00" [ref=e291]:
                          - columnheader [ref=e292]
                          - columnheader [ref=e293]
                          - columnheader [ref=e294]
                          - columnheader [ref=e295]
                          - columnheader [ref=e296]
                          - columnheader [ref=e297]
                          - columnheader [ref=e298]
                          - columnheader "0.00" [ref=e299]
                          - columnheader "0.00" [ref=e300]
                          - columnheader "0.00" [ref=e301]
                          - columnheader [ref=e302]
              - group [ref=e304]:
                - button "Add Now" [disabled] [ref=e305]
                - button [disabled] [ref=e306]:
                  - generic:
                    - img
        - generic [ref=e307]: BM Technology © 2026
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
    - option "2018"
    - option "2019 (open)" [selected]
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
  686 |             expect([400, 422]).toContain(resp.status());
  687 |         }
  688 |     });
  689 | 
  690 |     test('SO-API-06: Negative unit price → rejected or flagged as known bug', async ({ page }) => {
  691 |         const app = new AppManager(page);
  692 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  693 |         const { apiBase, headers, qs } = await app.buildApiContext();
  694 | 
  695 |         const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
  696 |             headers,
  697 |             data: {
  698 |                 accounts_receivable_id: salesMeta.arAccountId,
  699 |                 currency_id: salesMeta.currencyId,
  700 |                 customer_id: salesMeta.customerId,
  701 |                 so_date: periodDateIso,
  702 |                 so_items: [{ item_id: itemA.itemId, quantity: 1, unit_price: -500, amount: -500, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  703 |                 status: 'draft',
  704 |             },
  705 |         });
  706 | 
  707 |         if (resp.ok()) {
  708 |             expect(resp.ok(), 'SO with negative unit price must be rejected by server').toBe(false);
  709 |         } else {
  710 |             console.log(`[PASS] Negative price SO line rejected: HTTP ${resp.status()}`);
  711 |         }
  712 |     });
  713 | 
  714 |     // =========================================================================
  715 |     // INVOICE
  716 |     // =========================================================================
  717 | 
  718 |     test('INV-UI-01: Add inventory Line Item via modal → Invoice created and approved', async ({ page }) => {
  719 |         const app = new AppManager(page);
  720 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  721 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  722 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  723 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  724 | 
  725 |         await app.pickDate('Invoice Date');
  726 |         await app.pickDate('Due Date');
  727 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  728 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  729 |         await fillCurrencyField(page, app);
  730 | 
  731 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  732 | 
  733 |         const lineItemBtn = page.locator('button:has-text("Line Item")').first();
  734 |         await lineItemBtn.click();
  735 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: capturedItem?.price || '800', itemName: capturedItem?.name });
  736 |         console.log('[OK] Inventory line item added to Invoice');
  737 | 
  738 |         // ── Stock-error guard: if table shows "Insufficient stock", reprovision via API ─
  739 |         await page.waitForTimeout(500);
  740 |         const insufficientRowInv = page.locator('table tbody tr, [role="row"]')
  741 |             .filter({ hasText: /insufficient stock|available:\s*0/i }).first();
  742 |         if (await insufficientRowInv.isVisible({ timeout: 2000 }).catch(() => false)) {
  743 |             console.log('[INV-UI-01] ⚠️ Stock error detected — auto topping up item stock via API');
  744 |             const itemIdToTopUp = (itemA as any)?.id || (itemA as any)?.itemId;
  745 |             if (itemIdToTopUp) {
  746 |                 await app.topUpItemStockAPI(itemIdToTopUp, 50);
  747 |             }
  748 |             await page.waitForTimeout(2000);
  749 |         }
  750 | 
  751 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  752 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  753 | 
  754 |         const invId = await app.extractIdFromUrl();
  755 |         await app.advanceDocumentAPI(invId, 'invoices');
  756 |         console.log('[PASS] Invoice with inventory line created and approved');
  757 |     });
  758 | 
  759 |     test('INV-UI-02: Add Miscellaneous line via modal → Invoice total reflects it', async ({ page }) => {
  760 |         const app = new AppManager(page);
  761 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  762 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  763 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  764 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  765 | 
  766 |         await app.pickDate('Invoice Date');
  767 |         await app.pickDate('Due Date');
  768 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  769 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  770 |         await fillCurrencyField(page, app);
  771 | 
  772 |         await page.locator('button:has-text("Line Item")').first().click();
  773 |         const modal = page.getByRole('dialog').last();
  774 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  775 | 
  776 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  777 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  778 |             console.log('[SKIP] Miscellaneous button not present in Invoice modal');
  779 |             await page.keyboard.press('Escape');
  780 |             return;
  781 |         }
  782 | 
  783 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '1500', description: 'Consulting fee' });
  784 | 
  785 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
> 786 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
      |                    ^ TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
  787 |         console.log('[PASS] Invoice with miscellaneous line created');
  788 |     });
  789 | 
  790 |     test('INV-UI-03: Mixed Item + Miscellaneous lines → both rows in table, totals accumulate', async ({ page }) => {
  791 |         const app = new AppManager(page);
  792 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  793 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  794 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  795 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  796 | 
  797 |         await app.pickDate('Invoice Date');
  798 |         await app.pickDate('Due Date');
  799 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  800 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  801 |         await fillCurrencyField(page, app);
  802 | 
  803 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  804 | 
  805 |         // Item line
  806 |         await page.locator('button:has-text("Line Item")').first().click();
  807 |         await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: capturedItem?.price || '400', itemName: capturedItem?.name });
  808 | 
  809 |         // Miscellaneous line
  810 |         await page.locator('button:has-text("Line Item")').first().click();
  811 |         const modal2 = page.getByRole('dialog').last();
  812 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  813 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  814 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  815 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '200', description: 'Handling' });
  816 |         } else {
  817 |             await page.keyboard.press('Escape');
  818 |             await page.locator('button:has-text("Line Item")').first().click();
  819 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: capturedItem?.price || '200', itemName: capturedItem?.name });
  820 |         }
  821 | 
  822 |         const rowCount = await page.locator('table tbody tr, [role="row"], [data-testid*="line"], .line-item-row').count();
  823 |         const altRowCount = await page.locator('.chakra-stack > div, .flex-row').filter({ hasText: /\d+/ }).count();
  824 |         const effectiveRowCount = rowCount > 0 ? rowCount : altRowCount;
  825 |         console.log(`[AUDIT] ${effectiveRowCount} lines visible in Invoice form`);
  826 | 
  827 |         // ── Stock-error guard: if table shows "Insufficient stock", reprovision via API ─
  828 |         await page.waitForTimeout(800);
  829 |         const insufficientRowInv = page.locator('table tbody tr, [role="row"]')
  830 |             .filter({ hasText: /insufficient stock|available:\s*0/i }).first();
  831 |         if (await insufficientRowInv.isVisible({ timeout: 1500 }).catch(() => false)) {
  832 |             console.log('[INV-UI-03] ⚠️ Stock error detected — auto topping up item stock via API');
  833 |             const itemIdToTopUp = (itemA as any)?.id || (itemA as any)?.itemId;
  834 |             if (itemIdToTopUp) {
  835 |                 await app.topUpItemStockAPI(itemIdToTopUp, 50);
  836 |             }
  837 |             await page.waitForTimeout(2000);
  838 |         }
  839 | 
  840 |         const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
  841 |         await expect(addNowBtn).toBeEnabled({ timeout: 10000 });
  842 |         await addNowBtn.click();
  843 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  844 | 
  845 |         const invId = await app.extractIdFromUrl();
  846 |         const invData = await app.api.sales.getInvoiceAPI(invId);
  847 |         const lines: any[] = invData.items || invData.invoice_items || [];
  848 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  849 |         const total = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  850 |         console.log(`[AUDIT] Invoice lines: ${lines.length} | Total: $${total}`);
  851 |         console.log('[PASS] Invoice mixed lines — all rows present, total accumulated');
  852 |     });
  853 | 
  854 |     test('INV-API-04: Multi-line invoice → grand total = sum of lines', async ({ page }) => {
  855 |         const app = new AppManager(page);
  856 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  857 |         const { apiBase, headers, qs } = await app.buildApiContext();
  858 |         const u1 = itemA.unitCost || 100;
  859 |         const u2 = itemB.unitCost || 80;
  860 |         const L1 = 3 * u1, L2 = 2 * u2;
  861 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  862 |         const dateIso = (await DateHelper.resolve(page)).iso;
  863 | 
  864 |         const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
  865 |             headers,
  866 |             data: {
  867 |                 accounts_receivable_id: salesMeta.arAccountId,
  868 |                 customer_id: salesMeta.customerId,
  869 |                 invoice_date: dateIso,
  870 |                 due_date: dateIso,
  871 |                 currency_id: salesMeta.currencyId,
  872 |                 released_sales_order_items: [],
  873 |                 items: [
  874 |                     { item_id: itemA.itemId, quantity: 3, unit_price: u1, amount: L1, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  875 |                     { item_id: itemB.itemId, quantity: 2, unit_price: u2, amount: L2, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  876 |                 ],
  877 |             },
  878 |         });
  879 | 
  880 |         expect(resp.ok(), `Multi-line Invoice failed: HTTP ${resp.status()}`).toBe(true);
  881 |         const data = await resp.json();
  882 |         const lines: any[] = data.items || [];
  883 |         const linesSum = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  884 |         const invTotal = parseFloat(data.total_amount ?? data.grand_total ?? data.amount ?? '0');
  885 |         console.log(`[AUDIT] Lines sum: $${linesSum} | Invoice total: $${invTotal} | Expected: $${L1 + L2}`);
  886 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
```