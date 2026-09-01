import { z } from "zod";
import { printBackendBugBanner } from "../utils/ValidationHelper";

export const UUIDSchema = z.string().uuid({ message: "Must be a valid UUID" });
export const PositiveNumberSchema = z.number().positive({ message: "Must be greater than 0" });
export const NonNegativeNumberSchema = z.number().min(0, { message: "Cannot be negative" });

export const DateStringSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  { message: "Must be a valid ISO date string" }
);

export const PaginationSchema = z.object({
  page: z.union([z.number(), z.string()]).optional(),
  pageSize: z.union([z.number(), z.string()]).optional(),
  total: z.union([z.number(), z.string()]).optional()
});

export const SalesOrderSchema = z.object({
  id: UUIDSchema,
  so_number: z.string().min(1).optional(),
  customer_id: UUIDSchema.optional(),
  status: z.string(),
  total_amount: z.union([z.number(), z.string()]).optional(),
  currency_id: z.string().optional()
}).passthrough();

export const InvoiceItemSchema = z.object({
  id: UUIDSchema.optional(),
  item_id: UUIDSchema.optional(),
  quantity: z.number().positive(),
  unit_price: z.number().min(0),
  amount: z.number().min(0).optional()
}).passthrough();

export const InvoiceSchema = z.object({
  id: UUIDSchema,
  invoice_number: z.string().min(1).optional(),
  customer_id: UUIDSchema.optional(),
  status: z.string(),
  total_amount: z.union([z.number(), z.string()]).optional(),
  unreceived_amount: z.union([z.number(), z.string()]).optional()
}).passthrough();

export const ReceiptSchema = z.object({
  id: UUIDSchema,
  receipt_number: z.string().optional(),
  customer_id: UUIDSchema.optional(),
  cash_account_id: UUIDSchema.optional(),
  amount: z.number().positive(),
  status: z.string().optional()
}).passthrough();

export const PurchaseOrderSchema = z.object({
  id: UUIDSchema,
  po_number: z.string().optional(),
  vendor_id: UUIDSchema.optional(),
  status: z.string()
}).passthrough();

export const BillSchema = z.object({
  id: UUIDSchema,
  invoice_number: z.string().optional(),
  vendor_id: UUIDSchema.optional(),
  status: z.string(),
  total_amount: z.union([z.number(), z.string()]).optional(),
  unpaid_amount: z.union([z.number(), z.string()]).optional()
}).passthrough();

export const BillPaymentSchema = z.object({
  id: UUIDSchema,
  payment_number: z.string().optional(),
  vendor_id: UUIDSchema.optional(),
  amount: z.number().positive(),
  status: z.string().optional()
}).passthrough();

export const InventoryItemSchema = z.object({
  id: UUIDSchema,
  name: z.string().min(1),
  cost_method_code: z.enum(["WAC", "FIFO", "LIFO"]).optional(),
  unit_cost: z.union([z.number(), z.string()]).optional(),
  selling_price: z.union([z.number(), z.string()]).optional()
}).passthrough();

export const JournalEntrySchema = z.object({
  id: UUIDSchema.optional(),
  debit: z.union([z.number(), z.string()]),
  credit: z.union([z.number(), z.string()]),
  account_id: UUIDSchema.optional()
}).passthrough();

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export function validateSchema<T>(
  data: unknown,
  schema: z.ZodType<T>,
  options: { endpoint?: string; label?: string } = {}
): SchemaValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const formattedErrors = result.error.issues.map(
    issue => `${issue.path.join(".") || "root"}: ${issue.message}`
  );

  printBackendBugBanner({
    defectTitle: `Schema Contract Violation: ${options.label || "API Response"}`,
    endpoint: options.endpoint || "/api/...",
    statusCode: 200,
    expectedStatus: "Valid Schema Match",
    rootCause: `Payload returned unexpected schema: ${formattedErrors.join("; ")}`,
    responsePreview: data
  });

  return { success: false, errors: formattedErrors };
}
