# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @regression >> PO-API-04: Multi-line PO → grand total = sum of lines
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1214:9

# Error details

```
Error: Multi-line PO failed: HTTP 422

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- img "Logo" [ref=e2]
```

# Test source

```ts
  1143 |         await app.pickDate('Purchase Order Date');
  1144 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1145 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable', false, 'Accounts Payable');
  1146 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  1147 | 
  1148 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  1149 |         await page.locator('button:has-text("Line Item")').first().click();
  1150 |         const modal = page.getByRole('dialog').last();
  1151 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  1152 | 
  1153 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  1154 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  1155 |             console.log('[SKIP] Miscellaneous button not present in PO modal');
  1156 |             await page.keyboard.press('Escape');
  1157 |             return;
  1158 |         }
  1159 | 
  1160 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });
  1161 | 
  1162 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1163 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  1164 |         console.log('[PASS] PO with miscellaneous line created');
  1165 |     });
  1166 | 
  1167 |     test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
  1168 |         const app = new AppManager(page);
  1169 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1170 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  1171 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  1172 |         const poItemsTab = page.getByRole('tab', { name: /Purchase Order Items/i });
  1173 |         await poItemsTab.waitFor({ state: 'visible', timeout: 60000 });
  1174 | 
  1175 |         await app.pickDate('Purchase Order Date');
  1176 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1177 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable', false, 'Accounts Payable');
  1178 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  1179 | 
  1180 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  1181 | 
  1182 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1183 | 
  1184 |         // Line 1: inventory item
  1185 |         await page.locator('button:has-text("Line Item")').first().click();
  1186 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: capturedItem?.price || '1500', itemName: capturedItem?.name });
  1187 | 
  1188 |         // Line 2: miscellaneous
  1189 |         await page.locator('button:has-text("Line Item")').first().click();
  1190 |         const modal2 = page.getByRole('dialog').last();
  1191 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  1192 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  1193 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  1194 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
  1195 |         } else {
  1196 |             await page.keyboard.press('Escape');
  1197 |             await page.locator('button:has-text("Line Item")').first().click();
  1198 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: capturedItem?.price || '500', itemName: capturedItem?.name });
  1199 |         }
  1200 | 
  1201 |         await expect.poll(async () => page.locator('table tbody tr').count(), { timeout: 10000 }).toBeGreaterThanOrEqual(2);
  1202 |         const rowCount = await page.locator('table tbody tr').count();
  1203 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  1204 |         console.log(`[AUDIT] ${rowCount} lines in PO form table`);
  1205 | 
  1206 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  1207 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  1208 | 
  1209 |         const poId = await app.extractIdFromUrl();
  1210 |         expect(poId).toBeTruthy();
  1211 |         console.log(`[PASS] PO ${poId} mixed lines created and navigated to detail page`);
  1212 |     });
  1213 | 
  1214 |     test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
  1215 |         const app = new AppManager(page);
  1216 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1217 |         const { apiBase, headers, qs } = await app.buildApiContext();
  1218 |         const L1 = 5 * 1000, L2 = 3 * 1500;
  1219 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  1220 |         const dateIso = (await DateHelper.resolve(page)).iso;
  1221 | 
  1222 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  1223 |         const allAccounts = acctData.items || acctData.data || [];
  1224 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  1225 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  1226 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  1227 |         const currency = currData.items?.[0] || currData.data?.[0];
  1228 | 
  1229 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  1230 |             headers,
  1231 |             data: {
  1232 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  1233 |                 vendor_id: purchaseMeta.vendorId,
  1234 |                 po_date: dateIso,
  1235 |                 purchase_type_id: 4,
  1236 |                 po_items: [
  1237 |                     { item_id: itemA.itemId, quantity: 5, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  1238 |                     { item_id: itemB.itemId, quantity: 3, unit_price: 1500, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  1239 |                 ],
  1240 |             },
  1241 |         });
  1242 | 
> 1243 |         expect(resp.ok(), `Multi-line PO failed: HTTP ${resp.status()}`).toBe(true);
       |                                                                          ^ Error: Multi-line PO failed: HTTP 422
  1244 |         const data = await resp.json();
  1245 |         const linesSum = (data.po_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? String(parseFloat(l.quantity) * parseFloat(l.unit_price))), 0);
  1246 |         console.log(`[AUDIT] PO lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  1247 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  1248 |         console.log('[PASS] Multi-line PO totals correct');
  1249 |     });
  1250 | 
  1251 |     test('PO-API-05: Miscellaneous line on PO (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  1252 |         const app = new AppManager(page);
  1253 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1254 |         const { apiBase, headers, qs } = await app.buildApiContext();
  1255 | 
  1256 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  1257 |         const allAccounts = acctData.items || acctData.data || [];
  1258 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  1259 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  1260 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  1261 |         const currency = currData.items?.[0] || currData.data?.[0];
  1262 | 
  1263 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  1264 |             headers,
  1265 |             data: {
  1266 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  1267 |                 vendor_id: purchaseMeta.vendorId,
  1268 |                 po_date: periodDateIso,
  1269 |                 purchase_type_id: 4,
  1270 |                 po_items: [{ description: 'Freight & customs', quantity: 1, unit_price: 3000, amount: 3000, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  1271 |             },
  1272 |         });
  1273 | 
  1274 |         if (resp.ok()) {
  1275 |             const amt = parseFloat(((await resp.json()).po_items || [])[0]?.amount ?? '0');
  1276 |             console.log(`[INFO] PO miscellaneous line accepted: $${amt}`);
  1277 |         } else {
  1278 |             console.log(`[INFO] PO enforces item_id: HTTP ${resp.status()}`);
  1279 |             expect([400, 422]).toContain(resp.status());
  1280 |         }
  1281 |     });
  1282 | 
  1283 |     // =========================================================================
  1284 |     // BILL
  1285 |     // =========================================================================
  1286 | 
  1287 |     test('BILL-UI-01: Add inventory Line Item via modal → Bill created and approved', async ({ page }) => {
  1288 |         const app = new AppManager(page);
  1289 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1290 |         await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  1291 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  1292 | 
  1293 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 30000 });
  1294 | 
  1295 |         await app.pickDate('Invoice Date');
  1296 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1297 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable', false, 'Accounts Payable');
  1298 |         await fillCurrencyField(page, app);
  1299 | 
  1300 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  1301 | 
  1302 |         await page.locator('button:has-text("Line Item")').first().click();
  1303 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: capturedItem?.price || '2500', itemName: capturedItem?.name });
  1304 |         console.log('[OK] Inventory line item added to Bill');
  1305 | 
  1306 |         const submitBtn = page.locator('button:has-text("Add Now"), button:has-text("Save"), button:has-text("Create")').first();
  1307 |         await expect(submitBtn).toBeEnabled({ timeout: 10000 });
  1308 |         await submitBtn.click();
  1309 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 }).catch(() => {});
  1310 | 
  1311 |         const billId = await app.extractIdFromUrl();
  1312 |         if (billId) {
  1313 |             await app.advanceDocumentAPI(billId, 'bills');
  1314 |         }
  1315 |         console.log('[PASS] Bill with inventory line created and approved');
  1316 |     });
  1317 | 
  1318 |     test('BILL-UI-02: Add Miscellaneous line via modal → Bill total reflects it', async ({ page }) => {
  1319 |         const app = new AppManager(page);
  1320 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1321 |         await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  1322 |         await page.goto('/payables/bills/new', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  1323 | 
  1324 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 30000 });
  1325 | 
  1326 |         await app.pickDate('Invoice Date');
  1327 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  1328 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable', false, 'Accounts Payable');
  1329 |         await fillCurrencyField(page, app);
  1330 | 
  1331 |         await page.locator('button:has-text("Line Item")').first().click();
  1332 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '4000', description: 'Import duty' });
  1333 | 
  1334 |         // ERP may require an inventory line before allowing submit on a standalone bill.
  1335 |         // If Add Now is disabled, verify the miscellaneous line rendered in the table and pass.
  1336 |         const submitBtn = page.locator('button:has-text("Add Now"), button:has-text("Save"), button:has-text("Create")').first();
  1337 |         const isEnabled = await submitBtn.isEnabled({ timeout: 5000 }).catch(() => false);
  1338 |         if (isEnabled) {
  1339 |             await submitBtn.click();
  1340 |             await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 }).catch(() => {});
  1341 |             console.log('[PASS] Bill with miscellaneous line created');
  1342 |         } else {
  1343 |             // Switch to Miscelaneuos tab to confirm line is rendered
```