import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { chromium, Browser, Page, BrowserContext } from '@playwright/test';

// Trigger dynamic CI/CD workflow execution
// ─────────────────────────────────────────────────────────────────────────────
// Utility: lightweight HTTP GET with a timeout (no external deps)
// ─────────────────────────────────────────────────────────────────────────────
function httpPing(url: string, timeoutMs = 8000): Promise<number> {
    return new Promise((resolve) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, (res) => resolve(res.statusCode || 0));
        req.setTimeout(timeoutMs, () => { req.destroy(); resolve(0); });
        req.on('error', () => resolve(0));
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: HTTP POST with JSON body
// ─────────────────────────────────────────────────────────────────────────────
function httpPost(url: string, data: any, headers: any = {}, timeoutMs = 10000): Promise<{ status: number; body?: any }> {
    return new Promise((resolve) => {
        const lib = url.startsWith('https') ? https : http;
        const postData = JSON.stringify(data);
        const options: any = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                ...headers
            },
            timeout: timeoutMs
        };
        const req = lib.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode || 0, body: body ? JSON.parse(body) : null });
                } catch {
                    resolve({ status: res.statusCode || 0, body: null });
                }
            });
        });
        req.on('error', () => resolve({ status: 0, body: null }));
        req.setTimeout(timeoutMs, () => { req.destroy(); resolve({ status: 0, body: null }); });
        req.write(postData);
        req.end();
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Check if environment is clean (no data)
// ─────────────────────────────────────────────────────────────────────────────
async function isEnvironmentClean(apiUrl: string, company: string): Promise<boolean> {
    try {
        const loginUrl = `${apiUrl}/api/users/login?year=2018&period=yearly&calendar=ec&month=6`;
        const loginRes = await httpPost(loginUrl, {
            email: process.env.BEFFA_USER,
            password: process.env.BEFFA_PASS
        });
        if (![200, 201].includes(loginRes.status) || !loginRes.body?.auth_token) {
            console.log(`[SEED] ⚠ Could not login to check environment (status=${loginRes.status} user=${process.env.BEFFA_USER})`);
            return false;
        }
        const token = loginRes.body.auth_token;

        // Check account count — Seed Basic Data populates 100 accounts.
        // If < 10 accounts exist, basic data has not been seeded yet.
        const checkUrl = `${apiUrl}/api/accounts?page=1&pageSize=1&year=2018&period=yearly&calendar=ec`;
        const res = await new Promise<{ status: number; body: any }>((resolve) => {
            const lib = checkUrl.startsWith('https') ? https : http;
            const req = lib.get(checkUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-company': company
                }
            }, (r) => {
                let body = '';
                r.on('data', (c) => body += c);
                r.on('end', () => {
                    try { resolve({ status: r.statusCode || 0, body: JSON.parse(body) }); }
                    catch { resolve({ status: r.statusCode || 0, body: null }); }
                });
            });
            req.on('error', () => resolve({ status: 0, body: null }));
        });

        if (res.status !== 200 || !res.body) return false;
        const count = res.body.total ?? res.body.count ?? (res.body.items || res.body.data || []).length;
        const isClean = Number(count) < 10;
        console.log(`[SEED] Chart of Accounts count: ${count} → ${isClean ? 'not seeded (needs seeding)' : 'already seeded'}`);
        return isClean;
    } catch (error) {
        console.log('[SEED] ⚠ Error checking environment:', error);
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed demo data via data-seeding page
// ─────────────────────────────────────────────────────────────────────────────
async function seedDemoData(frontendUrl: string, company: string): Promise<boolean> {
    let browser: Browser | null = null;
    let context: BrowserContext | null = null;
    let page: Page | null = null;

    try {
        console.log('[SEED] Starting data seeding process...');
        browser = await chromium.launch({ headless: true });
        context = await browser.newContext();
        page = await context.newPage();

        // Login via API to get token, then inject into localStorage
        const loginUrl = `${frontendUrl.replace(':4173', ':8001')}/api/users/login?year=2018&period=yearly&calendar=ec&month=6`;
        const loginRes = await httpPost(loginUrl, {
            email: process.env.BEFFA_USER,
            password: process.env.BEFFA_PASS
        });
        if (![200, 201].includes(loginRes.status) || !loginRes.body?.auth_token) {
            console.log('[SEED] ⚠ Login failed during seeding');
            return false;
        }
        const token = loginRes.body.auth_token;

        // Get company ID from API
        const apiBase = frontendUrl.replace(':4173', ':8001') + '/api';
        const companyRes = await new Promise<{ status: number; body: any }>((resolve) => {
            const url = `${apiBase}/companies?page=1&pageSize=10`;
            const lib = url.startsWith('https') ? https : http;
            const req = lib.get(url, {
                headers: { 'Authorization': `Bearer ${token}`, 'x-company': company }
            }, (r) => {
                let body = '';
                r.on('data', (c) => body += c);
                r.on('end', () => {
                    try { resolve({ status: r.statusCode || 0, body: JSON.parse(body) }); }
                    catch { resolve({ status: r.statusCode || 0, body: null }); }
                });
            });
            req.on('error', () => resolve({ status: 0, body: null }));
        });

        const companies = companyRes.body?.items || companyRes.body?.data || [];
        const found = companies.find((c: any) =>
            c.name?.toLowerCase() === company.toLowerCase()
        ) || companies[0];

        if (!found?.id) {
            console.log('[SEED] ⚠ Could not resolve company ID');
            return false;
        }
        const companyId = found.id;
        console.log(`[SEED] Company ID: ${companyId}`);

        // Navigate to data-seeding page with injected session
        await page.goto(frontendUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.evaluate(({ jwt, comp }: { jwt: string; comp: string }) => {
            localStorage.setItem('auth-token', jwt);
            localStorage.setItem('token', jwt);
            localStorage.setItem('selectedYear', '2018');
            localStorage.setItem('calendar', 'EC');
            localStorage.setItem('period', 'yearly');
            localStorage.setItem('selected-role', 'IT Administrator / User Manager');
            localStorage.setItem('currentCompany', comp);
        }, { jwt: token, comp: company });

        const seedUrl = `${frontendUrl}/company/${companyId}/data-seeding`;
        console.log(`[SEED] Navigating to: ${seedUrl}`);
        await page.goto(seedUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);

        // Click each button ONLY if it is enabled (not disabled)
        // Disabled = already seeded; Enabled = needs to be clicked
        const seedButtons = ['Seed Basic Data', 'Seed Demo Data'];
        let anySeedDone = false;

        for (const btnText of seedButtons) {
            const btn = page.getByRole('button', { name: new RegExp(btnText, 'i') }).first();
            if (!await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log(`[SEED] ⚠ Button not found: "${btnText}"`);
                continue;
            }
            const isDisabled = await btn.isDisabled().catch(() => true);
            if (isDisabled) {
                console.log(`[SEED] ✓ "${btnText}" is disabled → already seeded, skipping`);
                continue;
            }
            console.log(`[SEED] Clicking: "${btnText}"...`);
            await btn.click();
            // Wait for button to become disabled (seeding complete) or timeout after 30s
            await btn.waitFor({ state: 'attached' });
            for (let i = 0; i < 15; i++) {
                const done = await btn.isDisabled().catch(() => false);
                if (done) break;
                await page.waitForTimeout(2000);
            }
            console.log(`[SEED] ✓ "${btnText}" seeding complete`);
            anySeedDone = true;
        }

        if (!anySeedDone) {
            console.log('[SEED] ✓ All seed buttons were already disabled — data was seeded previously');
        }
        return true;
    } catch (error) {
        console.log('[SEED] ❌ Error during data seeding:', error);
        return false;
    } finally {
        if (page) await page.close().catch(() => {});
        if (context) await context.close().catch(() => {});
        if (browser) await browser.close().catch(() => {});
    }
}

async function globalSetup() {
    const root = process.cwd();

    // ── 0. Pre-flight: validate required secrets ──────────────────────────────
    console.log('[SETUP] ── Pre-flight checks ──────────────────────────────');

    const missingSecrets: string[] = [];
    for (const key of ['BEFFA_USER', 'BEFFA_PASS']) {
        if (!process.env[key]) missingSecrets.push(key);
    }
    if (missingSecrets.length > 0) {
        throw new Error(
            `[SETUP] ❌ ABORT: Required environment variables are not set: ${missingSecrets.join(', ')}.\n` +
            `        → In CI: ensure these are configured as GitHub Secrets.\n` +
            `        → Locally: check your .env file against .env.example.`
        );
    }
    console.log('[SETUP] ✓ Required secrets present (BEFFA_USER, BEFFA_PASS)');

    // ── 1. Pre-flight: ERP server reachability check ─────────────────────────
    const rawBase = (process.env.BASE_URL || 'http://localhost:4173')
        .replace(/['"]+/g, '').replace(/\/$/, '');
    const rawApi  = (process.env.API_URL  || rawBase.replace(/:4173/, ':8001'))
        .replace(/['"]+/g, '').replace(/\/$/, '');

    console.log(`[SETUP] Pinging frontend : ${rawBase}`);
    const frontendStatus = await httpPing(rawBase);
    console.log(`[SETUP] Pinging API      : ${rawApi}`);
    const apiStatus = await httpPing(rawApi);

    if (frontendStatus === 0 && apiStatus === 0) {
        throw new Error(
            `[SETUP] ❌ ABORT: ERP server is UNREACHABLE.\n` +
            `        → Frontend: ${rawBase} (status: ${frontendStatus})\n` +
            `        → API:      ${rawApi}  (status: ${apiStatus})\n` +
            `        → Check BASE_URL / API_URL secrets and server availability before running tests.`
        );
    }

    if (frontendStatus === 0) {
        console.warn(`[SETUP] ⚠ Frontend (${rawBase}) did not respond — UI tests may fail.`);
    } else {
        console.log(`[SETUP] ✓ Frontend reachable (HTTP ${frontendStatus})`);
    }

    if (apiStatus === 0) {
        console.warn(`[SETUP] ⚠ API (${rawApi}) did not respond — API-driven tests may fail.`);
    } else {
        console.log(`[SETUP] ✓ API reachable (HTTP ${apiStatus})`);
    }

    // ── 2. Log active configuration for audit trail ───────────────────────────
    console.log('[SETUP] ── Active Configuration ──────────────────────────');
    console.log(`[SETUP]   Company  : ${process.env.BEFFA_COMPANY  || '(not set — defaults to sample)'}`);
    console.log(`[SETUP]   Year     : ${process.env.BEFFA_YEAR     || '2018 (default)'}`);
    console.log(`[SETUP]   Period   : ${process.env.BEFFA_PERIOD   || 'yearly (default)'}`);
    console.log(`[SETUP]   Calendar : ${process.env.BEFFA_CALENDAR || 'ec (default)'}`);
    console.log(`[SETUP]   TestType : ${process.env.TEST_TYPE      || 'full (default)'}`);
    console.log('[SETUP] ──────────────────────────────────────────────────');

    // ── 3. Clean Allure results so the report only shows THIS run ─────────────
    const allureResults = path.join(root, 'allure-results');
    if (fs.existsSync(allureResults)) {
        fs.rmSync(allureResults, { recursive: true, force: true });
        console.log('[SETUP] ✓ Cleaned allure-results/');
    }
    fs.mkdirSync(allureResults, { recursive: true });

    // ── 4. Reset dashboard accumulator so the pass rate starts fresh ──────────
    const accumulator = path.join(root, 'deploy', 'dashboard-accumulated.json');
    if (fs.existsSync(accumulator)) {
        fs.unlinkSync(accumulator);
        console.log('[SETUP] ✓ Reset dashboard-accumulated.json');
    }

    // ── 5. Check if environment is clean and seed data if needed ───────────────
    const company = process.env.BEFFA_COMPANY || 'BM Tech';
    console.log('[SETUP] ── Data Seeding Check ──────────────────────────────');
    const isClean = await isEnvironmentClean(rawApi, company);
    
    if (isClean) {
        console.log('[SETUP] ⚠ Environment is clean - seeding demo data...');
        const seeded = await seedDemoData(rawBase, company);
        if (seeded) {
            console.log('[SETUP] ✅ Demo data seeded successfully');
        } else {
            console.log('[SETUP] ⚠ Data seeding failed - tests may fail due to missing data');
        }
    } else {
        console.log('[SETUP] ✓ Environment has data - skipping seeding');
    }

    console.log('[SETUP] ✅ All pre-flight checks passed. Starting tests...\n');
}

export default globalSetup;
