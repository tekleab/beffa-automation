# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> RCT-API-03: Receipt full payment → invoice Amount Due = 0
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:661:9

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 1
Received:   200
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
  586 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  587 | 
  588 |         // Create and approve invoice first via API
  589 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  590 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  591 |             quantity: 1, unitPrice: 2000,
  592 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  593 |         });
  594 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  595 | 
  596 |         await page.goto('/receivables/receipts/new', { waitUntil: 'commit' });
  597 | 
  598 |         await app.pickDate('Receipt Date');
  599 |         await app.selectRandomOption(page.getByRole('button', { name: 'Customer selector' }), 'Customer');
  600 |         await app.selectRandomOption(page.getByRole('button', { name: 'Cash Account selector' }), 'Cash Account');
  601 |         await fillCurrencyField(page, app);
  602 | 
  603 |         // Add line item via modal
  604 |         const lineItemBtn = page.getByRole('button', { name: 'Line Item' });
  605 |         if (await lineItemBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  606 |             await lineItemBtn.click();
  607 |             const modal = page.getByRole('dialog').last();
  608 |             await modal.waitFor({ state: 'visible', timeout: 15000 });
  609 |             const itemBtn = modal.getByRole('button', { name: 'Item', exact: true });
  610 |             if (await itemBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  611 |                 await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '2000' });
  612 |                 console.log('[OK] Receipt line item added via modal');
  613 |             } else {
  614 |                 await page.keyboard.press('Escape');
  615 |                 console.log('[INFO] Receipt modal has no Item button — using amount field directly');
  616 |             }
  617 |         }
  618 | 
  619 |         const submitBtn = page.getByRole('button', { name: /Add Now|Save|Submit/i }).first();
  620 |         if (await submitBtn.isEnabled({ timeout: 5000 }).catch(() => false)) {
  621 |             await submitBtn.click();
  622 |             await page.waitForURL(/receipts\/.*\/detail/, { timeout: 60000 });
  623 |             const rctId = await app.extractIdFromUrl();
  624 |             await app.advanceDocumentAPI(rctId, 'receipts');
  625 |             console.log('[PASS] Receipt created and approved via UI');
  626 |         } else {
  627 |             console.log('[INFO] Receipt submit not available — partial UI coverage captured');
  628 |         }
  629 |     });
  630 | 
  631 |     test('RCT-API-02: Receipt partial payment → invoice Amount Due reduces by exact amount', async ({ page }) => {
  632 |         const app = new AppManager(page);
  633 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  634 | 
  635 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  636 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  637 |             quantity: 3, unitPrice: itemA.unitCost,
  638 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  639 |         });
  640 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  641 | 
  642 |         // Use actual invoice amount from API as ground truth
  643 |         const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
  644 |         const TOTAL = parseFloat(invDataBefore.total_amount ?? invDataBefore.grand_total ?? invDataBefore.amount ?? String(inv.amountDue));
  645 |         const PARTIAL = Math.floor(TOTAL / 3);
  646 | 
  647 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  648 |             invoiceId: inv.id, customerId: salesMeta.customerId,
  649 |             amount: PARTIAL, currencyId: salesMeta.currencyId, cashAccountId: salesMeta.cashAccountId,
  650 |         });
  651 |         await app.advanceDocumentAPI(rct.id, 'receipts');
  652 | 
  653 |         await page.waitForTimeout(3000);
  654 |         const invData = await app.api.sales.getInvoiceAPI(inv.id);
  655 |         const remaining = parseFloat(invData.unpaid_amount ?? invData.balance ?? invData.net_due ?? '0');
  656 |         console.log(`[AUDIT] Invoice $${TOTAL} | Paid $${PARTIAL} | Remaining $${remaining} | Expected $${TOTAL - PARTIAL}`);
  657 |         expect(remaining).toBeCloseTo(TOTAL - PARTIAL, 1);
  658 |         console.log('[PASS] Partial receipt reduces invoice Amount Due correctly');
  659 |     });
  660 | 
  661 |     test('RCT-API-03: Receipt full payment → invoice Amount Due = 0', async ({ page }) => {
  662 |         const app = new AppManager(page);
  663 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  664 | 
  665 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  666 |             customerId: salesMeta.customerId, itemId: itemA.itemId,
  667 |             quantity: 2, unitPrice: itemA.unitCost,
  668 |             locationId: itemA.locationId, warehouseId: itemA.warehouseId,
  669 |         });
  670 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  671 | 
  672 |         // Use actual invoice amount from API as ground truth
  673 |         const invDataBefore = await app.api.sales.getInvoiceAPI(inv.id);
  674 |         const AMOUNT = parseFloat(invDataBefore.total_amount ?? invDataBefore.grand_total ?? invDataBefore.amount ?? String(inv.amountDue));
  675 | 
  676 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  677 |             invoiceId: inv.id, customerId: salesMeta.customerId,
  678 |             amount: AMOUNT, currencyId: salesMeta.currencyId, cashAccountId: salesMeta.cashAccountId,
  679 |         });
  680 |         await app.advanceDocumentAPI(rct.id, 'receipts');
  681 | 
  682 |         await page.waitForTimeout(3000);
  683 |         const invData = await app.api.sales.getInvoiceAPI(inv.id);
  684 |         const remaining = parseFloat(invData.unpaid_amount ?? invData.balance ?? invData.net_due ?? '999');
  685 |         console.log(`[AUDIT] Full receipt $${AMOUNT} → Remaining: $${remaining}`);
