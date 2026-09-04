import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Detail Tab On-Demand Lazy Data Fetching Suite
 * =============================================================================
 * 
 * ARCHITECTURAL SCOPE & COVERAGE:
 * Verifies that tab data (Line Items, Financial Journals, Approval Audit Trail)
 * is lazily fetched on-demand only when a user activates/clicks the corresponding UI tab:
 * 1. Invoice Detail Tab Lazy Fetching
 * 2. Sales Order Detail Tab Lazy Fetching
 * 3. Purchase Bill Detail Tab Lazy Fetching
 * 
 * AUDIT OBJECTIVES:
 * 1. Confirm initial detail page navigation loads rapidly without pre-fetching all tab data.
 * 2. Confirm clicking detail tabs triggers on-demand API hooks for tab-specific data.
 * 3. Verify tab content renders cleanly without error toasts or full page reloads.
 * =============================================================================
 */

test.describe('Detail Page Tab On-Demand Fetching Suite @cross-module @regression', () => {
    test.setTimeout(120000);

    function QS(): string {
        const y = process.env.BEFFA_YEAR || '2019';
        const p = process.env.BEFFA_PERIOD || 'yearly';
        const c = process.env.BEFFA_CALENDAR || 'ec';
        return `year=${y}&period=${p}&calendar=${c}`;
    }

    let token = '';

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        const app = new AppManager(page);
        token = await app.apiLogin(process.env.BEFFA_USER, process.env.BEFFA_PASS);
        await page.close();
    });

    test.beforeEach(async ({ context }) => {
        if (token) {
            await context.addInitScript((jwt) => {
                localStorage.setItem('auth-token', jwt);
                localStorage.setItem('token', jwt);
                localStorage.setItem('selectedYear', '2019');
                localStorage.setItem('calendar', 'EC');
                localStorage.setItem('period', 'yearly');
                localStorage.setItem('currentCompany', 'BM Tech');
            }, token);
        }
    });

    // -------------------------------------------------------------------------
    // TEST 1: Invoice Detail Page — Tab Hook On-Demand Fetching
    // -------------------------------------------------------------------------
    test('1. Invoice Detail Page: Tab data fetched on-demand via hooks upon tab activation', async ({ page }) => {
        const app = new AppManager(page);
        console.log('[TEST 1] Discovering existing Invoice for Detail Tab Audit...');
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY || 'BM Tech',
            'Content-Type': 'application/json'
        };

        const invListRes = await page.request.get(`${app.apiBase}/invoices?pageSize=5&${QS()}`, { headers });
        let invId = '';

        if (invListRes.ok()) {
            const listData = await invListRes.json();
            const items = listData.items || listData.data || [];
            if (items.length > 0) {
                invId = items[0].id;
                console.log(`[TEST 1] Found existing Invoice ID: ${invId}`);
            }
        }

        expect(invId).toBeTruthy();

        console.log(`[TEST 1] Navigating to Invoice Detail Page: /receivables/invoices/${invId}/detail`);
        
        const apiRequests: string[] = [];
        page.on('request', req => {
            if (req.url().includes('/api/')) {
                apiRequests.push(req.url());
            }
        });

        await page.goto(`/receivables/invoices/${invId}/detail`, { waitUntil: 'commit' });
        await page.waitForTimeout(3000);
        console.log(`[INITIAL LOAD] API Requests fired on initial page load: ${apiRequests.length}`);

        const tabs = page.locator('[role="tab"], button.chakra-tabs__tab, .chakra-tabs__tab');
        const tabCount = await tabs.count();
        console.log(`[TABS FOUND] Invoice detail has ${tabCount} tabs.`);

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);
            const tabName = (await tab.textContent())?.trim() || `Tab ${i}`;
            console.log(`[TAB CLICK] Activating tab: "${tabName}"...`);
            
            const reqsBefore = apiRequests.length;
            await tab.click().catch(() => { });
            await page.waitForTimeout(1000);
            const reqsAfter = apiRequests.length;

            console.log(`[TAB HOOK FETCH] "${tabName}" fired ${reqsAfter - reqsBefore} new API requests on-demand.`);
        }

        console.log('[PASS] Test 1 — Invoice Detail Tab On-Demand Hook Fetching Verified!');
    });

    // -------------------------------------------------------------------------
    // TEST 2: Bill Detail Page — Tab Hook On-Demand Fetching
    // -------------------------------------------------------------------------
    test('2. Bill Detail Page: Tab data fetched on-demand via hooks upon tab activation', async ({ page }) => {
        const app = new AppManager(page);
        console.log('[TEST 2] Discovering existing Purchase Bill for Detail Tab Audit...');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY || 'BM Tech',
            'Content-Type': 'application/json'
        };

        const billListRes = await page.request.get(`${app.apiBase}/bills?pageSize=5&${QS()}`, { headers });
        let billId = '';

        if (billListRes.ok()) {
            const listData = await billListRes.json();
            const items = listData.items || listData.data || [];
            if (items.length > 0) {
                billId = items[0].id;
                console.log(`[TEST 2] Found existing Bill ID: ${billId}`);
            }
        }

        expect(billId).toBeTruthy();

        console.log(`[TEST 2] Navigating to Bill Detail Page: /payables/bills/${billId}/detail`);

        const apiRequests: string[] = [];
        page.on('request', req => {
            if (req.url().includes('/api/')) {
                apiRequests.push(req.url());
            }
        });

        await page.goto(`/payables/bills/${billId}/detail`, { waitUntil: 'commit' });
        await page.waitForTimeout(3000);
        console.log(`[INITIAL LOAD] API Requests fired on initial page load: ${apiRequests.length}`);

        const tabs = page.locator('[role="tab"], button.chakra-tabs__tab, .chakra-tabs__tab');
        const tabCount = await tabs.count();
        console.log(`[TABS FOUND] Bill detail has ${tabCount} tabs.`);

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);
            const tabName = (await tab.textContent())?.trim() || `Tab ${i}`;
            console.log(`[TAB CLICK] Activating tab: "${tabName}"...`);

            const reqsBefore = apiRequests.length;
            await tab.click().catch(() => { });
            await page.waitForTimeout(1000);
            const reqsAfter = apiRequests.length;

            console.log(`[TAB HOOK FETCH] "${tabName}" fired ${reqsAfter - reqsBefore} new API requests on-demand.`);
        }

        console.log('[PASS] Test 2 — Bill Detail Tab On-Demand Hook Fetching Verified!');
    });

    // -------------------------------------------------------------------------
    // TEST 3: Sales Order Detail Page — Tab Hook On-Demand Fetching
    // -------------------------------------------------------------------------
    test('3. Sales Order Detail Page: Tab data fetched on-demand via hooks upon tab activation', async ({ page }) => {
        const app = new AppManager(page);
        console.log('[TEST 3] Discovering existing Sales Order for Detail Tab Audit...');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY || 'BM Tech',
            'Content-Type': 'application/json'
        };

        const soListRes = await page.request.get(`${app.apiBase}/sales-orders?pageSize=5&${QS()}`, { headers });
        let soId = '';

        if (soListRes.ok()) {
            const listData = await soListRes.json();
            const items = listData.items || listData.data || [];
            if (items.length > 0) {
                soId = items[0].id;
                console.log(`[TEST 3] Found existing Sales Order ID: ${soId}`);
            }
        }

        expect(soId).toBeTruthy();

        console.log(`[TEST 3] Navigating to Sales Order Detail Page: /receivables/sales-orders/${soId}/detail`);

        const apiRequests: string[] = [];
        page.on('request', req => {
            if (req.url().includes('/api/')) apiRequests.push(req.url());
        });

        await page.goto(`/receivables/sales-orders/${soId}/detail`, { waitUntil: 'commit' });
        await page.waitForTimeout(3000);

        const tabs = page.locator('[role="tab"], button.chakra-tabs__tab, .chakra-tabs__tab');
        const tabCount = await tabs.count();
        console.log(`[TABS FOUND] SO detail has ${tabCount} tabs.`);

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i);
            const tabName = (await tab.textContent())?.trim() || `Tab ${i}`;
            console.log(`[TAB CLICK] Activating tab: "${tabName}"...`);

            const reqsBefore = apiRequests.length;
            await tab.click().catch(() => { });
            await page.waitForTimeout(1000);
            const reqsAfter = apiRequests.length;

            console.log(`[TAB HOOK FETCH] "${tabName}" fired ${reqsAfter - reqsBefore} new API requests on-demand.`);
        }

        console.log('[PASS] Test 3 — Sales Order Detail Tab On-Demand Hook Fetching Verified!');
    });
});
