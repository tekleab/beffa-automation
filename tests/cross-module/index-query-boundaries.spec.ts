import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

interface IndexTarget {
    name: string;
    route: string;
    apiPattern: string;
}

const INDEX_PAGES: IndexTarget[] = [
    { name: 'Invoices', route: '/receivables/invoices', apiPattern: '**/api/invoices*' },
    { name: 'Receipts', route: '/receivables/receipts', apiPattern: '**/api/receipts*' },
    { name: 'Sales Orders', route: '/receivables/sales-orders', apiPattern: '**/api/sales-orders*' },
    { name: 'Customers', route: '/receivables/customers', apiPattern: '**/api/customers*' },
    { name: 'Bills', route: '/payables/bills', apiPattern: '**/api/bills*' },
    { name: 'Payments', route: '/payables/payments', apiPattern: '**/api/payments*' },
    { name: 'Purchase Orders', route: '/payables/purchase-orders', apiPattern: '**/api/purchase-orders*' },
    { name: 'Vendors', route: '/payables/vendors', apiPattern: '**/api/vendors*' },
];

test.describe('Query Boundary Audit: Core Index Pages @cross-module @regression', () => {
    test.setTimeout(240000);

    test.beforeEach(async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    });

    for (const target of INDEX_PAGES) {
        test(`[INDEX BOUNDARY] ${target.name}: Data Resolution & Loading State`, async ({ page }) => {
            console.log(`\nAuditing Data Resolution & Loading for ${target.name} (${target.route})...`);
            
            let loadingDetected = false;
            const loadingSelectors = ['.chakra-spinner', '[role="progressbar"]', '[class*="skeleton" i]', '[class*="spinner" i]', '[class*="loader" i]'];

            // Navigate to index route
            await page.goto(target.route, { waitUntil: 'domcontentloaded', timeout: 30000 });

            for (const sel of loadingSelectors) {
                if (await page.locator(sel).first().isVisible({ timeout: 1500 }).catch(() => false)) {
                    loadingDetected = true;
                    break;
                }
            }

            await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
            await page.waitForTimeout(1000);

            const bodyText = await page.innerText('body').catch(() => '');
            const tableRows = await page.locator('table tbody tr').count().catch(() => 0);
            const hasGridOrTable = await page.locator('table, [role="table"], [role="grid"]').first().isVisible({ timeout: 3000 }).catch(() => false);
            const isResolved = bodyText.length > 50 && (tableRows > 0 || hasGridOrTable || bodyText.includes('Search') || bodyText.includes('New'));

            console.log(`[AUDIT] ${target.name} Data Resolved: ${isResolved} | Rows: ${tableRows} | Loading Indicator: ${loadingDetected ? 'Observed' : 'Fast cache'}`);
            expect(isResolved, `${target.name} index page must resolve table or controls without blank screen`).toBe(true);
        });

        test(`[INDEX BOUNDARY] ${target.name}: Error Boundary State (API 500 Failure)`, async ({ page }) => {
            console.log(`\nAuditing Error Boundary for ${target.name} (${target.route})...`);

            // Intercept target query and simulate server 500 error
            await page.route(target.apiPattern, route => route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ code: 500, message: 'Internal Server Error' })
            }));

            await page.goto(target.route, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000);

            const bodyText = await page.innerText('body').catch(() => '');
            const hasAlert = await page.locator('[role="alert"], .chakra-alert, [class*="alert" i]').first().isVisible({ timeout: 2000 }).catch(() => false);
            const hasErrorText = /error|failed|something went wrong|unable to load|try again|500/i.test(bodyText);
            const pageCrashed = bodyText.trim().length === 0;

            console.log(`[AUDIT] ${target.name} Error Boundary: Alert: ${hasAlert} | Error Text: ${hasErrorText} | Crashed Blank: ${pageCrashed}`);
            expect(pageCrashed, `${target.name} page must not crash into a blank white screen on API 500`).toBe(false);
        });

        test(`[INDEX BOUNDARY] ${target.name}: Empty State Boundary (0 Records)`, async ({ page }) => {
            console.log(`\nAuditing Empty State for ${target.name} (${target.route})...`);

            // Intercept target query and return empty data
            await page.route(target.apiPattern, route => route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: [], items: [], pagination: { total: 0 } })
            }));

            await page.goto(target.route, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000);

            const bodyText = await page.innerText('body').catch(() => '');
            const tableRows = await page.locator('table tbody tr').count().catch(() => 0);
            const hasEmptyNotice = /no record|no data|empty|no items|create your first|not found|0 of 0/i.test(bodyText);
            const isEmptyHandled = (hasEmptyNotice || tableRows === 0) && bodyText.length > 50;

            console.log(`[AUDIT] ${target.name} Empty State Handled: ${isEmptyHandled} | Notice Present: ${hasEmptyNotice} | Rows Count: ${tableRows}`);
            expect(isEmptyHandled, `${target.name} page must handle empty record list gracefully`).toBe(true);
        });
    }
});

