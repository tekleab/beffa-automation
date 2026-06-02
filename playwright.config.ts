import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env — CI uses process.env directly, local uses .env file (silent mode to suppress verbose logs)
dotenv.config({ path: path.resolve(__dirname, '.env'), silent: true });

// Resolve base URLs safely — guards against http://http/... malformation
function resolveUrl(raw: string | undefined, fallback: string): string {
  let url = (raw || fallback).replace(/['"+]+/g, '').replace(/\/$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://' + url;
  return url;
}

const frontendUrl = resolveUrl(process.env.BASE_URL, 'http://localhost:4173');

export default defineConfig({
  testDir: './tests',

  timeout: 120000,
  expect: { timeout: 30000 },

  fullyParallel: true,
  workers: process.env.CI ? 4 : 2,
  // 1 retry in CI absorbs transient ERP network hiccups; 0 locally for speed
  retries: 0,

  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['./reporters/integrated-dashboard.ts'],
    ['./reporters/summary-reporter.ts'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-results.json' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
        categories: [
          { name: 'Business Logic Errors', messageRegex: '.*uuid.*|.*expect.*', statusDetailsRegex: '.*' },
          { name: 'UI / Selector Flakiness', messageRegex: '.*timeout.*|.*waiting for.*', statusDetailsRegex: '.*' }
        ],
        environmentInfo: {
          OS: process.platform,
          Node: process.version,
          Company: process.env.BEFFA_COMPANY || 'sample',
          FiscalYear: process.env.BEFFA_YEAR || '2018',
          Project: 'BEFFA ERP High-Integrity Suite',
          Engine: 'Integrated-Allure-Reporter'
        }
      }
    ]
  ],

  use: {
    baseURL: frontendUrl,
    viewport: process.env.CI ? { width: 1920, height: 1080 } : null,

    launchOptions: {
      args: [
        '--start-maximized',
        '--force-device-scale-factor=0.75',
      ],
    },

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 90000,
    navigationTimeout: 180000,
  },

  projects: [
    {
      // All deep forensic/logic/security sales tests
      name: 'Forensic-Sales',
      testMatch: /sales\/.*(audit|logic|concurrency|security|isolation|integrity|boundaries|guardrails|cogs|partial|tax|credit|period).*\.spec\.ts/,
    },
    {
      // All deep forensic/logic/security purchase tests
      name: 'Forensic-Purchase',
      testMatch: /purchase\/.*(procurement|audit|logic|concurrency|security|isolation|integrity|boundaries|guardrails|partial|stress|period|accounting|payment).*\.spec\.ts/,
    },
    {
      // All inventory tests (no overlap — inventory files are already specific)
      name: 'Forensic-Inventory',
      testMatch: /inventory\/.*\.spec\.ts/,
    },
    {
      // Only UI/workflow sales tests not covered by Forensic-Sales
      name: 'Sales-Workflows',
      testMatch: /sales\/(customer|sales-receipt-ui-flow|sales-ui-verification|sales-customer-balance-ui)\.spec\.ts/,
      use: { channel: 'chrome' },
    },
    {
      // Only UI/workflow purchase tests not covered by Forensic-Purchase
      name: 'Purchase-Workflows',
      testMatch: /purchase\/(vendor|purchase-bill-ui-flow|purchase-to-sale-flow)\.spec\.ts/,
    },
    {
      name: 'Cross-Module',
      testMatch: /cross-module\/.*\.spec\.ts/,
    },
    {
      name: 'HR',
      testMatch: /hr\/.*\.spec\.ts/,
    },
  ],

  outputDir: process.env.TEST_RESULTS || 'test-results/',
});
