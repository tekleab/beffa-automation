import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  timeout: 600000,
  expect: { timeout: 30000 },

  fullyParallel: false,
  workers: 1,
  retries: 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['./reporters/integrated-dashboard.ts'],
    ['./reporters/summary-reporter.ts'],
    ['html', { open: 'never' }],
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
    baseURL: (process.env.BASE_URL || 'http://157.180.20.112:4173').replace(/['"]+/g, ''),
    viewport: { width: 1920, height: 1080 },

    launchOptions: {
      args: [
        '--start-maximized',
        '--force-device-scale-factor=0.8',
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
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Forensic-Purchase',
      testMatch: /purchase\/.*(procurement|audit|logic|concurrency|security|isolation).*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Sales-Workflows',
      testMatch: /sales\/.*\.spec\.ts/,
      testIgnore: [/.*(audit|logic|concurrency|security|isolation).*/],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Purchase-Workflows',
      testMatch: /purchase\/.*\.spec\.ts/,
      testIgnore: [/.*(procurement|audit|logic|concurrency|security|isolation).*/],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Inventory',
      testMatch: /inventory\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: process.env.TEST_RESULTS || 'test-results/',
});
