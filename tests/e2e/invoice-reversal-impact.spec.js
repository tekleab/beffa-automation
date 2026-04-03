const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe.serial('Isolated Invoice Reversal & Inventory Impact', () => {
    let invID = null;
    let initialInfo = null;
    let invoicedQty = 0;

    /**
     * Stage 1: Isolated Invoice Creation and Initial Inventory Deduction
     */
    test('Stage 1: Direct Invoice Creation and Inventory Deduction', async ({ page }) => {
        test.setTimeout(400000); 
        const app = new AppManager(page);

        // 1. Authentication
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        // 2. Identify a Target Item with sufficient stock
        while (true) {
            initialInfo = await app.captureRandomItemDetails();
            if (initialInfo.currentStock >= 2) {
                console.log(`[TARGET] Item: "${initialInfo.itemName}" | Initial Stock: ${initialInfo.currentStock}`);
                break;
            }
            console.log(`[INFO] Item "${initialInfo.itemName}" low stock (${initialInfo.currentStock}). Retrying...`);
        }

        // 3. Navigate to Isolated Direct Invoice Creation
        console.log("Action: Navigating to Direct New Invoice...");
        await page.goto('/receivables/invoices/new', { waitUntil: 'load' });
        
        // Fill Customer
        const invCustBtn = page.getByRole('button', { name: 'Customer selector' });
        await app.selectRandomOption(invCustBtn, 'Customer');
        const selectedCustomer = (await invCustBtn.innerText()).trim();
        console.log(`[DATA] Selected Customer: "${selectedCustomer}"`);

        // Fill Mandatory Dates using Smart Calendar logic (EC/GC)
        const currentDay = await app.getActiveCalendarDay();
        const dueDay = Math.min(30, currentDay + 5);
        await app.pickDate('Invoice Date', currentDay);
        await app.pickDate('Due Date', dueDay);
        console.log(`[INFO] Dates set: Invoice Day ${currentDay}, Due Day ${dueDay}`);

        // Fill AR Account
        const arBtn = page.getByRole('button', { name: /Account(s)? Receivable selector/i });
        await app.selectRandomOption(arBtn, 'AR Account');

        // Add Direct Line Item for our target item
        console.log(`Action: Adding Line Item for "${initialInfo.itemName}"...`);
        await page.getByRole('button', { name: 'Line Item' }).click();
        const modal = page.getByRole('dialog').last();
        await modal.waitFor({ state: 'visible' });

        await modal.getByRole('button', { name: 'Item', exact: true }).click();
        const itemSelector = modal.getByRole('button', { name: 'Item selector' });
        await itemSelector.click();
        await app.smartSearch(null, initialInfo.itemName);
        await page.waitForTimeout(800);

        await app.selectRandomOption(modal.getByRole('button', { name: 'Warehouse selector' }), 'Warehouse');
        await app.selectRandomOption(modal.getByRole('button', { name: 'Location selector' }), 'Location');
        await app.selectRandomOption(modal.getByRole('button', { name: 'G/L Account selector' }), 'Sales Account');

        invoicedQty = 1;
        await modal.getByRole('group').filter({ hasText: /^Quantity/i }).getByRole('spinbutton').fill(String(invoicedQty));

        await modal.getByRole('button', { name: 'Add', exact: true }).click();
        await expect(modal).not.toBeVisible();

        // Submit Invoice
        console.log("Action: Submitting Invoice...");
        const invSubmitBtn = page.getByRole('button', { name: 'Add Now' }).first();
        await expect(invSubmitBtn).toBeEnabled();
        await invSubmitBtn.click();

        // 4. Extract Invoice ID & Approve
        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/, { timeout: 120000 });
        const invElement = page.locator('p, span, div, h1, h2, h3, h4, h5').filter({ hasText: /^INV\// }).first();
        invID = (await invElement.textContent()).match(/INV\/\d{4}\/\d{2}\/\d{2}\/\d+/)[0];
        console.log(`[✓] Isolated Invoice ${invID} created.`);

        await app.handleApprovalFlow();
        console.log(`[✓] Invoice ${invID} approved.`);

        // 5. Final Stock Deduction Verification (Pre-Reversal)
        console.log(`Action: Verifying inventory deduction for "${initialInfo.itemName}"...`);
        const { currentStock: postInvStock } = await app.captureItemDetails(initialInfo.itemName);
        const expectedStock = initialInfo.currentStock - invoicedQty;
        
        console.log(`[VERIFY] Expected Stock (after invoice): ${expectedStock} | Found: ${postInvStock}`);
        if (postInvStock !== expectedStock) {
             throw new Error(`Inventory deduction failed. Expected ${expectedStock}, found ${postInvStock}`);
        }
        console.log("[SUCCESS] Inventory decreased correctly upon Invoice approval.");
    });

    /**
     * Stage 2: Document Reversal and Ledger Verification
     */
    test('Stage 2: Invoice Reversal and Inventory Restoration Verification', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`Action: Locating Invoice ${invID} for Reversal...`);
        await page.goto(`/receivables/invoices/?page=1&pageSize=15`);
        await app.smartSearch(page.locator('body'), invID);
        // smartSearch already selects the result and auto-navigates!
        await page.waitForURL(/\/receivables\/invoices\/.*\/detail$/);
        await page.waitForTimeout(3000);

        // 1. Trigger Reversal (UI Track)
        console.log(`Action: Triggering Reversal for Invoice ${invID}...`);
        await page.getByRole('button', { name: 'Reverse' }).click();
        // Specifically hunt inside the modal!
        await page.getByRole('dialog').getByRole('button', { name: 'Reverse' }).click();
        
        console.log("Action: Waiting for backend Reversal finalization...");
        await page.waitForTimeout(6000); 
        
        const badge = page.locator('.chakra-badge').filter({ hasText: /Reversed/i }).first();
        if (await badge.isVisible({ timeout: 5000 }).catch(()=>false)) {
            console.log(`[SUCCESS] Status for ${invID} successfully flipped to Reversed.`);
        } else {
            console.log(`[WARN] The reversal may not have completed in time. Continuing to verify inventory...`);
        }

        // 2. Mathematical Reversal Verification in Inventory
        console.log(`Action: Checking Reversed Inventory Restoration for "${initialInfo.itemName}"...`);
        const { currentStock: finalStock } = await app.captureItemDetails(initialInfo.itemName);
        
        // The reversed action should bring stock exactly back to the initialStock count!
        console.log(`[VERIFY] Expected Stock (Reversed/Restored): ${initialInfo.currentStock} | Found: ${finalStock}`);
        if (finalStock !== initialInfo.currentStock) {
            throw new Error(`Inventory reversal failed! Expected stock to bounce back to ${initialInfo.currentStock}, but found ${finalStock}`);
        }

        console.log(`[SUCCESS] Inventory perfectly mapped the reversal correctly! Restored to ${finalStock}.`);
        console.log(`[✓] Complete Isolated Invoice Reversal & Inventory Impact test finished.`);
        await page.close();
    });
});
