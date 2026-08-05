import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

const API = () => (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
    .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001') + '/api';
const QS = () => `year=${process.env.BEFFA_YEAR || '2018'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

async function apiLogin(request: any): Promise<string> {
    const r = await request.post(`${API()}/users/login?${QS()}&month=6`, {
        data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
        headers: { 'Content-Type': 'application/json' }
    });
    const token = (await r.json()).auth_token;
    if (!token) throw new Error('apiLogin failed');
    return token;
}


test('verify year switcher selects 2019 in the UI dropdown', async ({ page , request }) => {
  const app = new AppManager(page);
  await apiLogin(request);

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
