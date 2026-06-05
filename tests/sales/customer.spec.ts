import { test, expect } from'@playwright/test';
import { AppManager } from'../../pages/AppManager';
import * as fs from'fs';
import * as path from'path';

const addressData: Array<{ region: string; zones: Array<{ name: string; woredas: string[] }> }> = JSON.parse(
    fs.readFileSync(path.join(__dirname,'../../data/address_locations.json'),'utf8')
);

test.describe('Customer Lifecycle — Validation & CRUD @sales @smoke @full', () => {
    test.setTimeout(120000);

    test('Validate TIN, create customer, edit, remove', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const customerName =`Kebede-${Math.floor(Math.random() * 10000)}`;
        const updatedName =`${customerName}-Updated`;

        const randomRegion = addressData[Math.floor(Math.random() * addressData.length)];
        const randomZone = randomRegion.zones[Math.floor(Math.random() * randomRegion.zones.length)];
        const randomWoreda = randomZone.woredas[Math.floor(Math.random() * randomZone.woredas.length)];

        // Validation
        console.log('[STEP] Phase 1: TIN validation check');
        await page.goto('/receivables/customers/new');
        await app.customerNameInput.fill("Validation Test");
        await app.customerTypeSelect.selectOption('individual');
        await app.customerTinInput.fill("123");
        await app.customerPhoneInput.fill("0911223344");
        await app.fillEthiopianAddress(randomRegion.region, randomZone.name, randomWoreda);

        await app.createCustomerBtn.click();
        await expect(page.getByText(/10 digit|must be 10/i)).toBeVisible();
        console.log('[OK] Invalid TIN correctly blocked');

        // Create
        console.log(`[STEP] Phase 2: Creating customer "${customerName}"`);
        const uniquePhone =`09${Math.floor(10000000 + Math.random() * 90000000)}`;
        await app.customerTinInput.fill(fixedTIN);
        await app.customerPhoneInput.fill(uniquePhone);
        await app.customerNameInput.clear();
        await app.customerNameInput.fill(customerName);
        await app.createCustomerBtn.click();
        await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
        console.log(`[OK] Customer "${customerName}" created`);

        // Edit
        console.log(`[STEP] Phase 3: Editing to "${updatedName}"`);
        await app.editCustomerBtn.waitFor({ state:'visible', timeout: 15000 });
        await page.waitForTimeout(2000);
        await app.editCustomerBtn.click({ force: true });
        await page.waitForTimeout(3000);
        await expect(app.customerNameInput).toBeVisible({ timeout: 30000 });
        await app.customerNameInput.clear();
        await app.customerNameInput.fill(updatedName);
        const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update")').first();
        await saveBtn.click({ force: true });
        // Wait for edit to complete — page may navigate or re-render
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(2000);
        console.log('[OK] Customer updated');

        // Remove
        console.log('[STEP] Phase 4: Removing customer');
        // After save the page may reload — wait for URL to settle and DOM to stabilize
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(2000);

        // Remove button may be hidden until page fully renders — scroll + broader selector
        const removeBtn = page.locator('button:has-text("Remove"), button:has-text("Delete")').first();
        await removeBtn.scrollIntoViewIfNeeded().catch(() => {});
        await removeBtn.waitFor({ state: 'visible', timeout: 30000 });
        await removeBtn.click({ force: true });
        const confirmBtn = page.locator('section[role="dialog"] button:has-text("Yes"), button:has-text("Confirm")').first();
        await confirmBtn.waitFor({ state: 'visible', timeout: 15000 });
        await confirmBtn.click({ force: true });
        await page.waitForURL(url => url.href.includes('/receivables/customers'), { timeout: 30000 });

        console.log('[RESULT] Customer Lifecycle: PASSED');
    });
});
