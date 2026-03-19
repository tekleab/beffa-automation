const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const addressData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/address_locations.json'), 'utf8'));

test('Full Customer CRUD Cycle', async ({ page }) => {
  test.setTimeout(480000);
  const app = new AppManager(page);

  const fixedTIN = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const fixedPhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
  const customerName = `Kebede-${Math.floor(Math.random() * 10000)}`;
  const updatedName = `${customerName}-Updated`;

  await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

  // --- Step 1: Create ---
  const randomRegion = addressData[Math.floor(Math.random() * addressData.length)];
  const randomZone = randomRegion.zones[Math.floor(Math.random() * randomRegion.zones.length)];
  const randomWoreda = randomZone.woredas[Math.floor(Math.random() * randomZone.woredas.length)];

  await page.goto('/receivables/customers/new');
  await page.getByRole('textbox', { name: 'Customer Name *' }).fill(customerName);
  await page.getByLabel('Customer Type *').selectOption('individual');
  await page.getByRole('textbox', { name: 'Customer TIN *' }).fill(fixedTIN);
  await app.mainPhoneInput.fill(fixedPhone);
  await app.fillEthiopianAddress(randomRegion.region, randomZone.name, randomWoreda);

  const createBtn = page.locator('button:has-text("Create customer"), button:has-text("Adding Customer")');
  await createBtn.click();
  await page.waitForURL(url => url.href.includes('/detail'), { timeout: 60000 });
  console.log("✅ Created.");

  // --- Step 2: Edit ---
  const editBtn = page.locator('button:has-text("Edit")').first();
  await editBtn.waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(3000);
  await editBtn.click({ force: true });

  await page.getByRole('textbox', { name: 'Customer Name *' }).waitFor({ state: 'visible' });
  await page.getByRole('textbox', { name: 'Customer Name *' }).clear();
  await page.getByRole('textbox', { name: 'Customer Name *' }).fill(updatedName);

  const saveBtn = page.locator('button:has-text("Save"), button:has-text("Update")').first();
  await saveBtn.click({ force: true });
  await page.waitForTimeout(4000);
  console.log("✅ Updated.");

  // --- Step 3: Remove ---
  const removeBtn = page.locator('button:has-text("Remove")');
  await removeBtn.waitFor({ state: 'visible' });
  await removeBtn.evaluate(el => el.style.border = '3px solid red');
  await page.waitForTimeout(2000);
  await removeBtn.click({ force: true });

  // Confirm Removal
  await page.waitForTimeout(5000);
  const confirmBtn = page.locator('section[role="dialog"] button:has-text("Yes"), button:has-text("Confirm")').first();
  await confirmBtn.evaluate(el => el.style.border = '4px solid green');
  await page.waitForTimeout(2000);
  await confirmBtn.click({ force: true });

  await page.waitForURL(url => url.href.includes('/receivables/customers'), { timeout: 30000 });
  console.log("🚀 CRUD COMPLETE!");
});