# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-load.spec.ts >> Load: Concurrent Sales Invoices @sales @load @full >> LOAD: 10 concurrent invoices for same customer must all be created with distinct IDs
- Location: tests/sales/so-load.spec.ts:21:9

# Error details

```
Error: Item Creation API Failed: 409 - {
	"code": 409,
	"details": {
		"ref": [
			"An item with this reference already exists for the selected company."
		]
	},
	"message": ""
}

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
  70  |     const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=100&${params}`, { headers });
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
  87  |         const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
  88  |         if (locResp.ok()) {
  89  |             const ldata = await locResp.json();
  90  |             const locs = ldata.items || ldata.data || [];
  91  |             if (locs[0]) {
  92  |                 locId = locId || locs[0].id;
  93  |                 warehouseId = warehouseId || await this.resolveWarehouseIdFromLocation(locs[0]);
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
  127 |     // Retry up to 3x for 500/503 (transient backend errors) and re-auth on 401
  128 |     for (let attempt = 1; attempt <= 3; attempt++) {
  129 |       const resp = await this.page.request.post(`${apiBase}/inventory-items?${params}`, { headers, data: payload });
  130 |       if (resp.ok()) {
  131 |         const json = await resp.json();
  132 |         return { itemName: json.name, id: json.id };
  133 |       }
  134 |       const status = resp.status();
  135 |       if (status === 401) {
  136 |         const loginResp = await this.page.request.post(`${apiBase}/users/login?${params}&month=6`, {
  137 |           data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
  138 |           headers: { 'Content-Type': 'application/json' }
  139 |         });
  140 |         if (loginResp.ok()) {
  141 |           const newToken = (await loginResp.json()).auth_token;
  142 |           if (newToken) {
  143 |             await this.page.evaluate((t) => { localStorage.setItem('token', t); localStorage.setItem('auth-token', t); }, newToken);
  144 |             headers['Authorization'] = `Bearer ${newToken}`;
  145 |             continue;
  146 |           }
  147 |         }
  148 |         throw new Error(`Item Creation API Failed: 401 Unauthorized`);
  149 |       }
  150 |       if ((status === 500 || status === 503) && attempt < 3) {
  151 |         console.log(`[RETRY] Item creation ${status} on attempt ${attempt} — retrying in ${attempt * 2}s...`);
  152 |         await this.page.waitForTimeout(attempt * 2000);
  153 |         continue;
  154 |       }
> 155 |       throw new Error(`Item Creation API Failed: ${status} - ${await resp.text()}`);
      |             ^ Error: Item Creation API Failed: 409 - {
  156 |     }
  157 |     throw new Error('Item Creation API Failed: exhausted retries');
  158 |   }
  159 | 
  160 |   async ensureDefaultLocationAPI(): Promise<{ locationId: string; warehouseId: string }> {
  161 |     const company = await this.resolveActiveCompanyAPI();
  162 |     const token = await this._getAuthToken();
  163 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
  164 |       .replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  165 |     if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  166 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  167 |     const headers = {
  168 |       'x-company': company,
  169 |       'Authorization': `Bearer ${token}`,
  170 |       'Content-Type': 'application/json',
  171 |       'x-role': 'IT Administrator / User Manager'
  172 |     };
  173 |     const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  174 | 
  175 |     const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=50&${params}`, { headers });
  176 |     if (locResp.ok()) {
  177 |       const locJson = await locResp.json();
  178 |       const locs = locJson.items || locJson.data || [];
  179 |       const loc = locs[0];
  180 |       if (loc?.id) {
  181 |         const warehouseId = await this.resolveWarehouseIdFromLocation(loc);
  182 |         if (warehouseId) return { locationId: loc.id, warehouseId };
  183 |       }
  184 |     }
  185 | 
  186 |     console.log('[SELF-HEALING] No usable location found — creating default warehouse + location...');
  187 |     const created = await this.ensureTransferLocationAPI(apiBase, params, headers);
  188 |     return { locationId: created.id, warehouseId: created.warehouse_id };
  189 |   }
  190 | 
  191 |   async discoverMetadataAPI(preferredCompany?: string): Promise<{ locationId: string, warehouseId: string, salesAccountId: string, customerId: string }> {
  192 |       const company = await this.resolveActiveCompanyAPI(preferredCompany);
  193 |       const token = await this._getAuthToken();
  194 |       let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
  195 |         .replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  196 |       if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  197 |       if (!apiBase.endsWith('/api')) apiBase += '/api';
  198 |       const headers = { 
  199 |         'x-company': company, 
  200 |         'Authorization': `Bearer ${token}`,
  201 |         'x-role': 'IT Administrator / User Manager'
  202 |       };
  203 |       const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  204 | 
  205 |       const { locationId, warehouseId } = await this.ensureDefaultLocationAPI();
  206 | 
  207 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  208 |       const acctJson = await acctResp.json();
  209 |       const sales = (acctJson.items || acctJson.data || []).find((a: any) => a.name?.toLowerCase().includes('sales'))?.id;
  210 | 
  211 |       const custResp = await this.safeGet(`${apiBase}/customers?page=1&pageSize=1&${params}`, { headers });
  212 |       const custJson = await custResp.json();
  213 |       const cust = (custJson.items?.[0] || custJson.data?.[0])?.id;
  214 |       if (!cust) throw new Error('[METADATA] No customers found. Ensure the environment has at least one customer.');
  215 | 
  216 |       return {
  217 |           locationId,
  218 |           warehouseId,
  219 |           salesAccountId: sales,
  220 |           customerId: cust
  221 |       };
  222 |   }
  223 | 
  224 |   async processAdjustmentAPI(id: string): Promise<void> {
  225 |       console.log(`[ACTION] Triggering API Process for Adjustment: ${id}`);
  226 |       let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  227 |       if (!apiBase.endsWith('/api')) apiBase += '/api';
  228 |       const token = await this._getAuthToken();
  229 |       
  230 |       const response = await this.page.request.post(`${apiBase}/inventory-adjustments/${id}/process`, {
  231 |           headers: { 
  232 |             'x-company': process.env.BEFFA_COMPANY as string, 
  233 |             'Authorization': `Bearer ${token}`,
  234 |             'x-role': 'IT Administrator / User Manager'
  235 |           }
  236 |       });
  237 |       if (!response.ok() && response.status() !== 404) {
  238 |           console.warn(`[WARN] Adjustment processing returned ${response.status()}`);
  239 |       }
  240 |   }
  241 | 
  242 | 
  243 |   async createInventoryAdjustmentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; error?: string }> {
  244 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  245 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  246 |     const token = await this._getAuthToken();
  247 |     const year = process.env.BEFFA_YEAR || '2018';
  248 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  249 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  250 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
  251 |     const headers = {
  252 |       'x-company': process.env.BEFFA_COMPANY as string,
  253 |       'Authorization': token ? `Bearer ${token}` : '',
  254 |       'Content-Type': 'application/json'
  255 |     };
```