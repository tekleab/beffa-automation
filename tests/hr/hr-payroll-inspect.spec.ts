import { test } from '@playwright/test';

test('inspect payroll run page', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(process.env.BASE_URL || 'http://168.119.175.142:4173');
  await page.getByRole('textbox', { name: 'Email *' }).fill(process.env.BEFFA_USER || '');
  await page.getByRole('textbox', { name: 'Password *' }).fill(process.env.BEFFA_PASS || '');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  await page.goto('/payrolls/payroll-runs');
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);

  const firstRow = page.locator('table tbody tr').first();
  if (await firstRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await firstRow.click();
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
  }

  const url = page.url();
  console.log('DETAIL URL:', url);
  if (!url.includes('review')) {
    await page.goto(url + '/review/hours');
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
  }

  const trHTML = await page.locator('table tbody tr').first().innerHTML().catch(() => 'NO ROW');
  console.log('TR_HTML:', trHTML.substring(0, 2000));

  const btns = await page.locator('button').allInnerTexts();
  console.log('BUTTONS:', JSON.stringify(btns));
});
