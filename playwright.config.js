const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * Playwright Configuration
 *
 * - Runs tests in parallel across Chromium and Firefox.
 * - 2 workers means 2 tests run simultaneously at any time.
 * - Retries once on CI to handle transient flakiness.
 * - HTML report generated after every run.
 *
 * See: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',

  // Maximum time a single test can run before it is considered failed.
  timeout: 300000,

  // Maximum time for a single assertion (e.g. expect().toBeVisible()).
  expect: { timeout: 20000 },

  // Run tests in different spec files in parallel.
  fullyParallel: true,

  // 2 parallel workers: allows two browsers to run different tests simultaneously.
  workers: 2,

  // Retry failed tests once on CI to handle transient failures.
  retries: process.env.CI ? 1 : 0,

  // Rich HTML report saved to playwright-report/.
  reporter: 'html',

  // Shared settings applied to every test in every project.
  use: {
    baseURL: 'http://157.180.20.112:4173',

    // Start browser maximized instead of a fixed viewport.
    viewport: null,

    launchOptions: {
      args: [
        '--start-maximized',
        '--force-device-scale-factor=0.7',
      ],
    },

    // Collect trace on first retry to help debug CI failures.
    trace: 'on-first-retry',

    // Capture screenshot when a test fails.
    screenshot: 'only-on-failure',

    // Retain video only for failing tests to save disk space.
    video: 'retain-on-failure',

    // Maximum time for a single action (click, fill, etc.).
    actionTimeout: 50000,

    // Maximum time for page navigations.
    navigationTimeout: 90000,
  },

  // Run tests in Chromium AND Firefox in parallel.
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined,
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: null,
      },
    },
  ],

  // Directory where test artifacts (screenshots, videos, traces) are saved.
  outputDir: 'test-results/',
});