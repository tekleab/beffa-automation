
class InventoryAPI {
  constructor(page) {
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

  async createInventoryAdjustmentAPI(data = {}) {
    const apiBase = "http://157.180.20.112:8001/api";

    // Defaults from user capture
    const warehouseId = data.warehouseId || "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4";
    const locationId = data.locationId || "2595ebb0-4e78-4bc5-9321-140d3fd316c7";
    const adjustmentAccountId = data.adjustmentAccountId || "f17570eb-6533-4249-8eba-e77a4ea92d43";

    const payload = {
      adjusted_by: "quantity",
      adjusted_cost: 0,
      adjusted_quantity: data.adjustedQuantity || 10,
      adjustment_account_id: adjustmentAccountId,
      inventory_item_id: data.itemId, // REQUIRED
      is_write_down: data.isWriteDown !== undefined ? String(data.isWriteDown) : "true",
      location_id: locationId,
      warehouse_id: warehouseId,
      date: new Date().toISOString().split('T')[0] + "T00:00:00Z",
      reason: data.reason || "Automated E2E Adjustment",
      note: "",
      skip_draft: false,
      status: "draft"
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/inventory-adjustments?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: {
        'x-company': 'befa tutorial',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
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

  async captureRandomItemDataAPI() {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    // 🛡️ ERP system is currently in 2018 Ethiopian Calendar (2026 GC)
    const params = "page=1&pageSize=50&year=2018&period=yearly&calendar=ec";

    console.log("[ACTION] Discovering random item via API (Year 2018)...");
    const response = await this.page.request.get(`${apiBase}/inventory-items?${params}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok()) throw new Error(`Item API discovery failed: ${response.status()}`);

    const json = await response.json();
    const list = json.data || json.items || [];
    
    // 🛡️ Optimized logic: Filter items that have stock in ANY location
    const items = list.filter(i => {
      const locationStock = (i.inventory_item_locations || []).reduce((sum, loc) => sum + (loc.quantity || 0), 0);
      return (i.current_stock > 0) || (i.quantity > 0) || (locationStock > 0);
    });

    if (items.length === 0) throw new Error("No items with stock found via API");

    const target = items[Math.floor(Math.random() * Math.min(items.length, 10))];
    
    // Extract stock from locations for the selected target
    const stock = (target.inventory_item_locations || []).reduce((sum, loc) => sum + (loc.quantity || 0), 0) 
                || target.current_stock || target.quantity || 0;

    return {
      itemName: target.name,
      itemId: target.id,
      currentStock: stock,
      unitCost: target.unit_cost || 0
    };
  }

  async getItemDetailsAPI(itemId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    const params = "year=2018&period=yearly&calendar=ec";

    let response = await this.page.request.get(`${apiBase}/inventory-item/${itemId}?${params}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok()) {
      console.log(`[INFO] Direct Item API for ${itemId} failed (${response.status()}). Trying search...`);
      // 🛡️ Try search with the plural endpoint (guessed based on singular)
      const searchResp = await this.page.request.get(`${apiBase}/inventory-item?search=${itemId}&${params}`, {
        headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
      });
      if (!searchResp.ok()) {
        console.log(`[INFO] Search Item API failed: ${searchResp.status()}`);
        return null;
      }
      const searchJson = await searchResp.json();
      const item = searchJson.items?.[0] || searchJson.data?.[0]; // Support different response keys
      if (!item) return null;
      return { itemName: item.name, itemId: item.id, currentStock: item.current_stock || 0, unitCost: item.unit_cost || 0 };
    }

    const json = await response.json();
    const stock = (json.inventory_item_locations || []).reduce((sum, loc) => sum + (loc.quantity || 0), 0)
                || json.current_stock || json.quantity || 0;

    return {
      itemName: json.name,
      itemId: json.id,
      currentStock: stock,
      unitCost: json.unit_cost || 0
    };
  }

  async getJournalEntriesAPI(receiptId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();

    console.log(`[ACTION] Fetching Journal via API for UUID: ${receiptId}`);
    const response = await this.page.request.get(`${apiBase}/receipts/${receiptId}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`API Fetch Failed: ${response.status()}`);
    const json = await response.json();
    const journal = json.cash_disbursement_journal;

    if (!journal || !journal.journal_entries) {
      console.log("[WARNING] No journal entries found in API response yet.");
      return [];
    }

    return journal.journal_entries.map(entry => ({
      accountCode: entry.account.account_id,
      accountName: entry.account.name,
      debit: entry.debit.toString(),
      credit: entry.credit.toString()
    }));
  }

}
module.exports = { InventoryAPI };
