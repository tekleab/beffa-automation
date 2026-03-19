const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * Playwright Configuration - Optimized for Customer Tests
 */
module.exports = defineConfig({
  testDir: './tests/e2e',

  // 🚀 Customer ቴስቶች ብቻ እንዲሮጡ ሌሎቹን Ignore እናደርጋቸዋለን
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

  // አንድ ቴስት ቢበዛ 5 ደቂቃ እንዲፈጅ
  timeout: 300000,

  expect: { timeout: 20000 },

  // በአንድ ፋይል ውስጥ ያሉ ቴስቶች በቅደም ተከተል እንዲሄዱ (መረጋጋት ለመጨመር)
  fullyParallel: false,

  // 🚀 3 ብሮውዘሮች ጎን ለጎን እንዲሮጡ
  workers: 3,

  // CI ላይ አንድ ጊዜ ቢሳሳት እንዲደግመው
  retries: process.env.CI ? 1 : 0,

  reporter: 'html',

  use: {
    // የመግቢያ ሊንክ (Base URL)
    baseURL: process.env.BASE_URL || 'http://157.180.20.112:4173',

    // 🚀 ስክሪኑ ሰፊ እንዲሆን (ለ ERP ሲስተም ወሳኝ ነው)
    viewport: { width: 1920, height: 1080 },

    launchOptions: {
      args: [
        '--start-maximized',
        '--force-device-scale-factor=0.8', // 80% Zoom በማድረግ ሁሉንም በተኖች እንዲያይ ይረዳዋል
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
        // ፕሮጀክቱ የራሱን ቪውፖርት እንዳይጭን null እናደርገዋለን
        viewport: null, 
      },
    },
  ],

  outputDir: 'test-results/',
});
