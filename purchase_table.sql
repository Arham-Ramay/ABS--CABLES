-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Supplier Information
  supplier_name VARCHAR(255) NOT NULL,
  supplier_email VARCHAR(255),
  supplier_phone VARCHAR(50),
  supplier_address TEXT,
  supplier_contact_person VARCHAR(255),
  
  -- Order Information
  order_number VARCHAR(100) UNIQUE NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Product Information
  product_name VARCHAR(255) NOT NULL,
  product_category VARCHAR(100),
  product_description TEXT,
  quantity_ordered INTEGER NOT NULL DEFAULT 0,
  quantity_received INTEGER DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'pcs',
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  
  -- Financial Information
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  shipping_cost DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  final_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  
  -- Payment Information
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
  payment_method VARCHAR(100),
  payment_due_date DATE,
  amount_paid DECIMAL(10,2) DEFAULT 0.00,
  
  -- Order Status
  order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'partial_delivered')),
  
  -- Additional Information
  invoice_number VARCHAR(100),
  tracking_number VARCHAR(100),
  shipping_address TEXT,
  billing_address TEXT,
  notes TEXT,
  internal_notes TEXT,
  terms_conditions TEXT,
  reference_number VARCHAR(100),
  
  -- Quality Control
  quality_status VARCHAR(50) DEFAULT 'pending' CHECK (quality_status IN ('pending', 'approved', 'rejected', 'inspected')),
  quality_notes TEXT,
  
  -- Metadata
  created_by VARCHAR(255) DEFAULT 'Admin',
  updated_by VARCHAR(255) DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_number ON purchase_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_name ON purchase_orders(supplier_name);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_date ON purchase_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_payment_status ON purchase_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_status ON purchase_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_product_name ON purchase_orders(product_name);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_purchase_orders_updated_at 
    BEFORE UPDATE ON purchase_orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO purchase_orders (
  supplier_name,
  supplier_email,
  supplier_phone,
  supplier_address,
  supplier_contact_person,
  order_number,
  product_name,
  product_category,
  product_description,
  quantity_ordered,
  quantity_received,
  unit,
  unit_price,
  total_amount,
  tax_amount,
  shipping_cost,
  discount_amount,
  final_amount,
  payment_status,
  payment_method,
  order_status,
  quality_status,
  created_by
) VALUES 
(
  'ABC Cable Supplies',
  'orders@abccables.com',
  '+1234567890',
  '123 Industrial Ave, Manufacturing City, MC 12345',
  'John Smith',
  'PO-001',
  'Copper Wire Roll',
  'copper',
  'High-quality copper wire for electrical applications',
  100,
  100,
  'rolls',
  25.50,
  2550.00,
  255.00,
  50.00,
  0.00,
  2855.00,
  'paid',
  'Bank Transfer',
  'delivered',
  'approved',
  'Admin'
);
