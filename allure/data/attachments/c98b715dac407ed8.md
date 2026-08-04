# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-ui.spec.ts >> Purchase to Bill Flow @purchase @smoke @full >> Create PO via API, approve, create linked bill, verify in vendor profile
- Location: tests/purchase/bill-ui.spec.ts:6:9

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForTimeout: Test timeout of 60000ms exceeded.
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
  488 |       bestLoc?.warehouse?.id ||
  489 |       target.default_warehouse_id ||
  490 |       '';
  491 | 
  492 |     if (!resolvedWarehouseId) {
  493 |       // Last resort: fetch from /locations API
  494 |       const locId = bestLoc?.location_id;
  495 |       if (locId) {
  496 |         let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  497 |         if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  498 |         if (!apiBase.endsWith('/api')) apiBase += '/api';
  499 |         const token = await this._getAuthToken();
  500 |         const y = process.env.BEFFA_YEAR || '2018', p = process.env.BEFFA_PERIOD || 'yearly', c = process.env.BEFFA_CALENDAR || 'ec';
  501 |         const locResp = await this.safeGet(`${apiBase}/location/${locId}?year=${y}&period=${p}&calendar=${c}`, {
  502 |           headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  503 |         });
  504 |         if (locResp.ok()) {
  505 |           const locJson = await locResp.json();
  506 |           const wid = locJson.warehouse_id || locJson.warehouse?.id || '';
  507 |           return { itemName: target.name, itemId: target.id, currentStock: stock, unitCost: target.unit_cost || 0, locationId: locId, warehouseId: wid };
  508 |         }
  509 |       }
  510 |     }
  511 | 
  512 |     return {
  513 |       itemName: target.name,
  514 |       itemId: target.id,
  515 |       currentStock: stock,
  516 |       unitCost: target.unit_cost || 0,
  517 |       locationId: bestLoc?.location_id,
  518 |       warehouseId: resolvedWarehouseId
  519 |     };
  520 |   }
  521 | 
  522 |   async getItemDetailsAPI(itemId: string, locationId?: string): Promise<{ itemName: string; itemId: string; currentStock: number; unitCost: number } | null> {
  523 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  524 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  525 |     const token = await this._getAuthToken();
  526 |     const year = process.env.BEFFA_YEAR || '2018';
  527 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  528 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  529 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  530 | 
  531 |     const safeJson = async (resp: any): Promise<any | null> => {
  532 |       const text = await resp.text();
  533 |       if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) return null;
  534 |       try { return JSON.parse(text); } catch { return null; }
  535 |     };
  536 | 
  537 |     let response = await this.safeGet(`${apiBase}/inventory-item/${itemId}?${params}`, {
  538 |       headers: { 
  539 |         'x-company': process.env.BEFFA_COMPANY as string, 
  540 |         'Authorization': `Bearer ${token}`,
  541 |         'x-role': 'IT Administrator / User Manager'
  542 |       }
  543 |     });
  544 | 
  545 |     const json = await safeJson(response);
  546 | 
  547 |     if (!json) {
  548 |       console.log(`[INFO] Direct Item API for ${itemId} failed. Trying search...`);
  549 |       const searchResp = await this.safeGet(`${apiBase}/inventory-item?search=${itemId}&${params}`, {
  550 |         headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  551 |       });
  552 |       const searchJson = await safeJson(searchResp);
  553 |       if (!searchJson) return null;
  554 |       const item = searchJson.items?.[0] || searchJson.data?.[0];
  555 |       if (!item) return null;
  556 |       
  557 |       let stock = (item.inventory_item_locations || []).reduce((sum: number, loc: any) => sum + (loc.quantity || 0), 0);
  558 |       if (locationId) {
  559 |           const loc = (item.inventory_item_locations || []).find((l: any) => l.location_id === locationId);
  560 |           stock = loc?.quantity || 0;
  561 |       }
  562 |       return { itemName: item.name, itemId: item.id, currentStock: stock, unitCost: item.unit_cost || 0 };
  563 |     }
  564 | 
  565 |     let stock = (json.inventory_item_locations || []).reduce((sum: number, loc: any) => sum + (loc.quantity || 0), 0);
  566 |     if (locationId) {
  567 |         const loc = (json.inventory_item_locations || []).find((l: any) => l.location_id === locationId);
  568 |         stock = loc?.quantity || 0;
  569 |     }
  570 | 
  571 |     return {
  572 |       itemName: json.name,
  573 |       itemId: json.id,
  574 |       currentStock: stock,
  575 |       unitCost: json.unit_cost || 0
  576 |     };
  577 |   }
  578 | 
  579 |   async pollStockAPI(itemId: string, expectedStock: number, locationId?: string, maxRetries: number = 30): Promise<number> {
  580 |     console.log(`[ACTION] API Polling: Waiting for stock at location ${locationId || 'GLOBAL'} to hit ${expectedStock}...`);
  581 |     for (let i = 1; i <= maxRetries; i++) {
  582 |       const details = await this.getItemDetailsAPI(itemId, locationId);
  583 |       if (details && details.currentStock === expectedStock) {
  584 |         console.log(`[SUCCESS] API Confirmed: Stock correctly reached ${expectedStock}.`);
  585 |         return details.currentStock;
  586 |       }
  587 |       console.log(`[INFO] Attempt ${i}: Stock is ${details?.currentStock || 0}. Retrying in 2s...`);
> 588 |       await this.page.waitForTimeout(2000);
      |                       ^ Error: page.waitForTimeout: Test timeout of 60000ms exceeded.
  589 |     }
  590 |     return 0;
  591 |   }
  592 | 
  593 |   async pollCostAPI(itemId: string, expectedCost: number, locationId?: string, maxRetries: number = 30, precision: number = 1): Promise<number> {
  594 |     const tolerance = Math.pow(10, -precision) * 5;
  595 |     console.log(`[ACTION] API Polling: Waiting for cost to hit ~${expectedCost} (±${tolerance})...`);
  596 |     for (let i = 1; i <= maxRetries; i++) {
  597 |       const details = await this.getItemDetailsAPI(itemId, locationId);
  598 |       if (details && Math.abs(details.unitCost - expectedCost) <= tolerance) {
  599 |         console.log(`[SUCCESS] API Confirmed: Cost correctly reached ${details.unitCost}.`);
  600 |         return details.unitCost;
  601 |       }
  602 |       console.log(`[INFO] Attempt ${i}: Cost is ${details?.unitCost || 0}. Retrying in 2s...`);
  603 |       await this.page.waitForTimeout(2000);
  604 |     }
  605 |     const final = await this.getItemDetailsAPI(itemId, locationId);
  606 |     return final?.unitCost ?? 0;
  607 |   }
  608 | 
  609 |   async getJournalEntriesAPI(receiptId: string): Promise<Array<{ accountCode: string; accountName: string; accountType: string; debit: string; credit: string }>> {
  610 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  611 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  612 |     const token = await this._getAuthToken();
  613 |     const year = process.env.BEFFA_YEAR || '2018';
  614 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  615 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  616 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  617 | 
  618 |     // Try singular invoice endpoint first
  619 |     let response = await this.safeGet(`${apiBase}/invoice/${receiptId}?${params}`, {
  620 |       headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  621 |     });
  622 | 
  623 |     if (!response.ok() && response.status() === 404) {
  624 |       // fallback to plural invoices and generic receipt endpoint if needed
  625 |       response = await this.safeGet(`${apiBase}/invoices/${receiptId}?${params}`, {
  626 |         headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  627 |       });
  628 |       if (!response.ok() && response.status() === 404) {
  629 |         response = await this.safeGet(`${apiBase}/receipts/${receiptId}?${params}`, {
  630 |           headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
  631 |         });
  632 |       }
  633 |     }
  634 | 
  635 |     if (!response.ok()) {
  636 |       console.warn(`[WARN] Journal fetch failed: ${response.status()}`);
  637 |       return [];
  638 |     }
  639 | 
  640 |     const json = await response.json();
  641 |     const invoiceData = json.data ? (Array.isArray(json.data) ? json.data[0] : json.data) : json;
  642 |     
  643 |     const journal = invoiceData.sales_journal || invoiceData.cash_disbursement_journal || invoiceData.cash_receipt_journal;
  644 |     if (!journal || !journal.journal_entries) {
  645 |       console.warn('[WARN] No journal entries found in response');
  646 |       return [];
  647 |     }
  648 |     return journal.journal_entries.map((entry: any) => ({
  649 |       accountCode: entry.account?.account_id || entry.account_id || '',
  650 |       accountName: entry.account?.name || entry.account?.account_name || entry.account?.account_id || '',
  651 |       accountType: entry.account?.type?.name || entry.account?.type?.type || entry.account?.account_type || '',
  652 |       debit: entry.debit?.toString() || '0',
  653 |       credit: entry.credit?.toString() || '0'
  654 |     }));
  655 |   }
  656 | 
  657 |   /**
  658 |    * Creates a fresh inventory item with the specified costing method and injects
  659 |    * initial stock via an approved adjustment. Tests own this item from line 1 —
  660 |    * no seeded-data pollution.
  661 |    */
  662 |   async createFreshItemWithStockAPI(opts: {
  663 |     name?: string;
  664 |     cost_method_code: 'FIFO' | 'WAC' | 'AVERAGE';
  665 |     quantity: number;
  666 |     unit_cost: number;
  667 |     locationId?: string;
  668 |     warehouseId?: string;
  669 |   }): Promise<{ id: string; itemId: string; itemName: string; currentStock: number; unitCost: number; locationId: string; warehouseId: string }> {
  670 |     let locationId = opts.locationId;
  671 |     let warehouseId = opts.warehouseId;
  672 |     if (!locationId || !warehouseId) {
  673 |       const meta = await this.discoverMetadataAPI();
  674 |       locationId = locationId || meta.locationId;
  675 |       warehouseId = warehouseId || meta.warehouseId;
  676 |     }
  677 | 
  678 |     const ts = Date.now();
  679 |     const name = opts.name || `${opts.cost_method_code}-Item-${ts}`;
  680 | 
  681 |     // Use initial_stock + quantity on item creation — creates an import FIFO layer
  682 |     // immediately without a separate adjustment (avoids approval-limit 403 errors)
  683 |     const item = await this.createInventoryItemAPI({
  684 |       name,
  685 |       item_id: `ITM-${opts.cost_method_code}-${ts.toString().slice(-9)}`,
  686 |       part_number: `PN-${ts.toString().slice(-7)}`,
  687 |       cost_method_code: opts.cost_method_code,
  688 |       quantity: opts.quantity,
```