-- Drop existing table if it exists (to start fresh)
DROP TABLE IF EXISTS sales;

-- Create Sales Table
CREATE TABLE sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Party/Customer Information
    party_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_address TEXT,
    
    -- Product Information
    coil_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100),
    product_description TEXT,
    
    -- Quantity and Pricing
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pcs',
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Financial Details
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Accounting Fields
    debit DECIMAL(10,2) DEFAULT 0,
    credit DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'overdue')),
    payment_method VARCHAR(100),
    payment_due_date DATE,
    
    -- Transaction Details
    invoice_number VARCHAR(100) UNIQUE,
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    delivery_date DATE,
    
    -- Status and Tracking
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    order_status VARCHAR(50) DEFAULT 'processing' CHECK (order_status IN ('processing', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    
    -- Comments and Notes
    comments TEXT,
    internal_notes TEXT,
    
    -- Metadata
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    
    -- Additional Fields
    reference_number VARCHAR(100),
    terms_conditions TEXT,
    delivery_address TEXT,
    billing_address TEXT
);

-- Create Indexes
CREATE INDEX idx_sales_party_name ON sales(party_name);
CREATE INDEX idx_sales_coil_name ON sales(coil_name);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_payment_status ON sales(payment_status);
CREATE INDEX idx_sales_invoice_number ON sales(invoice_number);
CREATE INDEX idx_sales_created_at ON sales(created_at);

-- Create Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_updated_at 
    BEFORE UPDATE ON sales 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add Comments
COMMENT ON TABLE sales IS 'Sales transactions table for managing customer orders and payments';
COMMENT ON COLUMN sales.party_name IS 'Name of the customer or party';
COMMENT ON COLUMN sales.coil_name IS 'Name of the coil/product being sold';
COMMENT ON COLUMN sales.quantity IS 'Quantity of items sold';
COMMENT ON COLUMN sales.comments IS 'Customer-facing comments or notes';
COMMENT ON COLUMN sales.internal_notes IS 'Internal notes for staff reference';
