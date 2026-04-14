import { Page, Locator } from '@playwright/test';

export class SalesAPI {
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

  async createSalesOrderAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string; customerId: string; soItemId: string | null }> {
    const apiBase = 'http://157.180.20.112:8001/api';

    // Defaults from known BEFA environment
    const customers = ['32f1aeb4-531f-4104-ad07-f3761a97dd06', '256ce173-d504-4345-a6b7-70cead86f135'];
    const warehouses = ['cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4'];
    const locations = ['2595ebb0-4e78-4bc5-9321-140d3fd316c7'];
    const arAccounts = ['20c381e1-4d14-4ab1-8e7e-dee2937b4a64'];
    const taxes = ['b017352f-f454-45e2-85ef-e327f90d8f9c', '8da036a5-9185-4043-bfb5-b146aac78412'];

    const quantity = data.quantity || 1;
    const unitPrice = data.unitPrice || 10993.05;
    const amount = quantity * unitPrice;

    const payload = {
      accounts_receivable_id: data.arAccountId || arAccounts[0],
      currency_id: data.currencyId || '50567982-ee2f-4391-9400-3149067443a5',
      customer_id: data.customerId || customers[Math.floor(Math.random() * customers.length)],
      so_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z', // 📅 FIXED FIELD
      so_items: [{
        amount,
        item_id: data.itemId, // REQUIRED: must pass the item UUID
        quantity,
        unit_price: unitPrice,
        general_ledger_account_id: data.glAccountId || arAccounts[0],
        warehouse_id: data.warehouseId || warehouses[0],
        location_id: data.locationId || locations[0],
        tax_id: data.taxId || taxes[Math.floor(Math.random() * taxes.length)],
        description: data.description || 'E2E Speed Track'
      }],
      status: 'draft'
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/sales-orders?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`SO API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    const soItemId = json.so_items?.[0]?.id || null;
    console.log(`[SUCCESS] Sales Order created via API: ${json.so_number} (ID: ${json.id}, ItemID: ${soItemId})`);
    return { success: true, ref: json.so_number, id: json.id, customerId: payload.customer_id, soItemId };
  }

  async createInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref?: string; id?: string; status?: number; error?: string }> {
    const apiBase = 'http://157.180.20.112:8001/api';

    const arAccounts = ['20c381e1-4d14-4ab1-8e7e-dee2937b4a64', '8479ad17-541c-4b85-a371-59f0536ba6e9'];

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + 30);

    const payload = {
      accounts_receivable_id: data.arAccountId || arAccounts[0],
      currency_id: data.currencyId || '50567982-ee2f-4391-9400-3149067443a5',
      customer_id: data.customerId, // REQUIRED: must match the SO customer
      invoice_date: now.toISOString().split('T')[0] + 'T00:00:00Z',
      due_date: dueDate.toISOString().split('T')[0] + 'T00:00:00Z',
      released_sales_order_items: [{
        so_item_id: data.soItemId, // REQUIRED: from createSalesOrderAPI response
        released_quantity: data.releasedQuantity || 1
      }],
      status: 'draft'
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) {
      const err = await response.text();
      console.error(`[ERROR] Invoice API Failed: ${response.status()} - ${err}`);
      return { success: false, status: response.status(), error: err };
    }
    const json = await response.json();
    console.log(`[SUCCESS] Invoice created via API: ${json.invoice_number} (ID: ${json.id})`);
    return { success: true, ref: json.invoice_number, id: json.id };
  }

  async createStandaloneInvoiceAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string; amountDue: number; customerId: string }> {
    const apiBase = 'http://157.180.20.112:8001/api';
    const customers = ['32f1aeb4-531f-4104-ad07-f3761a97dd06', '256ce173-d504-4345-a6b7-70cead86f135'];
    const custId = data.customerId || customers[1];

    const unitPrice = data.unitPrice || 10993.05;
    const q = data.quantity || 1;
    const amount = q * unitPrice;

    const payload = {
      accounts_receivable_id: '998df511-68ea-48b9-b405-9419eb78145b',
      customer_id: custId,
      invoice_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
      currency_id: '50567982-ee2f-4391-9400-3149067443a5',
      items: [{
        amount: amount,
        general_ledger_account_id: '998df511-68ea-48b9-b405-9419eb78145b',
        item_id: data.itemId,
        location_id: '2595ebb0-4e78-4bc5-9321-140d3fd316c7',
        quantity: q,
        tax_id: 'b017352f-f454-45e2-85ef-e327f90d8f9c',
        unit_price: unitPrice,
        warehouse_id: 'cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4',
      }],
      released_sales_order_items: [],
      sales_order_id: '00000000-0000-0000-0000-000000000000'
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/invoices?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`Standalone Invoice API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Standalone Invoice created via API: ${json.invoice_number} (ID: ${json.id})`);
    return { success: true, ref: json.invoice_number, id: json.id, amountDue: amount, customerId: custId };
  }

  async createReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
    const apiBase = 'http://157.180.20.112:8001/api';
    const amount = data.amount || Math.floor(Math.random() * 1500000) + 500000;

    const customers = ['32f1aeb4-531f-4104-ad07-f3761a97dd06', '256ce173-d504-4345-a6b7-70cead86f135'];
    const cashAccounts = ['9375b986-2772-434e-ada2-b1843e465604', 'f17570eb-6533-4249-8eba-e77a4ea92d43'];
    const glAccounts = ['8b313729-d6cb-4a33-af8b-7f5c880d86c0', '998df511-68ea-48b9-b405-9419eb78145b'];
    const taxes = ['8da036a5-9185-4043-bfb5-b146aac78412', 'b017352f-f454-45e2-85ef-e327f90d8f9c'];

    const payload = {
      amount,
      cash_account_id: cashAccounts[Math.floor(Math.random() * cashAccounts.length)],
      customer_id: customers[Math.floor(Math.random() * customers.length)],
      date: new Date().toISOString(),
      payment_method: 'cash',
      currency_id: '50567982-ee2f-4391-9400-3149067443a5',
      receipt_items: [{
        amount,
        general_ledger_account_id: glAccounts[Math.floor(Math.random() * glAccounts.length)],
        tax_id: taxes[Math.floor(Math.random() * taxes.length)],
        unit_price: amount, quantity: 1, description: 'E2E Speed Track'
      }]
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/receipts`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Receipt created via API: ${json.ref} (ID: ${json.id})`);
    return { success: true, ref: json.ref, id: json.id };
  }

  async reverseInvoiceAPI(invoiceId: string): Promise<boolean> {
    const apiBase = 'http://157.180.20.112:8001/api';
    const token = await this._getAuthToken();
    const params = 'year=2018&period=yearly&calendar=ec';

    const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
      data: { status: 'reversed' },
      headers: {
        'x-company': 'befa tutorial',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) {
      console.error(`[ERROR] Reversal API failed: ${response.status()}`);
      return false;
    }
    console.log(`[SUCCESS] Invoice ${invoiceId} reversed via API`);
    return true;
  }

  async approveInvoiceAPI(invoiceId: string): Promise<boolean> {
    const apiBase = 'http://157.180.20.112:8001/api';
    const token = await this._getAuthToken();
    const params = 'year=2018&period=yearly&calendar=ec';

    console.log(`[ACTION] Approving Invoice ${invoiceId} via API...`);
    const response = await this.page.request.patch(`${apiBase}/invoice/${invoiceId}?${params}`, {
      data: { status: 'approved' },
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.ok();
  }

  async createInvoiceReceiptAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
    const apiBase = 'http://157.180.20.112:8001/api';
    const cashAccounts = ['9375b986-2772-434e-ada2-b1843e465604', 'f17570eb-6533-4249-8eba-e77a4ea92d43'];

    const payload = {
      amount: data.amount,
      cash_account_id: cashAccounts[Math.floor(Math.random() * cashAccounts.length)],
      customer_id: data.customerId, // MUST match the invoice customer
      date: new Date().toISOString(),
      payment_method: 'cash',
      currency_id: '50567982-ee2f-4391-9400-3149067443a5',
      invoice_receipts: [{
        amount: data.amount,
        invoice_id: data.invoiceId // The target invoice UUID
      }]
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/receipts?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`Invoice-Receipt API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Receipt created via API: ${json.ref} (ID: ${json.id}) for Invoice ${data.invoiceId}`);
    return { success: true, ref: json.ref, id: json.id };
  }

  async getInvoiceAPI(invoiceId: string): Promise<any> {
    const apiBase = 'http://157.180.20.112:8001/api';
    const token = await this._getAuthToken();
    const response = await this.page.request.get(`${apiBase}/invoice/${invoiceId}?year=2018&period=yearly&calendar=ec`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!response.ok()) throw new Error(`Failed to fetch Invoice ${invoiceId}: ${response.status()} - ${await response.text().catch(() => 'No Response')}`);
    return await response.json();
  }

  async getCustomerNameAPI(customerId: string): Promise<string> {
    const apiBase = 'http://157.180.20.112:8001/api';
    const token = await this._getAuthToken();
    const response = await this.page.request.get(`${apiBase}/contacts/customers?search=${customerId}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok()) return 'System Customer';
    const json = await response.json();
    const name = json.items?.[0]?.name || 'System Customer';
    return name;
  }
}
