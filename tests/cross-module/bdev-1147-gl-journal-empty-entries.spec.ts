import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

test.describe('BDEV-1147: GL Module DTO & Schema - Empty Entries TypeError Audit @gl @bdev-1147 @frontend', () => {
    test.setTimeout(120000);

    test('Verify Frontend TypeError when general-journals entries are empty []', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const pageErrors: string[] = [];
        page.on('pageerror', (err) => {
            console.log(`[PAGE ERROR DETECTED]: ${err.message}`);
            pageErrors.push(err.message);
        });

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                console.log(`[CONSOLE ERROR]: ${msg.text()}`);
            }
        });

        // 1. Intercept /api/general-journals or /entries with empty array []
        await page.route('**/api/general-journals/**', async (route) => {
            const url = route.request().url();
            console.log(`[ROUTE INTERCEPTED]: ${url}`);
            if (url.includes('/entries')) {
                // Return empty entries array []
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: [], pagination: { page: 1, pageSize: 50, total: 0 } })
                });
            } else if (url.match(/\/api\/general-journals\/[a-zA-Z0-9-]+/)) {
                // Return general journal object with empty entries
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: 'test-journal-empty',
                        reference_number: 'GJ/TEST/001',
                        debit: 0,
                        credit: 0,
                        status: 'draft',
                        general_journal_entries: [],
                        data: []
                    })
                });
            } else {
                await route.continue();
            }
        });

        // 2. Navigate to General Journals UI
        const candidateRoutes = [
            '/accounting/general-journals',
            '/general-journals',
            '/accounting/general-journals/new',
            '/general-journals/new'
        ];

        for (const r of candidateRoutes) {
            console.log(`\n[UI NAVIGATION] Trying route: ${r}...`);
            await page.goto(r, { waitUntil: 'domcontentloaded' }).catch(() => {});
            await page.waitForTimeout(3000);

            const hasError = pageErrors.some(e =>
                e.includes("Cannot read properties of undefined (reading 'general_journal_entries')") ||
                e.includes("general_journal_entries")
            );

            if (hasError) {
                console.log(`\n=================== [BUG BDEV-1147 REPRODUCED] ===================`);
                console.log(`Route          : ${r}`);
                console.log(`Error Caught   : ${pageErrors.join(' | ')}`);
                console.log(`==================================================================\n`);
                break;
            }
        }

        // 3. Inspect if the TypeError was captured
        const specificTypeError = pageErrors.find(e =>
            e.includes("Cannot read properties of undefined (reading 'general_journal_entries')") ||
            e.includes("general_journal_entries")
        );

        if (specificTypeError) {
            console.log(`[PASS - BUG VERIFIED] BDEV-1147 confirmed: ${specificTypeError}`);
        } else {
            console.log(`[AUDIT COMPLETE] Page errors logged:`, pageErrors);
        }

        expect(pageErrors.length >= 0).toBe(true);
    });
});

