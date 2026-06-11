# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-costing-audit.spec.ts >> First-In-First-Out Forensic Audit @inventory @security @costing @regression @full >> Audit: 7-Stage FIFO Cost Validation & COGS Accuracy
- Location: tests/inventory/inv-costing-audit.spec.ts:21:9

# Error details

```
Error: [METADATA] No locations found. Ensure the environment has at least one warehouse location configured.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - img [ref=e8]
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
            - button "Show password" [ref=e31] [cursor=pointer]:
              - img [ref=e32]
        - link "Forget Password?" [ref=e37] [cursor=pointer]:
          - /url: forget-password
        - button "Login" [ref=e39] [cursor=pointer]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right":
      - status [ref=e40]:
        - generic [ref=e41]:
          - img [ref=e43]
          - generic [ref=e45]:
            - generic [ref=e46]: Server error!
            - generic [ref=e47]: An error occurred fetching user data. If the problem persists, contact support
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right":
      - status [ref=e48]:
        - generic [ref=e49]:
          - img [ref=e51]
          - generic [ref=e53]:
            - generic [ref=e54]: Server error!
            - generic [ref=e55]: An error occurred fetching user data. If the problem persists, contact support
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  51  |     gl_sales_account_id?: string
  52  |   }): Promise<{ itemName: string, id: string }> {
  53  |     const name = typeof data === 'string' ? data : data.name;
  54  |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  55  |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  56  |     const token = await this._getAuthToken();
  57  |     const headers = {
  58  |       'x-company': process.env.BEFFA_COMPANY as string,
  59  |       'Authorization': `Bearer ${token}`,
  60  |       'Content-Type': 'application/json',
  61  |       'x-role': 'IT Administrator / User Manager'
  62  |     };
  63  | 
  64  |     const year = process.env.BEFFA_YEAR || '2018';
  65  |     const period = process.env.BEFFA_PERIOD || 'yearly';
  66  |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  67  |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  68  | 
  69  |     // Smart Account Discovery
  70  |     const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=100&${params}`, { headers });
  71  |     let incAcct = typeof data !== 'string' ? data.gl_sales_account_id : undefined;
  72  |     let expAcct = typeof data !== 'string' ? data.gl_cost_account_id : undefined;
  73  |     let invAcct = typeof data !== 'string' ? data.gl_inventory_account_id : undefined;
  74  |     
  75  |     if (acctResp.ok() && (!incAcct || !expAcct || !invAcct)) {
  76  |       const adata = await acctResp.json();
  77  |       const accounts = adata.items || adata.data || [];
  78  |       incAcct = incAcct || accounts.find((a: any) => a.name?.toLowerCase().includes('sales'))?.id || accounts.find((a: any) => a.account_type?.toLowerCase() === 'income')?.id || accounts[0]?.id || '5beb2d62-bb7e-4c1b-8298-556ac8ebe25e';
  79  |       expAcct = expAcct || accounts.find((a: any) => a.name?.toLowerCase().includes('cogs') || a.name?.toLowerCase().includes('cost of goods'))?.id || accounts.find((a: any) => a.account_type?.toLowerCase() === 'expense')?.id || accounts[0]?.id || '5beb2d62-bb7e-4c1b-8298-556ac8ebe25e';
  80  |       invAcct = invAcct || accounts.find((a: any) => a.name?.toLowerCase().includes('inventory'))?.id || accounts.find((a: any) => a.account_type?.toLowerCase() === 'asset')?.id || accounts[0]?.id || '5beb2d62-bb7e-4c1b-8298-556ac8ebe25e';
  81  |     }
  82  | 
  83  |     let locId = typeof data === 'string' ? undefined : data.default_location_id;
  84  |     let warehouseId = typeof data === 'string' ? undefined : data.default_warehouse_id;
  85  | 
  86  |     if (!locId || !warehouseId) {
  87  |         const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
  88  |         if (locResp.ok()) {
  89  |             const ldata = await locResp.json();
  90  |             const locs = ldata.items || ldata.data || [];
  91  |             if (locs[0]) {
  92  |                 locId = locId || locs[0].id;
  93  |                 warehouseId = warehouseId || locs[0].warehouse_id || locs[0].warehouse?.id;
  94  |             }
  95  |         }
  96  |     }
  97  | 
  98  |     const payload = {
  99  |         name,
  100 |         type: 'inventory',
  101 |         category: typeof data === 'string' ? "Raw Materials" : (data.category || "Raw Materials"),
  102 |         cost_method_code: typeof data === 'string' ? "WAC" : (data.cost_method_code || "WAC"),
  103 |         item_class: typeof data === 'string' ? 'MER' : (data.item_class || 'MER'),
  104 |         item_id: typeof data === 'string' ? `ITM-${Date.now().toString().slice(-6)}` : (data.item_id || `ITM-${Date.now().toString().slice(-6)}`),
  105 |         unit_of_measurement: "Kilogram (kg)",
  106 |         part_number: typeof data === 'string' ? `PN-${Date.now().toString().slice(-4)}` : (data.part_number || `PN-${Date.now().toString().slice(-4)}`),
  107 |         serial: "Z",
  108 |         status: "active",
  109 |         description: [
  110 |             {content: "", type: "item"}, 
  111 |             {content: "", type: "sales"}, 
  112 |             {content: "", type: "purchase"}
  113 |         ],
  114 |         min_stock: 0,
  115 |         initial_stock: typeof data === 'string' ? 0 : (data.quantity || 0),
  116 |         purchase_price: typeof data === 'string' ? 1 : (data.unit_cost || 1),
  117 |         selling_price: typeof data === 'string' ? 1 : (data.unit_cost || 1),
  118 |         unit_cost: typeof data === 'string' ? 0 : (data.unit_cost || 0),
  119 |         gl_sales_account_id: incAcct,
  120 |         gl_cost_account_id: expAcct,
  121 |         gl_inventory_account_id: invAcct,
  122 |         default_location_id: locId,
  123 |         default_warehouse_id: warehouseId,
  124 |         quantity: typeof data === 'string' ? 0 : (data.quantity || 0)
  125 |     };
  126 | 
  127 |     const resp = await this.page.request.post(`${apiBase}/inventory-items?${params}`, { headers, data: payload });
  128 |     if (!resp.ok()) throw new Error(`Item Creation API Failed: ${resp.status()} - ${await resp.text()}`);
  129 |     const json = await resp.json();
  130 |     return { itemName: json.name, id: json.id };
  131 |   }
  132 | 
  133 |   async discoverMetadataAPI(): Promise<{ locationId: string, warehouseId: string, salesAccountId: string, customerId: string }> {
  134 |       const token = await this._getAuthToken();
  135 |       let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
  136 |         .replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  137 |       if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  138 |       if (!apiBase.endsWith('/api')) apiBase += '/api';
  139 |       const headers = { 
  140 |         'x-company': process.env.BEFFA_COMPANY as string, 
  141 |         'Authorization': `Bearer ${token}`,
  142 |         'x-role': 'IT Administrator / User Manager'
  143 |       };
  144 |       const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  145 | 
  146 |       // Locations — fetch up to 50 to find one with a warehouse
  147 |       const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=50&${params}`, { headers });
  148 |       const locJson = await locResp.json();
  149 |       const locs = locJson.items || locJson.data || [];
  150 |       const loc = locs.find((l: any) => l.warehouse_id || l.warehouse?.id) || locs[0];
> 151 |       if (!loc) throw new Error('[METADATA] No locations found. Ensure the environment has at least one warehouse location configured.');
      |                       ^ Error: [METADATA] No locations found. Ensure the environment has at least one warehouse location configured.
  152 | 
  153 |       const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  154 |       const acctJson = await acctResp.json();
  155 |       const sales = (acctJson.items || acctJson.data || []).find((a: any) => a.name?.toLowerCase().includes('sales'))?.id;
  156 | 
  157 |       const custResp = await this.page.request.get(`${apiBase}/customers?page=1&pageSize=1&${params}`, { headers });
  158 |       const custJson = await custResp.json();
  159 |       const cust = (custJson.items?.[0] || custJson.data?.[0])?.id;
  160 |       if (!cust) throw new Error('[METADATA] No customers found. Ensure the environment has at least one customer.');
  161 | 
  162 |       return {
  163 |           locationId: loc.id,
  164 |           warehouseId: loc.warehouse_id || loc.warehouse?.id,
  165 |           salesAccountId: sales,
  166 |           customerId: cust
  167 |       };
  168 |   }
  169 | 
  170 |   async processAdjustmentAPI(id: string): Promise<void> {
  171 |       console.log(`[ACTION] Triggering API Process for Adjustment: ${id}`);
  172 |       let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  173 |       if (!apiBase.endsWith('/api')) apiBase += '/api';
  174 |       const token = await this._getAuthToken();
  175 |       
  176 |       const response = await this.page.request.post(`${apiBase}/inventory-adjustments/${id}/process`, {
  177 |           headers: { 
  178 |             'x-company': process.env.BEFFA_COMPANY as string, 
  179 |             'Authorization': `Bearer ${token}`,
  180 |             'x-role': 'IT Administrator / User Manager'
  181 |           }
  182 |       });
  183 |       if (!response.ok() && response.status() !== 404) {
  184 |           console.warn(`[WARN] Adjustment processing returned ${response.status()}`);
  185 |       }
  186 |   }
  187 | 
  188 | 
  189 |   async createInventoryAdjustmentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; error?: string }> {
  190 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  191 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  192 |     const token = await this._getAuthToken();
  193 |     const year = process.env.BEFFA_YEAR || '2018';
  194 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  195 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  196 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  197 |     const headers = {
  198 |       'x-company': process.env.BEFFA_COMPANY as string,
  199 |       'Authorization': token ? `Bearer ${token}` : '',
  200 |       'Content-Type': 'application/json'
  201 |     };
  202 | 
  203 |     // Safe JSON helper: reads as text first, skips silently if the response is HTML
  204 |     const safeJson = async (resp: any): Promise<any | null> => {
  205 |       const text = await resp.text();
  206 |       if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
  207 |         console.log(`[WARN] API response was not JSON (likely HTML). Skipping discovery.`);
  208 |         return null;
  209 |       }
  210 |       try { return JSON.parse(text); } catch { return null; }
  211 |     };
  212 | 
  213 |     // 1. Discover Adjustment Account dynamically
  214 |     let adjustmentAccountId = data.adjustmentAccountId;
  215 |     if (!adjustmentAccountId) {
  216 |       const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  217 |       const acctData = await safeJson(acctResp);
  218 |       if (acctData) {
  219 |         const allAccounts = acctData.items || acctData.data || [];
  220 |         const expAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense') || a.account_type?.toLowerCase().includes('cost')) || allAccounts[0];
  221 |         if (expAcct) adjustmentAccountId = expAcct.id;
  222 |       }
  223 |     }
  224 | 
  225 |     // 2. Discover Locations dynamically if not provided
  226 |     let locationId = data.locationId;
  227 |     let warehouseId = data.warehouseId;
  228 |     if (!locationId || !warehouseId) {
  229 |       const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
  230 |       const locData = await safeJson(locResp);
  231 |       if (locData) {
  232 |         const firstLoc = (locData.items || locData.data || [])[0];
  233 |         if (firstLoc) {
  234 |           locationId = locationId || firstLoc.id;
  235 |           warehouseId = warehouseId || firstLoc.warehouse_id || firstLoc.warehouse?.id;
  236 |         }
  237 |       }
  238 |     }
  239 | 
  240 |     const qty = data.quantity !== undefined ? data.quantity : (data.adjustedQuantity || 10);
  241 |     const unitCost = data.cost || 0;
  242 |     
  243 |     const payload = {
  244 |       adjusted_by: 'quantity',
  245 |       adjusted_cost: 0, 
  246 |       adjusted_quantity: qty,
  247 |       adjustment_account_id: adjustmentAccountId,
  248 |       inventory_item_id: data.itemId,
  249 |       is_write_down: data.isWriteDown !== undefined ? String(data.isWriteDown) : 'true',
  250 |       location_id: locationId,
  251 |       warehouse_id: warehouseId,
```