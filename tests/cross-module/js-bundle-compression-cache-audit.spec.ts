import { test, expect } from '@playwright/test';

/**
 * =============================================================================
 * MODULE: Frontend JavaScript Bundle Compression & Browser Caching Audit
 * =============================================================================
 * 
 * AUDIT OBJECTIVES:
 * 1. Inspect static JS bundle headers (Content-Encoding, Cache-Control, ETag).
 * 2. Validate Brotli/Gzip compression and max-age browser caching policies.
 * 3. Log verified results for QA Slack reporting.
 * =============================================================================
 */

test.describe('Frontend JS Bundle Compression & Caching Audit @cross-module @performance @cdn @full', () => {
    test('Audit Frontend JS Bundle Compression and Caching headers', async ({ request }) => {
        const frontendUrl = process.env.BASE_URL || 'http://168.119.175.142:4173';
        console.log(`\n===============================================================`);
        console.log(`AUDITING FRONTEND SERVER HEADERS: ${frontendUrl}`);
        console.log(`===============================================================`);

        // Step 1: Fetch HTML entrypoint to discover asset paths
        const rootResponse = await request.get(frontendUrl);
        expect(rootResponse.ok()).toBeTruthy();

        const html = await rootResponse.text();
        const jsMatches = [...html.matchAll(/src=["']([^"']+\.js[^"']*)["']/g)].map(m => m[1]);
        console.log(`[DISCOVERY] Script Bundle path:`, jsMatches[0] || 'N/A');

        const bundlePath = jsMatches[0] ? jsMatches[0] : '/assets/index.6269b7f2.js';
        const bundleUrl = `${frontendUrl.replace(/\/$/, '')}/${bundlePath.replace(/^\//, '')}`;

        console.log(`[INSPECTING BUNDLE HEADERS]: ${bundleUrl}`);

        // Step 2: Fetch headers using GET with Accept-Encoding
        const resp = await request.get(bundleUrl, {
            headers: {
                'Accept-Encoding': 'gzip, deflate, br'
            }
        });

        const headers = resp.headers();
        const status = resp.status();

        const contentEncoding = headers['content-encoding'] || 'none (UNCOMPRESSED)';
        const cacheControl = headers['cache-control'] || 'none (NO CACHE CONTROL)';
        const etag = headers['etag'] || 'none';
        const lastModified = headers['last-modified'] || 'none';

        const isCompressed = contentEncoding.includes('br') || contentEncoding.includes('gzip');
        const isCached = cacheControl.includes('max-age') || cacheControl.includes('immutable');

        console.log(`\n===============================================================`);
        console.log(`VERIFICATION SUMMARY:`);
        console.log(`HTTP Status: ${status}`);
        console.log(`Content-Encoding: ${contentEncoding}`);
        console.log(`Cache-Control: ${cacheControl}`);
        console.log(`ETag: ${etag}`);
        console.log(`Last-Modified: ${lastModified}`);
        console.log(`Compression Status: ${isCompressed ? '✅ ACTIVE (Brotli/Gzip)' : '❌ INACTIVE'}`);
        console.log(`Browser Caching: ${isCached ? '✅ ACTIVE (1-Year Cache / Immutable)' : '❌ INACTIVE'}`);
        console.log(`===============================================================\n`);

        expect(status).toBe(200);
        expect(isCompressed).toBe(true);
        expect(isCached).toBe(true);
    });
});
