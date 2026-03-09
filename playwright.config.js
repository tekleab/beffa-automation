const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 300000, 
  expect: { timeout: 20000 }, 

  fullyParallel: true,
  workers: process.env.CI ? 3 : undefined,

  /* 🚀 ቴስት ቢከሽፍ አንድ ጊዜ በራሱ እንዲደግም */
  retries: process.env.CI ? 1 : 0, 

  reporter: 'html',

  use: {
    baseURL: 'http://157.180.20.112:4173',
    viewport: { width: 1600, height: 900 },
    launchOptions: {
      args: ['--start-maximized']
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* ሰርቨሩ ቢዘገይ እንኳ ቴስቱ በትዕግስት እንዲጠብቅ */
    actionTimeout: 50000,    
    navigationTimeout: 90000, 
  },

  projects: [
    /* 1. Google Chrome (Chromium) */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1600, height: 900 },
      },
    },

    /* 2. Mozilla Firefox */
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1600, height: 900 },
      },
    },

    /* 3. Apple Safari (WebKit) */
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1600, height: 900 },
      },
    },
  ],

  outputDir: 'test-results/',
});
