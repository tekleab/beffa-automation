# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/data-loading-pagination.spec.ts >> Data Loading & Pagination Audit Suite (BDEV-1135) @smoke >> BDEV-1138: Verify Pagination on Payables Detail Pages (Bills per Vendor)
- Location: tests/cross-module/data-loading-pagination.spec.ts:78:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * =============================================================================
  6   |  * MODULE: Data Loading & Pagination Audit Suite (JIRA: BDEV-1135 Epic)
  7   |  * SUBTASKS:
  8   |  * 1. BDEV-1136: Add Pagination on COA Detail Page
  9   |  * 2. BDEV-1137: Add Pagination on Receivables Detail Page
  10  |  * 3. BDEV-1138: Add Pagination on Payables Detail Pages
  11  |  * 4. BDEV-1139: Add Pagination on Bank Statements
  12  |  * =============================================================================
  13  |  */
  14  | 
  15  | test.describe('Data Loading & Pagination Audit Suite (BDEV-1135) @smoke', () => {
  16  |     test.setTimeout(180000);
  17  | 
  18  |     test('BDEV-1136: Verify Pagination on COA Detail / Accounts List', async ({ page }) => {
  19  |         const app = new AppManager(page);
  20  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  21  | 
  22  |         const token = await app._getAuthToken();
  23  |         const headers = {
  24  |             'Authorization': `Bearer ${token}`,
  25  |             'x-company': process.env.BEFFA_COMPANY as string,
  26  |             'Content-Type': 'application/json',
  27  |         };
  28  |         const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  29  | 
  30  |         console.log(`[BDEV-1136] Testing COA / Accounts Pagination (page=1, pageSize=5 vs page=2)...`);
  31  |         const resP1 = await page.request.get(`${app.apiBase}/accounts?page=1&pageSize=5&${params}`, { headers });
  32  |         expect(resP1.status()).toBe(200);
  33  |         const bodyP1 = await resP1.json();
  34  | 
  35  |         const itemsP1: any[] = bodyP1.data || bodyP1.items || [];
  36  |         const pagination = bodyP1.pagination || {};
  37  | 
  38  |         console.log(`[BDEV-1136] Page 1 returned ${itemsP1.length} accounts | Total: ${pagination.total}`);
  39  | 
  40  |         expect(itemsP1.length).toBeGreaterThan(0);
  41  |         expect(pagination.total).toBeDefined();
  42  | 
  43  |         // Audit summary print
  44  |         console.log(`[PASS] BDEV-1136 COA Detail/List Pagination verified (Total: ${pagination.total}, PageSize: 5)`);
  45  |     });
  46  | 
  47  |     test('BDEV-1137: Verify Pagination on Receivables Detail Page (Invoices per Customer)', async ({ page }) => {
  48  |         const app = new AppManager(page);
  49  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  50  | 
  51  |         const token = await app._getAuthToken();
  52  |         const headers = {
  53  |             'Authorization': `Bearer ${token}`,
  54  |             'x-company': process.env.BEFFA_COMPANY as string,
  55  |             'Content-Type': 'application/json',
  56  |         };
  57  |         const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  58  | 
  59  |         const customerId = '243b9845-e056-48ce-924d-6f233d99c574';
  60  |         console.log(`[BDEV-1137] Testing Receivables Detail Pagination for Customer ${customerId}...`);
  61  | 
  62  |         const response = await page.request.get(`${app.apiBase}/invoices?customer_id=${customerId}&page=1&pageSize=5&${params}`, { headers });
  63  |         expect(response.status()).toBe(200);
  64  |         const body = await response.json();
  65  | 
  66  |         const items: any[] = body.data || body.items || [];
  67  |         const pagination = body.pagination || {};
  68  | 
  69  |         console.log(`[BDEV-1137] Customer Invoices returned ${items.length} items | Total: ${pagination.total}`);
  70  | 
  71  |         expect(response.status()).toBe(200);
  72  |         expect(pagination.total).toBeDefined();
  73  |         expect(Number(pagination.total)).toBeGreaterThan(0);
  74  | 
  75  |         console.log(`[PASS] BDEV-1137 Receivables Detail Pagination verified (Total Invoices: ${pagination.total})`);
  76  |     });
  77  | 
  78  |     test('BDEV-1138: Verify Pagination on Payables Detail Pages (Bills per Vendor)', async ({ page }) => {
  79  |         const app = new AppManager(page);
  80  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  81  | 
  82  |         const token = await app._getAuthToken();
  83  |         const headers = {
  84  |             'Authorization': `Bearer ${token}`,
  85  |             'x-company': process.env.BEFFA_COMPANY as string,
  86  |             'Content-Type': 'application/json',
  87  |         };
  88  |         const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  89  | 
  90  |         console.log(`[BDEV-1138] Testing Payables Detail Pagination for Vendor Bills...`);
  91  | 
  92  |         const response = await page.request.get(`${app.apiBase}/bills?page=1&pageSize=5&${params}`, { headers });
> 93  |         expect(response.status()).toBe(200);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  94  |         const body = await response.json();
  95  | 
  96  |         const items: any[] = body.data || body.items || [];
  97  |         const pagination = body.pagination || {};
  98  | 
  99  |         console.log(`[BDEV-1138] Vendor Bills returned ${items.length} items | Total: ${pagination.total}`);
  100 | 
  101 |         expect(response.status()).toBe(200);
  102 |         expect(pagination.total).toBeDefined();
  103 | 
  104 |         console.log(`[PASS] BDEV-1138 Payables Detail Pagination verified (Total Bills: ${pagination.total})`);
  105 |     });
  106 | 
  107 |     test('BDEV-1139: Verify Pagination on Bank Statements', async ({ page }) => {
  108 |         const app = new AppManager(page);
  109 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  110 | 
  111 |         const token = await app._getAuthToken();
  112 |         const headers = {
  113 |             'Authorization': `Bearer ${token}`,
  114 |             'x-company': process.env.BEFFA_COMPANY as string,
  115 |             'Content-Type': 'application/json',
  116 |         };
  117 |         const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  118 | 
  119 |         console.log(`[BDEV-1139] Testing Bank Statements Pagination...`);
  120 | 
  121 |         const response = await page.request.get(`${app.apiBase}/bank-statements?page=1&pageSize=5&${params}`, { headers });
  122 |         expect(response.status()).toBe(200);
  123 |         const body = await response.json();
  124 | 
  125 |         const items: any[] = body.data || body.items || [];
  126 |         const pagination = body.pagination || {};
  127 | 
  128 |         console.log(`[BDEV-1139] Bank Statements returned ${items.length} items | Total: ${pagination.total}`);
  129 | 
  130 |         expect(response.status()).toBe(200);
  131 |         expect(pagination.total).toBeDefined();
  132 | 
  133 |         console.log(`[PASS] BDEV-1139 Bank Statements Pagination verified (Total Statements: ${pagination.total})`);
  134 |     });
  135 | });
  136 | 
```