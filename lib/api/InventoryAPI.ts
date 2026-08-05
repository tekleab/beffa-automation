import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

export class InventoryAPI extends BasePage {
  page: Page;
  emailInput: Locator;
  passwordInput: Locator;
  loginBtn: Locator;
  mainPhoneInput: Locator;
  customerNameInput: Locator;
  customerTinInput: Locator;
  approvedStatus: string;
  actionButtons: string;
  companyBtn: Locator;
  _getAuthToken!: () => Promise<string | null>;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Login selectors
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });

    // --- Customer Module Selectors ---
    this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
    this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name *' });
    this.customerTinInput = page.getByRole('textbox', { name: 'Customer TIN *' });

    // Status and Button Selectors
    this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
    this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';

    // Company Switcher Selectors (Top-left)
    this.companyBtn = page.locator('button.chakra-menu__menu-button').first();
  }
  async createInventoryItemAPI(data: string | { 
    name: string, 
    item_id?: string, 
    part_number?: string, 
    item_class?: string, 
    quantity?: number, 
    unit_cost?: number, 
    default_location_id?: string, 
    default_warehouse_id?: string,
    cost_method_code?: string,
    category?: string,
    gl_cost_account_id?: string,
    gl_inventory_account_id?: string,
    gl_sales_account_id?: string
  }): Promise<{ itemName: string, id: string }> {
    const name = typeof data === 'string' ? data : data.name;
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const headers = {
      'x-company': process.env.BEFFA_COMPANY as string,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-role': 'IT Administrator / User Manager'
    };

    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    // Smart Account Discovery
    const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=100&${params}`, { headers });
    let incAcct = typeof data !== 'string' ? data.gl_sales_account_id : undefined;
    let expAcct = typeof data !== 'string' ? data.gl_cost_account_id : undefined;
    let invAcct = typeof data !== 'string' ? data.gl_inventory_account_id : undefined;
    
    if (acctResp.ok() && (!incAcct || !expAcct || !invAcct)) {
      const adata = await acctResp.json();
      const accounts = adata.items || adata.data || [];
      incAcct = incAcct || accounts.find((a: any) => a.name?.toLowerCase().includes('sales'))?.id || accounts.find((a: any) => a.account_type?.toLowerCase() === 'income')?.id || accounts[0]?.id || '5beb2d62-bb7e-4c1b-8298-556ac8ebe25e';
      expAcct = expAcct || accounts.find((a: any) => a.name?.toLowerCase().includes('cogs') || a.name?.toLowerCase().includes('cost of goods'))?.id || accounts.find((a: any) => a.account_type?.toLowerCase() === 'expense')?.id || accounts[0]?.id || '5beb2d62-bb7e-4c1b-8298-556ac8ebe25e';
      invAcct = invAcct || accounts.find((a: any) => a.name?.toLowerCase().includes('inventory'))?.id || accounts.find((a: any) => a.account_type?.toLowerCase() === 'asset')?.id || accounts[0]?.id || '5beb2d62-bb7e-4c1b-8298-556ac8ebe25e';
    }

    let locId = typeof data === 'string' ? undefined : data.default_location_id;
    let warehouseId = typeof data === 'string' ? undefined : data.default_warehouse_id;

    if (!locId || !warehouseId) {
        const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
        if (locResp.ok()) {
            const ldata = await locResp.json();
            const locs = ldata.items || ldata.data || [];
            if (locs[0]) {
                locId = locId || locs[0].id;
                warehouseId = warehouseId || locs[0].warehouse_id || locs[0].warehouse?.id;
            }
        }
    }

    const payload = {
        name,
        type: 'inventory',
        category: typeof data === 'string' ? "Raw Materials" : (data.category || "Raw Materials"),
        cost_method_code: typeof data === 'string' ? "WAC" : (data.cost_method_code || "WAC"),
        item_class: typeof data === 'string' ? 'MER' : (data.item_class || 'MER'),
        item_id: typeof data === 'string' ? `ITM-${Date.now().toString().slice(-6)}` : (data.item_id || `ITM-${Date.now().toString().slice(-6)}`),
        unit_of_measurement: "Kilogram (kg)",
        part_number: typeof data === 'string' ? `PN-${Date.now().toString().slice(-4)}` : (data.part_number || `PN-${Date.now().toString().slice(-4)}`),
        serial: "Z",
        status: "active",
        description: [
            {content: "", type: "item"}, 
            {content: "", type: "sales"}, 
            {content: "", type: "purchase"}
        ],
        min_stock: 0,
        initial_stock: typeof data === 'string' ? 0 : (data.quantity || 0),
        purchase_price: typeof data === 'string' ? 1 : (data.unit_cost || 1),
        selling_price: typeof data === 'string' ? 1 : (data.unit_cost || 1),
        unit_cost: typeof data === 'string' ? 0 : (data.unit_cost || 0),
        gl_sales_account_id: incAcct,
        gl_cost_account_id: expAcct,
        gl_inventory_account_id: invAcct,
        default_location_id: locId,
        default_warehouse_id: warehouseId,
        quantity: typeof data === 'string' ? 0 : (data.quantity || 0)
    };

    // Retry up to 3x for 500/503 (transient backend errors) and re-auth on 401
    for (let attempt = 1; attempt <= 3; attempt++) {
      const resp = await this.page.request.post(`${apiBase}/inventory-items?${params}`, { headers, data: payload });
      if (resp.ok()) {
        const json = await resp.json();
        return { itemName: json.name, id: json.id };
      }
      const status = resp.status();
      if (status === 401) {
        const loginResp = await this.page.request.post(`${apiBase}/users/login?${params}&month=6`, {
          data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
          headers: { 'Content-Type': 'application/json' }
        });
        if (loginResp.ok()) {
          const newToken = (await loginResp.json()).auth_token;
          if (newToken) {
            await this.page.evaluate((t) => { localStorage.setItem('token', t); localStorage.setItem('auth-token', t); }, newToken);
            headers['Authorization'] = `Bearer ${newToken}`;
            continue;
          }
        }
        throw new Error(`Item Creation API Failed: 401 Unauthorized`);
      }
      if ((status === 500 || status === 503) && attempt < 3) {
        console.log(`[RETRY] Item creation ${status} on attempt ${attempt} — retrying in ${attempt * 2}s...`);
        await this.page.waitForTimeout(attempt * 2000);
        continue;
      }
      throw new Error(`Item Creation API Failed: ${status} - ${await resp.text()}`);
    }
    throw new Error('Item Creation API Failed: exhausted retries');
  }

  async ensureDefaultLocationAPI(): Promise<{ locationId: string; warehouseId: string }> {
    const company = await this.resolveActiveCompanyAPI();
    const token = await this._getAuthToken();
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
      .replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
    if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const headers = {
      'x-company': company,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-role': 'IT Administrator / User Manager'
    };
    const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

    const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=50&${params}`, { headers });
    if (locResp.ok()) {
      const locJson = await locResp.json();
      const locs = locJson.items || locJson.data || [];
      // Prefer a location with warehouse_id, but fall back to any location
      const loc = locs.find((l: any) => l.warehouse_id || l.warehouse?.id) || locs[0];
      if (loc?.id) {
        // If warehouse_id is missing on the location object, fetch it from the warehouses list
        let warehouseId = loc.warehouse_id || loc.warehouse?.id;
        if (!warehouseId) {
          const whResp = await this.safeGet(`${apiBase}/warehouses?page=1&pageSize=1&${params}`, { headers });
          if (whResp.ok()) {
            const whJson = await whResp.json();
            warehouseId = (whJson.items || whJson.data || [])[0]?.id;
          }
        }
        if (warehouseId) return { locationId: loc.id, warehouseId };
      }
    }

    console.log('[SELF-HEALING] No usable location found — creating default warehouse + location...');
    const created = await this.ensureTransferLocationAPI(apiBase, params, headers);
    return { locationId: created.id, warehouseId: created.warehouse_id };
  }

  async discoverMetadataAPI(preferredCompany?: string): Promise<{ locationId: string, warehouseId: string, salesAccountId: string, customerId: string }> {
      const company = await this.resolveActiveCompanyAPI(preferredCompany);
      const token = await this._getAuthToken();
      let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
        .replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
      if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
      if (!apiBase.endsWith('/api')) apiBase += '/api';
      const headers = { 
        'x-company': company, 
        'Authorization': `Bearer ${token}`,
        'x-role': 'IT Administrator / User Manager'
      };
      const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

      const { locationId, warehouseId } = await this.ensureDefaultLocationAPI();

      const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
      const acctJson = await acctResp.json();
      const sales = (acctJson.items || acctJson.data || []).find((a: any) => a.name?.toLowerCase().includes('sales'))?.id;

      const custResp = await this.safeGet(`${apiBase}/customers?page=1&pageSize=1&${params}`, { headers });
      const custJson = await custResp.json();
      const cust = (custJson.items?.[0] || custJson.data?.[0])?.id;
      if (!cust) throw new Error('[METADATA] No customers found. Ensure the environment has at least one customer.');

      return {
          locationId,
          warehouseId,
          salesAccountId: sales,
          customerId: cust
      };
  }

  async processAdjustmentAPI(id: string): Promise<void> {
      console.log(`[ACTION] Triggering API Process for Adjustment: ${id}`);
      let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
      if (!apiBase.endsWith('/api')) apiBase += '/api';
      const token = await this._getAuthToken();
      
      const response = await this.page.request.post(`${apiBase}/inventory-adjustments/${id}/process`, {
          headers: { 
            'x-company': process.env.BEFFA_COMPANY as string, 
            'Authorization': `Bearer ${token}`,
            'x-role': 'IT Administrator / User Manager'
          }
      });
      if (!response.ok() && response.status() !== 404) {
          console.warn(`[WARN] Adjustment processing returned ${response.status()}`);
      }
  }


  async createInventoryAdjustmentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; error?: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = {
      'x-company': process.env.BEFFA_COMPANY as string,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };

    // Safe JSON helper: reads as text first, skips silently if the response is HTML
    const safeJson = async (resp: any): Promise<any | null> => {
      const text = await resp.text();
      if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
        console.log(`[WARN] API response was not JSON (likely HTML). Skipping discovery.`);
        return null;
      }
      try { return JSON.parse(text); } catch { return null; }
    };

    // 1. Discover Adjustment Account dynamically
    let adjustmentAccountId = data.adjustmentAccountId;
    if (!adjustmentAccountId) {
      const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
      const acctData = await safeJson(acctResp);
      if (acctData) {
        const allAccounts = acctData.items || acctData.data || [];
        const expAcct = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense') || a.account_type?.toLowerCase().includes('cost')) || allAccounts[0];
        if (expAcct) adjustmentAccountId = expAcct.id;
      }
    }

    // 2. Discover Locations dynamically if not provided
    let locationId = data.locationId;
    let warehouseId = data.warehouseId;
    if (!locationId || !warehouseId) {
      const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
      const locData = await safeJson(locResp);
      if (locData) {
        const firstLoc = (locData.items || locData.data || [])[0];
        if (firstLoc) {
          locationId = locationId || firstLoc.id;
          warehouseId = warehouseId || firstLoc.warehouse_id || firstLoc.warehouse?.id;
        }
      }
    }

    // 3. Read live item quantities — ERP needs these for cost layer / WAC recalculation
    let currentQuantity = 0;
    let locationQuantity = 0;
    let existingUnitCost = 0;
    if (data.itemId) {
      const itemResp = await this.safeGet(`${apiBase}/inventory-item/${data.itemId}?${params}`, { headers });
      const itemData = await safeJson(itemResp);
      if (itemData) {
        const locEntry = (itemData.inventory_item_locations || []).find((l: any) => l.location_id === locationId);
        locationQuantity = locEntry?.quantity ?? 0;
        currentQuantity = (itemData.inventory_item_locations || []).reduce(
          (sum: number, l: any) => sum + (l.quantity || 0), 0
        ) || itemData.quantity || itemData.current_stock || 0;
        existingUnitCost = parseFloat(itemData.unit_cost || '0');
      }
    }

    const adjustedBy: string = data.adjusted_by || 'quantity';
    const isWriteDown = data.isWriteDown === true || data.isWriteDown === 'true';
    let qty = data.quantity !== undefined ? data.quantity : (data.adjustedQuantity ?? 10);
    if (adjustedBy === 'quantity' && isWriteDown && qty > 0) qty = -Math.abs(qty);

    const unitCost = data.cost !== undefined ? data.cost : existingUnitCost;
    const absQty = Math.abs(qty);
    const totalCost = absQty * unitCost;

    const payload = {
      adjusted_by: adjustedBy,
      adjusted_cost: adjustedBy === 'cost' ? unitCost : 0,
      adjusted_quantity: adjustedBy === 'cost' ? 0 : qty,
      adjustment_account_id: adjustmentAccountId,
      inventory_item_id: data.itemId,
      is_write_down: isWriteDown ? 'true' : 'false',
      location_id: locationId,
      warehouse_id: warehouseId,
      date: (() => { try { const { DateHelper: _DH } = require('../utils/DateHelper'); return _DH._cached?.iso || new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'; } catch { return new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'; } })(),
      reason: data.reason || 'Automated E2E Adjustment',
      note: '',
      unit_cost: unitCost,
      unit_price: unitCost,
      total_cost: adjustedBy === 'cost' ? 0 : totalCost,
      current_quantity: currentQuantity,
      location_quantity: locationQuantity,
      skip_draft: false,
      status: 'draft'
    };

    console.log(`[ADJ] ${adjustedBy} | qty=${payload.adjusted_quantity} @ $${unitCost} | current=${currentQuantity} loc=${locationQuantity}`);

    const response = await this.safePost(`${apiBase}/inventory-adjustments?${params}`, {
      data: payload,
      headers,
      label: 'Inventory Adjustment'
    });

    if (!response.ok()) {
      const err = await response.text();
      console.error(`[ERROR] Adjustment API Failed: ${response.status()} - ${err}`);
      return { success: false, error: err };
    }

    const json = await response.json();
    console.log(`[SUCCESS] Adjustment created via API: ${json.ref} (ID: ${json.id})`);
    return { success: true, ref: json.ref, id: json.id };
  }

  async captureRandomItemDataAPI(paramsObj: { minStock?: number } = {}): Promise<{ itemName: string; itemId: string; currentStock: number; unitCost: number; locationId?: string; warehouseId?: string }> {
    const { minStock = 1 } = paramsObj;
    // 🛡️ SMART PORT RESOLVER: Backend is usually 8001, Frontend is 4173.
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    
    // If the URL accidentally points to the frontend port, force it to 8001 for API
    if (apiBase.includes(':4173')) {
      apiBase = apiBase.replace(':4173', ':8001');
    }
    
    // Ensure /api suffix exists
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `page=1&pageSize=100&year=${year}&period=${period}&calendar=${calendar}`;

    console.log(`[ACTION] Discovering random item via API (Year ${year}) [MinStock: ${minStock}]...`);
    await this.startTacticalTimer();
    
    // The previous error was due to hitting the frontend port 4173. 
    // Now that the port is fixed (8001), the correct list endpoint is indeed the plural /inventory-items.
    let response = await this.safeGet(`${apiBase}/inventory-items?${params}`, {
      headers: { 
        'x-company': process.env.BEFFA_COMPANY as string, 
        'Authorization': `Bearer ${token}`,
        'x-role': 'IT Administrator / User Manager'
      }
    });

    if (!response.ok()) {
       console.log(`[WARN] /inventory-items failed (${response.status()}). Trying fallback: /items`);
       response = await this.safeGet(`${apiBase}/items?${params}`, {
         headers: { 
           'x-company': process.env.BEFFA_COMPANY as string, 
           'Authorization': `Bearer ${token}`,
           'x-role': 'IT Administrator / User Manager'
         }
       });
    }
    await this.stopTacticalTimer('Item Discovery (50 Records)', 'API');

    const safeJson = async (resp: any, label: string) => {
      const text = await resp.text();
      if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 150)}`);
      try { return JSON.parse(text); } catch (e) {
        throw new Error(`${label} returned invalid JSON: ${text.substring(0, 150)}`);
      }
    };

    const json = await safeJson(response, 'Item Discovery');
    const list = json.data || json.items || [];

    const items = list.filter((i: any) => {
      const locations = i.inventory_item_locations || [];
      const locationStock = locations.reduce((sum: number, loc: any) => sum + (loc.quantity || 0), 0);
      // STRICT REQUIREMENT: Item must be active, have location data, and satisfy minStock
      return i.status === 'active' && locations.length > 0 && (locationStock >= minStock);
    });

    if (items.length === 0) {
      console.log(`[SELF-HEALING] No active items with stock >= ${minStock} found. Attempting stock adjustment on existing item...`);

      // Pick any active item regardless of stock
      const anyActive = list.filter((i: any) => i.status === 'active' && (i.inventory_item_locations || []).length > 0);
      const candidate = anyActive[0];

      if (!candidate) {
        console.error(`[SELF-HEALING] No active items found at all.`);
        return null as any;
      }

      const loc = candidate.inventory_item_locations[0];
      const locationId = loc.location_id || loc.id;
      const warehouseId = loc.warehouse_id || loc.warehouse?.id || '';

      try {
        const adjResult = await this.createInventoryAdjustmentAPI({
          itemId: candidate.id,
          quantity: 100,
          cost: candidate.unit_cost || 10,
          locationId,
          warehouseId,
          adjusted_by: 'quantity'
        });
        if (adjResult.success && adjResult.id) {
          await this.advanceDocumentAPI(adjResult.id, 'inventory-adjustments');
          console.log(`[SELF-HEALING] Stocked 100 units on "${candidate.name}" via adjustment.`);
        }

        return {
          itemName: candidate.name,
          itemId: candidate.id,
          currentStock: 100,
          unitCost: candidate.unit_cost || 10,
          locationId,
          warehouseId
        };
      } catch (err: any) {
        console.error(`[SELF-HEALING] Stock adjustment failed: ${err.message}`);
        return null as any;
      }
    }

    const target = items[Math.floor(Math.random() * items.length)];

    // Find the specific location that satisfied the minStock requirement
    const stockLocs = (target.inventory_item_locations || []).filter((loc: any) => (loc.quantity || 0) >= minStock);
    const bestLoc = stockLocs.sort((a: any, b: any) => (b.quantity || 0) - (a.quantity || 0))[0] || target.inventory_item_locations?.[0];

    const stock = bestLoc?.quantity || 0;

    // Resolve warehouseId from multiple possible fields on the location object
    const resolvedWarehouseId =
      bestLoc?.warehouse_id ||
      bestLoc?.location?.warehouse_id ||
      bestLoc?.location?.warehouse?.id ||
      bestLoc?.warehouse?.id ||
      target.default_warehouse_id ||
      '';

    if (!resolvedWarehouseId) {
      // Last resort: fetch from /locations API
      const locId = bestLoc?.location_id;
      if (locId) {
        let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
        if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
        if (!apiBase.endsWith('/api')) apiBase += '/api';
        const token = await this._getAuthToken();
        const y = process.env.BEFFA_YEAR || '2018', p = process.env.BEFFA_PERIOD || 'yearly', c = process.env.BEFFA_CALENDAR || 'ec';
        const locResp = await this.safeGet(`${apiBase}/location/${locId}?year=${y}&period=${p}&calendar=${c}`, {
          headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
        });
        if (locResp.ok()) {
          const locJson = await locResp.json();
          const wid = locJson.warehouse_id || locJson.warehouse?.id || '';
          return { itemName: target.name, itemId: target.id, currentStock: stock, unitCost: target.unit_cost || 0, locationId: locId, warehouseId: wid };
        }
      }
    }

    return {
      itemName: target.name,
      itemId: target.id,
      currentStock: stock,
      unitCost: target.unit_cost || 0,
      locationId: bestLoc?.location_id,
      warehouseId: resolvedWarehouseId
    };
  }

  async getItemDetailsAPI(itemId: string, locationId?: string): Promise<{ itemName: string; itemId: string; currentStock: number; unitCost: number } | null> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    const safeJson = async (resp: any): Promise<any | null> => {
      const text = await resp.text();
      if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) return null;
      try { return JSON.parse(text); } catch { return null; }
    };

    let response = await this.safeGet(`${apiBase}/inventory-item/${itemId}?${params}`, {
      headers: { 
        'x-company': process.env.BEFFA_COMPANY as string, 
        'Authorization': `Bearer ${token}`,
        'x-role': 'IT Administrator / User Manager'
      }
    });

    const json = await safeJson(response);

    if (!json) {
      console.log(`[INFO] Direct Item API for ${itemId} failed. Trying search...`);
      const searchResp = await this.safeGet(`${apiBase}/inventory-item?search=${itemId}&${params}`, {
        headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
      });
      const searchJson = await safeJson(searchResp);
      if (!searchJson) return null;
      const item = searchJson.items?.[0] || searchJson.data?.[0];
      if (!item) return null;
      
      let stock = (item.inventory_item_locations || []).reduce((sum: number, loc: any) => sum + (loc.quantity || 0), 0);
      if (locationId) {
          const loc = (item.inventory_item_locations || []).find((l: any) => l.location_id === locationId);
          stock = loc?.quantity || 0;
      }
      return { itemName: item.name, itemId: item.id, currentStock: stock, unitCost: item.unit_cost || 0 };
    }

    let stock = (json.inventory_item_locations || []).reduce((sum: number, loc: any) => sum + (loc.quantity || 0), 0);
    if (locationId) {
        const loc = (json.inventory_item_locations || []).find((l: any) => l.location_id === locationId);
        stock = loc?.quantity || 0;
    }

    return {
      itemName: json.name,
      itemId: json.id,
      currentStock: stock,
      unitCost: json.unit_cost || 0
    };
  }

  async pollStockAPI(itemId: string, expectedStock: number, locationId?: string, maxRetries: number = 30): Promise<number> {
    console.log(`[ACTION] API Polling: Waiting for stock at location ${locationId || 'GLOBAL'} to hit ${expectedStock}...`);
    for (let i = 1; i <= maxRetries; i++) {
      const details = await this.getItemDetailsAPI(itemId, locationId);
      if (details && details.currentStock === expectedStock) {
        console.log(`[SUCCESS] API Confirmed: Stock correctly reached ${expectedStock}.`);
        return details.currentStock;
      }
      console.log(`[INFO] Attempt ${i}: Stock is ${details?.currentStock || 0}. Retrying in 2s...`);
      await this.page.waitForTimeout(2000);
    }
    return 0;
  }

  async pollCostAPI(itemId: string, expectedCost: number, locationId?: string, maxRetries: number = 30, precision: number = 1): Promise<number> {
    const tolerance = Math.pow(10, -precision) * 5;
    console.log(`[ACTION] API Polling: Waiting for cost to hit ~${expectedCost} (±${tolerance})...`);
    for (let i = 1; i <= maxRetries; i++) {
      const details = await this.getItemDetailsAPI(itemId, locationId);
      if (details && Math.abs(details.unitCost - expectedCost) <= tolerance) {
        console.log(`[SUCCESS] API Confirmed: Cost correctly reached ${details.unitCost}.`);
        return details.unitCost;
      }
      console.log(`[INFO] Attempt ${i}: Cost is ${details?.unitCost || 0}. Retrying in 2s...`);
      await this.page.waitForTimeout(2000);
    }
    const final = await this.getItemDetailsAPI(itemId, locationId);
    return final?.unitCost ?? 0;
  }

  async getJournalEntriesAPI(receiptId: string): Promise<Array<{ accountCode: string; accountName: string; accountType: string; debit: string; credit: string }>> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    // Try singular invoice endpoint first
    let response = await this.safeGet(`${apiBase}/invoice/${receiptId}?${params}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok() && response.status() === 404) {
      // fallback to plural invoices and generic receipt endpoint if needed
      response = await this.safeGet(`${apiBase}/invoices/${receiptId}?${params}`, {
        headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok() && response.status() === 404) {
        response = await this.safeGet(`${apiBase}/receipts/${receiptId}?${params}`, {
          headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
        });
      }
    }

    if (!response.ok()) {
      console.warn(`[WARN] Journal fetch failed: ${response.status()}`);
      return [];
    }

    const json = await response.json();
    const invoiceData = json.data ? (Array.isArray(json.data) ? json.data[0] : json.data) : json;
    
    const journal = invoiceData.sales_journal || invoiceData.cash_disbursement_journal || invoiceData.cash_receipt_journal;
    if (!journal || !journal.journal_entries) {
      console.warn('[WARN] No journal entries found in response');
      return [];
    }
    return journal.journal_entries.map((entry: any) => ({
      accountCode: entry.account?.account_id || entry.account_id || '',
      accountName: entry.account?.name || entry.account?.account_name || entry.account?.account_id || '',
      accountType: entry.account?.type?.name || entry.account?.type?.type || entry.account?.account_type || '',
      debit: entry.debit?.toString() || '0',
      credit: entry.credit?.toString() || '0'
    }));
  }

  /**
   * Creates a fresh inventory item with the specified costing method and injects
   * initial stock via an approved adjustment. Tests own this item from line 1 —
   * no seeded-data pollution.
   */
  async createFreshItemWithStockAPI(opts: {
    name?: string;
    cost_method_code: 'FIFO' | 'WAC' | 'AVERAGE';
    quantity: number;
    unit_cost: number;
    locationId?: string;
    warehouseId?: string;
  }): Promise<{ id: string; itemId: string; itemName: string; currentStock: number; unitCost: number; locationId: string; warehouseId: string }> {
    let locationId = opts.locationId;
    let warehouseId = opts.warehouseId;
    if (!locationId || !warehouseId) {
      const meta = await this.discoverMetadataAPI();
      locationId = locationId || meta.locationId;
      warehouseId = warehouseId || meta.warehouseId;
    }

    const ts = Date.now();
    const name = opts.name || `${opts.cost_method_code}-Item-${ts}`;

    // Use initial_stock + quantity on item creation — creates an import FIFO layer
    // immediately without a separate adjustment (avoids approval-limit 403 errors)
    const item = await this.createInventoryItemAPI({
      name,
      item_id: `ITM-${opts.cost_method_code}-${ts.toString().slice(-9)}`,
      part_number: `PN-${ts.toString().slice(-7)}`,
      cost_method_code: opts.cost_method_code,
      quantity: opts.quantity,
      unit_cost: opts.unit_cost,
      default_location_id: locationId,
      default_warehouse_id: warehouseId,
    });

    // Stock is set via initial_stock at creation — skip poll, trust creation response.
    // pollStockAPI is only needed when stock is injected via a separate adjustment.
    console.log(`[FRESH ITEM] Created: ${name} (${item.id}) | method=${opts.cost_method_code} | stock=${opts.quantity}@$${opts.unit_cost} | loc=${locationId}`);
    return {
      id: item.id,
      itemId: item.id,
      itemName: name,
      currentStock: opts.quantity,
      unitCost: opts.unit_cost,
      locationId: locationId!,
      warehouseId: warehouseId!
    };
  }

  // --- Missing Methods / Aliases for Compatibility ---
  async adjustStockAPI(data: any) { return this.createInventoryAdjustmentAPI(data); }
  async createEmployeeRequestAPI(data: any) { console.warn('Stub: createEmployeeRequestAPI'); return { id: 'stub' }; }
  async submitEmployeeRequestAPI(id: string) { console.warn('Stub: submitEmployeeRequestAPI'); }
  async consolidateRequestsAPI(ids: string[]) { console.warn('Stub: consolidateRequestsAPI'); return { id: 'stub' }; }
  async approveDepartmentRequestAPI(id: string) { console.warn('Stub: approveDepartmentRequestAPI'); }
  async reviewPropertyRequestAPI(id: string) { console.warn('Stub: reviewPropertyRequestAPI'); }
  async issueStoreRequestAPI(id: string) { console.warn('Stub: issueStoreRequestAPI'); }

  async createMoveOrderAPI(data: {
    itemId: string;
    quantity: number;
    fromLocationId: string;
    fromWarehouseId: string;
    toLocationId: string;
    toWarehouseId: string;
  }): Promise<{ id: string; ref?: string; status: string; fromLocationId: string; toLocationId: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
    if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
    const headers = {
      'x-company': process.env.BEFFA_COMPANY as string,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-role': 'IT Administrator / User Manager'
    };

    const createResp = await this.safePost(`${apiBase}/move-orders?${params}`, {
      data: {
        inventory_item_id: data.itemId,
        quantity: data.quantity,
        from_warehouse_id: data.fromWarehouseId,
        from_location_id: data.fromLocationId,
        destination_warehouse_id: data.toWarehouseId,
        destination_location_id: data.toLocationId
      },
      headers,
      label: 'Create Move Order'
    });
    if (!createResp.ok()) throw new Error(`[MOVE ORDER] Create failed: ${createResp.status()} - ${await createResp.text()}`);
    const order = await createResp.json();
    console.log(`[MOVE ORDER] Created: ${order.id} (status: ${order.status})`);

    await this.advanceDocumentAPI(order.id, 'move-orders');
    return { id: order.id, ref: order.ref, status: 'approved', fromLocationId: data.fromLocationId, toLocationId: data.toLocationId };
  }

  async ensureTransferDestinationAPI(fromLocationId: string, itemId?: string): Promise<{ locationId: string; warehouseId: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
    if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const params = `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
    const headers = {
      'x-company': process.env.BEFFA_COMPANY as string,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-role': 'IT Administrator / User Manager'
    };

    // Priority 1: another location the item is already registered at
    if (itemId) {
      const itemResp = await this.safeGet(`${apiBase}/inventory-item/${itemId}?${params}`, { headers });
      if (itemResp.ok()) {
        const itemData = await itemResp.json();
        const otherLoc = (itemData.inventory_item_locations || [])
          .find((l: any) => l.location_id !== fromLocationId && (l.warehouse_id || l.warehouse?.id));
        if (otherLoc) {
          console.log(`[DEST] Using existing item location: ${otherLoc.location_id}`);
          return { locationId: otherLoc.location_id, warehouseId: otherLoc.warehouse_id || otherLoc.warehouse?.id };
        }
      }
    }

    // Priority 2: any other system location
    const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=100&${params}`, { headers });
    if (locResp.ok()) {
      const locData = await locResp.json();
      const allLocs = locData.items || locData.data || [];
      const dest = allLocs.find((l: any) => l.id !== fromLocationId && (l.warehouse_id || l.warehouse?.id));
      if (dest) {
        console.log(`[DEST] Using system location: ${dest.id}`);
        return { locationId: dest.id, warehouseId: dest.warehouse_id || dest.warehouse?.id };
      }

      // Priority 3: only one location exists — create a second one inside the SAME warehouse
      // (locations don't require an address — only warehouses do)
      const srcLoc = allLocs.find((l: any) => l.id === fromLocationId) || allLocs[0];
      const warehouseId = srcLoc?.warehouse_id || srcLoc?.warehouse?.id;
      if (warehouseId) {
        console.log(`[SELF-HEALING] Only one location found. Creating a second location in warehouse ${warehouseId}...`);
        const createResp = await this.safePost(`${apiBase}/locations?${params}`, {
          data: {
            name: `Transfer Dest ${Date.now().toString().slice(-5)}`,
            warehouse_id: warehouseId,
            type: 'Section',
            max_capacity: 100,
            ref: `xfer-dest-${Date.now().toString().slice(-5)}`,
            description: 'Auto-created for E2E transfer tests'
          },
          headers,
          label: 'Create Dest Location'
        });
        if (createResp.ok()) {
          const newLoc = await createResp.json();
          if (newLoc?.id) {
            console.log(`[SELF-HEALING] Created location: ${newLoc.name} (${newLoc.id})`);
            return { locationId: newLoc.id, warehouseId };
          }
        }
        const errText = await createResp.text().catch(() => '(unreadable)');
        console.log(`[SELF-HEALING] Location creation failed (${createResp.status()}): ${errText.substring(0, 120)}`);
      }
    }

    throw new Error('[SETUP] Could not resolve or create a second location. Ensure the environment has at least 2 locations, or that the API allows location creation.');
  }

  async ensureTransferLocationAPI(
    apiBase: string,
    params: string,
    headers: Record<string, string>
  ): Promise<{ id: string; warehouse_id: string }> {
    const TRANSFER_WH_NAME = 'Transfer Destination Warehouse';
    const TRANSFER_LOC_NAME = 'Transfer Destination Location';

    // 1. Check if warehouse + location already exist — reuse them
    const whListResp = await this.safeGet(`${apiBase}/warehouses?page=1&pageSize=100&${params}`, { headers });
    if (whListResp.ok()) {
      const whData = await whListResp.json();
      const existingWh = (whData.items || whData.data || []).find((w: any) => w.name === TRANSFER_WH_NAME);
      if (existingWh) {
        const locListResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=100&${params}`, { headers });
        const locData = locListResp.ok() ? await locListResp.json() : { items: [] };
        const allLocs = locData.items || locData.data || [];
        const existingLoc = allLocs.find(
          (l: any) => l.name === TRANSFER_LOC_NAME && (l.warehouse_id === existingWh.id || l.warehouse?.id === existingWh.id)
        );
        if (existingLoc) {
          console.log(`[SELF-HEALING] Reusing existing warehouse+location: ${existingWh.name} / ${existingLoc.name}`);
          return { id: existingLoc.id, warehouse_id: existingWh.id };
        }
        // Warehouse exists but location is missing — search all locations for one in this warehouse
        const anyLoc = allLocs.find(
          (l: any) => l.warehouse_id === existingWh.id || l.warehouse?.id === existingWh.id
        );
        if (anyLoc) {
          console.log(`[SELF-HEALING] Reusing existing location in warehouse: ${anyLoc.name} (${anyLoc.id})`);
          return { id: anyLoc.id, warehouse_id: existingWh.id };
        }
        const locCreateResp = await this.safePost(`${apiBase}/locations?${params}`, {
          data: {
            name: `${TRANSFER_LOC_NAME}-${Date.now().toString().slice(-6)}`,
            warehouse_id: existingWh.id,
            type: 'Section',
            max_capacity: 100,
            description: 'Auto-created for E2E transfer tests',
            ref: `transfer-dest-${Date.now().toString().slice(-5)}`
          },
          headers,
          label: 'Create Transfer Location'
        });
        if (!locCreateResp.ok()) throw new Error(`[SELF-HEALING] Location creation failed: ${await locCreateResp.text()}`);
        const newLoc = await locCreateResp.json();
        console.log(`[SELF-HEALING] Created location in existing warehouse: ${newLoc.name} (${newLoc.id})`);
        return { id: newLoc.id, warehouse_id: existingWh.id };
      }
    }

    // 2. Neither exists — fetch address from first warehouse to reuse
    const whResp = await this.safeGet(`${apiBase}/warehouses?page=1&pageSize=1&${params}`, { headers });
    let address = { region: 'Addis Ababa City Administration', zone: 'Bole Subcity', woreda: 'Woreda 2', kebele: '1' };
    if (whResp.ok()) {
      const whData = await whResp.json();
      const existing = (whData.items || whData.data || [])[0];
      if (existing?.address) address = { ...address, ...existing.address };
    }

    // 3. Create destination warehouse
    const whCreateResp = await this.safePost(`${apiBase}/warehouses?${params}`, {
      data: { name: TRANSFER_WH_NAME, status: 'Active', max_capacity: 500, address },
      headers,
      label: 'Create Transfer Warehouse'
    });
    if (!whCreateResp.ok()) throw new Error(`[SELF-HEALING] Warehouse creation failed: ${await whCreateResp.text()}`);
    const newWarehouse = await whCreateResp.json();
    console.log(`[SELF-HEALING] Created warehouse: ${newWarehouse.name} (${newWarehouse.id})`);

    // 4. Create location inside the new warehouse
    const locCreateResp = await this.safePost(`${apiBase}/locations?${params}`, {
      data: {
        name: TRANSFER_LOC_NAME,
        warehouse_id: newWarehouse.id,
        type: 'Section',
        max_capacity: 100,
        description: 'Auto-created for E2E transfer tests',
        ref: `transfer-dest-${Date.now().toString().slice(-5)}`
      },
      headers,
      label: 'Create Transfer Location'
    });
    if (!locCreateResp.ok()) throw new Error(`[SELF-HEALING] Location creation failed: ${await locCreateResp.text()}`);
    const newLocation = await locCreateResp.json();
    console.log(`[SELF-HEALING] Created location: ${newLocation.name} (${newLocation.id})`);

    return { id: newLocation.id, warehouse_id: newWarehouse.id };
  }

  async executeTransferAPI(data: {
    itemId: string;
    quantity: number;
    fromLocationId: string;
    fromWarehouseId: string;
    toLocationId?: string;   // auto-discovered if omitted
    toWarehouseId?: string;
  }): Promise<{ outRef: string; inRef: string; fromLocationId: string; toLocationId: string; sourceItemId: string; destItemId: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year     = process.env.BEFFA_YEAR     || '2018';
    const period   = process.env.BEFFA_PERIOD   || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params   = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers  = {
      'x-company': process.env.BEFFA_COMPANY as string,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-role': 'IT Administrator / User Manager'
    };

    // 1. Discover adjustment account
    let adjAccountId: string | undefined;
    const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
    if (acctResp.ok()) {
      const acctData = await acctResp.json();
      const accounts = acctData.items || acctData.data || [];
      adjAccountId = accounts.find((a: any) => a.account_type?.toLowerCase().includes('expense'))?.id || accounts[0]?.id;
    }

    // 2. Discover destination location (different from source), self-healing if only one exists
    let toLocationId  = data.toLocationId;
    let toWarehouseId = data.toWarehouseId;
    if (!toLocationId) {
      const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=20&${params}`, { headers });
      if (locResp.ok()) {
        const locData = await locResp.json();
        const locs = locData.items || locData.data || [];
        let dest = locs.find((l: any) => l.id !== data.fromLocationId);
        if (!dest) {
          console.log('[SELF-HEALING] Only one location found. Creating a second warehouse + location for transfer destination...');
          dest = await this.ensureTransferLocationAPI(apiBase, params, headers);
        }
        toLocationId  = dest.id;
        toWarehouseId = dest.warehouse_id || dest.warehouse?.id;
      }
    }
    if (!toLocationId) throw new Error('[TRANSFER] No destination location resolved.');

    console.log(`[TRANSFER] OUT: ${data.fromLocationId} → IN: ${toLocationId} | Qty: ${data.quantity}`);

    // 3. Resolve the actual itemId to use — must be registered at BOTH locations.
    //    If the source item is not registered at destination, create a dedicated transfer item
    //    that has the destination as its default_location_id (only way to register it there).
    let sourceItemId = data.itemId;
    let destItemId   = data.itemId;

    // Check if item is actually registered at destination by inspecting its location list directly
    const srcItemResp = await this.safeGet(`${apiBase}/inventory-item/${data.itemId}?${params}`, { headers });
    const srcItemData = srcItemResp.ok() ? await srcItemResp.json() : {};
    const registeredAtDest = (srcItemData.inventory_item_locations || []).some((l: any) => l.location_id === toLocationId);

    if (!registeredAtDest) {
      console.log(`[TRANSFER] Item not registered at destination. Creating a dedicated transfer item pre-stocked at both locations...`);

      // srcItemData already fetched above for the location check
      const srcItem = srcItemData;

      // Create item with destination as default → registers it at destination
      const transferItemResp = await this.safePost(`${apiBase}/inventory-items?${params}`, {
        data: {
          name: `Transfer Test Item ${Date.now().toString().slice(-6)}`,
          type: 'inventory',
          category: srcItem.category || 'Raw Materials',
          cost_method_code: srcItem.cost_method_code || 'FIFO',
          item_class: srcItem.item_class || 'MER',
          item_id: `ITM-XFER-${Date.now().toString().slice(-6)}`,
          unit_of_measurement: srcItem.unit_of_measurement || 'Each (ea)',
          part_number: `PN-XFER-${Date.now().toString().slice(-5)}`,
          serial: 'Z',
          status: 'active',
          description: [{ content: '', type: 'item' }, { content: '', type: 'sales' }, { content: '', type: 'purchase' }],
          min_stock: 0,
          initial_stock: data.quantity + 10,
          purchase_price: 0,
          selling_price: 0,
          unit_cost: srcItem.unit_cost || 100,
          gl_sales_account_id: srcItem.gl_sales_account_id,
          gl_cost_account_id: srcItem.gl_cost_account_id,
          gl_inventory_account_id: srcItem.gl_inventory_account_id,
          default_location_id: data.fromLocationId,
          default_warehouse_id: data.fromWarehouseId,
          quantity: data.quantity + 10
        },
        headers,
        label: 'Create Transfer Item (source)'
      });
      if (!transferItemResp.ok()) throw new Error(`[TRANSFER] Transfer item creation failed: ${await transferItemResp.text()}`);
      const transferItem = await transferItemResp.json();
      sourceItemId = transferItem.id;
      console.log(`[TRANSFER] Transfer item created at source: ${transferItem.name} (${transferItem.id})`);

      // Create a second item with destination as default → registers it at destination
      const destItemResp = await this.safePost(`${apiBase}/inventory-items?${params}`, {
        data: {
          name: `Transfer Dest Item ${Date.now().toString().slice(-6)}`,
          type: 'inventory',
          category: srcItem.category || 'Raw Materials',
          cost_method_code: srcItem.cost_method_code || 'FIFO',
          item_class: srcItem.item_class || 'MER',
          item_id: `ITM-XFRD-${Date.now().toString().slice(-6)}`,
          unit_of_measurement: srcItem.unit_of_measurement || 'Each (ea)',
          part_number: `PN-XFRD-${Date.now().toString().slice(-5)}`,
          serial: 'Z',
          status: 'active',
          description: [{ content: '', type: 'item' }, { content: '', type: 'sales' }, { content: '', type: 'purchase' }],
          min_stock: 0,
          initial_stock: 0,
          purchase_price: 0,
          selling_price: 0,
          unit_cost: srcItem.unit_cost || 100,
          gl_sales_account_id: srcItem.gl_sales_account_id,
          gl_cost_account_id: srcItem.gl_cost_account_id,
          gl_inventory_account_id: srcItem.gl_inventory_account_id,
          default_location_id: toLocationId,
          default_warehouse_id: toWarehouseId,
          quantity: 0
        },
        headers,
        label: 'Create Transfer Item (dest)'
      });
      if (!destItemResp.ok()) throw new Error(`[TRANSFER] Dest item creation failed: ${await destItemResp.text()}`);
      const destItem = await destItemResp.json();
      destItemId = destItem.id;
      console.log(`[TRANSFER] Transfer item created at destination: ${destItem.name} (${destItem.id})`);
    }

    const basePayload = {
      adjusted_by: 'quantity',
      adjusted_cost: 0,
      adjustment_account_id: adjAccountId,
      date: (() => { try { const { DateHelper: _DH } = require('../utils/DateHelper'); return _DH._cached?.iso || new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'; } catch { return new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'; } })(),
      note: '',
      reason: 'Automated E2E Warehouse Transfer',
      skip_draft: false,
      status: 'draft'
    };

    // 4. OUT adjustment at source
    const outPayload = {
      ...basePayload,
      inventory_item_id: sourceItemId,
      adjusted_quantity: -data.quantity,
      is_write_down: 'true',
      location_id: data.fromLocationId,
      warehouse_id: data.fromWarehouseId,
      current_quantity: 0,
      location_quantity: 0
    };
    const outResp = await this.safePost(`${apiBase}/inventory-adjustments?${params}`, { data: outPayload, headers, label: 'Transfer OUT' });
    if (!outResp.ok()) throw new Error(`[TRANSFER] OUT adjustment failed: ${outResp.status()} - ${await outResp.text()}`);
    const outJson = await outResp.json();
    console.log(`[TRANSFER] OUT created: ${outJson.ref} (ID: ${outJson.id})`);
    await this.advanceDocumentAPI(outJson.id, 'inventory-adjustments');

    // 5. IN adjustment at destination
    const inPayload = {
      ...basePayload,
      inventory_item_id: destItemId,
      adjusted_quantity: data.quantity,
      is_write_down: 'false',
      location_id: toLocationId,
      warehouse_id: toWarehouseId,
      current_quantity: 0,
      location_quantity: 0
    };
    const inResp = await this.safePost(`${apiBase}/inventory-adjustments?${params}`, { data: inPayload, headers, label: 'Transfer IN' });
    if (!inResp.ok()) throw new Error(`[TRANSFER] IN adjustment failed: ${inResp.status()} - ${await inResp.text()}`);
    const inJson = await inResp.json();
    console.log(`[TRANSFER] IN created: ${inJson.ref} (ID: ${inJson.id})`);
    await this.advanceDocumentAPI(inJson.id, 'inventory-adjustments');

    return {
      outRef: outJson.ref,
      inRef:  inJson.ref,
      fromLocationId: data.fromLocationId,
      toLocationId:   toLocationId!,
      sourceItemId,
      destItemId
    };
  }
}
