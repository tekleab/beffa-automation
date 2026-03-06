require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/e2e',
    // GitHub Actions ላይ ለዝግታ እንዲመች ጊዜውን እንጨምር
    timeout: 600000,
    expect: { timeout: 30000 },

    fullyParallel: false,
    // CI ላይ ዳታ እንዳይጋጭ አንዱ ቴስት አልቆ ሌላው እንዲጀምር 1 worker ብቻ እንጠቀም
    workers: process.env.CI ? 1 : undefined,

    reporter: [['html', { open: 'never' }], ['list']],
    use: {
        baseURL: process.env.BASE_URL || 'http://157.180.20.112:4173',
        viewport: null,
        // ድንገት ሲስተሙ ቢዘገይ Playwright ቶሎ ተስፋ እንዳይቆርጥ
        actionTimeout: 30000,
        navigationTimeout: 60000,
        launchOptions: {
            args: [
                '--start-maximized',
                '--force-device-scale-factor=0.8'
            ],
        },
        trace: 'on',
        video: 'on',
        screenshot: 'on',
        headless: process.env.CI ? true : false,
    },
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});