import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  timeout: 600000,
  expect: { timeout: 30000 },

  fullyParallel: true,
  workers: 3,
  retries: 0, // Disable retries for immediate failure feedback

  reporter: [
    ['list'],
    ['./reporters/luxury-reporter.ts'],
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
          Project: 'BEFFA ERP V10.2',
          Engine: 'Tactical-Allure-Core'
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
      name: 'Inventory',
      testMatch: /inventory\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Purchases',
      testMatch: /purchase\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Sales',
      testMatch: /sales\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  outputDir: process.env.TEST_RESULTS || 'test-results/',
});
