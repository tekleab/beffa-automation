import { isolatedTest as test, expect } from "../../lib/fixtures/isolated-fixtures";
import {
  InvoiceSchema,
  BillSchema,
  CustomerSchema,
  VendorSchema,
  AccountSchema,
  WarehouseSchema,
  LocationSchema,
  EmployeeSchema
} from "../../lib/schemas";

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

  test("Customer API response matches strict schema contract", async ({ app, validateSchema }) => {
    const { apiBase, headers, qs } = await app.buildApiContext();
    const resp = await app.page.request.get(`${apiBase}/customers?page=1&pageSize=5&${qs}`, { headers });
    expect(resp.ok()).toBe(true);
    const body = await resp.json();
    const items = body.items || body.data || (Array.isArray(body) ? body : []);
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    const validation = validateSchema(first, CustomerSchema, {
      endpoint: "/api/customers",
      label: "Customer DTO Contract"
    });
    expect(validation.success, `Schema violation: ${validation.errors?.join("; ")}`).toBe(true);
    console.log(`[PASS] Customer (${first.id}) matches CustomerSchema contract`);
  });

  test("Vendor API response matches strict schema contract", async ({ app, validateSchema }) => {
    const { apiBase, headers, qs } = await app.buildApiContext();
    const resp = await app.page.request.get(`${apiBase}/vendors?page=1&pageSize=5&${qs}`, { headers });
    expect(resp.ok()).toBe(true);
    const body = await resp.json();
    const items = body.items || body.data || (Array.isArray(body) ? body : []);
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    const validation = validateSchema(first, VendorSchema, {
      endpoint: "/api/vendors",
      label: "Vendor DTO Contract"
    });
    expect(validation.success, `Schema violation: ${validation.errors?.join("; ")}`).toBe(true);
    console.log(`[PASS] Vendor (${first.id}) matches VendorSchema contract`);
  });

  test("Account & General Ledger API response matches strict schema contract", async ({ app, validateSchema }) => {
    const { apiBase, headers, qs } = await app.buildApiContext();
    const resp = await app.page.request.get(`${apiBase}/accounts?page=1&pageSize=5&${qs}`, { headers });
    expect(resp.ok()).toBe(true);
    const body = await resp.json();
    const items = body.items || body.data || (Array.isArray(body) ? body : []);
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    const validation = validateSchema(first, AccountSchema, {
      endpoint: "/api/accounts",
      label: "Account DTO Contract"
    });
    expect(validation.success, `Schema violation: ${validation.errors?.join("; ")}`).toBe(true);
    console.log(`[PASS] Account (${first.name}) matches AccountSchema contract`);
  });

  test("Warehouse & Location API response matches strict schema contract", async ({ app, validateSchema }) => {
    const { apiBase, headers, qs } = await app.buildApiContext();
    const whResp = await app.page.request.get(`${apiBase}/warehouses?page=1&pageSize=5&${qs}`, { headers });
    expect(whResp.ok()).toBe(true);
    const whBody = await whResp.json();
    const warehouses = whBody.items || whBody.data || (Array.isArray(whBody) ? whBody : []);
    expect(warehouses.length).toBeGreaterThan(0);

    const firstWh = warehouses[0];
    const whValidation = validateSchema(firstWh, WarehouseSchema, {
      endpoint: "/api/warehouses",
      label: "Warehouse DTO Contract"
    });
    expect(whValidation.success, `Schema violation: ${whValidation.errors?.join("; ")}`).toBe(true);

    const locResp = await app.page.request.get(`${apiBase}/locations?page=1&pageSize=5&${qs}`, { headers });
    expect(locResp.ok()).toBe(true);
    const locBody = await locResp.json();
    const locations = locBody.items || locBody.data || (Array.isArray(locBody) ? locBody : []);
    expect(locations.length).toBeGreaterThan(0);

    const firstLoc = locations[0];
    const locValidation = validateSchema(firstLoc, LocationSchema, {
      endpoint: "/api/locations",
      label: "Location DTO Contract"
    });
    expect(locValidation.success, `Schema violation: ${locValidation.errors?.join("; ")}`).toBe(true);
    console.log(`[PASS] Warehouse & Location match schema contracts`);
  });

  test("Employee API response matches strict schema contract", async ({ app, validateSchema }) => {
    const { apiBase, headers, qs } = await app.buildApiContext();
    const resp = await app.page.request.get(`${apiBase}/employees?page=1&pageSize=5&${qs}`, { headers });
    expect(resp.ok()).toBe(true);
    const body = await resp.json();
    const items = body.items || body.data || (Array.isArray(body) ? body : []);
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    const validation = validateSchema(first, EmployeeSchema, {
      endpoint: "/api/employees",
      label: "Employee DTO Contract"
    });
    expect(validation.success, `Schema violation: ${validation.errors?.join("; ")}`).toBe(true);
    console.log(`[PASS] Employee (${first.id}) matches EmployeeSchema contract`);
  });
});

