const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  
  /* 1. ጠቅላላ የቴስት ጊዜ ገደብ (ወደ 5 ደቂቃ ዝቅ ተደርጓል - ለደህንነት) */
  timeout: 300000, 
  expect: { 
    timeout: 15000 
  },

  /* 2. Parallel Execution Setup */
  fullyParallel: true,

  // 🚀 CI (GitHub Actions) ላይ 4 ብሮውዘር በአንድ ጊዜ ያስነሳል
  // ይህ ቴስቱን እጅግ ፈጣን ያደርገዋል
  workers: process.env.CI ? 4 : undefined,

  reporter: 'html',

  /* 3. Global Settings */
  use: {
    baseURL: 'http://157.180.20.112:4173',
    viewport: { width: 1600, height: 900 },

    launchOptions: {
      args: ['--start-maximized']
    },

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* 💡 ብዙ ዎርከሮች ሲኖሩ ሰርቨሩ ላይ ጫና ስለሚኖር ታይም-አውቱን ትንሽ ጨምረናል */
    actionTimeout: 40000,    
    navigationTimeout: 80000, 
  },

  /* 4. ብሮውዘር ፕሮጀክቶች */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1600, height: 900 },
      },
    },
  ],

  outputDir: 'test-results/',
});
