const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests/e2e',

  // 🚀 ሁሉንም ቴስቶች ለማስገባት testIgnore-ን ባዶ እናደርገዋለን
  testIgnore: [],

  timeout: 600000, // 10 ደቂቃ (ሁሉንም ለማለቅ በቂ ነው)
  expect: { timeout: 30000 },
  
  // 🚀 በአንድ ፋይል ያሉ ቴስቶች እንዳይጋጩ false ይሁን
  fullyParallel: false,

  // 🚀 3 ወርከሮች ጎን ለጎን 3 የተለያዩ ፋይሎችን ያስኪዳሉ
  workers: 3,

  retries: process.env.CI ? 1 : 0,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://157.180.20.112:4173',
    
    // 🖥️ ስክሪን ሳይዝ (ለ ERP ወሳኝ ነው)
    viewport: { width: 1920, height: 1080 },

    launchOptions: {
      args: [
        '--start-maximized',
        '--force-device-scale-factor=0.8', // 80% Zoom
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
