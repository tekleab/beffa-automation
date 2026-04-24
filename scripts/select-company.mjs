#!/usr/bin/env node
/**
 * Beffa ERP — Interactive Company Selector
 * -----------------------------------------
 * Shows available companies fetched from the API.
 * Waits 5 seconds for selection, then falls back to DEFAULT_COMPANY.
 * Usage:  node scripts/select-company.mjs [playwright args...]
 * Example: node scripts/select-company.mjs --grep @smoke --headed
 */

import { createInterface } from 'readline';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Load .env ────────────────────────────────────────────────────────────────
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
try {
  const lines = readFileSync(resolve(ROOT, '.env'), 'utf-8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([^#\s=][^=]*)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
} catch { /* no .env — rely on process.env */ }

const merged = { ...process.env, ...env };
const API_BASE  = 'http://157.180.20.112:8001/api';
const USER      = merged.BEFFA_USER  || '';
const PASS      = merged.BEFFA_PASS  || '';
const DEFAULT   = merged.BEFFA_COMPANY || 'smoke test';
const TIMEOUT   = 10; // seconds to wait before auto-selecting default

// ── Fetch company list from the live API ─────────────────────────────────────
async function fetchCompanies() {
  try {
    const abort = new AbortController();
    const tid = setTimeout(() => abort.abort(), 10000); // Increased login timeout

    const loginRes = await fetch(
      `${API_BASE}/users/login?year=2018&period=yearly&calendar=ec&month=6`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: USER, password: PASS }),
        signal:  abort.signal,
      }
    );
    clearTimeout(tid);
    if (!loginRes.ok) {
        console.warn(`\n    \x1b[31m[LOGIN FAILED]\x1b[0m status: ${loginRes.status}`);
        return null;
    }

    const { auth_token } = await loginRes.json();
    if (!auth_token) return null;

    // Try known company endpoints
    for (const endpoint of ['/users/me', '/companies', '/organizations', '/user/companies']) {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${auth_token}` },
          signal:  AbortSignal.timeout(10000), // Increased API timeout
        });
        if (!res.ok) {
            console.warn(`\n    \x1b[90m[API SKIP]\x1b[0m ${endpoint} returned ${res.status}`);
            continue;
        }
        const responseData = await res.json();
        
        // Handle different possible response structures
        let list = [];
        if (endpoint === '/users/me') {
            list = responseData.user?.companies || responseData.companies || [];
        } else {
            list = responseData.items || responseData.data || (Array.isArray(responseData) ? responseData : []);
        }

        if (list && list.length > 0) return list.map(c => c.name || c.company_name || c);
      } catch (e) { 
        console.warn(`\n    \x1b[90m[API ERR]\x1b[0m ${endpoint}: ${e.message}`);
        continue; 
      }
    }
    return null;
  } catch (err) {
    console.warn(`\n    \x1b[31m[NETWORK ERR]\x1b[0m ${err.message}`);
    return null;
  }
}

// ── Interactive prompt with countdown ────────────────────────────────────────
function promptWithCountdown(companies, defaultCompany, timeoutSecs) {
  return new Promise((resolve) => {
    let countdown  = timeoutSecs;
    let answered   = false;

    const rl = createInterface({ input: process.stdin, output: process.stdout });

    // Show numbered list
    console.log('');
    companies.forEach((name, i) => {
      const marker = name === defaultCompany ? ' ← default' : '';
      console.log(`  \x1b[36m${i + 1})\x1b[0m ${name}${marker}`);
    });
    console.log('');

    const renderPrompt = () => {
      process.stdout.write(
        `\r  \x1b[33mSelect [1-${companies.length}] and press Enter  \x1b[0m` +
        `(auto: "${defaultCompany}" in \x1b[1m${countdown}s\x1b[0m): `
      );
    };

    renderPrompt();

    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        if (!answered) {
          answered = true;
          rl.close();
          process.stdout.write('\n');
          resolve(defaultCompany);
        }
      } else {
        renderPrompt();
      }
    }, 1000);

    rl.on('line', (input) => {
      if (answered) return;
      answered = true;
      clearInterval(timer);
      rl.close();

      const idx = parseInt(input.trim(), 10) - 1;
      if (!input.trim() || isNaN(idx) || idx < 0 || idx >= companies.length) {
        resolve(defaultCompany);
      } else {
        resolve(companies[idx]);
      }
    });
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const playwrightArgs = process.argv.slice(2);

  console.log('\n\x1b[1m\x1b[35m  ⚡ Beffa ERP — Playwright Test Runner\x1b[0m');
  console.log('  \x1b[90m─────────────────────────────────────\x1b[0m');
  process.stdout.write('  Fetching companies from server...');

  let companies = await fetchCompanies();

  if (!companies || companies.length === 0) {
    process.stdout.write(' \x1b[33m⚠  server unreachable, using defaults\x1b[0m\n');
    // Fallback: show at least the configured default
    companies = [DEFAULT];
    // Add any extras defined in env
    if (merged.BEFFA_COMPANIES) {
      const extras = merged.BEFFA_COMPANIES.split(',').map(s => s.trim()).filter(Boolean);
      companies = [...new Set([DEFAULT, ...extras])];
    }
  } else {
    process.stdout.write(` \x1b[32m✔  ${companies.length} found\x1b[0m\n`);
    // Make sure default is in the list
    if (!companies.includes(DEFAULT)) companies.unshift(DEFAULT);
  }

  console.log('\n\x1b[1m  Available Companies:\x1b[0m');
  const selected = await promptWithCountdown(companies, DEFAULT, TIMEOUT);

  console.log(`\n  \x1b[32m✔ Running tests against:\x1b[0m \x1b[1m"${selected}"\x1b[0m\n`);

  // Spawn playwright with the selected company injected
  const child = spawn(
    'npx',
    ['playwright', 'test', ...playwrightArgs],
    {
      stdio: 'inherit',
      env:   { ...merged, BEFFA_COMPANY: selected },
    }
  );

  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error('\x1b[31m[ERROR]\x1b[0m', err.message);
  process.exit(1);
});
