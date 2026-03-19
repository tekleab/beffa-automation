const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests/e2e',

  /* 🚀 Customer ቴስቶች ብቻ እንዲሮጡ ሌሎቹን ችላ እንዲል (Ignore) ተደርጓል */
  testIgnore: [
    '**/bill.spec.js',
    '**/quote.spec.js',
    '**/receipt.spec.js',
    '**/inventory-impact.spec.js',
    '**/invoice.spec.js',
    '**/payment-edge-cases.spec.js',
    '**/purchase-order.spec.js',
    '**/purchase-requisition.spec.js',
    '**/sales-order.spec.js',
    '**/bill-payment.spec.js'
  ],

  timeout: 300000,
  expect: { timeout: 20000 },

  /* 🚀 በአንድ ፋይል ውስጥ ያሉ ቴስቶች በቅደም ተከተል እንዲሄዱ false ይሁን */
  fullyParallel: false,

  /* 🚀 ለፈጣን አፈጻጸም 3 ወርከሮች ተመድበዋል */
  workers: 3,

  retries: process.env.CI ? 1 : 0,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://157.180.20.112:4173',
    viewport: null,
    launchOptions: {
      args: [
        '--start-maximized',
        '--force-device-scale-factor=0.7',
      ],
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 50000,
    navigationTimeout: 90000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined,
      },
    },
  ],

  outputDir: 'test-results/',
});
