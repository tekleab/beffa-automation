# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory/inv-management.spec.ts >> Inventory Item Management @inventory @smoke >> Create: New inventory item is created and visible in the system
- Location: tests/inventory/inv-management.spec.ts:55:9

# Error details

```
Error: Item Creation API Failed: 422 - {
	"code": 422,
	"details": {
		"default_location_id": [
			"Location is required."
		]
	},
	"message": "Validation error when creating Inventory Item."
}

```

# Test source

```ts
  87  |       } catch { /* proceed with discovered values */ }
  88  |     }
  89  | 
  90  |     let locId = typeof data === 'string' ? undefined : data.default_location_id;
  91  |     let warehouseId = typeof data === 'string' ? undefined : data.default_warehouse_id;
  92  | 
  93  |     if (!locId || !warehouseId) {
  94  |       try {
  95  |         const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers, timeout: 10000 });
  96  |         if (locResp.ok()) {
  97  |           const ldata = await locResp.json();
  98  |           const locs = ldata.items || ldata.data || [];
  99  |           if (locs[0]) {
  100 |             locId = locId || locs[0].id;
  101 |             warehouseId = warehouseId || await this.resolveWarehouseIdFromLocation(locs[0]);
  102 |           }
  103 |         }
  104 |       } catch { /* proceed without location — ERP will use defaults */ }
  105 |     }
  106 | 
  107 |     const payload = {
  108 |         name,
  109 |         type: 'inventory',
  110 |         category: typeof data === 'string' ? "Raw Materials" : (data.category || "Raw Materials"),
  111 |         cost_method_code: typeof data === 'string' ? "FIFO" : (data.cost_method_code || "FIFO"),
  112 |         item_class: typeof data === 'string' ? 'MER' : (data.item_class || 'MER'),
  113 |         item_id: typeof data === 'string' ? `ITM-${Date.now().toString().slice(-6)}` : (data.item_id || `ITM-${Date.now().toString().slice(-6)}`),
  114 |         unit_of_measurement: "Kilogram (kg)",
  115 |         part_number: typeof data === 'string' ? `PN-${Date.now().toString().slice(-4)}` : (data.part_number || `PN-${Date.now().toString().slice(-4)}`),
  116 |         serial: "Z",
  117 |         status: "active",
  118 |         description: [
  119 |             {content: "", type: "item"}, 
  120 |             {content: "", type: "sales"}, 
  121 |             {content: "", type: "purchase"}
  122 |         ],
  123 |         min_stock: 0,
  124 |         initial_stock: typeof data === 'string' ? 0 : (data.quantity || 0),
  125 |         purchase_price: typeof data === 'string' ? 1 : (data.unit_cost || 1),
  126 |         selling_price: typeof data === 'string' ? 1 : (data.unit_cost || 1),
  127 |         unit_cost: typeof data === 'string' ? 1 : (data.unit_cost || 1),
  128 |         gl_sales_account_id: incAcct,
  129 |         gl_cost_account_id: expAcct,
  130 |         gl_inventory_account_id: invAcct,
  131 |         default_location_id: locId,
  132 |         default_warehouse_id: warehouseId,
  133 |         quantity: typeof data === 'string' ? 0 : (data.quantity || 0)
  134 |     };
  135 | 
  136 |     // Retry up to 3x for 500/503, connection resets, and invalid location self-healing
  137 |     for (let attempt = 1; attempt <= 3; attempt++) {
  138 |       let resp: any;
  139 |       try {
  140 |         resp = await this.page.request.post(`${apiBase}/inventory-items?${params}`, { headers, data: payload, timeout: 30000 });
  141 |       } catch (err: any) {
  142 |         if (attempt < 3) {
  143 |           console.warn(`[WARN] Item Creation API connection error on attempt ${attempt} (${err.message}). Retrying in ${attempt * 1000}ms...`);
  144 |           await new Promise(r => setTimeout(r, attempt * 1000));
  145 |           continue;
  146 |         }
  147 |         throw new Error(`Item Creation API Failed: ${err.message?.split('\n')[0] || 'network error'}`);
  148 |       }
  149 |       if (resp.ok()) {
  150 |         const json = await resp.json();
  151 |         const cost = typeof data === 'string' ? 1 : (data.unit_cost || 1);
  152 |         const sellPrice = typeof data === 'string' ? 1 : (data.selling_price || data.unit_cost || 1);
  153 |         return { itemName: json.name, id: json.id, itemId: json.id, locationId: payload.default_location_id || locId, warehouseId: payload.default_warehouse_id || warehouseId, unitCost: cost, sellingPrice: sellPrice };
  154 |       }
  155 |       const status = resp.status();
  156 |       const text = await resp.text();
  157 |       if (status === 400 && text.includes('Invalid location ID') && attempt < 3) {
  158 |         console.warn(`[WARN] Item Creation API failed with "Invalid location ID". Refreshing location metadata for attempt ${attempt + 1}...`);
  159 |         try {
  160 |           const freshLoc = await this.ensureDefaultLocationAPI();
  161 |           payload.default_location_id = freshLoc.locationId;
  162 |           payload.default_warehouse_id = freshLoc.warehouseId;
  163 |         } catch {}
  164 |         await new Promise(r => setTimeout(r, 1000 * attempt));
  165 |         continue;
  166 |       }
  167 |       if (status === 401) {
  168 |         const loginResp = await this.page.request.post(`${apiBase}/users/login?${params}&month=6`, {
  169 |           data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
  170 |           headers: { 'Content-Type': 'application/json' },
  171 |           timeout: 30000
  172 |         });
  173 |         if (loginResp.ok()) {
  174 |           const newToken = (await loginResp.json()).auth_token;
  175 |           if (newToken) {
  176 |             await this.page.evaluate((t) => { localStorage.setItem('token', t); localStorage.setItem('auth-token', t); }, newToken);
  177 |             headers['Authorization'] = `Bearer ${newToken}`;
  178 |             continue;
  179 |           }
  180 |         }
  181 |         throw new Error(`Item Creation API Failed: 401 Unauthorized`);
  182 |       }
  183 |       if ((status === 500 || status === 503) && attempt < 3) {
  184 |         await this.page.waitForTimeout(attempt * 2000);
  185 |         continue;
  186 |       }
> 187 |       throw new Error(`Item Creation API Failed: ${status} - ${text}`);
      |             ^ Error: Item Creation API Failed: 422 - {
  188 |     }
  189 |     throw new Error('Item Creation API Failed: exhausted retries');
  190 |   }
  191 | 
  192 |   async ensureDefaultLocationAPI(): Promise<{ locationId: string; warehouseId: string }> {
  193 |     const company = await this.resolveActiveCompanyAPI();
  194 |     const token = await this._getAuthToken();
  195 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
  196 |       .replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  197 |     if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  198 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  199 |     const headers = {
  200 |       'x-company': company,
  201 |       'Authorization': `Bearer ${token}`,
  202 |       'Content-Type': 'application/json',
  203 |       'x-role': 'IT Administrator / User Manager'
  204 |     };
  205 |     const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  206 | 
  207 |     const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=50&${params}`, { headers });
  208 |     if (locResp.ok()) {
  209 |       const locJson = await locResp.json();
  210 |       const locs = locJson.items || locJson.data || [];
  211 |       for (const loc of locs) {
  212 |         if (loc?.id) {
  213 |           const warehouseId = await this.resolveWarehouseIdFromLocation(loc);
  214 |           if (warehouseId) return { locationId: loc.id, warehouseId };
  215 |         }
  216 |       }
  217 |     }
  218 | 
  219 |     console.log('[SELF-HEALING] No usable location found — creating default warehouse + location...');
  220 |     const created = await this.ensureTransferLocationAPI(apiBase, params, headers);
  221 |     return { locationId: created.id, warehouseId: created.warehouse_id };
  222 |   }
  223 | 
  224 |   async discoverMetadataAPI(preferredCompany?: string): Promise<{ locationId: string, warehouseId: string, salesAccountId: string, customerId: string }> {
  225 |       const company = await this.resolveActiveCompanyAPI(preferredCompany);
  226 |       const token = await this._getAuthToken();
  227 |       let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
  228 |         .replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  229 |       if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  230 |       if (!apiBase.endsWith('/api')) apiBase += '/api';
  231 |       const headers = { 
  232 |         'x-company': company, 
  233 |         'Authorization': `Bearer ${token}`,
  234 |         'x-role': 'IT Administrator / User Manager'
  235 |       };
  236 |       const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  237 | 
  238 |       const { locationId, warehouseId } = await this.ensureDefaultLocationAPI();
  239 | 
  240 |       const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
  241 |       const acctJson = await acctResp.json();
  242 |       const sales = (acctJson.items || acctJson.data || []).find((a: any) => a.name?.toLowerCase().includes('sales'))?.id;
  243 | 
  244 |       const custResp = await this.safeGet(`${apiBase}/customers?page=1&pageSize=1&${params}`, { headers });
  245 |       const custJson = await custResp.json();
  246 |       const cust = (custJson.items?.[0] || custJson.data?.[0])?.id;
  247 |       if (!cust) throw new Error('[METADATA] No customers found. Ensure the environment has at least one customer.');
  248 | 
  249 |       return {
  250 |           locationId,
  251 |           warehouseId,
  252 |           salesAccountId: sales,
  253 |           customerId: cust
  254 |       };
  255 |   }
  256 | 
  257 |   async processAdjustmentAPI(id: string): Promise<void> {
  258 |       console.log(`[ACTION] Triggering API Process for Adjustment: ${id}`);
  259 |       let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  260 |       if (!apiBase.endsWith('/api')) apiBase += '/api';
  261 |       const token = await this._getAuthToken();
  262 |       
  263 |       const response = await this.page.request.post(`${apiBase}/inventory-adjustments/${id}/process`, {
  264 |           headers: { 
  265 |             'x-company': process.env.BEFFA_COMPANY as string, 
  266 |             'Authorization': `Bearer ${token}`,
  267 |             'x-role': 'IT Administrator / User Manager'
  268 |           },
  269 |           timeout: 30000
  270 |       });
  271 |       if (!response.ok() && response.status() !== 404) {
  272 |           console.warn(`[WARN] Adjustment processing returned ${response.status()}`);
  273 |       }
  274 |   }
  275 | 
  276 | 
  277 |   async createInventoryAdjustmentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; error?: string }> {
  278 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  279 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  280 |     const token = await this._getAuthToken();
  281 | 
  282 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  283 |     const resolvedDate = await _DH.resolve(this.page);
  284 |     const year = String(resolvedDate.ecYear);
  285 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  286 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  287 |     const params = `year=${year}&period=${period}&calendar=${calendar}`;
```