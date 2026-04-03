const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe.serial('Direct Bill API & Inventory Reversal Impact', () => {
    let billID = null;
    let billUUID = null;
    let initialInfo = null;
    let billedQty = 12;

    test('Stage 1: API Bill Creation and Stock Increase', async ({ page }) => {
        test.setTimeout(400000); 
        const app = new AppManager(page);

        // 1. Authentication
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        
        // 2. Identify Random Item
        initialInfo = await app.captureRandomItemDetails();
        console.log(`[TARGET] Item: "${initialInfo.itemName}" | Initial Stock: ${initialInfo.currentStock}`);

        // 3. Create Bill via API
        console.log(`Action: Creating Direct Bill via API for "${initialInfo.itemName}"...`);
        const billData = await app.createBillAPI(initialInfo, billedQty, 4000);
        billID = billData.billNumber;
        billUUID = billData.billId;

        // 4. UI Approval Flow (Multi-step)
        console.log(`[SUCCESS] Bill Created: ${billID}. Navigating to Approval UI...`);
        await page.goto(`/payables/bills/${billUUID}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[✓] Bill ${billID} approved.`);

        // 5. Verify Stock Increase
        console.log(`Action: Verifying inventory increase for "${initialInfo.itemName}"...`);
        // Retry loop to allow for background ledger processing
        let finalStock = 0;
        const expectedStock = initialInfo.currentStock + billedQty;
        
        for (let i = 0; i < 5; i++) {
            const { currentStock } = await app.captureItemDetails(initialInfo.itemName);
            finalStock = currentStock;
            if (finalStock === expectedStock) break;
            console.log(`[WAIT] Stock is ${finalStock}, waiting for ${expectedStock}... (Attempt ${i+1})`);
            await page.waitForTimeout(3000);
        }

        console.log(`------------------------------------------`);
        console.log(`Item: ${initialInfo.itemName}`);
        console.log(`Initial Stock: ${initialInfo.currentStock}`);
        console.log(`Billed Qty  : ${billedQty}`);
        console.log(`Final Stock   : ${finalStock}`);
        console.log(`Expected      : ${expectedStock}`);
        console.log(`------------------------------------------`);

        expect(finalStock).toBe(expectedStock);
        console.log("[SUCCESS] Stock increased correctly.");
    });

    test('Stage 2: Bill Reversal and Stock Restoration', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`Action: Reversing Bill ${billID}...`);
        await page.goto(`/payables/bills/${billUUID}/detail`, { waitUntil: 'load' });

        const reverseBtn = page.getByRole('button', { name: 'Reverse' });
        await reverseBtn.click();
        
        // Confirmation inside Modal
        const confirmBtn = page.getByRole('dialog').getByRole('button', { name: 'Reverse', exact: true });
        await confirmBtn.waitFor({ state: 'visible' });
        await confirmBtn.click();
        await page.waitForTimeout(5000); // Allow backend to process

        // Verify Stock Restored to Initial
        console.log(`Action: Verifying inventory restoration for "${initialInfo.itemName}"...`);
        const { currentStock: restoredStock } = await app.captureItemDetails(initialInfo.itemName);
        
        console.log(`[VERIFY] Initial: ${initialInfo.currentStock} | Restored: ${restoredStock}`);
        expect(restoredStock).toBe(initialInfo.currentStock);
        console.log("[SUCCESS] Inventory perfectly restored to initial level after Bill reversal!");
    });
});
