export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "superadmin";
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  cable_type: string;
  description?: string;
  unit_price: number;
  unit: string;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Production {
  id: string;
  product_id: string;
  quantity_produced: number;
  production_date: string;
  batch_number?: string;
  produced_by: string;
  quality_check: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionRecord extends Production {
  product_name?: string;
  materials_used?: string;
  status?: "in_progress" | "completed" | "failed";
}

export interface Inventory {
  id: string;
  product_id: string;
  current_stock: number;
  last_updated: string;
  warehouse_location?: string;
  min_threshold: number;
  max_threshold: number;
  product?: Product;
}

export interface Sale {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  sale_date: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  final_amount: number;
  payment_status: "pending" | "paid" | "partial" | "overdue";
  payment_method?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  sale_items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product?: Product;
}

export interface Purchase {
  id: string;
  purchase_order_number: string;
  supplier_name: string;
  supplier_email?: string;
  supplier_phone?: string;
  supplier_address?: string;
  purchase_date: string;
  total_amount: number;
  tax_amount: number;
  final_amount: number;
  payment_status: "pending" | "paid" | "partial";
  payment_method?: string;
  expected_delivery_date?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  purchase_items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity: number;
  created_at: string;
  product?: Product;
}

export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  position: string;
  department?: string;
  hire_date: string;
  salary: number;
  bank_account?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SalaryPayment {
  id: string;
  employee_id: string;
  payment_month: string;
  basic_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_pay: number;
  deductions: number;
  net_salary: number;
  payment_date: string;
  status: "pending" | "paid";
  created_at: string;
  updated_at: string;
}

export interface Billing {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  billing_date: string;
  due_date: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  final_amount: number;
  payment_status: "pending" | "paid" | "partial" | "overdue";
  payment_method?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  billing_items?: BillingItem[];
}

export interface BillingItem {
  id: string;
  billing_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}
