/**
 * BEFFA ERP Data Transfer Objects (DTOs)
 * Ensures type safety for API payloads and responses.
 */

export interface InventoryItemPayload {
  name: string;
  item_id?: string;
  part_number?: string;
  item_class?: string;
  quantity?: number;
  unit_cost?: number;
  default_location_id?: string;
  default_warehouse_id?: string;
  cost_method_code?: string;
  category?: string;
  gl_cost_account_id?: string;
  gl_inventory_account_id?: string;
  gl_sales_account_id?: string;
}

export interface PurchaseOrderPayload {
  vendor_id: string;
  po_date: string;
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

export interface BillPayload {
  vendor_id: string;
  invoice_date: string;
  due_date: string;
  currency_id: string;
  accounts_payable_id: string;
  items: any[];
  received_purchase_order_items?: any[];
  purchase_order_id?: string | null;
  status: 'draft' | 'approved';
}