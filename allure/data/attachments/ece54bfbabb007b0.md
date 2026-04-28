# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/bill-impact.spec.ts >> Bill Impact Flow @regression >> Stage 1: Create bill via API, approve, verify stock increase
- Location: tests/purchase/bill-impact.spec.ts:10:9

# Error details

```
Error: Currency Discovery HTTP 500: {
	"code": 500,
	"message": "Error fetching currencies"
}

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "smoke test" [ref=e10]: st
        - generic [ref=e11]:
          - button "smoke test" [ref=e12] [cursor=pointer]:
            - generic: smoke test
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
          - img "smoke test" [ref=e62]: st
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
  142 | 
  143 |   async createPurchaseOrderAPI(itemData: Record<string, any> = {}, qty: number = 10, unitPrice: number = 5000, vendorId: string | null = null): Promise<{ success: boolean; poNumber: string; poId: string }> {
  144 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  145 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  146 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  147 |     const token = await this._getAuthToken();
  148 |     const company = process.env.BEFFA_COMPANY as string;
  149 |     const year = process.env.BEFFA_YEAR || '2018';
  150 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  151 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  152 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  153 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  154 | 
  155 |     const safeJson = async (resp: any, label: string) => {
  156 |       const text = await resp.text();
  157 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  158 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  159 |     };
  160 | 
  161 |     // 1. Discover Vendor
  162 |     let resolvedVendorId = vendorId;
  163 |     if (!resolvedVendorId) {
  164 |       const vendorResp = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=10`, { headers });
  165 |       const vendorData = await safeJson(vendorResp, 'Vendor Discovery');
  166 |       const vendor = vendorData.items?.[0] || vendorData.data?.[0];
  167 |       if (!vendor) throw new Error('PO Discovery Failed: No vendors found.');
  168 |       resolvedVendorId = vendor.id;
  169 |       console.log(`[ACTION] Discovered Vendor: "${vendor.name}"`);
  170 |     }
  171 | 
  172 |     // 2. Discover Accounts (AP + GL)
  173 |     const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50`, { headers });
  174 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  175 |     const allAccounts = acctData.items || acctData.data || [];
  176 |     const apAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
  177 |     const glAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  178 | 
  179 |     // 4. Discover Locations if missing
  180 |     let locationId = itemData.locationId;
  181 |     let warehouseId = itemData.warehouseId;
  182 |     if (!locationId || !warehouseId) {
  183 |       const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10`, { headers });
  184 |       const locData = await safeJson(locResp, 'Location Discovery');
  185 |       const firstLoc = (locData.items || locData.data || [])[0];
  186 |       if (firstLoc) {
  187 |         locationId = firstLoc.id;
  188 |         warehouseId = firstLoc.warehouse_id || firstLoc.warehouse?.id;
  189 |       }
  190 |     }
  191 |     // 5. Discover Currency if missing
  192 |     const currResp = await this.page.request.get(`${apiBase}/currency?page=1&pageSize=5`, { headers });
  193 |     const currData = await safeJson(currResp, 'Currency Discovery');
  194 |     const currency = (currData.items || currData.data || [])[0];
  195 | 
  196 |     const payload = {
  197 |       accounts_payable_id: apAccount?.id,
  198 |       currency_id: currency?.id,
  199 |       po_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  200 |       po_items: [{
  201 |         item_id: itemData.itemId,
  202 |         general_ledger_account_id: glAccount?.id,
  203 |         location_id: locationId,
  204 |         quantity: qty,
  205 |         tax_id: itemData.taxId || null,
  206 |         unit_price: unitPrice,
  207 |         warehouse_id: warehouseId,
  208 |         description: `Purchase of ${itemData.itemName}`
  209 |       }],
  210 |       purchase_type_id: 4,
  211 |       vendor_id: resolvedVendorId
  212 |     };
  213 | 
  214 |     const response = await this.safePost(`${apiBase}/purchase-orders?year=${year}&period=${period}&calendar=${calendar}`, {
  215 |       data: payload,
  216 |       headers,
  217 |       label: 'Create Purchase Order'
  218 |     });
  219 | 
  220 |     if (!response.ok()) throw new Error(`PO API Creation Failed: ${response.status()} - ${await response.text()}`);
  221 |     const json = await response.json();
  222 |     console.log(`[SUCCESS] PO created via API: ${json.po_number} (ID: ${json.id})`);
  223 |     return { success: true, poNumber: json.po_number, poId: json.id };
  224 |   }
  225 | 
  226 |   async createBillAPI(params: { itemData?: Record<string, any>; itemId?: string; quantity?: number; qty?: number; unitPrice?: number; vendorId?: string | null; apAccountId?: string | null; description?: string } = {}): Promise<{ success: boolean; ref: string; id: string }> {
  227 |     const { itemData = {}, itemId = null, quantity = 10, qty = 10, unitPrice = 5000, vendorId = null, apAccountId = null, description = null } = params;
  228 |     const finalQty = quantity || qty;
  229 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  230 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  231 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  232 |     const token = await this._getAuthToken();
  233 |     const company = process.env.BEFFA_COMPANY as string;
  234 |     const year = process.env.BEFFA_YEAR || '2018';
  235 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  236 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  237 |     const qs = `year=${year}&period=${period}&calendar=${calendar}`;
  238 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  239 | 
  240 |     const safeJson = async (resp: any, label: string) => {
  241 |       const text = await resp.text();
> 242 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
      |                             ^ Error: Currency Discovery HTTP 500: {
  243 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  244 |     };
  245 | 
  246 |     // 1. Discover Vendor - always use company-scoped discovery (never trust hardcoded UUIDs)
  247 |     let resolvedVendorId = vendorId;
  248 |     if (!resolvedVendorId) {
  249 |       // Use same pattern as createPurchaseOrderAPI which works reliably
  250 |       const vendorResp = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=10`, { headers });
  251 |       const vendorData = await safeJson(vendorResp, 'Vendor Discovery');
  252 |       const vendor = vendorData.items?.[0] || vendorData.data?.[0];
  253 |       if (!vendor) throw new Error('Bill Discovery Failed: No vendors found in current company.');
  254 |       resolvedVendorId = vendor.id;
  255 |       console.log(`[ACTION] Discovered Vendor: "${vendor.name}" (ID: ${resolvedVendorId})`);
  256 |     }
  257 | 
  258 |     // 2. Discover Accounts (AP + GL)
  259 |     const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
  260 |     const acctData = await safeJson(acctResp, 'Accounts Discovery');
  261 |     const allAccounts = acctData.items || acctData.data || [];
  262 |     
  263 |     // Improved strict AP discovery
  264 |     const discoveredAp = 
  265 |       allAccounts.find((a: any) => a.name?.toLowerCase().includes('accounts payable')) ||
  266 |       allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || 
  267 |       allAccounts[0];
  268 | 
  269 |     const glAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];
  270 | 
  271 |     // 3. Discover Currency
  272 |     const currResp = await this.page.request.get(`${apiBase}/currency?${qs}`, { headers });
  273 |     const currData = await safeJson(currResp, 'Currency Discovery');
  274 |     const currency = currData.items?.[0] || currData.data?.[0];
  275 | 
  276 |     // 4. Discover Locations if missing
  277 |     let locationId = itemData.locationId;
  278 |     let warehouseId = itemData.warehouseId;
  279 |     if (!locationId || !warehouseId) {
  280 |       const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${qs}`, { headers });
  281 |       const locData = await safeJson(locResp, 'Location Discovery');
  282 |       const firstLoc = (locData.items || locData.data || [])[0];
  283 |       if (firstLoc) {
  284 |         locationId = firstLoc.id;
  285 |         warehouseId = firstLoc.warehouse_id || firstLoc.warehouse?.id;
  286 |       }
  287 |     }
  288 | 
  289 |     const payload = {
  290 |       accounts_payable_id: apAccountId || discoveredAp?.id,
  291 |       currency_id: currency?.id,
  292 |       invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  293 |       due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  294 |       items: [{
  295 |         item_id: itemData.itemId || itemData.id,
  296 |         general_ledger_account_id: glAccount?.id,
  297 |         location_id: locationId,
  298 |         quantity: qty,
  299 |         tax_id: itemData.taxId || null,
  300 |         unit_price: unitPrice,
  301 |         warehouse_id: warehouseId,
  302 |         description: description || `Audit Bill of ${itemData.itemName || itemData.name}`,
  303 |         amount: qty * unitPrice
  304 |       }],
  305 |       vendor_id: resolvedVendorId,
  306 |       status: 'draft'
  307 |     };
  308 | 
  309 |     const response = await this.safePost(`${apiBase}/bills?${qs}`, {
  310 |       data: payload,
  311 |       headers,
  312 |       label: 'Create Bill'
  313 |     });
  314 | 
  315 |     if (!response.ok()) throw new Error(`Bill API Creation Failed: ${response.status()} - ${await response.text()}`);
  316 |     const json = await response.json();
  317 |     console.log(`[SUCCESS] Bill created via API: ${json.invoice_number} (ID: ${json.id})`);
  318 |     return { success: true, ref: json.invoice_number, id: json.id };
  319 |   }
  320 |   async createBillFromPoAPI(poId: string): Promise<{ success: boolean; billNumber: string; billId: string }> {
  321 |     let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
  322 |     if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
  323 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  324 |     const token = await this._getAuthToken();
  325 |     const company = process.env.BEFFA_COMPANY as string;
  326 |     const year = process.env.BEFFA_YEAR || '2018';
  327 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  328 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  329 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  330 |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  331 | 
  332 |     const safeJson = async (resp: any, label: string) => {
  333 |       const text = await resp.text();
  334 |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
  335 |       try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
  336 |     };
  337 | 
  338 |     // 1. Fetch the Purchase Order to gather its precise mapping metadata
  339 |     console.log(`[ACTION] Fetching PO Context for ID: ${poId}...`);
  340 |     const poResp = await this.page.request.get(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
  341 |     const poData = await safeJson(poResp, `Fetch PO ${poId}`);
  342 |     
```