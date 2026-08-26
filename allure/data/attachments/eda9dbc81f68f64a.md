# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> PAY-API-02: Multi-bill payment → all bills settle to zero
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:1390:9

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 1
Received:   999
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - img [ref=e8]
      - generic [ref=e11]:
        - heading "Welcome to, befa" [level=3] [ref=e12]
        - paragraph [ref=e13]: Empower Your Finances, Simplify Your Success
        - paragraph [ref=e14]: From meticulous bookkeeping to seamless inventory control, we've got your back.
    - generic [ref=e16]:
      - heading "Login To Your Account" [level=2] [ref=e17]
      - generic [ref=e18]:
        - text: Not a member?
        - link "Register" [ref=e19] [cursor=pointer]:
          - /url: /users/register
      - generic [ref=e21]:
        - group [ref=e22]:
          - generic [ref=e23]: Email *
          - textbox "Email *" [ref=e25]:
            - /placeholder: Enter your email
        - group [ref=e26]:
          - generic [ref=e27]: Password *
          - generic [ref=e28]:
            - textbox "Password *" [ref=e29]:
              - /placeholder: Enter your password
            - button "Show password" [ref=e31] [cursor=pointer]:
              - img [ref=e32]
        - link "Forget Password?" [ref=e37] [cursor=pointer]:
          - /url: forget-password
        - button "Login" [ref=e39] [cursor=pointer]
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
  1403 | 
  1404 |         const payment = await app.api.purchase.createMultiBillPaymentAPI({
  1405 |             amount: AMT_A + AMT_B,
  1406 |             vendorId: purchaseMeta.vendorId,
  1407 |             billPayments: [{ amount: AMT_A, bill_id: billA.id }, { amount: AMT_B, bill_id: billB.id }],
  1408 |         });
  1409 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1410 | 
  1411 |         await page.waitForTimeout(3000);
  1412 |         const [dataA, dataB] = await Promise.all([
  1413 |             app.api.purchase.getBillAPI(billA.id),
  1414 |             app.api.purchase.getBillAPI(billB.id),
  1415 |         ]);
  1416 |         const remA = parseFloat(dataA.unpaid_amount ?? dataA.balance ?? '999');
  1417 |         const remB = parseFloat(dataB.unpaid_amount ?? dataB.balance ?? '999');
  1418 |         console.log(`[AUDIT] Bill A remaining: $${remA} | Bill B remaining: $${remB}`);
> 1419 |         expect(remA).toBeLessThan(1);
       |                      ^ Error: expect(received).toBeLessThan(expected)
  1420 |         expect(remB).toBeLessThan(1);
  1421 |         console.log('[PASS] Multi-bill payment settles all bills to zero');
  1422 |     });
  1423 | 
  1424 |     test('PAY-API-03: Partial payment → bill balance reduces by exact amount', async ({ page }) => {
  1425 |         const app = new AppManager(page);
  1426 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  1427 |         const TOTAL = 6000, PARTIAL = 2000;
  1428 | 
  1429 |         const bill = await app.api.purchase.createBillAPI({
  1430 |             itemData: itemA, quantity: 2, unitPrice: TOTAL / 2,
  1431 |             vendorId: purchaseMeta.vendorId, apAccountId: purchaseMeta.apAccountId,
  1432 |         });
  1433 |         await app.advanceDocumentAPI(bill.id, 'bills');
  1434 | 
  1435 |         const payment = await app.api.purchase.createBillPaymentAPI({
  1436 |             amount: PARTIAL, billId: bill.id, vendorId: purchaseMeta.vendorId,
  1437 |         });
  1438 |         await app.advanceDocumentAPI(payment.id, 'payments');
  1439 | 
  1440 |         await page.waitForTimeout(3000);
  1441 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  1442 |         const remaining = parseFloat(billData.unpaid_amount ?? billData.balance ?? billData.net_due ?? '999');
  1443 |         console.log(`[AUDIT] Bill $${TOTAL} | Paid $${PARTIAL} | Remaining $${remaining} | Expected $${TOTAL - PARTIAL}`);
  1444 |         expect(remaining).toBeCloseTo(TOTAL - PARTIAL, 1);
  1445 |         console.log('[PASS] Partial payment reduces bill balance correctly');
  1446 |     });
  1447 | });
  1448 | 
```