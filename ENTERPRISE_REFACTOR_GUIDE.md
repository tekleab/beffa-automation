# Enterprise-Grade Playwright Refactor - Migration Guide

## Overview

This guide documents the enterprise-grade refactoring of the Playwright + TypeScript ERP automation framework. The refactoring addresses critical issues related to concurrency stability, API lifecycle management, observability, and enterprise scalability.

## Problems Solved

### 1. Request Context Disposal
**Problem:** `page.request` is tied to the Page lifecycle. When tests timeout or fail, Playwright disposes the page/context, but retry loops continue executing with disposed contexts.

**Solution:** Implemented dedicated `APIRequestContext` management via `ApiClient.ts`, completely decoupled from page lifecycle.

### 2. Zombie Retries After Test Timeout
**Problem:** Retry loops use `page.waitForTimeout()` which throws when test ends, but the loop doesn't check for test abortion signals.

**Solution:** Implemented cancellation-aware `RetryManager.ts` with `AbortController` integration and native Promise-based waits (no page.waitForTimeout).

### 3. beforeAll Scaling Issues
**Problem:** Heavy test data creation in beforeAll hooks runs serially per test file, causing 120-second timeouts and DB contention when multiple workers create data simultaneously.

**Solution:** Moved expensive setup to `globalSetup.ts`, implemented worker-safe test data generation, and added shared metadata caching.

## New Architecture

### Folder Structure

```
beffa-automation/
├── lib/
│   ├── api/
│   │   ├── ApiClient.ts           # Dedicated APIRequestContext wrapper
│   │   ├── TokenManager.ts        # Token lifecycle management
│   │   ├── InventoryAPI.ts        # Inventory-specific API calls (future)
│   │   ├── SalesAPI.ts            # Sales-specific API calls (future)
│   │   └── PurchasingAPI.ts       # Purchasing-specific API calls (future)
│   ├── core/
│   │   ├── RetryManager.ts        # Cancellation-aware retry logic
│   │   ├── StructuredLogger.ts    # Observability logging
│   │   ├── MetricsCollector.ts    # Request timing metrics
│   │   ├── TelemetryManager.ts    # Session telemetry and export
│   │   └── WorkerIsolation.ts      # Worker isolation and resource locking
│   ├── fixtures/
│   │   ├── InventoryFixture.ts     # Inventory test fixtures
│   │   ├── SalesFixture.ts        # Sales test fixtures (future)
│   │   └── AuthFixture.ts         # Authentication fixtures (future)
│   ├── factories/
│   │   ├── TestDataFactory.ts     # Worker-safe data generation
│   │   └── EntityGenerator.ts     # Unique entity creation (future)
│   ├── pages/
│   │   └── BasePage.ts            # Existing (can be incrementally migrated)
│   └── utils/
│       └── Logger.ts              # Existing logger (keep)
├── tests/
│   ├── fixtures/
│   │   └── global-fixtures.ts     # Global test fixtures
│   └── ... (existing test files)
├── global-setup.ts                # Refactored for enterprise scale
└── playwright.config.ts           # Update fixture configuration (future)
```

## New Components

### 1. ApiClient.ts

**Purpose:** Dedicated APIRequestContext wrapper that eliminates dependencies between API requests and page/browser lifecycle.

**Key Features:**
- Dedicated `APIRequestContext` per worker
- Automatic token management via `TokenManager`
- Cancellation-aware retry via `RetryManager`
- Request timing metrics via `MetricsCollector`
- Support for GET, POST, PUT, PATCH, DELETE

**Usage:**
```typescript
import { ApiClient } from '../lib/api/ApiClient';

const apiClient = new ApiClient(request, { baseURL: 'http://localhost:8001' });
const response = await apiClient.get('/api/inventory/items');
await apiClient.dispose();
```

### 2. TokenManager.ts

**Purpose:** Centralized token lifecycle management with automatic refresh and caching.

