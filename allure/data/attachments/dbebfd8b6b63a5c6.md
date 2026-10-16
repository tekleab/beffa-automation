# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/api-contract-schema.spec.ts >> API Contract & Runtime Schema Validation @smoke >> Sales Invoice API response matches strict schema contract
- Location: tests/cross-module/api-contract-schema.spec.ts:16:7

# Error details

```
Error: Accounts Discovery HTTP 400: {
	"code": 400,
	"message": "Company not found"
}

```

# Test source

```ts
  1   | import { Page, Locator } from '@playwright/test';
  2   | import { BasePage } from '../base-page';
  3   | 
  4   | export class SalesAPI extends BasePage {
  5   |   page: Page;
  6   |   emailInput: Locator;
  7   |   passwordInput: Locator;
  8   |   loginBtn: Locator;
  9   |   mainPhoneInput: Locator;
  10  |   customerNameInput: Locator;
  11  |   customerTinInput: Locator;
  12  |   approvedStatus: string;
  13  |   actionButtons: string;
  14  |   companyBtn: Locator;
  15  | 
  16  |   constructor(page: Page) {
  17  | 
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
  39  |   async discoverMetadataAPI(): Promise<{ arAccountId: string; salesAccountId: string; cashAccountId: string; customerId: string; currencyId: string; taxId: string; locationId: string; warehouseId: string }> {
  40  |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  41  |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  42  |     const token = await this._getAuthToken();
  43  |     const company = this.company;
  44  |     const { DateHelper: _DH } = require('../utils/DateHelper');
  45  |     const params = _DH.qs();
  46  |     const headers = { 'x-company': company, 'Authorization': `Bearer ${token}` };
  47  | 
  48  |     const safeJson = async (resp: any, label: string) => {
  49  |       const text = await resp.text();
> 50  |       if (!resp.ok()) throw new Error(`${label} HTTP ${resp.status()}: ${text.substring(0, 200)}`);
      |                             ^ Error: Accounts Discovery HTTP 400: {
  51  |       try { return JSON.parse(text); } catch (e) {
  52  |         throw new Error(`${label} returned invalid JSON: ${text.substring(0, 150)}`);
  53  |       }
  54  |     };
  55  | 
  56  |     // 1. Fetch Accounts
  57  |     const accResp = await this.safeGet(`${apiBase}/accounts?page=1&pageSize=200&${params}`, { headers });
  58  |     const accData = await safeJson(accResp, 'Accounts Discovery');
  59  |     const allAccounts = accData.items || accData.data || [];
  60  | 
  61  |     // type is a plain string e.g. "Cash & Cash Equivalents" — not a nested object
  62  |     const typeStr = (a: any) => (a.type || a.account_type || '').toLowerCase();
  63  | 
  64  |     // Precise AR account
  65  |     const arAccount =
  66  |       allAccounts.find((a: any) => a.name?.toLowerCase() === 'accounts receivable') ||
  67  |       allAccounts.find((a: any) => a.name?.toLowerCase().includes('receivable')) ||
  68  |       allAccounts.find((a: any) => typeStr(a).includes('receivable')) ||
  69  |       allAccounts[0];
  70  | 
  71  |     const salesAccount =
  72  |       allAccounts.find((a: any) => a.name?.toLowerCase() === 'sales') ||
  73  |       allAccounts.find((a: any) => typeStr(a).includes('revenue') || typeStr(a).includes('income')) ||
  74  |       arAccount;
  75  | 
  76  |     // 2. Fetch Customer
  77  |     const custResp = await this.safeGet(`${apiBase}/customers?page=1&pageSize=10&${params}`, { headers });
  78  |     const custData = await safeJson(custResp, 'Customer Discovery');
  79  |     const customer = custData.items?.[0] || custData.data?.[0];
  80  | 
  81  |     // 3. Fetch Currency
  82  |     const currResp = await this.safeGet(`${apiBase}/currency?${params}`, { headers });
  83  |     const currData = await safeJson(currResp, 'Currency Discovery');
  84  |     const currency = currData.items?.[0] || currData.data?.[0];
  85  | 
  86  |     // 4. Fetch Tax (optional)
  87  |     let tax: any = null;
  88  |     try {
  89  |       const taxResp = await this.safeGet(`${apiBase}/taxes?${params}`, { headers });
  90  |       if (taxResp.ok()) {
  91  |         const taxData = await taxResp.json();
  92  |         tax = taxData.items?.[0] || taxData.data?.[0] || null;
  93  |       }
  94  |     } catch (e) {
  95  |       console.warn(`[WARN] Tax Discovery failed — continuing without tax`);
  96  |     }
  97  | 
  98  |     // 5. Fetch Location/Warehouse
  99  |     const locResp = await this.safeGet(`${apiBase}/locations?page=1&pageSize=10&${params}`, { headers });
  100 |     let locationId = '', warehouseId = '';
  101 |     if (locResp.ok()) {
  102 |       const locData = await locResp.json();
  103 |       const firstLoc = (locData.items || locData.data || [])[0];
  104 |       if (firstLoc) {
  105 |         locationId = firstLoc.id;
  106 |         warehouseId = await this.resolveWarehouseIdFromLocation(firstLoc);
  107 |       }
  108 |     }
  109 | 
  110 |     const cashAccount =
  111 |       allAccounts.find((a: any) => a.name?.toLowerCase().includes('branch')) ||
  112 |       allAccounts.find((a: any) => (a.account_id || a.code) === '1002') ||
  113 |       allAccounts.find((a: any) => a.name?.toLowerCase().includes('petty')) ||
  114 |       allAccounts.find((a: any) => a.name?.toLowerCase().includes('cash')) ||
  115 |       allAccounts.find((a: any) => typeStr(a).includes('cash') || typeStr(a).includes('bank')) ||
  116 |       allAccounts[0];
  117 | 
  118 |     if (!arAccount || !customer) throw new Error('Metadata Discovery Failed: Missing Account or Customer records.');
  119 | 
  120 |     return {
  121 |       arAccountId: arAccount.id,
  122 |       salesAccountId: salesAccount?.id || arAccount.id,
  123 |       cashAccountId: cashAccount?.id || '',
  124 |       customerId: customer.id,
  125 |       currencyId: currency?.id || '',
  126 |       taxId: tax?.id || '',
  127 |       locationId,
  128 |       warehouseId
  129 |     };
  130 |   }
  131 | 
  132 |   async createSalesOrderAPI(data: Record<string, any> = {}): Promise<{ success: boolean; ref: string; id: string; customerId: string; soItemId: string | null; status?: number; error?: string }> {
  133 |     let apiBase = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001').replace(/['"+]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001'); if (!apiBase.startsWith('http')) apiBase = 'http://' + apiBase;
  134 |     if (!apiBase.endsWith('/api')) apiBase += '/api';
  135 |     const token = await this._getAuthToken();
  136 |     const { DateHelper: _DH } = require('../utils/DateHelper');
  137 |     const params = _DH.qs();
  138 |     const headers = { 'x-company': this.company, 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' };
  139 | 
  140 |     // Discover live company environment
  141 |     const meta = await this.discoverMetadataAPI();
  142 | 
  143 |     // Dynamically fallback locations if not provided
  144 |     let locationId = data.locationId;
  145 |     let warehouseId = data.warehouseId;
  146 |     if (!locationId || !warehouseId) {
  147 |       // Fall back to meta values first
  148 |       locationId = locationId || meta.locationId;
  149 |       warehouseId = warehouseId || meta.warehouseId;
  150 |     }
```