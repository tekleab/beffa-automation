import { test as base } from '@playwright/test';
import { ApiClient } from '../core/ApiClient';
import { WorkerDataFactory } from '../utils/WorkerDataFactory';
import { StructuredLogger, LogLevel } from './StructuredLogger';

type InventoryFixtures = {
  apiClient: ApiClient;
  workerItem: any;
};

export const test = base.extend<InventoryFixtures>({
  apiClient: async ({}, use) => {
    const client = new ApiClient();
    await use(client);
    await client.dispose();
  },

  workerItem: async ({ apiClient }, use, testInfo) => {
    // Generate unique data per worker
    const itemData = WorkerDataFactory.createItemPayload(testInfo.workerIndex);
    
    const item = await apiClient.safePost('/inventory-items', itemData);
    
    try {
      await use(item);
    } finally {
      // Isolated cleanup per test
      StructuredLogger.log(LogLevel.INFO, `Cleaning up worker item: ${item.id}`);
      await apiClient.safeDelete(`/inventory-items/${item.id}`).catch(() => {
        // Fallback for ERPs that block deletion: mark as inactive
        apiClient.safePatch(`/inventory-items/${item.id}`, { status: 'inactive' });
      });
    }
  }
});