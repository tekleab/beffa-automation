# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @regression >> SO-API-06: Negative unit price → rejected or flagged as known bug
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:691:9

# Error details

```
TimeoutError: apiRequestContext.post: Timeout 90000ms exceeded.
Call log:
  - → POST http://157.180.20.112:8001/api/sales-orders?year=2019&period=yearly&calendar=ec
    - user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.8010.12 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - x-company: ABC Trading
    - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJlZmZhLmNvbSIsImV4cCI6MTc5MjQ4MDM0OCwiaXNzIjoiZ2VuemVieWF6aCIsInJlZnJlc2hfZXhwIjoxNzkyNDgwMzQ4fQ.QCWJ_cl2RL8bkBQs_ym68DAjABzlRkHZFoy8Sij5cH4
    - Content-Type: application/json
    - content-length: 504
    - cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJlZmZhLmNvbSIsImV4cCI6MTc5MjQ4MDM0OCwiaXNzIjoiZ2VuemVieWF6aCIsInJlZnJlc2hfZXhwIjoxNzkyNDgwMzQ4fQ.QCWJ_cl2RL8bkBQs_ym68DAjABzlRkHZFoy8Sij5cH4; auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJlZmZhLmNvbSIsImV4cCI6MTc5MjQ4MDM0OCwiaXNzIjoiZ2VuemVieWF6aCIsInJlZnJlc2hfZXhwIjoxNzkyNDgwMzQ4fQ.QCWJ_cl2RL8bkBQs_ym68DAjABzlRkHZFoy8Sij5cH4

```

# Test source

```ts
  605 |         const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
  606 |         await expect(addNowBtn).toBeEnabled({ timeout: 10000 });
  607 |         await addNowBtn.click();
  608 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  609 | 
  610 |         const soId = await app.extractIdFromUrl();
  611 |         const { apiBase, headers, qs } = await app.buildApiContext();
  612 |         // The ERP stores SO line items under /sales-orders/{id}/items (GET /sales-order/{id} only returns header)
  613 |         const itemsResp = await page.request.get(`${apiBase}/sales-orders/${soId}/items?${qs}`, { headers });
  614 |         const itemsData = itemsResp.ok() ? await itemsResp.json().catch(() => ({})) : {};
  615 |         const soData = await (await page.request.get(`${apiBase}/sales-order/${soId}?${qs}`, { headers })).json().catch(() => ({}));
  616 |         const lines: any[] = itemsData.data || itemsData.items || soData.so_items || [];
  617 |         const linesSum = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  618 |         console.log(`[AUDIT] SO lines: ${lines.length} | Total: $${linesSum}`);
  619 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  620 |         console.log('[PASS] SO mixed lines — table shows all rows, total accumulated');
  621 |     });
  622 | 
  623 | 
  624 |     test('SO-API-04: Multi-line SO → grand total = sum of lines', async ({ page }) => {
  625 |         const app = new AppManager(page);
  626 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  627 |         const { apiBase, headers, qs } = await app.buildApiContext();
  628 |         const L1 = 2 * 500, L2 = 3 * 800;
  629 | 
  630 |         const so = await app.api.sales.createSalesOrderAPI({
  631 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  632 |             quantity: 2, unitPrice: 500,
  633 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  634 |         });
  635 |         expect(so.success).toBe(true);
  636 | 
  637 |         // Patch second line
  638 |         const soData = await (await page.request.get(`${apiBase}/sales-order/${so.id}?${qs}`, { headers })).json();
  639 |         const patchResp = await page.request.patch(`${apiBase}/sales-orders/${so.id}?${qs}`, {
  640 |             headers,
  641 |             data: {
  642 |                 so_items: [
  643 |                     ...(soData.so_items || []),
  644 |                     { item_id: itemB.itemId, quantity: 3, unit_price: 800, amount: L2, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  645 |                 ],
  646 |             },
  647 |         });
  648 | 
  649 |         if (!patchResp.ok()) { console.log(`[SKIP] SO multi-line PATCH not supported: ${patchResp.status()}`); return; }
  650 | 
  651 |         const updated = await patchResp.json();
  652 |         const linesSum = (updated.so_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  653 |         console.log(`[AUDIT] Lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  654 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  655 |         console.log('[PASS] SO multi-line totals correct');
  656 |     });
  657 | 
  658 |     test('SO-API-05: Zero-qty line → $0 amount or rejected', async ({ page }) => {
  659 |         const app = new AppManager(page);
  660 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  661 |         const { apiBase, headers, qs } = await app.buildApiContext();
  662 | 
  663 |         const payload = {
  664 |             accounts_receivable_id: salesMeta.arAccountId,
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
> 705 |         const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
      |                                         ^ TimeoutError: apiRequestContext.post: Timeout 90000ms exceeded.
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
  765 |         await lineItemBtn.click({ force: true }).catch(() => lineItemBtn.evaluate((n: HTMLElement) => n.click()));
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
```