> 686 |         expect(remaining).toBeLessThan(1);
      |                           ^ Error: expect(received).toBeLessThan(expected)
  687 |         console.log('[PASS] Full receipt settles invoice to zero');
  688 |     });
  689 | 
  690 |     // =========================================================================
  691 |     // PURCHASE ORDER
  692 |     // =========================================================================
  693 | 
  694 |     test('PO-UI-01: Add inventory Line Item via modal → PO created and approved', async ({ page }) => {
  695 |         const app = new AppManager(page);
  696 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  697 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  698 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  699 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  700 | 
  701 |         await app.pickDate('Purchase Order Date');
  702 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  703 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  704 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  705 | 
  706 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  707 |         await page.getByRole('button', { name: 'Line Item' }).click();
  708 |         await addLineItemViaModal(page, app, 'Item', { qty: '5', unitPrice: '2000' });
  709 |         console.log('[OK] Inventory line item added to PO');
  710 | 
  711 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  712 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  713 | 
  714 |         const poId = await app.extractIdFromUrl();
  715 |         await app.advanceDocumentAPI(poId, 'purchase-orders');
  716 |         console.log('[PASS] PO with inventory line item created and approved');
  717 |     });
  718 | 
  719 |     test('PO-UI-02: Add Miscellaneous Line Item via modal → PO total reflects it', async ({ page }) => {
  720 |         const app = new AppManager(page);
  721 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  722 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  723 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  724 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  725 | 
  726 |         await app.pickDate('Purchase Order Date');
  727 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  728 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  729 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  730 | 
  731 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  732 |         await page.getByRole('button', { name: 'Line Item' }).click();
  733 |         const modal = page.getByRole('dialog').last();
  734 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  735 | 
  736 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  737 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  738 |             console.log('[SKIP] Miscellaneous button not present in PO modal');
  739 |             await page.keyboard.press('Escape');
  740 |             return;
  741 |         }
  742 | 
  743 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });
  744 | 
  745 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  746 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  747 |         console.log('[PASS] PO with miscellaneous line created');
  748 |     });
  749 | 
  750 |     test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
  751 |         const app = new AppManager(page);
  752 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  753 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'domcontentloaded' });
  754 |         await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  755 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).waitFor({ state: 'visible', timeout: 60000 });
  756 | 
  757 |         await app.pickDate('Purchase Order Date');
  758 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  759 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  760 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  761 | 
  762 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  763 | 
  764 |         // Line 1: inventory item
  765 |         await page.getByRole('button', { name: 'Line Item' }).click();
  766 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '1500' });
  767 | 
  768 |         // Line 2: miscellaneous
  769 |         await page.getByRole('button', { name: 'Line Item' }).click();
  770 |         const modal2 = page.getByRole('dialog').last();
  771 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  772 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  773 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  774 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
  775 |         } else {
  776 |             await page.keyboard.press('Escape');
  777 |             await page.getByRole('button', { name: 'Line Item' }).click();
  778 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '500' });
  779 |         }
  780 | 
  781 |         const rowCount = await page.locator('table tbody tr').count();
  782 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  783 |         console.log(`[AUDIT] ${rowCount} lines in PO form table`);
  784 | 
  785 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  786 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
```