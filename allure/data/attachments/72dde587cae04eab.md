# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-gl-audit.spec.ts >> Purchase GL & AP Ledger Audits @purchase @regression >> Audit: Partial payment GL — AP partially cleared, cash reduced exactly
- Location: tests/purchase/bill-gl-audit.spec.ts:299:9

# Error details

```
Error: Bill API Creation Failed: 408 - [TIMEOUT] Create Bill exceeded 30000ms — backend may be deadlocked
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
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
            - button "Show password" [ref=e31] [cursor=pointer]
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
  379 |     if (!resolvedVendorId) {
  380 |       const vendorResp = await this.safeGet(`${apiBase}/vendors?page=1&pageSize=5&${qs}`, { headers }, 30000);
  381 |       const vendorData = await safeJson(vendorResp, 'Vendor Discovery');
  382 |       const vendor = vendorData?.items?.[0] || vendorData?.data?.[0];
  383 |       resolvedVendorId = vendor?.id || process.env.BEFFA_VENDOR_ID || '';
  384 |       if (!resolvedVendorId) throw new Error('Bill Discovery Failed: No vendors found in current company.');
  385 |     }
  386 | 
  387 |     // 2. Discover Accounts (AP + GL)
  388 |     let resolvedApAccountId = apAccountId || meta?.apAccountId;
  389 |     let resolvedGlAccountId = glAccountId !== undefined ? glAccountId : meta?.apAccountId;
  390 | 
  391 |     if (!resolvedApAccountId || (glAccountId === undefined && !resolvedGlAccountId)) {
  392 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers }, 30000);
  393 |       const acctData = await safeJson(acctResp, 'Accounts Discovery');
  394 |       const allAccounts = acctData.items || acctData.data || [];
  395 | 
  396 |       // Improved strict AP discovery
  397 |       const _typeOf = (a: any) => {
  398 |         if (typeof a.type === 'string') return a.type.toLowerCase();
  399 |         if (a.type?.name && typeof a.type.name === 'string') return a.type.name.toLowerCase();
  400 |         if (typeof a.account_type === 'string') return a.account_type.toLowerCase();
  401 |         if (a.account_type?.name && typeof a.account_type.name === 'string') return a.account_type.name.toLowerCase();
  402 |         return '';
  403 |       };
  404 |       const discoveredAp =
  405 |         allAccounts.find((a: any) => a.name?.toLowerCase().includes('accounts payable')) ||
  406 |         allAccounts.find((a: any) => _typeOf(a).includes('payable')) ||
  407 |         allAccounts.find((a: any) => a.name?.toLowerCase().includes('payable')) ||
  408 |         allAccounts.find((a: any) => _typeOf(a).includes('liability')) ||
  409 |         allAccounts[0];
  410 | 
  411 |       resolvedApAccountId = resolvedApAccountId || discoveredAp?.id;
  412 |       if (glAccountId === undefined) {
  413 |         resolvedGlAccountId = resolvedGlAccountId || (allAccounts.find((a: any) => _typeOf(a).includes('expense')) || allAccounts[1] || allAccounts[0])?.id;
  414 |       }
  415 |     }
  416 | 
  417 |     // 3. Discover Currency
  418 |     let resolvedCurrencyId = meta?.currencyId;
  419 |     if (!resolvedCurrencyId) {
  420 |       const currResp = await this.safeGet(`${apiBase}/currency?${qs}`, { headers }, 30000);
  421 |       const currData = await safeJson(currResp, 'Currency Discovery');
  422 |       const currency = currData.items?.[0] || currData.data?.[0];
  423 |       resolvedCurrencyId = currency?.id;
  424 |     }
  425 | 
  426 |     // 4. Discover Locations if missing
  427 |     let locationId = itemData.locationId || meta?.locationId;
  428 |     let warehouseId = itemData.warehouseId || meta?.warehouseId;
  429 |     if (!locationId || !warehouseId) {
  430 |       const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=10&${qs}`, { headers }, 30000);
  431 |       const locData = await safeJson(locResp, 'Location Discovery');
  432 |       const firstLoc = (locData.items || locData.data || [])[0];
  433 |       if (firstLoc) {
  434 |         locationId = firstLoc.id;
  435 |         warehouseId = await this.resolveWarehouseIdFromLocation(firstLoc);
  436 |       }
  437 |     }
  438 | 
  439 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  440 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  441 |     const payload = {
  442 |       accounts_payable_id: resolvedApAccountId,
  443 |       currency_id: resolvedCurrencyId,
  444 |       invoice_date: (params as any).invoice_date || _dateIso,
  445 |       due_date: (params as any).due_date || _dateIso,
  446 |       items: [{
  447 |         item_id: itemData.itemId || itemData.id,
  448 |         general_ledger_account_id: resolvedGlAccountId || null,
  449 |         location_id: locationId,
  450 |         quantity: finalQty,
  451 |         tax_id: itemData.taxId || null,
  452 |         unit_price: unitPrice,
  453 |         warehouse_id: warehouseId,
  454 |         description: description || `Audit Bill of ${itemData.itemName || itemData.name}`,
  455 |         amount: finalQty * unitPrice,
  456 |         discount_amount: discount_amount
  457 |       }],
  458 |       vendor_id: resolvedVendorId,
  459 |       status: 'draft'
  460 |     };
  461 | 
  462 |     let response = await this.safePost(`${apiBase}/bills?${qs}`, {
  463 |       data: payload,
  464 |       headers,
  465 |       label: 'Create Bill'
  466 |     });
  467 | 
  468 |     if (response.status() === 401) {
  469 |       console.warn(`[WARN] Create Bill received 401 (likely invalid vendor ID ${resolvedVendorId}). Discovering fresh vendor...`);
  470 |       const freshVendor = await this.discoverRandomVendorAPI();
  471 |       payload.vendor_id = freshVendor.id;
  472 |       response = await this.safePost(`${apiBase}/bills?${qs}`, {
  473 |         data: payload,
  474 |         headers,
  475 |         label: 'Create Bill (fresh vendor retry)'
  476 |       });
  477 |     }
  478 | 