**Key Features:**
- Automatic token refresh before expiry
- Token caching per user/company
- Configurable refresh threshold
- Graceful error handling

**Usage:**
```typescript
import { TokenManager } from '../lib/api/TokenManager';

const tokenManager = new TokenManager(request, {
  baseURL: 'http://localhost:8001',
  email: process.env.BEFFA_USER,
  password: process.env.BEFFA_PASS,
  refreshThreshold: 5 * 60 * 1000 // 5 minutes
});

const token = await tokenManager.getToken();
await tokenManager.dispose();
```

### 3. RetryManager.ts

**Purpose:** Cancellation-aware retry mechanism with exponential backoff and terminal error detection.

**Key Features:**
- Cancellation-aware via `AbortController`
- Exponential backoff (configurable)
- Terminal error detection (page closed, context destroyed, etc.)
- No `page.waitForTimeout` - uses native Promise-based waits
- Configurable retry attempts and delays

**Usage:**
```typescript
import { RetryManager } from '../lib/core/RetryManager';

const retryManager = new RetryManager(3); // 3 attempts
const result = await retryManager.execute(
  async () => {
    // Your operation here
    return await someOperation();
  },
  abortController.signal
);
```

### 4. StructuredLogger.ts

**Purpose:** Enterprise-grade structured logging with log levels and worker ID tracking.

**Key Features:**
- Log levels: DEBUG, INFO, WARN, ERROR
- Worker ID tracking for parallel execution
- Log entry history with filtering
- Console output with structured format

**Usage:**
```typescript
import { StructuredLogger, LogLevel } from '../lib/core/StructuredLogger';

const logger = new StructuredLogger('MyComponent', LogLevel.INFO);
logger.info('Operation started', { context: 'value' });
logger.warn('Operation slow', { duration: 5000 });
logger.error('Operation failed', error);
```

### 5. MetricsCollector.ts

**Purpose:** Request timing metrics collection and analysis.

**Key Features:**
- Automatic request timing
- P50, P95, P99 percentiles
- Slow endpoint detection
- Failed request tracking
- Summary statistics

**Usage:**
```typescript
import { MetricsCollector } from '../lib/core/MetricsCollector';

const metrics = new MetricsCollector();
await metrics.trackRequest('GET', '/api/items', async () => {
  return await apiClient.get('/api/items');
});

const summary = metrics.getSummary();
metrics.printSummary();
```

### 6. TelemetryManager.ts

**Purpose:** Session telemetry management with export capabilities.

**Key Features:**
- Session tracking with worker ID
- Test result aggregation
- JSON/CSV export
- Historical session aggregation
- Automatic cleanup of old files

**Usage:**
```typescript
import { getTelemetryManager } from '../lib/core/TelemetryManager';

const telemetry = getTelemetryManager();
telemetry.startSession(workerId);
telemetry.recordTest(true); // passed
telemetry.endSession();
telemetry.printSessionStats();
```

### 7. WorkerIsolation.ts

**Purpose:** Worker isolation and resource locking for parallel execution.

**Key Features:**
- Resource locking with timeout
- Worker-specific resource IDs
- Lock acquisition/release
- Deadlock prevention

**Usage:**
```typescript
import { getWorkerIsolation } from '../lib/core/WorkerIsolation';

const isolation = getWorkerIsolation();
const acquired = await isolation.acquireLock('resource-id', 30000);
if (acquired) {
  // Use resource
  isolation.releaseLock('resource-id');
}
```

### 8. TestDataFactory.ts

**Purpose:** Worker-safe test data generation with unique entity creation.

**Key Features:**
- Worker ID-based entity naming
- Timestamp-based uniqueness
- Collision detection
- Pre-built generators for common entities

**Usage:**
```typescript
import { getTestDataFactory } from '../lib/factories/TestDataFactory';

const factory = getTestDataFactory();
const item = factory.generateInventoryItem();
const customer = factory.generateCustomer();
const project = factory.generateProject();
```

### 9. InventoryFixture.ts

