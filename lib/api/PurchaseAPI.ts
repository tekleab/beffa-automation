import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class PurchaseAPI extends BasePage {
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

  async discoverRandomVendorAPI(): Promise<{ id: string; name: string }> {
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY || 'smoke test';
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    
    const response = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=10&${params}`, {
      headers: { 'x-company': company, 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    const vendor = (data.items || data.data || [])[0];
    if (!vendor) throw new Error('Forensic Audit Blocked: No Vendors available in the system.');
    
    return { id: vendor.id, name: vendor.name };
  }

  async discoverMetadataAPI(): Promise<{ apAccountId: string; currencyId: string; taxId: string; locationId: string; warehouseId: string; vendorId: string; withholdingAccountId: string }> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY as string;
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': company, 'Authorization': `Bearer ${token}` };

    const safeJson = async (resp: any, label: string) => {
      const text = await resp.text();
      if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
      try { return JSON.parse(text); } catch (e) { throw new Error(`${label} returned invalid JSON: ${text.substring(0, 150)}`); }
    };

    console.log('[ACTION] Discovering purchase metadata (Accounts, Vendors, Currencies)...');

    // 1. Fetch Accounts
    const accResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=300&${params}`, { headers });
    const accData = await safeJson(accResp, 'Accounts Discovery');
    const allAccounts = accData.items || accData.data || [];
    
    // Improved AP discovery logic
    const apAccount = 
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('accounts payable')) ||
      allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) ||
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('payable')) ||
      allAccounts.find((a: any) => a.type?.name?.toLowerCase().includes('payable')) ||
      allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('liability')) ||
      allAccounts[1] || allAccounts[0];

    // Discovery Withholding Account (Prioritize Payable for Purchases)
    const wtAccount = 
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('withholding tax payable')) ||
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('withholding payable')) ||
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('withholding')) ||
      apAccount;

    console.log(`[META] Discovered AP: "${apAccount?.name}" | WT: "${wtAccount?.name}"`);

    // 2. Fetch Currency
    const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = currData.items?.[0] || currData.data?.[0];

    // 3. Fetch Tax
    const taxResp = await this.page.request.get(`${apiBase}/taxes?${params}`, { headers });
    const taxData = await safeJson(taxResp, 'Tax Discovery');
    const tax = taxData.items?.[0] || taxData.data?.[0];

    // 4. Fetch Location/Warehouse
    const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
    let locationId = '', warehouseId = '';
    if (locResp.ok()) {
      const locData = await locResp.json();
      const firstLoc = (locData.items || locData.data || [])[0];
      if (firstLoc) {
        locationId = firstLoc.id;
        warehouseId = firstLoc.warehouse_id || firstLoc.warehouse?.id || '';
      }
    }

    // 5. Fetch Vendor
    const vendorResp = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=5&${params}`, { headers });
    const vendorData = await safeJson(vendorResp, 'Vendor Discovery');
    const vendor = (vendorData.items || vendorData.data || [])[0];

    return {
      apAccountId: apAccount?.id || '',
      currencyId: currency?.id || '',
      taxId: tax?.id || '',
      locationId,
      warehouseId,
      vendorId: vendor?.id || '',
      withholdingAccountId: wtAccount?.id || ''
    };
  }

  async createPurchaseOrderAPI(itemData: Record<string, any> = {}, qty: number = 10, unitPrice: number = 5000, vendorId: string | null = null): Promise<{ success: boolean; poNumber: string; poId: string }> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY as string;
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const safeJson = async (resp: any, label: string) => {
      const text = await resp.text();
      if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
      try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
    };

    // 1. Discover Vendor
    let resolvedVendorId = vendorId;
    if (!resolvedVendorId) {
      const vendorResp = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=10`, { headers });
      const vendorData = await safeJson(vendorResp, 'Vendor Discovery');
      const vendor = vendorData.items?.[0] || vendorData.data?.[0];
      if (!vendor) throw new Error('PO Discovery Failed: No vendors found.');
      resolvedVendorId = vendor.id;
      console.log(`[ACTION] Discovered Vendor: "${vendor.name}"`);
    }

    // 2. Discover Accounts (AP + GL)
    const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50`, { headers });
    const acctData = await safeJson(acctResp, 'Accounts Discovery');
    const allAccounts = acctData.items || acctData.data || [];
    const apAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
    const glAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];

    // 4. Discover Locations if missing
    let locationId = itemData.locationId;
    let warehouseId = itemData.warehouseId;
    if (!locationId || !warehouseId) {
      const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10`, { headers });
      const locData = await safeJson(locResp, 'Location Discovery');
      const firstLoc = (locData.items || locData.data || [])[0];
      if (firstLoc) {
        locationId = firstLoc.id;
        warehouseId = firstLoc.warehouse_id || firstLoc.warehouse?.id;
      }
    }
    // 5. Discover Currency if missing
    const currResp = await this.page.request.get(`${apiBase}/currency?page=1&pageSize=5`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = (currData.items || currData.data || [])[0];

    const payload = {
      accounts_payable_id: apAccount?.id,
      currency_id: currency?.id,
      po_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      po_items: [{
        item_id: itemData.itemId,
        general_ledger_account_id: glAccount?.id,
        location_id: locationId,
        quantity: qty,
        tax_id: itemData.taxId || null,
        unit_price: unitPrice,
        warehouse_id: warehouseId,
        description: `Purchase of ${itemData.itemName}`
      }],
      purchase_type_id: 4,
      vendor_id: resolvedVendorId
    };

    const response = await this.safePost(`${apiBase}/purchase-orders?year=${year}&period=${period}&calendar=${calendar}`, {
      data: payload,
      headers,
      label: 'Create Purchase Order'
    });

    if (!response.ok()) throw new Error(`PO API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] PO created via API: ${json.po_number} (ID: ${json.id})`);
    return { success: true, poNumber: json.po_number, poId: json.id };
  }

  async createBillAPI(params: { itemData?: Record<string, any>; itemId?: string; quantity?: number; qty?: number; unitPrice?: number; vendorId?: string | null; apAccountId?: string | null; description?: string } = {}): Promise<{ success: boolean; ref: string; id: string }> {
    const { itemData = {}, itemId = null, quantity = 10, qty = 10, unitPrice = 5000, vendorId = null, apAccountId = null, description = null } = params;
    const finalQty = quantity || qty;
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY as string;
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const qs = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const safeJson = async (resp: any, label: string) => {
      const text = await resp.text();
      if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
      try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
    };

    // 1. Discover Vendor - always use company-scoped discovery (never trust hardcoded UUIDs)
    let resolvedVendorId = vendorId;
    if (!resolvedVendorId) {
      // Use same pattern as createPurchaseOrderAPI which works reliably
      const vendorResp = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=10`, { headers });
      const vendorData = await safeJson(vendorResp, 'Vendor Discovery');
      const vendor = vendorData.items?.[0] || vendorData.data?.[0];
      if (!vendor) throw new Error('Bill Discovery Failed: No vendors found in current company.');
      resolvedVendorId = vendor.id;
      console.log(`[ACTION] Discovered Vendor: "${vendor.name}" (ID: ${resolvedVendorId})`);
    }

    // 2. Discover Accounts (AP + GL)
    const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
    const acctData = await safeJson(acctResp, 'Accounts Discovery');
    const allAccounts = acctData.items || acctData.data || [];
    
    // Improved strict AP discovery
    const discoveredAp = 
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('accounts payable')) ||
      allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || 
      allAccounts[0];

    const glAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];

    // 3. Discover Currency
    const currResp = await this.page.request.get(`${apiBase}/currency?${qs}`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = currData.items?.[0] || currData.data?.[0];

    // 4. Discover Locations if missing
    let locationId = itemData.locationId;
    let warehouseId = itemData.warehouseId;
    if (!locationId || !warehouseId) {
      const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${qs}`, { headers });
      const locData = await safeJson(locResp, 'Location Discovery');
      const firstLoc = (locData.items || locData.data || [])[0];
      if (firstLoc) {
        locationId = firstLoc.id;
        warehouseId = firstLoc.warehouse_id || firstLoc.warehouse?.id;
      }
    }

    const payload = {
      accounts_payable_id: apAccountId || discoveredAp?.id,
      currency_id: currency?.id,
      invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      items: [{
        item_id: itemData.itemId || itemData.id,
        general_ledger_account_id: glAccount?.id,
        location_id: locationId,
        quantity: qty,
        tax_id: itemData.taxId || null,
        unit_price: unitPrice,
        warehouse_id: warehouseId,
        description: description || `Audit Bill of ${itemData.itemName || itemData.name}`,
        amount: qty * unitPrice
      }],
      vendor_id: resolvedVendorId,
      status: 'draft'
    };

    const response = await this.safePost(`${apiBase}/bills?${qs}`, {
      data: payload,
      headers,
      label: 'Create Bill'
    });

    if (!response.ok()) throw new Error(`Bill API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Bill created via API: ${json.invoice_number} (ID: ${json.id})`);
    return { success: true, ref: json.invoice_number, id: json.id };
  }
  async createBillFromPoAPI(poId: string): Promise<{ success: boolean; billNumber: string; billId: string }> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY as string;
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const safeJson = async (resp: any, label: string) => {
      const text = await resp.text();
      if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
      try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
    };

    // 1. Fetch the Purchase Order to gather its precise mapping metadata
    console.log(`[ACTION] Fetching PO Context for ID: ${poId}...`);
    const poResp = await this.page.request.get(`${apiBase}/purchase-order/${poId}?${params}`, { headers });
    const poData = await safeJson(poResp, `Fetch PO ${poId}`);
    
    // 2. Discover Accounts Payable ID for validation overlay
    const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
    const acctData = await safeJson(acctResp, 'Accounts Discovery');
    const allAccounts = acctData.items || acctData.data || [];
    const apAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];

    // 3. Map strictly into `received_purchase_order_items`
    const receivedItems = (poData.po_items || []).map((item: any) => ({
      po_item_id: item.id,
      received_quantity: item.quantity,
      received_unit_price: item.unit_price
    }));

    if (receivedItems.length === 0) throw new Error(`PO ${poId} lacks interactable line-items.`);

    const payload = {
      accounts_payable_id: apAccount?.id,
      currency_id: poData.currency_id || poData.currency?.id,
      due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      items: [], // MUST be completely empty for a linked PO bill
      purchase_order_id: poId,
      vendor_id: poData.vendor_id || poData.vendor?.id,
      received_purchase_order_items: receivedItems,
      status: 'draft'
    };

    const response = await this.safePost(`${apiBase}/bills?${params}`, {
      data: payload,
      headers,
      label: 'Create API Bill from PO'
    });

    if (!response.ok()) throw new Error(`PO-to-Bill API Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] PO directly converted to Bill via API: ${json.invoice_number}`);
    return { success: true, billNumber: json.invoice_number, billId: json.id };
  }

  async verifyBillInVendorAPI(vendorName: string, billNumber: string): Promise<boolean> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY as string;
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': company, 'Authorization': `Bearer ${token}` };

    // 1. Resolve Vendor ID from Name
    console.log(`[ACTION] API Verifying: Resolving ID for Vendor "${vendorName}"...`);
    const vendResp = await this.page.request.get(`${apiBase}/vendors?page=1&pageSize=50&${params}`, { headers });
    const vendData = await vendResp.json();
    const vendor = (vendData.items || vendData.data || []).find((v: any) => v.name.toLowerCase() === vendorName.toLowerCase());
    
    if (!vendor) throw new Error(`API Verification Failed: Could not find Vendor "${vendorName}" in the system.`);
    const vendorId = vendor.id;

    // 2. Poll Vendor Bills Ledger (max 15 tries for indexing = ~30s)
    console.log(`[ACTION] API Verifying: Scanning Ledger for ${billNumber}...`);
    const safeJson = async (resp: any, label: string) => {
        const text = await resp.text();
        if (!resp.ok()) return null;
        try { return JSON.parse(text); } catch (e) { return null; }
    };

    for (let i = 0; i < 15; i++) {
        const billResp = await this.page.request.get(`${apiBase}/vendor/${vendorId}/bills?${params}`, { headers });
        const billData = await safeJson(billResp, 'Vendor Ledger');
        if (!billData) {
            console.log(`[WARN] Ledger API busy or returned error. Retrying...`);
        } else {
            const bills = billData.data || billData.items || [];
            const found = bills.find((b: any) => b.invoice_number === billNumber);
            if (found) {
                console.log(`[SUCCESS] API Confirmed: Bill ${billNumber} is physically present in ${vendorName}'s ledger.`);
                return true;
            }
        }
        console.log(`[INFO] Bill not found in ledger yet (Index pending). Attempt ${i+1}/15. Retrying in 2s...`);
        await this.page.waitForTimeout(2000);
    }

    throw new Error(`[ERROR] API Verification Failed: Bill ${billNumber} never appeared in "${vendorName}" ledger.`);
  }

  async createBillPaymentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY as string;
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': company, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    const safeJson = async (resp: any, label: string) => {
      const text = await resp.text();
      if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
      try { return JSON.parse(text); } catch (e) { throw new Error(`${label} invalid JSON: ${text.substring(0, 150)}`); }
    };

    // 1. Discover Accounts
    const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
    const acctData = await safeJson(acctResp, 'Accounts Discovery');
    const allAccounts = acctData.items || acctData.data || [];
    const cashAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')) || allAccounts[0];

    // 2. Discover Currency
    const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = currData.items?.[0] || currData.data?.[0];

    let resolvedCashAccountId = data.cashAccountId || cashAccount?.id;
    
    // In test we sometimes explicitly pass null to trigger validation error
    if ('cashAccountId' in data && data.cashAccountId === null) {
      resolvedCashAccountId = null;
    }

    const payload = {
      amount: data.amount,
      cash_account_id: resolvedCashAccountId,
      vendor_id: data.vendorId, // Tests usually supply this
      date: new Date().toISOString(),
      payment_method: 'cash',
      currency_id: currency?.id,
      bill_payments: [{
        amount: data.amount,
        bill_id: data.billId
      }]
    };

    console.log(`[ACTION] Creating Bill Payment for ${data.billId} via API (CashAcct: ${resolvedCashAccountId})...`);
    const response = await this.page.request.post(`${apiBase}/payments?${params}`, {
      data: payload,
      headers
    });

    if (!response.ok()) throw new Error(`Bill-Payment API Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Payment created: ${json.ref} (ID: ${json.id})`);
    return { success: true, ref: json.ref, id: json.id };
  }

  async getBillAPI(billId: string): Promise<any> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    const response = await this.page.request.get(`${apiBase}/bill/${billId}?${params}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!response.ok()) throw new Error(`Failed to fetch Bill ${billId}: ${response.status()}`);
    return await response.json();
  }

  async getPaymentAPI(paymentId: string): Promise<any> {
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const params = `year=${year}&period=yearly&calendar=ec`;
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const response = await this.page.request.get(`${apiBase}/payments/${paymentId}?${params}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY || 'smoke test', 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }

  async reverseBillAPI(billId: string): Promise<boolean> {
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const params = `year=${year}&period=yearly&calendar=ec`;

    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    console.log(`[ACTION] Reversing/Voiding Bill ${billId} via API...`);
    const response = await this.page.request.patch(`${apiBase}/bills/${billId}/void?${params}`, {
      data: { status: 'reversed' },
      headers: {
        'x-company': process.env.BEFFA_COMPANY as string,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) {
      console.error(`[ERROR] Bill Reversal failed (${response.status()}): ${await response.text()}`);
      return false;
    }
    return true;
  }

  async approvePaymentAPI(paymentId: string): Promise<boolean> {
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const params = `year=${year}&period=yearly&calendar=ec`;

    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    console.log(`[ACTION] Approving Payment ${paymentId} via API...`);
    const response = await this.page.request.patch(`${apiBase}/payments/${paymentId}?${params}`, {
      data: { status: 'approved' },
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.ok();
  }

  async findUnpaidBillAPI(): Promise<{ billId: string; billNumber: string; amount: number; vendorId: string; vendorName: string } | null> {
    const token = await this._getAuthToken();
    const company = process.env.BEFFA_COMPANY || 'smoke test';
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `status=approved&year=${year}&period=${period}&calendar=${calendar}`;
    
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    console.log(`[ACTION] API Discovery: Scanning for unpaid approved bills in "${company}"...`);
    const response = await this.page.request.get(`${apiBase}/bills?pageSize=50&${params}`, {
      headers: { 'x-company': company, 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok()) return null;
    const json = await response.json();
    const unpaid = (json.data || json.items || []).find((b: any) => parseFloat(b.balance) > 0);
    
    if (unpaid) {
      console.log(`[OK] API Found Bill: ${unpaid.invoice_number} | Balance: ${unpaid.balance} | Vendor: ${unpaid.vendor?.name}`);
      return {
        billId: unpaid.id,
        billNumber: unpaid.invoice_number,
        amount: parseFloat(unpaid.balance),
        vendorId: unpaid.vendor_id,
        vendorName: unpaid.vendor?.name || 'Unknown Vendor'
      };
    }
    return null;
  }

  async getBillJournalEntriesAPI(billId: string): Promise<Array<{ accountCode: string; accountName: string; debit: number; credit: number }>> {
    const json = await this.getBillAPI(billId);
    const journal = json.purchase_journal;

    if (!journal || !journal.journal_entries) return [];

    return journal.journal_entries.map((entry: any) => ({
      accountCode: entry.account.account_id,
      accountName: entry.account.name,
      debit: entry.debit || 0,
      credit: entry.credit || 0
    }));
  }
}
