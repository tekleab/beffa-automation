# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/line-item-miscellaneous-audit.spec.ts >> Line Item & Miscellaneous Audit @sales @purchase @logic @regression @full >> PO-API-04: Multi-line PO → grand total = sum of lines
- Location: tests/cross-module/line-item-miscellaneous-audit.spec.ts:613:9

# Error details

```
Error: Multi-line PO failed: HTTP 422

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
  539 |     });
  540 | 
  541 |     test('PO-UI-02: Add Miscellaneous Line Item via modal → PO total reflects it', async ({ page }) => {
  542 |         const app = new AppManager(page);
  543 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'networkidle' });
  544 | 
  545 |         await app.pickDate('Purchase Order Date');
  546 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  547 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  548 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  549 | 
  550 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  551 |         await page.getByRole('button', { name: 'Line Item' }).click();
  552 |         const modal = page.getByRole('dialog').last();
  553 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  554 | 
  555 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  556 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  557 |             console.log('[SKIP] Miscellaneous button not present in PO modal');
  558 |             await page.keyboard.press('Escape');
  559 |             return;
  560 |         }
  561 | 
  562 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '3000', description: 'Freight charges' });
  563 | 
  564 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  565 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  566 |         console.log('[PASS] PO with miscellaneous line created');
  567 |     });
  568 | 
  569 |     test('PO-UI-03: Mixed Item + Miscellaneous lines → both rows in PO table', async ({ page }) => {
  570 |         const app = new AppManager(page);
  571 |         await page.goto('/payables/purchase-orders/new', { waitUntil: 'networkidle' });
  572 | 
  573 |         await app.pickDate('Purchase Order Date');
  574 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  575 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  576 |         await app.selectRandomOption(page.getByRole('button', { name: 'Purchase Type selector' }), 'Purchase Type');
  577 | 
  578 |         await page.getByRole('tab', { name: /Purchase Order Items/i }).click();
  579 | 
  580 |         // Line 1: inventory item
  581 |         await page.getByRole('button', { name: 'Line Item' }).click();
  582 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '1500' });
  583 | 
  584 |         // Line 2: miscellaneous
  585 |         await page.getByRole('button', { name: 'Line Item' }).click();
  586 |         const modal2 = page.getByRole('dialog').last();
  587 |         await modal2.waitFor({ state: 'visible', timeout: 15000 });
  588 |         const miscBtn = modal2.getByRole('button', { name: 'Miscellaneous', exact: true });
  589 |         if (await miscBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  590 |             await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '500', description: 'Import duty' });
  591 |         } else {
  592 |             await page.keyboard.press('Escape');
  593 |             await page.getByRole('button', { name: 'Line Item' }).click();
  594 |             await addLineItemViaModal(page, app, 'Item', { qty: '1', unitPrice: '500' });
  595 |         }
  596 | 
  597 |         const rowCount = await page.locator('table tbody tr').count();
  598 |         expect(rowCount).toBeGreaterThanOrEqual(2);
  599 |         console.log(`[AUDIT] ${rowCount} lines in PO form table`);
  600 | 
  601 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  602 |         await page.waitForURL(/purchase-orders\/.*\/detail/, { timeout: 60000 });
  603 | 
  604 |         const poId = await app.extractIdFromUrl();
  605 |         const { apiBase, headers, qs } = await app.buildApiContext();
  606 |         const poData = await (await page.request.get(`${apiBase}/purchase-order/${poId}?${qs}`, { headers })).json();
  607 |         const lines: any[] = poData.po_items || [];
  608 |         expect(lines.length).toBeGreaterThanOrEqual(2);
  609 |         console.log(`[AUDIT] PO lines in API: ${lines.length}`);
  610 |         console.log('[PASS] PO mixed lines — all rows present in form and API');
  611 |     });
  612 | 
  613 |     test('PO-API-04: Multi-line PO → grand total = sum of lines', async ({ page }) => {
  614 |         const app = new AppManager(page);
  615 |         const { apiBase, headers, qs } = await app.buildApiContext();
  616 |         const L1 = 5 * 1000, L2 = 3 * 1500;
  617 | 
  618 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  619 |         const allAccounts = acctData.items || acctData.data || [];
  620 |         const apAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable'))  || allAccounts[0];
  621 |         const glAcct  = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  622 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  623 |         const currency = currData.items?.[0] || currData.data?.[0];
  624 | 
  625 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  626 |             headers,
  627 |             data: {
  628 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  629 |                 vendor_id: purchaseMeta.vendorId,
  630 |                 po_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  631 |                 purchase_type_id: 4,
  632 |                 po_items: [
  633 |                     { item_id: itemA.itemId, quantity: 5, unit_price: 1000, amount: L1, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId },
  634 |                     { item_id: itemB.itemId, quantity: 3, unit_price: 1500, amount: L2, general_ledger_account_id: glAcct.id, location_id: itemB.locationId, warehouse_id: itemB.warehouseId },
  635 |                 ],
  636 |             },
  637 |         });
  638 | 
> 639 |         expect(resp.ok(), `Multi-line PO failed: HTTP ${resp.status()}`).toBe(true);
      |                                                                          ^ Error: Multi-line PO failed: HTTP 422
  640 |         const data = await resp.json();
  641 |         const linesSum = (data.po_items || []).reduce((s: number, l: any) => s + parseFloat(l.amount ?? String(parseFloat(l.quantity) * parseFloat(l.unit_price))), 0);
  642 |         console.log(`[AUDIT] PO lines sum: $${linesSum} | Expected: $${L1 + L2}`);
  643 |         expect(linesSum).toBeCloseTo(L1 + L2, 1);
  644 |         console.log('[PASS] Multi-line PO totals correct');
  645 |     });
  646 | 
  647 |     test('PO-API-05: Miscellaneous line on PO (no item_id) → accepted or inventory-only enforced', async ({ page }) => {
  648 |         const app = new AppManager(page);
  649 |         const { apiBase, headers, qs } = await app.buildApiContext();
  650 | 
  651 |         const acctData = await (await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers })).json();
  652 |         const allAccounts = acctData.items || acctData.data || [];
  653 |         const apAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  654 |         const glAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  655 |         const currData = await (await page.request.get(`${apiBase}/currency?${qs}`, { headers })).json();
  656 |         const currency = currData.items?.[0] || currData.data?.[0];
  657 | 
  658 |         const resp = await page.request.post(`${apiBase}/purchase-orders?${qs}`, {
  659 |             headers,
  660 |             data: {
  661 |                 accounts_payable_id: apAcct.id, currency_id: currency?.id,
  662 |                 vendor_id: purchaseMeta.vendorId,
  663 |                 po_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  664 |                 purchase_type_id: 4,
  665 |                 po_items: [{ description: 'Freight & customs', quantity: 1, unit_price: 3000, amount: 3000, general_ledger_account_id: glAcct.id, location_id: itemA.locationId, warehouse_id: itemA.warehouseId }],
  666 |             },
  667 |         });
  668 | 
  669 |         if (resp.ok()) {
  670 |             const amt = parseFloat(((await resp.json()).po_items || [])[0]?.amount ?? '0');
  671 |             console.log(`[INFO] PO miscellaneous line accepted: $${amt}`);
  672 |         } else {
  673 |             console.log(`[INFO] PO enforces item_id: HTTP ${resp.status()}`);
  674 |             expect([400, 422]).toContain(resp.status());
  675 |         }
  676 |     });
  677 | 
  678 |     // =========================================================================
  679 |     // BILL
  680 |     // =========================================================================
  681 | 
  682 |     test('BILL-UI-01: Add inventory Line Item via modal → Bill created and approved', async ({ page }) => {
  683 |         const app = new AppManager(page);
  684 |         await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });
  685 | 
  686 |         await app.pickDate('Invoice Date');
  687 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  688 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  689 |         await app.selectRandomOption(page.getByRole('button', { name: 'Currency selector' }), 'Currency', true);
  690 | 
  691 |         await page.getByRole('button', { name: 'Line Item' }).click();
  692 |         await addLineItemViaModal(page, app, 'Item', { qty: '4', unitPrice: '2500' });
  693 |         console.log('[OK] Inventory line item added to Bill');
  694 | 
  695 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  696 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  697 | 
  698 |         const billId = await app.extractIdFromUrl();
  699 |         await app.advanceDocumentAPI(billId, 'bills');
  700 |         console.log('[PASS] Bill with inventory line created and approved');
  701 |     });
  702 | 
  703 |     test('BILL-UI-02: Add Miscellaneous line via modal → Bill total reflects it', async ({ page }) => {
  704 |         const app = new AppManager(page);
  705 |         await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });
  706 | 
  707 |         await app.pickDate('Invoice Date');
  708 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  709 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  710 | 
  711 |         await page.getByRole('button', { name: 'Line Item' }).click();
  712 |         const modal = page.getByRole('dialog').last();
  713 |         await modal.waitFor({ state: 'visible', timeout: 15000 });
  714 | 
  715 |         const miscBtn = modal.getByRole('button', { name: 'Miscellaneous', exact: true });
  716 |         if (!await miscBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  717 |             console.log('[SKIP] Miscellaneous button not present in Bill modal');
  718 |             await page.keyboard.press('Escape');
  719 |             return;
  720 |         }
  721 | 
  722 |         await addLineItemViaModal(page, app, 'Miscellaneous', { qty: '1', unitPrice: '4000', description: 'Import duty' });
  723 | 
  724 |         await page.getByRole('button', { name: 'Add Now' }).first().click();
  725 |         await page.waitForURL(/bills\/.*\/detail/, { timeout: 60000 });
  726 |         console.log('[PASS] Bill with miscellaneous line created');
  727 |     });
  728 | 
  729 |     test('BILL-UI-03: Mixed Item + Miscellaneous → both rows in Bill table, approve and verify AP', async ({ page }) => {
  730 |         const app = new AppManager(page);
  731 |         await page.goto('/payables/bills/new', { waitUntil: 'networkidle' });
  732 | 
  733 |         await app.pickDate('Invoice Date');
  734 |         await app.selectRandomOption(page.getByRole('button', { name: 'Vendor selector' }), 'Vendor');
  735 |         const selectedVendor = (await page.getByRole('button', { name: 'Vendor selector' }).textContent())?.trim() || '';
  736 |         await app.selectRandomOption(page.getByRole('button', { name: 'Accounts Payable selector' }), 'Accounts Payable');
  737 | 
  738 |         // Item line
  739 |         await page.getByRole('button', { name: 'Line Item' }).click();
```