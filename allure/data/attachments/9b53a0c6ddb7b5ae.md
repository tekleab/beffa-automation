# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sales/so-credit-note.spec.ts >> Sales Return & Stock Recovery @sales @regression @full >> Forensic Audit: Invoice Void & Stock Restoration
- Location: tests/sales/so-credit-note.spec.ts:15:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 35
Received: 0
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
  1  | import { test, expect } from'@playwright/test';
  2  | import { AppManager } from'../../pages/AppManager';
  3  | 
  4  | /**
  5  |  * SALES RETURN & STOCK RECOVERY AUDIT
  6  |  * 
  7  |  * Objectives:
  8  |  * 1. Verify Sales Invoice correctly deducts Inventory stock.
  9  |  * 2. Verify Invoice VOID (Credit Note) correctly RESTORES Inventory stock.
  10 |  * 3. Forensic Check: Verify Ledger AR balance clears back to zero after Void.
  11 |  */
  12 | 
  13 | test.describe('Sales Return & Stock Recovery @sales @regression @full', () => {
  14 | 
  15 |     test('Forensic Audit: Invoice Void & Stock Restoration', async ({ page }) => {
  16 |         test.setTimeout(120000);
  17 |         const app = new AppManager(page);
  18 | 
  19 |         // --- STAGE 0: SETUP & BASELINE ---
  20 |         await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  21 |         
  22 |         console.log('[ACTION] Discovering environment metadata...');
  23 |         const meta = await app.api.sales.discoverMetadataAPI();
  24 |         const arAccountId = meta.arAccountId;
  25 |         const inventoryAccountId ='0e350587-573e-48a0-9c29-ba9792015093'; // Inventory (Code 1301)
  26 | 
  27 |         // 1. Pick a clean item and get its current stock level
  28 |         const itemInfo = await app.api.inventory.captureRandomItemDataAPI({ minStock: 10 });
  29 |         const initialStock = itemInfo.currentStock;
  30 |         
  31 |         console.log(`[SNAPSHOT] Baseline Item: "${itemInfo.itemName}" | Stock: ${initialStock}`);
  32 | 
  33 |         // --- STAGE 1: THE SALE (STOCK DEPLETION) ---
  34 |         console.log(`[STEP 1] Creating Invoice for 10 units...`);
  35 |         const inv = await app.api.sales.createStandaloneInvoiceAPI({
  36 |             customerId: meta.customerId,
  37 |             itemId: itemInfo.itemId,
  38 |             quantity: 10,
  39 |             unitPrice: 5000,
  40 |             locationId: itemInfo.locationId,
  41 |             warehouseId: itemInfo.warehouseId
  42 |         });
  43 | 
  44 |         // ⚡ Speed Approval
  45 |         await app.advanceDocumentAPI(inv.id,'invoices');
  46 |         console.log(`[SUCCESS] Invoice ${inv.ref} approved.`);
  47 | 
  48 |         // Verification: Wait for stock engine to process
  49 |         console.log('[INFO] Waiting 5s for Stock Engine sync...');
  50 |         await page.waitForTimeout(5000);
  51 | 
  52 |         const postSaleStock = await app.api.inventory.pollStockAPI(itemInfo.itemId, initialStock - 10);
  53 |         console.log(`[SNAPSHOT] Post-Sale Stock: ${postSaleStock}`);
  54 | 
  55 |         // ASSERTION: Stock MUST be exactly 10 less
> 56 |         expect(postSaleStock).toBe(initialStock - 10);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  57 |         console.log(`[SUCCESS] Inventory Depletion confirmed. Stock logic is healthy.`);
  58 | 
  59 |         // --- STAGE 2: THE VOID (STOCK RESTORATION) ---
  60 |         console.log(`[STEP 2] VOIDING Invoice ${inv.ref} via API...`);
  61 |         const voidSuccess = await app.api.sales.reverseInvoiceAPI(inv.id);
  62 |         
  63 |         if (!voidSuccess) {
  64 |             console.error(`[FAIL] System rejected Invoice Void request.`);
  65 |             throw new Error('Business Logic Violation: Could not Void an approved invoice.');
  66 |         }
  67 | 
  68 |         console.log(`[SUCCESS] Invoice ${inv.ref} marked as REVERSED (VOID).`);
  69 | 
  70 |         // --- STAGE 3: THE FORENSIC AUDIT ---
  71 |         console.log('[INFO] Waiting 8s for Stock & Ledger Reconciliation...');
  72 |         await page.waitForTimeout(8000);
  73 | 
  74 |         const finalStock = await app.api.inventory.pollStockAPI(itemInfo.itemId, initialStock);
  75 |         const finalLedger = await app.getMultiAccountBalancesAPI([arAccountId]);
  76 |         
  77 |         console.log(`[AUDIT] Stage 3 Results:`);
  78 |         console.log(`[SNAPSHOT] Final Stock : ${finalStock} (Expected: ${initialStock})`);
  79 |         console.log(`[SNAPSHOT] Final AR    : ${finalLedger[arAccountId].toFixed(2)}`);
  80 | 
  81 |         // ASSERTION 1: Stock should be exactly back to baseline
  82 |         const isStockRestored = (finalStock === initialStock);
  83 |         
  84 |         if (!isStockRestored) {
  85 |             console.error(`[VULNERABILITY DETECTED]: ZOMBIE RETURN BUG!`);
  86 |             console.log(`================================================================================`);
  87 |             console.log(`[ITEM]: ${itemInfo.itemName}`);
  88 |             console.log(`[GAP]: Stock remained at ${finalStock} instead of restoring to ${initialStock}.`);
  89 |             console.log(`[IMPACT]: Inventory Leakage - Warehouse mismatch occurred after Void.`);
  90 |             console.log(`================================================================================`);
  91 |             throw new Error(`[ZOMBIE_STOCK_BUG] Stock Recovery Failed after Invoice Void.`);
  92 |         }
  93 | 
  94 |         console.log(`[PASSED] Full Stock & Revenue Recovery Verified.`);
  95 |     });
  96 | });
  97 | 
```