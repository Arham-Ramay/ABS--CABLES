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
  name: string;
  category: "copper" | "pvc" | "packing_boxes" | "scrap" | "stamps" | "coils";
  description?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  min_stock_level: number;
  location?: string;
  status: "available" | "out_of_stock" | "reserved" | "damaged";
  supplier?: string;
  purchase_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  category_specific_fields?: Record<string, any>;

  // Copper specific fields
  copper_type?: string;
  copper_grade?: string;
  copper_purity?: number;
  copper_thickness?: number;
  copper_conductivity?: string;

  // PVC specific fields
  pvc_type?: string;
  pvc_grade?: string;
  pvc_color?: string;
  pvc_thickness?: number;
  pvc_hardness?: string;
  pvc_temperature_rating?: string;

  // Packing Boxes specific fields
  box_type?: string;
  box_dimensions?: string;
  box_material?: string;
  box_capacity_weight?: number;
  box_capacity_volume?: number;

  // Scrap specific fields
  scrap_type?: string;
  scrap_source?: string;
  scrap_purity?: number;
  scrap_condition?: string;
  scrap_weight?: number;

  // Stamps specific fields
  stamp_type?: string;
  stamp_size?: string;
  stamp_material?: string;
  stamp_design?: string;
  stamp_quality?: string;

  // Coils specific fields
  coil_name?: string;
  coil_weight?: number;
  coil_length?: number;
  coil_thickness?: number;
  coil_diameter?: number;
  number_of_goats?: number;
  coil_material?: string;
  coil_grade?: string;
  coil_resistance?: number;
  coil_insulation?: string;
}

export interface Sale {
  id: string;

  // Party/Customer Information
  party_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  billing_address?: string;

  // Product Information
  coil_name: string;
  product_category?: string;
  product_description?: string;

  // Quantity and Pricing
  quantity: number;
  unit: string;
  unit_price: number;
  total_amount: number;

  // Financial Details
  tax_amount: number;
  discount_amount: number;
  final_amount: number;

  // Accounting Fields
  debit: number;
  credit: number;
  payment_status: "pending" | "paid" | "partial" | "overdue";
  payment_method?: string;
  payment_due_date?: string;

  // Transaction Details
  invoice_number?: string;
  sale_date: string;
  delivery_date?: string;

  // Status and Tracking
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  order_status:
    | "processing"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";

  // Comments and Notes
  comments?: string;
  internal_notes?: string;

  // Additional Fields
  reference_number?: string;
  terms_conditions?: string;
  delivery_address?: string;

  // Metadata
  created_by?: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
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
