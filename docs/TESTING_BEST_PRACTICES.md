# Testing Best Practices for BEFFA Automation

## 1. Standard Logging Utility

### Usage
Import the Logger utility from `lib/utils/Logger`:

```typescript
import { Logger } from '../lib/utils/Logger';

// Available log levels
Logger.step('Creating invoice via API...');
Logger.attack('Testing concurrent invoice creation...');
Logger.pass('Invoice created successfully');
Logger.fail('Invoice creation failed');
Logger.performance('API response time: 150ms');
Logger.snapshot('Taking screenshot of customer profile');
Logger.secondaryBug('Secondary issue detected: UI misalignment');
Logger.debug('Tab content preview: ...'); // Only shows when DEBUG=true
Logger.warn('Retrying operation...');
Logger.error('Critical error occurred');
Logger.info('Test execution started');
```

### Log Levels
- **STEP**: Test step progression
- **ATTACK**: Security/concurrency attack vectors
- **PASS**: Successful assertions
- **FAIL**: Test failures (automatically logged in afterEach hook)
- **PERFORMANCE**: Performance metrics
- **SNAPSHOT**: Screenshots/visual checks
- **SECONDARY_BUG**: Non-critical issues
- **DEBUG**: Debug information (gated behind DEBUG=true)
- **WARN**: Warnings
- **ERROR**: Critical errors
- **INFO**: General information

### DEBUG Gating
DEBUG logs only appear when `DEBUG=true` is set in the environment:
```bash
# CI (no debug output)
npm run test

# Local (with debug output)
DEBUG=true npm run test
```

## 2. Making Test Files Fully Independent

### Principles
1. **No shared state**: Each test should be self-contained
2. **Isolated data**: Create and clean up test data within each test
3. **Independent execution**: Tests should pass/fail regardless of other tests
4. **No test order dependencies**: Tests should work in any order

### Implementation
```typescript
test('Test A', async ({ page }) => {
  // Create test data
  const customer = await createCustomerAPI();
  
  // Perform test
  await page.goto(`/customers/${customer.id}`);
  
  // Clean up test data
  await deleteCustomerAPI(customer.id);
});

test('Test B', async ({ page }) => {
  // Create fresh test data - don't rely on Test A
  const customer = await createCustomerAPI();
  
  // Perform test
  await page.goto(`/customers/${customer.id}`);
  
  // Clean up test data
  await deleteCustomerAPI(customer.id);
});
```

### Anti-Patterns to Avoid
```typescript
// ❌ BAD: Shared state across tests
let customerId: string;

test.beforeAll(async () => {
  customerId = await createCustomerAPI();
});

test('Test A', async ({ page }) => {
  await page.goto(`/customers/${customerId}`);
});

test('Test B', async ({ page }) => {
  // Relies on customerId from Test A
  await page.goto(`/customers/${customerId}`);
});
```

## 3. Global afterEach Hook for Failure Logging

The playwright.config.ts includes a global afterEach hook that automatically logs [FAIL] messages with error summaries:

```typescript
afterEach: async ({}, testInfo) => {
  if (testInfo.status === 'failed') {
    const error = testInfo.error;
    const errorSummary = error ? error.message.split('\n')[0].substring(0, 200) : 'Unknown error';
    Logger.fail(`Test failed: ${testInfo.title}`, {
      error: errorSummary,
      file: testInfo.file,
      line: testInfo.line
    });
  }
}
```

This ensures consistent failure logging across all tests without manual intervention.

## 4. Organizing 30+ Test Files Across Modules

### Recommended Structure
```
tests/
├── sales/
│   ├── sales-order-workflow.spec.ts
│   ├── sales-invoice-workflow.spec.ts
│   ├── sales-receipt-workflow.spec.ts
│   ├── sales-customer-balance-ui.spec.ts
│   ├── sales-audit-logic.spec.ts
│   ├── sales-concurrency.spec.ts
│   └── sales-security-isolation.spec.ts
├── purchase/
│   ├── purchase-order-workflow.spec.ts
│   ├── purchase-bill-workflow.spec.ts
│   ├── purchase-procurement.spec.ts
│   ├── purchase-audit-logic.spec.ts
│   ├── purchase-concurrency.spec.ts
│   └── purchase-security-isolation.spec.ts
├── inventory/
│   ├── inventory-item-lifecycle.spec.ts
│   ├── inventory-stock-adjustment.spec.ts
│   ├── inventory-integrity.spec.ts
│   ├── inventory-audit-logic.spec.ts
│   ├── inventory-concurrency.spec.ts
│   ├── inventory-security-temporal.spec.ts
│   └── inventory-security-isolation.spec.ts
└── hr/
    ├── hr-employee-lifecycle.spec.ts
    ├── hr-payroll-workflow.spec.ts
    ├── hr-timesheet.spec.ts
    └── hr-audit.spec.ts
```

