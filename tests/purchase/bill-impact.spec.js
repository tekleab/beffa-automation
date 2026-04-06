const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');

test.describe.serial('Bill Impact — Create Bill, Verify Stock Increase, Reverse, Verify Restoration', () => {
    let billID = null;
    let billUUID = null;
    let initialInfo = null;
    let billedQty = 12;

    test('Stage 1: Create bill via API, approve, verify stock increase', async ({ page }) => {
        test.setTimeout(400000);
        const app = new AppManager(page);

        console.log('[STEP] Stage 1: Login & Item Discovery');
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        initialInfo = await app.captureRandomItemDetails();
        console.log(`[INFO] Item: "${initialInfo.itemName}" | Stock: ${initialInfo.currentStock}`);

        console.log(`[STEP] Creating bill via API for "${initialInfo.itemName}"`);
        const billData = await app.createBillAPI(initialInfo, billedQty, 4000);
        billID = billData.billNumber;
        billUUID = billData.billId;
        console.log(`[OK] Bill created: ${billID}`);

        console.log(`[STEP] Approving bill ${billID}`);
        await page.goto(`/payables/bills/${billUUID}/detail`, { waitUntil: 'load' });
        await app.handleApprovalFlow();
        console.log(`[OK] Bill ${billID} approved`);

        console.log('[STEP] Verifying stock increase');
        let finalStock = 0;
        const expectedStock = initialInfo.currentStock + billedQty;

        for (let i = 0; i < 5; i++) {
            const { currentStock } = await app.captureItemDetails(initialInfo.itemName);
            finalStock = currentStock;
            if (finalStock === expectedStock) break;
            console.log(`[INFO] Stock is ${finalStock}, waiting for ${expectedStock} (attempt ${i + 1})`);
            await page.waitForTimeout(3000);
        }

        console.log(`[VERIFY] Item: ${initialInfo.itemName} | Initial: ${initialInfo.currentStock} | Billed: ${billedQty} | Final: ${finalStock} | Expected: ${expectedStock}`);
        expect(finalStock).toBe(expectedStock);
        console.log('[OK] Stock increased correctly');
    });

    test('Stage 2: Reverse bill, verify stock restoration', async ({ page }) => {
        test.setTimeout(300000);
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        console.log(`[STEP] Reversing bill ${billID}`);
        await page.goto(`/payables/bills/${billUUID}/detail`, { waitUntil: 'load' });

        const reverseBtn = page.getByRole('button', { name: 'Reverse' });
        await reverseBtn.click();
        const confirmBtn = page.getByRole('dialog').getByRole('button', { name: 'Reverse', exact: true });
        await confirmBtn.waitFor({ state: 'visible' });
        await confirmBtn.click();
        await page.waitForTimeout(5000);

        console.log('[STEP] Verifying stock restoration');
        const { currentStock: restoredStock } = await app.captureItemDetails(initialInfo.itemName);

        console.log(`[VERIFY] Initial: ${initialInfo.currentStock} | Restored: ${restoredStock}`);
        expect(restoredStock).toBe(initialInfo.currentStock);
        console.log('[RESULT] Bill Impact: PASSED — Stock restored');
    });
});
