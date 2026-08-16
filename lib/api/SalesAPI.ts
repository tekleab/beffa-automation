import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base-page';

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
    const year = process.env.BEFFA_YEAR || '2019';
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

    // 1. Fetch Accounts
    const accResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=200&${params}`, { headers });
    const accData = await safeJson(accResp, 'Accounts Discovery');
    const allAccounts = accData.items || accData.data || [];

    // type is a plain string e.g. "Cash & Cash Equivalents" — not a nested object
    const typeStr = (a: any) => (a.type || a.account_type || '').toLowerCase();

    // Precise AR account
    const arAccount =
      allAccounts.find((a: any) => a.name?.toLowerCase() === 'accounts receivable') ||
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('receivable')) ||
      allAccounts.find((a: any) => typeStr(a).includes('receivable')) ||
      allAccounts[0];

    const salesAccount =
      allAccounts.find((a: any) => a.name?.toLowerCase() === 'sales') ||
      allAccounts.find((a: any) => typeStr(a).includes('revenue') || typeStr(a).includes('income')) ||
      arAccount;

    // 2. Fetch Customer
    const custResp = await this.safeGet(`${apiBase}/customers?page=1&pageSize=10&${params}`, { headers });
    const custData = await safeJson(custResp, 'Customer Discovery');
    const customer = custData.items?.[0] || custData.data?.[0];

    // 3. Fetch Currency
    const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = currData.items?.[0] || currData.data?.[0];

    // 4. Fetch Tax (optional)
    let tax: any = null;
    try {
      const taxResp = await this.safeGet(`${apiBase}/taxes?${params}`, { headers });
      if (taxResp.ok()) {
        const taxData = await taxResp.json();
        tax = taxData.items?.[0] || taxData.data?.[0] || null;
      }
    } catch (e) {
      console.warn(`[WARN] Tax Discovery failed — continuing without tax`);
    }

    // 5. Fetch Location/Warehouse
    const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
    let locationId = '', warehouseId = '';
    if (locResp.ok()) {
      const locData = await locResp.json();
      const firstLoc = (locData.items || locData.data || [])[0];
      if (firstLoc) {
        locationId = firstLoc.id;
        warehouseId = await this.resolveWarehouseIdFromLocation(firstLoc);
      }
    }

    const cashAccount =
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('branch')) ||
      allAccounts.find((a: any) => (a.account_id || a.code) === '1002') ||
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('petty')) ||
      allAccounts.find((a: any) => a.name?.toLowerCase().includes('cash')) ||
      allAccounts.find((a: any) => typeStr(a).includes('cash') || typeStr(a).includes('bank')) ||
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
    const year = process.env.BEFFA_YEAR || '2019';
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
      // Fall back to meta values first
      locationId = locationId || meta.locationId;
      warehouseId = warehouseId || meta.warehouseId;
    }
    if (!locationId || !warehouseId) {
      const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=100&${params}`, { headers }, 10000);
      if (locResp.ok()) {
        const locData = await locResp.json();
        const locs = locData.items || locData.data || [];
        const bestLoc = locs[0];
        if (bestLoc) {
          locationId = locationId || bestLoc.id;
          warehouseId = warehouseId || await this.resolveWarehouseIdFromLocation(bestLoc);
        }
      }
    }
    if (!warehouseId) throw new Error(`[SO] warehouseId is empty — cannot create Sales Order. Ensure locations have an associated warehouse.`);

    const quantity = data.quantity || 1;
    const unitPrice = data.unitPrice || 10993.05;
    const amount = quantity * unitPrice;

    const { DateHelper: _DH } = require('../utils/DateHelper');
    const _dateIso = (await _DH.resolve(this.page)).iso;
    const payload = {
      accounts_receivable_id: data.arAccountId || meta.arAccountId,
      currency_id: data.currencyId || meta.currencyId,
      customer_id: data.customerId || meta.customerId,
      so_date: data.soDate || _dateIso,
      so_items: [{
        amount,
        item_id: data.itemId, // REQUIRED: must pass the item UUID
        quantity,
        unit_price: unitPrice,
        general_ledger_account_id: data.glAccountId || meta.arAccountId,
        warehouse_id: warehouseId,
        location_id: locationId,
        ...((data.taxId || meta.taxId) && { tax_id: data.taxId || meta.taxId }),
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
    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    // Discover live company environment
    const meta = await this.discoverMetadataAPI();

    const { DateHelper } = require('../utils/DateHelper');
    const resolvedDate = await DateHelper.resolve(this.page);

    const payload = {
      accounts_receivable_id: data.arAccountId || meta.arAccountId,
      currency_id: data.currencyId || meta.currencyId,
      customer_id: data.customerId, // REQUIRED: must match the SO customer
      date: data.invoiceDate || resolvedDate.iso,
      posting_date: data.invoiceDate || resolvedDate.iso,
      invoice_date: data.invoiceDate || resolvedDate.iso,
      due_date: data.dueDate || resolvedDate.iso,
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

    const { DateHelper: _DH } = require('../utils/DateHelper');
    const resolvedDate = await _DH.resolve(this.page);
    const year = String(resolvedDate.ecYear);
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    // Discover live company environment
    const meta = await this.discoverMetadataAPI();

    let itemId = data.itemId;
    let locationId = data.locationId || meta.locationId;
    let warehouseId = data.warehouseId || meta.warehouseId;

    const q = data.quantity || 1;
    const unitPrice = data.unitPrice || 10993.05;
    const amount = q * unitPrice;

    if (!itemId) {
      const { InventoryAPI } = require('./InventoryAPI');
      const invApi = new InventoryAPI(this.page);
      const fresh = await invApi.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: q + 20, unit_cost: 100 });
      itemId = fresh.itemId;
      locationId = fresh.locationId;
      warehouseId = fresh.warehouseId;
    }

    const custId = data.customerId || meta.customerId;

    const _dateIso = resolvedDate.iso;
    const payload: Record<string, any> = {
      accounts_receivable_id: meta.arAccountId,
      customer_id: custId,
      date: _dateIso,
      posting_date: _dateIso,
      invoice_date: data.invoiceDate || _dateIso,
      due_date: _dateIso,
      currency_id: meta.currencyId,
      items: [{
        amount: amount,
        general_ledger_account_id: meta.salesAccountId,
        item_id: itemId,
        location_id: locationId,
        quantity: q,
        unit_price: unitPrice,
        warehouse_id: warehouseId,
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
    const year = process.env.BEFFA_YEAR || '2019';
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
    const custResp = await this.safeGet(`${apiBase}/customers?page=1&pageSize=10&${params}`, { headers });
    const custData = await safeJson(custResp, 'Customer Discovery');
    const customer = custData.items?.[0] || custData.data?.[0];
    if (!customer) throw new Error('Receipt Discovery Failed: No customers found in this company.');

    // 2. Discover Business Accounts (Cash + GL)
    const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
    const acctData = await safeJson(acctResp, 'Business Accounts Discovery');
    const allAccounts = acctData.items || acctData.data || [];
    const _typeOf = (a: any) => (a.type || a.account_type || '').toLowerCase();
    const cashAccount = allAccounts.find((a: any) =>
      _typeOf(a).includes('cash') || _typeOf(a).includes('bank') ||
      a.name?.toLowerCase().includes('cash')
    ) || allAccounts[0];
    const glAccount = allAccounts.find((a: any) =>
      _typeOf(a).includes('receivable') || a.name?.toLowerCase().includes('receivable')
    ) || allAccounts[1] || allAccounts[0];
    if (!cashAccount) throw new Error('Receipt Discovery Failed: No cash/bank accounts found.');

    // 3. Discover Currency
    const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
    const currData = await safeJson(currResp, 'Currency Discovery');
    const currency = currData.items?.[0] || currData.data?.[0];
    if (!currency) throw new Error('Receipt Discovery Failed: No currencies found.');

    // 4. Discover Tax (optional)
    let tax: any = null;
    try {
      const taxResp = await this.safeGet(`${apiBase}/taxes?${params}`, { headers });
      if (taxResp.ok()) { const taxData = await taxResp.json(); tax = taxData.items?.[0] || taxData.data?.[0]; }
    } catch (e) { console.warn('[WARN] Tax Discovery failed — continuing without tax'); }

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

    const response = await this.page.request.post(`${apiBase}/receipts?${params}`, { data: payload, headers, timeout: 30000 });

    if (!response.ok()) throw new Error(`API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    return { success: true, ref: json.ref, id: json.id };
  }

  async reverseInvoiceAPI(invoiceId: string): Promise<{ id: string; ref: string; voidedStatus: string } | false> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };

    const response = await this.page.request.patch(`${apiBase}/invoices/${invoiceId}/void?${params}`, {
      data: { status: 'reversed' },
      headers,
      timeout: 30000
    });

    if (!response.ok()) {
      const err = await response.text();
      console.error(`[ERROR] Invoice Reversal API failed (${response.status()}): ${err}`);
      return false;
    }

    // Fetch the invoice after void to confirm its actual status and check for a linked credit note
    await new Promise(r => setTimeout(r, 2000));
    const invResp = await this.safeGet(`${apiBase}/invoice/${invoiceId}?${params}`, { headers });
    if (!invResp.ok()) {
      console.warn(`[WARN] Could not re-fetch invoice after void: ${invResp.status()}`);
      return { id: invoiceId, ref: '', voidedStatus: 'unknown' };
    }
    const inv = await invResp.json();
    const voidedStatus: string = inv.status || 'unknown';

    // Check if ERP created a linked credit note document
    const creditNoteId: string | undefined =
      inv.credit_note_id || inv.credit_note?.id ||
      inv.reversed_invoice_id || inv.reversal_id ||
      inv.void_invoice_id || inv.void_id;
    const creditNoteRef: string =
      inv.credit_note_number || inv.credit_note?.ref ||
      inv.credit_note?.invoice_number || inv.void_invoice_number || '';

    if (creditNoteId) {
      console.log(`[VOID] Credit note linked on invoice: id=${creditNoteId} ref=${creditNoteRef}`);
      return { id: creditNoteId, ref: creditNoteRef, voidedStatus };
    }

    // ERP void = undo to draft (no separate credit note) — return original ID with status
    console.log(`[VOID] Invoice ${invoiceId} voided → status=${voidedStatus} (no separate credit note; sales_journal cleared)`);
    return { id: invoiceId, ref: inv.invoice_number || '', voidedStatus };
  }

  async reverseReceiptAPI(receiptId: string): Promise<boolean> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    const response = await this.page.request.patch(`${apiBase}/receipts/${receiptId}/void?${params}`, {
      data: { status: 'reversed' },
      headers: {
        'x-company': process.env.BEFFA_COMPANY as string,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      timeout: 30000
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
    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
      data: { status: 'approved' },
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' },
      timeout: 30000
    });
    return response.ok();
  }

  async createInvoiceReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();

    const { DateHelper: _DH } = require('../utils/DateHelper');
    const resolvedDate = await _DH.resolve(this.page);
    const year = String(resolvedDate.ecYear);
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;
    const company = process.env.BEFFA_COMPANY || 'BM Tech';
    const headers = { 'x-company': company, 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };

    // Wait a moment before attempting receipt creation to ensure invoice is fully processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify invoice exists and is in approved state before creating receipt
    try {
      const invoiceCheck = await this.safeGet(`${apiBase}/invoices/${data.invoiceId}?${params}`, { headers });
      if (invoiceCheck.ok()) {
        const invoiceData = await invoiceCheck.json();
        if (invoiceData.status !== 'approved' && invoiceData.status !== 'partially_paid') {
          console.log(`[RECEIPT PRE-FLIGHT] Invoice ${data.invoiceId} is in status "${invoiceData.status}". Advancing invoice to approved state first...`);
          await this.advanceDocumentAPI(data.invoiceId, 'invoices').catch(() => {});
        }
      }
    } catch (error) {
      console.warn(`[WARN] Could not verify invoice status: ${error}`);
    }

    // Discover Cash Account dynamically if not provided
    let cashAccountId = data.cashAccountId;
    if (!cashAccountId) {
      const acctResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=50&${params}`, { headers });
      if (acctResp.ok()) {
        const acctData = await acctResp.json();
        const allAccounts = acctData.items || acctData.data || [];
        const typeOf = (a: any) => (a.type || a.account_type || '').toLowerCase();
        const cashAcct = allAccounts.find((a: any) => a.name?.toLowerCase().includes('branch')) ||
          allAccounts.find((a: any) => (a.account_id || a.code) === '1002') ||
          allAccounts.find((a: any) => a.name?.toLowerCase().includes('petty')) ||
          allAccounts.find((a: any) => typeOf(a).includes('cash') || typeOf(a).includes('bank')) ||
          allAccounts[0];
        if (cashAcct) cashAccountId = cashAcct.id;
      }
    }

    // Discover Currency dynamically if not provided
    let currencyId = data.currencyId;
    if (!currencyId) {
      const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
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
      date: data.receiptDate || resolvedDate.iso,
      payment_method: data.payment_method || 'cash',
      currency_id: currencyId,
      invoice_receipts: [{
        amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
        invoice_id: data.invoiceId // The target invoice UUID
      }]
    };

    console.log(`[RECEIPT] amount=${payload.amount} | invoice=${data.invoiceId?.substring(0, 8)}... | year=${year}`);

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
        const response = await this.safePost(`${apiBase}/receipts?${params}`, {
          data: payload,
          headers,
          label: `Create Invoice Receipt (Attempt ${attempt})`
        }, 30000);

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
    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const params = `year=${year}&period=${period}&calendar=${calendar}`;

    const response = await this.safeGet(`${apiBase}/invoice/${invoiceId}?${params}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
    return await response.json();
  }

  async getCustomerNameAPI(customerId: string): Promise<string> {
    let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
    if (!apiBase.endsWith('/api')) apiBase += '/api';
    const token = await this._getAuthToken();
    const year = process.env.BEFFA_YEAR || '2019';
    const period = process.env.BEFFA_PERIOD || 'yearly';
    const calendar = process.env.BEFFA_CALENDAR || 'ec';
    const qs = `year=${year}&period=${period}&calendar=${calendar}`;
    const response = await this.safeGet(`${apiBase}/customer/${customerId}?${qs}`, {
      headers: { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok()) return '';
    const json = await response.json();
    return json.name || json.customer_name || '';
  }
}
