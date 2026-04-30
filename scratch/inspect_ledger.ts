import { AppManager } from '../pages/AppManager';
import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function inspectLedger() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const app = new AppManager(page);

    console.log('[DEBUG] Logging in...');
    await app.login(process.env.BEFFA_USER!, process.env.BEFFA_PASS!);
    const token = await app._getAuthToken();
    const apiBase = "http://157.180.20.112:8001/api";
    const company = process.env.BEFFA_COMPANY!;
    const headers = { 'x-company': company, 'Authorization': `Bearer ${token}` };

    // 1. Get first vendor
    console.log('[DEBUG] Discovering Vendor...');
    const vendResp = await page.request.get(`${apiBase}/vendors?page=1&pageSize=1`, { headers });
    const vendData = await vendResp.json();
    const vendorId = vendData.items?.[0]?.id || vendData.data?.[0]?.id;

    if (!vendorId) {
        console.error('[ERROR] No vendors found');
        await browser.close();
        return;
    }

    // 2. Fetch Bills Ledger and DUMP structure
    console.log(`[DEBUG] Fetching Ledger for Vendor ${vendorId}...`);
    const billResp = await page.request.get(`${apiBase}/vendor/${vendorId}/bills?year=2018&period=yearly&calendar=ec`, { headers });
    const billData = await billResp.json();
    const bills = billData.data || billData.items || [];

    console.log('[RESULT] sample ENTRY FROM LEDGER:');
    console.log(JSON.stringify(bills[0] || "EMPTY LEDGER", null, 2));

    await browser.close();
}

inspectLedger().catch(console.error);