**Purpose:** Playwright fixtures for inventory test data management.

**Key Features:**
- Automatic test data creation
- Automatic cleanup
- Worker-safe data generation
- Integration with ApiClient

**Usage:**
```typescript
import { test, inventoryItemFixture } from '../lib/fixtures/InventoryFixture';

test.use(inventoryItemFixture);

test('inventory test', async ({ inventoryItem }) => {
  const item = inventoryItem.item;
  // Test logic
  // Automatic cleanup after test
});
```

### 10. Global Fixtures (tests/fixtures/global-fixtures.ts)

**Purpose:** Global test fixtures that provide common dependencies.

**Key Features:**
- Logger injection
- Metrics collection
- Test data factory
- Worker isolation
- API client and token manager

**Usage:**
```typescript
import { test, apiTest } from '../tests/fixtures/global-fixtures';

test('basic test', async ({ logger, testDataFactory }) => {
  logger.info('Test started');
  const item = testDataFactory.generateInventoryItem();
});

apiTest('API test', async ({ apiClient, tokenManager }) => {
  const response = await apiClient.get('/api/items');
});
```

## Migration Strategy

### Phase 1: Infrastructure (Completed)
- ✅ ApiClient.ts
- ✅ TokenManager.ts
- ✅ RetryManager.ts
- ✅ StructuredLogger.ts
- ✅ MetricsCollector.ts
- ✅ TelemetryManager.ts
- ✅ WorkerIsolation.ts
- ✅ TestDataFactory.ts
- ✅ InventoryFixture.ts
- ✅ Global fixtures
- ✅ GlobalSetup.ts refactor

### Phase 2: Incremental Migration (Recommended)
1. **Start new tests with new architecture**
   - Use `apiTest` from global-fixtures for new API tests
   - Use `InventoryFixture` for inventory-related tests
   - Use `TestDataFactory` for test data generation

2. **Migrate existing tests incrementally**
   - Identify high-value test files
   - Replace `page.request` calls with `ApiClient`
   - Replace `page.waitForTimeout` in retry logic with `RetryManager`
   - Add structured logging
   - Add metrics collection

3. **BasePage migration (Optional)**
   - The existing `BasePage.ts` can continue to work as-is
   - For new Page Objects, use `ApiClient` directly
   - For legacy Page Objects, they can be migrated incrementally

### Phase 3: Configuration Updates (Future)
- Update `playwright.config.ts` to use global fixtures
- Configure worker-specific settings
- Add telemetry export configuration
- Set up CI/CD integration

## Usage Examples

### Example 1: New API Test with New Architecture

```typescript
import { apiTest } from '../tests/fixtures/global-fixtures';
import { getTestDataFactory } from '../lib/factories/TestDataFactory';

apiTest('create inventory item', async ({ apiClient, logger, testDataFactory }) => {
  logger.info('Starting inventory item creation test');
  
  const item = testDataFactory.generateInventoryItem();
  
  const response = await apiClient.post('/api/inventory/items', {
    data: {
      name: item.name,
      code: item.code,
      type: 'Raw Material',
      quantity: 100
    }
  });
  
  if (!response.ok()) {
    logger.error('Failed to create inventory item', await response.text());
    throw new Error('Creation failed');
  }
  
  const createdItem = await response.json();
  logger.info(`Created item: ${createdItem.id}`);
});
```

### Example 2: Test with Inventory Fixture

```typescript
import { test, inventoryItemFixture } from '../lib/fixtures/InventoryFixture';

test.use(inventoryItemFixture);

test('inventory item operations', async ({ inventoryItem, logger }) => {
  const item = inventoryItem.item;
  logger.info(`Testing with item: ${item.id}`);
  
  // Test logic here
  // Automatic cleanup after test
});
```

### Example 3: Worker-Safe Data Generation

