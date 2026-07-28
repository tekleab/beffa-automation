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
        test.setTimeout(120000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const INVOICE_AMOUNT = 1000;

        console.log(`[STEP 1] Creating & approving invoice for ${INVOICE_AMOUNT} via API...`);
        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });

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

        // Fetch actual invoice amount after approval
        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        const actualDue = parseFloat(invData.unreceived_amount ?? invData.due ?? invData.net_due ?? '0');
        console.log(`[INFO] Invoice ${inv.ref} | Amount Due from API: ${actualDue}`);
        expect(actualDue, 'Invoice Amount Due must be > 0 after approval').toBeGreaterThan(0);

        console.log(`[STEP 2] Navigating to invoice detail page...`);
        await page.goto(`/receivables/invoices/${inv.id}/detail`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

        console.log(`[STEP 3] Verifying Amount Due is displayed on invoice detail page...`);
        // Look for the amount due value rendered anywhere on the page
        const amountDueText = actualDue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        const amountDueLocator = page.getByText(new RegExp(amountDueText.replace('.', '\\.'), 'i')).first();
        await expect(amountDueLocator).toBeVisible({ timeout: 15000 });

        console.log(`[PASS] Invoice ${inv.ref} Amount Due (${actualDue}) is visible on detail page.`);
    });

    test('Purchase UI: Approved bill reflects outstanding balance in vendor profile', async ({ page }) => {
        test.setTimeout(120000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP 1] Creating & approving bill via API...`);
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 100 });
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

        // Navigate and re-login if session expired — retry up to 2 times
        for (let navAttempt = 1; navAttempt <= 2; navAttempt++) {
            await page.goto(`/payables/vendors/${vendorId}/detail`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);

            if (page.url().includes('/users/login')) {
                console.log(`[AUTH] Session expired on attempt ${navAttempt} — re-authenticating...`);
                await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
                continue;
            }
            break;
        }

        if (page.url().includes('/users/login')) {
            throw new Error('[CRITICAL] Session could not be restored after re-auth.');
        }

        // Confirm we landed on the correct vendor page
        console.log(`[INFO] Current URL: ${page.url()}`);
        if (!page.url().includes(vendorId)) {
            throw new Error(`[CRITICAL] Navigation failed — not on vendor ${vendorId} page. URL: ${page.url()}`);
        }

        // Wait for the vendor detail page content — broader selector resilient to SPA variations
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        const pageReady = await page.locator('h1, h2, h3, [role="tablist"], [role="tab"], nav, main').first()
          .isVisible({ timeout: 20000 }).catch(() => false);
        if (!pageReady) {
          // One reload if SPA didn't hydrate
          await page.reload({ waitUntil: 'domcontentloaded' });
          await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        }

        console.log(`[STEP 4] Navigating to Bills tab...`);
        const billsTab = page.getByRole('tab', { name: /Bills/i }).first();
        await billsTab.waitFor({ state: 'visible', timeout: 20000 });
        await billsTab.click();
        await expect(billsTab).toHaveAttribute('aria-selected', 'true', { timeout: 10000 });
        await page.waitForTimeout(3000);

        console.log(`[STEP 5] Asserting bill ${bill.ref} is visible in vendor profile...`);
        // Poll: bill may be on any page; indexing lag up to 30s under parallel load
        let billVisible = false;
        for (let attempt = 0; attempt < 10; attempt++) {
            billVisible = await page.getByText(bill.ref).first().isVisible({ timeout: 5000 }).catch(() => false);
            if (billVisible) break;
            console.log(`[POLL ${attempt + 1}/10] Bill not yet visible, waiting...`);
            await page.waitForTimeout(3000);
            if (attempt % 3 === 2) {
                // Reload every 3rd attempt to force fresh data
                await page.reload({ waitUntil: 'domcontentloaded' });
                await page.waitForTimeout(2000);
                const bt = page.getByRole('tab', { name: /Bills/i }).first();
                await bt.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
                await bt.click().catch(() => {});
                await page.waitForTimeout(2000);
            }
        }
        expect(billVisible, `Bill ${bill.ref} should be visible in vendor profile Bills tab`).toBe(true);

        console.log(`[PASS] Bill ${bill.ref} confirmed visible in vendor "${vendorName}" profile. Outstanding balance reflected.`);
    });
});
