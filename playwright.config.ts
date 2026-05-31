import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Logger } from './lib/utils/Logger';

// Load env — CI uses process.env directly, local uses .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Resolve base URLs safely — guards against http://http/... malformation
function resolveUrl(raw: string | undefined, fallback: string): string {
  let url = (raw || fallback).replace(/['"+]+/g, '').replace(/\/$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'http://' + url;
  return url;
}

const frontendUrl = resolveUrl(process.env.BASE_URL, 'http://localhost:4173');

export default defineConfig({
  testDir: './tests',

  timeout: 600000,
  expect: { timeout: 30000 },

  fullyParallel: false,
  workers: 1,
  retries: 0,

  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  // Global afterEach hook for consistent failure logging
  afterEach: async ({}, testInfo) => {
    if (testInfo.status === 'failed') {
      const error = testInfo.error;
      const errorSummary = error ? error.message.split('\n')[0].substring(0, 200) : 'Unknown error';
      Logger.fail(`Test failed: ${testInfo.title}`, {
        error: errorSummary,
        file: testInfo.file,
        line: testInfo.line
      });
    }
  },
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['./reporters/integrated-dashboard.ts'],
    ['./reporters/summary-reporter.ts'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
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
          OS: 'Linux',
          Node: 'v20.20.2',
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
    screenshot: 'on',
    video: 'on',

    actionTimeout: 60000,
    navigationTimeout: 150000,
  },

  projects: [
    {
      name: 'Forensic-Sales',
      testMatch: /sales\/.*(audit|logic|concurrency|security|isolation).*\.spec\.ts/,
    },
    {
      name: 'Forensic-Purchase',
      testMatch: /purchase\/.*(procurement|audit|logic|concurrency|security|isolation).*\.spec\.ts/,
    },
    {
      name: 'Forensic-Inventory',
      testMatch: /inventory\/.*(integrity|audit|logic|concurrency|security|temporal).*\.spec\.ts/,
    },
    {
      name: 'Sales-Workflows',
      testMatch: /sales\/.*\.spec\.ts/,
      testIgnore: [/.*(audit|logic|concurrency|security|isolation).*/],
      use: {
        channel: 'chrome',
      },
    },
    {
      name: 'Purchase-Workflows',
      testMatch: /purchase\/.*\.spec\.ts/,
      testIgnore: [/.*(procurement|audit|logic|concurrency|security|isolation).*/],
    },
    {
      name: 'Inventory',
      testMatch: /inventory\/.*\.spec\.ts/,
      testIgnore: [/.*(integrity|audit|logic|concurrency|security|temporal).*/],
    },
    {
      name: 'HR',
      testMatch: /hr\/.*\.spec\.ts/,
    },
  ],

  outputDir: process.env.TEST_RESULTS || 'test-results/',
});
