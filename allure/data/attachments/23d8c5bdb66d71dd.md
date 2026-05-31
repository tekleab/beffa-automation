# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/sales-ui-verification.spec.ts >> Sales Order UI Verification @sales @ui @regression >> Receipt: Complete UI flow - Create, Validate, Approve
- Location: tests/sales/sales-ui-verification.spec.ts:267:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add Receipt' }) to be visible

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
          - generic [ref=e173]:
            - navigation "breadcrumb" [ref=e174]:
              - list [ref=e175]:
                - navigation "breadcrumb" [ref=e176]:
                  - list [ref=e177]:
                    - listitem [ref=e178]:
                      - link "Home" [ref=e179] [cursor=pointer]:
                        - /url: /
                      - text: /
                    - listitem [ref=e180]:
                      - link "Receivables" [ref=e181] [cursor=pointer]:
                        - /url: /receivables/overview/
                      - text: /
                    - listitem [ref=e182]:
                      - link "Receipt" [ref=e183] [cursor=pointer]:
                        - /url: /receivables/receipts/?page=1&pageSize=15
            - button "2018" [ref=e185] [cursor=pointer]:
              - generic [ref=e186]: "2018"
              - img [ref=e187]
          - generic [ref=e190]:
            - img [ref=e191]
            - heading "Ooops Error!" [level=1] [ref=e193]
            - paragraph [ref=e194]: There seems to be an error handling your request. Please try again, or contact support.
        - generic [ref=e195]: BM Technology © 2026
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
  - generic:
    - option "1950"
    - option "1951"
    - option "1952"
    - option "1953"
    - option "1954"
    - option "1955"
    - option "1956"
    - option "1957"
    - option "1958"
    - option "1959"
    - option "1960"
    - option "1961"
    - option "1962"
    - option "1963"
    - option "1964"
    - option "1965"
    - option "1966"
    - option "1967"
    - option "1968"
    - option "1969"
    - option "1970"
    - option "1971"
    - option "1972"
    - option "1973"
    - option "1974"
    - option "1975"
    - option "1976"
    - option "1977"
    - option "1978"
    - option "1979"
    - option "1980"
    - option "1981"
    - option "1982"
    - option "1983"
    - option "1984"
    - option "1985"
    - option "1986"
    - option "1987"
    - option "1988"
    - option "1989"
    - option "1990"
    - option "1991"
    - option "1992"
    - option "1993"
    - option "1994"
    - option "1995"
    - option "1996"
    - option "1997"
    - option "1998"
    - option "1999"
    - option "2000"
    - option "2001"
    - option "2002"
    - option "2003"
    - option "2004"
    - option "2005"
    - option "2006"
    - option "2007"
    - option "2008"
    - option "2009"
    - option "2010"
    - option "2011"
    - option "2012"
    - option "2013"
    - option "2014"
    - option "2015"
    - option "2016"
    - option "2017"
    - option "2018 (open)" [selected]
    - option "2019"
    - option "2020"
    - option "2021"
    - option "2022"
    - option "2023"
    - option "2024"
    - option "2025"
    - option "2026"
    - option "2027"
    - option "2028"
    - option "2029"
    - option "2030"
    - option "2031"
    - option "2032"
    - option "2033"
    - option "2034"
    - option "2035"
    - option "2036"
    - option "2037"
    - option "2038"
    - option "2039"
    - option "2040"
    - option "2041"
    - option "2042"
    - option "2043"
    - option "2044"
    - option "2045"
    - option "2046"
    - option "2047"
    - option "2048"
    - option "2049"
```

# Test source

```ts
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
  305 |     await button.waitFor({ state: 'visible', timeout: 10000 });
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
> 391 |     await button.waitFor({ state: 'visible', timeout: 10000 });
      |                  ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
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
  406 |   async fillPaymentMethod(paymentMethod: string) {
  407 |     console.log(`[UI] Filling payment method: ${paymentMethod}`);
  408 |     await this.page.locator('select#payment_method').selectOption(paymentMethod);
  409 |   }
  410 | 
  411 |   async fillCustomerReceipt(customerId: string) {
  412 |     console.log(`[UI] Filling customer (Receipt): ${customerId}`);
  413 |     await this.page.locator('button#customer_id').click();
  414 |     await this.page.locator('input#customer_id').fill(customerId);
  415 |   }
  416 | 
  417 |   async fillCashAccount(cashAccountId: string) {
  418 |     console.log(`[UI] Filling cash account: ${cashAccountId}`);
  419 |     await this.page.locator('button#cash_account_id').click();
  420 |     await this.page.locator('input#cash_account_id').fill(cashAccountId);
  421 |   }
  422 | 
  423 |   async fillFiscalBudgetReceipt(budgetId: string) {
  424 |     console.log(`[UI] Filling fiscal budget (Receipt): ${budgetId}`);
  425 |     await this.page.locator('button#fiscal_budget_id').click();
  426 |     await this.page.locator('input#fiscal_budget_id').fill(budgetId);
  427 |   }
  428 | 
  429 |   async fillCurrencyReceipt(currencyId: string) {
  430 |     console.log(`[UI] Filling currency (Receipt): ${currencyId}`);
  431 |     await this.page.locator('button#currency_id').click();
  432 |     await this.page.locator('input#currency_id').fill(currencyId);
  433 |   }
  434 | 
  435 |   async clickLineItemButtonReceipt() {
  436 |     console.log(`[UI] Clicking Line Item button (Receipt)`);
  437 |     const button = this.page.getByRole('button', { name: 'Line Item' });
  438 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  439 |     await button.click();
  440 |     await this.page.waitForLoadState('networkidle');
  441 |   }
  442 | 
  443 |   async clickSubmitReceipt() {
  444 |     console.log(`[UI] Submitting Receipt`);
  445 |     const button = this.page.getByRole('button', { name: 'Add' });
  446 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  447 |     await button.click();
  448 |     await this.page.waitForLoadState('networkidle');
  449 |   }
  450 | 
  451 |   async clickViewReceipt() {
  452 |     console.log(`[UI] Clicking view button for Receipt`);
  453 |     const button = this.page.getByRole('button', { name: 'view' }).first();
  454 |     await button.waitFor({ state: 'visible', timeout: 10000 });
  455 |     await button.click();
  456 |     await this.page.waitForLoadState('networkidle');
  457 |   }
  458 | 
  459 |   async verifyReceiptFields() {
  460 |     console.log(`[UI] Verifying Receipt fields`);
  461 |     await expect(this.page.locator('input#customer_id')).toBeVisible();
  462 |     await expect(this.page.locator('input#warehouse_id')).toBeVisible();
  463 |     await expect(this.page.locator('input#location_id')).toBeVisible();
  464 |     await expect(this.page.locator('input#ref')).toBeVisible();
  465 |   }
  466 | 
  467 |   async verifyReceiptStatus() {
  468 |     console.log(`[UI] Verifying Receipt status`);
  469 |     const statusElement = await this.page.locator('[class*="status"], [class*="state"]').first();
  470 |     const statusText = await statusElement.textContent();
  471 |     await expect(statusText).toMatch(/approved|submitted/i);
  472 |   }
  473 | }
  474 | 
```