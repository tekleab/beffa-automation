import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SalesAPI extends BasePage {
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

  async discoverMetadataAPI(): Promise<{ arAccountId: string; salesAccountId: string; cashAccountId: string; customerId: string; currencyId: string; taxId: string; locationId: string; warehouseId: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
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
      try { return JSON.parse(text); } catch (e) {
        throw new Error(`${label} returned invalid JSON: ${text.substring(0, 150)}`);
      }
    };

    // 1. Fetch Accounts — API returns type as nested object: {id, name, type}
    const accResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=200&${params}`, { headers });
    const accData = await safeJson(accResp, 'Accounts Discovery');
    const allAccounts = accData.items || accData.data || [];

    // Precise AR account: name='Accounts Receivable', type.name='Trade & Other Receivables'
    const arAccount =
      allAccounts.find((a: any) => a.name?.toLowerCase() === 'accounts receivable') ||
      allAccounts.find((a: any) => a.type?.name?.toLowerCase().includes('trade') && a.name?.toLowerCase().includes('receivable')) ||
      allAccounts.find((a: any) => a.type?.type?.toLowerCase() === 'accounts receivable') ||
      allAccounts[0];

    // Sales/Revenue account for line item GL mapping
    const salesAccount =
      allAccounts.find((a: any) => a.name?.toLowerCase() === 'sales') ||
      allAccounts.find((a: any) => a.type?.type?.toLowerCase().includes('revenue')) ||
      arAccount;

    // 2. Fetch Customer
    const custResp = await this.page.request.get(`${apiBase}/customers?page=1&pageSize=10&${params}`, { headers });
    const custData = await safeJson(custResp, 'Customer Discovery');
    const customer = custData.items?.[0] || custData.data?.[0];

    // 3. Fetch Currency
    const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = currData.items?.[0] || currData.data?.[0];

    // 4. Fetch Tax
    const taxResp = await this.page.request.get(`${apiBase}/taxes?${params}`, { headers });
    const taxData = await safeJson(taxResp, 'Tax Discovery');
    const tax = taxData.items?.[0] || taxData.data?.[0];

    // 5. Fetch Location/Warehouse
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

    // 6. Fetch Business/Cash Account
    const cashAccount =
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('cash') || a.name?.toLowerCase().includes('petty')) ||
      allAccounts.find((a: any) => a.type?.name?.toLowerCase().includes('cash')) ||
      allAccounts[0];

    if (!arAccount || !customer) throw new Error('Metadata Discovery Failed: Missing Account or Customer records.');

    return {
      arAccountId: arAccount.id,
      salesAccountId: salesAccount?.id || arAccount.id,
      cashAccountId: cashAccount?.id || '',
      customerId: customer.id,
      currencyId: currency?.id || '',
      taxId: tax?.id || '',
      locationId,
      warehouseId
    };
  }

  async createSalesOrderAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string; customerId: string; soItemId: string | null; status?: number; error?: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };

    // Discover live company environment
    const meta = await this.discoverMetadataAPI();

    // Dynamically fallback locations if not provided
    let locationId = data.locationId;
    let warehouseId = data.warehouseId;
    if (!locationId || !warehouseId) {
      const locResp = await this.page.request.get(`${apiBase}/locations?page=1&pageSize=50&${params}`, { headers });
      if (locResp.ok()) {
        const locData = await locResp.json();
        const locs = locData.items || locData.data || [];
        // Prefer a location that has a warehouse already attached
        const bestLoc = locs.find((l: any) => l.warehouse_id || l.warehouse?.id) || locs[0];
        if (bestLoc) {
          locationId = locationId || bestLoc.id;
          warehouseId = warehouseId || bestLoc.warehouse_id || bestLoc.warehouse?.id || '';
        }
      }
    }
    if (!warehouseId) throw new Error(`[SO] warehouseId is empty — cannot create Sales Order. Ensure locations have an associated warehouse.`);

    const quantity = data.quantity || 1;
    const unitPrice = data.unitPrice || 10993.05;
    const amount = quantity * unitPrice;

    const payload = {
      accounts_receivable_id: data.arAccountId || meta.arAccountId,
      currency_id: data.currencyId || meta.currencyId,
      customer_id: data.customerId || meta.customerId,
      so_date: data.soDate || new Date().toISOString().split('T')[0] + 'T00:00:00Z', // 📅 CUSTOMIZABLE FIELD
      so_items: [{
        amount,
        item_id: data.itemId, // REQUIRED: must pass the item UUID
        quantity,
        unit_price: unitPrice,
        general_ledger_account_id: data.glAccountId || meta.arAccountId,
        warehouse_id: warehouseId,
        location_id: locationId,
        ...(( data.taxId || meta.taxId) && { tax_id: data.taxId || meta.taxId }),
        description: data.description || 'E2E Speed Track'
      }],
      status: 'draft'
    };

    const response = await this.safePost(`${apiBase}/sales-orders?${params}`, {
      data: payload,
      headers,
      label: 'Create Sales Order'
    });

    if (!response.ok()) {
      const errText = await response.text();
      console.warn(`[WARN] SO API Creation Failed: ${response.status()} - ${errText}`);
      return { success: false, ref: '', id: '', customerId: payload.customer_id, soItemId: null, status: response.status(), error: errText };
    }
    const json = await response.json();
    const soItemId = json.so_items?.[0]?.id || null;
    return { success: true, ref: json.so_number, id: json.id, customerId: payload.customer_id, soItemId };
  }

  async createInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; status?: number; error?: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    // Discover live company environment
    const meta = await this.discoverMetadataAPI();

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + 30);

    const payload = {
      accounts_receivable_id: data.arAccountId || meta.arAccountId,
      currency_id: data.currencyId || meta.currencyId,
      customer_id: data.customerId, // REQUIRED: must match the SO customer
      invoice_date: data.invoiceDate || now.toISOString().split('T')[0] + 'T00:00:00Z',
      due_date: data.dueDate || dueDate.toISOString().split('T')[0] + 'T00:00:00Z',
      released_sales_order_items: [{
        so_item_id: data.soItemId, // REQUIRED: from createSalesOrderAPI response
        released_quantity: data.releasedQuantity || 1,
        warehouse_id: data.warehouseId || meta.warehouseId,
        location_id: data.locationId || meta.locationId
      }],
      status: 'draft'
    };

    const token = await this._getAuthToken();
    const response = await this.safePost(`${apiBase}/invoices?${params}`, {
      data: payload,
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' },
      label: 'Create Invoice'
    });

    if (!response.ok()) {
      const err = await response.text();
      console.error(`[ERROR] Invoice API Failed: ${response.status()} - ${err}`);
      return { success: false, status: response.status(), error: err };
    }
    const json = await response.json();
    return { success: true, ref: json.invoice_number, id: json.id };
  }

  async createStandaloneInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string; amountDue: number; customerId: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    
    // Discover live company environment
    const meta = await this.discoverMetadataAPI();
    
    const custId = data.customerId || meta.customerId;
    const unitPrice = data.unitPrice || 10993.05;
    const q = data.quantity || 1;
    const amount = q * unitPrice;

    const payload: Record<string, any> = {
      accounts_receivable_id: meta.arAccountId,
      customer_id: custId,
      invoice_date: data.invoiceDate || new Date().toISOString().split('T')[0] + 'T00:00:00Z',
      due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + 'T00:00:00Z',
      currency_id: meta.currencyId,
      items: [{
        amount: amount,
        general_ledger_account_id: meta.salesAccountId,
        item_id: data.itemId,
        location_id: data.locationId || meta.locationId,
        quantity: q,
        unit_price: unitPrice,
        warehouse_id: data.warehouseId || meta.warehouseId,
        ...(data.discount_amount && { discount_amount: data.discount_amount }),
        ...(data.discount_type && { discount_type: data.discount_type })
      }],
      released_sales_order_items: []
      // NOTE: sales_order_id intentionally omitted (null crashes backend)
    };

    const token = await this._getAuthToken();
    const response = await this.safePost(`${apiBase}/invoices?${params}`, {
      data: payload,
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' },
      label: 'Standalone Invoice'
    });

    if (!response.ok()) throw new Error(`Standalone Invoice API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    return { success: true, ref: json.invoice_number, id: json.id, amountDue: amount, customerId: custId };
  }

  async createReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
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
      if (!resp.ok()) {
        console.error(`[ERROR] ${label} failed (${resp.status()}): ${text.substring(0, 300)}`);
        throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
      }
      try { return JSON.parse(text); } catch (e) {
        console.error(`[ERROR] ${label} returned non-JSON (status ${resp.status()}): ${text.substring(0, 300)}`);
        throw new Error(`${label} returned invalid JSON: ${text.substring(0, 150)}`);
      }
    };

    // 1. Discover Customer
    const custResp = await this.page.request.get(`${apiBase}/customers?page=1&pageSize=10&${params}`, { headers });
    const custData = await safeJson(custResp, 'Customer Discovery');
    const customer = custData.items?.[0] || custData.data?.[0];
    if (!customer) throw new Error('Receipt Discovery Failed: No customers found in this company.');

    // 2. Discover Business Accounts (Cash + GL)
    const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
    const acctData = await safeJson(acctResp, 'Business Accounts Discovery');
    const allAccounts = acctData.items || acctData.data || [];
    const cashAccount = allAccounts.find((a: any) =>
      a.account_type?.toLowerCase().includes('cash') || a.account_type?.toLowerCase().includes('bank')
    ) || allAccounts[0];
    const glAccount = allAccounts.find((a: any) =>
      a.account_type?.toLowerCase().includes('receivable')
    ) || allAccounts[1] || allAccounts[0];
    if (!cashAccount) throw new Error('Receipt Discovery Failed: No cash/bank accounts found.');

    // 3. Discover Currency
    const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = currData.items?.[0] || currData.data?.[0];
    if (!currency) throw new Error('Receipt Discovery Failed: No currencies found.');

    // 4. Discover Tax
    const taxResp = await this.page.request.get(`${apiBase}/taxes?${params}`, { headers });
    const taxData = await safeJson(taxResp, 'Tax Discovery');
    const tax = taxData.items?.[0] || taxData.data?.[0];

    const amount = data.amount || Math.floor(Math.random() * 1500000) + 500000;

    const payload = {
      amount,
      cash_account_id: cashAccount.id,
      customer_id: customer.id,
      date: new Date().toISOString(),
      payment_method: 'cash',
      currency_id: currency.id,
      receipt_items: [{
        amount,
        general_ledger_account_id: glAccount.id,
        tax_id: tax?.id || null,
        unit_price: amount,
        quantity: 1,
        description: 'E2E Dynamic Discovery - Speed Track'
      }]
    };

    const response = await this.page.request.post(`${apiBase}/receipts?${params}`, { data: payload, headers });

    if (!response.ok()) throw new Error(`API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    return { success: true, ref: json.ref, id: json.id };
  }

  async reverseInvoiceAPI(invoiceId: string): Promise<boolean> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    // Based on user feedback, the reversal action is a PATCH to /api/invoices/:id/void
    const response = await this.page.request.patch(`${apiBase}/invoices/${invoiceId}/void?${params}`, {
      data: { status: 'reversed' }, // Some backends ignore body for void, but sending status is safe
      headers: {
        'x-company': process.env.BEFFA_COMPANY as string,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) {
      const err = await response.text();
      console.error(`[ERROR] Invoice Reversal API failed (${response.status()}): ${err}`);
      return false;
    }
    return true;
  }

  async reverseReceiptAPI(receiptId: string): Promise<boolean> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    const response = await this.page.request.patch(`${apiBase}/receipts/${receiptId}/void?${params}`, {
      data: { status: 'reversed' },
      headers: {
        'x-company': process.env.BEFFA_COMPANY as string,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) {
      const err = await response.text();
      console.error(`[ERROR] Receipt Reversal API failed (${response.status()}): ${err}`);
      return false;
    }
    return true;
  }

  async approveInvoiceAPI(invoiceId: string): Promise<boolean> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
      data: { status: 'approved' },
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.ok();
  }

  async createInvoiceReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };

    // Wait a moment before attempting receipt creation to ensure invoice is fully processed
    await new Promise(resolve => setTimeout(resolve, 3000)); // Increased from 2000 to 3000

    // Verify invoice exists and is in approved state before creating receipt
    try {
      const invoiceCheck = await this.page.request.get(`${apiBase}/invoice/${data.invoiceId}?${params}`, { headers });
      if (invoiceCheck.ok()) {
        const invoiceData = await invoiceCheck.json();
        console.log(`[DEBUG] Invoice status before receipt: ${invoiceData.status}`);
        console.log(`[DEBUG] Invoice unreceived_amount: ${invoiceData.unreceived_amount}`);
        
        if (invoiceData.status !== 'approved') {
          throw new Error(`Invoice must be approved before creating receipt. Current status: ${invoiceData.status}`);
        }
      }
    } catch (error) {
      console.warn(`[WARN] Could not verify invoice status: ${error}`);
    }

    // Discover Cash Account dynamically if not provided
    let cashAccountId = data.cashAccountId;
    if (!cashAccountId) {
      const acctResp = await this.page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
      if (acctResp.ok()) {
        const acctData = await acctResp.json();
        const allAccounts = acctData.items || acctData.data || [];
        const cashAcct = allAccounts.find((a: any) => 
          a.account_type?.toLowerCase().includes('cash') || 
          a.account_type?.toLowerCase().includes('bank') ||
          a.name?.toLowerCase().includes('cash') ||
          a.name?.toLowerCase().includes('petty')
        ) || allAccounts[0];
        if (cashAcct) cashAccountId = cashAcct.id;
      }
    }

    // Discover Currency dynamically if not provided
    let currencyId = data.currencyId;
    if (!currencyId) {
      const currResp = await this.page.request.get(`${apiBase}/currency?${params}`, { headers });
      if (currResp.ok()) {
        const currData = await currResp.json();
        const currency = currData.items?.[0] || currData.data?.[0];
        if (currency) currencyId = currency.id;
      }
    }

    const payload = {
      amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
      cash_account_id: cashAccountId,
      customer_id: data.customerId, // MUST match the invoice customer
      date: data.receiptDate || new Date().toISOString(),
      payment_method: data.payment_method || 'cash',
      currency_id: currencyId,
      invoice_receipts: [{
        amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
        invoice_id: data.invoiceId // The target invoice UUID
      }]
    };

    console.log(`[DEBUG] Receipt payload:`, JSON.stringify(payload, null, 2));

    // Validate required fields before making the API call
    if (!cashAccountId) {
      throw new Error(`Cash account not found. Cannot create receipt without cash account.`);
    }
    if (!currencyId) {
      throw new Error(`Currency not found. Cannot create receipt without currency.`);
    }
    if (!data.customerId) {
      throw new Error(`Customer ID is required for receipt creation.`);
    }
    if (!data.invoiceId) {
      throw new Error(`Invoice ID is required for receipt creation.`);
    }
    if (!data.amount || data.amount <= 0) {
      throw new Error(`Valid amount is required for receipt creation. Received: ${data.amount}`);
    }

    // Retry logic for transient 500 errors
    let lastError = '';
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await this.page.request.post(`${apiBase}/receipts?${params}`, {
          data: payload,
          headers
        });
        
        if (response.ok()) {
          const json = await response.json();
          console.log(`[SUCCESS] Receipt created on attempt ${attempt}:`, json.ref || json.id);
          return { success: true, ref: json.ref || json.receipt_number || `RCT-${json.id}`, id: json.id };
        }
        
        const errorText = await response.text();
        lastError = `Attempt ${attempt}: HTTP ${response.status()} - ${errorText}`;
        console.warn(`[WARN] Receipt creation failed on attempt ${attempt}: ${lastError}`);
        
        // If it's a 422 validation error, don't retry
        if (response.status() === 422) {
          throw new Error(`Validation Error (422): ${errorText}`);
        }
        
        // Wait before retry
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
        
      } catch (error) {
        lastError = `Attempt ${attempt}: ${error}`;
        console.warn(`[WARN] Receipt creation error on attempt ${attempt}:`, error);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
      }
    }
    
    throw new Error(`Invoice-Receipt API Creation Failed after 3 attempts. Last error: ${lastError}`);
  }

  async getInvoiceAPI(invoiceId: string): Promise<any> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    const response = await this.page.request.get(`${apiBase}/invoice/${invoiceId}?${params}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
    return await response.json();
  }

  async getCustomerNameAPI(customerId: string): Promise<string> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2018';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const qs = `year=${year}&period=${period}&calendar=${calendar}`;
    const response = await this.page.request.get(`${apiBase}/customer/${customerId}?${qs}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok()) return '';
    const json = await response.json();
    return json.name || json.customer_name || '';
  }
}
