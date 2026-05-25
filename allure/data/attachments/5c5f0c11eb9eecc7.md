# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/procurement-temporal-isolation.spec.ts >> Procurement Temporal & Data Isolation Audits@purchase @security @regression @full >> Guardrail: System must explicitly reject historical back-dated Bills
- Location: tests/purchase/procurement-temporal-isolation.spec.ts:21:9

# Error details

```
Error: [SECURITY_VULNERABILITY] Historical Manipulation: System approved a back-dated bill from 2023. This allows tax/profit evasion.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "sample" [ref=e10]: s
        - generic [ref=e11]:
          - button "sample" [ref=e12] [cursor=pointer]:
            - generic: sample
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
          - img "sample" [ref=e62]: s
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
  1  | import { test, expect } from'@playwright/test';
  2  | import { AppManager } from'../../pages/AppManager';
  3  | 
  4  | /**
  5  |  * PROCUREMENT TEMPORAL & DATA ISOLATION
  6  |  * 
  7  |  * Objectives:
  8  |  * 1. Verify system explicitly rejects historical back-dated Bills (Anti-Fraud).
  9  |  * 2. Verify system strictly segregates bills by Vendor (Anti-IDOR/Data Leak).
  10 |  */
  11 | 
  12 | test.describe('Procurement Temporal & Data Isolation Audits@purchase @security @regression @full', () => {
  13 |     // Removed serial mode so all tests run even if one fails
  14 |     // test.describe.configure({ mode:'serial' });
  15 | 
  16 |     test.beforeEach(async ({ page }) => {
  17 |         const app = new AppManager(page);
  18 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  19 |     });
  20 | 
  21 |     test('Guardrail: System must explicitly reject historical back-dated Bills', async ({ page }) => {
  22 |         // [KNOWN BUG] API accepts back-dated historical bills allowing temporal manipulation.
  23 |         
  24 |         const app = new AppManager(page);
  25 |         const meta = await app.api.purchase.discoverMetadataAPI();
  26 |         const item = await app.api.inventory.captureRandomItemDataAPI();
  27 | 
  28 |         // Target a date 1 year in the past
  29 |         const backDate ='2023-01-01T00:00:00Z';
  30 |         console.log(`[ATTACK] Attempting to inject a Bill from ${backDate} (Historical Manipulation)...`);
  31 | 
  32 |         try {
  33 |             // Using a raw payload override to bypass any UI date-pickers
  34 |             const payload = {
  35 |                 itemData: item,
  36 |                 unitPrice: 5000,
  37 |                 quantity: 1,
  38 |                 vendorId: meta.vendorId,
  39 |                 invoice_date: backDate
  40 |             };
  41 | 
  42 |             const bill = await app.api.purchase.createBillAPI(payload as any);
  43 |             console.log(`[VULNERABILITY] System accepted back-dated Bill creation: ${bill.ref}`);
  44 |             
  45 |             // Try to approve it
  46 |             await app.advanceDocumentAPI(bill.id,'bills');
> 47 |             throw new Error(`[SECURITY_VULNERABILITY] Historical Manipulation: System approved a back-dated bill from 2023. This allows tax/profit evasion.`);
     |                   ^ Error: [SECURITY_VULNERABILITY] Historical Manipulation: System approved a back-dated bill from 2023. This allows tax/profit evasion.
  48 | 
  49 |         } catch (err: any) {
  50 |             if (err.message.includes('SECURITY_VULNERABILITY')) throw err;
  51 |             console.log(`[PASS] Historical back-dating blocked or rejected by the audit engine.`);
  52 |         }
  53 |     });
  54 | 
  55 |     test('Guardrail: System must strictly segregate bills by Vendor', async ({ page }) => {
  56 |         // [KNOWN BUG] API returns Vendor A's bills when querying Vendor B's ledger.
  57 |         
  58 |         const app = new AppManager(page);
  59 |         
  60 |         console.log(`[STEP 1] Discovering two different vendors...`);
  61 |         const vendorA = await app.api.purchase.discoverRandomVendorAPI();
  62 |         
  63 |         // Find another vendor - we can just call it again and check if it's different
  64 |         let vendorB = await app.api.purchase.discoverRandomVendorAPI();
  65 |         if (vendorB.id === vendorA.id) {
  66 |             console.log('[INFO] Second discovery returned same vendor, skipping isolation check or retry...');
  67 |             // In a real scenario we'd loop, but for now we skip if no second vendor found
  68 |         }
  69 | 
  70 |         // 1. Create a Bill for Vendor A
  71 |         console.log(`[STEP 2] Creating private Bill for Vendor A: "${vendorA.name}"`);
  72 |         const item = await app.api.inventory.captureRandomItemDataAPI();
  73 |         const billA = await app.api.purchase.createBillAPI({ itemData: item, vendorId: vendorA.id });
  74 | 
  75 |         // 2. ATTACK: Try to fetch Bill A using Vendor B's context
  76 |         console.log(`[ATTACK] Attempting Cross-Vendor IDOR: Fetching Vendor A's bill via Vendor B's ledger...`);
  77 |         
  78 |         const apiBase = process.env.BASE_URL?.replace(/\/$/,'') ||'http://157.180.20.112:8001';
  79 |         const token = await app._getAuthToken();
  80 |         const company = process.env.BEFFA_COMPANY ||'sample';
  81 |         
  82 |         const leakResp = await page.request.get(`${apiBase.replace(':4173',':8001')}/api/vendor/${vendorB.id}/bills`, {
  83 |             headers: {'x-company': company,'Authorization':`Bearer ${token}` }
  84 |         });
  85 |         
  86 |         const leakData = await leakResp.json();
  87 |         const billsInB = leakData.data || leakData.items || [];
  88 |         
  89 |         const foundLeak = billsInB.find((b: any) => b.id === billA.id);
  90 | 
  91 |         if (foundLeak) {
  92 |             throw new Error(`[SECURITY_VULNERABILITY] IDOR: Vendor A's private Bill was visible in Vendor B's ledger! Data leak detected.`);
  93 |         }
  94 | 
  95 |         console.log(`[PASS] Cross-Vendor Isolation verified. Bills are strictly segregated.`);
  96 |     });
  97 | });
  98 | 
```