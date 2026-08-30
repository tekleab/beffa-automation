# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-security.spec.ts >> Procurement Security & Guardrails Audits @purchase @security @regression @full >> Guardrail: System must strictly segregate bills and payments by Vendor
- Location: tests/purchase/po-security.spec.ts:77:9

# Error details

```
Error: [CRITICAL_SECURITY_BUG] IDOR VULNERABILITY! Vendor B successfully paid Vendor A's bill.
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
  23  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  24  |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  25  | 
  26  |     test.beforeAll(async ({ browser }) => {
  27  |         const page = await browser.newPage();
  28  |         const app = new AppManager(page);
  29  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  30  | 
  31  |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  32  |         sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  33  |         await page.close();
  34  |     });
  35  | 
  36  |     test.beforeEach(async ({ page }) => {
  37  |         const app = new AppManager(page);
  38  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  39  | 
  40  |     });
  41  | 
  42  |     test('Guardrail: System must reject Billing for more units than the approved PO', async ({ page }) => {
  43  |         const app = new AppManager(page);
  44  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  45  |         const meta = sharedMeta;
  46  |         const item = sharedItem;
  47  | 
  48  |         // 1. Create PO for 10 units
  49  |         console.log(`[STEP 1] Creating PO for 10 units...`);
  50  |         const po = await app.api.purchase.createPurchaseOrderAPI(item, 10, 5000, meta.vendorId);
  51  |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  52  | 
  53  |         // 2. Attempt to Bill for 50 units
  54  |         console.log(`[ATTACK] Attempting to Bill 50 units against the 10-unit PO...`);
  55  | 
  56  |         try {
  57  |             const bill = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
  58  |             console.log(`[INFO] Bill created for PO. Checking if we can inflate quantity...`);
  59  | 
  60  |             await app.advanceDocumentAPI(bill.billId, 'bills');
  61  |             console.log(`[INFO] Bill approved. Verifying if it honored PO limits...`);
  62  | 
  63  |             const finalBill = await app.api.purchase.getBillAPI(bill.billId);
  64  |             const totalQty = finalBill.received_purchase_order_items?.reduce((sum: number, i: any) => sum + i.received_quantity, 0);
  65  | 
  66  |             if (totalQty > 10) {
  67  |                 throw new Error(`[CRITICAL_LOGIC_BUG] Over-Billing! PO: 10, Invoiced: ${totalQty}. Financial leakage detected.`);
  68  |             }
  69  |             console.log(`[PASS] System correctly enforced PO limits.`);
  70  | 
  71  |         } catch (err: any) {
  72  |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
  73  |             console.log(`[PASS] Over-Billing attempt blocked: ${err.message}`);
  74  |         }
  75  |     });
  76  | 
  77  |     test('Guardrail: System must strictly segregate bills and payments by Vendor', async ({ page }) => {
  78  |         const app = new AppManager(page);
  79  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  80  |         const { apiBase, headers, qs } = await app.buildApiContext();
  81  |         const meta = sharedMeta;
  82  |         const item = sharedItem;
  83  | 
  84  |         const vendorResp = await page.request.get(`${apiBase}/vendors?page=1&pageSize=10&${qs}`, { headers });
  85  |         let vendors = (await vendorResp.json()).items || (await vendorResp.json()).data || [];
  86  |         if (vendors.length < 2) {
  87  |             const newVendor = await app.api.purchase.createVendorAPI(`Sec-Vendor-${Date.now()}`);
  88  |             vendors.push(newVendor);
  89  |         }
  90  | 
  91  |         const vendorA = vendors[0];
  92  |         const vendorB = vendors[1];
  93  | 
  94  |         const BILL_AMT = 5000;
  95  |         const billA = await app.api.purchase.createBillAPI({
  96  |             vendorId: vendorA.id,
  97  |             itemId: item.itemId,
  98  |             quantity: 1,
  99  |             unitPrice: BILL_AMT,
  100 |             apAccountId: meta.apAccountId
  101 |         });
  102 |         await app.advanceDocumentAPI(billA.id, 'bills');
  103 | 
  104 |         const acctResp = await page.request.get(`${apiBase}/accounts?page=1&pageSize=50&${qs}`, { headers });
  105 |         const acctJson = await acctResp.json().catch(() => ({}));
  106 |         const allAccounts = acctJson.items || acctJson.data || [];
  107 |         const cashAcct = allAccounts.find((a: any) => (a.account_type || a.type || a.name || '').toLowerCase().includes('cash') || (a.account_type || a.type || a.name || '').toLowerCase().includes('bank')) || allAccounts[0];
  108 | 
  109 |         if (!cashAcct) throw new Error('[SETUP] No cash account found.');
  110 | 
  111 |         console.log(`[ATTACK] Submitting Payment under Vendor B, linking to Vendor A's Bill!`);
  112 |         const attackResp = await page.request.post(`${apiBase}/payments?${qs}`, {
  113 |             data: { amount: BILL_AMT, cash_account_id: cashAcct.id, vendor_id: vendorB.id, date: new Date().toISOString(), payment_method: 'cash', currency_id: meta.currencyId, bill_payments: [{ amount: BILL_AMT, bill_id: billA.id }] },
  114 |             headers
  115 |         });
  116 | 
  117 |         if ([200, 201].includes(attackResp.status())) {
  118 |             const body = await attackResp.json();
  119 |             try {
  120 |                 await app.advanceDocumentAPI(body.id, 'payments');
  121 |                 const finalBill = await app.api.purchase.getBillAPI(billA.id);
  122 |                 if (Number(finalBill.unpaid_amount) === 0) {
> 123 |                     throw new Error(`[CRITICAL_SECURITY_BUG] IDOR VULNERABILITY! Vendor B successfully paid Vendor A's bill.`);
      |                           ^ Error: [CRITICAL_SECURITY_BUG] IDOR VULNERABILITY! Vendor B successfully paid Vendor A's bill.
  124 |                 }
  125 |             } catch (e: any) {
  126 |                 if (e.message.includes('CRITICAL_SECURITY_BUG')) throw e;
  127 |                 console.log(`[PASS] Cross-vendor payment blocked at approval.`);
  128 |             }
  129 |         } else {
  130 |             console.log(`[PASS] IDOR payment blocked at API wall (Status: ${attackResp.status()}).`);
  131 |         }
  132 |     });
  133 | 
  134 |     test('Guardrail: System must strictly segregate bills by Vendor (IDOR read-access)', async ({ page }) => {
  135 |         const app = new AppManager(page);
  136 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  137 |         const { apiBase, headers, qs } = await app.buildApiContext();
  138 | 
  139 |         const vendorA = await app.api.purchase.discoverRandomVendorAPI();
  140 |         let vendorB = await app.api.purchase.discoverRandomVendorAPI();
  141 | 
  142 |         if (vendorB.id === vendorA.id) {
  143 |             vendorB = await app.api.purchase.createVendorAPI(`IDOR-Vendor-${Date.now()}`);
  144 |         }
  145 | 
  146 |         const billA = await app.api.purchase.createBillAPI({ itemData: sharedItem, vendorId: vendorA.id });
  147 | 
  148 |         console.log(`[ATTACK] Fetching Vendor A's bill via Vendor B's ledger...`);
  149 |         const leakResp = await page.request.get(`${apiBase}/vendor/${vendorB.id}/bills?${qs}`, { headers });
  150 |         const billsInB = (await leakResp.json()).data || (await leakResp.json()).items || [];
  151 |         const foundLeak = billsInB.find((b: any) => b.id === billA.id);
  152 | 
  153 |         if (foundLeak) {
  154 |             throw new Error(`[SECURITY_VULNERABILITY] IDOR: Vendor A's Bill was visible in Vendor B's ledger!`);
  155 |         }
  156 |         console.log(`[PASS] Cross-Vendor isolation verified.`);
  157 |     });
  158 | 
  159 |     // [KNOWN BUG] API accepts back-dated historical bills allowing temporal manipulation.
  160 |     test('Guardrail: System must explicitly reject historical back-dated bills', async ({ page }) => {
  161 |         const app = new AppManager(page);
  162 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  163 |         const meta = sharedMeta;
  164 |         const item = sharedItem;
  165 | 
  166 |         const rogueDate = '2021-04-29T00:00:00Z';
  167 |         console.log(`[ATTACK] Submitting Bill forged for: ${rogueDate}`);
  168 | 
  169 |         let rogueBill: any;
  170 |         try {
  171 |             rogueBill = await app.api.purchase.createBillAPI({
  172 |                 vendorId: meta.vendorId,
  173 |                 itemId: item.itemId,
  174 |                 quantity: 1,
  175 |                 unitPrice: 5000,
  176 |                 apAccountId: meta.apAccountId
  177 |             });
  178 |         } catch (err: any) {
  179 |             console.log(`[PASS] Backend API rejected back-dated bill creation payload: ${err.message}`);
  180 |             return;
  181 |         }
  182 | 
  183 |         console.log(`[VULNERABILITY] Backend API accepted back-dated payload! ID: ${rogueBill.ref}`);
  184 | 
  185 |         await app.advanceDocumentAPI(rogueBill.id, 'bills').catch(() => {});
  186 |         const finalStatus = await app.api.purchase.getBillAPI(rogueBill.id);
  187 | 
  188 |         if (finalStatus.status?.toLowerCase().includes('approved') || finalStatus.status?.toLowerCase().includes('authorized')) {
  189 |             throw new Error(`[CRITICAL_LOGIC_BUG #TEMP-01] ERP fully approved back-dated bill (${rogueBill.ref}, date: ${rogueDate})! Temporal immutability is violated.`);
  190 |         } else {
  191 |             throw new Error(`[ERP_BUG #TEMP-02] Temporal Immutability Violation: Backend API accepted back-dated bill payload (${rogueBill.ref}).`);
  192 |         }
  193 |     });
  194 | });
  195 | 
```