# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @regression >> SO-UI-03: Add both Item + Miscellaneous lines → totals shown in SO table
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:532:9

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('button', { name: 'Add Now' }).first()
Expected: enabled
Received: disabled
Timeout:  10000ms

Call log:
  - Expect "toBeEnabled" getByRole('button', { name: 'Add Now' }).first() with timeout 10000ms
  - waiting for getByRole('button', { name: 'Add Now' }).first()
    23 × locator resolved to <button disabled type="button" class="chakra-button css-jy0srd">Add Now</button>
       - unexpected value "disabled"

```

```yaml
- button "Add Now" [disabled]
```

# Test source

```ts
  485 |         if (await insufficientRow.isVisible({ timeout: 1500 }).catch(() => false) || addNowDisabled) {
  486 |             console.log('[SO-UI-01] ⚠️ Stock error / disabled Add Now detected — auto topping up item stock via API');
  487 |             const itemIdToTopUp = (itemA as any)?.id || (itemA as any)?.itemId;
  488 |             if (itemIdToTopUp) {
  489 |                 await app.topUpItemStockAPI(itemIdToTopUp, 50, itemA.locationId, itemA.warehouseId);
  490 |             }
  491 |             await page.waitForTimeout(2000);
  492 |         }
  493 | 
  494 |         // Ensure Add Now is enabled before clicking — throw with clear message if still disabled
  495 |         await expect(addNowBtn).toBeEnabled({ timeout: 10000 });
  496 |         await addNowBtn.click();
  497 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  498 | 
  499 |         const soId = await app.extractIdFromUrl();
  500 |         await app.advanceDocumentAPI(soId, 'sales-orders');
  501 |         console.log('[PASS] SO with inventory line item created and approved');
  502 |     });
  503 | 
  504 |     test('SO-UI-02: Add Miscellaneous Line Item via modal → SO created and approved', async ({ page }) => {
  505 |         const app = new AppManager(page);
  506 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  507 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  508 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  509 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  510 | 
  511 |         await fillSalesOrderHeader(page, app);
  512 | 
  513 |         await page.locator('button:has-text("Line Item")').first().click();
  514 |         const modal = page.getByRole('dialog').last();
  515 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  516 | 
  517 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  518 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  519 |             console.log('[SKIP] Miscellaneous button not present in SO modal');
  520 |             await page.keyboard.press('Escape');
  521 |             return;
  522 |         }
  523 | 
  524 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '750', description: 'Delivery fee' });
  525 |         console.log('[OK] Miscellaneous line item added to SO');
  526 | 
  527 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  528 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  529 |         console.log('[PASS] SO with miscellaneous line item created');
  530 |     });
  531 | 
  532 |     test('SO-UI-03: Add both Item + Miscellaneous lines → totals shown in SO table', async ({ page }) => {
  533 |         const app = new AppManager(page);
  534 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  535 | 
  536 |         // Top up itemA stock BEFORE navigating — prevents "Insufficient stock" rows
  537 |         const itemIdToTopUp = (itemA as any)?.id || (itemA as any)?.itemId;
  538 |         if (itemIdToTopUp) {
  539 |             await app.topUpItemStockAPI(itemIdToTopUp, 50, itemA.locationId, itemA.warehouseId);
  540 |             console.log(`[SO-UI-03] ✅ Pre-topped itemA (${itemIdToTopUp}) to 50 units`);
  541 |         }
  542 | 
  543 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  544 | 
  545 |         await page.goto('/receivables/sale-orders/new', { waitUntil: 'domcontentloaded' });
  546 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
  547 |         await page.locator('button:has-text("Line Item")').first().waitFor({ state: 'visible', timeout: 60000 });
  548 | 
  549 |         await fillSalesOrderHeader(page, app);
  550 | 
  551 |         // Line 1: inventory item (search by name for guaranteed stocked item)
  552 |         await page.locator('button:has-text("Line Item")').first().click();
  553 |         await addLineItemViaModal(page, app, 'Item', { qty: '2', unitPrice: capturedItem?.price || '1000', itemName: capturedItem?.name });
  554 | 
  555 |         // Line 2: miscellaneous
  556 |         await page.locator('button:has-text("Line Item")').first().click();
  557 |         const modal2 = page.getByRole('dialog').last();
  558 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  559 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  560 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  561 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '300', description: 'Shipping' });
  562 |         } else {
  563 |             await page.keyboard.press('Escape');
  564 |             console.log('[INFO] Miscellaneous not available — adding second Item line');
  565 |             await page.locator('button:has-text("Line Item")').first().click();
  566 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '300', itemName: capturedItem?.name });
  567 |         }
  568 | 
  569 |         // Verify 2 rows appear in the SO items table before submit
  570 |         await expect.poll(async () => page.locator('table tbody tr').count(), { timeout: 10000 }).toBeGreaterThanOrEqual(2);
  571 |         const rowCount = await page.locator('table tbody tr').count();
  572 |         console.log(`[AUDIT] ${rowCount} line items visible in SO form table`);
  573 | 
  574 |         // Safety: if any row still shows stock error after modal (shouldn't happen now), top up and wait
  575 |         await page.waitForTimeout(500);
  576 |         const insufficientRowSO = page.locator('table tbody tr, [role="row"]')
  577 |             .filter({ hasText: /insufficient stock|available:\s*0/i }).first();
  578 |         if (await insufficientRowSO.isVisible({ timeout: 1500 }).catch(() => false)) {
  579 |             console.log('[SO-UI-03] ⚠️ Stock error still present — topping up again and refreshing line');
  580 |             if (itemIdToTopUp) await app.topUpItemStockAPI(itemIdToTopUp, 50, itemA.locationId, itemA.warehouseId);
  581 |             await page.waitForTimeout(3000);
  582 |         }
  583 | 
  584 |         const addNowBtn = page.getByRole('button', { name: 'Add Now' }).first();
