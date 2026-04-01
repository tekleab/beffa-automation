const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const dotenv = require('dotenv');

// ✅ Load .env once
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

module.exports = defineConfig({
  testDir: './tests/e2e',
  testIgnore: [],

  /* Long timeout for complex ERP workflows */
  timeout: 600000, 
  expect: { timeout: 30000 },

  fullyParallel: true,
  workers: 3,

  /* CI Configuration */
  retries: process.env.CI ? 1 : 0,

  /* 📊 ASTONISHING REPORTING CONFIGURATION */
  reporter: [
    ['list'],
    ['html', { open: 'never' }], // Generates standard HTML report
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

    /* Capture data for the graphs */
    trace: 'retain-on-failure',     // Traces make Allure reports interactive
    screenshot: 'on',               // 'on' ensures visuals appear in your dashboard
    video: 'on-first-retry',
    
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
