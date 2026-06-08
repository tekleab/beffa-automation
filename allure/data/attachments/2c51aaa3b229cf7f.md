# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-security.spec.ts >> Procurement Security & Guardrails Audits @purchase @security @regression @full >> Guardrail: System must explicitly reject historical back-dated bills
- Location: tests/purchase/po-security.spec.ts:137:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] ERP fully approved a bill from the past (2021-04-29T00:00:00Z)! Immutability is broken.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - img "BM Tech" [ref=e10]: BT
        - generic [ref=e11]:
          - button "BM Tech" [ref=e12] [cursor=pointer]:
            - generic: BM Tech
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
          - img "BM Tech" [ref=e62]: BT
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
  59  |         }
  60  |     });
  61  | 
  62  |     test('Guardrail: System must strictly segregate bills and payments by Vendor', async ({ page }) => {
  63  |         const app = new AppManager(page);
  64  |         const { apiBase, headers, qs } = await app.buildApiContext();
  65  |         const meta = sharedMeta;
  66  |         const item = sharedItem;
  67  | 
  68  |         const vendorResp = await page.request.get(`${apiBase}/vendors?page=1&pageSize=10&${qs}`, { headers });
  69  |         const vendors = (await vendorResp.json()).items || [];
  70  |         if (vendors.length < 2) { console.log('[SKIP] Need at least 2 vendors.'); return; }
  71  | 
  72  |         const vendorA = vendors[0];
  73  |         const vendorB = vendors[1];
  74  | 
  75  |         const BILL_AMT = 5000;
  76  |         const billA = await app.api.purchase.createBillAPI({
  77  |             vendorId: vendorA.id,
  78  |             itemId: item.itemId,
  79  |             quantity: 1,
  80  |             unitPrice: BILL_AMT,
  81  |             apAccountId: meta.apAccountId
  82  |         });
  83  |         await app.advanceDocumentAPI(billA.id, 'bills');
  84  | 
  85  |         const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
  86  |         const cashAcct = (await acctResp.json()).items?.find((a: any) => a.account_type?.toLowerCase().includes('cash')) || (await acctResp.json()).items?.[0];
  87  | 
  88  |         console.log(`[ATTACK] Submitting Payment under Vendor B, linking to Vendor A's Bill!`);
  89  |         const attackResp = await page.request.post(`${apiBase}/payments?${qs}`, {
  90  |             data: { amount: BILL_AMT, cash_account_id: cashAcct.id, vendor_id: vendorB.id, date: new Date().toISOString(), payment_method: 'cash', currency_id: meta.currencyId, bill_payments: [{ amount: BILL_AMT, bill_id: billA.id }] },
  91  |             headers
  92  |         });
  93  | 
  94  |         if ([200, 201].includes(attackResp.status())) {
  95  |             const body = await attackResp.json();
  96  |             try {
  97  |                 await app.advanceDocumentAPI(body.id, 'payments');
  98  |                 const finalBill = await app.api.purchase.getBillAPI(billA.id);
  99  |                 if (Number(finalBill.unpaid_amount) === 0) {
  100 |                     throw new Error(`[CRITICAL_SECURITY_BUG] IDOR VULNERABILITY! Vendor B successfully paid Vendor A's bill.`);
  101 |                 }
  102 |             } catch (e: any) {
  103 |                 if (e.message.includes('CRITICAL_SECURITY_BUG')) throw e;
  104 |                 console.log(`[PASS] Cross-vendor payment blocked at approval.`);
  105 |             }
  106 |         } else {
  107 |             console.log(`[PASS] IDOR payment blocked at API wall (Status: ${attackResp.status()}).`);
  108 |         }
  109 |     });
  110 | 
  111 |     test('Guardrail: System must strictly segregate bills by Vendor (IDOR read-access)', async ({ page }) => {
  112 |         const app = new AppManager(page);
  113 |         const { apiBase, headers, qs } = await app.buildApiContext();
  114 | 
  115 |         const vendorA = await app.api.purchase.discoverRandomVendorAPI();
  116 |         const vendorB = await app.api.purchase.discoverRandomVendorAPI();
  117 | 
  118 |         if (vendorB.id === vendorA.id) {
  119 |             console.log(`[SKIP] Only one vendor exists — cannot test cross-vendor isolation.`);
  120 |             return;
  121 |         }
  122 | 
  123 |         const billA = await app.api.purchase.createBillAPI({ itemData: sharedItem, vendorId: vendorA.id });
  124 | 
  125 |         console.log(`[ATTACK] Fetching Vendor A's bill via Vendor B's ledger...`);
  126 |         const leakResp = await page.request.get(`${apiBase}/vendor/${vendorB.id}/bills?${qs}`, { headers });
  127 |         const billsInB = (await leakResp.json()).data || (await leakResp.json()).items || [];
  128 |         const foundLeak = billsInB.find((b: any) => b.id === billA.id);
  129 | 
  130 |         if (foundLeak) {
  131 |             throw new Error(`[SECURITY_VULNERABILITY] IDOR: Vendor A's Bill was visible in Vendor B's ledger!`);
  132 |         }
  133 |         console.log(`[PASS] Cross-Vendor isolation verified.`);
  134 |     });
  135 | 
  136 |     // [KNOWN BUG] API accepts back-dated historical bills allowing temporal manipulation.
  137 |     test('Guardrail: System must explicitly reject historical back-dated bills', async ({ page }) => {
  138 |         const app = new AppManager(page);
  139 |         const meta = sharedMeta;
  140 |         const item = sharedItem;
  141 | 
  142 |         const rogueDate = '2021-04-29T00:00:00Z';
  143 |         console.log(`[ATTACK] Submitting Bill forged for: ${rogueDate}`);
  144 | 
  145 |         try {
  146 |             const rogueBill = await app.api.purchase.createBillAPI({
  147 |                 vendorId: meta.vendorId,
  148 |                 itemId: item.itemId,
  149 |                 quantity: 1,
  150 |                 unitPrice: 5000,
  151 |                 apAccountId: meta.apAccountId
  152 |             });
  153 |             console.log(`[VULNERABILITY] Backend API accepted back-dated payload! ID: ${rogueBill.ref}`);
  154 | 
  155 |             try {
  156 |                 await app.advanceDocumentAPI(rogueBill.id, 'bills');
  157 |                 const finalStatus = await app.api.purchase.getBillAPI(rogueBill.id);
  158 |                 if (finalStatus.status?.toLowerCase().includes('approved') || finalStatus.status?.toLowerCase().includes('authorized')) {
> 159 |                     throw new Error(`[CRITICAL_LOGIC_BUG] ERP fully approved a bill from the past (${rogueDate})! Immutability is broken.`);
      |                           ^ Error: [CRITICAL_LOGIC_BUG] ERP fully approved a bill from the past (2021-04-29T00:00:00Z)! Immutability is broken.
  160 |                 }
  161 |                 console.log(`[PASS] Bill advanced but stopped short of full approval.`);
  162 |             } catch (authErr: any) {
  163 |                 if (authErr.message.includes('CRITICAL_LOGIC_BUG')) throw authErr;
  164 |                 console.log(`[PASS] Backend safely intercepted rogue date: ${authErr.message}`);
  165 |             }
  166 |         } catch (error: any) {
  167 |             if (error.message.includes('CRITICAL_LOGIC_BUG')) throw error;
  168 |             console.log(`[PASS] Back-dating blocked: ${error.message}`);
  169 |         }
  170 |     });
  171 | });
  172 | 
```