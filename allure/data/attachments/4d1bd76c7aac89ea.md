# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/revenue-integrity.spec.ts >> Revenue Lifecycle & Integrity @regression @sales >> Integrated Sales Cycle & Duplicate Revenue Protection
- Location: tests/sales/revenue-integrity.spec.ts:15:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Integrity Collapse: Duplicate Receipt for INV/2026/04/28/000087 was CREATED, APPROVED, and POSTED.
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
  41  |         const startInv = baseline[inventoryAccountId];
  42  | 
  43  |         console.log(`[SNAPSHOT] Cash Baseline : ${startCash.toFixed(2)}`);
  44  |         console.log(`[SNAPSHOT] AR Baseline   : ${startAr.toFixed(2)}`);
  45  |         console.log(`[SNAPSHOT] Inv Baseline  : ${startInv.toFixed(2)}`);
  46  | 
  47  |         // --- PHASE 1: SALES INVOICE CREATION ---
  48  |         console.log('[STEP 1] Creating Standalone Sales Invoice via API');
  49  |         const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 10 });
  50  |         const customer = meta.customerId;
  51  | 
  52  |         const invoice = await app.api.sales.createStandaloneInvoiceAPI({
  53  |             customerId: customer,
  54  |             itemId: item.itemId,
  55  |             quantity: 10,
  56  |             unitPrice: 5000,
  57  |             locationId: item.locationId,
  58  |             warehouseId: item.warehouseId
  59  |         });
  60  | 
  61  |         // ⚡ Speed Approval
  62  |         await app.advanceDocumentAPI(invoice.id, 'invoices');
  63  |         console.log(`[SUCCESS] Invoice ${invoice.ref} fully approved.`);
  64  | 
  65  |         // --- GL AUDIT: POST-INVOICE VERIFICATION ---
  66  |         console.log(`[INFO] Waiting 5s for Invoice Ledger Posting...`);
  67  |         await page.waitForTimeout(5000);
  68  | 
  69  |         const stage1 = await app.getMultiAccountBalancesAPI([arAccountId, inventoryAccountId]);
  70  |         const invoiceArShift = stage1[arAccountId] - startAr;
  71  |         
  72  |         console.log(`[AUDIT] Stage 1: Verifying Receivable Impact...`);
  73  |         console.log(`[SNAPSHOT] Current AR: ${stage1[arAccountId].toFixed(2)} (Shift: ${invoiceArShift.toFixed(2)})`);
  74  | 
  75  |         // ASSERTION: AR must increase by the invoice amount (Debited)
  76  |         // Note: 50000 total. Depending on tax, AR shift should be exactly 50000.
  77  |         expect(Math.abs(invoiceArShift)).toBeGreaterThan(0);
  78  |         console.log(`[SUCCESS] AR Ledger confirmed. Sales amount is now a customer receivable.`);
  79  | 
  80  |         // --- PHASE 2: CUSTOMER RECEIPT (SETTLEMENT) ---
  81  |         console.log('[STEP 2] Settling FULL amount: 50000');
  82  |         const receipt = await app.api.sales.createInvoiceReceiptAPI({
  83  |             amount: 50000,
  84  |             customerId: customer,
  85  |             invoiceId: invoice.id
  86  |         });
  87  | 
  88  |         // ⚡ Speed Approval
  89  |         await app.advanceDocumentAPI(receipt.id, 'receipts');
  90  |         
  91  |         console.log(`[INFO] Waiting 5s for Ledger Posting...`);
  92  |         await page.waitForTimeout(5000);
  93  | 
  94  |         const stage2 = await app.getMultiAccountBalancesAPI([cashAccountId, arAccountId]);
  95  |         const pay1CashShift = stage2[cashAccountId] - startCash;
  96  |         const pay1ArShift = stage2[arAccountId] - stage1[arAccountId];
  97  | 
  98  |         console.log(`[AUDIT] Stage 2: Verifying Receipt Ledger Impact...`);
  99  |         console.log(`[SNAPSHOT] Cash Shift : ${pay1CashShift.toFixed(2)}`);
  100 |         console.log(`[SNAPSHOT] AR Shift   : ${pay1ArShift.toFixed(2)}`);
  101 | 
  102 |         // ASSERTION: Cash must increase (Debit), AR must decrease (Credit)
  103 |         expect(pay1CashShift).toBeGreaterThan(0);
  104 |         expect(pay1ArShift).toBeLessThan(0);
  105 |         console.log(`[SUCCESS] Customer Payment confirmed. Cash increased, Receivable cleared.`);
  106 | 
  107 |         // --- PHASE 3: THE DUPLICATE REVENUE ATTACK ---
  108 |         console.log('[STEP 3] VIOLATION: Attempting SECOND receipt for the SAME invoice');
  109 |         try {
  110 |             const duplicateReceipt = await app.api.sales.createInvoiceReceiptAPI({
  111 |                 amount: 50000,
  112 |                 customerId: customer,
  113 |                 invoiceId: invoice.id
  114 |             });
  115 | 
  116 |             console.log(`[REGRESSION] System allowed duplicate receipt creation: ${duplicateReceipt.ref}`);
  117 |             
  118 |             // --- STEP 4: ESCALATION ---
  119 |             console.log(`[STEP 4] ESCALATION: Checking if duplicate receipt can be APPROVED`);
  120 |             await app.advanceDocumentAPI(duplicateReceipt.id, 'receipts');
  121 |             console.info(`[CRITICAL] Ghost Approval: Duplicate receipt reached APPROVED state.`);
  122 | 
  123 |             console.log(`[INFO] Waiting 5s for Ledger Posting...`);
  124 |             await page.waitForTimeout(5000);
  125 | 
  126 |             const stage3 = await app.getMultiAccountBalancesAPI([cashAccountId, arAccountId]);
  127 |             const duplicateCashShift = stage3[cashAccountId] - stage2[cashAccountId];
  128 |             const duplicateArShift = stage3[arAccountId] - stage2[arAccountId];
  129 | 
  130 |             console.log(`[AUDIT] Stage 3: Verifying Duplicate Ledger Impact...`);
  131 |             console.log(`[SNAPSHOT] Cash Shift (Duplicate): ${duplicateCashShift.toFixed(2)}`);
  132 |             console.log(`[SNAPSHOT] AR Shift   (Duplicate): ${duplicateArShift.toFixed(2)}`);
  133 | 
  134 |             if (duplicateCashShift > 0 || Math.abs(duplicateArShift) > 0) {
  135 |                 console.error(`[CRITICAL] FINANCIAL_INTEGRITY_COMPROMISED: Duplicate receipt affected GL balances!`);
  136 |                 console.log(`================================================================================`);
  137 |                 console.log(`[VULNERABILITY DETECTED]: Double-Revenue/Receipt Approved for Invoice ${invoice.ref}`);
  138 |                 console.log(`[FINANCIAL IMPACT]: Ledger Compromised - Cash Shift: ${duplicateCashShift.toFixed(2)} | AR Shift: ${duplicateArShift.toFixed(2)}`);
  139 |                 console.log(`================================================================================`);
  140 |                 
> 141 |                 throw new Error(`[CRITICAL_LOGIC_BUG] Integrity Collapse: Duplicate Receipt for ${invoice.ref} was CREATED, APPROVED, and POSTED.`);
      |                       ^ Error: [CRITICAL_LOGIC_BUG] Integrity Collapse: Duplicate Receipt for INV/2026/04/28/000087 was CREATED, APPROVED, and POSTED.
  142 |             }
  143 | 
  144 |             console.log(`[PASS] Integrity Guardrail: Receipt Approval was BLOCKED or had 0.00 Ledger impact.`);
  145 | 
  146 |         } catch (error: any) {
  147 |             if (error.message.includes('[API BLOCK]') || error.message.includes('400')) {
  148 |                 console.log(`[SUCCESS] Integrity Guardrail: System blocked duplicate receipt.`);
  149 |             } else if (error.message.includes('[CRITICAL_LOGIC_BUG]')) {
  150 |                 throw error;
  151 |             } else {
  152 |                 console.log(`[INFO] System behavior: ${error.message}`);
  153 |                 // If it failed to approve, that's a partial pass (the ledger is safe)
  154 |             }
  155 |         }
  156 |     });
  157 | 
  158 | });
  159 | 
```