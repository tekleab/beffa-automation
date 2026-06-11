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
        const loginData = {
            email: process.env.BEFFA_USER,
            password: process.env.BEFFA_PASS
        };
        const loginRes = await httpPost(loginUrl, loginData);
        if (loginRes.status !== 200 || !loginRes.body?.auth_token) {
            console.log('[SEED] ⚠ Could not login to check environment');
            return false;
        }
        
        const token = loginRes.body.auth_token;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'x-company': company
        };
        
        // Check if projects exist
        const projectsUrl = `${apiUrl}/projects?year=2018&period=yearly&calendar=ec`;
        const projectsRes = await httpPing(projectsUrl);
        
        // Check if customers exist
        const customersUrl = `${apiUrl}/customers?year=2018&period=yearly&calendar=ec`;
        const customersRes = await httpPing(customersUrl);
        
        // If both return 0 or empty, environment is clean
        const isClean = projectsRes === 0 && customersRes === 0;
        console.log(`[SEED] Environment check - Projects: ${projectsRes}, Customers: ${customersRes}, Clean: ${isClean}`);
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
        
        // Login
        console.log('[SEED] Logging in...');
        await page.goto(frontendUrl);
        await page.waitForLoadState('domcontentloaded');
        
        // Fill login form
        await page.fill('input[type="email"], input[name="email"]', process.env.BEFFA_USER || '');
        await page.fill('input[type="password"], input[name="password"]', process.env.BEFFA_PASS || '');
        await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
        
        // Navigate to data-seeding page
        console.log('[SEED] Navigating to data-seeding page...');
        // First, get company ID from URL or navigate to company settings
        await page.goto(`${frontendUrl}/company-management/companies`);
        await page.waitForLoadState('domcontentloaded');
        
        // Try to find the company and get its ID
        const companyRow = page.getByText(company).first();
        if (await companyRow.isVisible({ timeout: 5000 }).catch(() => false)) {
            await companyRow.click();
            await page.waitForLoadState('domcontentloaded');
            const currentUrl = page.url();
            const companyIdMatch = currentUrl.match(/\/company\/([a-f0-9-]+)/);
            const companyId = companyIdMatch ? companyIdMatch[1] : null;
            
            if (companyId) {
                console.log(`[SEED] Found company ID: ${companyId}`);
                await page.goto(`${frontendUrl}/company/${companyId}/data-seeding`);
                await page.waitForLoadState('domcontentloaded');
                
                // Click seeding buttons sequentially
                const buttons = [
                    'Seed Basic Data',
                    'Seed Demo Data',
                    'Company Settings',
                    'Company Detail'
                ];
                
                for (const buttonText of buttons) {
                    console.log(`[SEED] Clicking: ${buttonText}`);
                    const btn = page.getByRole('button', { name: buttonText }).or(page.getByText(buttonText)).first();
                    if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
                        await btn.click();
                        await page.waitForTimeout(2000); // Wait for seeding to complete
                        console.log(`[SEED] ✓ Completed: ${buttonText}`);
                    } else {
                        console.log(`[SEED] ⚠ Button not found: ${buttonText}`);
                    }
                }
                
                console.log('[SEED] ✅ Data seeding completed successfully');
                return true;
            }
        }
        
        console.log('[SEED] ⚠ Could not find company or navigate to data-seeding page');
        return false;
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
