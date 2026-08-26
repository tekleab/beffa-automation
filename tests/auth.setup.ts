import { test as setup } from '@playwright/test';
import { AppManager } from '../pages/AppManager';
import * as path from 'path';
import * as fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate globally once', async ({ page }) => {
    const dir = path.dirname(authFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    console.log('[AUTH SETUP] Authenticating session once via API...');
    const app = new AppManager(page);
    await app.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);

    // Warm up the dashboard so React/Vite hydrates the session and caches all bundles
    console.log(`[AUTH SETUP] Saved authenticated state to ${authFile}`);
    await page.goto('about:blank').catch(() => {});
});
