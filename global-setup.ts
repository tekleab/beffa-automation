import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

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

async function globalSetup() {
    const root = process.cwd();

    // ── 0. Pre-flight: validate required secrets ──────────────────────────────
    console.log('[SETUP] ── Pre-flight checks ──────────────────────────────');

    const missingSecrets: string[] = [];
    for (const key of ['BEFFA_USER', 'BEFFA_PASS', 'BEFFA_TOKEN']) {
        if (!process.env[key]) missingSecrets.push(key);
    }
    if (missingSecrets.length > 0) {
        throw new Error(
            `[SETUP] ❌ ABORT: Required environment variables are not set: ${missingSecrets.join(', ')}.\n` +
            `        → In CI: ensure these are configured as GitHub Secrets.\n` +
            `        → Locally: check your .env file against .env.example.`
        );
    }
    console.log('[SETUP] ✓ Required secrets present (BEFFA_USER, BEFFA_PASS, BEFFA_TOKEN)');

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

    console.log('[SETUP] ✅ All pre-flight checks passed. Starting tests...\n');
}

export default globalSetup;