### Naming Conventions
- **Workflow tests**: `{module}-{entity}-workflow.spec.ts`
- **UI verification**: `{module}-{entity}-ui.spec.ts`
- **Audit/Logic**: `{module}-audit-logic.spec.ts`
- **Concurrency**: `{module}-concurrency.spec.ts`
- **Security**: `{module}-security-{type}.spec.ts` (isolation, temporal, etc.)
- **Integrity**: `{module}-integrity.spec.ts`

### Tagging Strategy
```typescript
test.describe('Sales Order Workflows @sales @smoke @workflow', () => {
  test('Create and approve sales order @critical', async ({ page }) => {
    // Test implementation
  });
});

test.describe('Sales Security Tests @sales @security @isolation', () => {
  test('Prevent unauthorized access to customer data @critical', async ({ page }) => {
    // Test implementation
  });
});
```

### Playwright Projects for Module Isolation
```typescript
projects: [
  {
    name: 'Sales-Workflows',
    testMatch: /sales\/.*-workflow\.spec\.ts/,
    testIgnore: [/.*(audit|concurrency|security).*/],
  },
  {
    name: 'Sales-Forensic',
    testMatch: /sales\/.*(audit|concurrency|security).*.spec\.ts/,
  },
  // Similar for other modules
]
```

### Running Tests by Module
```bash
# Run all Sales tests
npx playwright test --project=Sales-Workflows --project=Sales-Forensic

# Run all workflow tests across modules
npx playwright test --grep @workflow

# Run smoke tests
npx playwright test --grep @smoke

# Run critical tests
npx playwright test --grep @critical
```

## 5. Page Object Model (POM) Organization

### Structure
```
pages/
├── AppManager.ts          # Main entry point
├── BasePage.ts           # Shared base functionality
├── AuthManager.ts        # Authentication
├── SalesPage.ts          # Sales-specific UI interactions
├── PurchasePage.ts       # Purchase-specific UI interactions
├── InventoryPage.ts      # Inventory-specific UI interactions
└── HrPage.ts             # HR-specific UI interactions
```

### API Organization
```
lib/api/
├── BasePage.ts           # Shared API base functionality
├── SalesAPI.ts           # Sales API methods
├── PurchaseAPI.ts        # Purchase API methods
├── InventoryAPI.ts       # Inventory API methods
└── HrAPI.ts              # HR API methods
```

## 6. Test Data Management

### Environment-Specific Data
```typescript
// Use environment variables for test data
const TEST_DATA = {
  customerId: process.env.TEST_CUSTOMER_ID || 'default-customer-id',
  itemId: process.env.TEST_ITEM_ID || 'default-item-id',
  vendorId: process.env.TEST_VENDOR_ID || 'default-vendor-id',
};
```

### Dynamic Data Discovery
```typescript
// Discover available data at runtime instead of hardcoding
const meta = await app.api.sales.discoverMetadataAPI();
const item = await app.api.inventory.captureRandomItemDataAPI({ minStock: 1 });
```

## 7. Error Handling and Retries

### Structured Error Handling
```typescript
try {
  await page.click('#submit-button');
} catch (error) {
  Logger.error('Failed to click submit button', {
    error: error.message,
    selector: '#submit-button'
  });
  throw error;
}
```

### Retry Logic
```typescript
// Use Playwright's built-in retry mechanism
test.configure({ retries: 2 }); // Per-test retry

// Or configure globally in playwright.config.ts
retries: 2,
```

## 8. Performance Monitoring

### Track API Response Times
```typescript
const startTime = Date.now();
await app.api.sales.createInvoiceAPI(data);
const duration = Date.now() - startTime;
Logger.performance(`Invoice creation took ${duration}ms`);
```

### Track UI Response Times
```typescript
await page.goto('/customers');
const loadTime = await page.evaluate(() => performance.timing.loadEventEnd - performance.timing.navigationStart);
Logger.performance(`Page load time: ${loadTime}ms`);
```

## 9. Screenshot and Trace Management

### Automatic on Failure
```typescript
// Configured in playwright.config.ts
use: {
  trace: 'retain-on-failure',
  screenshot: 'on',
  video: 'on',
}
```

### Manual Screenshots
```typescript
await page.screenshot({ path: 'screenshots/customer-profile.png' });
Logger.snapshot('Screenshot saved: customer-profile.png');
```

## 10. CI/CD Integration

### Environment Variables
```bash
# CI Environment
BEFFA_USER=ci_user
BEFFA_PASSWORD=ci_password
BASE_URL=https://staging.example.com
DEBUG=false  # Disable debug logs in CI
```

### Local Development
```bash
# Local Environment
DEBUG=true  # Enable debug logs locally
BASE_URL=http://localhost:4173
```
