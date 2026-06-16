# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/procurement-accounting-logic.spec.ts >> Purchase: Procurement Accounting Logic @purchase @smoke @full >> API: Approved bill must post a debit to Accounts Payable
- Location: tests/purchase/procurement-accounting-logic.spec.ts:13:9

# Error details

```
Error: Bill API Creation Failed: 500 - {
	"code": 500,
	"message": "Error creating bill"
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
  210 | 
  211 |     const response = await this.safePost(`${apiBase}/purchase-orders?year=${year}&period=${period}&calendar=${calendar}`, {
  212 |       data: payload,
  213 |       headers,
  214 |       label: 'Create Purchase Order'
  215 |     });
  216 | 
  217 |     if (!response.ok()) throw new Error(`PO API Creation Failed: ${response.status()} - ${await response.text()}`);
  218 |     const json = await response.json();
  219 |     return { success: true, poNumber: json.po_number, poId: json.id };
  220 |   }
  221 | 
  222 |   async createBillAPI(params: { itemData?: Record<string, any>; itemId?: string; quantity?: number; qty?: number; unitPrice?: number; vendorId?: string | null; apAccountId?: string | null; glAccountId?: string | null; discount_amount?: number; description?: string; poId?: string } = {}): Promise<{ success: boolean; ref: string; id: string; error?: string }> {
  223 |     const { itemData = {}, itemId = null, quantity = 10, qty = 10, unitPrice = 5000, vendorId = null, apAccountId = null, glAccountId = undefined, discount_amount = 0, description = null, poId = null } = params;
  224 |     const finalQty = quantity || qty;
  225 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  226 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  227 |     const token = await this._getAuthToken();
  228 |     const company = process.env.BEFFA_COMPANY as string;
  229 |     const year = process.env.BEFFA_YEAR || '2018';
  230 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  231 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  232 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  233 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  234 | 
  235 |     const safeJson = async (resp: any, label: string) => {
  236 |       const text = await resp.text();
  237 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  238 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  239 |     };
  240 | 
  241 |     // 1. Discover Vendor - always use company-scoped discovery (never trust hardcoded UUIDs)
  242 |     let resolvedVendorId = vendorId;
  243 |     if (!resolvedVendorId) {
  244 |       // Use same pattern as createPurchaseOrderAPI which works reliably
  245 |       const vendorResp = await this.safeGet(`${apiBase}/vendors?page=1&pageSize=10`, { headers });
  246 |       const vendorData = await safeJson(vendorResp, 'Vendor Discovery');
  247 |       const vendor = vendorData.items?.[0] || vendorData.data?.[0];
  248 |       if (!vendor) throw new Error('Bill Discovery Failed: No vendors found in current company.');
  249 |       resolvedVendorId = vendor.id;
  250 |     }
  251 | 
  252 |     // 2. Discover Accounts (AP + GL)
  253 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
  254 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  255 |     const allAccounts = acctData.items || acctData.data || [];
  256 | 
  257 |     // Improved strict AP discovery
  258 |     const discoveredAp =
  259 |       allAccounts.find((a: any) => a.name?.toLowerCase().includes('accounts payable')) ||
  260 |       allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) ||
  261 |       allAccounts[0];
  262 | 
  263 |     const resolvedGlAccount = glAccountId !== undefined ? { id: glAccountId } : (allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0]);
  264 | 
  265 |     // 3. Discover Currency
  266 |     const currResp = await this.safeGet(`${apiBase}/currency?${qs}`, { headers });
  267 |     const currData = await safeJson(currResp, 'Currency Discovery');
  268 |     const currency = currData.items?.[0] || currData.data?.[0];
  269 | 
  270 |     // 4. Discover Locations if missing
  271 |     let locationId = itemData.locationId;
  272 |     let warehouseId = itemData.warehouseId;
  273 |     if (!locationId || !warehouseId) {
  274 |       const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=10&${qs}`, { headers }, 10000);
  275 |       const locData = await safeJson(locResp, 'Location Discovery');
  276 |       const firstLoc = (locData.items || locData.data || [])[0];
  277 |       if (firstLoc) {
  278 |         locationId = firstLoc.id;
  279 |         warehouseId = firstLoc.warehouse_id || firstLoc.warehouse?.id;
  280 |       }
  281 |     }
  282 | 
  283 |     const payload = {
  284 |       accounts_payable_id: apAccountId || discoveredAp?.id,
  285 |       currency_id: currency?.id,
  286 |       invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  287 |       due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  288 |       items: [{
  289 |         item_id: itemData.itemId || itemData.id,
  290 |         general_ledger_account_id: resolvedGlAccount?.id || null,
  291 |         location_id: locationId,
  292 |         quantity: finalQty,
  293 |         tax_id: itemData.taxId || null,
  294 |         unit_price: unitPrice,
  295 |         warehouse_id: warehouseId,
  296 |         description: description || `Audit Bill of ${itemData.itemName || itemData.name}`,
  297 |         amount: finalQty * unitPrice,
  298 |         discount_amount: discount_amount
  299 |       }],
  300 |       vendor_id: resolvedVendorId,
  301 |       status: 'draft'
  302 |     };
  303 | 
  304 |     const response = await this.safePost(`${apiBase}/bills?${qs}`, {
  305 |       data: payload,
  306 |       headers,
  307 |       label: 'Create Bill'
  308 |     });
  309 | 
