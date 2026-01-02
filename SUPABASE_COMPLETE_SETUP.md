# ABS Cables - Supabase Database Setup

## Overview

This document contains the complete database schema and setup instructions for the ABS Cables Management System using Supabase.

## Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Tables

### 1. Employees Table

```sql
CREATE TABLE employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    salary DECIMAL(10,2),
    hire_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_active ON employees(is_active);
```

### 2. Production Records Table

```sql
CREATE TABLE production_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,
    quantity_produced INTEGER NOT NULL,
    production_date DATE NOT NULL,
    batch_number VARCHAR(100),
    produced_by UUID REFERENCES employees(id),
    quality_check BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_production_date ON production_records(production_date);
CREATE INDEX idx_production_employee ON production_records(produced_by);
CREATE INDEX idx_production_quality ON production_records(quality_check);
```

### 3. Inventory Table

```sql
CREATE TABLE inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_code VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    current_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    unit_price DECIMAL(10,2),
    supplier VARCHAR(255),
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_inventory_product_code ON inventory(product_code);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_inventory_stock ON inventory(current_stock);
```

### 4. Sales Orders Table

```sql
CREATE TABLE sales_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    sale_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sales_invoice ON sales_orders(invoice_number);
CREATE INDEX idx_sales_customer ON sales_orders(customer_name);
CREATE INDEX idx_sales_date ON sales_orders(sale_date);
CREATE INDEX idx_sales_status ON sales_orders(payment_status);
```

### 5. Purchase Orders Table

```sql
CREATE TABLE purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_order_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_email VARCHAR(255),
    supplier_phone VARCHAR(20),
    purchase_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchase_order_number ON purchase_orders(purchase_order_number);
CREATE INDEX idx_purchase_supplier ON purchase_orders(supplier_name);
CREATE INDEX idx_purchase_date ON purchase_orders(purchase_date);
CREATE INDEX idx_purchase_status ON purchase_orders(payment_status);
```

### 6. Invoices Table

```sql
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    billing_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_customer ON invoices(customer_name);
CREATE INDEX idx_invoices_date ON invoices(billing_date);
CREATE INDEX idx_invoices_due ON invoices(due_date);
CREATE INDEX idx_invoices_status ON invoices(payment_status);
```

## CRUD Operations

### Employees Repository

```typescript
// Create Employee
const newEmployee = await EmployeeRepository.create({
  employee_code: "EMP001",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  department: "Production",
  position: "Manager",
  salary: 50000,
  hire_date: "2024-01-15",
});

// Get All Employees
const employees = await EmployeeRepository.getAll();

// Get Employee by ID
const employee = await EmployeeRepository.getById("uuid");

// Update Employee
const updated = await EmployeeRepository.update("uuid", {
  salary: 55000,
  position: "Senior Manager",
});

// Delete Employee (Soft Delete)
await EmployeeRepository.delete("uuid");

// Search Employees
const results = await EmployeeRepository.search("John");

// Get by Department
const productionEmployees = await EmployeeRepository.getByDepartment(
  "Production"
);
```

### Production Repository

```typescript
// Create Production Record
const newRecord = await ProductionRepository.create({
  product_id: "CABLE001",
  quantity_produced: 100,
  production_date: "2024-01-15",
  batch_number: "BATCH001",
  produced_by: "employee_uuid",
  quality_check: false,
  notes: "Standard production",
});

// Get All Records
const records = await ProductionRepository.getAll();

// Get by Date Range
const dateRangeRecords = await ProductionRepository.getByDateRange(
  "2024-01-01",
  "2024-01-31"
);

// Update Quality Check
await ProductionRepository.updateQualityCheck("uuid", true);

// Get Statistics
const stats = await ProductionRepository.getStats();
```

### Inventory Repository

```typescript
// Create Inventory Item
const newItem = await InventoryRepository.create({
  product_code: "CABLE001",
  product_name: "Ethernet Cable",
  category: "Networking",
  current_stock: 50,
  min_stock_level: 10,
  unit_price: 25.99,
  supplier: "Tech Supplies Inc",
});

// Update Stock
await InventoryRepository.updateStock("uuid", 10, "add"); // Add stock
await InventoryRepository.updateStock("uuid", 5, "subtract"); // Remove stock

// Get Low Stock Items
const lowStock = await InventoryRepository.getLowStockItems();

// Search Inventory
const results = await InventoryRepository.search("Ethernet");
```

### Sales Repository

```typescript
// Create Sales Order
const newSale = await SalesRepository.create({
  invoice_number: "INV001",
  customer_name: "ABC Company",
  customer_email: "contact@abc.com",
  sale_date: "2024-01-15",
  total_amount: 1000,
  tax_amount: 80,
  final_amount: 1080,
  payment_status: "pending",
});

// Update Payment Status
await SalesRepository.updatePaymentStatus("uuid", "paid");

// Get by Payment Status
const paidSales = await SalesRepository.getByPaymentStatus("paid");

// Get Statistics
const stats = await SalesRepository.getStats();
```

### Purchase Repository

```typescript
// Create Purchase Order
const newPurchase = await PurchaseRepository.create({
  purchase_order_number: "PO001",
  supplier_name: "Tech Supplies Inc",
  purchase_date: "2024-01-15",
  total_amount: 2000,
  final_amount: 2200,
  payment_status: "pending",
});

// Update Payment Status
await PurchaseRepository.updatePaymentStatus("uuid", "paid");

// Get by Supplier
const supplierOrders = await PurchaseRepository.getBySupplier(
  "Tech Supplies Inc"
);
```

### Billing Repository

```typescript
// Create Invoice
const newInvoice = await BillingRepository.create({
  invoice_number: "INV001",
  customer_name: "ABC Company",
  billing_date: "2024-01-15",
  due_date: "2024-02-15",
  total_amount: 1000,
  final_amount: 1080,
  payment_status: "pending",
});

// Get Overdue Invoices
const overdue = await BillingRepository.getOverdue();

// Update Payment Status
await BillingRepository.updatePaymentStatus("uuid", "paid");
```

## Database Functions

### Updated Timestamp Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_updated_at BEFORE UPDATE ON production_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Setup Instructions

1. **Create Supabase Project**

   - Go to https://supabase.com
   - Create a new project
   - Copy the Project URL and Anon Key

2. **Run SQL Scripts**

   - Go to the SQL Editor in Supabase Dashboard
   - Run each table creation script individually
   - Run the trigger creation script

3. **Configure Environment**

   - Add the Supabase credentials to your `.env.local` file

4. **Test Connection**
   - Your repositories should now work with the database
   - Test basic CRUD operations

## Data Types Reference

- **UUID**: Primary keys and foreign keys
- **VARCHAR**: Text fields with length limits
- **TEXT**: Long text fields without length limits
- **INTEGER**: Whole numbers
- **DECIMAL(10,2)**: Currency values with 2 decimal places
- **DATE**: Date values without time
- **TIMESTAMP WITH TIME ZONE**: Date and time with timezone
- **BOOLEAN**: True/false values

## Payment Status Values

- **pending**: Payment not yet made
- **paid**: Payment completed
- **partial**: Partial payment made
- **overdue**: Payment past due date (invoices only)

## Inventory Status Values

- **available**: Item is in stock and available
- **out_of_stock**: Item is completely out of stock
- **discontinued**: Item is no longer available
- **on_order**: Item is currently on order

This setup provides a complete foundation for the ABS Cables Management System with full CRUD capabilities for all major entities.
