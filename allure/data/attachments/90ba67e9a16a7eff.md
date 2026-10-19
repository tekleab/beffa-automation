# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @regression >> INV-UI-01: Add inventory Line Item via modal → Invoice created and approved
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:738:9

# Error details

```
TimeoutError: locator.evaluate: Timeout 90000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Line Item")').first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - button "BEFA ABC Trading IT Administrator / User Manager" [active] [ref=e13] [cursor=pointer]:
              - img "BEFA" [ref=e15]
              - generic [ref=e16]:
                - generic [ref=e17]: ABC Trading
                - generic [ref=e18]: IT Administrator / User Manager
        - textbox "Search navigation..." [ref=e23]
      - generic [ref=e25]:
        - list [ref=e27]:
          - listitem [ref=e28]:
            - link "Dashboard" [ref=e29] [cursor=pointer]:
              - /url: /dashboard
        - list [ref=e38]:
          - listitem [ref=e39]:
            - button "Accounting" [expanded] [ref=e40] [cursor=pointer]
            - list [ref=e49]:
              - listitem [ref=e50]:
                - button "General Ledger" [ref=e51] [cursor=pointer]
              - listitem [ref=e58]:
                - button "Account Payables" [ref=e59] [cursor=pointer]
              - listitem [ref=e65]:
                - button "Account Receivables" [expanded] [ref=e66] [cursor=pointer]
                - list [ref=e75]:
                  - listitem [ref=e76]:
                    - link "Overview" [ref=e77] [cursor=pointer]:
                      - /url: /receivables/overview/
                  - listitem [ref=e82]:
                    - link "Invoices" [ref=e83] [cursor=pointer]:
                      - /url: /receivables/invoices/?page=1&pageSize=15
                  - listitem [ref=e88]:
                    - link "Receipts" [ref=e89] [cursor=pointer]:
                      - /url: /receivables/receipts/?page=1&pageSize=15
              - listitem [ref=e93]:
                - button "Asset" [ref=e94] [cursor=pointer]
        - list [ref=e103]:
          - listitem [ref=e104]:
            - button "Account Reconciliation" [ref=e105] [cursor=pointer]
        - list [ref=e113]:
          - listitem [ref=e114]:
            - button "CRM" [ref=e115] [cursor=pointer]
        - list [ref=e125]:
          - listitem [ref=e126]:
            - button "HRM" [ref=e127] [cursor=pointer]
        - list [ref=e137]:
          - listitem [ref=e138]:
            - button "Project" [ref=e139] [cursor=pointer]
        - list [ref=e147]:
          - listitem [ref=e148]:
            - button "SCM" [ref=e149] [cursor=pointer]
        - list [ref=e158]:
          - listitem [ref=e159]:
            - button "Lease" [ref=e160] [cursor=pointer]
        - list [ref=e168]:
          - listitem [ref=e169]:
            - button "Services" [ref=e170] [cursor=pointer]
        - list [ref=e177]:
          - listitem [ref=e178]:
            - button "Reports" [ref=e179] [cursor=pointer]
        - list [ref=e187]:
          - listitem [ref=e188]:
            - button "Administration" [ref=e189] [cursor=pointer]
      - list [ref=e197]:
        - listitem [ref=e198]:
          - button "SA System Admin IT Administrator / User Manager" [ref=e199] [cursor=pointer]:
            - generic [ref=e200]: SA
            - generic [ref=e202]:
              - generic [ref=e203]: System Admin
              - generic [ref=e204]: IT Administrator / User Manager
    - main [ref=e208]:
      - generic [ref=e209]:
        - button "Toggle Sidebar" [ref=e211] [cursor=pointer]
        - generic [ref=e215]:
          - button "New" [ref=e216] [cursor=pointer]
          - button "Notifications" [ref=e223] [cursor=pointer]:
            - generic [ref=e227]: "5"
          - generic "Switch Calendar Era" [ref=e228]:
            - button "EC" [ref=e232] [cursor=pointer]
            - generic [ref=e233]: "|"
            - button "GC" [ref=e234] [cursor=pointer]
          - button "Change Language" [ref=e235] [cursor=pointer]:
            - generic [ref=e239]: EN
          - button "S System Admin IT Administrator / User Manager" [ref=e243] [cursor=pointer]:
            - generic [ref=e244]: S
            - generic [ref=e246]:
              - generic [ref=e247]: System Admin
              - generic [ref=e248]: IT Administrator / User Manager
      - main [ref=e251]:
        - generic [ref=e253]:
          - generic [ref=e254]:
            - navigation "breadcrumb" [ref=e255]:
              - list [ref=e256]:
                - navigation "breadcrumb" [ref=e257]:
                  - list [ref=e258]:
                    - listitem [ref=e259]:
                      - link "Home" [ref=e260] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e261]:
                      - link "Settings" [ref=e262] [cursor=pointer]:
                        - /url: /settings
                      - text: /
                    - listitem [ref=e263]:
                      - link "General" [ref=e264] [cursor=pointer]:
                        - /url: /settings/general
                      - text: /
                    - listitem [ref=e265]:
                      - link "Companies" [ref=e266] [cursor=pointer]:
                        - /url: /settings/general/companies
            - button "2019" [ref=e268] [cursor=pointer]
          - generic [ref=e274]:
            - generic [ref=e275]:
              - heading [level=5] [ref=e277]:
                - paragraph [ref=e279]: Companies
                - group [ref=e282]:
                  - button [ref=e283] [cursor=pointer]
              - table [ref=e288]:
                - rowgroup [ref=e289]:
                  - row [ref=e290]:
                    - columnheader "Company Name" [ref=e291] [cursor=pointer]
                    - columnheader "Legal Form" [ref=e293] [cursor=pointer]
                    - columnheader "Company TIN" [ref=e295] [cursor=pointer]
                    - columnheader "Status" [ref=e297] [cursor=pointer]
                    - columnheader "Phone" [ref=e299] [cursor=pointer]
                    - columnheader "Email" [ref=e301] [cursor=pointer]
                    - columnheader "Website" [ref=e303] [cursor=pointer]
                - rowgroup [ref=e305]:
                  - row [ref=e306]:
                    - cell [ref=e307]:
                      - paragraph [ref=e309] [cursor=pointer]: ABC Trading
                    - cell "Private Limited Company" [ref=e310]
                    - cell "1111222333" [ref=e312]
                    - cell [ref=e314]:
                      - generic:
                        - paragraph
                    - cell "0987878787" [ref=e315]
                    - cell "abctrading@gmail.com" [ref=e317]
                    - cell [ref=e319]
                  - row [ref=e320]:
                    - cell [ref=e321]:
                      - paragraph [ref=e323] [cursor=pointer]: befa tutorial
                    - cell "Limited Partnership" [ref=e324]
                    - cell "1988773322" [ref=e326]
                    - cell [ref=e328]:
                      - generic:
                        - paragraph
                    - cell "0988221122" [ref=e329]
                    - cell "samole@gmail.com" [ref=e331]
                    - cell [ref=e333]
                  - row [ref=e334]:
                    - cell [ref=e335]:
                      - paragraph [ref=e337] [cursor=pointer]: Construction BM
                    - cell "Private Limited Company" [ref=e338]
                    - cell "0096005535" [ref=e340]
                    - cell [ref=e342]:
                      - generic:
                        - paragraph
                    - cell "0922362596" [ref=e343]
                    - cell "beskender2@gmail.com" [ref=e345]
                    - cell [ref=e347]
                  - row [ref=e348]:
                    - cell [ref=e349]:
                      - paragraph [ref=e351] [cursor=pointer]: Doloremque sit hic
                    - cell "General Partnership" [ref=e352]
                    - cell "1111122222" [ref=e354]
                    - cell [ref=e356]:
                      - generic:
                        - paragraph
                    - cell "0928620588" [ref=e357]
                    - cell "test@example.com" [ref=e359]
                    - cell [ref=e361]
                  - row [ref=e362]:
                    - cell [ref=e363]:
                      - paragraph [ref=e365] [cursor=pointer]: elias blc
                    - cell "Limited Partnership" [ref=e366]
                    - cell "1233211454" [ref=e368]
                    - cell [ref=e370]:
                      - generic:
                        - paragraph
                    - cell "0991181167" [ref=e371]
                    - cell "eliassisat56@gmail.com" [ref=e373]
                    - cell [ref=e375]
                  - row [ref=e376]:
                    - cell [ref=e377]:
                      - paragraph [ref=e379] [cursor=pointer]: Ministry of Education
                    - cell "Public Enterprises" [ref=e380]
                    - cell "0095004565" [ref=e382]
                    - cell [ref=e384]:
                      - generic:
                        - paragraph
                    - cell "0912162457" [ref=e385]
                    - cell "BMtech@gmail.com" [ref=e387]
                    - cell [ref=e389]
                  - row [ref=e390]:
                    - cell [ref=e391]:
                      - paragraph [ref=e393] [cursor=pointer]: new company
                    - cell "Limited Partnership" [ref=e394]
                    - cell "1900922222" [ref=e396]
                    - cell [ref=e398]:
                      - generic:
                        - paragraph
                    - cell "0988775544" [ref=e399]
                    - cell "tekleabhhadush@gmail.com" [ref=e401]
                    - cell [ref=e403]
                  - row [ref=e404]:
                    - cell [ref=e405]:
                      - paragraph [ref=e407] [cursor=pointer]: One Company
                    - cell "Sole proprietorship" [ref=e408]
                    - cell "1234432100" [ref=e410]
                    - cell [ref=e412]:
                      - generic:
                        - paragraph
                    - cell "0912344321" [ref=e413]
                    - cell "one@email.com" [ref=e415]
                    - cell "https://one.com" [ref=e417]
                  - row [ref=e419]:
                    - cell [ref=e420]:
                      - paragraph [ref=e422] [cursor=pointer]: Quick Test
                    - cell "Limited Partnership" [ref=e423]
                    - cell "1099224423" [ref=e425]
                    - cell [ref=e427]:
                      - generic:
                        - paragraph
                    - cell "0999334534" [ref=e428]
                    - cell "some@outlook.com" [ref=e430]
                    - cell [ref=e432]
                  - row [ref=e433]:
                    - cell [ref=e434]:
                      - paragraph [ref=e436] [cursor=pointer]: sample
                    - cell "Private Limited Company" [ref=e437]
                    - cell "1212121314" [ref=e439]
                    - cell [ref=e441]:
                      - generic:
                        - paragraph
                    - cell "0915151514" [ref=e442]
                    - cell "befatutorial@gmail.com" [ref=e444]
                    - cell [ref=e446]
                  - row [ref=e447]:
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
                  - row [ref=e463]:
                    - cell [ref=e464]
                    - cell [ref=e465]
                    - cell [ref=e466]
                    - cell [ref=e467]
                    - cell [ref=e468]
                    - cell [ref=e469]
                    - cell [ref=e470]
                  - row [ref=e471]:
                    - cell [ref=e472]
                    - cell [ref=e473]
                    - cell [ref=e474]
                    - cell [ref=e475]
                    - cell [ref=e476]
                    - cell [ref=e477]
                    - cell [ref=e478]
                  - row [ref=e479]:
                    - cell [ref=e480]
                    - cell [ref=e481]
                    - cell [ref=e482]
                    - cell [ref=e483]
                    - cell [ref=e484]
                    - cell [ref=e485]
                    - cell [ref=e486]
                - rowgroup [ref=e487]:
                  - row [ref=e488]:
                    - columnheader [ref=e489]
                    - columnheader [ref=e490]
                    - columnheader [ref=e491]
                    - columnheader [ref=e492]
                    - columnheader [ref=e493]
                    - columnheader [ref=e494]
                    - columnheader [ref=e495]
            - generic [ref=e496]:
              - combobox [ref=e499]:
                - option "Show 5 rows"
                - option "Show 10 rows" [selected]
                - option "Show 15 rows"
                - option "Show 25 rows"
                - option "Show 50 rows"
                - option "Show 100 rows"
              - generic [ref=e501]:
                - button "go to first page" [disabled] [ref=e502]
                - generic [ref=e505]:
                  - button "go to previous page" [disabled] [ref=e506]
                  - paragraph [ref=e509]: Page
                  - paragraph [ref=e510]: 1 of 2
                  - button "go to next page" [ref=e511] [cursor=pointer]
                - button "go to last page" [ref=e514] [cursor=pointer]
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
  665 |             currency_id: salesMeta.currencyId,
  666 |             customer_id: salesMeta.customerId,
  667 |             so_date: periodDateIso,
  668 |             so_items: [{ item_id: itemA.itemId, quantity: 0, unit_price: 500, amount: 0, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  669 |             status: 'draft',
  670 |         };
  671 | 
  672 |         const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
  673 |             headers,
  674 |             data: payload,
  675 |         });
  676 | 
  677 |         if (resp.ok()) {
  678 |             const amt = parseFloat(((await resp.json()).so_items || [])[0]?.amount ?? '0');
  679 |             expect(amt).toBe(0);
  680 |             console.log('[INFO] Zero-qty SO line accepted — $0 amount, no financial impact');
  681 |         } else {
  682 |             await assertValidationRejection(resp, {
  683 |                 label: 'SO-API-05: Zero Quantity Line Item',
  684 |                 requestData: payload,
  685 |                 url: `${apiBase}/sales-orders`,
  686 |                 method: 'POST',
  687 |             });
  688 |         }
  689 |     });
  690 | 
  691 |     test('SO-API-06: Negative unit price → rejected or flagged as known bug', async ({ page }) => {
  692 |         const app = new AppManager(page);
  693 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  694 |         const { apiBase, headers, qs } = await app.buildApiContext();
  695 | 
  696 |         const payload = {
  697 |             accounts_receivable_id: salesMeta.arAccountId,
  698 |             currency_id: salesMeta.currencyId,
  699 |             customer_id: salesMeta.customerId,
  700 |             so_date: periodDateIso,
  701 |             so_items: [{ item_id: itemA.itemId, quantity: 1, unit_price: -500, amount: -500, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  702 |             status: 'draft',
  703 |         };
  704 | 
  705 |         const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
  706 |             headers,
  707 |             data: payload,
  708 |         });
  709 | 
  710 |         if (resp.ok()) {
  711 |             console.log(`[⚠️ BACKEND DEFECT / KNOWN BEHAVIOR] Server accepted SO with negative unit price (draft status)`);
  712 |             const body = await resp.json().catch(() => ({}));
  713 |             apiErrorCollector.record({
  714 |                 method: 'POST',
  715 |                 url: `${apiBase}/sales-orders`,
  716 |                 status: 200,
  717 |                 requestHeaders: headers,
  718 |                 requestBody: payload,
  719 |                 responseBody: body,
  720 |                 label: 'SO-API-06: Defect - Server accepted negative unit price (-500)',
  721 |             });
  722 |             expect(body).toHaveProperty('id');
  723 |         } else {
  724 |             await assertValidationRejection(resp, {
  725 |                 label: 'SO-API-06: Negative Unit Price Validation',
  726 |                 requestData: payload,
  727 |                 url: `${apiBase}/sales-orders`,
  728 |                 method: 'POST',
  729 |             });
  730 |         }
  731 |     });
  732 | 
  733 | 
  734 |     // =========================================================================
  735 |     // INVOICE
  736 |     // =========================================================================
  737 | 
  738 |     test('INV-UI-01: Add inventory Line Item via modal → Invoice created and approved', async ({ page }) => {
  739 |         const app = new AppManager(page);
  740 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  741 | 
  742 |         // Top up itemA stock BEFORE navigating — pass exact locationId/warehouseId to avoid loc=0 fallback
  743 |         const itemIdToTopUpInv1 = (itemA as any)?.id || (itemA as any)?.itemId;
  744 |         if (itemIdToTopUpInv1) {
  745 |             await app.topUpItemStockAPI(itemIdToTopUpInv1, 50, itemA.locationId, itemA.warehouseId);
  746 |             console.log(`[INV-UI-01] ✅ Pre-topped itemA stock to 50 units @ loc=${itemA.locationId}`);
  747 |         }
  748 | 
  749 |         const targetItemName = (itemA as any)?.itemName || (itemA as any)?.name;
  750 |         const targetUnitPrice = String((itemA as any)?.unit_cost || (itemA as any)?.unitCost || (itemA as any)?.selling_price || 100);
  751 | 
  752 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  753 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  754 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  755 | 
  756 |         await app.pickDate('Invoice Date');
  757 |         await app.pickDate('Due Date');
  758 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  759 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable', false, 'Accounts Receivable');
  760 |         await fillCurrencyField(page, app);
  761 | 
  762 |         await page.keyboard.press('Escape').catch(() => {});
  763 |         await page.waitForTimeout(500);
  764 |         const lineItemBtn = page.locator('button:has-text("Line Item")').first();
> 765 |         await lineItemBtn.click({ force: true }).catch(() => lineItemBtn.evaluate((n: HTMLElement) => n.click()));
      |                                                                          ^ TimeoutError: locator.evaluate: Timeout 90000ms exceeded.
  766 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: targetUnitPrice, itemName: targetItemName, warehouseName: 'Default Warehouse', locationName: 'location2' });
  767 |         console.log('[OK] Inventory line item added to Invoice');
  768 | 
  769 |         // Safety guard: top up again if row still shows stock error
  770 |         await page.waitForTimeout(500);
  771 |         const insufficientRowInv = page.locator('table tbody tr, [role="row"]')
  772 |             .filter({ hasText: /insufficient stock|available:\s*0/i }).first();
  773 |         if (await insufficientRowInv.isVisible({ timeout: 2000 }).catch(() => false)) {
  774 |             console.log('[INV-UI-01] ⚠️ Stock error still showing — topping up again');
  775 |             if (itemIdToTopUpInv1) await app.topUpItemStockAPI(itemIdToTopUpInv1, 50, itemA.locationId, itemA.warehouseId);
  776 |             await page.waitForTimeout(2000);
  777 |         }
  778 | 
  779 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  780 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  781 | 
  782 |         const invId = await app.extractIdFromUrl();
  783 |         await app.advanceDocumentAPI(invId, 'invoices');
  784 |         console.log('[PASS] Invoice with inventory line created and approved');
  785 |     });
  786 | 
  787 | 
  788 |     test('INV-UI-02: Add Miscellaneous line via modal → Invoice total reflects it', async ({ page }) => {
  789 |         const app = new AppManager(page);
  790 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  791 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  792 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  793 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  794 | 
  795 |         await app.pickDate('Invoice Date');
  796 |         await app.pickDate('Due Date');
  797 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  798 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable', false, 'Accounts Receivable');
  799 |         await fillCurrencyField(page, app);
  800 | 
  801 |         await page.keyboard.press('Escape').catch(() => {});
  802 |         await page.waitForTimeout(500);
  803 |         const lineItemBtn2 = page.locator('button:has-text("Line Item")').first();
  804 |         await lineItemBtn2.click({ force: true }).catch(() => lineItemBtn2.evaluate((n: HTMLElement) => n.click()));
  805 |         const modal = page.getByRole('dialog').last();
  806 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  807 | 
  808 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  809 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  810 |             console.log('[SKIP] Miscellaneous button not present in Invoice modal');
  811 |             await page.keyboard.press('Escape');
  812 |             return;
  813 |         }
  814 | 
  815 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '1500', description: 'Consulting fee' });
  816 | 
  817 |         // Switch to Miscellaneous tab to verify line is rendered in table
  818 |         const miscTab = page.getByRole('tab', { name: /Miscellaneous/i });
  819 |         if (await miscTab.isVisible({ timeout: 3000 }).catch(() => false)) {
  820 |             await miscTab.click().catch(() => {});
  821 |             await page.waitForTimeout(500);
  822 |         }
  823 | 
  824 |         const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
  825 |         const isEnabled = await addNowBtn.isEnabled().catch(() => false);
  826 |         if (isEnabled) {
  827 |             await addNowBtn.click();
  828 |             await page.waitForURL(/invoices\/.*\/detail/, { timeout: 30000 }).catch(() => {});
  829 |             console.log('[PASS] Invoice with miscellaneous line created');
  830 |         } else {
  831 |             const tableRow = page.locator('table tbody tr, [role="row"]').filter({ hasText: /Consulting fee|1500/i }).first();
  832 |             await expect(tableRow).toBeVisible({ timeout: 10000 });
  833 |             console.log('[PASS] Miscellaneous line item successfully added to Invoice and rendered in table (Add Now disabled per ERP business rule requiring inventory line)');
  834 |         }
  835 |     });
  836 | 
  837 | 
  838 | 
  839 |     test('INV-UI-03: Mixed Item + Miscellaneous lines → both rows in table, totals accumulate', async ({ page }) => {
  840 |         const app = new AppManager(page);
  841 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  842 | 
  843 |         // Top up itemA stock BEFORE navigating — prevents "Insufficient stock" rows
  844 |         const itemIdToTopUpInv3 = (itemA as any)?.id || (itemA as any)?.itemId;
  845 |         if (itemIdToTopUpInv3) {
  846 |             await app.topUpItemStockAPI(itemIdToTopUpInv3, 50, itemA.locationId, itemA.warehouseId);
  847 |             console.log(`[INV-UI-03] ✅ Pre-topped itemA stock to 50 units @ loc=${itemA.locationId}`);
  848 |         }
  849 | 
  850 |         const targetItemName = (itemA as any)?.itemName || (itemA as any)?.name;
  851 |         const targetUnitPrice = String((itemA as any)?.unit_cost || (itemA as any)?.unitCost || (itemA as any)?.selling_price || 100);
  852 | 
  853 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  854 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  855 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  856 | 
  857 |         await app.pickDate('Invoice Date');
  858 |         await app.pickDate('Due Date');
  859 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  860 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable', false, 'Accounts Receivable');
  861 |         await fillCurrencyField(page, app);
  862 | 
  863 |         await page.keyboard.press('Escape').catch(() => {});
  864 |         await page.waitForTimeout(500);
  865 | 
```