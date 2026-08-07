# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> PO-UI-01: Add inventory Line Item via modal → PO created and approved
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:555:9

# Error details

```
TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://168.119.175.142:4173/payables/purchase-orders/new"
============================================================
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
  471 |             if (await itemBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  472 |                 await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '2000' });
  473 |                 console.log('[OK] Receipt line item added via modal');
  474 |             } else {
  475 |                 await page.keyboard.press('Escape');
  476 |                 console.log('[INFO] Receipt modal has no Item button — using amount field directly');
  477 |             }
  478 |         }
  479 | 
  480 |         const submitBtn = page.getByRole('button', { name: /Add Now|Save|Submit/i }).first();
  481 |         if (await submitBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
  482 |             await submitBtn.click();
  483 |             await page.waitForURL(/receipts\/.*\/detail/, { timeout: 60000 });
  484 |             const rctId = await app.extractIdFromUrl();
  485 |             await app.advanceDocumentAPI(rctId, 'receipts');
  486 |             console.log('[PASS] Receipt created and approved via UI');
  487 |         } else {
  488 |             console.log('[INFO] Receipt submit not available — partial UI coverage captured');
  489 |         }
  490 |     });
  491 | 
  492 |     test('RCT-API-02: Receipt partial payment → invoice Amount Due reduces by exact amount', async ({ page }) => {
  493 |         const app = new AppManager(page);
  494 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  495 | 
  496 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  497 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  498 |             quantity: 3, unitPrice: itemA.unitCost,
  499 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  500 |         });
  501 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  502 | 
  503 |         // Use actual invoice amount from API as ground truth
  504 |         const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
  505 |         const TOTAL = parseFloat(invDataBefore.total_amount ?? invDataBefore.grand_total ?? invDataBefore.amount ?? String(inv.amountDue));
  506 |         const PARTIAL = Math.floor(TOTAL / 3);
  507 | 
  508 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  509 |             invoiceId: inv.id, customerId: salesMeta.customerId,
  510 |             amount: PARTIAL, currencyId: salesMeta.currencyId, cashAccountId: salesMeta.cashAccountId,
  511 |         });
  512 |         await app.advanceDocumentAPI(rct.id, 'receipts');
  513 | 
  514 |         await page.waitForTimeout(3000);
  515 |         const invData = await app.api.sales.getInvoiceAPI(inv.id);
  516 |         const remaining = parseFloat(invData.unpaid_amount ?? invData.balance ?? invData.net_due ?? '0');
  517 |         console.log(`[AUDIT] Invoice $${TOTAL} | Paid $${PARTIAL} | Remaining $${remaining} | Expected $${TOTAL - PARTIAL}`);
  518 |         expect(remaining).toBeCloseTo(TOTAL - PARTIAL, 1);
  519 |         console.log('[PASS] Partial receipt reduces invoice Amount Due correctly');
  520 |     });
  521 | 
  522 |     test('RCT-API-03: Receipt full payment → invoice Amount Due = 0', async ({ page }) => {
  523 |         const app = new AppManager(page);
  524 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  525 | 
  526 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  527 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  528 |             quantity: 2, unitPrice: itemA.unitCost,
  529 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  530 |         });
  531 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  532 | 
  533 |         // Use actual invoice amount from API as ground truth
  534 |         const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
  535 |         const AMOUNT = parseFloat(invDataBefore.total_amount ?? invDataBefore.grand_total ?? invDataBefore.amount ?? String(inv.amountDue));
  536 | 
  537 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  538 |             invoiceId: inv.id, customerId: salesMeta.customerId,
  539 |             amount: AMOUNT, currencyId: salesMeta.currencyId, cashAccountId: salesMeta.cashAccountId,
  540 |         });
  541 |         await app.advanceDocumentAPI(rct.id, 'receipts');
  542 | 
  543 |         await page.waitForTimeout(3000);
  544 |         const invData = await app.api.sales.getInvoiceAPI(inv.id);
  545 |         const remaining = parseFloat(invData.unpaid_amount ?? invData.balance ?? invData.net_due ?? '999');
  546 |         console.log(`[AUDIT] Full receipt $${AMOUNT} → Remaining: $${remaining}`);
  547 |         expect(remaining).toBeLessThan(1);
  548 |         console.log('[PASS] Full receipt settles invoice to zero');
  549 |     });
  550 | 
  551 |     // =========================================================================
  552 |     // PURCHASE ORDER
  553 |     // =========================================================================
  554 | 
  555 |     test('PO-UI-01: Add inventory Line Item via modal → PO created and approved', async ({ page }) => {
  556 |         const app = new AppManager(page);
  557 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  558 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'commit' });
  559 | 
  560 |         await app.pickDate('Purchase Order Date');
  561 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  562 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  563 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  564 | 
  565 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  566 |         await page.getByRole('button', { name: 'Line Item' }).click();
  567 |         await addLineItemViaModal(page, app, 'Item', { qty: '5', unitPrice: '2000' });
  568 |         console.log('[OK] Inventory line item added to PO');
  569 | 
  570 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
> 571 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
      |                    ^ TimeoutError: page.waitForURL: Timeout 60000ms exceeded.
  572 | 
  573 |         const poId = await app.extractIdFromUrl();
  574 |         await app.advanceDocumentAPI(poId, 'purchase-orders');
  575 |         console.log('[PASS] PO with inventory line item created and approved');
  576 |     });
  577 | 
  578 |     test('PO-UI-02: Add Miscellaneous Line Item via modal → PO total reflects it', async ({ page }) => {
  579 |         const app = new AppManager(page);
  580 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  581 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'commit' });
  582 | 
  583 |         await app.pickDate('Purchase Order Date');
  584 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  585 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  586 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  587 | 
  588 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  589 |         await page.getByRole('button', { name: 'Line Item' }).click();
  590 |         const modal = page.getByRole('dialog').last();
  591 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  592 | 
  593 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  594 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  595 |             console.log('[SKIP] Miscellaneous button not present in PO modal');
  596 |             await page.keyboard.press('Escape');
  597 |             return;
  598 |         }
  599 | 
  600 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });
  601 | 
  602 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  603 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  604 |         console.log('[PASS] PO with miscellaneous line created');
  605 |     });
  606 | 
  607 |     test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
  608 |         const app = new AppManager(page);
  609 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  610 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'commit' });
  611 | 
  612 |         await app.pickDate('Purchase Order Date');
  613 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  614 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  615 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  616 | 
  617 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  618 | 
  619 |         // Line 1: inventory item
  620 |         await page.getByRole('button', { name: 'Line Item' }).click();
  621 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '1500' });
  622 | 
  623 |         // Line 2: miscellaneous
  624 |         await page.getByRole('button', { name: 'Line Item' }).click();
  625 |         const modal2 = page.getByRole('dialog').last();
  626 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  627 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  628 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  629 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
  630 |         } else {
  631 |             await page.keyboard.press('Escape');
  632 |             await page.getByRole('button', { name: 'Line Item' }).click();
  633 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '500' });
  634 |         }
  635 | 
  636 |         const rowCount = await page.locator('table tbody tr').count();
  637 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  638 |         console.log(`[AUDIT] ${rowCount} lines in PO form table`);
  639 | 
  640 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  641 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  642 | 
  643 |         const poId = await app.extractIdFromUrl();
  644 |         const { apiBase, headers, qs } = await app.buildApiContext();
  645 |         const poData = await (await page.request.get(`${apiBase}/purchase-order/${poId}?${qs}`, { headers })).json();
  646 |         const lines: any[] = poData.po_items || [];
  647 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  648 |         console.log(`[AUDIT] PO lines in API: ${lines.length}`);
  649 |         console.log('[PASS] PO mixed lines — all rows present in form and API');
  650 |     });
  651 | 
  652 |     test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
  653 |         const app = new AppManager(page);
  654 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  655 |         const { apiBase, headers, qs } = await app.buildApiContext();
  656 |         const L1 = 5 * 1000, L2 = 3 * 1500;
  657 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  658 |         const dateIso = (await DateHelper.resolve(page)).iso;
  659 | 
  660 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  661 |         const allAccounts = acctData.items || acctData.data || [];
  662 |         const apAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable'))  || allAccounts[0];
  663 |         const glAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  664 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  665 |         const currency = currData.items?.[0] || currData.data?.[0];
  666 | 
  667 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  668 |             headers,
  669 |             data: {
  670 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  671 |                 vendor_id: purchaseMeta.vendorId,
```