# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> INV-UI-01: Add inventory Line Item via modal → Invoice created and approved
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:747:9

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
                      - button "Customer selector" [ref=e208]: Adyam Yimer
                    - group [ref=e209]:
                      - generic [ref=e210]: Sales Order
                      - button "Sales Order selector" [ref=e211]
                    - generic [ref=e212]:
                      - generic [ref=e213]: Invoice Date
                      - button "ነሀሴ 24, 2018" [ref=e215] [cursor=pointer]:
                        - img [ref=e216]
                        - generic [ref=e218]: ነሀሴ 24, 2018
                    - generic [ref=e219]:
                      - group [ref=e220]:
                        - generic [ref=e221]: Invoice number
                        - textbox "Invoice number" [disabled] [ref=e223]: INV/2026/08/24/003161
                      - paragraph [ref=e224]: Invoice number is auto-generated
                    - group [ref=e225]:
                      - generic [ref=e226]: Budget
                      - button "Budget selector" [ref=e227]
                  - generic [ref=e228]:
                    - generic [ref=e229]:
                      - generic [ref=e230]: Due Date
                      - button "ነሀሴ 24, 2018" [ref=e232] [cursor=pointer]:
                        - img [ref=e233]
                        - generic [ref=e235]: ነሀሴ 24, 2018
                    - group [ref=e236]:
                      - generic [ref=e237]: Account Receivable *
                      - button "Account Receivable selector" [ref=e238]: Cash at Bank - Dashen
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
                        - 'row "ITM-WAC-570019797 - WAC-Item-1787570019797 2Insufficient stock. Available: 0, required: 2.00 Cash at Bank - Dashen 200 2 204.00" [ref=e286]':
                          - cell [ref=e287]
                          - cell "ITM-WAC-570019797 - WAC-Item-1787570019797" [ref=e288]:
                            - generic [ref=e290]: ITM-WAC-570019797 - WAC-Item-1787570019797
                          - 'cell "2Insufficient stock. Available: 0, required: 2.00" [ref=e291]':
                            - generic [ref=e293]: "2Insufficient stock. Available: 0, required: 2.00"
                          - cell [ref=e294]
                          - cell [ref=e295]
                          - cell "Cash at Bank - Dashen" [ref=e296]:
                            - generic [ref=e298]: Cash at Bank - Dashen
                          - cell [ref=e299]
                          - cell "200" [ref=e300]:
                            - generic [ref=e302]: "200"
                          - cell "2" [ref=e303]:
                            - generic [ref=e305]: "2"
                          - cell "204.00" [ref=e306]:
                            - generic [ref=e308]: "204.00"
                          - cell [ref=e309]
                        - row [ref=e311]:
                          - cell [ref=e312]
                          - cell [ref=e313]
                          - cell [ref=e314]
                          - cell [ref=e315]
                          - cell [ref=e316]
                          - cell [ref=e317]
                          - cell [ref=e318]
                          - cell [ref=e319]
                          - cell [ref=e320]
                          - cell [ref=e321]
                          - cell [ref=e322]
                        - row [ref=e323]:
                          - cell [ref=e324]
                          - cell [ref=e325]
                          - cell [ref=e326]
                          - cell [ref=e327]
                          - cell [ref=e328]
                          - cell [ref=e329]
                          - cell [ref=e330]
                          - cell [ref=e331]
                          - cell [ref=e332]
                          - cell [ref=e333]
                          - cell [ref=e334]
                        - row [ref=e335]:
                          - cell [ref=e336]
                          - cell [ref=e337]
                          - cell [ref=e338]
                          - cell [ref=e339]
                          - cell [ref=e340]
                          - cell [ref=e341]
                          - cell [ref=e342]
                          - cell [ref=e343]
                          - cell [ref=e344]
                          - cell [ref=e345]
                          - cell [ref=e346]
                        - row [ref=e347]:
                          - cell [ref=e348]
                          - cell [ref=e349]
                          - cell [ref=e350]
                          - cell [ref=e351]
                          - cell [ref=e352]
                          - cell [ref=e353]
                          - cell [ref=e354]
                          - cell [ref=e355]
                          - cell [ref=e356]
                          - cell [ref=e357]
                          - cell [ref=e358]
                        - row [ref=e359]:
                          - cell [ref=e360]
                          - cell [ref=e361]
                          - cell [ref=e362]
                          - cell [ref=e363]
                          - cell [ref=e364]
                          - cell [ref=e365]
                          - cell [ref=e366]
                          - cell [ref=e367]
                          - cell [ref=e368]
                          - cell [ref=e369]
                          - cell [ref=e370]
                        - row [ref=e371]:
                          - cell [ref=e372]
                          - cell [ref=e373]
                          - cell [ref=e374]
                          - cell [ref=e375]
                          - cell [ref=e376]
                          - cell [ref=e377]
                          - cell [ref=e378]
                          - cell [ref=e379]
                          - cell [ref=e380]
                          - cell [ref=e381]
                          - cell [ref=e382]
                        - row [ref=e383]:
                          - cell [ref=e384]
                          - cell [ref=e385]
                          - cell [ref=e386]
                          - cell [ref=e387]
                          - cell [ref=e388]
                          - cell [ref=e389]
                          - cell [ref=e390]
                          - cell [ref=e391]
                          - cell [ref=e392]
                          - cell [ref=e393]
                          - cell [ref=e394]
                        - row [ref=e395]:
                          - cell [ref=e396]
                          - cell [ref=e397]
                          - cell [ref=e398]
                          - cell [ref=e399]
                          - cell [ref=e400]
                          - cell [ref=e401]
                          - cell [ref=e402]
                          - cell [ref=e403]
                          - cell [ref=e404]
                          - cell [ref=e405]
                          - cell [ref=e406]
                        - row [ref=e407]:
                          - cell [ref=e408]
                          - cell [ref=e409]
                          - cell [ref=e410]
                          - cell [ref=e411]
                          - cell [ref=e412]
                          - cell [ref=e413]
                          - cell [ref=e414]
                          - cell [ref=e415]
                          - cell [ref=e416]
                          - cell [ref=e417]
                          - cell [ref=e418]
                        - row [ref=e419]:
                          - cell [ref=e420]
                          - cell [ref=e421]
                          - cell [ref=e422]
                          - cell [ref=e423]
                          - cell [ref=e424]
                          - cell [ref=e425]
                          - cell [ref=e426]
                          - cell [ref=e427]
                          - cell [ref=e428]
                          - cell [ref=e429]
                          - cell [ref=e430]
                        - row [ref=e431]:
                          - cell [ref=e432]
                          - cell [ref=e433]
                          - cell [ref=e434]
                          - cell [ref=e435]
                          - cell [ref=e436]
                          - cell [ref=e437]
                          - cell [ref=e438]
                          - cell [ref=e439]
                          - cell [ref=e440]
                          - cell [ref=e441]
                          - cell [ref=e442]
                        - row [ref=e443]:
                          - cell [ref=e444]
                          - cell [ref=e445]
                          - cell [ref=e446]
                          - cell [ref=e447]
                          - cell [ref=e448]
                          - cell [ref=e449]
                          - cell [ref=e450]
                          - cell [ref=e451]
                          - cell [ref=e452]
                          - cell [ref=e453]
                          - cell [ref=e454]
                        - row [ref=e455]:
                          - cell [ref=e456]
                          - cell [ref=e457]
                          - cell [ref=e458]
                          - cell [ref=e459]
                          - cell [ref=e460]
                          - cell [ref=e461]
                          - cell [ref=e462]
                          - cell [ref=e463]
                          - cell [ref=e464]
                          - cell [ref=e465]
                          - cell [ref=e466]
                        - row [ref=e467]:
                          - cell [ref=e468]
                          - cell [ref=e469]
                          - cell [ref=e470]
                          - cell [ref=e471]
                          - cell [ref=e472]
                          - cell [ref=e473]
                          - cell [ref=e474]
                          - cell [ref=e475]
                          - cell [ref=e476]
                          - cell [ref=e477]
                          - cell [ref=e478]
                      - rowgroup [ref=e479]:
                        - row "200.00 4.00 204.00" [ref=e480]:
                          - columnheader [ref=e481]
                          - columnheader [ref=e482]
                          - columnheader [ref=e483]
                          - columnheader [ref=e484]
                          - columnheader [ref=e485]
                          - columnheader [ref=e486]
                          - columnheader [ref=e487]
                          - columnheader "200.00" [ref=e488]
                          - columnheader "4.00" [ref=e489]
                          - columnheader "204.00" [ref=e490]
                          - columnheader [ref=e491]
              - group [ref=e493]:
                - button "Add Now" [disabled] [ref=e494]
                - button [disabled] [ref=e495]:
                  - generic:
                    - img
        - generic [ref=e496]: BM Technology © 2026
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
  681 |         });
  682 | 
  683 |         if (!patchResp.ok()) { console.log(`[SKIP] SO multi-line PATCH not supported: ${patchResp.status()}`); return; }
  684 | 
  685 |         const updated = await patchResp.json();
  686 |         const linesSum = (updated.so_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  687 |         console.log(`[AUDIT] Lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  688 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  689 |         console.log('[PASS] SO multi-line totals correct');
  690 |     });
  691 | 
  692 |     test('SO-API-05: Zero-qty line → $0 amount or rejected', async ({ page }) => {
  693 |         const app = new AppManager(page);
  694 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  695 |         const { apiBase, headers, qs } = await app.buildApiContext();
  696 | 
  697 |         const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
  698 |             headers,
  699 |             data: {
  700 |                 accounts_receivable_id: salesMeta.arAccountId,
  701 |                 currency_id: salesMeta.currencyId,
  702 |                 customer_id: salesMeta.customerId,
  703 |                 so_date: periodDateIso,
  704 |                 so_items: [{ item_id: itemA.itemId, quantity: 0, unit_price: 500, amount: 0, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  705 |                 status: 'draft',
  706 |             },
  707 |         });
  708 | 
  709 |         if (resp.ok()) {
  710 |             const amt = parseFloat(((await resp.json()).so_items || [])[0]?.amount ?? '0');
  711 |             expect(amt).toBe(0);
  712 |             console.log('[INFO] Zero-qty SO line accepted — $0 amount, no financial impact');
  713 |         } else {
  714 |             console.log(`[PASS] Zero-qty SO line rejected: HTTP ${resp.status()}`);
  715 |             expect([400, 422]).toContain(resp.status());
  716 |         }
  717 |     });
  718 | 
  719 |     test('SO-API-06: Negative unit price → rejected or flagged as known bug', async ({ page }) => {
  720 |         const app = new AppManager(page);
  721 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  722 |         const { apiBase, headers, qs } = await app.buildApiContext();
  723 | 
  724 |         const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
  725 |             headers,
  726 |             data: {
  727 |                 accounts_receivable_id: salesMeta.arAccountId,
  728 |                 currency_id: salesMeta.currencyId,
  729 |                 customer_id: salesMeta.customerId,
  730 |                 so_date: periodDateIso,
  731 |                 so_items: [{ item_id: itemA.itemId, quantity: 1, unit_price: -500, amount: -500, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  732 |                 status: 'draft',
  733 |             },
  734 |         });
  735 | 
  736 |         if (resp.ok()) {
  737 |             expect(resp.ok(), 'SO with negative unit price must be rejected by server').toBe(false);
  738 |         } else {
  739 |             console.log(`[PASS] Negative price SO line rejected: HTTP ${resp.status()}`);
  740 |         }
  741 |     });
  742 | 
  743 |     // =========================================================================
  744 |     // INVOICE
  745 |     // =========================================================================
  746 | 
  747 |     test('INV-UI-01: Add inventory Line Item via modal → Invoice created and approved', async ({ page }) => {
  748 |         const app = new AppManager(page);
  749 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  750 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  751 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  752 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  753 | 
  754 |         await app.pickDate('Invoice Date');
  755 |         await app.pickDate('Due Date');
  756 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  757 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  758 |         await fillCurrencyField(page, app);
  759 | 
  760 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  761 | 
  762 |         const lineItemBtn = page.getByRole('button', { name: 'Line Item' });
  763 |         await lineItemBtn.click();
  764 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: capturedItem?.price || '800', itemName: capturedItem?.name });
  765 |         console.log('[OK] Inventory line item added to Invoice');
  766 | 
  767 |         // ── Stock-error guard: if table shows "Insufficient stock", reprovision via API ─
  768 |         await page.waitForTimeout(500);
  769 |         const insufficientRowInv = page.locator('table tbody tr, [role="row"]')
  770 |             .filter({ hasText: /insufficient stock|available:\s*0/i }).first();
  771 |         if (await insufficientRowInv.isVisible({ timeout: 2000 }).catch(() => false)) {
  772 |             console.log('[INV-UI-01] ⚠️ Stock error detected — auto topping up item stock via API');
  773 |             const itemIdToTopUp = (itemA as any)?.id || (itemA as any)?.itemId;
  774 |             if (itemIdToTopUp) {
  775 |                 await app.topUpItemStockAPI(itemIdToTopUp, 50);
  776 |             }
  777 |             await page.waitForTimeout(2000);
  778 |         }
  779 | 
  780 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
> 781 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
      |                    ^ TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
  782 | 
  783 |         const invId = await app.extractIdFromUrl();
  784 |         await app.advanceDocumentAPI(invId, 'invoices');
  785 |         console.log('[PASS] Invoice with inventory line created and approved');
  786 |     });
  787 | 
  788 |     test('INV-UI-02: Add Miscellaneous line via modal → Invoice total reflects it', async ({ page }) => {
  789 |         const app = new AppManager(page);
  790 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  791 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  792 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  793 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  794 | 
  795 |         await app.pickDate('Invoice Date');
  796 |         await app.pickDate('Due Date');
  797 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  798 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  799 |         await fillCurrencyField(page, app);
  800 | 
  801 |         await page.getByRole('button', { name: 'Line Item' }).click();
  802 |         const modal = page.getByRole('dialog').last();
  803 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  804 | 
  805 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  806 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  807 |             console.log('[SKIP] Miscellaneous button not present in Invoice modal');
  808 |             await page.keyboard.press('Escape');
  809 |             return;
  810 |         }
  811 | 
  812 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '1500', description: 'Consulting fee' });
  813 | 
  814 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  815 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  816 |         console.log('[PASS] Invoice with miscellaneous line created');
  817 |     });
  818 | 
  819 |     test('INV-UI-03: Mixed Item + Miscellaneous lines → both rows in table, totals accumulate', async ({ page }) => {
  820 |         const app = new AppManager(page);
  821 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  822 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  823 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  824 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  825 | 
  826 |         await app.pickDate('Invoice Date');
  827 |         await app.pickDate('Due Date');
  828 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  829 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  830 |         await fillCurrencyField(page, app);
  831 | 
  832 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  833 | 
  834 |         // Item line
  835 |         await page.getByRole('button', { name: 'Line Item' }).click();
  836 |         await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: capturedItem?.price || '400', itemName: capturedItem?.name });
  837 | 
  838 |         // Miscellaneous line
  839 |         await page.getByRole('button', { name: 'Line Item' }).click();
  840 |         const modal2 = page.getByRole('dialog').last();
  841 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  842 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  843 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  844 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '200', description: 'Handling' });
  845 |         } else {
  846 |             await page.keyboard.press('Escape');
  847 |             await page.getByRole('button', { name: 'Line Item' }).click();
  848 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: capturedItem?.price || '200', itemName: capturedItem?.name });
  849 |         }
  850 | 
  851 |         const rowCount = await page.locator('table tbody tr, [role="row"], [data-testid*="line"], .line-item-row').count();
  852 |         const altRowCount = await page.locator('.chakra-stack > div, .flex-row').filter({ hasText: /\d+/ }).count();
  853 |         const effectiveRowCount = rowCount > 0 ? rowCount : altRowCount;
  854 |         console.log(`[AUDIT] ${effectiveRowCount} lines visible in Invoice form`);
  855 | 
  856 |         // ── Stock-error guard: if table shows "Insufficient stock", reprovision via API ─
  857 |         await page.waitForTimeout(800);
  858 |         const insufficientRowInv = page.locator('table tbody tr, [role="row"]')
  859 |             .filter({ hasText: /insufficient stock|available:\s*0/i }).first();
  860 |         if (await insufficientRowInv.isVisible({ timeout: 1500 }).catch(() => false)) {
  861 |             console.log('[INV-UI-03] ⚠️ Stock error detected — auto topping up item stock via API');
  862 |             const itemIdToTopUp = (itemA as any)?.id || (itemA as any)?.itemId;
  863 |             if (itemIdToTopUp) {
  864 |                 await app.topUpItemStockAPI(itemIdToTopUp, 50);
  865 |             }
  866 |             await page.waitForTimeout(2000);
  867 |         }
  868 | 
  869 |         const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
  870 |         await expect(addNowBtn).toBeEnabled({ timeout: 10000 });
  871 |         await addNowBtn.click();
  872 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  873 | 
  874 |         const invId = await app.extractIdFromUrl();
  875 |         const invData = await app.api.sales.getInvoiceAPI(invId);
  876 |         const lines: any[] = invData.items || invData.invoice_items || [];
  877 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  878 |         const total = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  879 |         console.log(`[AUDIT] Invoice lines: ${lines.length} | Total: $${total}`);
  880 |         console.log('[PASS] Invoice mixed lines — all rows present, total accumulated');
  881 |     });
```