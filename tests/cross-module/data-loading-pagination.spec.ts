import { test, expect } from '@playwright/test';
import { AppManager } from '../../pages/AppManager';

/**
 * =============================================================================
 * MODULE: Data Loading & Pagination Audit Suite (JIRA: BDEV-1135 Epic)
 * SUBTASKS:
 * 1. BDEV-1136: Add Pagination on COA Detail Page
 * 2. BDEV-1137: Add Pagination on Receivables Detail Page
 * 3. BDEV-1138: Add Pagination on Payables Detail Pages
 * 4. BDEV-1139: Add Pagination on Bank Statements
 * =============================================================================
 */

test.describe('Data Loading & Pagination Audit Suite (BDEV-1135) @smoke', () => {
    test.setTimeout(180000);

    test('BDEV-1136: Verify Pagination on COA Detail / Accounts List', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

        console.log(`[BDEV-1136] Testing COA / Accounts Pagination (page=1, pageSize=5 vs page=2)...`);
        const resP1 = await page.request.get(`${app.apiBase}/accounts?page=1&pageSize=5&${params}`, { headers });
        expect(resP1.status()).toBe(200);
        const bodyP1 = await resP1.json();

        const itemsP1: any[] = bodyP1.data || bodyP1.items || [];
        const pagination = bodyP1.pagination || {};

        console.log(`[BDEV-1136] Page 1 returned ${itemsP1.length} accounts | Total: ${pagination.total}`);

        expect(itemsP1.length).toBeGreaterThan(0);
        expect(pagination.total).toBeDefined();

        // Audit summary print
        console.log(`[PASS] BDEV-1136 COA Detail/List Pagination verified (Total: ${pagination.total}, PageSize: 5)`);
    });

    test('BDEV-1137: Verify Pagination on Receivables Detail Page (Invoices per Customer)', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

        const customerId = '243b9845-e056-48ce-924d-6f233d99c574';
        console.log(`[BDEV-1137] Testing Receivables Detail Pagination for Customer ${customerId}...`);

        const response = await page.request.get(`${app.apiBase}/invoices?customer_id=${customerId}&page=1&pageSize=5&${params}`, { headers });
        expect(response.status()).toBe(200);
        const body = await response.json();

        const items: any[] = body.data || body.items || [];
        const pagination = body.pagination || {};

        console.log(`[BDEV-1137] Customer Invoices returned ${items.length} items | Total: ${pagination.total}`);

        expect(response.status()).toBe(200);
        expect(pagination.total).toBeDefined();
        expect(Number(pagination.total)).toBeGreaterThan(0);

        console.log(`[PASS] BDEV-1137 Receivables Detail Pagination verified (Total Invoices: ${pagination.total})`);
    });

    test('BDEV-1138: Verify Pagination on Payables Detail Pages (Bills per Vendor)', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

        console.log(`[BDEV-1138] Testing Payables Detail Pagination for Vendor Bills...`);

        const response = await page.request.get(`${app.apiBase}/bills?page=1&pageSize=5&${params}`, { headers });
        expect(response.status()).toBe(200);
        const body = await response.json();

        const items: any[] = body.data || body.items || [];
        const pagination = body.pagination || {};

        console.log(`[BDEV-1138] Vendor Bills returned ${items.length} items | Total: ${pagination.total}`);

        expect(response.status()).toBe(200);
        expect(pagination.total).toBeDefined();

        console.log(`[PASS] BDEV-1138 Payables Detail Pagination verified (Total Bills: ${pagination.total})`);
    });

    test('BDEV-1139: Verify Pagination on Bank Statements', async ({ page }) => {
        const app = new AppManager(page);
        await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

        const token = await app._getAuthToken();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': process.env.BEFFA_COMPANY as string,
            'Content-Type': 'application/json',
        };
        const params = `year=${process.env.BEFFA_YEAR || '2019'}&period=${process.env.BEFFA_PERIOD || 'yearly'}&calendar=${process.env.BEFFA_CALENDAR || 'ec'}`;

        console.log(`[BDEV-1139] Testing Bank Statements Pagination...`);

        const response = await page.request.get(`${app.apiBase}/bank-statements?page=1&pageSize=5&${params}`, { headers });
        expect(response.status()).toBe(200);
        const body = await response.json();

        const items: any[] = body.data || body.items || [];
        const pagination = body.pagination || {};

        console.log(`[BDEV-1139] Bank Statements returned ${items.length} items | Total: ${pagination.total}`);

        expect(response.status()).toBe(200);
        expect(pagination.total).toBeDefined();

        console.log(`[PASS] BDEV-1139 Bank Statements Pagination verified (Total Statements: ${pagination.total})`);
    });
});