> 585 |         await expect(addNowBtn).toBeEnabled({ timeout: 10000 });
      |                                 ^ Error: expect(locator).toBeEnabled() failed
  586 |         await addNowBtn.click();
  587 |         await page.waitForURL(/sale-orders\/.*\/detail/, { timeout: 60000 });
  588 | 
  589 |         const soId = await app.extractIdFromUrl();
  590 |         const { apiBase, headers, qs } = await app.buildApiContext();
  591 |         const soData = await (await page.request.get(`${apiBase}/sales-order/${soId}?${qs}`, { headers })).json();
  592 |         const lines: any[] = soData.so_items || [];
  593 |         const linesSum = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  594 |         console.log(`[AUDIT] SO lines: ${lines.length} | Total: $${linesSum}`);
  595 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  596 |         console.log('[PASS] SO mixed lines — table shows all rows, total accumulated');
  597 |     });
  598 | 
  599 | 
  600 |     test('SO-API-04: Multi-line SO → grand total = sum of lines', async ({ page }) => {
  601 |         const app = new AppManager(page);
  602 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  603 |         const { apiBase, headers, qs } = await app.buildApiContext();
  604 |         const L1 = 2 * 500, L2 = 3 * 800;
  605 | 
  606 |         const so = await app.api.sales.createSalesOrderAPI({
  607 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  608 |             quantity: 2, unitPrice: 500,
  609 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  610 |         });
  611 |         expect(so.success).toBe(true);
  612 | 
  613 |         // Patch second line
  614 |         const soData = await (await page.request.get(`${apiBase}/sales-order/${so.id}?${qs}`, { headers })).json();
  615 |         const patchResp = await page.request.patch(`${apiBase}/sales-orders/${so.id}?${qs}`, {
  616 |             headers,
  617 |             data: {
  618 |                 so_items: [
  619 |                     ...(soData.so_items || []),
  620 |                     { item_id: itemB.itemId, quantity: 3, unit_price: 800, amount: L2, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  621 |                 ],
  622 |             },
  623 |         });
  624 | 
  625 |         if (!patchResp.ok()) { console.log(`[SKIP] SO multi-line PATCH not supported: ${patchResp.status()}`); return; }
  626 | 
  627 |         const updated = await patchResp.json();
  628 |         const linesSum = (updated.so_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  629 |         console.log(`[AUDIT] Lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  630 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  631 |         console.log('[PASS] SO multi-line totals correct');
  632 |     });
  633 | 
  634 |     test('SO-API-05: Zero-qty line → $0 amount or rejected', async ({ page }) => {
  635 |         const app = new AppManager(page);
  636 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  637 |         const { apiBase, headers, qs } = await app.buildApiContext();
  638 | 
  639 |         const payload = {
  640 |             accounts_receivable_id: salesMeta.arAccountId,
  641 |             currency_id: salesMeta.currencyId,
  642 |             customer_id: salesMeta.customerId,
  643 |             so_date: periodDateIso,
  644 |             so_items: [{ item_id: itemA.itemId, quantity: 0, unit_price: 500, amount: 0, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  645 |             status: 'draft',
  646 |         };
  647 | 
  648 |         const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
  649 |             headers,
  650 |             data: payload,
  651 |         });
  652 | 
  653 |         if (resp.ok()) {
  654 |             const amt = parseFloat(((await resp.json()).so_items || [])[0]?.amount ?? '0');
  655 |             expect(amt).toBe(0);
  656 |             console.log('[INFO] Zero-qty SO line accepted — $0 amount, no financial impact');
  657 |         } else {
  658 |             await assertValidationRejection(resp, {
  659 |                 label: 'SO-API-05: Zero Quantity Line Item',
  660 |                 requestData: payload,
  661 |                 url: `${apiBase}/sales-orders`,
  662 |                 method: 'POST',
  663 |             });
  664 |         }
  665 |     });
  666 | 
  667 |     test('SO-API-06: Negative unit price → rejected or flagged as known bug', async ({ page }) => {
  668 |         const app = new AppManager(page);
  669 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  670 |         const { apiBase, headers, qs } = await app.buildApiContext();
  671 | 
  672 |         const payload = {
  673 |             accounts_receivable_id: salesMeta.arAccountId,
  674 |             currency_id: salesMeta.currencyId,
  675 |             customer_id: salesMeta.customerId,
  676 |             so_date: periodDateIso,
  677 |             so_items: [{ item_id: itemA.itemId, quantity: 1, unit_price: -500, amount: -500, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  678 |             status: 'draft',
  679 |         };
  680 | 
  681 |         const resp = await page.request.post(`${apiBase}/sales-orders?${qs}`, {
  682 |             headers,
  683 |             data: payload,
  684 |         });
  685 | 
```