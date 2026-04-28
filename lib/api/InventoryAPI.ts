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

  async createInventoryAdjustmentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; error?: string }> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
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

    const payload = {
      adjusted_by: 'quantity',
      adjusted_cost: 0,
      adjusted_quantity: data.adjustedQuantity || 10,
      adjustment_account_id: adjustmentAccountId,
      inventory_item_id: data.itemId, // REQUIRED
      is_write_down: data.isWriteDown !== undefined ? String(data.isWriteDown) : 'true',
      location_id: locationId,
      warehouse_id: warehouseId,
      date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      reason: data.reason || 'Automated E2E Adjustment',
      note: '',
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
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    
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
    const params = `page=1&pageSize=50&year=${year}&period=${period}&calendar=${calendar}`;

    console.log(`[ACTION] Discovering random item via API (Year ${year}) [MinStock: ${minStock}]...`);
    await this.startTacticalTimer();
    
    // The previous error was due to hitting the frontend port 4173. 
    // Now that the port is fixed (8001), the correct list endpoint is indeed the plural /inventory-items.
    let response = await this.page.request.get(`${apiBase}/inventory-items?${params}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok()) {
       console.log(`[WARN] /inventory-items failed (${response.status()}). Trying fallback: /items`);
       response = await this.page.request.get(`${apiBase}/items?${params}`, {
         headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
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

    const target = items[Math.floor(Math.random() * Math.min(items.length, items.length < 5 ? items.length : 5))];

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
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
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
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
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
    for (let i = 0; i < maxRetries; i++) {
        const details = await this.getItemDetailsAPI(itemId, locationId);
        const current = details?.currentStock || 0;
        if (current === expectedStock) {
            console.log(`[SUCCESS] API Confirmed: Stock correctly reached ${expectedStock}.`);
            return current;
        }
        console.log(`[INFO] Attempt ${i+1}: Stock is ${current}. Retrying in 2s...`);
        await this.page.waitForTimeout(2000);
    }
    const finalDetails = await this.getItemDetailsAPI(itemId, locationId);
    return finalDetails?.currentStock || 0;
  }

  async getJournalEntriesAPI(receiptId: string): Promise<Array<{ accountCode: string; accountName: string; debit: string; credit: string }>> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    
    console.log(`[ACTION] Fetching Journal via API for UUID: ${receiptId}`);
    // TRY SINGULAR FIRST (ERP pattern for detail views)
    let response = await this.page.request.get(`${apiBase}/receipt/${receiptId}?${params}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
    });

    if (response.status() === 404) {
        console.log(`[INFO] Singular endpoint 404. Trying plural: /receipts/${receiptId}`);
        response = await this.page.request.get(`${apiBase}/receipts/${receiptId}?${params}`, {
            headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
        });
    }

    if (!response.ok()) {
      console.log(`[WARN] Journals API failed: ${response.status()}`);
      return [];
    }

    const text = await response.text();
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
        console.log(`[WARN] Journals API returned non-JSON response.`);
        return [];
    }

    const json = JSON.parse(text);
    const journal = json.cash_disbursement_journal || json.cash_receipt_journal;

    if (!journal || !journal.journal_entries) {
      console.log('[WARNING] No journal entries found in API response yet.');
      return [];
    }

    return journal.journal_entries.map((entry: any) => ({
      accountCode: entry.account.account_id,
      accountName: entry.account.name,
      debit: entry.debit.toString(),
      credit: entry.credit.toString()
    }));
  }
}
