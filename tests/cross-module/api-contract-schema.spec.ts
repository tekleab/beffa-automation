import { isolatedTest as test, expect } from "../../lib/fixtures/isolated-fixtures";
import { InvoiceSchema, BillSchema } from "../../lib/schemas";

test.describe("API Contract & Runtime Schema Validation @smoke @regression @full", () => {
  test.setTimeout(60000);

  test("Sales Invoice API response matches strict schema contract", async ({ app, salesContext, validateSchema }) => {
    const inv = await app.api.sales.createStandaloneInvoiceAPI({
      customerId: salesContext.customerId,
      itemId: salesContext.itemId,
      quantity: 1,
      unitPrice: 500,
      locationId: salesContext.locationId,
      warehouseId: salesContext.warehouseId
    });

    expect(inv.success).toBe(true);
    expect(inv.id).toBeDefined();

    const rawInvoice = await app.api.sales.getInvoiceAPI(inv.id);
    const validation = validateSchema(rawInvoice, InvoiceSchema, {
      endpoint: `/api/invoices/${inv.id}`,
      label: "Single Invoice GET Contract"
    });

    expect(validation.success, `Schema violation: ${validation.errors?.join("; ")}`).toBe(true);
    console.log(`[PASS] Invoice ${inv.ref} strictly matches Zod runtime contract`);
  });

  test("Purchase Bill API response matches strict schema contract", async ({ app, purchaseContext, validateSchema }) => {
    const bill = await app.api.purchase.createBillAPI({
      vendorId: purchaseContext.vendorId,
      itemId: purchaseContext.itemId,
      quantity: 2,
      unitPrice: 100,

    });

    expect(bill.success).toBe(true);
    expect(bill.id).toBeDefined();

    const rawBill = await app.api.purchase.getBillAPI(bill.id);
    const validation = validateSchema(rawBill, BillSchema, {
      endpoint: `/api/bills/${bill.id}`,
      label: "Single Bill GET Contract"
    });

    expect(validation.success, `Schema violation: ${validation.errors?.join("; ")}`).toBe(true);
    console.log(`[PASS] Bill ${bill.ref} strictly matches Zod runtime contract`);
  });
});
