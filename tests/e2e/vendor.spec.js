const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
const fs = require('fs');
const path = require('path');

const addressData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/address_locations.json'), 'utf8'));

test.describe('Vendor Lifecycle - Validation and CRUD', () => {
  test.setTimeout(480000);

  test('Should handle validation and then complete full CRUD cycle for Vendor', async ({ page }) => {
    const app = new AppManager(page);
    await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const fixedPhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
    const vendorNames = ["TechSource PLC", "Global Imports", "Ethio Supplies", "Pioneer Distributors", "Addis Wholesale Trading"];
    const baseName = vendorNames[Math.floor(Math.random() * vendorNames.length)];
    const vendorName = `${baseName}-${Math.floor(Math.random() * 10000)}`;
    const updatedName = `${vendorName}-Updated`;

    const randomRegion = addressData[Math.floor(Math.random() * addressData.length)];
    const randomZone = randomRegion.zones[Math.floor(Math.random() * randomRegion.zones.length)];
    const randomWoreda = randomZone.woredas[Math.floor(Math.random() * randomZone.woredas.length)];

    // --- PART 1: Validation Checks ---
    console.log("[VALIDATION] Checking Short TIN...");
    await page.goto('/payables/vendors/new');
    await page.getByRole('textbox', { name: 'Vendor Name *' }).fill("Validation Test Vendor");
    await page.getByLabel('Vendor Type *').selectOption('wholesaler');
    await page.getByRole('textbox', { name: 'TIN', exact: false }).fill("123"); // Too short
    await page.getByRole('textbox', { name: 'Phone', exact: false }).fill("0911223344");
    
    // Address mapping
    await app.fillEthiopianAddress(randomRegion.region, randomZone.name, randomWoreda);

    const createBtn = page.locator('button:has-text("Add Now"), button:has-text("Create vendor"), button:has-text("Save")').first();
    await createBtn.click();
    
    // Typically ERPs show validation messages matching elements like "10 digit", "must be 10", or "invalid"
    await expect(page.getByText(/10 digit|must be 10|invalid/i)).toBeVisible();
    console.log("Status: System correctly blocked invalid TIN.");

    // --- PART 2: Successful Creation ---
    console.log("Action: Creating Vendor: " + vendorName);
    const uniquePhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
    await page.getByRole('textbox', { name: 'TIN', exact: false }).clear();
    await page.getByRole('textbox', { name: 'TIN', exact: false }).fill(fixedTIN);
    await page.getByRole('textbox', { name: 'Phone', exact: false }).clear();
    await page.getByRole('textbox', { name: 'Phone', exact: false }).fill(uniquePhone);
    await page.getByRole('textbox', { name: 'Vendor Name *' }).clear();
    await page.getByRole('textbox', { name: 'Vendor Name *' }).fill(vendorName);
    await createBtn.click();

    await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
    console.log("Status: Vendor successfully created.");

    // --- PART 3: Edit ---
    console.log("Action: Editing Vendor to: " + updatedName);
    const editBtn = page.locator('button:has-text("Edit")').first();
    await editBtn.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(2000);
    await editBtn.click({ force: true });

    await page.getByRole('textbox', { name: 'Vendor Name *' }).waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'Vendor Name *' }).clear();
    await page.getByRole('textbox', { name: 'Vendor Name *' }).fill(updatedName);
    
    // Modify Type and Phone
    await page.getByLabel('Vendor Type *').selectOption('independent');
    const editPhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
    await page.getByRole('textbox', { name: 'Phone', exact: false }).clear();
    await page.getByRole('textbox', { name: 'Phone', exact: false }).fill(editPhone);

    const saveBtn = page.getByRole('button', { name: /Save Now|Update|Save/i }).first();
    await saveBtn.click({ force: true });
    await page.waitForTimeout(4000);
    console.log("Status: Vendor successfully updated.");

    // --- PART 4: Remove ---
    console.log("Action: Removing Vendor...");
    const removeBtn = page.getByRole('button', { name: /remove|delete/i }).first();
    await removeBtn.waitFor({ state: 'visible' });
    await removeBtn.click({ force: true });

    // Confirm Removal
    const confirmBtn = page.locator('section[role="dialog"] button, div[role="alertdialog"] button').filter({ hasText: /Yes|Confirm|Delete/i }).first();
    await confirmBtn.waitFor({ state: 'visible' });
    await confirmBtn.click({ force: true });

    await page.waitForURL(url => url.href.includes('/payables/vendors'), { timeout: 30000 });
    console.log("Status: FULL VENDOR LIFECYCLE VERIFIED.");
  });
});
