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
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e6]
      - img [ref=e8]
      - generic [ref=e11]:
        - heading "Welcome to, befa" [level=3] [ref=e12]
        - paragraph [ref=e13]: Empower Your Finances, Simplify Your Success
        - paragraph [ref=e14]: From meticulous bookkeeping to seamless inventory control, we've got your back.
    - generic [ref=e16]:
      - heading "Login To Your Account" [level=2] [ref=e17]
      - generic [ref=e18]:
        - text: Not a member?
        - link "Register" [ref=e19] [cursor=pointer]:
          - /url: /users/register
      - generic [ref=e21]:
        - group [ref=e22]:
          - generic [ref=e23]: Email *
          - textbox "Email *" [ref=e25]:
            - /placeholder: Enter your email
        - group [ref=e26]:
          - generic [ref=e27]: Password *
          - generic [ref=e28]:
            - textbox "Password *" [ref=e29]:
              - /placeholder: Enter your password
            - button "Show password" [ref=e31] [cursor=pointer]:
              - img [ref=e32]
        - link "Forget Password?" [ref=e37] [cursor=pointer]:
          - /url: forget-password
        - button "Login" [ref=e39] [cursor=pointer]
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