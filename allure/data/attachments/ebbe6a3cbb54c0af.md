# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @regression >> BILL-UI-01: Add inventory Line Item via modal → Bill created and approved
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1338:9

# Error details

```
Error: [ERROR] Failed selection for Location
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - list [ref=e11]:
          - listitem [ref=e12]:
            - button "BEFA ABC Trading IT Administrator / User Manager" [ref=e13] [cursor=pointer]:
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
                - button "Account Payables" [expanded] [ref=e59] [cursor=pointer]
                - list [ref=e67]:
                  - listitem [ref=e68]:
                    - link "Overview" [ref=e69] [cursor=pointer]:
                      - /url: /payables/overview/
                  - listitem [ref=e76]:
                    - link "Bills" [ref=e77] [cursor=pointer]:
                      - /url: /payables/bills/?page=1&pageSize=15
                  - listitem [ref=e82]:
                    - link "Payments" [ref=e83] [cursor=pointer]:
                      - /url: /payables/payments/?page=1&pageSize=15
              - listitem [ref=e87]:
                - button "Account Receivables" [ref=e88] [cursor=pointer]
              - listitem [ref=e95]:
                - button "Asset" [ref=e96] [cursor=pointer]
        - list [ref=e105]:
          - listitem [ref=e106]:
            - button "Account Reconciliation" [ref=e107] [cursor=pointer]
        - list [ref=e115]:
          - listitem [ref=e116]:
            - button "CRM" [ref=e117] [cursor=pointer]
        - list [ref=e127]:
          - listitem [ref=e128]:
            - button "HRM" [ref=e129] [cursor=pointer]
        - list [ref=e139]:
          - listitem [ref=e140]:
            - button "Project" [ref=e141] [cursor=pointer]
        - list [ref=e149]:
          - listitem [ref=e150]:
            - button "SCM" [ref=e151] [cursor=pointer]
        - list [ref=e160]:
          - listitem [ref=e161]:
            - button "Lease" [ref=e162] [cursor=pointer]
        - list [ref=e170]:
          - listitem [ref=e171]:
            - button "Services" [ref=e172] [cursor=pointer]
        - list [ref=e179]:
          - listitem [ref=e180]:
            - button "Reports" [ref=e181] [cursor=pointer]
        - list [ref=e189]:
          - listitem [ref=e190]:
            - button "Administration" [ref=e191] [cursor=pointer]
      - list [ref=e199]:
        - listitem [ref=e200]:
          - button "SA System Admin IT Administrator / User Manager" [ref=e201] [cursor=pointer]:
            - generic [ref=e202]: SA
            - generic [ref=e204]:
              - generic [ref=e205]: System Admin
              - generic [ref=e206]: IT Administrator / User Manager
    - main [ref=e210]:
      - generic [ref=e211]:
        - button "Toggle Sidebar" [ref=e213] [cursor=pointer]
        - generic [ref=e217]:
          - button "New" [ref=e218] [cursor=pointer]
          - button "Notifications" [ref=e225] [cursor=pointer]:
            - generic [ref=e229]: "5"
          - generic "Switch Calendar Era" [ref=e230]:
            - button "EC" [ref=e234] [cursor=pointer]
            - generic [ref=e235]: "|"
            - button "GC" [ref=e236] [cursor=pointer]
          - button "Change Language" [ref=e237] [cursor=pointer]:
            - generic [ref=e241]: EN
          - button "S System Admin IT Administrator / User Manager" [ref=e245] [cursor=pointer]:
            - generic [ref=e246]: S
            - generic [ref=e248]:
              - generic [ref=e249]: System Admin
              - generic [ref=e250]: IT Administrator / User Manager
      - main [ref=e253]:
        - generic [ref=e255]:
          - generic [ref=e256]:
            - navigation "breadcrumb" [ref=e257]:
              - list [ref=e258]:
                - navigation "breadcrumb" [ref=e259]:
                  - list [ref=e260]:
                    - listitem [ref=e261]:
                      - link "Home" [ref=e262] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e263]:
                      - link "Payables" [ref=e264] [cursor=pointer]:
                        - /url: /payables/overview/
                      - text: /
                    - listitem [ref=e265]:
                      - link "Bills" [ref=e266] [cursor=pointer]:
                        - /url: /payables/bills/?page=1&pageSize=15
                      - text: /
                    - listitem [ref=e267]:
                      - link "New" [ref=e268] [cursor=pointer]:
                        - /url: /payables/new
            - button "2019" [ref=e270] [cursor=pointer]
          - generic [ref=e275]:
            - button "Toggle Visibility" [ref=e278] [cursor=pointer]
            - generic [ref=e282]:
              - generic [ref=e283]:
                - button "Close" [ref=e284] [cursor=pointer]
                - heading "New Bills" [level=5] [ref=e287]
              - generic [ref=e288]:
                - generic [ref=e290]:
                  - generic [ref=e291]:
                    - group [ref=e292]:
                      - generic [ref=e293]: Vendor *
                      - button "Vendor selector" [ref=e294]: MIDROC S.C
                    - group [ref=e295]:
                      - generic [ref=e296]: Purchase Order
                      - button "Purchase Order selector" [ref=e297]
                    - generic [ref=e298]:
                      - group [ref=e299]:
                        - generic [ref=e300]: Invoice number
                        - textbox "Invoice number" [disabled] [ref=e302]
                      - paragraph [ref=e303]: Invoice number is auto-generated
                    - generic [ref=e304]:
                      - generic [ref=e305]: Due Date
                      - button "ጥቅምት 16, 2019" [ref=e307] [cursor=pointer]
                    - group [ref=e311]:
                      - generic [ref=e312]: Budget
                      - button "Budget selector" [ref=e313]: Select a budget
                  - generic [ref=e314]:
                    - generic [ref=e315]:
                      - generic [ref=e316]: Invoice Date
                      - button "መስከረም 26, 2019" [ref=e318] [cursor=pointer]
                    - group [ref=e322]:
                      - generic [ref=e323]: Accounts Payable *
                      - button "Accounts Payable selector" [ref=e324]: Accounts Payable
                    - group [ref=e325]:
                      - generic [ref=e326]: Currency *
                      - button "Currency selector" [ref=e327]: Birr
                - generic [ref=e328]:
                  - generic [ref=e329]:
                    - tablist [ref=e330]:
                      - tab "Purchases" [selected] [ref=e331] [cursor=pointer]
                      - tab "Received Purchase Order" [ref=e332] [cursor=pointer]
                      - tab "Journal" [ref=e333] [cursor=pointer]
                      - tab "Miscelaneuos" [ref=e334] [cursor=pointer]
                      - tab "Upload Related Documents" [ref=e335] [cursor=pointer]
                    - button [expanded] [ref=e337] [cursor=pointer]
                  - tabpanel "Purchases" [ref=e342]:
                    - table [ref=e346]:
                      - rowgroup [ref=e347]:
                        - row [ref=e348]:
                          - columnheader [ref=e349]
                          - columnheader "Item" [ref=e351]
                          - columnheader "Quantity" [ref=e353]
                          - columnheader "Unit Price" [ref=e355]
                          - columnheader "Purchase Type" [ref=e357]
                          - columnheader "Description" [ref=e359]
                          - columnheader "G/L Account *" [ref=e361]
                          - columnheader "Project" [ref=e363]
                          - columnheader "Before Tax *" [ref=e365]
                          - columnheader "Tax" [ref=e367]
                          - columnheader "Total" [ref=e369]
                          - columnheader [ref=e371]
                      - rowgroup [ref=e373]:
                        - row [ref=e374]:
                          - cell [ref=e375]:
                            - paragraph [ref=e377]: No record found
                      - rowgroup [ref=e378]:
                        - row [ref=e379]:
                          - columnheader [ref=e380]
                          - columnheader [ref=e381]
                          - columnheader [ref=e382]
                          - columnheader [ref=e383]
                          - columnheader [ref=e384]
                          - columnheader [ref=e385]
                          - columnheader [ref=e386]
                          - columnheader [ref=e387]
                          - columnheader "0.00" [ref=e388]
                          - columnheader "0.00" [ref=e389]
                          - columnheader "0.00" [ref=e390]
                          - columnheader [ref=e391]
              - group [ref=e393]:
                - button "Add Now" [ref=e394] [cursor=pointer]
                - button [ref=e395] [cursor=pointer]
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
  - dialog [ref=e397]:
    - generic [ref=e400]:
      - generic [ref=e401]:
        - generic [ref=e402]:
          - group [ref=e404]:
            - generic [ref=e405]: Item *
            - button "Item selector" [ref=e406]: FIFO-Item-1793000671229
          - group [ref=e408]:
            - generic [ref=e409]: Warehouse *
            - button "Warehouse selector" [ref=e410]: Default Warehouse
          - group [ref=e412]:
            - generic [ref=e413]: Location *
            - button "Location selector" [ref=e414]: Select location *
          - group [ref=e416]:
            - generic [ref=e417]: Quantity *
            - spinbutton "Quantity *" [ref=e419]: "1"
        - generic [ref=e420]:
          - group [ref=e422]:
            - generic [ref=e423]: G/L Account *
            - button "G/L Account selector" [ref=e424]
          - group [ref=e426]:
            - generic [ref=e427]: Project
            - button "Project selector" [ref=e428]
          - group [ref=e430]:
            - generic [ref=e431]: Unit Price *
            - spinbutton "Unit Price *" [ref=e433]: "100"
          - group [ref=e435]:
            - generic [ref=e436]: Before Tax
            - spinbutton "Before Tax" [disabled] [ref=e438]: "100"
        - generic [ref=e439]:
          - generic [ref=e440]:
            - group [ref=e442]:
              - generic [ref=e443]: Description
              - textbox "Description" [ref=e444]:
                - /placeholder: Put your description here
            - generic [ref=e445]: "Total: 100.00"
          - group [ref=e447]:
            - generic [ref=e448]: Tax
            - button "Tax selector" [ref=e449]
      - generic [ref=e450]:
        - generic [ref=e451]: "Total: 100.00"
        - generic [ref=e452]:
          - button "Back" [ref=e453] [cursor=pointer]
          - button "Cancel" [ref=e454] [cursor=pointer]
          - button "Add" [ref=e455] [cursor=pointer]
```

