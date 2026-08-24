# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: purchase/po-doc-integrity.spec.ts >> Procurement Document Integrity Attacks @purchase @security @logic @regression @full >> Guardrail: System must reject approval of a future-dated Bill
- Location: tests/purchase/po-doc-integrity.spec.ts:68:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] System approved a bill dated 2028-08-24T00:00:00Z. Future-period AP liability injection possible — balance sheet manipulation.
```

# Test source

```ts
  17  | 
  18  | function printAuditTable(title: string, rows: AuditRow[]) {
  19  |     const W = { label: 32, value: 40 };
  20  |     const line = '─'.repeat(W.label + W.value + 7);
  21  |     const pad = (s: string, n: number) => s.length >= n ? s.substring(0, n - 1) + '…' : s.padEnd(n);
  22  |     console.log(`\n  ┌${'─'.repeat(line.length - 2)}┐`);
  23  |     console.log(`  │ ${pad(title, line.length - 4)} │`);
  24  |     console.log(`  ├${'─'.repeat(line.length - 2)}┤`);
  25  |     console.log(`  │ ${pad('Field', W.label)} │ ${pad('Value', W.value)} │`);
  26  |     console.log(`  ├${'─'.repeat(line.length - 2)}┤`);
  27  |     for (const r of rows) console.log(`  │ ${pad(r.label, W.label)} │ ${pad(r.value, W.value)} │`);
  28  |     console.log(`  └${'─'.repeat(line.length - 2)}┘\n`);
  29  | }
  30  | 
  31  | /**
  32  |  * PROCUREMENT DOCUMENT INTEGRITY ATTACKS
  33  |  *
  34  |  * 1. Future-dated bill injection       [REAL BUG — ERP approves future bills]
  35  |  * 2. PO quantity exhaustion +1 unit    [REAL BUG — overflow bill approved]
  36  |  * 3. Same PO billed twice              [REAL BUG — double AP liability]
  37  |  * 4. Approved bill line item mutation  [PASS — ERP rejects]
  38  |  * 5. Bill with no vendor               [PASS — ERP rejects at creation]
  39  |  * 6. PO↔Bill 1:1 reconciliation        [PASS — maps correctly]
  40  |  */
  41  | 
  42  | test.describe('Procurement Document Integrity Attacks @purchase @security @logic @regression @full', () => {
  43  | 
  44  |     let sharedMeta: Awaited<ReturnType<AppManager['api']['purchase']['discoverMetadataAPI']>>;
  45  |     let sharedItem: Awaited<ReturnType<AppManager['api']['inventory']['createFreshItemWithStockAPI']>>;
  46  | 
  47  |     test.beforeAll(async ({ browser }) => {
  48  |         const page = await browser.newPage();
  49  |         const app = new AppManager(page);
  50  |         await app.apiLogin(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  51  | 
  52  |         const { DateHelper } = require('../../lib/utils/DateHelper');
  53  |         DateHelper.clearCache();
  54  |         await DateHelper.resolve(page);
  55  | 
  56  |         sharedMeta = await app.api.purchase.discoverMetadataAPI();
  57  |         sharedItem = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
  58  |         await page.close();
  59  |     });
  60  | 
  61  |     test.beforeEach(async ({ page }) => {
  62  |         const app = new AppManager(page);
  63  |         await app.apiLogin(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  64  | 
  65  |     });
  66  | 
  67  |     // ── 1. POST-DATED BILL INJECTION ─────────────────────────────────────────
  68  |     test('Guardrail: System must reject approval of a future-dated Bill', async ({ page }) => {
  69  |         const app = new AppManager(page);
  70  |         await app.apiLogin(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  71  |         const meta = sharedMeta;
  72  |         const item = sharedItem;
  73  | 
  74  |         const futureDate = new Date();
  75  |         futureDate.setFullYear(futureDate.getFullYear() + 2);
  76  |         const futureDateStr = futureDate.toISOString().split('T')[0] + 'T00:00:00Z';
  77  | 
  78  |         console.log(`[ATTACK] Injecting Bill with future date: ${futureDateStr}...`);
  79  |         try {
  80  |             const bill = await app.api.purchase.createBillAPI({
  81  |                 itemData: item, unitPrice: 10000, quantity: 1,
  82  |                 vendorId: meta.vendorId, invoice_date: futureDateStr, due_date: futureDateStr
  83  |             } as any);
  84  | 
  85  |             await app.advanceDocumentAPI(bill.id, 'bills');
  86  |             const billData = await app.api.purchase.getBillAPI(bill.id);
  87  | 
  88  |             printAuditTable('VULNERABILITY: Future-Dated Bill Approved', [
  89  |                 { label: 'Bill Ref',       value: bill.ref },
  90  |                 { label: 'Bill ID',        value: bill.id },
  91  |                 { label: 'Invoice Date',   value: futureDateStr },
  92  |                 { label: 'Today',          value: new Date().toISOString().split('T')[0] },
  93  |                 { label: 'Status',         value: billData.status ?? billData.current_approval_step?.status_label },
  94  |                 { label: 'Amount',         value: `$${(10000).toFixed(2)}` },
  95  |                 { label: 'Vendor',         value: billData.vendor?.name || meta.vendorId },
  96  |                 { label: 'Impact',         value: 'Future-period AP liability injected' },
  97  |                 { label: 'Fix Required',   value: 'Reject if invoice_date > today' },
  98  |             ]);
  99  | 
  100 |             const billStatus = (billData.status ?? billData.current_approval_step?.status_label ?? '').toLowerCase();
  101 |             if (billStatus === 'approved') {
  102 |                 console.log(`\n=================== [CRITICAL VULNERABILITY DETECTED] ===================`);
  103 |                 console.log(`Attack Type    : Future-Dated Bill Injection`);
  104 |                 console.log(`Submitted Date : ${futureDateStr}`);
  105 |                 console.log(`Current Date   : ${new Date().toISOString().split('T')[0]}`);
  106 |                 console.log(`Resulting State: ${billData.status || billStatus} (HTTP 200)`);
  107 |                 console.log(`Server Payload :`, JSON.stringify({
  108 |                     id: billData.id,
  109 |                     reference_number: billData.reference_number || bill.ref,
  110 |                     status: billData.status,
  111 |                     invoice_date: billData.invoice_date,
  112 |                     due_date: billData.due_date,
  113 |                     vendor_id: billData.vendor_id || meta.vendorId,
  114 |                     total_amount: billData.total_amount || 10000
  115 |                 }, null, 2));
  116 |                 console.log(`=========================================================================\n`);
> 117 |                 throw new Error(`[CRITICAL_LOGIC_BUG] System approved a bill dated ${futureDateStr}. Future-period AP liability injection possible — balance sheet manipulation.`);
      |                       ^ Error: [CRITICAL_LOGIC_BUG] System approved a bill dated 2028-08-24T00:00:00Z. Future-period AP liability injection possible — balance sheet manipulation.
  118 |             }
  119 |             console.log(`[PASS] Future-dated bill advance ok but status=${billStatus} — not approved.`);
  120 |         } catch (err: any) {
  121 |             if (err.message.includes('[CRITICAL_LOGIC_BUG]')) throw err;
  122 |             console.log(`[PASS] Future-dated bill correctly blocked: ${err.message.substring(0, 100)}`);
  123 |         }
  124 |     });
  125 | 
  126 |     // ── 2. PO QUANTITY EXHAUSTION THEN +1 UNIT ───────────────────────────────
  127 |     test('Guardrail: System must block billing beyond 100% of PO quantity', async ({ page }) => {
  128 |         const app = new AppManager(page);
  129 |         await app.apiLogin(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  130 |         const meta = sharedMeta;
  131 |         const item = sharedItem;
  132 | 
  133 |         const poQty = 10;
  134 |         const unitPrice = 1000;
  135 |         const po = await app.api.purchase.createPurchaseOrderAPI(item, poQty, unitPrice, meta.vendorId);
  136 |         await app.advanceDocumentAPI(po.poId, 'purchase-orders');
  137 | 
  138 |         const bill1 = await app.api.purchase.createBillFromPoAPI(po.poId, po.poItems);
  139 |         await app.advanceDocumentAPI(bill1.billId, 'bills');
  140 |         // Poll until PO shows fully received (unreceived_quantity = 0)
  141 |         let poStatus = await app.api.purchase.getPoReceiveStatusAPI(po.poId);
  142 |         for (let i = 0; i < 10 && poStatus.remainingQty > 0; i++) {
  143 |             await page.waitForTimeout(2000);
  144 |             poStatus = await app.api.purchase.getPoReceiveStatusAPI(po.poId);
  145 |         }
  146 | 
  147 |         const bill1Data = await app.api.purchase.getBillAPI(bill1.billId);
  148 |         const bill1Qty = (bill1Data.received_purchase_order_items || [])
  149 |             .reduce((sum: number, row: any) => sum + parseFloat(row.received_quantity || '0'), 0);
  150 | 
  151 |         console.log(`[BILL 1] ${bill1.billNumber} — received ${bill1Qty}/${poQty} | PO remaining: ${poStatus.remainingQty}`);
  152 | 
  153 |         if (bill1Qty !== poQty || poStatus.remainingQty > 0) {
  154 |             throw new Error(
  155 |                 `[SETUP_FAIL] PO ${po.poNumber} not fully received before overflow attack ` +
  156 |                 `(bill1=${bill1Qty}, poQty=${poQty}, remaining=${poStatus.remainingQty}).`
  157 |             );
  158 |         }
  159 | 
  160 |         const { apiBase, headers, qs } = await app.buildApiContext();
  161 |         // po.poItems comes from the creation response — the only source that includes item IDs.
  162 |         // GET /purchase-order/{id} and GET /purchase-orders/{id}/items both omit the id field.
  163 |         const poItemId = (po.poItems || []).find((i: any) => i.id)?.id;
  164 |         if (!poItemId) throw new Error(`[SETUP_FAIL] PO ${po.poNumber} has no billable line items.`);
  165 | 
  166 |         const overflowBill = await app.api.purchase.createPartialBillFromPoAPI(po.poId, [{
  167 |             po_item_id: poItemId,
  168 |             received_quantity: 1,
  169 |             received_unit_price: unitPrice
  170 |         }]);
  171 | 
  172 |         if (overflowBill.success) {
  173 |             try { await app.advanceDocumentAPI(overflowBill.billId, 'bills'); } catch { /* block expected */ }
  174 |             const overflowData = await app.api.purchase.getBillAPI(overflowBill.billId);
  175 | 
  176 |             printAuditTable(`PO Overbilling Audit — PO: ${po.poNumber}`, [
  177 |                 { label: 'PO Ref',               value: po.poNumber },
  178 |                 { label: 'PO Qty Authorized',    value: `${poQty} units` },
  179 |                 { label: 'PO Unit Price',         value: `$${unitPrice.toFixed(2)}` },
  180 |                 { label: 'PO Total',              value: `$${(poQty * unitPrice).toFixed(2)}` },
  181 |                 { label: 'Bill 1 (100%)',          value: `${bill1.billNumber} — $${(poQty * unitPrice).toFixed(2)}` },
  182 |                 { label: 'Bill 1 Status',         value: bill1Data.status },
  183 |                 { label: 'Overflow Bill Ref',     value: overflowBill.billNumber || overflowBill.billId?.substring(0, 8) },
  184 |                 { label: 'Overflow Qty',          value: '1 unit (beyond PO)' },
  185 |                 { label: 'Overflow Amount',       value: `$${unitPrice.toFixed(2)}` },
  186 |                 { label: 'Overflow Status',       value: overflowData.status },
  187 |                 { label: 'Total Billed',          value: `$${((poQty + 1) * unitPrice).toFixed(2)}` },
  188 |                 { label: 'Overbilled By',         value: `$${unitPrice.toFixed(2)}` },
  189 |                 { label: 'Fix Required',          value: 'Reject if received_qty > PO qty' },
  190 |             ]);
  191 | 
  192 |             if (overflowData.status === 'approved') {
  193 |                 throw new Error(`[CRITICAL_LOGIC_BUG] System approved a bill for 1 unit beyond the fully-exhausted PO ${po.poNumber}. Over-receiving liability created.`);
  194 |             }
  195 |             console.log(`[PASS] Overflow bill status=${overflowData.status} — approval correctly blocked.`);
  196 |         } else {
  197 |             console.log(`[PASS] Overflow bill creation rejected at API level: HTTP ${overflowBill.status} — ${overflowBill.error?.substring(0, 120)}`);
  198 |         }
  199 |     });
  200 | 
  201 |     // ── 3. SAME PO BILLED TWICE ───────────────────────────────────────────────
  202 |     test('Guardrail: Concurrent identical PO submissions must not create duplicate liability', async ({ page }) => {
  203 |         const app = new AppManager(page);
  204 |         await app.apiLogin(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  205 |         const meta = sharedMeta;
  206 |         const item = sharedItem;
  207 |         const poQty = 10;
  208 |         const unitPrice = 1000;
  209 | 
  210 |         const [result1] = await Promise.allSettled([
  211 |             app.api.purchase.createPurchaseOrderAPI(item, poQty, unitPrice, meta.vendorId),
  212 |             app.api.purchase.createPurchaseOrderAPI(item, poQty, unitPrice, meta.vendorId)
  213 |         ]);
  214 | 
  215 |         if (result1.status !== 'fulfilled') { console.log(`[SKIP] PO creation failed.`); return; }
  216 | 
  217 |         const po = (result1 as PromiseFulfilledResult<any>).value;
```