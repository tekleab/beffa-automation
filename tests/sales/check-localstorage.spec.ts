import { test } from '@playwright/test';

test('dump localStorage after real UI login', async ({ page }) => {
  // Override navigation timeout for this test
  page.setDefaultNavigationTimeout(10000);
  page.setDefaultTimeout(60000);

  await page.goto('/users/login', { waitUntil: 'commit', timeout: 10000 }).catch(() => {});
  // Wait for JS bundle to download and execute (8MB bundle on remote server)
  await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
  await page.waitForSelector('input[type="email"], input[placeholder*="email" i]', { timeout: 30000 });
  await page.fill('input[type="email"], input[placeholder*="email" i]', 'admin@beffa.com');
  await page.fill('input[type="password"]', 'Beff.$#!');
  await page.click('button:has-text("Login")');
  // Wait for redirect away from login
  await page.waitForURL(url => !url.href.includes('/users/login'), { timeout: 30000 });
  // Wait for app to finish loading (spinner disappears = company button appears)
  await page.waitForSelector('button.chakra-menu__menu-button', { timeout: 30000 });

  const ls = await page.evaluate(() => {
    const r: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      r[k] = localStorage.getItem(k)!;
    }
    return r;
  });
  console.log('[LS DUMP]', JSON.stringify(ls, null, 2));
  console.log('[URL]', page.url());
});
