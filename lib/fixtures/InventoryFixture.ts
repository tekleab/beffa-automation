import { test as base } from '@playwright/test';
import { ApiClient } from '../core/ApiClient';
import { getTestDataFactory, TestDataFactory } from '../factories/TestDataFactory';
import { StructuredLogger } from '../core/StructuredLogger';

export interface InventoryFixtureOptions {
  apiClient: ApiClient;
  testDataFactory: TestDataFactory;
  logger: StructuredLogger;
}

export interface InventoryItem {
  id: string;
  name: string;
  code: string;
  type: string;
  quantity: number;
  unitPrice: number;
  status: string;
}

export interface InventoryTestData {
  item: InventoryItem;
  cleanup: () => Promise<void>;
}

export const test = base.extend<InventoryFixtureOptions>({
  logger: async ({}, use) => {
    const logger = new StructuredLogger('InventoryFixture');
    await use(logger);
  },

  testDataFactory: async ({}, use) => {
    const factory = getTestDataFactory();
    await use(factory);
    factory.clearCache();
  },

  apiClient: async ({ request }, use) => {
    const apiClient = new ApiClient();
    await use(apiClient);
    await apiClient.dispose();
  }
});

export async function createInventoryItem(
  apiClient: ApiClient,
  testDataFactory: TestDataFactory,
  logger: StructuredLogger
): Promise<InventoryTestData> {
  logger.info('Creating inventory test item');

  const entity = testDataFactory.generateInventoryItem();
  const itemData = {
    name: entity.name,
    code: entity.code,
    type: 'Raw Material',
    quantity: 100,
    unitPrice: 50.00,
    status: 'Active'
  };

  try {
    const response = await apiClient.post('/api/inventory/items', { data: itemData });

    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`Failed to create inventory item: ${error}`);
    }

    const createdItem = await response.json();
    logger.info(`Created inventory item: ${createdItem.id}`);

    return {
      item: createdItem,
      cleanup: async () => {
        logger.info(`Cleaning up inventory item: ${createdItem.id}`);
        try {
          await apiClient.delete(`/api/inventory/items/${createdItem.id}`);
        } catch (error) {
          logger.warn(`Failed to cleanup inventory item: ${error}`);
        }
      }
    };
  } catch (error) {
    logger.error('Failed to create inventory item', error);
    throw error;
  }
}

export async function createInventoryItems(
  apiClient: ApiClient,
  testDataFactory: TestDataFactory,
  logger: StructuredLogger,
  count: number
): Promise<InventoryTestData[]> {
  logger.info(`Creating ${count} inventory test items`);

  const items: InventoryTestData[] = [];
  for (let i = 0; i < count; i++) {
    const itemData = await createInventoryItem(apiClient, testDataFactory, logger);
    items.push(itemData);
  }

  return items;
}

export async function getInventoryItemByCode(
  apiClient: ApiClient,
  code: string,
  logger: StructuredLogger
): Promise<InventoryItem | null> {
  logger.info(`Fetching inventory item by code: ${code}`);

  try {
    const response = await apiClient.get(`/api/inventory/items?code=${code}`);
    if (!response.ok()) return null;

    const data = await response.json();
    const items = data.items || data.data || [];
    return items.length ? items[0] : null;
  } catch (error) {
    logger.error('Failed to fetch inventory item', error);
    return null;
  }
}

export async function cleanupInventoryItems(items: InventoryTestData[], logger: StructuredLogger): Promise<void> {
  logger.info(`Cleaning up ${items.length} inventory items`);
  for (const item of items) await item.cleanup();
}

export const inventoryItemFixture = test.extend<{ inventoryItem: InventoryTestData }, InventoryFixtureOptions>({
  inventoryItem: async ({ apiClient, testDataFactory, logger }, use) => {
    const itemData = await createInventoryItem(apiClient, testDataFactory, logger);
    await use(itemData);
    await itemData.cleanup();
  }
});

export const inventoryItemsFixture = test.extend<{ inventoryItems: InventoryTestData[] }, InventoryFixtureOptions>({
  inventoryItems: async ({ apiClient, testDataFactory, logger }, use) => {
    const items = await createInventoryItems(apiClient, testDataFactory, logger, 3);
    await use(items);
    await cleanupInventoryItems(items, logger);
  }
});
