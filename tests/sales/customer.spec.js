const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
const fs = require('fs');
const path = require('path');

const addressData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/address_locations.json'), 'utf8'));

test.describe('Customer Lifecycle — Validation & CRUD @smoke', () => {
    test.setTimeout(480000);

    test('Validate TIN, create customer, edit, remove', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const customerName = `Kebede-${Math.floor(Math.random() * 10000)}`;
        const updatedName = `${customerName}-Updated`;

        const randomRegion = addressData[Math.floor(Math.random() * addressData.length)];
        const randomZone = randomRegion.zones[Math.floor(Math.random() * randomRegion.zones.length)];
        const randomWoreda = randomZone.woredas[Math.floor(Math.random() * randomZone.woredas.length)];

        // Validation
        console.log('[STEP] Phase 1: TIN validation check');
        await page.goto('/receivables/customers/new');
        await page.getByRole('textbox', { name: 'Customer Name *' }).fill("Validation Test");
        await page.getByLabel('Customer Type *').selectOption('individual');
        await page.getByRole('textbox', { name: 'Customer TIN *' }).fill("123");
        await app.mainPhoneInput.fill("0911223344");
        await app.fillEthiopianAddress(randomRegion.region, randomZone.name, randomWoreda);

        const createBtn = page.locator('button:has-text("Create customer"), button:has-text("Adding Customer")');
        await createBtn.click();
        await expect(page.getByText(/10 digit|must be 10/i)).toBeVisible();
        console.log('[OK] Invalid TIN correctly blocked');

        // Create
        console.log(`[STEP] Phase 2: Creating customer "${customerName}"`);
        const uniquePhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
        await app.customerTinInput.fill(fixedTIN);
        await app.mainPhoneInput.fill(uniquePhone);
        await app.customerNameInput.clear();
        await app.customerNameInput.fill(customerName);
        await createBtn.click();
        await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
        console.log(`[OK] Customer "${customerName}" created`);

        // Edit
        console.log(`[STEP] Phase 3: Editing to "${updatedName}"`);
        const editBtn = page.locator('button:has-text("Edit")').first();
        await editBtn.waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(2000);
        await editBtn.click({ force: true });
        await page.getByRole('textbox', { name: 'Customer Name *' }).waitFor({ state: 'visible' });
        await page.getByRole('textbox', { name: 'Customer Name *' }).clear();
        await page.getByRole('textbox', { name: 'Customer Name *' }).fill(updatedName);
        const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update")').first();
        await saveBtn.click({ force: true });
        await page.waitForTimeout(4000);
        console.log('[OK] Customer updated');

        // Remove
        console.log('[STEP] Phase 4: Removing customer');
        const removeBtn = page.locator('button:has-text("Remove")');
        await removeBtn.waitFor({ state: 'visible' });
        await removeBtn.click({ force: true });
        const confirmBtn = page.locator('section[role="dialog"] button:has-text("Yes"), button:has-text("Confirm")').first();
        await confirmBtn.waitFor({ state: 'visible' });
        await confirmBtn.click({ force: true });
        await page.waitForURL(url => url.href.includes('/receivables/customers'), { timeout: 30000 });

        console.log('[RESULT] Customer Lifecycle: PASSED');
    });
});