> 479 |     if (!response.ok()) throw new Error(`Bill API Creation Failed: ${response.status()} - ${await response.text()}`);
      |                               ^ Error: Bill API Creation Failed: 408 - [TIMEOUT] Create Bill exceeded 30000ms — backend may be deadlocked
  480 |     const json = await response.json();
  481 |     return { success: true, ref: json.invoice_number, id: json.id, billId: json.id, billNumber: json.invoice_number, vendorId: payload.vendor_id };
  482 |   }
  483 |   async createBillFromPoAPI(poId: string, poItems?: any[], apAccountId?: string | null): Promise<{ success: boolean; billNumber: string; billId: string; vendorId?: string }> {
  484 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  485 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  486 |     const token = await this._getAuthToken();
  487 |     const company = process.env.BEFFA_COMPANY as string;
  488 |     const year = process.env.BEFFA_YEAR || '2019';
  489 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  490 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  491 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  492 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  493 | 
  494 |     const safeJson = async (resp: any, label: string) => {
  495 |       const text = await resp.text();
  496 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  497 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  498 |     };
  499 | 
  500 |     // Fetch PO header (vendor, currency) — po_items are NOT returned by GET, use passed poItems
  501 |     const poResp = await this.safeGet(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
  502 |     const poData = await safeJson(poResp, `Fetch PO ${poId}`);
  503 | 
  504 |     // Use po_items passed from createPurchaseOrderAPI (creation response has ids).
  505 |     // If not passed, throw a clear error — GET /purchase-order/{id} never returns po_items.
  506 |     const rawItems: any[] = (poItems || []).filter((i: any) => i.id);
  507 |     if (rawItems.length === 0) {
  508 |       throw new Error(`[createBillFromPoAPI] po_items with ids are required. Pass the po_items array from createPurchaseOrderAPI's response. GET /purchase-order/{id} does not return po_items.`);
  509 |     }
  510 | 
  511 |     // Discover AP account
  512 |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  513 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  514 |     const allAccounts = acctData.items || acctData.data || [];
  515 | 
  516 |     const _typeOf = (a: any) => {
  517 |       if (typeof a.type === 'string') return a.type.toLowerCase();
  518 |       if (a.type?.name && typeof a.type.name === 'string') return a.type.name.toLowerCase();
  519 |       if (typeof a.account_type === 'string') return a.account_type.toLowerCase();
  520 |       if (a.account_type?.name && typeof a.account_type.name === 'string') return a.account_type.name.toLowerCase();
  521 |       return '';
  522 |     };
  523 | 
  524 |     const discoveredAp =
  525 |       allAccounts.find((a: any) => a.name?.toLowerCase().includes('accounts payable')) ||
  526 |       allAccounts.find((a: any) => _typeOf(a).includes('payable')) ||
  527 |       allAccounts.find((a: any) => a.name?.toLowerCase().includes('payable')) ||
  528 |       allAccounts.find((a: any) => _typeOf(a).includes('liability')) ||
  529 |       allAccounts[0];
  530 | 
  531 |     const apAccount = apAccountId ? { id: apAccountId } : discoveredAp;
  532 | 
  533 |     const receivedItems = rawItems.map((item: any) => ({
  534 |       po_item_id: item.id,
  535 |       received_quantity: item.quantity,
  536 |       received_unit_price: item.unit_price
  537 |     }));
  538 | 
  539 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  540 |     const _dateIso = (await _DH.resolve(this.page)).iso;
  541 |     const payload = {
  542 |       accounts_payable_id: apAccount?.id,
  543 |       currency_id: poData.currency_id || poData.currency?.id,
  544 |       due_date: _dateIso,
  545 |       invoice_date: _dateIso,
  546 |       items: [],
  547 |       purchase_order_id: poId,
  548 |       vendor_id: poData.vendor_id || poData.vendor?.id,
  549 |       received_purchase_order_items: receivedItems,
  550 |       status: 'draft'
  551 |     };
  552 | 
  553 |     const response = await this.safePost(`${apiBase}/bills?${params}`, {
  554 |       data: payload,
  555 |       headers,
  556 |       label: 'Create API Bill from PO'
  557 |     });
  558 | 
  559 |     if (!response.ok()) throw new Error(`PO-to-Bill API Failed: ${response.status()} - ${await response.text()}`);
  560 |     const json = await response.json();
  561 |     return { success: true, billNumber: json.invoice_number, billId: json.id, vendorId: json.vendor_id || json.vendor?.id || payload.vendor_id };
  562 |   }
  563 | 
  564 | 
  565 |   async getPoReceiveStatusAPI(poId: string): Promise<{ poQty: number; receivedQty: number; remainingQty: number }> {
  566 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  567 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  568 |     const token = await this._getAuthToken();
  569 |     const company = process.env.BEFFA_COMPANY as string;
  570 |     const year = process.env.BEFFA_YEAR || '2019';
  571 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  572 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  573 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  574 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  575 | 
  576 |     const poResp = await this.safeGet(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
  577 |     if (!poResp.ok()) throw new Error(`Fetch PO ${poId} failed: ${poResp.status()}`);
  578 |     const poData = await poResp.json();
  579 |     const poItems = poData.po_items || [];
```