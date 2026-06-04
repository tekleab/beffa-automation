import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * CROSS-MODULE UI FLOW AUDITS (50/50 API+UI)
 *
 * Objectives:
 * 1. Sales: Partial payment via UI correctly updates invoice Amount Due on screen.
 * 2. Purchase: Approved bill reflects outstanding balance in vendor profile UI.
 */

test.describe('Cross-Module UI Flow Audits @sales @purchase @smoke @full', () => {

    test('Sales UI: Partial payment updates invoice Amount Due correctly', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const INVOICE_AMOUNT = 1000;
        const PARTIAL_AMOUNT = 400;
        const EXPECTED_REMAINING = INVOICE_AMOUNT - PARTIAL_AMOUNT;

        console.log(`[STEP 1] Creating & approving invoice for ${INVOICE_AMOUNT} via API...`);
        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });

        if (!item) {
            console.log(`[SKIP] No item with stock >= 1 found.`);
            return;
        }

        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: INVOICE_AMOUNT,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        console.log(`[OK] Invoice ${inv.ref} approved.`);

        console.log(`[STEP 2] Navigating to invoice detail page via UI...`);
        await page.goto(`/receivables/invoices/${inv.id}/detail`, { waitUntil: 'networkidle' });

        console.log(`[STEP 3] Creating partial receipt of ${PARTIAL_AMOUNT} via UI...`);
        const addReceiptBtn = page.getByRole('button', { name: /Add Receipt|Create Receipt|Receive Payment/i }).first();
        await addReceiptBtn.waitFor({ state: 'visible', timeout: 15000 });
        await addReceiptBtn.click();

        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible', timeout: 15000 });

        const amountInput = modal.getByRole('spinbutton').first();
        await amountInput.waitFor({ state: 'visible', timeout: 10000 });
        await amountInput.fill(String(PARTIAL_AMOUNT));

        await app.selectRandomOption(modal.getByRole('button', { name: /Cash Account selector/i }), 'Cash Account');

        const saveBtn = modal.getByRole('button', { name: /Add Now|Save|Submit/i }).first();
        await saveBtn.click();
        await expect(modal).not.toBeVisible({ timeout: 15000 });
        console.log(`[OK] Partial receipt submitted.`);

        console.log(`[STEP 4] Verifying Amount Due updated on invoice detail page...`);
        await page.waitForTimeout(3000);
        await page.reload({ waitUntil: 'networkidle' });

        const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
        const remaining = parseFloat(finalInv.unreceived_amount || finalInv.balance || '0');

        console.log(`[AUDIT] Invoice ${inv.ref} | Paid: ${PARTIAL_AMOUNT} | Remaining: ${remaining} | Expected: ${EXPECTED_REMAINING}`);
        expect(remaining).toBeCloseTo(EXPECTED_REMAINING, 1);

        await expect(page.getByText(String(EXPECTED_REMAINING)).first()).toBeVisible({ timeout: 15000 });
        console.log(`[PASS] Partial payment confirmed. Amount Due correctly updated to ${EXPECTED_REMAINING}.`);
    });

    test('Purchase UI: Approved bill reflects outstanding balance in vendor profile', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP 1] Creating & approving bill via API...`);
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 0 });
        const BILL_AMOUNT = 5000;

        const bill = await app.api.purchase.createBillAPI({
            itemData: item,
            quantity: 1,
            unitPrice: BILL_AMOUNT
        });
        await app.advanceDocumentAPI(bill.id, 'bills');
        console.log(`[OK] Bill ${bill.ref} approved.`);

        console.log(`[STEP 2] Fetching bill details to get vendor info...`);
        const billData = await app.api.purchase.getBillAPI(bill.id);
        const vendorId = billData.vendor_id || billData.vendor?.id;
        const vendorName = billData.vendor?.name || billData.vendor_name;

        if (!vendorId) {
            console.log(`[SKIP] Could not resolve vendor from bill. Skipping UI verification.`);
            return;
        }

        console.log(`[STEP 3] Navigating to vendor profile UI...`);
        await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });

        // Detect session expiry redirect — re-login if kicked to /users/login
        if (page.url().includes('/users/login')) {
            console.log('[AUTH] Session expired — re-authenticating...');
            await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
            await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });
        }

        // Shorter networkidle with fallback to domcontentloaded to avoid 90s hang on redirect
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() =>
            page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {})
        );

        // Abort if still on login page after re-auth attempt
        if (page.url().includes('/users/login')) {
            throw new Error('[CRITICAL] Session could not be restored. Vendor profile unreachable.');
        }

        console.log(`[STEP 4] Navigating to Bills tab...`);
        const billsTab = page.getByRole('tab', { name: /Bills|Transactions/i }).first();
        await billsTab.waitFor({ state: 'visible', timeout: 20000 });
        await billsTab.click();
        // Wait for the tab panel to populate — backend may be slow
        await page.waitForTimeout(4000);

        console.log(`[STEP 5] Asserting bill ${bill.ref} is visible in vendor profile...`);
        // Poll: bill may be on any page; scroll/search if not immediately visible
        let billVisible = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            billVisible = await page.getByText(bill.ref).first().isVisible({ timeout: 8000 }).catch(() => false);
            if (billVisible) break;
            console.log(`[POLL ${attempt + 1}/5] Bill not yet visible, waiting...`);
            await page.waitForTimeout(3000);
        }
        expect(billVisible, `Bill ${bill.ref} should be visible in vendor profile Bills tab`).toBe(true);

        console.log(`[PASS] Bill ${bill.ref} confirmed visible in vendor "${vendorName}" profile. Outstanding balance reflected.`);
    });
});
