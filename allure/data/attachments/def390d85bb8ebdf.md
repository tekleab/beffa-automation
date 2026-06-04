# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-logic.spec.ts >> Inventory Logic & Transfer Audits @inventory @logic @regression @full >> Audit: Warehouse Transfer must maintain stock balance across locations
- Location: tests/inventory/inv-logic.spec.ts:15:9

# Error details

```
Error: [TRANSFER] IN adjustment failed: 422 - {
	"code": 422,
	"details": {
		"location_id": [
			"Item doesn't exist in given location."
		]
	},
	"message": "Validation error when creating inventory adjustment"
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
  578 |       credit: entry.credit?.toString() || '0'
  579 |     }));
  580 |   }
  581 | 
  582 |   // --- Missing Methods / Aliases for Compatibility ---
  583 |   async adjustStockAPI(data: any) { return this.createInventoryAdjustmentAPI(data); }
  584 |   async createEmployeeRequestAPI(data: any) { console.warn('Stub: createEmployeeRequestAPI'); return { id: 'stub' }; }
  585 |   async submitEmployeeRequestAPI(id: string) { console.warn('Stub: submitEmployeeRequestAPI'); }
  586 |   async consolidateRequestsAPI(ids: string[]) { console.warn('Stub: consolidateRequestsAPI'); return { id: 'stub' }; }
  587 |   async approveDepartmentRequestAPI(id: string) { console.warn('Stub: approveDepartmentRequestAPI'); }
  588 |   async reviewPropertyRequestAPI(id: string) { console.warn('Stub: reviewPropertyRequestAPI'); }
  589 |   async issueStoreRequestAPI(id: string) { console.warn('Stub: issueStoreRequestAPI'); }
  590 |   async executeTransferAPI(data: {
  591 |     itemId: string;
  592 |     quantity: number;
  593 |     fromLocationId: string;
  594 |     fromWarehouseId: string;
  595 |     toLocationId?: string;   // auto-discovered if omitted
  596 |     toWarehouseId?: string;
  597 |   }): Promise<{ outRef: string; inRef: string; fromLocationId: string; toLocationId: string }> {
  598 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  599 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  600 |     const token = await this._getAuthToken();
  601 |     const year     = process.env.BEFFA_YEAR     || '2018';
  602 |     const period   = process.env.BEFFA_PERIOD   || 'yearly';
  603 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  604 |     const params   = `year=${year}&period=${period}&calendar=${calendar}`;
  605 |     const headers  = {
  606 |       'x-company': process.env.BEFFA_COMPANY as string,
  607 |       'Authorization': `Bearer ${token}`,
  608 |       'Content-Type': 'application/json',
  609 |       'x-role': 'IT Administrator / User Manager'
  610 |     };
  611 | 
  612 |     // 1. Discover adjustment account
  613 |     let adjAccountId: string | undefined;
  614 |     const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  615 |     if (acctResp.ok()) {
  616 |       const acctData = await acctResp.json();
  617 |       const accounts = acctData.items || acctData.data || [];
  618 |       adjAccountId = accounts.find((a: any) => a.account_type?.toLowerCase().includes('expense'))?.id || accounts[0]?.id;
  619 |     }
  620 | 
  621 |     // 2. Discover destination location (different from source)
  622 |     let toLocationId  = data.toLocationId;
  623 |     let toWarehouseId = data.toWarehouseId;
  624 |     if (!toLocationId) {
  625 |       const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=20&${params}`, { headers });
  626 |       if (locResp.ok()) {
  627 |         const locData = await locResp.json();
  628 |         const locs = locData.items || locData.data || [];
  629 |         const dest = locs.find((l: any) => l.id !== data.fromLocationId);
  630 |         if (!dest) throw new Error('[TRANSFER] Could not find a second location for destination. Only one location exists.');
  631 |         toLocationId  = dest.id;
  632 |         toWarehouseId = dest.warehouse_id || dest.warehouse?.id;
  633 |       }
  634 |     }
  635 |     if (!toLocationId) throw new Error('[TRANSFER] No destination location resolved.');
  636 | 
  637 |     console.log(`[TRANSFER] OUT: ${data.fromLocationId} → IN: ${toLocationId} | Qty: ${data.quantity}`);
  638 | 
  639 |     const basePayload = {
  640 |       adjusted_by: 'quantity',
  641 |       adjusted_cost: 0,
  642 |       adjustment_account_id: adjAccountId,
  643 |       inventory_item_id: data.itemId,
  644 |       date: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
  645 |       note: '',
  646 |       reason: 'Automated E2E Warehouse Transfer',
  647 |       skip_draft: false,
  648 |       status: 'draft'
  649 |     };
  650 | 
  651 |     // 3. OUT adjustment at source (write-down / negative)
  652 |     const outPayload = {
  653 |       ...basePayload,
  654 |       adjusted_quantity: -data.quantity,
  655 |       is_write_down: 'true',
  656 |       location_id: data.fromLocationId,
  657 |       warehouse_id: data.fromWarehouseId,
  658 |       current_quantity: 0,
  659 |       location_quantity: 0
  660 |     };
  661 |     const outResp = await this.safePost(`${apiBase}/inventory-adjustments?${params}`, { data: outPayload, headers, label: 'Transfer OUT' });
  662 |     if (!outResp.ok()) throw new Error(`[TRANSFER] OUT adjustment failed: ${outResp.status()} - ${await outResp.text()}`);
  663 |     const outJson = await outResp.json();
  664 |     console.log(`[TRANSFER] OUT created: ${outJson.ref} (ID: ${outJson.id})`);
  665 |     await this.advanceDocumentAPI(outJson.id, 'inventory-adjustments');
  666 | 
  667 |     // 4. IN adjustment at destination (add stock)
  668 |     const inPayload = {
  669 |       ...basePayload,
  670 |       adjusted_quantity: data.quantity,
  671 |       is_write_down: 'false',
  672 |       location_id: toLocationId,
  673 |       warehouse_id: toWarehouseId,
  674 |       current_quantity: 0,
  675 |       location_quantity: 0
  676 |     };
  677 |     const inResp = await this.safePost(`${apiBase}/inventory-adjustments?${params}`, { data: inPayload, headers, label: 'Transfer IN' });
> 678 |     if (!inResp.ok()) throw new Error(`[TRANSFER] IN adjustment failed: ${inResp.status()} - ${await inResp.text()}`);
      |                             ^ Error: [TRANSFER] IN adjustment failed: 422 - {
  679 |     const inJson = await inResp.json();
  680 |     console.log(`[TRANSFER] IN created: ${inJson.ref} (ID: ${inJson.id})`);
  681 |     await this.advanceDocumentAPI(inJson.id, 'inventory-adjustments');
  682 | 
  683 |     return {
  684 |       outRef: outJson.ref,
  685 |       inRef:  inJson.ref,
  686 |       fromLocationId: data.fromLocationId,
  687 |       toLocationId:   toLocationId!
  688 |     };
  689 |   }
  690 | }
  691 | 
```