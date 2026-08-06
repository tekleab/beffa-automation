# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> INV-API-04: Multi-line invoice → grand total = sum of lines
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:373:9

# Error details

```
Error: expect(received).toBeCloseTo(expected, precision)

Expected: 2400
Received: 460

Expected precision:    1
Expected difference: < 0.05
Received difference:   1940
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "BM Tech" [ref=e10]: BT
        - generic [ref=e11]:
          - button "BM Tech" [ref=e12] [cursor=pointer]:
            - generic: BM Tech
            - img [ref=e14]
          - generic [ref=e16] [cursor=pointer]:
            - button "Company Detail" [ref=e17]:
              - img [ref=e18]
            - button "Edit Company" [ref=e21]:
              - img [ref=e22]
            - button "Company Detail" [ref=e25]:
              - img [ref=e26]
      - generic [ref=e29]:
        - button "New" [ref=e30] [cursor=pointer]:
          - text: New
          - img [ref=e32]
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: "5"
          - img "Notifications" [ref=e38]
        - button "EC" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - paragraph [ref=e44]: EC
        - button [ref=e45] [cursor=pointer]:
          - img [ref=e46]
        - generic [ref=e49] [cursor=pointer]:
          - img "System" [ref=e51]: S
          - generic [ref=e52]:
            - generic [ref=e53]: System
            - paragraph [ref=e54]: IT Administrator / User Manager
    - generic [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - img "BM Tech" [ref=e62]: BT
          - paragraph [ref=e63]: Welcome, System
        - paragraph [ref=e65]: From meticulous bookkeeping to seamless inventory control, we've got your back.
        - generic [ref=e66]:
          - link "Dashboard" [ref=e67] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e68] [cursor=pointer]:
            - /url: /settings/company/details
        - generic [ref=e69]:
          - link "Add Customer" [ref=e70] [cursor=pointer]:
            - /url: /receivables/customers/new
            - img [ref=e73]
            - text: Add Customer
          - link "Add Invoice" [ref=e74] [cursor=pointer]:
            - /url: /receivables/invoices/new
            - img [ref=e77]
            - text: Add Invoice
          - link "Add Receipt" [ref=e78] [cursor=pointer]:
            - /url: /receivables/receipts/new
            - img [ref=e81]
            - text: Add Receipt
          - link "Add Sales Order" [ref=e82] [cursor=pointer]:
            - /url: /receivables/sale-orders/new
            - img [ref=e85]
            - text: Add Sales Order
        - paragraph [ref=e87]: Quick Access
        - generic [ref=e88]:
          - generic [ref=e89]:
            - link "Sales Sales" [ref=e91] [cursor=pointer]:
              - /url: /receivables/overview/
              - button "Sales Sales" [ref=e92]:
                - generic [ref=e93]:
                  - img "Sales" [ref=e94]
                  - paragraph [ref=e95]: Sales
            - link "Purchase Purchase" [ref=e97] [cursor=pointer]:
              - /url: /payables/overview/
              - button "Purchase Purchase" [ref=e98]:
                - generic [ref=e99]:
                  - img "Purchase" [ref=e100]
                  - paragraph [ref=e101]: Purchase
            - link "Accounting Accounting" [ref=e103] [cursor=pointer]:
              - /url: /accounting/overview
              - button "Accounting Accounting" [ref=e104]:
                - generic [ref=e105]:
                  - img "Accounting" [ref=e106]
                  - paragraph [ref=e107]: Accounting
            - link "Leases Leases" [ref=e109] [cursor=pointer]:
              - /url: /leases/leases/?page=1&pageSize=15
              - button "Leases Leases" [ref=e110]:
                - generic [ref=e111]:
                  - img "Leases" [ref=e112]
                  - paragraph [ref=e113]: Leases
            - link "Assets Assets" [ref=e115] [cursor=pointer]:
              - /url: /assets/overview
              - button "Assets Assets" [ref=e116]:
                - generic [ref=e117]:
                  - img "Assets" [ref=e118]
                  - paragraph [ref=e119]: Assets
            - link "Budgets Budgets" [ref=e121] [cursor=pointer]:
              - /url: /public-sector-budgets/overview
              - button "Budgets Budgets" [ref=e122]:
                - generic [ref=e123]:
                  - img "Budgets" [ref=e124]
                  - paragraph [ref=e125]: Budgets
            - link "Payroll Payroll" [ref=e127] [cursor=pointer]:
              - /url: /payrolls
              - button "Payroll Payroll" [ref=e128]:
                - generic [ref=e129]:
                  - img "Payroll" [ref=e130]
                  - paragraph [ref=e131]: Payroll
            - link "Report Report" [ref=e133] [cursor=pointer]:
              - /url: /reports
              - button "Report Report" [ref=e134]:
                - generic [ref=e135]:
                  - img "Report" [ref=e136]
                  - paragraph [ref=e137]: Report
          - button "View All" [ref=e138] [cursor=pointer]:
            - text: View All
            - img [ref=e140]
      - img "Floating Icon" [ref=e143]
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
  303 |         const app = new AppManager(page);
  304 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  305 |         await page.goto('/receivables/invoices/new', { waitUntil: 'commit' });
  306 | 
  307 |         await app.pickDate('Invoice Date');
  308 |         await app.pickDate('Due Date');
  309 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  310 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  311 | 
  312 |         await page.getByRole('button', { name: 'Line Item' }).click();
  313 |         const modal = page.getByRole('dialog').last();
  314 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  315 | 
  316 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  317 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  318 |             console.log('[SKIP] Miscellaneous button not present in Invoice modal');
  319 |             await page.keyboard.press('Escape');
  320 |             return;
  321 |         }
  322 | 
  323 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '1500', description: 'Consulting fee' });
  324 | 
  325 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  326 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  327 |         console.log('[PASS] Invoice with miscellaneous line created');
  328 |     });
  329 | 
  330 |     test('INV-UI-03: Mixed Item + Miscellaneous lines → both rows in table, totals accumulate', async ({ page }) => {
  331 |         const app = new AppManager(page);
  332 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  333 |         await page.goto('/receivables/invoices/new', { waitUntil: 'commit' });
  334 | 
  335 |         await app.pickDate('Invoice Date');
  336 |         await app.pickDate('Due Date');
  337 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  338 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Receivable selector' }), 'Accounts Receivable');
  339 | 
  340 |         // Item line
  341 |         await page.getByRole('button', { name: 'Line Item' }).click();
  342 |         await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: '400' });
  343 | 
  344 |         // Miscellaneous line
  345 |         await page.getByRole('button', { name: 'Line Item' }).click();
  346 |         const modal2 = page.getByRole('dialog').last();
  347 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  348 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  349 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  350 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '200', description: 'Handling' });
  351 |         } else {
  352 |             await page.keyboard.press('Escape');
  353 |             await page.getByRole('button', { name: 'Line Item' }).click();
  354 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '200' });
  355 |         }
  356 | 
  357 |         const rowCount = await page.locator('table tbody tr').count();
  358 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  359 |         console.log(`[AUDIT] ${rowCount} lines visible in Invoice form`);
  360 | 
  361 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  362 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  363 | 
  364 |         const invId = await app.extractIdFromUrl();
  365 |         const invData = await app.api.sales.getInvoiceAPI(invId);
  366 |         const lines: any[] = invData.items || invData.invoice_items || [];
  367 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  368 |         const total = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  369 |         console.log(`[AUDIT] Invoice lines: ${lines.length} | Total: $${total}`);
  370 |         console.log('[PASS] Invoice mixed lines — all rows present, total accumulated');
  371 |     });
  372 | 
  373 |     test('INV-API-04: Multi-line invoice → grand total = sum of lines', async ({ page }) => {
  374 |         const app = new AppManager(page);
  375 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  376 |         const { apiBase, headers, qs } = await app.buildApiContext();
  377 |         const L1 = 3 * 400, L2 = 2 * 600;
  378 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  379 |         const dateIso = (await DateHelper.resolve(page)).iso;
  380 | 
  381 |         const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
  382 |             headers,
  383 |             data: {
  384 |                 accounts_receivable_id: salesMeta.arAccountId,
  385 |                 customer_id: salesMeta.customerId,
  386 |                 invoice_date: dateIso,
  387 |                 due_date: dateIso,
  388 |                 currency_id: salesMeta.currencyId,
  389 |                 released_sales_order_items: [],
  390 |                 items: [
  391 |                     { item_id: itemA.itemId, quantity: 3, unit_price: 400, amount: L1, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  392 |                     { item_id: itemB.itemId, quantity: 2, unit_price: 600, amount: L2, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  393 |                 ],
  394 |             },
  395 |         });
  396 | 
  397 |         expect(resp.ok(), `Multi-line Invoice failed: HTTP ${resp.status()}`).toBe(true);
  398 |         const data = await resp.json();
  399 |         const lines: any[] = data.items || [];
  400 |         const linesSum = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  401 |         const invTotal = parseFloat(data.total_amount ?? data.grand_total ?? data.amount ?? '0');
  402 |         console.log(`[AUDIT] Lines sum: $${linesSum} | Invoice total: $${invTotal} | Expected: $${L1 + L2}`);
> 403 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
      |                          ^ Error: expect(received).toBeCloseTo(expected, precision)
  404 |         if (invTotal > 0) expect(invTotal).toBeCloseTo(L1 + L2, 1);
  405 |         console.log('[PASS] Multi-line Invoice totals correct');
  406 |     });
  407 | 
  408 |     test('INV-API-05: Miscellaneous line on invoice (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  409 |         const app = new AppManager(page);
  410 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  411 |         const { apiBase, headers, qs } = await app.buildApiContext();
  412 | 
  413 |         const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
  414 |             headers,
  415 |             data: {
  416 |                 accounts_receivable_id: salesMeta.arAccountId,
  417 |                 customer_id: salesMeta.customerId,
  418 |                 invoice_date: periodDateIso,
  419 |                 due_date: periodDateIso,
  420 |                 currency_id: salesMeta.currencyId,
  421 |                 released_sales_order_items: [],
  422 |                 items: [{ description: 'Shipping & handling', quantity: 1, unit_price: 500, amount: 500, general_ledger_account_id: salesMeta.salesAccountId }],
  423 |             },
  424 |         });
  425 | 
  426 |         if (resp.ok()) {
  427 |             const amt = parseFloat(((await resp.json()).items || [])[0]?.amount ?? '0');
  428 |             expect(amt).toBeCloseTo(500, 1);
  429 |             console.log(`[PASS] Invoice miscellaneous line accepted: $${amt}`);
  430 |         } else {
  431 |             console.log(`[INFO] Invoice enforces item_id: HTTP ${resp.status()}`);
  432 |             expect([400, 422]).toContain(resp.status());
  433 |         }
  434 |     });
  435 | 
  436 |     // =========================================================================
  437 |     // RECEIPT
  438 |     // =========================================================================
  439 | 
  440 |     test('RCT-UI-01: Receipt UI — create standalone receipt with line item and verify', async ({ page }) => {
  441 |         const app = new AppManager(page);
  442 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  443 | 
  444 |         // Create and approve invoice first via API
  445 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  446 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  447 |             quantity: 1, unitPrice: 2000,
  448 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  449 |         });
  450 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  451 | 
  452 |         await page.goto('/receivables/receipts/new', { waitUntil: 'commit' });
  453 | 
  454 |         await app.pickDate('Receipt Date');
  455 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  456 |         await app.selectRandomOption(page.getByRole('button', { name: 'Cash Account selector' }), 'Cash Account');
  457 |         await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);
  458 | 
  459 |         // Add line item via modal
  460 |         const lineItemBtn = page.getByRole('button', { name: 'Line Item' });
  461 |         if (await lineItemBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  462 |             await lineItemBtn.click();
  463 |             const modal = page.getByRole('dialog').last();
  464 |             await modal.waitFor({ state: 'visible', timeout: 15000 });
  465 |             const itemBtn = modal.getByRole('button', { name: 'Item', exact: true });
  466 |             if (await itemBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  467 |                 await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '2000' });
  468 |                 console.log('[OK] Receipt line item added via modal');
  469 |             } else {
  470 |                 await page.keyboard.press('Escape');
  471 |                 console.log('[INFO] Receipt modal has no Item button — using amount field directly');
  472 |             }
  473 |         }
  474 | 
  475 |         const submitBtn = page.getByRole('button', { name: /Add Now|Save|Submit/i }).first();
  476 |         if (await submitBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
  477 |             await submitBtn.click();
  478 |             await page.waitForURL(/receipts\/.*\/detail/, { timeout: 60000 });
  479 |             const rctId = await app.extractIdFromUrl();
  480 |             await app.advanceDocumentAPI(rctId, 'receipts');
  481 |             console.log('[PASS] Receipt created and approved via UI');
  482 |         } else {
  483 |             console.log('[INFO] Receipt submit not available — partial UI coverage captured');
  484 |         }
  485 |     });
  486 | 
  487 |     test('RCT-API-02: Receipt partial payment → invoice Amount Due reduces by exact amount', async ({ page }) => {
  488 |         const app = new AppManager(page);
  489 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  490 | 
  491 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  492 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  493 |             quantity: 3, unitPrice: itemA.unitCost,
  494 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  495 |         });
  496 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  497 | 
  498 |         // Use actual invoice amount from API as ground truth
  499 |         const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
  500 |         const TOTAL = parseFloat(invDataBefore.total_amount ?? invDataBefore.grand_total ?? invDataBefore.amount ?? String(inv.amountDue));
  501 |         const PARTIAL = Math.floor(TOTAL / 3);
  502 | 
  503 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
```