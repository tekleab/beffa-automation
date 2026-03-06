const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  
  /* 1. ጠቅላላ የቴስት ጊዜ ገደብ (2 ደቂቃ) */
  timeout: 1000000,
  expect: { 
    timeout: 15000 // ኤለመንቶችን ለመጠበቅ ትንሽ ተጨማሪ ጊዜ ለፓራለል ቴስት
  },

  /* 2. Parallel Execution Setup */
  // 🚀 ፋይሎች ጎን ለጎን እንዲሮጡ ይፈቅዳል
  fullyParallel: true,

  // 🚀 CI (GitHub Actions) ላይ 2 ብሮውዘር በአንድ ጊዜ ያስነሳል
  // ሎካል ላይ (ኮምፒውተርህ ላይ) ደግሞ እንደ ሲፒዩህ አቅም ይወስናል
  workers: process.env.CI ? 2 : undefined,

  /* 3. ሪፖርት ማውጫ (HTML report ይሰራል። ውድቀቶች ካሉ ቪዲዮና ፎቶ ይይዛል) */
  reporter: 'html',

  /* 4. Global Settings for all projects */
  use: {
    // baseURL መጨረሻው ላይ ስላሽ (/) የለውም
    baseURL: 'http://157.180.20.112:4173',

    // ስክሪኑን ማሳደግ (ለተሻለ ታይነት)
    viewport: { width: 1600, height: 900 },

    /* ብሮውዘሩ ሲከፈት ሁሌም በሙሉ ስክሪን እንዲሆን */
    launchOptions: {
      args: ['--start-maximized']
    },

    // ቴስቱ ሲከሽፍ ብቻ ቪዲዮ፣ ፎቶ እና ትሬስ (Trace) እንዲያነሳ
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* የጊዜ ገደቦች (Timeouts) */
    actionTimeout: 30000,    // አንድን በተን ለመጫን የሚሰጥ ጊዜ
    navigationTimeout: 60000, // ገጹ እስኪከፈት የሚሰጥ ጊዜ
  },

  /* 5. ብሮውዘር ፕሮጀክቶች */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1600, height: 900 },
      },
    },
    /* አስፈላጊ ከሆነ ሌላ ብሮውዘር እዚህ መጨመር ይቻላል (Firefox, Webkit) */
  ],

  /* 6. ቴስት ውጤቶች የሚቀመጡበት ፎልደር */
  outputDir: 'test-results/',
});
