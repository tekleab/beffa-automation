# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-module/order-to-cash-e2e.spec.ts >> Order-to-Cash (O2C) Full Integration @cross-module @sales @regression >> Full E2E Cycle: SO -> Invoice (Release) -> Receipt -> Ledger & GL Verification
- Location: tests/cross-module/order-to-cash-e2e.spec.ts:50:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: ""
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { AppManager } from '../../pages/AppManager';
  3   | 
  4   | /**
  5   |  * ORDER-TO-CASH (O2C) END-TO-END AUDIT
  6   |  *
  7   |  * Full integration flow:
  8   |  * 1. Discover customer, currency, accounts.
  9   |  * 2. Create an item with stock.
  10  |  * 3. Create a Sales Order (SO) for the item.
  11  |  * 4. Approve/Release the SO.
  12  |  * 5. Create an Invoice from the SO.
  13  |  * 6. Approve the Invoice -> check stock reduction.
  14  |  * 7. Pay the Invoice (Create Receipt).
  15  |  * 8. Approve the Receipt.
  16  |  * 9. Verify Customer balance is reduced/cleared.
  17  |  * 10. Verify GL journal entry impact for both Invoice (Debit AR, Credit Sales)
  18  |  *     and Receipt (Debit Cash/Bank, Credit AR).
  19  |  */
  20  | 
  21  | const isAR = (e: any) => {
  22  |     const n = (e.accountName || e.account?.name || '').toLowerCase();
  23  |     return n.includes('receivable') || n.includes('accounts receivable') || n.includes('ar');
  24  | };
  25  | 
  26  | const isCash = (e: any) => {
  27  | 
  28  | /**
  29  |  * =============================================================================
  30  |  * MODULE: Order-to-Cash (O2C) - Full End-to-End Integration Suite
  31  |  * ARCHITECTURAL SCOPE & COVERAGE:
  32  |  * 1. Full cycle: Sales Order → Invoice (Release) → Receipt → GL Verification
  33  |  * 2. AR balance decrements after receipt applied to invoice
  34  |  * 3. GL journal entries verified at each O2C lifecycle stage
  35  |  * =============================================================================
  36  |  */
  37  | 
  38  |     const n = (e.accountName || e.account?.name || '').toLowerCase();
  39  |     return n.includes('cash') || n.includes('bank');
  40  | };
  41  | 
  42  | const isTax = (e: any) => {
  43  |     const n = (e.accountName || e.account?.name || '').toLowerCase();
  44  |     return n.includes('tax') || n.includes('vat');
  45  | };
  46  | 
  47  | test.describe('Order-to-Cash (O2C) Full Integration @cross-module @sales @regression', () => {
  48  |     test.setTimeout(360000);
  49  | 
  50  |     test('Full E2E Cycle: SO -> Invoice (Release) -> Receipt -> Ledger & GL Verification', async ({ page }) => {
  51  |         const app = new AppManager(page);
  52  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  53  | 
  54  |         const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;
  55  |         const token = await app._getAuthToken();
  56  |         const headers = {
  57  |             'Authorization': `Bearer ${token}`,
  58  |             'x-company': process.env.BEFFA_COMPANY as string,
  59  |             'Content-Type': 'application/json',
  60  |         };
  61  | 
  62  |         console.log(`[STEP 1] Metadata & Inventory Setup...`);
  63  |         const meta = await app.api.sales.discoverMetadataAPI();
  64  |         const item = await app.api.inventory.createFreshItemWithStockAPI({
  65  |             cost_method_code: 'FIFO',
  66  |             quantity: 50,
  67  |             unit_cost: 100
  68  |         });
  69  |         const stockBefore = item.currentStock;
  70  |         console.log(`[ITEM] ${item.itemName} (${item.itemId}) | Stock before: ${stockBefore}`);
  71  | 
  72  |         // ── STEP 2: Create & Approve SO ──────────────────────────────────────────
  73  |         console.log(`[STEP 2] Creating Sales Order...`);
  74  |         const soQty = 5;
  75  |         const soUnitPrice = Number(item.unitCost || 100);
  76  |         const soTotal = soQty * soUnitPrice;
  77  | 
  78  |         const so = await app.api.sales.createSalesOrderAPI({
  79  |             itemId: item.itemId,
  80  |             quantity: soQty,
  81  |             unitPrice: soUnitPrice,
  82  |             customerId: meta.customerId,
  83  |             locationId: item.locationId,
  84  |             warehouseId: item.warehouseId
  85  |         });
> 86  |         expect(so.id).toBeTruthy();
      |                       ^ Error: expect(received).toBeTruthy()
  87  |         expect(so.soItemId).toBeTruthy();
  88  |         console.log(`[SO] Created ${so.ref} (${so.id}) | Item id: ${so.soItemId}`);
  89  | 
  90  |         await app.advanceDocumentAPI(so.id, 'sales-orders');
  91  |         console.log(`[SO] Approved ${so.ref}`);
  92  | 
  93  |         // ── STEP 3: Create & Approve Invoice from SO (Inventory Release) ──────────
  94  |         console.log(`[STEP 3] Invoicing and releasing SO items...`);
  95  |         const invoice = await app.api.sales.createInvoiceAPI({
  96  |             customerId: meta.customerId,
  97  |             soItemId: so.soItemId,
  98  |             releasedQuantity: soQty,
  99  |             locationId: item.locationId,
  100 |             warehouseId: item.warehouseId
  101 |         });
  102 |         expect(invoice.id).toBeTruthy();
  103 |         console.log(`[INVOICE] Created from SO: ${invoice.ref} (${invoice.id})`);
  104 | 
  105 |         await app.advanceDocumentAPI(invoice.id, 'invoices');
  106 |         console.log(`[INVOICE] Approved ${invoice.ref}`);
  107 | 
  108 |         // Verify stock has decreased by soQty
  109 |         const expectedStock = stockBefore - soQty;
  110 |         const stockAfter = await app.api.inventory.pollStockAPI(item.itemId, expectedStock, item.locationId);
  111 |         console.log(`[STOCK] Expected: ${expectedStock}, Got: ${stockAfter}`);
  112 |         expect(stockAfter).toBe(expectedStock);
  113 | 
  114 |         // Verify Invoice Outstanding Balance is positive
  115 |         const invoiceMiddleData = await app.api.sales.getInvoiceAPI(invoice.id);
  116 |         const invoiceMiddleBal = parseFloat(invoiceMiddleData.unreceived_amount ?? invoiceMiddleData.balance ?? invoiceMiddleData.amount_due ?? '-1');
  117 |         const invoiceTotal = parseFloat(invoiceMiddleData.total_amount ?? invoiceMiddleData.net_due ?? invoiceMiddleData.amount ?? String(invoiceMiddleBal));
  118 |         console.log(`[INVOICE] Outstanding balance after Approval: ${invoiceMiddleBal} (invoice total: ${invoiceTotal})`);
  119 |         expect(invoiceMiddleBal).toBeGreaterThan(0);
  120 |         expect(invoiceMiddleBal).toBeCloseTo(invoiceTotal, 1);
  121 | 
  122 |         // Verify Invoice GL entries: Debit AR, Credit Sales/Revenue
  123 |         let invoiceEntries: any[] = [];
  124 |         for (let i = 0; i < 10; i++) {
  125 |             invoiceEntries = await app.api.inventory.getJournalEntriesAPI(invoice.id);
  126 |             if (invoiceEntries.length > 0) break;
  127 |             await page.waitForTimeout(3000);
  128 |         }
  129 |         console.log(`[INVOICE GL] Entries found: ${invoiceEntries.length}`);
  130 |         if (invoiceEntries.length > 0) {
  131 |             const arDebit = invoiceEntries.find(e => isAR(e) && parseFloat(e.debit) > 0);
  132 |             expect(arDebit, 'AR must be debited on Invoice approval').toBeTruthy();
  133 | 
  134 |             const salesCredit = invoiceEntries.find(e => !isAR(e) && !isTax(e) && parseFloat(e.credit) > 0);
  135 |             expect(salesCredit, 'Sales/Revenue must be credited on Invoice approval').toBeTruthy();
  136 | 
  137 |             expect(parseFloat(arDebit.debit), `AR debit=${arDebit.debit} should equal invoice total=${invoiceTotal}`).toBeCloseTo(invoiceTotal, 1);
  138 |             expect(parseFloat(salesCredit.credit), `Sales credit=${salesCredit.credit} should equal SO total=${soTotal}`).toBeCloseTo(soTotal, 1);
  139 |             console.log(`[INVOICE GL] AR debit=${arDebit.debit} | Sales credit=${salesCredit.credit} | Expected: ${soTotal}`);
  140 |         }
  141 | 
  142 |         // ── STEP 4: Pay the Invoice (Create Receipt) ──────────────────────────────
  143 |         console.log(`[STEP 4] Creating Receipt for Invoice...`);
  144 |         const receipt = await app.api.sales.createInvoiceReceiptAPI({
  145 |             amount: invoiceMiddleBal,
  146 |             invoiceId: invoice.id,
  147 |             customerId: meta.customerId
  148 |         });
  149 |         expect(receipt.id).toBeTruthy();
  150 |         console.log(`[RECEIPT] Created ${receipt.ref} (${receipt.id})`);
  151 | 
  152 |         await app.advanceDocumentAPI(receipt.id, 'receipts');
  153 |         console.log(`[RECEIPT] Approved ${receipt.ref}`);
  154 | 
  155 |         // Verify Invoice Outstanding Balance is 0 after receipt
  156 |         const invoiceAfterData = await app.api.sales.getInvoiceAPI(invoice.id);
  157 |         const invoiceAfterBal = parseFloat(invoiceAfterData.unreceived_amount ?? invoiceAfterData.balance ?? invoiceAfterData.amount_due ?? '-1');
  158 |         console.log(`[INVOICE] Outstanding balance after Receipt: ${invoiceAfterBal}`);
  159 |         expect(invoiceAfterBal, `BUG: Invoice ${invoice.id} still has outstanding balance ${invoiceAfterBal} after full receipt ${receipt.ref}. AR not settled.`).toBeLessThanOrEqual(0.01);
  160 | 
  161 |         // Verify Receipt GL entries: Debit Cash/Bank, Credit AR
  162 |         // NOTE: GL amount verification requires account mapping to be configured in the ERP.
  163 |         // Until inventory, payroll, and sales GL account mappings are implemented in the system,
  164 |         // the ERP falls back to WAC cost-based GL booking and amount assertions will always fail.
  165 |         const receiptResp = await page.request.get(
  166 |             `${app.apiBase}/receipt/${receipt.id}?${params}`,
  167 |             { headers }
  168 |         );
  169 | 
  170 |         // Check if account mapping APIs exist (feature flag)
  171 |         const mappingResp = await page.request.get(`${app.apiBase}/account-mappings?${params}`, { headers }).catch(() => null);
  172 |         const accountMappingConfigured = mappingResp?.ok() ?? false;
  173 | 
  174 |         if (receiptResp.ok()) {
  175 |             const rData = await receiptResp.json();
  176 |             const entries = rData.cash_receipt_journal?.journal_entries || rData.cash_disbursement_journal?.journal_entries || [];
  177 |             console.log(`[RECEIPT GL] Entries found: ${entries.length}`);
  178 | 
  179 |             if (entries.length > 0) {
  180 |                 const cashDebit = entries.find((e: any) => isCash({ accountName: e.account?.name }) && parseFloat(e.debit) > 0);
  181 |                 const arCredit = entries.find((e: any) => isAR({ accountName: e.account?.name }) && parseFloat(e.credit) > 0);
  182 | 
  183 |                 const cashDebitAmt = parseFloat(cashDebit?.debit ?? '0');
  184 |                 const arCreditAmt = parseFloat(arCredit?.credit ?? '0');
  185 | 
  186 |                 // Always print the GL audit table for observability
```