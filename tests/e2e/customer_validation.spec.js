const { test, expect } = require('@playwright/test');
const { AppManager } = require('../../pages/appManager');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const addressData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/address_locations.json'), 'utf8')
);

test('Customer Validation: TIN and Phone Edge Cases', async ({ page }) => {
  test.setTimeout(120000);
  const app = new AppManager(page);

  await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

  const createBtn = page.getByRole('button', { name: /create customer/i });
  const rRegion = addressData[0];

  // --- Scenario 1: Short TIN Validation ---
  console.log("Validation Check: Short TIN Input...");

  await page.goto('/receivables/customers/new');

  await page.getByRole('textbox', { name: 'Customer Name *' }).fill("TIN Short Test");
  await page.getByLabel('Customer Type *').selectOption('individual');
  await page.getByRole('textbox', { name: 'Customer TIN *' }).fill("12345");
  await app.mainPhoneInput.fill("0911223344");

  const randomRegion1 = addressData[Math.floor(Math.random() * addressData.length)];
  const randomZone1 = randomRegion1.zones[Math.floor(Math.random() * randomRegion1.zones.length)];
  const randomWoreda1 = randomZone1.woredas[Math.floor(Math.random() * randomZone1.woredas.length)];

  await app.fillEthiopianAddress(
    randomRegion1.region,
    randomZone1.name,
    randomWoreda1
  );

  await createBtn.click();

  await expect(
    page.getByText(/10 digit|must be 10/i)
  ).toBeVisible();

  console.log("Validation Passed: System blocked short TIN correctly.");

  // --- Scenario 2: Invalid Phone Validation ---
  console.log("Validation Check: Invalid Phone Input (3 digits)...");

  await page.reload();

  // refill required fields after reload
  await page.getByRole('textbox', { name: 'Customer Name *' }).fill("Phone Invalid Test");
  await page.getByLabel('Customer Type *').selectOption('individual');

  await page.getByRole('textbox', { name: 'Customer TIN *' }).fill("9876543210");
  await app.mainPhoneInput.fill("123");

  const randomRegion2 = addressData[Math.floor(Math.random() * addressData.length)];
  const randomZone2 = randomRegion2.zones[Math.floor(Math.random() * randomRegion2.zones.length)];
  const randomWoreda2 = randomZone2.woredas[Math.floor(Math.random() * randomZone2.woredas.length)];

  await app.fillEthiopianAddress(
    randomRegion2.region,
    randomZone2.name,
    randomWoreda2
  );

  // check button state first
  await expect(createBtn).toBeDisabled();

  // if UI allows click anyway
  if (await createBtn.isEnabled()) {
    await createBtn.click();

    await expect(
      page.getByText(/invalid phone|must be 10 digit/i)
    ).toBeVisible();
  }

  console.log("Validation Passed: Invalid phone correctly rejected.");
});