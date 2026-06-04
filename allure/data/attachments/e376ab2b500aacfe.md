# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-doc-integrity.spec.ts >> Procurement Document Integrity Attacks @purchase @security @logic @regression @full >> Guardrail: Concurrent identical PO submissions must not create duplicate liability
- Location: tests/purchase/po-doc-integrity.spec.ts:118:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Duplicate PO race succeeded — both POs approved and billed. Total AP liability doubled to 20000. No deduplication guard exists.
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
  49  |                 quantity: 1,
  50  |                 vendorId: meta.vendorId,
  51  |                 invoice_date: futureDateStr,
  52  |                 due_date: futureDateStr
  53  |             } as any);
  54  |             console.log(`[INFO] Future-dated bill created: ${bill.ref} (${bill.id})`);
  55  | 
  56  |             await app.advanceDocumentAPI(bill.id, 'bills');
  57  |             throw new Error(`[CRITICAL_LOGIC_BUG] System approved a bill dated ${futureDateStr}. Future-period AP liability injection possible — balance sheet manipulation.`);
  58  |         } catch (err: any) {
  59  |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
  60  |             console.log(`[PASS] Future-dated bill correctly blocked: ${err.message}`);
  61  |         }
  62  |     });
  63  | 
  64  |     // ── 2. PO QUANTITY EXHAUSTION THEN +1 UNIT ───────────────────────────────
  65  |     test('Guardrail: System must block billing beyond 100% of PO quantity', async ({ page }) => {
  66  |         const app = new AppManager(page);
  67  |         const meta = sharedMeta;
  68  |         const item = sharedItem;
  69  | 
  70  |         const poQty = 10;
  71  |         console.log(`[STEP 1] Creating PO for exactly ${poQty} units...`);
  72  |         const po = await app.api.purchase.createPurchaseOrderAPI(item, poQty, 1000, meta.vendorId);
  73  |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  74  |         console.log(`[PO] ${po.poNumber} (${po.poId})`);
  75  | 
  76  |         console.log(`[STEP 2] Billing exactly ${poQty} units (100% of PO) — must succeed...`);
  77  |         const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId);
  78  |         await app.advanceDocumentAPI(bill1.billId, 'bills');
  79  |         console.log(`[BILL 1] ${bill1.billNumber} — 100% of PO consumed`);
  80  | 
  81  |         console.log(`[ATTACK] Attempting to bill 1 more unit beyond exhausted PO...`);
  82  |         const { apiBase, headers, qs } = await app.buildApiContext();
  83  | 
  84  |         const poResp = await page.request.get(`${apiBase}/purchase-order/${po.poId}?${qs}`, { headers });
  85  |         const poData = await poResp.json();
  86  |         const poItemId = poData.po_items?.[0]?.id;
  87  | 
  88  |         const overflowResp = await page.request.post(`${apiBase}/bills?${qs}`, {
  89  |             headers,
  90  |             data: {
  91  |                 purchase_order_id: po.poId,
  92  |                 vendor_id: meta.vendorId,
  93  |                 accounts_payable_id: sharedMeta.apAccountId,
  94  |                 currency_id: sharedMeta.currencyId,
  95  |                 invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  96  |                 due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  97  |                 items: [],
  98  |                 received_purchase_order_items: [{ po_item_id: poItemId, received_quantity: 1, received_unit_price: 1000 }],
  99  |                 status: 'draft'
  100 |             }
  101 |         });
  102 | 
  103 |         if (overflowResp.ok()) {
  104 |             const overflowBill = await overflowResp.json();
  105 |             try {
  106 |                 await app.advanceDocumentAPI(overflowBill.id, 'bills');
  107 |                 throw new Error(`[CRITICAL_LOGIC_BUG] System approved a bill for 1 unit beyond the fully-exhausted PO ${po.poNumber}. Over-receiving liability created.`);
  108 |             } catch (err: any) {
  109 |                 if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
  110 |                 console.log(`[PASS] Overflow bill created but approval blocked: ${err.message}`);
  111 |             }
  112 |         } else {
  113 |             console.log(`[PASS] Overflow bill creation rejected at API level: HTTP ${overflowResp.status()}`);
  114 |         }
  115 |     });
  116 | 
  117 |     // ── 3. DUPLICATE PO SUBMISSION RACE ──────────────────────────────────────
  118 |     test('Guardrail: Concurrent identical PO submissions must not create duplicate liability', async ({ page }) => {
  119 |         const app = new AppManager(page);
  120 |         const meta = sharedMeta;
  121 |         const item = sharedItem;
  122 | 
  123 |         console.log(`[ATTACK] Firing 2 identical POs simultaneously...`);
  124 |         const [result1, result2] = await Promise.allSettled([
  125 |             app.api.purchase.createPurchaseOrderAPI(item, 10, 1000, meta.vendorId),
  126 |             app.api.purchase.createPurchaseOrderAPI(item, 10, 1000, meta.vendorId)
  127 |         ]);
  128 | 
  129 |         const successes = [result1, result2].filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
  130 |         console.log(`[SNAPSHOT] ${successes.length}/2 POs created`);
  131 | 
  132 |         if (successes.length === 2) {
  133 |             const po1 = successes[0].value;
  134 |             const po2 = successes[1].value;
  135 | 
  136 |             await app.advanceDocumentAPI(po1.poId, 'purchase-orders');
  137 |             await app.advanceDocumentAPI(po2.poId, 'purchase-orders');
  138 | 
  139 |             const bill1 = await app.api.purchase.createBillFromPoAPI(po1.poId);
  140 |             const bill2 = await app.api.purchase.createBillFromPoAPI(po2.poId);
  141 |             await app.advanceDocumentAPI(bill1.billId, 'bills');
  142 |             await app.advanceDocumentAPI(bill2.billId, 'bills');
  143 | 
  144 |             const b1Data = await app.api.purchase.getBillAPI(bill1.billId);
  145 |             const b2Data = await app.api.purchase.getBillAPI(bill2.billId);
  146 |             const totalLiability = parseFloat(b1Data.net_due ?? b1Data.due ?? b1Data.unpaid_amount ?? 0) + parseFloat(b2Data.net_due ?? b2Data.due ?? b2Data.unpaid_amount ?? 0);
  147 | 
  148 |             console.log(`[SNAPSHOT] Total AP liability from duplicate POs: ${totalLiability}`);
> 149 |             throw new Error(`[CRITICAL_LOGIC_BUG] Duplicate PO race succeeded — both POs approved and billed. Total AP liability doubled to ${totalLiability}. No deduplication guard exists.`);
      |                   ^ Error: [CRITICAL_LOGIC_BUG] Duplicate PO race succeeded — both POs approved and billed. Total AP liability doubled to 20000. No deduplication guard exists.
  150 |         }
  151 | 
  152 |         console.log(`[PASS] System handled concurrent PO submissions — only ${successes.length} succeeded.`);
  153 |     });
  154 | 
  155 |     // ── 4. APPROVED BILL LINE ITEM MUTATION ──────────────────────────────────
  156 |     test('Guardrail: System must reject mutation of an approved Bill line item', async ({ page }) => {
  157 |         const app = new AppManager(page);
  158 |         const meta = sharedMeta;
  159 |         const item = sharedItem;
  160 | 
  161 |         console.log(`[STEP 1] Creating & approving Bill for 5 units @ 1000...`);
  162 |         const bill = await app.api.purchase.createBillAPI({ itemData: item, unitPrice: 1000, quantity: 5, vendorId: meta.vendorId });
  163 |         await app.advanceDocumentAPI(bill.id, 'bills');
  164 |         console.log(`[BILL] ${bill.ref} (${bill.id}) — APPROVED`);
  165 | 
  166 |         const { apiBase, headers, qs } = await app.buildApiContext();
  167 | 
  168 |         const billData = await app.api.purchase.getBillAPI(bill.id);
  169 |         const lineItem = billData.items?.[0];
  170 |         if (!lineItem) {
  171 |             console.log(`[SKIP] No line items found on bill — cannot test mutation.`);
  172 |             return;
  173 |         }
  174 | 
  175 |         console.log(`[ATTACK] Attempting to mutate approved bill line item qty from 5 to 999...`);
  176 |         const mutateResp = await page.request.patch(`${apiBase}/bills/${bill.id}?${qs}`, {
  177 |             headers,
  178 |             data: { items: [{ ...lineItem, quantity: 999, amount: 999 * 1000 }] }
  179 |         });
  180 | 
  181 |         if (mutateResp.ok()) {
  182 |             const mutated = await app.api.purchase.getBillAPI(bill.id);
  183 |             const mutatedQty = mutated.items?.[0]?.quantity;
  184 |             if (mutatedQty === 999) {
  185 |                 throw new Error(`[CRITICAL_LOGIC_BUG] Approved bill ${bill.ref} line item mutated from qty=5 to qty=999 via PATCH. Financial document tampered post-approval — audit trail broken.`);
  186 |             }
  187 |             console.log(`[PASS] PATCH accepted but quantity not mutated (server ignored the change).`);
  188 |         } else {
  189 |             console.log(`[PASS] Mutation of approved bill correctly rejected: HTTP ${mutateResp.status()}`);
  190 |         }
  191 |     });
  192 | 
  193 |     // ── 5. BILL WITH NO VENDOR ────────────────────────────────────────────────
  194 |     test('Guardrail: System must reject Bill creation with no Vendor', async ({ page }) => {
  195 |         const app = new AppManager(page);
  196 |         const item = sharedItem;
  197 | 
  198 |         const { apiBase, headers, qs } = await app.buildApiContext();
  199 | 
  200 |         const locResp = await page.request.get(`${apiBase}/locations?page=1&pageSize=5&${qs}`, { headers });
  201 |         const locData = await locResp.json();
  202 |         const loc = (locData.items || locData.data || [])[0];
  203 | 
  204 |         console.log(`[ATTACK] Attempting to create Bill with vendor_id=null...`);
  205 |         const noVendorResp = await page.request.post(`${apiBase}/bills?${qs}`, {
  206 |             headers,
  207 |             data: {
  208 |                 accounts_payable_id: sharedMeta.apAccountId,
  209 |                 currency_id: sharedMeta.currencyId,
  210 |                 invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  211 |                 due_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  212 |                 vendor_id: null,
  213 |                 items: [{
  214 |                     item_id: item.itemId,
  215 |                     quantity: 1,
  216 |                     unit_price: 5000,
  217 |                     amount: 5000,
  218 |                     location_id: loc?.id,
  219 |                     warehouse_id: loc?.warehouse_id
  220 |                 }],
  221 |                 status: 'draft'
  222 |             }
  223 |         });
  224 | 
  225 |         if (noVendorResp.ok()) {
  226 |             const orphanBill = await noVendorResp.json();
  227 |             try {
  228 |                 await app.advanceDocumentAPI(orphanBill.id, 'bills');
  229 |                 throw new Error(`[CRITICAL_LOGIC_BUG] Bill approved with no vendor! Orphan AP liability created — no counterparty, no audit trail. Bill ID: ${orphanBill.id}`);
  230 |             } catch (err: any) {
  231 |                 if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
  232 |                 console.log(`[PASS] Vendorless bill created but approval blocked: ${err.message}`);
  233 |             }
  234 |         } else {
  235 |             console.log(`[PASS] Vendorless bill correctly rejected at creation: HTTP ${noVendorResp.status()}`);
  236 |         }
  237 |     });
  238 | 
  239 |     // ── 6. PO TO BILL 1:1 RECONCILIATION AUDIT ──────────────────────────────────
  240 |     test('Guardrail: System must enforce strict 1:1 reconciliation mapping between Purchase Order and Bill', async ({ page }) => {
  241 |         const app = new AppManager(page);
  242 |         const meta = sharedMeta;
  243 |         const item = sharedItem;
  244 | 
  245 |         const poQty = 8;
  246 |         const poPrice = 4500;
  247 | 
  248 |         console.log(`[RECONCILE] Step 1: Creating PO for ${poQty} units of "${item.itemName}"...`);
  249 |         const po = await app.api.purchase.createPurchaseOrderAPI(item, poQty, poPrice, meta.vendorId);
```