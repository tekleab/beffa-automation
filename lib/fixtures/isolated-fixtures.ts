import { test as base, expect } from "@playwright/test";
import { AppManager } from "../../pages/AppManager";
import { validateSchema } from "../schemas";

export interface SalesTestContext {
  customerId: string;
  itemId: string;
  itemName: string;
  locationId: string;
  warehouseId: string;
  arAccountId: string;
  salesAccountId: string;
  currencyId: string;
  unitCost: number;
  currentStock: number;
}

export interface PurchaseTestContext {
  vendorId: string;
  itemId: string;
  itemName: string;
  locationId: string;
  warehouseId: string;
  apAccountId: string;
  expenseAccountId: string;
  currencyId: string;
  unitCost: number;
  currentStock: number;
}

export interface IsolatedFixtures {
  app: AppManager;
  salesContext: SalesTestContext;
  purchaseContext: PurchaseTestContext;
  validateSchema: typeof validateSchema;
}

export const isolatedTest = base.extend<IsolatedFixtures>({
  app: async ({ page }, use) => {
    const appMgr = new AppManager(page);
    await appMgr.login(process.env.BEFFA_USER, process.env.BEFFA_PASS);
    await use(appMgr);
  },

  salesContext: async ({ app }, use) => {
    const meta = await app.api.sales.discoverMetadataAPI();
    const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: "FIFO", quantity: 50, unit_cost: 100 });

    await use({
      customerId: meta.customerId,
      itemId: item.itemId,
      itemName: item.itemName,
      locationId: item.locationId,
      warehouseId: item.warehouseId,
      arAccountId: meta.arAccountId,
      salesAccountId: (meta as any).salesAccountId || meta.arAccountId,
      currencyId: meta.currencyId,
      unitCost: item.unitCost || 100,
      currentStock: item.currentStock
    });
  },

  purchaseContext: async ({ app }, use) => {
    const meta = await app.api.purchase.discoverMetadataAPI();
    const item = await app.api.inventory.createFreshItemWithStockAPI({ cost_method_code: "FIFO", quantity: 50, unit_cost: 100 });

    await use({
      vendorId: meta.vendorId,
      itemId: item.itemId,
      itemName: item.itemName,
      locationId: item.locationId,
      warehouseId: item.warehouseId,
      apAccountId: meta.apAccountId,
      expenseAccountId: (meta as any).expenseAccountId || meta.apAccountId,
      currencyId: meta.currencyId,
      unitCost: item.unitCost || 100,
      currentStock: item.currentStock
    });
  },

  validateSchema: async ({}, use) => {
    await use(validateSchema);
  }
});

export { expect };
