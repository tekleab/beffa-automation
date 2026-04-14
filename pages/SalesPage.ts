import { BasePage } from '../lib/BasePage';
import { Page } from '@playwright/test';

export class SalesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async captureRandomCustomerDetails(): Promise<{ customerName: string; customerId: string | undefined }> {
    await this.page.goto('/receivables/customers/?page=1&pageSize=30', { waitUntil: 'networkidle' });
    const rows = this.page.locator('table tbody tr');
    await rows.first().waitFor({ state: 'visible', timeout: 30000 });
    const count = await rows.count();
    const targetRow = rows.nth(Math.floor(Math.random() * Math.min(count, 15)));

    const nameLink = targetRow.locator('td a').first();
    const customerName = (await nameLink.innerText()).trim();
    const href = await nameLink.getAttribute('href');
    const customerId = href?.match(/\/receivables\/customers\/([a-f0-9-]+)/)?.[1];

    console.log(`[DATA] Captured Customer: "${customerName}" (ID: ${customerId})`);
    return { customerName, customerId };
  }

  async captureSODetailData(): Promise<Record<string, string>> {
    const data: Record<string, string> = {};
    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      const key = (await cells.nth(0).innerText().catch(() => '')).trim();
      const value = (await cells.nth(1).innerText().catch(() => '')).trim();
      if (key) data[key] = value;
    }
    return data;
  }

  async findApprovedUnpaidInvoice(): Promise<{ customerName: string; invoiceId: string } | null> {
    console.log("[ACTION] Scanning for an approved, unpaid invoice (Net Due > 0)...");
    await this.page.goto('/receivables/invoices/?page=1&pageSize=30');
    await this.page.waitForSelector('table tbody tr', { timeout: 30000 });
    await this.page.waitForTimeout(3000);

    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');

      const invId = (await cells.nth(1).innerText().catch(() => '')).trim();
      const customer = (await cells.nth(2).innerText().catch(() => '')).trim();
      const paid = (await cells.nth(5).innerText().catch(() => '')).trim().toLowerCase();
      const netDueRaw = (await cells.nth(6).innerText().catch(() => '')).trim();
      const status = (await cells.nth(7).innerText().catch(() => '')).trim().toLowerCase();
      const netDue = parseFloat(netDueRaw.replace(/[^\d.]/g, '')) || 0;

      if (paid === 'no' && netDue > 0 && status === 'approved') {
        console.log(`[SUCCESS] Found unpaid customer match: "${customer}" (Invoice: ${invId})`);
        return { customerName: customer, invoiceId: invId };
      }
    }
    return null;
  }

  async handleSOReleasedTab(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: /Released/i });
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
    await this.page.waitForTimeout(2000);
  }
}
