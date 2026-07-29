import { test as base } from '@playwright/test';
import { ApiClient } from '../../lib/core/ApiClient';
import { StructuredLogger } from '../../lib/core/StructuredLogger';
import { MetricsCollector } from '../../lib/core/MetricsCollector';
import { getTestDataFactory, TestDataFactory } from '../../lib/factories/TestDataFactory';
import { getWorkerIsolation, WorkerIsolation } from '../../lib/core/WorkerIsolation';

export interface GlobalFixtures {
  logger: StructuredLogger;
  metrics: MetricsCollector;
  testDataFactory: TestDataFactory;
  workerIsolation: WorkerIsolation;
}

export const test = base.extend<GlobalFixtures>({
  logger: async ({}, use) => {
    const logger = new StructuredLogger('TestFixture');
    await use(logger);
  },

  metrics: async ({}, use) => {
    const metrics = new MetricsCollector();
    await use(metrics);
    metrics.printSummary();
  },

  testDataFactory: async ({}, use) => {
    const factory = getTestDataFactory();
    await use(factory);
    factory.clearCache();
  },

  workerIsolation: async ({}, use) => {
    const isolation = getWorkerIsolation();
    await use(isolation);
    isolation.releaseAllLocks();
  }
});

export interface ApiFixtures {
  apiClient: ApiClient;
}

export const apiTest = base.extend<ApiFixtures & GlobalFixtures>({
  logger: async ({}, use) => {
    const logger = new StructuredLogger('ApiTestFixture');
    await use(logger);
  },

  metrics: async ({}, use) => {
    const metrics = new MetricsCollector();
    await use(metrics);
    metrics.printSummary();
  },

  testDataFactory: async ({}, use) => {
    const factory = getTestDataFactory();
    await use(factory);
    factory.clearCache();
  },

  workerIsolation: async ({}, use) => {
    const isolation = getWorkerIsolation();
    await use(isolation);
    isolation.releaseAllLocks();
  },

  apiClient: async ({}, use) => {
    const apiClient = new ApiClient();
    await use(apiClient);
    await apiClient.dispose();
  }
});
