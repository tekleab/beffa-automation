# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/purchase-bill-payment-api.spec.ts >> Bill-to-Payment API Flow @regression >> Create Bill via API, Approve via UI, Pay via API then Verify
- Location: tests/purchase/purchase-bill-payment-api.spec.ts:6:9

# Error details

```
Error: Bill API Creation Failed: 422 - {
	"code": 422,
	"details": {
		"accounts_payable_id": [
			"Unable to find business account"
		],
		"currency_id": [
			"Unable to find currency"
		],
		"items.0.general_ledger_account_id": [
			"Unable to find business account."
		],
		"vendor_id": [
			"Unable to find vendor"
		]
	},
	"message": "Validation error when creating Bill"
}

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "smoke test" [ref=e10]: st
        - generic [ref=e11]:
          - button "smoke test" [ref=e12] [cursor=pointer]:
            - generic: smoke test
            - img [ref=e14]
          - generic [ref=e16] [cursor=pointer]:
            - button "Company Detail" [ref=e17]:
              - img [ref=e18]
            - button "Edit Company" [ref=e21]:
              - img [ref=e22]
            - button "Company Detail" [ref=e25]:
              - img [ref=e26]
      - generic [ref=e29]:
        - button "New" [ref=e30] [cursor=pointer]:
          - text: New
          - img [ref=e32]
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: "5"
          - img "Notifications" [ref=e38]
        - button "EC" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - paragraph [ref=e44]: EC
        - button [ref=e45] [cursor=pointer]:
          - img [ref=e46]
        - generic [ref=e49] [cursor=pointer]:
          - img "System" [ref=e51]: S
          - generic [ref=e52]:
            - generic [ref=e53]: System
            - paragraph [ref=e54]: IT Administrator / User Manager
    - generic [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - img "smoke test" [ref=e62]: st
          - paragraph [ref=e63]: Welcome, System
        - paragraph [ref=e65]: From meticulous bookkeeping to seamless inventory control, we've got your back.
        - generic [ref=e66]:
          - link "Dashboard" [ref=e67] [cursor=pointer]:
            - /url: /dashboard
          - link "Settings" [ref=e68] [cursor=pointer]:
            - /url: /settings/company/details
        - generic [ref=e69]:
          - link "Add Customer" [ref=e70] [cursor=pointer]:
            - /url: /receivables/customers/new
            - img [ref=e73]
            - text: Add Customer
          - link "Add Invoice" [ref=e74] [cursor=pointer]:
            - /url: /receivables/invoices/new
            - img [ref=e77]
            - text: Add Invoice
          - link "Add Receipt" [ref=e78] [cursor=pointer]:
            - /url: /receivables/receipts/new
            - img [ref=e81]
            - text: Add Receipt
          - link "Add Sales Order" [ref=e82] [cursor=pointer]:
            - /url: /receivables/sale-orders/new
            - img [ref=e85]
            - text: Add Sales Order
        - paragraph [ref=e87]: Quick Access
        - generic [ref=e88]:
          - generic [ref=e89]:
            - link "Sales Sales" [ref=e91] [cursor=pointer]:
              - /url: /receivables/overview/
              - button "Sales Sales" [ref=e92]:
                - generic [ref=e93]:
                  - img "Sales" [ref=e94]
                  - paragraph [ref=e95]: Sales
            - link "Purchase Purchase" [ref=e97] [cursor=pointer]:
              - /url: /payables/overview/
              - button "Purchase Purchase" [ref=e98]:
                - generic [ref=e99]:
                  - img "Purchase" [ref=e100]
                  - paragraph [ref=e101]: Purchase
            - link "Accounting Accounting" [ref=e103] [cursor=pointer]:
              - /url: /accounting/overview
              - button "Accounting Accounting" [ref=e104]:
                - generic [ref=e105]:
                  - img "Accounting" [ref=e106]
                  - paragraph [ref=e107]: Accounting
            - link "Leases Leases" [ref=e109] [cursor=pointer]:
              - /url: /leases/leases/?page=1&pageSize=15
              - button "Leases Leases" [ref=e110]:
                - generic [ref=e111]:
                  - img "Leases" [ref=e112]
                  - paragraph [ref=e113]: Leases
            - link "Assets Assets" [ref=e115] [cursor=pointer]:
              - /url: /assets/overview
              - button "Assets Assets" [ref=e116]:
                - generic [ref=e117]:
                  - img "Assets" [ref=e118]
                  - paragraph [ref=e119]: Assets
            - link "Budgets Budgets" [ref=e121] [cursor=pointer]:
              - /url: /public-sector-budgets/overview
              - button "Budgets Budgets" [ref=e122]:
                - generic [ref=e123]:
                  - img "Budgets" [ref=e124]
                  - paragraph [ref=e125]: Budgets
            - link "Payroll Payroll" [ref=e127] [cursor=pointer]:
              - /url: /payrolls
              - button "Payroll Payroll" [ref=e128]:
                - generic [ref=e129]:
                  - img "Payroll" [ref=e130]
                  - paragraph [ref=e131]: Payroll
            - link "Report Report" [ref=e133] [cursor=pointer]:
              - /url: /reports
              - button "Report Report" [ref=e134]:
                - generic [ref=e135]:
                  - img "Report" [ref=e136]
                  - paragraph [ref=e137]: Report
          - button "View All" [ref=e138] [cursor=pointer]:
            - text: View All
            - img [ref=e140]
      - img "Floating Icon" [ref=e143]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  12  |   approvedStatus: string;
  13  |   actionButtons: string;
  14  |   companyBtn: Locator;
  15  |   _getAuthToken!: () => Promise<string | null>;
  16  | 
  17  |   constructor(page: Page) {
  18  |     super(page);
  19  |     this.page = page;
  20  | 
  21  |     // Login selectors
  22  |     this.emailInput = page.getByRole('textbox', { name: 'Email *' });
  23  |     this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
  24  |     this.loginBtn = page.getByRole('button', { name: 'Login' });
  25  | 
  26  |     // --- Customer Module Selectors ---
  27  |     this.mainPhoneInput = page.getByRole('textbox', { name: /Main Phone/i });
  28  |     this.customerNameInput = page.getByRole('textbox', { name: 'Customer Name *' });
  29  |     this.customerTinInput = page.getByRole('textbox', { name: 'Customer TIN *' });
  30  | 
  31  |     // Status and Button Selectors
  32  |     this.approvedStatus = 'span.css-1ny2kle:has-text("Approved"), span:has-text("Approved")';
  33  |     this.actionButtons = 'button:has-text("Submit For Review"), button:has-text("Approve"), button:has-text("Advance"), button:has-text("Submit For Approver"), button:has-text("Submit Forapprover"), button:has-text("Submit For Approve"), button:has-text("Submit For Apporver")';
  34  | 
  35  |     // Company Switcher Selectors (Top-left)
  36  |     this.companyBtn = page.locator('button.chakra-menu__menu-button').first();
  37  |   }
  38  | 
  39  |   async createPurchaseOrderAPI(itemData: Record<string, any> = {}, qty: number = 10, unitPrice: number = 5000, vendorId: string | null = null): Promise<{ success: boolean; poNumber: string; poId: string }> {
  40  |     const apiBase = 'http://157.180.20.112:8001/api';
  41  |     // Fixed stable IDs for Tutorial Environment
  42  |     const payload = {
  43  |       accounts_payable_id: '20c381e1-4d14-4ab1-8e7e-dee2937b4a64',
  44  |       currency_id: '50567982-ee2f-4391-9400-3149067443a5',
  45  |       po_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  46  |       po_items: [{
  47  |         item_id: itemData.itemId,
  48  |         general_ledger_account_id: '20c381e1-4d14-4ab1-8e7e-dee2937b4a64', // 🛡️ CRITICAL FIX: Nesting GL Account inside the item
  49  |         location_id: '2595ebb0-4e78-4bc5-9321-140d3fd316c7',
  50  |         quantity: qty,
  51  |         tax_id: 'b017352f-f454-45e2-85ef-e327f90d8f9c',
  52  |         unit_price: unitPrice,
  53  |         warehouse_id: 'cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4',
  54  |         description: `Purchase of ${itemData.itemName}`
  55  |       }],
  56  |       purchase_type_id: 4,
  57  |       vendor_id: vendorId || 'b83a4bcd-0334-42fd-932c-b9bc5cc22208' // Use captured ID or fallback
  58  |     };
  59  | 
  60  |     const token = await this._getAuthToken();
  61  |     await this.startTacticalTimer();
  62  |     const response = await this.page.request.post(`${apiBase}/purchase-orders?year=2018&period=yearly&calendar=ec`, {
  63  |       data: payload,
  64  |       headers: {
  65  |         'x-company': 'smoke test',
  66  |         'Authorization': token ? `Bearer ${token}` : '',
  67  |         'Content-Type': 'application/json'
  68  |       }
  69  |     });
  70  |     await this.stopTacticalTimer('Create Purchase Order', 'API');
  71  | 
  72  |     if (!response.ok()) throw new Error(`PO API Creation Failed: ${response.status()} - ${await response.text()}`);
  73  |     const json = await response.json();
  74  |     console.log(`[SUCCESS] PO created via API: ${json.po_number} (ID: ${json.id})`);
  75  |     return { success: true, poNumber: json.po_number, poId: json.id };
  76  |   }
  77  | 
  78  |   async createBillAPI(itemData: Record<string, any> = {}, qty: number = 10, unitPrice: number = 5000, vendorId: string | null = null): Promise<{ success: boolean; billNumber: string; billId: string }> {
  79  |     const apiBase = 'http://157.180.20.112:8001/api';
  80  |     const payload = {
  81  |       accounts_payable_id: '998df511-68ea-48b9-b405-9419eb78145b',
  82  |       currency_id: '50567982-ee2f-4391-9400-3149067443a5',
  83  |       invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  84  |       due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  85  |       items: [{
  86  |         item_id: itemData.itemId,
  87  |         general_ledger_account_id: '20c381e1-4d14-4ab1-8e7e-dee2937b4a64',
  88  |         location_id: '2595ebb0-4e78-4bc5-9321-140d3fd316c7',
  89  |         quantity: qty,
  90  |         tax_id: 'b017352f-f454-45e2-85ef-e327f90d8f9c',
  91  |         unit_price: unitPrice,
  92  |         warehouse_id: 'cb4c2b44-2d3c-45b7-9b9a-1e34639f37a4',
  93  |         description: `Direct Bill of ${itemData.itemName}`,
  94  |         amount: qty * unitPrice
  95  |       }],
  96  |       vendor_id: vendorId || 'a8b71572-ff1b-4bbb-8bdd-f548359b46f3',
  97  |       status: 'draft'
  98  |     };
  99  | 
  100 |     const token = await this._getAuthToken();
  101 |     await this.startTacticalTimer();
  102 |     const response = await this.page.request.post(`${apiBase}/bills?year=2018&period=yearly&calendar=ec`, {
  103 |       data: payload,
  104 |       headers: {
  105 |         'x-company': 'smoke test',
  106 |         'Authorization': token ? `Bearer ${token}` : '',
  107 |         'Content-Type': 'application/json'
  108 |       }
  109 |     });
  110 |     await this.stopTacticalTimer('Create Bill', 'API');
  111 | 
> 112 |     if (!response.ok()) throw new Error(`Bill API Creation Failed: ${response.status()} - ${await response.text()}`);
      |                               ^ Error: Bill API Creation Failed: 422 - {
  113 |     const json = await response.json();
  114 |     console.log(`[SUCCESS] Bill created via API: ${json.invoice_number} (ID: ${json.id})`);
  115 |     return { success: true, billNumber: json.invoice_number, billId: json.id };
  116 |   }
  117 | 
  118 |   async createBillPaymentAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string }> {
  119 |     const apiBase = 'http://157.180.20.112:8001/api';
  120 |     const cashAccounts = ['9375b986-2772-434e-ada2-b1843e465604', 'f17570eb-6533-4249-8eba-e77a4ea92d43'];
  121 |     const token = await this._getAuthToken();
  122 | 
  123 |     const payload = {
  124 |       amount: data.amount,
  125 |       cash_account_id: data.cashAccountId || cashAccounts[0],
  126 |       vendor_id: data.vendorId,
  127 |       date: new Date().toISOString(),
  128 |       payment_method: 'cash',
  129 |       currency_id: '50567982-ee2f-4391-9400-3149067443a5',
  130 |       bill_payments: [{
  131 |         amount: data.amount,
  132 |         bill_id: data.billId
  133 |       }]
  134 |     };
  135 | 
  136 |     console.log(`[ACTION] Creating Bill Payment for ${data.billId} via API...`);
  137 |     const response = await this.page.request.post(`${apiBase}/payments?year=2018&period=yearly&calendar=ec`, {
  138 |       data: payload,
  139 |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  140 |     });
  141 | 
  142 |     if (!response.ok()) throw new Error(`Bill-Payment API Failed: ${response.status()} - ${await response.text()}`);
  143 |     const json = await response.json();
  144 |     console.log(`[SUCCESS] Payment created: ${json.ref} (ID: ${json.id})`);
  145 |     return { success: true, ref: json.ref, id: json.id };
  146 |   }
  147 | 
  148 |   async getBillAPI(billId: string): Promise<any> {
  149 |     const apiBase = 'http://157.180.20.112:8001/api';
  150 |     const token = await this._getAuthToken();
  151 |     const params = 'year=2018&period=yearly&calendar=ec';
  152 | 
  153 |     const response = await this.page.request.get(`${apiBase}/bill/${billId}?${params}`, {
  154 |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  155 |     });
  156 |     if (!response.ok()) throw new Error(`Failed to fetch Bill ${billId}: ${response.status()}`);
  157 |     return await response.json();
  158 |   }
  159 | 
  160 |   async approvePaymentAPI(paymentId: string): Promise<boolean> {
  161 |     const apiBase = 'http://157.180.20.112:8001/api';
  162 |     const token = await this._getAuthToken();
  163 |     const params = 'year=2018&period=yearly&calendar=ec';
  164 | 
  165 |     console.log(`[ACTION] Approving Payment ${paymentId} via API...`);
  166 |     const response = await this.page.request.patch(`${apiBase}/payments/${paymentId}?${params}`, {
  167 |       data: { status: 'approved' },
  168 |       headers: { 'x-company': 'smoke test', 'Authorization': token ? `Bearer ${token}` : '' }
  169 |     });
  170 |     return response.ok();
  171 |   }
  172 | }
  173 | 
```