# Test source

```ts
  1201 | 
  1202 |     if (await popover.isVisible().catch(() => false)) {
  1203 |       await this.page.keyboard.press('Escape').catch(() => {});
  1204 |     }
  1205 | 
  1206 |     await this.page.waitForTimeout(800);
  1207 |     await this.stopTacticalTimer(`Pick Date: ${label}`, 'UI');
  1208 |   }
  1209 | 
  1210 |   async selectRandomOption(selector: Locator, labelName: string, isOptional: boolean = false, preferredText?: string): Promise<number> {
  1211 |     const optionSelector = '[role="checkbox"], .chakra-checkbox, [role="option"], [role="menuitem"], .chakra-menu__menuitem, tbody tr, tr:not(:first-child), tr[role="row"], button:not(:has-text("Clear")), [role="button"]';
  1212 | 
  1213 |     await this.startTacticalTimer(); // Start Tactical UI Timer
  1214 | 
  1215 |     for (let i = 0; i < 3; i++) {
  1216 |       try {
  1217 |         await selector.scrollIntoViewIfNeeded().catch(() => {});
  1218 |         await selector.click({ timeout: 5000, force: true }).catch(() => selector.evaluate((el: HTMLElement) => el.click()));
  1219 |         await this.page.waitForTimeout(1000);
  1220 |         // Scope to the topmost visible overlay/dropdown to avoid counting items from other open menus
  1221 |         const overlay = this.page.locator(
  1222 |           '.chakra-menu__menu-list, [role="listbox"], .chakra-popover__content, [role="menu"]'
  1223 |         ).filter({ visible: true }).last();
  1224 |         const overlayVisible = await overlay.isVisible({ timeout: 3000 }).catch(() => false);
  1225 | 
  1226 |         if (overlayVisible) {
  1227 |           const searchInput = overlay.locator('input').first();
  1228 |           if (await searchInput.isVisible({ timeout: 800 }).catch(() => false)) {
  1229 |             await searchInput.focus().catch(() => {});
  1230 |             await searchInput.fill(preferredText || '').catch(() => {});
  1231 |             await this.page.waitForTimeout(600);
  1232 |           }
  1233 |         }
  1234 | 
  1235 |         const actionFilter = /^\s*(\+|\b(Add|Create|New|Clear|No\s+more)\b)/i;
  1236 |         const tableRows = (overlayVisible ? overlay : this.page)
  1237 |           .locator('tbody tr, tr[role="row"]')
  1238 |           .filter({ visible: true })
  1239 |           .filter({ hasNotText: actionFilter });
  1240 |         const rowCount = await tableRows.count().catch(() => 0);
  1241 | 
  1242 |         const options = (rowCount > 0)
  1243 |           ? tableRows
  1244 |           : (overlayVisible ? overlay : this.page)
  1245 |               .locator(optionSelector)
  1246 |               .filter({ visible: true })
  1247 |               .filter({ hasNotText: actionFilter });
  1248 | 
  1249 |         // Wait up to 15s for at least one option to appear (handles heavy backend queries)
  1250 |         await options.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
  1251 |         const count = await options.count();
  1252 |         console.log(`[SELECT-OPTION] ${labelName} (attempt ${i + 1}): overlayVisible=${overlayVisible}, count=${count}`);
  1253 |         if (count > 0) {
  1254 |           let target = options.first();
  1255 |           if (preferredText) {
  1256 |             const preferred = options.filter({ hasText: new RegExp(preferredText, 'i') }).first();
  1257 |             if (await preferred.isVisible({ timeout: 1000 }).catch(() => false)) {
  1258 |               target = preferred;
  1259 |             } else {
  1260 |               const randomIndex = Math.floor(Math.random() * count);
  1261 |               target = options.nth(randomIndex);
  1262 |             }
  1263 |           } else {
  1264 |             const randomIndex = Math.floor(Math.random() * count);
  1265 |             target = options.nth(randomIndex);
  1266 |           }
  1267 |           await target.scrollIntoViewIfNeeded().catch(() => {});
  1268 |           const childCell = target.locator('td, [role="button"], button, p, span').first();
  1269 |           if (await childCell.isVisible({ timeout: 500 }).catch(() => false)) {
  1270 |             await childCell.click({ force: true }).catch(() => childCell.evaluate((node: HTMLElement) => node.click()));
  1271 |           } else {
  1272 |             await target.click({ force: true }).catch(() => target.evaluate((node: HTMLElement) => node.click()));
  1273 |           }
  1274 |           await this.page.waitForTimeout(500);
  1275 |           if (await overlay.isVisible().catch(() => false)) {
  1276 |             await this.page.keyboard.press('Escape').catch(() => { });
  1277 |           }
  1278 |           // If an unexpected drawer/modal opened, close it
  1279 |           const openDrawerCloseBtn = this.page.locator('.chakra-modal__close-btn, button[aria-label="Close"]').filter({ visible: true }).first();
  1280 |           if (await openDrawerCloseBtn.isVisible({ timeout: 500 }).catch(() => false)) {
  1281 |             await openDrawerCloseBtn.click().catch(() => this.page.keyboard.press('Escape'));
  1282 |           }
  1283 |           await this.stopTacticalTimer(`Random Selection: ${labelName}`, 'UI');
  1284 |           return count;
  1285 |         } else {
  1286 |           if (await overlay.isVisible().catch(() => false)) {
  1287 |             await this.page.keyboard.press('Escape').catch(() => { });
  1288 |           }
  1289 |           if (isOptional) return 0;
  1290 |         }
  1291 |       } catch (e: any) {
  1292 |         console.log(`[SELECT-OPTION] ${labelName} attempt ${i + 1} caught error: ${e.message}`);
  1293 |         await this.page.keyboard.press('Escape').catch(() => { });
  1294 |         if (
  1295 |           e.message?.includes('Target page') ||
  1296 |           e.message?.includes('page has been closed') ||
  1297 |           e.message?.includes('context was destroyed')
  1298 |         ) throw e;
  1299 |       }
  1300 |     }
> 1301 |     if (!isOptional) throw new Error(`[ERROR] Failed selection for ${labelName}`);
       |                            ^ Error: [ERROR] Failed selection for Location
  1302 |     return 0;
  1303 |   }
  1304 | 
  1305 |   getTransactionDates(): { soDate: string; invoiceDate: string; dueDate: string } {
  1306 |     // Use DateHelper cached value if available, otherwise fall back to today.
  1307 |     // For a fully async version call getTransactionDatesAsync().
  1308 |     const { DateHelper } = require('./utils/DateHelper');
  1309 |     const cached = (DateHelper as any)['_cached'] as { gcDate: Date } | null;
  1310 |     const today = cached?.gcDate ?? new Date();
  1311 |     const due = new Date(today);
  1312 |     due.setUTCDate(today.getUTCDate() + 30);
  1313 |     const fmt = (d: Date) => {
  1314 |       const dd = String(d.getUTCDate()).padStart(2, '0');
  1315 |       const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  1316 |       return `${dd}/${mm}/${d.getUTCFullYear()}`;
  1317 |     };
  1318 |     return { soDate: fmt(today), invoiceDate: fmt(today), dueDate: fmt(due) };
  1319 |   }
  1320 | 
  1321 |   async getTransactionDatesAsync(): Promise<{ soDate: string; invoiceDate: string; dueDate: string; isoDate: string }> {
  1322 |     const { DateHelper } = require('./utils/DateHelper');
  1323 |     const resolved = await DateHelper.resolve(this.page);
  1324 |     const due = new Date(resolved.gcDate);
  1325 |     due.setUTCDate(resolved.gcDate.getUTCDate() + 30);
  1326 |     const fmt = (d: Date) => {
  1327 |       const dd = String(d.getUTCDate()).padStart(2, '0');
  1328 |       const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  1329 |       return `${dd}/${mm}/${d.getUTCFullYear()}`;
  1330 |     };
  1331 |     return { soDate: fmt(resolved.gcDate), invoiceDate: fmt(resolved.gcDate), dueDate: fmt(due), isoDate: resolved.iso };
  1332 |   }
  1333 | 
  1334 |   getInvoiceDates(): { invoiceDate: string; dueDate: string } {
  1335 |     const { DateHelper } = require('./utils/DateHelper');
  1336 |     const cached = (DateHelper as any)['_cached'] as { gcDate: Date } | null;
  1337 |     const today = cached?.gcDate ?? new Date();
  1338 |     const due = new Date(today);
  1339 |     due.setUTCDate(today.getUTCDate() + 30);
  1340 |     const fmt = (d: Date) => {
  1341 |       const dd = String(d.getUTCDate()).padStart(2, '0');
  1342 |       const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  1343 |       return `${dd}/${mm}/${d.getUTCFullYear()}`;
  1344 |     };
  1345 |     return { invoiceDate: fmt(today), dueDate: fmt(due) };
  1346 |   }
  1347 | 
  1348 |   async getTableColumnMap(selector: string = 'table thead th'): Promise<Record<string, number>> {
  1349 |     const headers = this.page.locator(selector);
  1350 |     const count = await headers.count();
  1351 |     const map: Record<string, number> = {};
  1352 |     for (let h = 0; h < count; h++) {
  1353 |       const text = (await headers.nth(h).innerText().catch(() => '')).trim().toLowerCase();
  1354 |       if (text) map[text] = h;
  1355 |     }
  1356 |     return map;
  1357 |   }
  1358 | 
  1359 |   async getAccountBalanceAPI(accountId: string, companyOverride?: string): Promise<number> {
  1360 |     const token = await this._getAuthToken();
  1361 |     const company = companyOverride || await this.page.evaluate(() => {
  1362 |       try { return localStorage.getItem('currentCompany'); } catch { return null; }
  1363 |     }).catch(() => null) || process.env.BEFFA_COMPANY || 'BM Tech';
  1364 |     const { DateHelper: _DH } = require('./utils/DateHelper');
  1365 |     const url = `${this.apiBase}/accounts?page=1&pageSize=1000&${_DH.qs()}`;
  1366 | 
  1367 |     const response = await this.page.request.get(url, {
  1368 |       headers: {
  1369 |         'Authorization': `Bearer ${token}`,
  1370 |         'x-company': company,
  1371 |         'x-role': 'IT Administrator / User Manager'
  1372 |       }
  1373 |     });
  1374 | 
  1375 |     if (!response.ok()) {
  1376 |       Logger.warn(`GL Balance Query Failed. Status: ${response.status()}`);
  1377 |       return 0;
  1378 |     }
  1379 | 
  1380 |     const data = await response.json();
  1381 |     const list = data.items || data.data || [];
  1382 |     const targetAccount = list.find((a: any) => a.id === accountId);
  1383 | 
  1384 |     if (!targetAccount) {
  1385 |       Logger.warn(`GL Audit: Account ${Logger.sanitize(accountId)} not found in the COA list.`);
  1386 |       return 0;
  1387 |     }
  1388 | 
  1389 |     const balance = parseFloat(targetAccount.balance || targetAccount.current_balance || '0');
  1390 |     Logger.snapshot(`Account: ${Logger.sanitize(targetAccount.name)} | Balance: ${balance.toFixed(2)}`);
  1391 |     return balance;
  1392 |   }
  1393 | 
  1394 |   async getMultiAccountBalancesAPI(accountIds: string[], companyOverride?: string): Promise<Record<string, number>> {
  1395 |     const token = await this._getAuthToken();
  1396 |     const company = companyOverride || await this.page.evaluate(() => {
  1397 |       try { return localStorage.getItem('currentCompany'); } catch { return null; }
  1398 |     }).catch(() => null) || process.env.BEFFA_COMPANY || 'BM Tech';
  1399 |     const { DateHelper: _DH } = require('./utils/DateHelper');
  1400 |     const url = `${this.apiBase}/accounts?page=1&pageSize=1000&${_DH.qs()}`;
  1401 |     const response = await this.page.request.get(url, {
```