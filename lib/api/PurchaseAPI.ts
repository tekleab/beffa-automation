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

  async createBillAPI(itemData: Record<string, any> = {}, qty: number = 10, unitPrice: number = 5000, vendorId: string | null = null): Promise<{ success: boolean; billNumber: string; billId: string }> {
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
    const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
    const acctData = await safeJson(acctResp, 'Accounts Discovery');
    const allAccounts = acctData.items || acctData.data || [];
    const apAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('payable')) || allAccounts[0];
    const glAccount = allAccounts.find((a: any) => a.account_type?.toLowerCase().includes('expense')) || allAccounts[1] || allAccounts[0];

    // 3. Discover Currency
    const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = currData.items?.[0] || currData.data?.[0];

    // 4. Discover Locations if missing
    let locationId = itemData.locationId;
    let warehouseId = itemData.warehouseId;
    if (!locationId || !warehouseId) {
      const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
      const locData = await safeJson(locResp, 'Location Discovery');
      const firstLoc = (locData.items || locData.data || [])[0];
      if (firstLoc) {
        locationId = firstLoc.id;
        warehouseId = firstLoc.warehouse_id || firstLoc.warehouse?.id;
      }
    }

    const payload = {
      accounts_payable_id: apAccount?.id,
      currency_id: currency?.id,
      invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      items: [{
        item_id: itemData.itemId,
        general_ledger_account_id: glAccount?.id,
        location_id: locationId,
        quantity: qty,
        tax_id: itemData.taxId || null,
        unit_price: unitPrice,
        warehouse_id: warehouseId,
        description: `Direct Bill of ${itemData.itemName}`,
        amount: qty * unitPrice
      }],
      vendor_id: resolvedVendorId,
      status: 'draft'
    };

    const response = await this.safePost(`${apiBase}/bills?${params}`, {
      data: payload,
      headers,
      label: 'Create Bill'
    });

    if (!response.ok()) throw new Error(`Bill API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Bill created via API: ${json.invoice_number} (ID: ${json.id})`);
    return { success: true, billNumber: json.invoice_number, billId: json.id };
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

  async approvePaymentAPI(paymentId: string): Promise<boolean> {
    let apiBase = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : 'http://157.180.20.112:8001';
    if (apiBase.includes(':4173')) apiBase = apiBase.replace(':4173', ':8001');
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    console.log(`[ACTION] Approving Payment ${paymentId} via API...`);
    const response = await this.page.request.patch(`${apiBase}/payments/${paymentId}?${params}`, {
      data: { status: 'approved' },
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.ok();
  }
}
