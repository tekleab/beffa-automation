const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
    testDir: './tests/e2e',
    /* 1. ጊዜ እንዲኖረው (Timeout) */
    timeout: 120000,
    expect: { timeout: 10000 },

    fullyParallel: false,
    workers: 1, // ዳታ እንዳይጋጭ አንድ በአንድ እንዲሮጥ
    reporter: 'html',

    /* 2. ሁሉንም ግሎባል ሴቲንግ እዚህ እናስተካክል */
    use: {
        // baseURL መጨረሻው ላይ ስላሽ (/) የለውም - ለ 404 መፍትሄ
        baseURL: 'http://157.180.20.112:4173',

        // 🚀 ዋናው መፍትሄ፡ ስክሪኑን ማሳደግ (Viewport)
        viewport: { width: 1600, height: 900 },

        /* ብሮውዘሩ ሲከፈት ሁሌም በሙሉ ስክሪን እንዲሆን */
        launchOptions: {
            args: ['--start-maximized']
        },

        // ቴስቱ ሲከሽፍ ብቻ ቪዲዮ እና ፎቶ እንዲያነሳ
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',

        /* 3. ገጹ ሙሉ በሙሉ እስኪጫን እንዲጠብቅ (Global Navigation) */
        actionTimeout: 20000,
        navigationTimeout: 60000,
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // እዚህም ቪውፖርቱን ደግመን እናረጋግጥ
                viewport: { width: 1600, height: 900 },
            },
        },
    ],
});