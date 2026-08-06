# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-customer-balance-ui.spec.ts >> Sales Customer Balance UI Audits @sales @smoke @full >> UI Audit: Customer profile shows zero balance after full payment
- Location: tests/sales/sales-customer-balance-ui.spec.ts:73:9

# Error details

```
Error: [FRESH ITEM] Stock adjustment failed for 7b0d29f1-f392-46f1-a2c7-2e7719a57b6f: {
	"code": 400,
	"message": "Unable to create Inventory Adjustment."
}

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
  681 |     // Create item with initial_stock=0 — ERP does not reliably link initial_stock to location.
  682 |     // Stock is always injected via an approved adjustment to guarantee location linkage.
  683 |     const item = await this.createInventoryItemAPI({
  684 |       name,
  685 |       item_id: `ITM-${opts.cost_method_code}-${ts.toString().slice(-9)}`,
  686 |       part_number: `PN-${ts.toString().slice(-7)}`,
  687 |       cost_method_code: opts.cost_method_code,
  688 |       quantity: 0,
  689 |       unit_cost: opts.unit_cost,
  690 |       default_location_id: locationId,
  691 |       default_warehouse_id: warehouseId,
  692 |     });
  693 | 
  694 |     // Inject stock via approved adjustment — this is the only reliable way to link
  695 |     // stock to a specific location_id so invoices/SOs can consume it.
  696 |     const adj = await this.createInventoryAdjustmentAPI({
  697 |       itemId: item.id,
  698 |       quantity: opts.quantity,
  699 |       cost: opts.unit_cost,
  700 |       locationId,
  701 |       warehouseId,
  702 |       adjusted_by: 'quantity',
  703 |     });
> 704 |     if (!adj.success || !adj.id) throw new Error(`[FRESH ITEM] Stock adjustment failed for ${item.id}: ${adj.error}`);
      |                                        ^ Error: [FRESH ITEM] Stock adjustment failed for 7b0d29f1-f392-46f1-a2c7-2e7719a57b6f: {
  705 |     await this.advanceDocumentAPI(adj.id, 'inventory-adjustments');
  706 | 
  707 |     console.log(`[FRESH ITEM] Created: ${name} (${item.id}) | method=${opts.cost_method_code} | stock=${opts.quantity}@$${opts.unit_cost} | loc=${locationId}`);
  708 |     return {
  709 |       id: item.id,
  710 |       itemId: item.id,
  711 |       itemName: name,
  712 |       currentStock: opts.quantity,
  713 |       unitCost: opts.unit_cost,
  714 |       locationId: locationId!,
  715 |       warehouseId: warehouseId!
  716 |     };
  717 |   }
  718 | 
  719 |   // --- Missing Methods / Aliases for Compatibility ---
  720 |   async adjustStockAPI(data: any) { return this.createInventoryAdjustmentAPI(data); }
  721 |   async createEmployeeRequestAPI(data: any) { console.warn('Stub: createEmployeeRequestAPI'); return { id: 'stub' }; }
  722 |   async submitEmployeeRequestAPI(id: string) { console.warn('Stub: submitEmployeeRequestAPI'); }
  723 |   async consolidateRequestsAPI(ids: string[]) { console.warn('Stub: consolidateRequestsAPI'); return { id: 'stub' }; }
  724 |   async approveDepartmentRequestAPI(id: string) { console.warn('Stub: approveDepartmentRequestAPI'); }
  725 |   async reviewPropertyRequestAPI(id: string) { console.warn('Stub: reviewPropertyRequestAPI'); }
  726 |   async issueStoreRequestAPI(id: string) { console.warn('Stub: issueStoreRequestAPI'); }
  727 | 
  728 |   async createMoveOrderAPI(data: {
  729 |     itemId: string;
  730 |     quantity: number;
  731 |     fromLocationId: string;
  732 |     fromWarehouseId: string;
  733 |     toLocationId: string;
  734 |     toWarehouseId: string;
  735 |   }): Promise<{ id: string; ref?: string; status: string; fromLocationId: string; toLocationId: string }> {
  736 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  737 |     if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  738 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  739 |     const token = await this._getAuthToken();
  740 |     const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  741 |     const headers = {
  742 |       'x-company': process.env.BEFFA_COMPANY as string,
  743 |       'Authorization': `Bearer ${token}`,
  744 |       'Content-Type': 'application/json',
  745 |       'x-role': 'IT Administrator / User Manager'
  746 |     };
  747 | 
  748 |     const createResp = await this.safePost(`${apiBase}/move-orders?${params}`, {
  749 |       data: {
  750 |         inventory_item_id: data.itemId,
  751 |         quantity: data.quantity,
  752 |         from_warehouse_id: data.fromWarehouseId,
  753 |         from_location_id: data.fromLocationId,
  754 |         destination_warehouse_id: data.toWarehouseId,
  755 |         destination_location_id: data.toLocationId
  756 |       },
  757 |       headers,
  758 |       label: 'Create Move Order'
  759 |     });
  760 |     if (!createResp.ok()) throw new Error(`[MOVE ORDER] Create failed: ${createResp.status()} - ${await createResp.text()}`);
  761 |     const order = await createResp.json();
  762 |     console.log(`[MOVE ORDER] Created: ${order.id} (status: ${order.status})`);
  763 | 
  764 |     await this.advanceDocumentAPI(order.id, 'move-orders');
  765 |     return { id: order.id, ref: order.ref, status: 'approved', fromLocationId: data.fromLocationId, toLocationId: data.toLocationId };
  766 |   }
  767 | 
  768 |   async ensureTransferDestinationAPI(fromLocationId: string, itemId?: string): Promise<{ locationId: string; warehouseId: string }> {
  769 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  770 |     if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  771 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  772 |     const token = await this._getAuthToken();
  773 |     const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  774 |     const headers = {
  775 |       'x-company': process.env.BEFFA_COMPANY as string,
  776 |       'Authorization': `Bearer ${token}`,
  777 |       'Content-Type': 'application/json',
  778 |       'x-role': 'IT Administrator / User Manager'
  779 |     };
  780 | 
  781 |     // Priority 1: another location the item is already registered at
  782 |     if (itemId) {
  783 |       const itemResp = await this.safeGet(`${apiBase}/inventory-item/${itemId}?${params}`, { headers });
  784 |       if (itemResp.ok()) {
  785 |         const itemData = await itemResp.json();
  786 |         const otherLoc = (itemData.inventory_item_locations || [])
  787 |           .find((l: any) => l.location_id !== fromLocationId && (l.warehouse_id || l.warehouse?.id));
  788 |         if (otherLoc) {
  789 |           console.log(`[DEST] Using existing item location: ${otherLoc.location_id}`);
  790 |           return { locationId: otherLoc.location_id, warehouseId: otherLoc.warehouse_id || otherLoc.warehouse?.id };
  791 |         }
  792 |       }
  793 |     }
  794 | 
  795 |     // Priority 2: any other system location
  796 |     const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=100&${params}`, { headers });
  797 |     if (locResp.ok()) {
  798 |       const locData = await locResp.json();
  799 |       const allLocs = locData.items || locData.data || [];
  800 |       const dest = allLocs.find((l: any) => l.id !== fromLocationId && (l.warehouse_id || l.warehouse?.id));
  801 |       if (dest) {
  802 |         console.log(`[DEST] Using system location: ${dest.id}`);
  803 |         return { locationId: dest.id, warehouseId: dest.warehouse_id || dest.warehouse?.id };
  804 |       }
```