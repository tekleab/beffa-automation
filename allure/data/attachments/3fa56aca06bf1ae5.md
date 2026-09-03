# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project/project-api-contract.spec.ts >> Project Management: API Contract @project @api @smoke @regression @full >> API-01: Create project returns valid id, ref and pending status
- Location: tests/project/project-api-contract.spec.ts:47:9

# Error details

```
Error: apiRequestContext.post: read ECONNRESET
Call log:
  - → POST http://168.119.175.142:8001/api/users/login?year=2019&period=yearly&calendar=ec&month=6
    - user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/147.0.7727.15 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - Content-Type: application/json
    - content-length: 49
    - cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJlZmZhLmNvbSIsImV4cCI6MTc4ODUxMTMxNywiaXNzIjoiTWlraWFzIFlvbmFzIiwicmVmcmVzaF9leHAiOjE3ODg1MTEzMTd9.M9nxZTlvamJAk0DeLujLuW6wGoIGptaNraseTLgyQDM; auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJlZmZhLmNvbSIsImV4cCI6MTc4ODUxMTMxNywiaXNzIjoiTWlraWFzIFlvbmFzIiwicmVmcmVzaF9leHAiOjE3ODg1MTEzMTd9.M9nxZTlvamJAk0DeLujLuW6wGoIGptaNraseTLgyQDM

```

# Test source

```ts
  1  | import { Page } from '@playwright/test';
  2  | import { AppManager } from '../../pages/AppManager';
  3  | 
  4  | /**
  5  |  * Lightweight login for load/stress tests.
  6  |  * Does a direct POST /users/login, injects the token into localStorage
  7  |  * via the login page (lightest possible page load — no SPA bundle wait).
  8  |  * Returns a ready AppManager with cachedToken set.
  9  |  */
  10 | export async function apiLoginSetup(page: Page): Promise<AppManager> {
  11 |     const base = (process.env.API_URL || process.env.BASE_URL || 'http://localhost:8001')
  12 |         .replace(/['"]+/g, '').replace(/\/$/, '').replace(/:4173/, ':8001');
  13 |     const apiBase = base.endsWith('/api') ? base : base + '/api';
  14 |     const baseUrl = (process.env.BASE_URL || 'http://localhost:4173')
  15 |         .replace(/['"]+/g, '').replace(/\/$/, '');
  16 | 
  17 |     const year = process.env.BEFFA_YEAR || '2019';
  18 |     const period = process.env.BEFFA_PERIOD || 'yearly';
  19 |     const calendar = process.env.BEFFA_CALENDAR || 'ec';
  20 | 
> 21 |     const r = await page.request.post(
     |                                  ^ Error: apiRequestContext.post: read ECONNRESET
  22 |         `${apiBase}/users/login?year=${year}&period=${period}&calendar=${calendar}&month=6`,
  23 |         {
  24 |             data: { email: process.env.BEFFA_USER, password: process.env.BEFFA_PASS },
  25 |             headers: { 'Content-Type': 'application/json' }
  26 |         }
  27 |     );
  28 |     if (!r.ok()) throw new Error(`apiLoginSetup failed: HTTP ${r.status()}`);
  29 |     const token = (await r.json()).auth_token;
  30 |     if (!token) throw new Error('apiLoginSetup: no auth_token in response');
  31 | 
  32 |     // Navigate to login page (static HTML, no bundle) just to get a valid origin
  33 |     // so localStorage.setItem works and page.request has a proper HTTP context.
  34 |     await page.goto(`${baseUrl}/users/login`, { waitUntil: 'commit', timeout: 30000 });
  35 | 
  36 |     await page.evaluate(
  37 |         ({ jwt, company, yr }: { jwt: string; company: string; yr: string }) => {
  38 |             localStorage.setItem('auth-token', jwt);
  39 |             localStorage.setItem('token', jwt);
  40 |             localStorage.setItem('currentCompany', company);
  41 |             localStorage.setItem('selectedYear', yr);
  42 |             localStorage.setItem('calendar', 'EC');
  43 |             localStorage.setItem('period', 'yearly');
  44 |             localStorage.setItem('selected-role', 'IT Administrator / User Manager');
  45 |         },
  46 |         { jwt: token, company: process.env.BEFFA_COMPANY as string, yr: year }
  47 |     );
  48 | 
  49 |     // Set process.env.BEFFA_YEAR so DateHelper and all API calls use the correct year
  50 |     process.env.BEFFA_YEAR = year;
  51 | 
  52 |     const app = new AppManager(page);
  53 |     // Cache the token so _getAuthToken() returns it immediately without localStorage lookup
  54 |     (app as any).cachedToken = token;
  55 | 
  56 |     return app;
  57 | }
  58 | 
```