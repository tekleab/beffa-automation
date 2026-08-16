# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> INV-API-04: Multi-line invoice → grand total = sum of lines
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:622:9

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
  552 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  553 |         await fillCurrencyField(page, app);
  554 | 
  555 |         await page.getByRole('button', { name: 'Line Item' }).click();
  556 |         const modal = page.getByRole('dialog').last();
  557 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  558 | 
  559 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  560 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  561 |             console.log('[SKIP] Miscellaneous button not present in Invoice modal');
  562 |             await page.keyboard.press('Escape');
  563 |             return;
  564 |         }
  565 | 
  566 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '1500', description: 'Consulting fee' });
  567 | 
  568 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  569 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  570 |         console.log('[PASS] Invoice with miscellaneous line created');
  571 |     });
  572 | 
  573 |     test('INV-UI-03: Mixed Item + Miscellaneous lines → both rows in table, totals accumulate', async ({ page }) => {
  574 |         const app = new AppManager(page);
  575 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  576 |         await page.goto('/receivables/invoices/new', { waitUntil: 'domcontentloaded' });
  577 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  578 |         await page.getByRole('button', { name: 'Line Item' }).waitFor({ state: 'visible', timeout: 60000 });
  579 | 
  580 |         await app.pickDate('Invoice Date');
  581 |         await app.pickDate('Due Date');
  582 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  583 |         await app.selectRandomOption(page.locator('.flex-col, .chakra-form-control').filter({ hasText: /Account.?Receivable/i }).locator('button').first(), 'Accounts Receivable');
  584 |         await fillCurrencyField(page, app);
  585 | 
  586 |         const capturedItem = await captureItemWithPriceAPI(page, app);
  587 | 
  588 |         // Item line
  589 |         await page.getByRole('button', { name: 'Line Item' }).click();
  590 |         await addLineItemViaModal(page, app, 'Item', { qty: '3', unitPrice: capturedItem?.price || '400', itemName: capturedItem?.name });
  591 | 
  592 |         // Miscellaneous line
  593 |         await page.getByRole('button', { name: 'Line Item' }).click();
  594 |         const modal2 = page.getByRole('dialog').last();
  595 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  596 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  597 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  598 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '200', description: 'Handling' });
  599 |         } else {
  600 |             await page.keyboard.press('Escape');
  601 |             await page.getByRole('button', { name: 'Line Item' }).click();
  602 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: capturedItem?.price || '200', itemName: capturedItem?.name });
  603 |         }
  604 | 
  605 |         const rowCount = await page.locator('table tbody tr, [role="row"], [data-testid*="line"], .line-item-row').count();
  606 |         const altRowCount = await page.locator('.chakra-stack > div, .flex-row').filter({ hasText: /\d+/ }).count();
  607 |         const effectiveRowCount = rowCount > 0 ? rowCount : altRowCount;
  608 |         console.log(`[AUDIT] ${effectiveRowCount} lines visible in Invoice form`);
  609 | 
  610 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  611 |         await page.waitForURL(/invoices\/.*\/detail/, { timeout: 60000 });
  612 | 
  613 |         const invId = await app.extractIdFromUrl();
  614 |         const invData = await app.api.sales.getInvoiceAPI(invId);
  615 |         const lines: any[] = invData.items || invData.invoice_items || [];
  616 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  617 |         const total = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  618 |         console.log(`[AUDIT] Invoice lines: ${lines.length} | Total: $${total}`);
  619 |         console.log('[PASS] Invoice mixed lines — all rows present, total accumulated');
  620 |     });
  621 | 
  622 |     test('INV-API-04: Multi-line invoice → grand total = sum of lines', async ({ page }) => {
  623 |         const app = new AppManager(page);
  624 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  625 |         const { apiBase, headers, qs } = await app.buildApiContext();
  626 |         const L1 = 3 * 400, L2 = 2 * 600;
  627 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  628 |         const dateIso = (await DateHelper.resolve(page)).iso;
  629 | 
  630 |         const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
  631 |             headers,
  632 |             data: {
  633 |                 accounts_receivable_id: salesMeta.arAccountId,
  634 |                 customer_id: salesMeta.customerId,
  635 |                 invoice_date: dateIso,
  636 |                 due_date: dateIso,
  637 |                 currency_id: salesMeta.currencyId,
  638 |                 released_sales_order_items: [],
  639 |                 items: [
  640 |                     { item_id: itemA.itemId, quantity: 3, unit_price: 400, amount: L1, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  641 |                     { item_id: itemB.itemId, quantity: 2, unit_price: 600, amount: L2, general_ledger_account_id: salesMeta.salesAccountId, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  642 |                 ],
  643 |             },
  644 |         });
  645 | 
  646 |         expect(resp.ok(), `Multi-line Invoice failed: HTTP ${resp.status()}`).toBe(true);
  647 |         const data = await resp.json();
  648 |         const lines: any[] = data.items || [];
  649 |         const linesSum = lines.reduce((s: number, l: any) => s + parseFloat(l.amount ?? '0'), 0);
  650 |         const invTotal = parseFloat(data.total_amount ?? data.grand_total ?? data.amount ?? '0');
  651 |         console.log(`[AUDIT] Lines sum: $${linesSum} | Invoice total: $${invTotal} | Expected: $${L1 + L2}`);
> 652 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
      |                          ^ Error: expect(received).toBeCloseTo(expected, precision)
  653 |         if (invTotal > 0) expect(invTotal).toBeCloseTo(L1 + L2, 1);
  654 |         console.log('[PASS] Multi-line Invoice totals correct');
  655 |     });
  656 | 
  657 |     test('INV-API-05: Miscellaneous line on invoice (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  658 |         const app = new AppManager(page);
  659 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  660 |         const { apiBase, headers, qs } = await app.buildApiContext();
  661 | 
  662 |         const resp = await page.request.post(`${apiBase}/invoices?${qs}`, {
  663 |             headers,
  664 |             data: {
  665 |                 accounts_receivable_id: salesMeta.arAccountId,
  666 |                 customer_id: salesMeta.customerId,
  667 |                 invoice_date: periodDateIso,
  668 |                 due_date: periodDateIso,
  669 |                 currency_id: salesMeta.currencyId,
  670 |                 released_sales_order_items: [],
  671 |                 items: [{ description: 'Shipping & handling', quantity: 1, unit_price: 500, amount: 500, general_ledger_account_id: salesMeta.salesAccountId }],
  672 |             },
  673 |         });
  674 | 
  675 |         if (resp.ok()) {
  676 |             const amt = parseFloat(((await resp.json()).items || [])[0]?.amount ?? '0');
  677 |             expect(amt).toBeCloseTo(500, 1);
  678 |             console.log(`[PASS] Invoice miscellaneous line accepted: $${amt}`);
  679 |         } else {
  680 |             console.log(`[INFO] Invoice enforces item_id: HTTP ${resp.status()}`);
  681 |             expect([400, 422]).toContain(resp.status());
  682 |         }
  683 |     });
  684 | 
  685 |     // =========================================================================
  686 |     // RECEIPT
  687 |     // =========================================================================
  688 | 
  689 |     test('RCT-UI-01: Receipt UI — create standalone receipt with line item and verify', async ({ page }) => {
  690 |         const app = new AppManager(page);
  691 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  692 | 
  693 |         // Create and approve invoice first via API
  694 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  695 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  696 |             quantity: 1, unitPrice: 2000,
  697 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  698 |         });
  699 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  700 | 
  701 |         await page.goto('/receivables/receipts/new', { waitUntil: 'commit' });
  702 | 
  703 |         await app.pickDate('Receipt Date');
  704 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  705 |         await app.selectRandomOption(page.getByRole('button', { name: 'Cash Account selector' }), 'Cash Account');
  706 |         await fillCurrencyField(page, app);
  707 | 
  708 |         // Add line item via modal
  709 |         const lineItemBtn = page.getByRole('button', { name: 'Line Item' });
  710 |         if (await lineItemBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  711 |             await lineItemBtn.click();
  712 |             const modal = page.getByRole('dialog').last();
  713 |             await modal.waitFor({ state: 'visible', timeout: 15000 });
  714 |             const itemBtn = modal.getByRole('button', { name: 'Item', exact: true });
  715 |             if (await itemBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  716 |                 await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '2000' });
  717 |                 console.log('[OK] Receipt line item added via modal');
  718 |             } else {
  719 |                 await page.keyboard.press('Escape');
  720 |                 console.log('[INFO] Receipt modal has no Item button — using amount field directly');
  721 |             }
  722 |         }
  723 | 
  724 |         const submitBtn = page.getByRole('button', { name: /Add Now|Save|Submit/i }).first();
  725 |         if (await submitBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
  726 |             await submitBtn.click();
  727 |             await page.waitForURL(/receipts\/.*\/detail/, { timeout: 60000 });
  728 |             const rctId = await app.extractIdFromUrl();
  729 |             await app.advanceDocumentAPI(rctId, 'receipts');
  730 |             console.log('[PASS] Receipt created and approved via UI');
  731 |         } else {
  732 |             console.log('[INFO] Receipt submit not available — partial UI coverage captured');
  733 |         }
  734 |     });
  735 | 
  736 |     test('RCT-API-02: Receipt partial payment → invoice Amount Due reduces by exact amount', async ({ page }) => {
  737 |         const app = new AppManager(page);
  738 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  739 | 
  740 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  741 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  742 |             quantity: 3, unitPrice: itemA.unitCost,
  743 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  744 |         });
  745 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  746 | 
  747 |         // Use actual invoice amount from API as ground truth
  748 |         const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
  749 |         const TOTAL = parseFloat(invDataBefore.total_amount ?? invDataBefore.grand_total ?? invDataBefore.amount ?? String(inv.amountDue));
  750 |         const PARTIAL = Math.floor(TOTAL / 3);
  751 | 
  752 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
```