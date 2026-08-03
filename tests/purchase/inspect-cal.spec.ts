import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test('inspect calendar @purchase', async ({ page }) => {
  const a = new AppManager(page);
  await a.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
  await page.goto('/payables/purchase-orders/new', { waitUntil: 'commit', timeout: 90000 });
  
  const container = page.locator('.chakra-form-control, [role="group"], .flex-col, div')
    .filter({ has: page.getByText(/^Purchase Order Date\s*\*?$/i) })
    .filter({ has: page.locator('button') }).last();
  await container.locator('button').first().click({ force: true });
  await page.waitForTimeout(1500);
  
  const popover = page.locator('[role="dialog"], [data-slot="popover-content"], [id^="radix-"], .chakra-popover__content').filter({ visible: true }).last();
  const buttons = popover.locator('button');
  const count = await buttons.count();
  console.log(`Total buttons: ${count}`);
  for (let i = 0; i < Math.min(count, 8); i++) {
    const btn = buttons.nth(i);
    const text = (await btn.textContent())?.trim();
    const ariaLabel = await btn.getAttribute('aria-label');
    const cls = await btn.getAttribute('class');
    console.log(`BTN[${i}] text="${text}" aria-label="${ariaLabel}" class="${cls?.substring(0,80)}"`);
  }
});