```typescript
import { test } from '@playwright/test';
import { getTestDataFactory } from '../lib/factories/TestDataFactory';
import { getWorkerIsolation } from '../lib/core/WorkerIsolation';

test('parallel-safe test', async () => {
  const factory = getTestDataFactory();
  const isolation = getWorkerIsolation();
  
  // Generate unique data per worker
  const item = factory.generateInventoryItem();
  
  // Acquire lock for shared resource
  const acquired = await isolation.acquireLock('shared-resource');
  if (acquired) {
    try {
      // Use shared resource
    } finally {
      isolation.releaseLock('shared-resource');
    }
  }
});
```

### Example 4: Observability Integration

```typescript
import { test } from '@playwright/test';
import { getTelemetryManager } from '../lib/core/TelemetryManager';
import { StructuredLogger } from '../lib/core/StructuredLogger';

test('observable test', async () => {
  const telemetry = getTelemetryManager();
  const logger = new StructuredLogger('ObservableTest');
  
  telemetry.startSession();
  logger.info('Test started');
  
  try {
    // Test logic
    telemetry.recordTest(true);
  } catch (error) {
    logger.error('Test failed', error);
    telemetry.recordTest(false);
  } finally {
    telemetry.endSession();
    telemetry.printSessionStats();
  }
});
```

## Benefits

### 1. Concurrency Stability
- Worker-safe data generation prevents DB contention
- Resource locking prevents race conditions
- Cancellation-aware retries prevent zombie operations

### 2. API Lifecycle Management
- Dedicated APIRequestContext eliminates page lifecycle dependencies
- Automatic token refresh prevents auth failures
- Proper resource cleanup prevents memory leaks

### 3. Observability
- Structured logging with worker ID tracking
- Request timing metrics with percentile analysis
- Session telemetry with export capabilities
- Slow endpoint detection

### 4. Enterprise Scalability
- Metadata caching reduces API calls
- Global setup moves expensive operations
- Worker isolation enables safe parallel execution
- Configurable retry and timeout strategies

## Configuration

### Environment Variables

The following environment variables are used by the new components:

- `BEFFA_USER`: Login username
- `BEFFA_PASS`: Login password
- `BEFFA_COMPANY`: Company name
- `BEFFA_YEAR`: Fiscal year (default: 2018)
- `BEFFA_PERIOD`: Period (default: yearly)
- `BEFFA_CALENDAR`: Calendar (default: ec)
- `BASE_URL`: Frontend URL
- `API_URL`: API URL
- `TEST_WORKER_INDEX`: Worker index (set by Playwright)
- `TEST_PARALLEL_INDEX`: Parallel index (set by Playwright)

### Telemetry Configuration

```typescript
import { getTelemetryManager } from '../lib/core/TelemetryManager';

const telemetry = getTelemetryManager({
  enabled: true,
  exportPath: '.telemetry',
  exportFormat: 'json',
  autoExport: true
});
```

## Troubleshooting

### Import Errors
If you see import errors for new modules, ensure:
1. The files exist in the correct locations
2. TypeScript can resolve the paths
3. Run `npx tsc --noEmit` to check for compilation errors

### Worker Isolation Issues
If tests fail due to resource locking:
1. Increase lock timeout in `WorkerIsolation.ts`
2. Check for deadlocks in test logic
3. Ensure locks are released in finally blocks

### Token Refresh Issues
If token refresh fails:
1. Check credentials in environment variables
2. Verify API URL is correct
3. Check network connectivity
4. Review token refresh threshold

## Next Steps

1. **Review the new components** - Understand how each component works
2. **Start with new tests** - Use the new architecture for new test files
3. **Migrate incrementally** - Gradually migrate existing high-value tests
4. **Monitor metrics** - Use telemetry to identify slow tests and endpoints
5. **Optimize based on data** - Use metrics to optimize retry strategies and timeouts

## Support

For questions or issues with the enterprise refactor:
1. Review this guide
2. Check the component documentation in source files
3. Review the test examples in `tests/fixtures/`
4. Check telemetry logs for runtime issues
