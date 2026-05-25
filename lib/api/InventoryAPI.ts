import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

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
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
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
    const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=100&${params}`, { headers });
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
        const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
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
        cost_method_code: typeof data === 'string' ? "FIFO" : (data.cost_method_code || "FIFO"),
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
        purchase_price: 0,
        selling_price: 0,
        unit_cost: typeof data === 'string' ? 0 : (data.unit_cost || 0),
        gl_sales_account_id: incAcct,
        gl_cost_account_id: expAcct,
        gl_inventory_account_id: invAcct,
        default_location_id: locId,
        default_warehouse_id: warehouseId,
        quantity: typeof data === 'string' ? 0 : (data.quantity || 0)
    };

    const resp = await this.page.request.post(`${apiBase}/inventory-items?${params}`, { headers, data: payload });
    if (!resp.ok()) throw new Error(`Item Creation API Failed: ${resp.status()} - ${await resp.text()}`);
    const json = await resp.json();
    return { itemName: json.name, id: json.id };
  }

  async discoverMetadataAPI(): Promise<{ locationId: string, warehouseId: string, salesAccountId: string, customerId: string }> {
      const token = await this._getAuthToken();
      let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
      if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
      if (!apiBase.endsWith('/api')) apiBase += '/api';
      const headers = { 
        'x-company': process.env.BEFFA_COMPANY as string, 
        'Authorization': `Bearer ${token}`,
        'x-role': 'IT Administrator / User Manager'
      };

      const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=1`, { headers });
      const locJson = await locResp.json();
      const loc = (locJson.items || locJson.data || [])[0];

      const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50`, { headers });
      const acctJson = await acctResp.json();
      const sales = (acctJson.items || acctJson.data || []).find((a: any) => a.name.toLowerCase().includes('sales'))?.id;

      const custResp = await this.page.request.get(`${apiBase}/customers?page=1&pageSize=1`, { headers });
      const custJson = await custResp.json();
      const cust = (custJson.items?.[0] || custJson.data?.[0])?.id;

      return {
          locationId: loc?.id,
          warehouseId: loc?.warehouse_id || loc?.warehouse?.id,
          salesAccountId: sales,
          customerId: cust
      };
  }

  async processAdjustmentAPI(id: string): Promise<void> {
      console.log(`[ACTION] Triggering API Process for Adjustment: ${id}`);
      let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
      if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
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
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
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
      const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
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
      const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
      const locData = await safeJson(locResp);
      if (locData) {
        const firstLoc = (locData.items || locData.data || [])[0];
        if (firstLoc) {
          locationId = locationId || firstLoc.id;
          warehouseId = warehouseId || firstLoc.warehouse_id || firstLoc.warehouse?.id;
        }
      }
    }

    const qty = data.quantity !== undefined ? data.quantity : (data.adjustedQuantity || 10);
    const unitCost = data.cost || 0;
    
    const payload = {
      adjusted_by: 'quantity',
      adjusted_cost: 0, 
      adjusted_quantity: qty,
      adjustment_account_id: adjustmentAccountId,
      inventory_item_id: data.itemId,
      is_write_down: data.isWriteDown !== undefined ? String(data.isWriteDown) : 'true',
      location_id: locationId,
      warehouse_id: warehouseId,
      date: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
      reason: data.reason || 'Automated E2E Adjustment',
      note: '',
      unit_cost: unitCost,
      unit_price: unitCost, // Alias
      total_cost: qty * unitCost,
      current_quantity: 0,  // From manual payload
      location_quantity: 0, // From manual payload
      skip_draft: false,
      status: 'draft'
    };

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
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
    
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
    let response = await this.page.request.get(`${apiBase}/inventory-items?${params}`, {
      headers: { 
        'x-company': process.env.BEFFA_COMPANY as string, 
        'Authorization': `Bearer ${token}`,
        'x-role': 'IT Administrator / User Manager'
      }
    });

    if (!response.ok()) {
       console.log(`[WARN] /inventory-items failed (${response.status()}). Trying fallback: /items`);
       response = await this.page.request.get(`${apiBase}/items?${params}`, {
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
      // STRICT REQUIREMENT: Item must have explicit location data linked to it to avoid 422 mismatch
      // AND it must have enough stock to satisfy the test requirement
      return locations.length > 0 && (locationStock >= minStock);
    });

    if (items.length === 0) {
      console.warn(`[WARN] No items with stock >= ${minStock} found via API. Search failed.`);
      return null as any; 
    }

    const target = items[Math.floor(Math.random() * items.length)];

    // Find the specific location that satisfied the minStock requirement
    const stockLocs = (target.inventory_item_locations || []).filter((loc: any) => (loc.quantity || 0) >= minStock);
    const bestLoc = stockLocs.sort((a: any, b: any) => (b.quantity || 0) - (a.quantity || 0))[0] || target.inventory_item_locations?.[0];

    const stock = bestLoc?.quantity || 0;

    return {
      itemName: target.name,
      itemId: target.id,
      currentStock: stock,
      unitCost: target.unit_cost || 0,
      locationId: bestLoc?.location_id,
      warehouseId: bestLoc?.location?.warehouse_id || bestLoc?.warehouse_id
    };
  }

  async getItemDetailsAPI(itemId: string, locationId?: string): Promise<{ itemName: string; itemId: string; currentStock: number; unitCost: number } | null> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
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

    let response = await this.page.request.get(`${apiBase}/inventory-item/${itemId}?${params}`, {
      headers: { 
        'x-company': process.env.BEFFA_COMPANY as string, 
        'Authorization': `Bearer ${token}`,
        'x-role': 'IT Administrator / User Manager'
      }
    });

    const json = await safeJson(response);

    if (!json) {
      console.log(`[INFO] Direct Item API for ${itemId} failed. Trying search...`);
      const searchResp = await this.page.request.get(`${apiBase}/inventory-item?search=${itemId}&${params}`, {
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

  async pollCostAPI(itemId: string, expectedCost: number, locationId?: string, maxRetries: number = 30): Promise<number> {
    console.log(`[ACTION] API Polling: Waiting for cost to hit ${expectedCost}...`);
    for (let i = 1; i <= maxRetries; i++) {
      const details = await this.getItemDetailsAPI(itemId, locationId);
      if (details && details.unitCost === expectedCost) {
        console.log(`[SUCCESS] API Confirmed: Cost correctly reached ${expectedCost}.`);
        return details.unitCost;
      }
      console.log(`[INFO] Attempt ${i}: Cost is ${details?.unitCost || 0}. Retrying in 2s...`);
      await this.page.waitForTimeout(2000);
    }
    return 0;
  }

  async getJournalEntriesAPI(receiptId: string): Promise<Array<{ accountCode: string; accountName: string; accountType: string; debit: string; credit: string }>> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    // Try singular invoice endpoint first
    let response = await this.page.request.get(`${apiBase}/invoice/${receiptId}?${params}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok() && response.status() === 404) {
      // fallback to plural invoices and generic receipt endpoint if needed
      response = await this.page.request.get(`${apiBase}/invoices/${receiptId}?${params}`, {
        headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok() && response.status() === 404) {
        response = await this.page.request.get(`${apiBase}/receipts/${receiptId}?${params}`, {
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

  // --- Missing Methods / Aliases for Compatibility ---
  async adjustStockAPI(data: any) { return this.createInventoryAdjustmentAPI(data); }
  async createEmployeeRequestAPI(data: any) { console.warn('Stub: createEmployeeRequestAPI'); return { id: 'stub' }; }
  async submitEmployeeRequestAPI(id: string) { console.warn('Stub: submitEmployeeRequestAPI'); }
  async consolidateRequestsAPI(ids: string[]) { console.warn('Stub: consolidateRequestsAPI'); return { id: 'stub' }; }
  async approveDepartmentRequestAPI(id: string) { console.warn('Stub: approveDepartmentRequestAPI'); }
  async reviewPropertyRequestAPI(id: string) { console.warn('Stub: reviewPropertyRequestAPI'); }
  async issueStoreRequestAPI(id: string) { console.warn('Stub: issueStoreRequestAPI'); }
  async executeTransferAPI(data: {
    itemId: string;
    quantity: number;
    fromLocationId: string;
    fromWarehouseId: string;
    toLocationId?: string;   // auto-discovered if omitted
    toWarehouseId?: string;
  }): Promise<{ outRef: string; inRef: string; fromLocationId: string; toLocationId: string }> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '').replace(':4173', ':8001') : 'http://localhost:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
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
    const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
    if (acctResp.ok()) {
      const acctData = await acctResp.json();
      const accounts = acctData.items || acctData.data || [];
      adjAccountId = accounts.find((a: any) => a.account_type?.toLowerCase().includes('expense'))?.id || accounts[0]?.id;
    }

    // 2. Discover destination location (different from source)
    let toLocationId  = data.toLocationId;
    let toWarehouseId = data.toWarehouseId;
    if (!toLocationId) {
      const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=20&${params}`, { headers });
      if (locResp.ok()) {
        const locData = await locResp.json();
        const locs = locData.items || locData.data || [];
        const dest = locs.find((l: any) => l.id !== data.fromLocationId);
        if (!dest) throw new Error('[TRANSFER] Could not find a second location for destination. Only one location exists.');
        toLocationId  = dest.id;
        toWarehouseId = dest.warehouse_id || dest.warehouse?.id;
      }
    }
    if (!toLocationId) throw new Error('[TRANSFER] No destination location resolved.');

    console.log(`[TRANSFER] OUT: ${data.fromLocationId} → IN: ${toLocationId} | Qty: ${data.quantity}`);

    const basePayload = {
      adjusted_by: 'quantity',
      adjusted_cost: 0,
      adjustment_account_id: adjAccountId,
      inventory_item_id: data.itemId,
      date: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
      note: '',
      reason: 'Automated E2E Warehouse Transfer',
      skip_draft: false,
      status: 'draft'
    };

    // 3. OUT adjustment at source (write-down / negative)
    const outPayload = {
      ...basePayload,
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

    // 4. IN adjustment at destination (add stock)
    const inPayload = {
      ...basePayload,
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
      toLocationId:   toLocationId!
    };
  }
}
