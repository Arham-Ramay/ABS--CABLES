// Database table names and constants
export const TABLES = {
  EMPLOYEES: "employees",
  PRODUCTION_RECORDS: "production_records",
  INVENTORY: "inventory",
  PURCHASE_ORDERS: "purchase_orders",
  PURCHASE_ORDER_ITEMS: "purchase_order_items",
  SALES_ORDERS: "sales_orders",
  SALES_ORDER_ITEMS: "sales_order_items",
  INVOICES: "invoices",
  INVOICE_ITEMS: "invoice_items",
  SETTINGS: "settings",
} as const;

// Status constants
export const EMPLOYEE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export const PRODUCTION_STATUS = {
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUS = {
  UNPAID: "unpaid",
  PARTIAL: "partial",
  PAID: "paid",
} as const;

export const INVENTORY_STATUS = {
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock",
  DISCONTINUED: "discontinued",
} as const;

// Department constants
export const DEPARTMENTS = [
  "Production",
  "Sales",
  "Inventory",
  "Purchase",
  "Billing",
  "Management",
] as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  NOT_FOUND: "Record not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
} as const;