> 310 |     if (!response.ok()) throw new Error(`Bill API Creation Failed: ${response.status()} - ${await response.text()}`);
      |                               ^ Error: Bill API Creation Failed: 500 - {
  311 |     const json = await response.json();
  312 |     return { success: true, ref: json.invoice_number, id: json.id };
  313 |   }
  314 |   async createBillFromPoAPI(poId: string): Promise<{ success: boolean; billNumber: string; billId: string }> {
  315 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  316 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  317 |     const token = await this._getAuthToken();
  318 |     const company = process.env.BEFFA_COMPANY as string;
  319 |     const year = process.env.BEFFA_YEAR || '2018';
  320 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  321 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  322 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  323 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  324 | 
  325 |     const safeJson = async (resp: any, label: string) => {
  326 |       const text = await resp.text();
  327 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  328 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  329 |     };
  330 | 
  331 |     // 1. Fetch the Purchase Order to gather its precise mapping metadata
  332 |     const poResp = await this.safeGet(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
  333 |     const poData = await safeJson(poResp, `Fetch PO ${poId}`);
  334 | 
  335 |     // 2. Discover Accounts Payable ID for validation overlay
  336 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  337 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  338 |     const allAccounts = acctData.items || acctData.data || [];
  339 |     const apAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  340 | 
  341 |     // 3. Map strictly into `received_purchase_order_items`
  342 |     const receivedItems = (poData.po_items || []).map((item: any) => ({
  343 |       po_item_id: item.id,
  344 |       received_quantity: item.quantity,
  345 |       received_unit_price: item.unit_price
  346 |     }));
  347 | 
  348 |     if (receivedItems.length === 0) throw new Error(`PO ${poId} lacks interactable line-items.`);
  349 | 
  350 |     const payload = {
  351 |       accounts_payable_id: apAccount?.id,
  352 |       currency_id: poData.currency_id || poData.currency?.id,
  353 |       due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  354 |       invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  355 |       items: [], // MUST be completely empty for a linked PO bill
  356 |       purchase_order_id: poId,
  357 |       vendor_id: poData.vendor_id || poData.vendor?.id,
  358 |       received_purchase_order_items: receivedItems,
  359 |       status: 'draft'
  360 |     };
  361 | 
  362 |     const response = await this.safePost(`${apiBase}/bills?${params}`, {
  363 |       data: payload,
  364 |       headers,
  365 |       label: 'Create API Bill from PO'
  366 |     });
  367 | 
  368 |     if (!response.ok()) throw new Error(`PO-to-Bill API Failed: ${response.status()} - ${await response.text()}`);
  369 |     const json = await response.json();
  370 |     return { success: true, billNumber: json.invoice_number, billId: json.id };
  371 |   }
  372 | 
  373 |   async getPoReceiveStatusAPI(poId: string): Promise<{ poQty: number; receivedQty: number; remainingQty: number }> {
  374 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  375 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  376 |     const token = await this._getAuthToken();
  377 |     const company = process.env.BEFFA_COMPANY as string;
  378 |     const year = process.env.BEFFA_YEAR || '2018';
  379 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  380 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  381 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  382 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  383 | 
  384 |     const poResp = await this.safeGet(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
  385 |     if (!poResp.ok()) throw new Error(`Fetch PO ${poId} failed: ${poResp.status()}`);
  386 |     const poData = await poResp.json();
  387 |     const poItems = poData.po_items || [];
  388 | 
  389 |     let poQty = 0;
  390 |     let receivedQty = 0;
  391 |     for (const item of poItems) {
  392 |       const qty = parseFloat(item.quantity || '0');
  393 |       poQty += qty;
  394 |       const unreceived = item.unreceived_quantity ?? item.remaining_quantity ?? item.unreceived_qty;
  395 |       if (unreceived != null) {
  396 |         receivedQty += qty - parseFloat(unreceived);
  397 |       } else if (item.received_quantity != null) {
  398 |         receivedQty += parseFloat(item.received_quantity);
  399 |       }
  400 |     }
  401 | 
  402 |     // Fallback: if PO item fields don't reflect received qty, sum approved bills linked to this PO
  403 |     if (receivedQty === 0 && poQty > 0) {
  404 |       const billsResp = await this.safeGet(`${apiBase}/bills?purchase_order_id=${poId}&pageSize=50&${params}`, { headers });
  405 |       if (billsResp.ok()) {
  406 |         const billsData = await billsResp.json();
  407 |         const bills = billsData.data || billsData.items || [];
  408 |         const approvedBills = bills.filter((b: any) => b.status === 'approved');
  409 |         for (const bill of approvedBills) {
  410 |           const billDetail = await this.safeGet(`${apiBase}/bill/${bill.id}?${params}`, { headers });
```