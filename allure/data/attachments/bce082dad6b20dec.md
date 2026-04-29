# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/concurrency-race-conditions.spec.ts >> Concurrency & Race Condition Audits @security @concurrency @sales >> Guardrail: System must enforce thread-safe serialization for stock reduction limits
- Location: tests/sales/concurrency-race-conditions.spec.ts:111:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Concurrency Failure: Approved both invoices for 1 unit. Warehouse desynced.
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
  62  |             customerId: meta.customerId,
  63  |             itemId: item.itemId,
  64  |             unitPrice: INVOICE_AMOUNT,
  65  |             locationId: item.locationId,
  66  |             warehouseId: item.warehouseId
  67  |         });
  68  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  69  | 
  70  |         const receiptPayload = {
  71  |             amount: INVOICE_AMOUNT,
  72  |             cash_account_id: cashAcct.id,
  73  |             customer_id: meta.customerId,
  74  |             date: new Date().toISOString(),
  75  |             payment_method: 'cash',
  76  |             currency_id: currency.id,
  77  |             invoice_receipts: [{ amount: INVOICE_AMOUNT, invoice_id: inv.id }]
  78  |         };
  79  | 
  80  |         console.log(`[ATTACK] Firing 2 concurrent receipt API calls for ${INVOICE_AMOUNT} each...`);
  81  |         const [resp1, resp2] = await Promise.all([
  82  |             page.request.post(`${apiBase}/receipts?${params}`, { data: receiptPayload, headers }),
  83  |             page.request.post(`${apiBase}/receipts?${params}`, { data: receiptPayload, headers })
  84  |         ]);
  85  | 
  86  |         const created: { id: string; ref: string }[] = [];
  87  |         for (const resp of [resp1, resp2]) { if (resp.ok()) { const body = await resp.json(); created.push({ id: body.id, ref: body.ref }); } }
  88  | 
  89  |         if (created.length === 2) {
  90  |             console.log('[ESCALATION] Both receipts created. Attempting to approve both...');
  91  |             const approvalResults = await Promise.allSettled(created.map(r => app.advanceDocumentAPI(r.id, 'receipts')));
  92  |             let approvedCount = 0;
  93  |             for (const result of approvalResults) { if (result.status === 'fulfilled') approvedCount++; }
  94  | 
  95  |             await page.waitForTimeout(5000);
  96  |             const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
  97  |             if (approvedCount === 2 && Number(finalInv.unreceived_amount) < 0) {
  98  |                 throw new Error(`[CRITICAL_RACE_CONDITION_BUG] Both concurrent receipts approved. AR over-credited: ${finalInv.unreceived_amount}`);
  99  |             } else {
  100 |                 console.log(`[PASS] At least one approval layer blocked the duplication. Approved: ${approvedCount}`);
  101 |             }
  102 |         } else {
  103 |             if (resp1.status() === 500 || resp2.status() === 500) console.log(`[SECONDARY_BUG] Backend crashed with 500 on concurrency check.`);
  104 |             console.log('[PASS] Concurrent receipt duplication handled at API layer.');
  105 |         }
  106 |     });
  107 | 
  108 |     // -------------------------------------------------------------------------
  109 |     // TEST 2: Negative Stock Race Condition
  110 |     // -------------------------------------------------------------------------
  111 |     test('Guardrail: System must enforce thread-safe serialization for stock reduction limits', async ({ page, request }) => {
  112 |         test.setTimeout(180000);
  113 |         const app = new AppManager(page);
  114 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  115 |         
  116 |         const meta = await app.api.sales.discoverMetadataAPI();
  117 |         const seedItem = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
  118 |         
  119 |         const bill = await app.createBillAPI({
  120 |             itemData: { ...seedItem, locationId: seedItem.locationId, warehouseId: seedItem.warehouseId },
  121 |             quantity: 5,
  122 |             unitPrice: 1500
  123 |         }); 
  124 |         await app.advanceDocumentAPI(bill.id, 'bills');
  125 | 
  126 |         let apiBase = (process.env.BASE_URL || 'http://157.180.20.112:8001').replace(/\/$/, '').replace(':4173', ':8001');
  127 |         if (!apiBase.endsWith('/api')) apiBase += '/api';
  128 |         const token = await app._getAuthToken();
  129 |         const params = `year=2018&period=yearly&calendar=ec`;
  130 |         const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };
  131 | 
  132 |         const buildRacePayload = () => ({
  133 |             accounts_receivable_id: meta.arAccountId,
  134 |             customer_id: meta.customerId,
  135 |             invoice_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
  136 |             currency_id: meta.currencyId,
  137 |             items: [{
  138 |                 amount: 3000,
  139 |                 general_ledger_account_id: meta.salesAccountId,
  140 |                 item_id: seedItem.itemId,
  141 |                 location_id: seedItem.locationId,
  142 |                 quantity: 1, 
  143 |                 unit_price: 3000,
  144 |                 warehouse_id: seedItem.warehouseId,
  145 |             }],
  146 |             released_sales_order_items: [],
  147 |             status: 'draft'
  148 |         });
  149 | 
  150 |         console.log('[ATTACK] Firing 2 concurrent Invoicing requests for the same single unit...');
  151 |         const [resp1, resp2] = await Promise.all([
  152 |             request.post(`${apiBase}/invoices?${params}`, { data: buildRacePayload(), headers }),
  153 |             request.post(`${apiBase}/invoices?${params}`, { data: buildRacePayload(), headers })
  154 |         ]);
  155 | 
  156 |         if ([200, 201].includes(resp1.status()) && [200, 201].includes(resp2.status())) {
  157 |             const body1 = await resp1.json();
  158 |             const body2 = await resp2.json();
  159 |             try {
  160 |                 await app.advanceDocumentAPI(body1.id, 'invoices');
  161 |                 await app.advanceDocumentAPI(body2.id, 'invoices');
> 162 |                 throw new Error(`[CRITICAL_LOGIC_BUG] Concurrency Failure: Approved both invoices for 1 unit. Warehouse desynced.`);
      |                       ^ Error: [CRITICAL_LOGIC_BUG] Concurrency Failure: Approved both invoices for 1 unit. Warehouse desynced.
  163 |             } catch (err: any) {
  164 |                 if (err.message.includes('CRITICAL_LOGIC_BUG')) throw err;
  165 |                 console.log(`[PASS] Approval layer blocked the double-spend after DB creation race.`);
  166 |             }
  167 |         } else {
  168 |             console.log('[PASS] Atomic threading handled the stock reduction race successfully.');
  169 |         }
  170 |     });
  171 | 
  172 | });
  173 | 
```