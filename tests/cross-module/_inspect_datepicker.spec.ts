import { test } from '@playwright/test';

test('inspect SO date picker DOM', async ({ page }) => {
  await page.goto('/receivables/sale-orders/new', { waitUntil: 'commit' });
  // Wait for any button to appear (form rendered)
  await page.locator('button').first().waitFor({ state: 'visible', timeout: 60000 });
  await page.waitForTimeout(3000);

  const html = await page.evaluate(() => {
    // Dump all text nodes containing 'date' or 'Date'
    const results: string[] = [];
    const all = Array.from(document.querySelectorAll('label, span, p, div')) as HTMLElement[];
    for (const el of all) {
      const txt = el.innerText?.trim() || '';
      if (/sale.?order.?date/i.test(txt) && txt.length < 100) {
        results.push('TEXT: ' + txt + ' | TAG: ' + el.tagName + ' | CLASS: ' + el.className.substring(0, 80));
        results.push('PARENT HTML: ' + (el.parentElement?.outerHTML || '').substring(0, 500));
        break;
      }
    }
    if (results.length === 0) {
      // Dump all visible text to see what's on the page
      const body = document.body.innerText.substring(0, 1000);
      results.push('PAGE TEXT: ' + body);
    }
    return results.join('\n---\n');
  });
  console.log('DOM:\n', html);
});
