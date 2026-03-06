require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/e2e',
    timeout: 600000,
    expect: { timeout: 30000 },
    fullyParallel: false,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { open: 'never' }], ['list']],
    use: {
        // 🔗 ዋናው URL እዚህ ጋር መኖሩን እና መጨረሻው ላይ '/' አለመኖሩን አረጋግጥ
        baseURL: process.env.BASE_URL || 'http://157.180.20.112:4173',

        // 🖥️ ዴስክቶፕ ስክሪን እንዲሆን ያስገድደዋል (የ 'Desktop only' ስህተትን ይፈታል)
        viewport: { width: 1280, height: 720 },

        actionTimeout: 30000,
        navigationTimeout: 60000,
        trace: 'on',
        video: 'on',
        screenshot: 'on',
        headless: process.env.CI ? true : false,
    },
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});