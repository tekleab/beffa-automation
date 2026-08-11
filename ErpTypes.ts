/**
 * BEFFA ERP Data Transfer Objects (DTOs)
 * Reflects confirmed DTO contract as of v7 (post-backend DTO refactor).
 *
 * Key DTO changes:
 *   - inventory_item_locations stripped from GET /inventory-item/{id} — use /locations sub-endpoint
 *   - po_items stripped from GET /purchase-order/{id} — capture from POST creation response
 *   - po_item_id removed from received_purchase_order_items on bill responses — match by item.id
 *   - is_write_down must be string "true"/"false", not boolean
 *   - purchase_type_id must be number, not string
 */

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryItemPayload {
  name: string;
  type: 'inventory';
  item_id?: string;
  part_number?: string;
  item_class?: string;
  /** Must be 0 for new items — stock injected via adjustment */
  quantity?: number;
  unit_cost?: number;
  initial_stock?: number;
  purchase_price?: number;
  selling_price?: number;
  default_location_id?: string;
  default_warehouse_id?: string;
  cost_method_code?: 'WAC' | 'FIFO' | 'AVERAGE';
  category?: string;
  gl_cost_account_id?: string;
  gl_inventory_account_id?: string;
  gl_sales_account_id?: string;
  unit_of_measurement?: string;
  serial?: string;
  status?: 'active' | 'inactive';
  min_stock?: number;
  description?: Array<{ content: string; type: 'item' | 'sales' | 'purchase' }>;
}

/** Response from GET /inventory-item/{id} — inventory_item_locations is always [] after DTO refactor */
export interface InventoryItemDetailResponse {
  id: string;
  name: string;
  /** Creation-time initial stock only — NOT live stock */
  quantity: number;
  unit_cost: number;
  cost_method_code: string;
  status: string;
  /** Always [] after DTO refactor — use GET /inventory-item/{id}/locations instead */
  inventory_item_locations: [];
  fifo_layers?: any[];
}

/** Response from GET /inventory-item/{id}/locations — the ONLY live stock source */
export interface InventoryLocationStock {
  id: string;        // location UUID
  name: string;
  quantity: number;  // live stock at this location
  ref?: string;
  type?: string;
  // NOTE: no warehouse_id on this endpoint — resolve separately if needed
}

export interface InventoryAdjustmentPayload {
  adjusted_by: 'quantity' | 'cost';
  adjusted_quantity: number;
  adjusted_cost: number;
  adjustment_account_id: string;
  inventory_item_id: string;
  /** Must be string "true" or "false" — boolean is rejected with 422 */
  is_write_down: 'true' | 'false';
  location_id: string;
  warehouse_id: string;
  date: string;
  reason: string;
  note: string;
  unit_cost: number;
  unit_price: number;
  total_cost: number;
  /** Must match actual ERP state — mismatch causes 422 */
  current_quantity: number;
  /** Must match actual ERP state — mismatch causes 422 */
  location_quantity: number;
  skip_draft: boolean;
  status: 'draft';
}

// ─── Purchase ─────────────────────────────────────────────────────────────────

export interface PurchaseOrderPayload {
  vendor_id: string;
  po_date: string;
  /** Must be number — string "4" causes 422 */
  purchase_type_id: number;
  currency_id: string;
  accounts_payable_id: string;
  po_items: Array<{
    item_id: string;
    quantity: number;
    unit_price: number;
    location_id?: string;
    warehouse_id?: string;
    general_ledger_account_id?: string;
    tax_id?: string | null;
    description?: string;
  }>;
}

/** po_items are ONLY present on the POST creation response — GET /purchase-order/{id} strips them */
export interface PurchaseOrderCreationResponse {
  id: string;
  po_number: string;
  vendor_id: string;
  currency_id: string;
  /** Capture these immediately — they are not available via GET */
  po_items: Array<{
    id: string;
    item_id: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface BillPayload {
  vendor_id: string;
  invoice_date: string;
  due_date: string;
  currency_id: string;
  accounts_payable_id: string;
  /** Standalone bill items (no PO link) */
  items: any[];
  /** PO-linked receipt items — po_item_id must come from PO creation response */
  received_purchase_order_items?: Array<{
    po_item_id: string;
    received_quantity: number;
    received_unit_price: number;
  }>;
  purchase_order_id?: string | null;
  status: 'draft';
}

/** received_purchase_order_items on bill RESPONSE — po_item_id is stripped, match by item.id */
export interface BillReceivedItemResponse {
  id: string;
  item: { id: string; name: string };
  received_quantity: number;
  received_unit_price: number;
  amount: number;
  // po_item_id is NOT present after DTO refactor
}

// ─── Sales ────────────────────────────────────────────────────────────────────

export interface SalesOrderPayload {
  customer_id: string;
  accounts_receivable_id: string;
  currency_id: string;
  so_date: string;
  status: 'draft';
  so_items: Array<{
    item_id: string;
    quantity: number;
    unit_price: number;
    amount: number;
    general_ledger_account_id: string;
    warehouse_id: string;
    location_id: string;
    tax_id?: string | null;
    description?: string;
  }>;
}

export interface InvoicePayload {
  customer_id: string;
  accounts_receivable_id: string;
  currency_id: string;
  invoice_date: string;
  due_date: string;
  status: 'draft';
  /** SO-linked release items — so_item_id must come from SO creation response */
  released_sales_order_items: Array<{
    so_item_id: string;
    released_quantity: number;
    warehouse_id: string;
    location_id: string;
  }>;
  /** Standalone invoice items (no SO link) */
  items?: any[];
}

// ─── HR ───────────────────────────────────────────────────────────────────────

export interface EmployeePayload {
  name: string;
  email: string;
  phone?: string;
  department_id: string;
  job_position_id: string;
  hire_date?: string;
  employment_type?: string;
}

/**
 * POST /employees returns null body (Known Bug #12).
 * Never assert on the response body — always use the retry-scan fallback.
 */
export type EmployeeCreationResponse = null;

export interface PayrollRunPayload {
  event_name: string;
  start_date: string;
  end_date: string;
  pay_date: string;
}

/**
 * GET /payroll-runs/{id}/employees always returns total=1 (Known Bug #11).
 * Never assert on total count — assert on the data array length instead.
 */
export interface PayrollRunEmployeesResponse {
  /** Always 1 regardless of actual count — do not assert on this */
  total: number;
  data: any[];
}