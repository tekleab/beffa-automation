# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-gl-audit.spec.ts >> Sales GL & Ledger Audits @sales @logic @regression @full >> Audit: Full cycle GL — AR debited on invoice, cleared on receipt
- Location: tests/sales/so-gl-audit.spec.ts:77:9

# Error details

```
Error: AR must be debited on invoice INV/2026/06/25/000499

expect(received).toBeTruthy()

Received: undefined
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
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | type JournalRow = { accountName: string; accountType: string; debit: string; credit: string };
  5   | type TxBlock = { docRef: string; docId: string; label: string; entries: JournalRow[]; status?: string };
  6   | 
  7   | function printGLReport(blocks: TxBlock[]) {
  8   |     const COL = { acc: 36, type: 28, dr: 12, cr: 12 };
  9   |     const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
  10  |     const rpad = (s: string, n: number) => s.padStart(n);
  11  |     const line = '─'.repeat(COL.acc + COL.type + COL.dr + COL.cr + 7);
  12  |     const fmt = (v: string) => parseFloat(v) > 0 ? parseFloat(v).toFixed(2) : '—';
  13  | 
  14  |     console.log(`\n${'='.repeat(line.length)}`);
  15  |     console.log(`  GL AUDIT REPORT — BEFFA ERP  |  Company: ${process.env.BEFFA_COMPANY || 'N/A'}  |  ${new Date().toISOString()}`);
  16  |     console.log('='.repeat(line.length));
  17  | 
  18  |     for (const b of blocks) {
  19  |         const status = b.status ? ` [${b.status.toUpperCase()}]` : '';
  20  |         console.log(`\n  ▶ ${b.label}${status}`);
  21  |         console.log(`    Ref: ${b.docRef}`);
  22  |         console.log(`    ID : ${b.docId}`);
  23  |         console.log(`  ${line}`);
  24  |         console.log(`  | ${pad('Account', COL.acc)} | ${pad('Type', COL.type)} | ${rpad('Debit', COL.dr)} | ${rpad('Credit', COL.cr)} |`);
  25  |         console.log(`  ${line}`);
  26  | 
  27  |         if (b.entries.length === 0) {
  28  |             console.log(`  | ${pad('(no posted entries — GL cleared)', COL.acc + COL.type + COL.dr + COL.cr + 9)} |`);
  29  |         } else {
  30  |             let totalDr = 0, totalCr = 0;
  31  |             for (const e of b.entries) {
  32  |                 const dr = parseFloat(e.debit || '0');
  33  |                 const cr = parseFloat(e.credit || '0');
  34  |                 totalDr += dr; totalCr += cr;
  35  |                 console.log(`  | ${pad(e.accountName, COL.acc)} | ${pad(e.accountType, COL.type)} | ${rpad(fmt(e.debit), COL.dr)} | ${rpad(fmt(e.credit), COL.cr)} |`);
  36  |             }
  37  |             console.log(`  ${line}`);
  38  |             const balanced = Math.abs(totalDr - totalCr) < 0.01;
  39  |             console.log(`  | ${pad('TOTAL', COL.acc)} | ${pad('', COL.type)} | ${rpad(totalDr.toFixed(2), COL.dr)} | ${rpad(totalCr.toFixed(2), COL.cr)} |`);
  40  |             console.log(`  | ${pad(balanced ? '✓ BALANCED (Dr = Cr)' : `⚠  IMBALANCE: ${Math.abs(totalDr - totalCr).toFixed(2)}`, COL.acc + COL.type + COL.dr + COL.cr + 9)} |`);
  41  |         }
  42  |         console.log(`  ${line}`);
  43  |     }
  44  |     console.log();
  45  | }
  46  | 
  47  | /**
  48  |  * SALES GL & LEDGER AUDITS
  49  |  *
  50  |  * Confirmed field names from live probe:
  51  |  *   Invoice journal : getJournalEntriesAPI(id) → {accountName, accountType, debit, credit}
  52  |  *   Receipt journal : GET /receipt/<id> → cash_disbursement_journal.journal_entries
  53  |  *                     entry fields: { account: {id, name, type}, credit, debit }
  54  |  *   AR identified by: accountType/account.type.name includes "receivable"
  55  |  *   Void rule       : receipt must be reversed BEFORE invoice can be voided
  56  |  */
  57  | 
  58  | test.describe('Sales GL & Ledger Audits @sales @logic @regression @full', () => {
  59  |     test.setTimeout(180000);
  60  | 
  61  |     const isAR = (e: any) =>
  62  |         e.accountType?.toLowerCase().includes('receivable') ||
  63  |         e.account?.type?.name?.toLowerCase().includes('receivable') ||
  64  |         e.account?.name?.toLowerCase().includes('receivable');
  65  | 
  66  |     async function fetchReceiptJournal(app: AppManager, receiptId: string) {
  67  |         const token = await app._getAuthToken();
  68  |         const qs = `year=${process.env.BEFFA_YEAR||'2018'}&period=${process.env.BEFFA_PERIOD||'yearly'}&calendar=${process.env.BEFFA_CALENDAR||'ec'}`;
  69  |         const apiBase = (app as any).base.apiBase;
  70  |         const headers = { 'x-company': process.env.BEFFA_COMPANY as string, 'Authorization': `Bearer ${token}` };
  71  |         const r = await (app as any).page.request.get(`${apiBase}/receipt/${receiptId}?${qs}`, { headers });
  72  |         if (!r.ok()) { console.log(`[WARN] receipt journal fetch ${r.status()}`); return []; }
  73  |         const json = await r.json();
  74  |         return json.cash_disbursement_journal?.journal_entries || [];
  75  |     }
  76  | 
  77  |     test('Audit: Full cycle GL — AR debited on invoice, cleared on receipt', async ({ page }) => {
  78  |         const app = new AppManager(page);
  79  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  80  | 
  81  |         const meta = await app.api.sales.discoverMetadataAPI();
  82  |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  83  |         if (!item) { console.log('[SKIP] No stock.'); return; }
  84  | 
  85  |         console.log(`[ITEM] ${item.itemName} | stock:${item.currentStock}`);
  86  | 
  87  |         // Step 1: Create & approve invoice
  88  |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  89  |             customerId: meta.customerId, itemId: item.itemId,
  90  |             quantity: 1, unitPrice: 500,
  91  |             locationId: item.locationId, warehouseId: item.warehouseId
  92  |         });
  93  |         await app.advanceDocumentAPI(inv.id, 'invoices');
  94  |         await page.waitForTimeout(3000);
  95  | 
  96  |         // Verify AR debit on invoice journal
  97  |         const invEntries = await app.api.inventory.getJournalEntriesAPI(inv.id);
  98  |         console.log(`[INVOICE JOURNAL] ${inv.ref} (${invEntries.length} entries)`);
  99  |         invEntries.forEach(e => console.log(`  ${e.accountName} (${e.accountType}) Dr:${e.debit} Cr:${e.credit}`));
  100 | 
  101 |         const arDebitEntry = invEntries.find(e => isAR(e) && parseFloat(e.debit) > 0);
> 102 |         expect(arDebitEntry, `AR must be debited on invoice ${inv.ref}`).toBeTruthy();
      |                                                                          ^ Error: AR must be debited on invoice INV/2026/06/25/000499
  103 |         const arDebitAmt = parseFloat(arDebitEntry!.debit);
  104 |         console.log(`[PASS] AR debited $${arDebitAmt} on ${inv.ref}`);
  105 | 
  106 |         // Step 2: Create & approve receipt
  107 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  108 |             invoiceId: inv.id, customerId: meta.customerId, amount: arDebitAmt
  109 |         });
  110 |         await app.advanceDocumentAPI(rct.id, 'receipts');
  111 |         await page.waitForTimeout(3000);
  112 | 
  113 |         // Verify AR credit on receipt journal
  114 |         const rctEntries = await fetchReceiptJournal(app, rct.id);
  115 |         console.log(`[RECEIPT JOURNAL] ${rct.ref} (${rctEntries.length} entries)`);
  116 |         rctEntries.forEach((e: any) => console.log(`  ${e.account?.name} Dr:${e.debit} Cr:${e.credit}`));
  117 | 
  118 |         const arCreditEntry = rctEntries.find((e: any) => isAR(e) && parseFloat(e.credit) > 0);
  119 |         expect(arCreditEntry, `AR must be credited on receipt ${rct.ref}`).toBeTruthy();
  120 |         const arCreditAmt = parseFloat(arCreditEntry.credit);
  121 | 
  122 |         const drift = Math.abs(arDebitAmt - arCreditAmt);
  123 |         console.log(`[AUDIT] AR Dr:$${arDebitAmt} (inv) Cr:$${arCreditAmt} (rct) drift:$${drift.toFixed(2)}`);
  124 | 
  125 |         if (drift > 1) {
  126 |             throw new Error(
  127 |                 `[VULNERABILITY] GL Drift — AR debit on invoice ≠ AR credit on receipt\n` +
  128 |                 `  Invoice: ${inv.ref} | AR Debit : $${arDebitAmt}\n` +
  129 |                 `  Receipt: ${rct.ref} | AR Credit: $${arCreditAmt}\n` +
  130 |                 `  Drift  : $${drift.toFixed(2)}`
  131 |             );
  132 |         }
  133 |         console.log(`[PASS] Full cycle GL: AR Dr=$${arDebitAmt} = Cr=$${arCreditAmt}`);
  134 | 
  135 |         printGLReport([
  136 |             { docRef: inv.ref, docId: inv.id, label: '1. Invoice (AR Debit)', entries: invEntries },
  137 |             { docRef: rct.ref, docId: rct.id, label: '2. Receipt (AR Credit)', entries: rctEntries.map((e: any) => ({
  138 |                 accountName: e.account?.name || '', accountType: e.account?.type?.name || '', debit: e.debit?.toString() || '0', credit: e.credit?.toString() || '0'
  139 |             })) }
  140 |         ]);
  141 |     });
  142 | 
  143 |     test('Audit: Credit note (void) must reverse AR debit from original invoice', async ({ page }) => {
  144 |         const app = new AppManager(page);
  145 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  146 | 
  147 |         const meta = await app.api.sales.discoverMetadataAPI();
  148 |         const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  149 |         if (!item) { console.log('[SKIP] No stock.'); return; }
  150 | 
  151 |         console.log(`[ITEM] ${item.itemName} | stock:${item.currentStock}`);
  152 | 
  153 |         // Step 1: Create & approve invoice
  154 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  155 |             customerId: meta.customerId, itemId: item.itemId,
  156 |             quantity: 1, unitPrice: 800,
  157 |             locationId: item.locationId, warehouseId: item.warehouseId
  158 |         });
  159 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  160 |         await page.waitForTimeout(3000);
  161 | 
  162 |         const invEntries = await app.api.inventory.getJournalEntriesAPI(inv.id);
  163 |         console.log(`[INVOICE JOURNAL] ${inv.ref} (${invEntries.length} entries)`);
  164 |         invEntries.forEach(e => console.log(`  ${e.accountName} (${e.accountType}) Dr:${e.debit} Cr:${e.credit}`));
  165 | 
  166 |         const arDebitEntry = invEntries.find(e => isAR(e) && parseFloat(e.debit) > 0);
  167 |         expect(arDebitEntry, `AR must be debited on invoice ${inv.ref}`).toBeTruthy();
  168 |         const arDebitAmt = parseFloat(arDebitEntry!.debit);
  169 |         console.log(`[PASS] AR debited $${arDebitAmt} on ${inv.ref}`);
  170 | 
  171 |         // Step 2: Create & approve receipt (required before void is allowed)
  172 |         const rct = await app.api.sales.createInvoiceReceiptAPI({
  173 |             invoiceId: inv.id, customerId: meta.customerId, amount: arDebitAmt
  174 |         });
  175 |         await app.advanceDocumentAPI(rct.id, 'receipts');
  176 |         await page.waitForTimeout(3000);
  177 |         console.log(`[RECEIPT] ${rct.ref} approved`);
  178 | 
  179 |         // Step 3: Reverse receipt FIRST — required by ERP before invoice can be voided
  180 |         console.log(`[STEP] Reversing receipt ${rct.ref}...`);
  181 |         const rctReversed = await app.api.sales.reverseReceiptAPI(rct.id);
  182 |         if (!rctReversed) throw new Error(`[FAIL] Receipt reversal failed for ${rct.ref} — cannot void invoice.`);
  183 |         await page.waitForTimeout(3000);
  184 |         console.log(`[PASS] Receipt ${rct.ref} reversed`);
  185 | 
  186 |         // Step 4: Void invoice
  187 |         console.log(`[STEP] Voiding invoice ${inv.ref}...`);
  188 |         const voided = await app.api.sales.reverseInvoiceAPI(inv.id);
  189 |         if (!voided) {
  190 |             throw new Error(
  191 |                 `[VULNERABILITY] Invoice Void API Failure\n` +
  192 |                 `  Invoice   : ${inv.ref} (ID: ${inv.id})\n` +
  193 |                 `  Impact    : AR balance permanently inflated by $${arDebitAmt}.\n` +
  194 |                 `  Root Cause: Backend void endpoint failed even after receipt was reversed.`
  195 |             );
  196 |         }
  197 |         console.log(`[VOID] id=${voided.id} ref=${voided.ref} status=${voided.voidedStatus}`);
  198 |         await page.waitForTimeout(5000);
  199 | 
  200 |         // Step 5: Verify AR reversal
  201 |         // Two valid ERP void patterns:
  202 |         //   A) Credit note created → separate document has AR credit entry
```