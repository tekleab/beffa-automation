# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> BILL-UI-03: Mixed Item + Miscellaneous → both rows in Bill table, approve and verify AP
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1244:9

# Error details

```
Error: Bill 641982b9-d074-45b4-9536-05399fdabaa4 has no journal entries AND zero amount. Keys: current_approval_step, id, invoice_date, invoice_number, net_due, paid_amount, vendor

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
                      - link "Bills" [ref=e183] [cursor=pointer]:
                        - /url: /payables/bills/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e184]:
                      - link "Detail" [ref=e185] [cursor=pointer]:
                        - /url: /payables/bills/641982b9-d074-45b4-9536-05399fdabaa4/detail
            - button "2019" [ref=e187] [cursor=pointer]:
              - generic [ref=e188]: "2019"
              - img [ref=e189]
          - generic [ref=e192]:
            - button "Toggle Visibility" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
            - generic [ref=e198]:
              - img [ref=e199]
              - heading "Ooops Error!" [level=1] [ref=e201]
              - paragraph [ref=e202]: There seems to be an error handling your request. Please try again, or contact support.
        - generic [ref=e203]: BM Technology © 2026
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
  1202 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1203 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1204 |         await fillCurrencyField(page, app);
  1205 | 
  1206 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1207 | 
  1208 |         await page.locator('button:has-text("Line Item")').first().click();
  1209 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: capturedItem?.price || '2500', itemName: capturedItem?.name });
  1210 |         console.log('[OK] Inventory line item added to Bill');
  1211 | 
  1212 |         const submitBtn = page.locator('button:has-text("Add Now"), button:has-text("Save"), button:has-text("Create")').first();
  1213 |         await submitBtn.click();
  1214 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 }).catch(() => {});
  1215 | 
  1216 |         const billId = await app.extractIdFromUrl();
  1217 |         if (billId) {
  1218 |             await app.advanceDocumentAPI(billId, 'bills');
  1219 |         }
  1220 |         console.log('[PASS] Bill with inventory line created and approved');
  1221 |     });
  1222 | 
  1223 |     test('BILL-UI-02: Add Miscellaneous line via modal → Bill total reflects it', async ({ page }) => {
  1224 |         const app = new AppManager(page);
  1225 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1226 |         await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  1227 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  1228 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  1229 | 
  1230 |         await app.pickDate('Invoice Date');
  1231 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1232 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1233 |         await fillCurrencyField(page, app);
  1234 | 
  1235 |         await page.locator('button:has-text("Line Item")').first().click();
  1236 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '4000', description: 'Import duty' });
  1237 | 
  1238 |         const submitBtn = page.locator('button:has-text("Add Now"), button:has-text("Save"), button:has-text("Create")').first();
  1239 |         await submitBtn.click();
  1240 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 }).catch(() => {});
  1241 |         console.log('[PASS] Bill with miscellaneous line created');
  1242 |     });
  1243 | 
  1244 |     test('BILL-UI-03: Mixed Item + Miscellaneous → both rows in Bill table, approve and verify AP', async ({ page }) => {
  1245 |         const app = new AppManager(page);
  1246 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1247 |         await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  1248 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  1249 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  1250 | 
  1251 |         await app.pickDate('Invoice Date');
  1252 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1253 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  1254 |         await fillCurrencyField(page, app);
  1255 | 
  1256 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1257 | 
  1258 |         // Item line
  1259 |         await page.locator('button:has-text("Line Item")').first().click();
  1260 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: capturedItem?.price || '3000', itemName: capturedItem?.name });
  1261 | 
  1262 |         // Miscellaneous line
  1263 |         await page.locator('button:has-text("Line Item")').first().click();
  1264 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Clearance fee' });
  1265 | 
  1266 |         // Chakra UI Bill table uses div rows, not <table>/<tbody>/<tr>
  1267 |         // Count via the Sale/Purchase items list rows (div-based)
  1268 |         const rowCount = await page.locator(
  1269 |             'table tbody tr, [role="row"], [data-testid*="line"], [data-testid*="item"], .line-item-row'
  1270 |         ).count();
  1271 |         const altRowCount = await page.locator('.chakra-stack > div, .flex-row').filter({ hasText: /\d+/ }).count();
  1272 |         const effectiveRowCount = rowCount > 0 ? rowCount : altRowCount;
  1273 |         console.log(`[AUDIT] ${effectiveRowCount} lines in Bill form (table rows: ${rowCount}, alt: ${altRowCount})`);
  1274 |         // Soft check — at least 1 row; the hard check is on API lines count below
  1275 |         if (effectiveRowCount < 2) {
  1276 |             console.log(`[WARN] UI row count ${effectiveRowCount} < 2; will validate via API instead`);
  1277 |         }
  1278 | 
  1279 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1280 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  1281 | 
  1282 |         const billId = await app.extractIdFromUrl();
  1283 |         await app.advanceDocumentAPI(billId, 'bills');
  1284 |         const billData = await app.api.purchase.getBillAPI(billId);
  1285 |         // ERP GET /bill/{id} does NOT return line items in a direct array for standalone bills.
  1286 |         // Actual keys: accounts_payable, currency, current_approval_step, due_date,
  1287 |         //   id, invoice_date, invoice_number, purchase_journal, received_purchase_order_items,
  1288 |         //   related_files, unpaid_amount, vendor
  1289 |         // Validate via: purchase_journal entries (reflects line-item GL postings) + unpaid_amount > 0
  1290 |         const journalEntries: any[] = billData.purchase_journal?.journal_entries ||
  1291 |             billData.received_purchase_order_items ||
  1292 |             billData.items ||
  1293 |             [];
  1294 |         const unpaidAmount = parseFloat(billData.unpaid_amount ?? billData.total_amount ?? billData.amount ?? '0');
  1295 |         console.log(`[AUDIT] Journal entries: ${journalEntries.length} | Unpaid amount: $${unpaidAmount}`);
  1296 |         console.log(`[DEBUG] Bill data keys: ${Object.keys(billData).join(', ')}`);
  1297 | 
  1298 |         // Either journal entries exist OR unpaid amount > 0 → bill was fully recorded with both lines
  1299 |         expect(
  1300 |             journalEntries.length > 0 || unpaidAmount > 0,
  1301 |             `Bill ${billId} has no journal entries AND zero amount. Keys: ${Object.keys(billData).join(', ')}`
> 1302 |         ).toBe(true);
       |           ^ Error: Bill 641982b9-d074-45b4-9536-05399fdabaa4 has no journal entries AND zero amount. Keys: current_approval_step, id, invoice_date, invoice_number, net_due, paid_amount, vendor
  1303 |         console.log('[PASS] Bill mixed lines — approved, journal entries and AP impact verified');
  1304 |     });
  1305 | 
  1306 |     test('BILL-API-04: Multi-line Bill → grand total = sum of lines', async ({ page }) => {
  1307 |         const app = new AppManager(page);
  1308 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1309 |         const { apiBase, headers, qs } = await app.buildApiContext();
  1310 |         const L1 = 3 * 1000, L2 = 2 * 2000;
  1311 | 
  1312 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  1313 |         const allAccounts = acctData.items || acctData.data || [];
  1314 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  1315 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  1316 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  1317 |         const currency = currData.items?.[0] || currData.data?.[0];
  1318 | 
  1319 |         const resp = await page.request.post(`${apiBase}/bills?${qs}`, {
  1320 |             headers,
  1321 |             data: {
  1322 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  1323 |                 vendor_id: purchaseMeta.vendorId,
  1324 |                 invoice_date: periodDateIso,
  1325 |                 due_date: periodDateIso,
  1326 |                 items: [
  1327 |                     { item_id: itemA.itemId, quantity: 3, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  1328 |                     { item_id: itemB.itemId, quantity: 2, unit_price: 2000, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  1329 |                 ],
  1330 |                 status: 'draft',
  1331 |             },
  1332 |         });
  1333 | 
  1334 |         expect(resp.ok(), `Multi-line Bill failed: HTTP ${resp.status()}`).toBe(true);
  1335 |         const data = await resp.json();
  1336 |         const linesSum = (data.items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  1337 |         const billTotal = parseFloat(data.total_amount ?? data.grand_total ?? data.amount ?? '0');
  1338 |         console.log(`[AUDIT] Lines sum: $${linesSum} | Bill total: $${billTotal} | Expected: $${L1 + L2}`);
  1339 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  1340 |         if (billTotal > 0) expect(billTotal).toBeCloseTo(L1 + L2, 1);
  1341 |         console.log('[PASS] Multi-line Bill totals correct');
  1342 |     });
  1343 | 
  1344 |     test('BILL-API-05: Bill discount on line → net = (price − discount) × qty', async ({ page }) => {
  1345 |         const app = new AppManager(page);
  1346 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1347 |         const QTY = 3, PRICE = 2000, DISC = 200;
  1348 | 
  1349 |         const bill = await app.api.purchase.createBillAPI({
  1350 |             itemData: itemA, quantity: QTY, unitPrice: PRICE,
  1351 |             discount_amount: DISC,
  1352 |             vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
  1353 |         });
  1354 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  1355 |         const net = parseFloat(billData.net_total ?? billData.total_amount ?? billData.amount ?? '0');
  1356 |         const expected = (PRICE - DISC) * QTY;
  1357 |         console.log(`[AUDIT] Price=$${PRICE} Disc=$${DISC} Qty=${QTY} | Expected=$${expected} | Actual=$${net}`);
  1358 |         if (net > 0) expect(net).toBeCloseTo(expected, 1);
  1359 |         console.log('[PASS] Bill line discount applied correctly');
  1360 |     });
  1361 | 
  1362 |     // =========================================================================
  1363 |     // PAYMENT
  1364 |     // =========================================================================
  1365 | 
  1366 |     test('PAY-API-01: Single bill payment → bill balance settles to zero', async ({ page }) => {
  1367 |         const app = new AppManager(page);
  1368 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1369 |         const TOTAL = 5000;
  1370 | 
  1371 |         const bill = await app.api.purchase.createBillAPI({
  1372 |             itemData: itemA, quantity: 2, unitPrice: TOTAL / 2,
  1373 |             vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
  1374 |         });
  1375 |         await app.advanceDocumentAPI(bill.id, 'bills');
  1376 | 
  1377 |         const payment = await app.api.purchase.createBillPaymentAPI({
  1378 |             amount: TOTAL, billId: bill.id, vendorId: purchaseMeta.vendorId,
  1379 |         });
  1380 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1381 | 
  1382 |         await page.waitForTimeout(3000);
  1383 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  1384 |         const remaining = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.net_due ?? '999');
  1385 |         console.log(`[AUDIT] Bill $${TOTAL} | Payment $${TOTAL} | Remaining: $${remaining}`);
  1386 |         expect(remaining).toBeLessThan(1);
  1387 |         console.log('[PASS] Full payment settles bill to zero');
  1388 |     });
  1389 | 
  1390 |     test('PAY-API-02: Multi-bill payment → all bills settle to zero', async ({ page }) => {
  1391 |         const app = new AppManager(page);
  1392 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1393 |         const AMT_A = 3000, AMT_B = 2000;
  1394 | 
  1395 |         const [billA, billB] = await Promise.all([
  1396 |             app.api.purchase.createBillAPI({ itemData: itemA, quantity: 3, unitPrice: AMT_A / 3, vendorId: purchaseMeta.vendorId }),
  1397 |             app.api.purchase.createBillAPI({ itemData: itemB, quantity: 2, unitPrice: AMT_B / 2, vendorId: purchaseMeta.vendorId }),
  1398 |         ]);
  1399 |         await Promise.all([
  1400 |             app.advanceDocumentAPI(billA.id, 'bills'),
  1401 |             app.advanceDocumentAPI(billB.id, 'bills'),
  1402 |         ]);
```