-- Simple Billing Table - Clean Version
CREATE TABLE billing_invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    client_address TEXT,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'pcs',
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_billing_invoices_invoice_number ON billing_invoices(invoice_number);
CREATE INDEX idx_billing_invoices_client_name ON billing_invoices(client_name);
CREATE INDEX idx_billing_invoices_status ON billing_invoices(status);

-- Auto-generate invoice number
CREATE OR REPLACE FUNCTION generate_billing_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
                              LPAD(EXTRACT(MONTH FROM NOW())::text, 2, '0') || '-' ||
                              LPAD(NEXTVAL('billing_invoice_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence
CREATE SEQUENCE IF NOT EXISTS billing_invoice_seq START 1;

-- Trigger
CREATE TRIGGER generate_billing_invoice_number_trigger
    BEFORE INSERT ON billing_invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_billing_invoice_number();

-- Sample data
INSERT INTO billing_invoices (
    client_name, client_email, client_phone, client_address,
    invoice_number, invoice_date, due_date,
    item_name, item_description, quantity, unit, unit_price,
    subtotal, discount_amount, tax_amount, total_amount,
    amount_paid, balance_due, payment_status, payment_method, status,
    notes, created_by
) VALUES 
(
    'ABC Manufacturing Ltd', 'billing@abcmanufacturing.com', '+1234567890',
    '123 Industrial Area, Mumbai, Maharashtra 400001',
    'INV-2024-01-0001', '2024-01-15', '2024-02-15',
    'Copper Cable - 4mm', 'High quality copper cable for industrial use',
    100, 'meters', 250.00,
    25000.00, 1250.00, 4275.00, 28025.00,
    0.00, 28025.00, 'pending', 'bank_transfer', 'sent',
    'Payment due within 30 days', 'Admin'
);
