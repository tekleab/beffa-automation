# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-accounting.spec.ts >> Accounting & Ledger Flow Logic Audits @sales @logic @regression @full >> Guardrail: Invoice balance must correctly restore after receipt reversal
- Location: tests/sales/so-accounting.spec.ts:168:9

# Error details

```
Error: [CRITICAL_LOGIC_BUG] Ledger Drift: Reversing full receipt did not restore invoice balance! Current: 100, Expected: 500
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
  94  | 
  95  |     test('Guardrail: System must reject injected price/amount overrides during SO conversion', async ({ page }) => {
  96  |         const app = new AppManager(page);
  97  |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  98  |         const { apiBase, headers, qs } = await app.buildApiContext();
  99  |         const meta = sharedMeta;
  100 |         const item = sharedItem;
  101 |         await ensureStock(app, item, 5);
  102 | 
  103 |         const BASE_PRICE = 5000;
  104 |         const ATTACK_PRICE = 50;
  105 | 
  106 |         const { DateHelper } = require('../../lib/utils/DateHelper');
  107 |         const dateIso = (await DateHelper.resolve(page)).iso;
  108 | 
  109 |         const so = await app.api.sales.createSalesOrderAPI({ itemId: item.itemId, quantity: 1, unitPrice: BASE_PRICE, locationId: item.locationId, warehouseId: item.warehouseId });
  110 |         await app.advanceDocumentAPI(so.id, 'sales-orders');
  111 | 
  112 |         console.log(`[ATTACK] Injecting malicious price: ${ATTACK_PRICE} (SO Price: ${BASE_PRICE})...`);
  113 |         const overInvoiceResp = await page.request.post(`${apiBase}/invoices?${qs}`, {
  114 |             data: {
  115 |                 accounts_receivable_id: meta.arAccountId,
  116 |                 currency_id: meta.currencyId,
  117 |                 customer_id: meta.customerId,
  118 |                 invoice_date: dateIso,
  119 |                 released_sales_order_items: [{ so_item_id: so.soItemId, released_quantity: 1, warehouse_id: item.warehouseId, location_id: item.locationId, unit_price: ATTACK_PRICE, amount: ATTACK_PRICE }],
  120 |                 status: 'draft'
  121 |             },
  122 |             headers
  123 |         });
  124 | 
  125 |         if ([200, 201].includes(overInvoiceResp.status())) {
  126 |             const body = await overInvoiceResp.json();
  127 |             try {
  128 |                 await app.advanceDocumentAPI(body.id, 'invoices');
  129 |                 const finalInv = await app.api.sales.getInvoiceAPI(body.id);
  130 |                 if (Number(finalInv.unreceived_amount) === ATTACK_PRICE) {
  131 |                     throw new Error(`[CRITICAL_LOGIC_BUG] Price Injection Allowed! SO: ${BASE_PRICE}, Invoiced: ${ATTACK_PRICE}`);
  132 |                 }
  133 |             } catch (e: any) {
  134 |                 if (e.message.includes('CRITICAL_LOGIC_BUG')) throw e;
  135 |                 console.log(`[PASS] Price override blocked at approval.`);
  136 |             }
  137 |         }
  138 |     });
  139 | 
  140 |     test('Guardrail: System must prevent double-dip overpayments across multi-link receipts', async ({ page }) => {
  141 |         const app = new AppManager(page);
  142 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  143 |         const meta = sharedMeta;
  144 |         const item = sharedItem;
  145 |         await ensureStock(app, item, 5);
  146 | 
  147 |         const INVOICE_AMOUNT = 100;
  148 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: meta.customerId, itemId: item.itemId, quantity: 1, unitPrice: INVOICE_AMOUNT, locationId: item.locationId, warehouseId: item.warehouseId });
  149 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  150 | 
  151 |         const rct1 = await app.api.sales.createInvoiceReceiptAPI({ amount: 40, customerId: meta.customerId, invoiceId: inv.id });
  152 |         await app.advanceDocumentAPI(rct1.id, 'receipts');
  153 | 
  154 |         console.log(`[ATTACK] Attempting overpayment: 80.00 (Outstanding is only 60.00)...`);
  155 |         try {
  156 |             const rct2 = await app.api.sales.createInvoiceReceiptAPI({ amount: 80, customerId: meta.customerId, invoiceId: inv.id });
  157 |             await app.advanceDocumentAPI(rct2.id, 'receipts');
  158 |             const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
  159 |             if (Number(finalInv.unreceived_amount) < 0) {
  160 |                 throw new Error(`[CRITICAL_LOGIC_BUG] Double-Dip Success: Invoice ${inv.ref} is over-paid (Balance: ${finalInv.unreceived_amount})`);
  161 |             }
  162 |         } catch (e: any) {
  163 |             if (e.message.includes('CRITICAL_LOGIC_BUG')) throw e;
  164 |             console.log(`[PASS] Overpayment blocked correctly: ${e.message}`);
  165 |         }
  166 |     });
  167 | 
  168 |     test('Guardrail: Invoice balance must correctly restore after receipt reversal', async ({ page }) => {
  169 |         const app = new AppManager(page);
  170 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  171 |         const meta = sharedMeta;
  172 |         const item = sharedItem;
  173 |         await ensureStock(app, item, 5);
  174 | 
  175 |         const INVOICE_AMOUNT = 500;
  176 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({ customerId: meta.customerId, itemId: item.itemId, unitPrice: INVOICE_AMOUNT, locationId: item.locationId, warehouseId: item.warehouseId });
  177 |         await app.advanceDocumentAPI(inv.id, 'invoices');
  178 | 
  179 |         const accounts = await app.getAllAccountsAPI();
  180 |         const cashAcct = accounts.find((a: any) => a.account_type?.toLowerCase().includes('cash')) || accounts[0];
  181 | 
  182 |         try {
  183 |             const rct1 = await app.api.sales.createInvoiceReceiptAPI({ amount: INVOICE_AMOUNT, customerId: meta.customerId, invoiceId: inv.id, currencyId: meta.currencyId, cashAccountId: cashAcct.id });
  184 |             await app.advanceDocumentAPI(rct1.id, 'receipts');
  185 | 
  186 |             console.log(`[ACTION] Reversing Receipt ${rct1.ref}...`);
  187 |             await app.reverseReceiptAPI(rct1.id);
  188 | 
  189 |             await page.waitForTimeout(5000);
  190 |             const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
  191 |             console.log(`[AUDIT] After Receipt Reversal: unreceived_amount = ${finalInv.unreceived_amount}`);
  192 | 
  193 |             if (Number(finalInv.unreceived_amount) !== INVOICE_AMOUNT) {
> 194 |                 throw new Error(`[CRITICAL_LOGIC_BUG] Ledger Drift: Reversing full receipt did not restore invoice balance! Current: ${finalInv.unreceived_amount}, Expected: ${INVOICE_AMOUNT}`);
      |                       ^ Error: [CRITICAL_LOGIC_BUG] Ledger Drift: Reversing full receipt did not restore invoice balance! Current: 100, Expected: 500
  195 |             }
  196 |             console.log(`[PASS] Receipt reversed. Invoice balance restored to ${INVOICE_AMOUNT}.`);
  197 | 
  198 |             await app.reverseInvoiceAPI(inv.id);
  199 |         } catch (error: any) {
  200 |             if (error.message.includes('CRITICAL_LOGIC_BUG')) throw error;
  201 |             console.log(`[PASS/BUG] Transaction failed or was blocked: ${error.message}`);
  202 |         }
  203 |     });
  204 | });
  205 | 
```