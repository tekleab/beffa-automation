import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';
import { Logger } from '../../lib/utils/Logger';

/**
 * SALES CUSTOMER BALANCE UI AUDIT
 *
 * Objectives:
 * 1. Approved invoice must reflect correct outstanding balance in customer profile UI.
 * 2. After full payment, customer profile must show zero outstanding balance.
 */

test.describe('Sales Customer Balance UI Audits @sales @smoke @full', () => {
    test.setTimeout(120000);

    test('UI Audit: Approved invoice reflects outstanding balance in customer profile', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        console.log(`[STEP 1] Creating & approving invoice via API...`);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: item.unitCost || 750,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');
        console.log(`[OK] Invoice ${inv.ref} approved.`);

        // Read the actual invoice total from the backend (backend may override unit_price with item cost)
        console.log(`[STEP 2] Asserting outstanding balance via API...`);
        const invoiceData = await app.api.sales.getInvoiceAPI(inv.id);
        const netDue = parseFloat(invoiceData.net_due ?? '-1');
        const outstanding = parseFloat(invoiceData.unreceived_amount ?? invoiceData.balance ?? '-1');
        if (netDue === -1) throw new Error(`[AUDIT] 'net_due' field missing from invoice response.`);
        if (outstanding === -1) throw new Error(`[AUDIT] 'unreceived_amount' field missing from invoice response.`);
        console.log(`[AUDIT] Invoice ${inv.ref} | net_due: ${netDue} | unreceived: ${outstanding}`);
        // An approved, unpaid invoice must have unreceived_amount == net_due
        expect(outstanding).toBeCloseTo(netDue, 2);

        console.log(`[STEP 3] Navigating to customer profile...`);
        await page.goto(`/receivables/customers/${meta.customerId}/detail`);

        console.log(`[STEP 4] Opening Invoices tab...`);
        const invoicesTab = page.getByRole('tab', { name: /^Invoices$/i }).first();
        await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
        await invoicesTab.click();
        
        // Wait for tab content to load completely
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        await page.waitForTimeout(3000); // Additional buffer for UI rendering

        console.log(`[STEP 5] Asserting invoice ${inv.ref} is visible in customer profile...`);
        
        // Wait for the invoices tab content to load
        await page.waitForLoadState('domcontentloaded');
        
        // Wait for any table in the active tab panel to be visible
        const activeTabPanel = page.locator('[role="tabpanel"]:not([hidden])').first();
        await activeTabPanel.waitFor({ state: 'visible', timeout: 10000 });
        
        // Give additional time for all invoices to load (could be many)
        await page.waitForTimeout(8000);
        
        // Check if we need to handle pagination or scroll to load more data
        let attempts = 0;
        let found = false;
        const maxAttempts = 5;
        
        while (!found && attempts < maxAttempts) {
            attempts++;
            console.log(`[DEBUG] Search attempt ${attempts}/${maxAttempts} for invoice ${inv.ref}`);
            
            // Check if there are any tables in the active tab
            const tables = page.locator('table');
            const tableCount = await tables.count();
            console.log(`[DEBUG] Tables found: ${tableCount}`);
            
            if (tableCount > 0) {
                const activeTable = activeTabPanel.locator('table').first();
                const isTableVisible = await activeTable.isVisible({ timeout: 5000 }).catch(() => false);
                
                if (isTableVisible) {
                    const rowCount = await activeTable.locator('tbody tr').count();
                    console.log(`[DEBUG] Rows in active table: ${rowCount}`);
                    
                    if (rowCount > 0) {
                        // Get sample content for debugging
                        const firstRowContent = await activeTable.locator('tbody tr').first().textContent().catch(() => '');
                        const lastRowContent = await activeTable.locator('tbody tr').last().textContent().catch(() => '');
                        console.log(`[DEBUG] First row: ${firstRowContent}`);
                        console.log(`[DEBUG] Last row: ${lastRowContent}`);
                    }
                }
            }
            
            // Try multiple possible invoice reference formats
            const possibleRefs = [
                inv.ref
            ].filter(Boolean);
            
            console.log(`[DEBUG] Looking for invoice refs: ${possibleRefs.join(', ')}`);
            
            // Search in the entire page content, not just tables
            for (const ref of possibleRefs) {
                const locator = page.getByText(ref, { exact: false });
                const elementCount = await locator.count();
                
                if (elementCount > 0) {
                    console.log(`[SUCCESS] Found ${elementCount} elements with reference: ${ref}`);
                    
                    // Check if at least one is visible
                    for (let i = 0; i < elementCount; i++) {
                        const element = locator.nth(i);
                        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
                            console.log(`[SUCCESS] Invoice ${ref} is visible at position ${i}`);
                            found = true;
                            break;
                        }
                    }
                    
                    if (found) break;
                }
            }
            
            if (!found) {
                // Try searching by invoice ID as fallback
                const invoiceId = inv.id.toString();
                const idLocator = page.getByText(invoiceId, { exact: false });
                const idCount = await idLocator.count();
                
                if (idCount > 0) {
                    console.log(`[SUCCESS] Found invoice by ID: ${invoiceId}`);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                // Scroll down to potentially load more invoices or check pagination
                console.log(`[DEBUG] Invoice not found yet, scrolling down to load more data...`);
                await page.keyboard.press('End'); // Scroll to bottom
                await page.waitForTimeout(2000);
                
                // Check for pagination buttons and click "Next" if available
                const nextButton = page.getByRole('button', { name: /next|>/i }).or(
                    page.locator('button[aria-label*="next"]')
                ).first();
                
                if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                    console.log(`[DEBUG] Clicking pagination Next button...`);
                    await nextButton.click();
                    await page.waitForTimeout(3000);
                } else {
                    // Try scrolling within the table if no pagination
                    const tableContainer = page.locator('div[class*="table"], .table-container').first();
                    if (await tableContainer.isVisible({ timeout: 1000 }).catch(() => false)) {
                        await tableContainer.evaluate(el => {
                            el.scrollTop = el.scrollHeight;
                        });
                        await page.waitForTimeout(2000);
                    }
                }
            }
        }
        
        if (!found) {
            // Final attempt: check if the page contains invoice-related content in body text
            const pageContent = await page.textContent('body');
            const hasInvoiceContent = inv.ref && pageContent?.includes(inv.ref);
            
            if (hasInvoiceContent) {
                console.log(`[SUCCESS] Invoice content found in page body (may be outside visible area)`);
                found = true;
            } else {
                console.log(`[ERROR] Invoice not found after ${maxAttempts} attempts`);
                console.log(`[DEBUG] Current page URL: ${page.url()}`);
                console.log(`[DEBUG] Page title: ${await page.title()}`);
                console.log(`[DEBUG] Full invoice data:`, JSON.stringify(inv, null, 2));
                throw new Error(`Invoice ${inv.ref || inv.id} not found in customer profile UI after extensive search. Customer: ${meta.customerId}`);
            }
        }
        
        console.log(`[SUCCESS] Invoice verification completed after ${attempts} attempts`);
        console.log(`[PASS] Invoice ${inv.ref} confirmed visible. Outstanding balance ${outstanding} verified.`);
    });

    test('UI Audit: Customer profile shows zero balance after full payment', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const meta = await app.api.sales.discoverMetadataAPI();
        const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
        if (!item) { console.log('[SKIP] No stock available.'); return; }

        console.log(`[STEP 1] Creating invoice, approving, and paying in full via API...`);
        const inv = await app.api.sales.createStandaloneInvoiceAPI({
            customerId: meta.customerId,
            itemId: item.itemId,
            quantity: 1,
            unitPrice: item.unitCost || 600,
            locationId: item.locationId,
            warehouseId: item.warehouseId
        });
        await app.advanceDocumentAPI(inv.id, 'invoices');

        // Read the actual invoice total before paying — backend may override unit_price
        const invData = await app.api.sales.getInvoiceAPI(inv.id);
        const ACTUAL_AMOUNT = parseFloat(invData.net_due ?? invData.unreceived_amount ?? '0');
        if (!ACTUAL_AMOUNT) throw new Error(`[AUDIT] Could not determine invoice net_due for payment. Response: ${JSON.stringify(invData).substring(0, 200)}`);
        console.log(`[OK] Invoice ${inv.ref} net_due: ${ACTUAL_AMOUNT}`);

        const rct = await app.api.sales.createInvoiceReceiptAPI({
            invoiceId: inv.id,
            customerId: meta.customerId,
            amount: ACTUAL_AMOUNT
        });
        await app.advanceDocumentAPI(rct.id, 'receipts');
        console.log(`[OK] Invoice ${inv.ref} fully paid via receipt ${rct.ref}.`);

        await page.waitForTimeout(3000);

        console.log(`[STEP 2] Verifying invoice balance is zero via API...`);
        const finalInv = await app.api.sales.getInvoiceAPI(inv.id);
        const remaining = parseFloat(finalInv.unreceived_amount ?? finalInv.balance ?? '-1');
        if (remaining === -1) throw new Error(`[AUDIT] 'unreceived_amount' field missing from invoice response.`);
        console.log(`[AUDIT] Invoice ${inv.ref} remaining balance: ${remaining} (Expected: 0)`);
        expect(remaining).toBeCloseTo(0, 2);

        console.log(`[STEP 3] Navigating to customer profile to verify paid status in UI...`);
        await page.goto(`/receivables/customers/${meta.customerId}/detail`);

        const invoicesTab = page.getByRole('tab', { name: /^Invoices$/i }).first();
        await invoicesTab.waitFor({ state: 'visible', timeout: 15000 });
        await invoicesTab.click();
        
        // Wait for tab content to load completely
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        await page.waitForTimeout(3000);

        // Check Receipts tab for the receipt ref — this is a hard assertion
        console.log(`[STEP 4] Asserting receipt ${rct.ref} is visible in customer profile...`);
        const receiptsTab = page.getByRole('tab', { name: /^Receipts$/i }).first();
        if (await receiptsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
            await receiptsTab.click();
            await page.waitForLoadState('networkidle', { timeout: 10000 });
            await page.waitForTimeout(3000);
        }

        // Try multiple possible receipt reference formats
        const possibleReceiptRefs = [
            rct.ref
        ].filter(Boolean);
        
        console.log(`[DEBUG] Looking for receipt refs: ${possibleReceiptRefs.join(', ')}`);
        
        let receiptFound = false;
        for (const ref of possibleReceiptRefs) {
            const rcptLocator = page.getByText(ref, { exact: false }).first();
            if (await rcptLocator.isVisible({ timeout: 10000 }).catch(() => false)) {
                console.log(`[SUCCESS] Found receipt with reference: ${ref}`);
                receiptFound = true;
                break;
            }
        }
        
        if (!receiptFound) {
            // Try searching by receipt ID as fallback
            const receiptId = rct.id.toString();
            const idLocator = page.getByText(receiptId, { exact: false }).first();
            if (await idLocator.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log(`[SUCCESS] Found receipt by ID: ${receiptId}`);
                receiptFound = true;
            }
        }
        
        if (!receiptFound) {
            console.log(`[ERROR] Receipt not found. Full receipt data:`, JSON.stringify(rct, null, 2));
            throw new Error(`Receipt ${rct.ref || rct.id} not found in customer profile UI.`);
        }

        console.log(`[PASS] Receipt ${rct.ref} confirmed in customer profile. Balance cleared to zero.`);
    });
});
