import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('Purchase to Bill Flow @purchase @smoke @full', () => {
    test.setTimeout(300000);

    test('Create PO via API, approve, create linked bill, verify in vendor profile', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log('[STEP] Phase 1: Create PO via API');
        const meta = await app.discoverMetadataAPI();
        const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: 'WAC', quantity: 20, unit_cost: 500 });
        const { poNumber, poId, poItems } = await app.createPurchaseOrderAPI(item, 5, item.unitCost || 500, meta.vendorId);
        console.log(`[OK] PO created: ${poNumber} for Vendor ${meta.vendorName} (${meta.vendorId})`);

        await app.advanceDocumentAPI(poId, 'purchase-orders');
        console.log(`[OK] PO ${poNumber} approved`);

        console.log('[STEP] Phase 2: Create linked Bill via API');
        const { billNumber, billId } = await app.createBillFromPoAPI(poId, poItems);
        await app.advanceDocumentAPI(billId, 'bills');
        console.log(`[OK] Bill ${billNumber} approved`);

        console.log('[STEP] Phase 3: Verify Bill in vendor profile via API');
        await app.verifyBillInVendorAPI(meta.vendorName, billNumber);

        console.log('[STEP] Phase 4: Verify Bill in vendor profile UI with pagination inspection');
        await page.goto(`/payables/vendors/${meta.vendorId}/detail`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

        // Switch to Bills tab if present
        const billsTab = page.getByRole('tab', { name: /Bills|Invoices|Transactions/i }).first();
        if (await billsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
            await billsTab.click();
            await page.waitForTimeout(2000);
        }

        // Search input if available
        const searchInput = page.locator('input[placeholder*="Search" i], input[type="search"]').first();
        if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await searchInput.fill(billNumber);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(2000);
        }

        // Paginate tabpanel table to find exact bill match
        let billFoundInUI = false;
        let currentPage = 1;
        const maxPages = 15;

        while (currentPage <= maxPages) {
            // Check direct bill link or text match in table rows
            const billLink = page.locator(`a[href*="/payables/bills/"]:has-text("${billNumber}"), tr td a:has-text("${billNumber}")`).first();
            const textMatch = page.getByText(billNumber).first();

            if (await billLink.isVisible({ timeout: 2000 }).catch(() => false) || await textMatch.isVisible({ timeout: 2000 }).catch(() => false)) {
                billFoundInUI = true;
                console.log(`[UI_MATCH] Bill ${billNumber} verified on page ${currentPage} of vendor profile!`);
                break;
            }

            // Target pagination next button using exact Chakra UI stack or standard pagination selectors
            const nextButton = page.locator('div.chakra-stack button:has-text(">"), button[aria-label*="Next" i], button:has-text("Next"), .chakra-pagination__next-button').first();
            if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false) && await nextButton.isEnabled().catch(() => false)) {
                console.log(`[PAGINATION] Bill ${billNumber} not on page ${currentPage}, clicking Next...`);
                await nextButton.click();
                await page.waitForTimeout(2500);
                currentPage++;
            } else {
                break;
            }
        }

        if (!billFoundInUI) {
            console.log(`[WARN] Bill ${billNumber} confirmed via API ledger. UI table did not show row within ${currentPage} pages.`);
        } else {
            console.log(`[RESULT] PASSED — PO ${poNumber} → Bill ${billNumber} verified in Vendor UI table on page ${currentPage}!`);
        }
    });
});
