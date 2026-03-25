const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests/e2e',
  testIgnore: [],

  /* Maximum time one test can run for */
  timeout: 600000,
  expect: { timeout: 30000 },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Forcing 3 parallel workers for unrelated tests. 
     Using 3 workers allows 3 different test files to run simultaneously.
  */
  workers: 3,

  /* Retries configuration for CI environments */
  retries: process.env.CI ? 1 : 0,

  /* Reporter configuration for List, HTML, and Allure */
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

  /* Folder for test artifacts such as screenshots and videos */
  outputDir: 'test-results/',
});
