import { test } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test('capture customer form fields', async ({ page }) => {
    const app = new AppManager(page);
    await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    await page.goto('/receivables/customers/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const fields = await page.evaluate(() =>
        [...document.querySelectorAll('input, select, textarea')].map(el => ({
            tag: el.tagName,
            type: (el as HTMLInputElement).type || null,
            name: el.getAttribute('name'),
            id: el.getAttribute('id'),
            placeholder: el.getAttribute('placeholder'),
            label: document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim() || null
        }))
    );

    console.table(fields);
});
