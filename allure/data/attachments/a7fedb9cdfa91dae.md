# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inventory-logic-audits.spec.ts >> Inventory Logic & Transfer Audits @inventory @logic @regression @full >> Audit: Warehouse Transfer must maintain stock balance across locations
- Location: tests/inventory/inventory-logic-audits.spec.ts:15:9

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
        - img "sample" [ref=e10]: s
        - generic [ref=e11]:
          - button "sample" [ref=e12] [cursor=pointer]:
            - generic: sample
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
          - img "sample" [ref=e62]: s
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
  496 |     }));
  497 |   }
  498 | 
  499 |   // --- Missing Methods / Aliases for Compatibility ---
  500 |   async adjustStockAPI(data: any) { return this.createInventoryAdjustmentAPI(data); }
  501 |   async createEmployeeRequestAPI(data: any) { console.warn('Stub: createEmployeeRequestAPI'); return { id: 'stub' }; }
  502 |   async submitEmployeeRequestAPI(id: string) { console.warn('Stub: submitEmployeeRequestAPI'); }
  503 |   async consolidateRequestsAPI(ids: string[]) { console.warn('Stub: consolidateRequestsAPI'); return { id: 'stub' }; }
  504 |   async approveDepartmentRequestAPI(id: string) { console.warn('Stub: approveDepartmentRequestAPI'); }
  505 |   async reviewPropertyRequestAPI(id: string) { console.warn('Stub: reviewPropertyRequestAPI'); }
  506 |   async issueStoreRequestAPI(id: string) { console.warn('Stub: issueStoreRequestAPI'); }
  507 |   async executeTransferAPI(data: {
  508 |     itemId: string;
  509 |     quantity: number;
  510 |     fromLocationId: string;
  511 |     fromWarehouseId: string;
  512 |     toLocationId?: string;   // auto-discovered if omitted
  513 |     toWarehouseId?: string;
  514 |   }): Promise<{ outRef: string; inRef: string; fromLocationId: string; toLocationId: string }> {
  515 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
  516 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  517 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  518 |     const token = await this._getAuthToken();
  519 |     const year     = process.env.BEFFA_YEAR     || '2018';
  520 |     const period   = process.env.BEFFA_PERIOD   || 'yearly';
  521 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  522 |     const params   = `year=${year}&period=${period}&calendar=${calendar}`;
  523 |     const headers  = {
  524 |       'x-company': process.env.BEFFA_COMPANY as string,
  525 |       'Authorization': `Bearer ${token}`,
  526 |       'Content-Type': 'application/json',
  527 |       'x-role': 'IT Administrator / User Manager'
  528 |     };
  529 | 
  530 |     // 1. Discover adjustment account
  531 |     let adjAccountId: string | undefined;
  532 |     const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  533 |     if (acctResp.ok()) {
  534 |       const acctData = await acctResp.json();
  535 |       const accounts = acctData.items || acctData.data || [];
  536 |       adjAccountId = accounts.find((a: any) => a.account_type?.toLowerCase().includes('expense'))?.id || accounts[0]?.id;
  537 |     }
  538 | 
  539 |     // 2. Discover destination location (different from source)
  540 |     let toLocationId  = data.toLocationId;
  541 |     let toWarehouseId = data.toWarehouseId;
  542 |     if (!toLocationId) {
  543 |       const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=20&${params}`, { headers });
  544 |       if (locResp.ok()) {
  545 |         const locData = await locResp.json();
  546 |         const locs = locData.items || locData.data || [];
  547 |         const dest = locs.find((l: any) => l.id !== data.fromLocationId);
  548 |         if (!dest) throw new Error('[TRANSFER] Could not find a second location for destination. Only one location exists.');
  549 |         toLocationId  = dest.id;
  550 |         toWarehouseId = dest.warehouse_id || dest.warehouse?.id;
  551 |       }
  552 |     }
  553 |     if (!toLocationId) throw new Error('[TRANSFER] No destination location resolved.');
  554 | 
  555 |     console.log(`[TRANSFER] OUT: ${data.fromLocationId} → IN: ${toLocationId} | Qty: ${data.quantity}`);
  556 | 
  557 |     const basePayload = {
  558 |       adjusted_by: 'quantity',
  559 |       adjusted_cost: 0,
  560 |       adjustment_account_id: adjAccountId,
  561 |       inventory_item_id: data.itemId,
  562 |       date: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
  563 |       note: '',
  564 |       reason: 'Automated E2E Warehouse Transfer',
  565 |       skip_draft: false,
  566 |       status: 'draft'
  567 |     };
  568 | 
  569 |     // 3. OUT adjustment at source (write-down / negative)
  570 |     const outPayload = {
  571 |       ...basePayload,
  572 |       adjusted_quantity: -data.quantity,
  573 |       is_write_down: 'true',
  574 |       location_id: data.fromLocationId,
  575 |       warehouse_id: data.fromWarehouseId,
  576 |       current_quantity: 0,
  577 |       location_quantity: 0
  578 |     };
  579 |     const outResp = await this.safePost(`${apiBase}/inventory-adjustments?${params}`, { data: outPayload, headers, label: 'Transfer OUT' });
  580 |     if (!outResp.ok()) throw new Error(`[TRANSFER] OUT adjustment failed: ${outResp.status()} - ${await outResp.text()}`);
  581 |     const outJson = await outResp.json();
  582 |     console.log(`[TRANSFER] OUT created: ${outJson.ref} (ID: ${outJson.id})`);
  583 |     await this.advanceDocumentAPI(outJson.id, 'inventory-adjustments');
  584 | 
  585 |     // 4. IN adjustment at destination (add stock)
  586 |     const inPayload = {
  587 |       ...basePayload,
  588 |       adjusted_quantity: data.quantity,
  589 |       is_write_down: 'false',
  590 |       location_id: toLocationId,
  591 |       warehouse_id: toWarehouseId,
  592 |       current_quantity: 0,
  593 |       location_quantity: 0
  594 |     };
  595 |     const inResp = await this.safePost(`${apiBase}/inventory-adjustments?${params}`, { data: inPayload, headers, label: 'Transfer IN' });
> 596 |     if (!inResp.ok()) throw new Error(`[TRANSFER] IN adjustment failed: ${inResp.status()} - ${await inResp.text()}`);
      |                             ^ Error: [TRANSFER] IN adjustment failed: 422 - {
  597 |     const inJson = await inResp.json();
  598 |     console.log(`[TRANSFER] IN created: ${inJson.ref} (ID: ${inJson.id})`);
  599 |     await this.advanceDocumentAPI(inJson.id, 'inventory-adjustments');
  600 | 
  601 |     return {
  602 |       outRef: outJson.ref,
  603 |       inRef:  inJson.ref,
  604 |       fromLocationId: data.fromLocationId,
  605 |       toLocationId:   toLocationId!
  606 |     };
  607 |   }
  608 | }
  609 | 
```