const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests/e2e',
  testIgnore: [],

  timeout: 600000,
  expect: { timeout: 30000 },

  /* Set to true to run tests within a single file in parallel */
  fullyParallel: true,

  /* Increased to 4 workers for faster execution */
  workers: 2,

  retries: process.env.CI ? 1 : 0,

  // Reporter configuration: List, HTML, and Allure
  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
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

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 60000,
    navigationTimeout: 100000,
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