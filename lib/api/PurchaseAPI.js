
class PurchaseAPI {
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

  async createPurchaseOrderAPI(itemData = {}, qty = 10, unitPrice = 5000, vendorId = null) {
    const apiBase = "http://157.180.20.112:8001/api";
    // Fixed stable IDs for Tutorial Environment
    const payload = {
      accounts_payable_id: "20c381e1-4d14-4ab1-8e7e-dee2937b4a64",
      currency_id: "50567982-ee2f-4391-9400-3149067443a5",
      po_date: new Date().toISOString().split('T')[0] + "T00:00:00Z",
      po_items: [{
        item_id: itemData.itemId,
        general_ledger_account_id: "20c381e1-4d14-4ab1-8e7e-dee2937b4a64", // 🛡️ CRITICAL FIX: Nesting GL Account inside the item
        location_id: "2595ebb0-4e78-4bc5-9321-140d3fd316c7",
        quantity: qty,
        tax_id: "b017352f-f454-45e2-85ef-e327f90d8f9c",
        unit_price: unitPrice,
        warehouse_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
        description: `Purchase of ${itemData.itemName}`
      }],
      purchase_type_id: 4,
      vendor_id: vendorId || "b83a4bcd-0334-42fd-932c-b9bc5cc22208" // Use captured ID or fallback
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/purchase-orders?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: {
        'x-company': 'befa tutorial',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) throw new Error(`PO API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] PO created via API: ${json.po_number} (ID: ${json.id})`);
    return { success: true, poNumber: json.po_number, poId: json.id };
  }

  async createBillAPI(itemData = {}, qty = 10, unitPrice = 5000, vendorId = null) {
    const apiBase = "http://157.180.20.112:8001/api";
    const payload = {
      accounts_payable_id: "998df511-68ea-48b9-b405-9419eb78145b",
      currency_id: "50567982-ee2f-4391-9400-3149067443a5",
      invoice_date: new Date().toISOString().split('T')[0] + "T00:00:00Z",
      due_date: new Date().toISOString().split('T')[0] + "T00:00:00Z",
      items: [{
        item_id: itemData.itemId,
        general_ledger_account_id: "20c381e1-4d14-4ab1-8e7e-dee2937b4a64",
        location_id: "2595ebb0-4e78-4bc5-9321-140d3fd316c7",
        quantity: qty,
        tax_id: "b017352f-f454-45e2-85ef-e327f90d8f9c",
        unit_price: unitPrice,
        warehouse_id: "cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4",
        description: `Direct Bill of ${itemData.itemName}`,
        amount: qty * unitPrice
      }],
      vendor_id: vendorId || "a8b71572-ff1b-4bbb-8bdd-f548359b46f3",
      status: "draft"
    };

    const token = await this._getAuthToken();
    const response = await this.page.request.post(`${apiBase}/bills?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: {
        'x-company': 'befa tutorial',
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok()) throw new Error(`Bill API Creation Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Bill created via API: ${json.invoice_number} (ID: ${json.id})`);
    return { success: true, billNumber: json.invoice_number, billId: json.id };
  }

  async createBillPaymentAPI(data = {}) {
    const apiBase = "http://157.180.20.112:8001/api";
    const cashAccounts = ['9375b986-2772-434e-ada2-b1843e465604', 'f17570eb-6533-4249-8eba-e77a4ea92d43'];
    const token = await this._getAuthToken();

    const payload = {
      amount: data.amount,
      cash_account_id: data.cashAccountId || cashAccounts[0],
      vendor_id: data.vendorId,
      date: new Date().toISOString(),
      payment_method: "cash",
      currency_id: "50567982-ee2f-4391-9400-3149067443a5",
      bill_payments: [{
        amount: data.amount,
        bill_id: data.billId
      }]
    };

    console.log(`[ACTION] Creating Bill Payment for ${data.billId} via API...`);
    const response = await this.page.request.post(`${apiBase}/payments?year=2018&period=yearly&calendar=ec`, {
      data: payload,
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!response.ok()) throw new Error(`Bill-Payment API Failed: ${response.status()} - ${await response.text()}`);
    const json = await response.json();
    console.log(`[SUCCESS] Payment created: ${json.ref} (ID: ${json.id})`);
    return { success: true, ref: json.ref, id: json.id };
  }

  async getBillAPI(billId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    const params = "year=2018&period=yearly&calendar=ec";

    const response = await this.page.request.get(`${apiBase}/bill/${billId}?${params}`, {
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });
    if (!response.ok()) throw new Error(`Failed to fetch Bill ${billId}: ${response.status()}`);
    return await response.json();
  }

  async approvePaymentAPI(paymentId) {
    const apiBase = "http://157.180.20.112:8001/api";
    const token = await this._getAuthToken();
    const params = "year=2018&period=yearly&calendar=ec";

    console.log(`[ACTION] Approving Payment ${paymentId} via API...`);
    const response = await this.page.request.patch(`${apiBase}/payments/${paymentId}?${params}`, {
      data: { status: "approved" },
      headers: { 'x-company': 'befa tutorial', 'Authorization': token ? `Bearer ${token}` : '' }
    });
    return response.ok();
  }

}
module.exports = { PurchaseAPI };
