import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test('verify year switcher selects 2019 in the UI dropdown', async ({ page }) => {
  const app = new AppManager(page);
  await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

  // Debug: log current URL and page title
  console.log(`[DEBUG] URL after login: ${page.url()}`);
  console.log(`[DEBUG] Title: ${await page.title()}`);

  // Wait longer for the app to fully mount
  await page.waitForTimeout(5000);
  console.log(`[DEBUG] URL after wait: ${page.url()}`);

  // Dump all buttons visible on page
  const allBtns = await page.locator('button').allTextContents();
  console.log(`[DEBUG] All buttons: ${JSON.stringify(allBtns.slice(0, 20))}`);

  // Dump page HTML snippet
  const bodyHtml = await page.locator('body').innerHTML();
  console.log(`[DEBUG] Body HTML (first 500): ${bodyHtml.substring(0, 500)}`);

  // Find year button
  const yearBtn = page.locator('button, [role="button"]')
    .filter({ hasText: /^\d{4}$/ })
    .first();

  await yearBtn.waitFor({ state: 'visible', timeout: 15000 });
  const displayedYear = (await yearBtn.textContent())?.trim();
  console.log(`[RESULT] Year button shows: "${displayedYear}"`);

  expect(displayedYear).toBe('2019');
});
