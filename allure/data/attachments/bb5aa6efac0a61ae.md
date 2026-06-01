# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-ui-verification.spec.ts >> Sales Order UI Verification @sales @ui @regression >> Invoice: Complete UI flow - Create, Validate, Approve
- Location: tests/sales/sales-ui-verification.spec.ts:147:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add Invoice' }) to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e9]:
        - img [ref=e10]
        - generic [ref=e11]: Enterprise
      - generic [ref=e13]:
        - generic:
          - img
        - textbox "Search tasks" [ref=e14]
      - generic [ref=e15]:
        - navigation [ref=e17]:
          - link "Dashboard" [ref=e18] [cursor=pointer]:
            - /url: /dashboard
            - paragraph [ref=e21]: Dashboard
        - generic [ref=e23] [cursor=pointer]:
          - paragraph [ref=e26]: Accounting
          - paragraph [ref=e27]:
            - button "Toggle section" [ref=e28]:
              - img [ref=e29]
        - generic [ref=e32] [cursor=pointer]:
          - paragraph [ref=e35]: Account Reconciliation
          - paragraph [ref=e36]:
            - button "Toggle section" [ref=e37]:
              - img [ref=e38]
        - generic [ref=e41] [cursor=pointer]:
          - paragraph [ref=e44]: CRM
          - paragraph [ref=e45]:
            - button "Toggle section" [ref=e46]:
              - img [ref=e47]
        - generic [ref=e50] [cursor=pointer]:
          - paragraph [ref=e53]: HRM
          - paragraph [ref=e54]:
            - button "Toggle section" [ref=e55]:
              - img [ref=e56]
        - generic [ref=e59] [cursor=pointer]:
          - paragraph [ref=e62]: Project Management
          - paragraph [ref=e63]:
            - button "Toggle section" [ref=e64]:
              - img [ref=e65]
        - generic [ref=e68] [cursor=pointer]:
          - paragraph [ref=e71]: SCM
          - paragraph [ref=e72]:
            - button "Toggle section" [ref=e73]:
              - img [ref=e74]
        - generic [ref=e77] [cursor=pointer]:
          - paragraph [ref=e80]: Lease Management
          - paragraph [ref=e81]:
            - button "Toggle section" [ref=e82]:
              - img [ref=e83]
        - generic [ref=e86] [cursor=pointer]:
          - paragraph [ref=e89]: Service Management
          - paragraph [ref=e90]:
            - button "Toggle section" [ref=e91]:
              - img [ref=e92]
        - generic [ref=e95] [cursor=pointer]:
          - paragraph [ref=e98]: Report
          - paragraph [ref=e99]:
            - button "Toggle section" [ref=e100]:
              - img [ref=e101]
      - generic [ref=e103]:
        - button "Settings" [ref=e105] [cursor=pointer]:
          - generic:
            - generic:
              - img
              - paragraph: Settings
        - navigation [ref=e107]:
          - link "User Management" [ref=e109] [cursor=pointer]:
            - /url: /settings/general/users
            - generic [ref=e110]:
              - generic [ref=e111]:
                - img [ref=e112]
                - paragraph [ref=e114]: User Management
              - button [ref=e115]:
                - img [ref=e116]
        - button "Logout" [ref=e118] [cursor=pointer]:
          - img [ref=e120]
          - text: Logout
    - generic [ref=e122]:
      - generic [ref=e123]:
        - generic [ref=e124]:
          - img "sample" [ref=e126]: s
          - generic [ref=e127]:
            - button "sample" [ref=e128] [cursor=pointer]:
              - generic: sample
              - img [ref=e130]
            - generic [ref=e132] [cursor=pointer]:
              - button "Company Detail" [ref=e133]:
                - img [ref=e134]
              - button "Edit Company" [ref=e137]:
                - img [ref=e138]
              - button "Company Detail" [ref=e141]:
                - img [ref=e142]
        - generic [ref=e145]:
          - button "New" [ref=e146] [cursor=pointer]:
            - text: New
            - img [ref=e148]
          - generic [ref=e152] [cursor=pointer]:
            - generic [ref=e153]: "5"
            - img "Notifications" [ref=e154]
          - button "EC" [ref=e157] [cursor=pointer]:
            - img [ref=e158]
            - paragraph [ref=e160]: EC
          - button [ref=e161] [cursor=pointer]:
            - img [ref=e162]
          - generic [ref=e165] [cursor=pointer]:
            - img "System" [ref=e167]: S
            - generic [ref=e168]:
              - generic [ref=e169]: System
              - paragraph [ref=e170]: IT Administrator / User Manager
      - generic [ref=e171]:
        - generic [ref=e172]:
          - img [ref=e173]
          - heading "Ooops Error!" [level=1] [ref=e175]
          - paragraph [ref=e176]: There seems to be an error handling your request. Please try again, or contact support.
        - generic [ref=e177]: BM Technology © 2026
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
  205 |   }
  206 | 
  207 |   async verifySuccessMessage() {
  208 |     console.log(`[UI] Verifying success message`);
  209 |     const successMessage = await this.page.locator('.success-message, .alert-success, [class*="success"]').first();
  210 |     await expect(successMessage).toBeVisible();
  211 |   }
  212 | 
  213 |   async verifyValidationErrors() {
  214 |     console.log(`[UI] Verifying validation errors`);
  215 |     const validationErrors = await this.page.locator('.error-message, .validation-error, [class*="error"], .required-field').all();
  216 |     console.log(`[UI] Found ${validationErrors.length} validation errors`);
  217 |     await expect(validationErrors.length).toBeGreaterThan(0);
  218 |   }
  219 | 
  220 |   // ============================================================================
  221 |   // SO UI VERIFICATION METHODS
  222 |   // ============================================================================
  223 | 
  224 |   async navigateToSOList() {
  225 |     console.log(`[UI] Navigating to Sales Orders list`);
  226 |     await this.page.goto('/receivables/sale-orders');
  227 |     await this.page.waitForLoadState('networkidle');
  228 |   }
  229 | 
  230 |   async clickAddSalesOrder() {
  231 |     console.log(`[UI] Clicking Add Sales Order button`);
  232 |     const button = this.page.getByRole('button', { name: 'Add Sales Order' });
  233 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  234 |     await button.click();
  235 |     await this.page.waitForLoadState('networkidle');
  236 |   }
  237 | 
  238 |   async clickLineItemButtonSO() {
  239 |     console.log(`[UI] Clicking Line Item button (SO)`);
  240 |     const button = this.page.getByRole('button', { name: 'Line Item' });
  241 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  242 |     await button.click();
  243 |     await this.page.waitForLoadState('networkidle');
  244 |   }
  245 | 
  246 |   async clickItemTypeButton() {
  247 |     console.log(`[UI] Clicking Item button`);
  248 |     const button = this.page.getByRole('button', { name: 'Item' });
  249 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  250 |     await button.click();
  251 |     await this.page.waitForLoadState('networkidle');
  252 |   }
  253 | 
  254 |   async clickSubmitSO() {
  255 |     console.log(`[UI] Submitting Sales Order`);
  256 |     const button = this.page.getByRole('button', { name: 'Add' });
  257 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  258 |     await button.click();
  259 |     await this.page.waitForLoadState('networkidle');
  260 |   }
  261 | 
  262 |   async clickViewSO() {
  263 |     console.log(`[UI] Clicking view button for SO`);
  264 |     const button = this.page.getByRole('button', { name: 'view' }).first();
  265 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  266 |     await button.click();
  267 |     await this.page.waitForLoadState('networkidle');
  268 |   }
  269 | 
  270 |   async verifySOFields() {
  271 |     console.log(`[UI] Verifying SO fields`);
  272 |     await expect(this.page.locator('input#customer_id')).toBeVisible();
  273 |     await expect(this.page.locator('input#warehouse_id')).toBeVisible();
  274 |     await expect(this.page.locator('input#location_id')).toBeVisible();
  275 |   }
  276 | 
  277 |   async verifySOStatus() {
  278 |     console.log(`[UI] Verifying SO status`);
  279 |     const statusElement = await this.page.locator('[class*="status"], [class*="state"]').first();
  280 |     const statusText = await statusElement.textContent();
  281 |     await expect(statusText).toMatch(/approved|submitted/i);
  282 |   }
  283 | 
  284 |   async clickSubmitWithoutFields() {
  285 |     console.log(`[UI] Clicking submit without filling fields`);
  286 |     const button = this.page.getByRole('button', { name: 'Add' });
  287 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  288 |     await button.click();
  289 |     await this.page.waitForLoadState('networkidle');
  290 |   }
  291 | 
  292 |   // ============================================================================
  293 |   // INVOICE UI VERIFICATION METHODS
  294 |   // ============================================================================
  295 | 
  296 |   async navigateToInvoiceList() {
  297 |     console.log(`[UI] Navigating to Invoices list`);
  298 |     await this.page.goto('/receivables/invoices');
  299 |     await this.page.waitForLoadState('networkidle');
  300 |   }
  301 | 
  302 |   async clickAddInvoice() {
  303 |     console.log(`[UI] Clicking Add Invoice button`);
  304 |     const button = this.page.getByRole('button', { name: 'Add Invoice' });
> 305 |     await button.waitFor({ state: 'visible', timeout: 10000 });
      |                  ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  306 |     await button.click();
  307 |     await this.page.waitForLoadState('networkidle');
  308 |   }
  309 | 
  310 |   async fillInvoiceNumber(invoiceNumber: string) {
  311 |     console.log(`[UI] Filling invoice number: ${invoiceNumber}`);
  312 |     await this.page.locator('input#invoice_number').fill(invoiceNumber);
  313 |   }
  314 | 
  315 |   async fillCustomerInvoice(customerId: string) {
  316 |     console.log(`[UI] Filling customer (Invoice): ${customerId}`);
  317 |     await this.page.locator('button#customer_id').click();
  318 |     await this.page.locator('input#customer_id').fill(customerId);
  319 |   }
  320 | 
  321 |   async fillBudgetInvoice(budgetId: string) {
  322 |     console.log(`[UI] Filling budget (Invoice): ${budgetId}`);
  323 |     await this.page.locator('button#budget_id').click();
  324 |     await this.page.locator('input#budget_id').fill(budgetId);
  325 |   }
  326 | 
  327 |   async fillAccountsReceivableInvoice(arId: string) {
  328 |     console.log(`[UI] Filling accounts receivable (Invoice): ${arId}`);
  329 |     await this.page.locator('button#accounts_receivable_id').click();
  330 |     await this.page.locator('input#accounts_receivable_id').fill(arId);
  331 |   }
  332 | 
  333 |   async fillCurrencyInvoice(currencyId: string) {
  334 |     console.log(`[UI] Filling currency (Invoice): ${currencyId}`);
  335 |     await this.page.locator('button#currency_id').click();
  336 |     await this.page.locator('input#currency_id').fill(currencyId);
  337 |   }
  338 | 
  339 |   async clickLineItemButtonInvoice() {
  340 |     console.log(`[UI] Clicking Line Item button (Invoice)`);
  341 |     const button = this.page.getByRole('button', { name: 'Line Item' });
  342 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  343 |     await button.click();
  344 |     await this.page.waitForLoadState('networkidle');
  345 |   }
  346 | 
  347 |   async clickSubmitInvoice() {
  348 |     console.log(`[UI] Submitting Invoice`);
  349 |     const button = this.page.getByRole('button', { name: 'Add' });
  350 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  351 |     await button.click();
  352 |     await this.page.waitForLoadState('networkidle');
  353 |   }
  354 | 
  355 |   async clickViewInvoice() {
  356 |     console.log(`[UI] Clicking view button for Invoice`);
  357 |     const button = this.page.getByRole('button', { name: 'view' }).first();
  358 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  359 |     await button.click();
  360 |     await this.page.waitForLoadState('networkidle');
  361 |   }
  362 | 
  363 |   async verifyInvoiceFields() {
  364 |     console.log(`[UI] Verifying Invoice fields`);
  365 |     await expect(this.page.locator('input#customer_id')).toBeVisible();
  366 |     await expect(this.page.locator('input#warehouse_id')).toBeVisible();
  367 |     await expect(this.page.locator('input#location_id')).toBeVisible();
  368 |     await expect(this.page.locator('input#invoice_number')).toBeVisible();
  369 |   }
  370 | 
  371 |   async verifyInvoiceStatus() {
  372 |     console.log(`[UI] Verifying Invoice status`);
  373 |     const statusElement = await this.page.locator('[class*="status"], [class*="state"]').first();
  374 |     const statusText = await statusElement.textContent();
  375 |     await expect(statusText).toMatch(/approved|submitted/i);
  376 |   }
  377 | 
  378 |   // ============================================================================
  379 |   // RECEIPT UI VERIFICATION METHODS
  380 |   // ============================================================================
  381 | 
  382 |   async navigateToReceiptList() {
  383 |     console.log(`[UI] Navigating to Receipts list`);
  384 |     await this.page.goto('/receivables/receipts');
  385 |     await this.page.waitForLoadState('networkidle');
  386 |   }
  387 | 
  388 |   async clickAddReceipt() {
  389 |     console.log(`[UI] Clicking Add Receipt button`);
  390 |     const button = this.page.getByRole('button', { name: 'Add Receipt' });
  391 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  392 |     await button.click();
  393 |     await this.page.waitForLoadState('networkidle');
  394 |   }
  395 | 
  396 |   async fillReceiptRef(ref: string) {
  397 |     console.log(`[UI] Filling receipt ref: ${ref}`);
  398 |     await this.page.locator('input#ref').fill(ref);
  399 |   }
  400 | 
  401 |   async fillCheckNo(checkNo: string) {
  402 |     console.log(`[UI] Filling check no: ${checkNo}`);
  403 |     await this.page.locator('input#check_no').fill(checkNo);
  404 |   }
  405 | 
```