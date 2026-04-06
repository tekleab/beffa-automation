const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

module.exports = defineConfig({
  testDir: './tests',

  timeout: 600000,
  expect: { timeout: 30000 },

  fullyParallel: false,
  workers: 3,

  retries: 0,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          OS: process.platform,
          NodeVersion: process.version,
          BaseURL: process.env.BASE_URL || 'http://157.180.20.112:4173',
          Project: 'BEFFFA ERP Automation'
        }
      }
    ]
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://157.180.20.112:4173',
    viewport: { width: 1920, height: 1080 },

    launchOptions: {
      args: [
        '--start-maximized',
        '--force-device-scale-factor=0.8',
      ],
    },

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 60000,
    navigationTimeout: 150000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  outputDir: 'test-results/',
});
