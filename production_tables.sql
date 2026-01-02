-- Create production_records table
CREATE TABLE IF NOT EXISTS production_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  production_date DATE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_code VARCHAR(100) NOT NULL,
  quantity_produced INTEGER NOT NULL,
  quantity_defective INTEGER DEFAULT 0,
  production_line VARCHAR(100),
  shift VARCHAR(50) DEFAULT 'day',
  produced_by TEXT,
  quality_check BOOLEAN DEFAULT false,
  quality_checked_by TEXT,
  quality_check_date TIMESTAMP,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'quality_check', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_production_records_date ON production_records(production_date);
CREATE INDEX IF NOT EXISTS idx_production_records_status ON production_records(status);
CREATE INDEX IF NOT EXISTS idx_production_records_product ON production_records(product_code);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_production_records_updated_at 
  BEFORE UPDATE ON production_records 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security) - Optional if you want to restrict access
-- ALTER TABLE production_records ENABLE ROW LEVEL SECURITY;
