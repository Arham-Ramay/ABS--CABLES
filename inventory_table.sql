-- Create Inventory table for ABS Cables Project
-- This table supports multiple categories: copper, pvc, packing_boxes, scrap, stamps, coils

CREATE TABLE IF NOT EXISTS inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Common fields for all inventory items
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('copper', 'pvc', 'packing_boxes', 'scrap', 'stamps', 'coils')),
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL DEFAULT 'pcs',
    unit_price DECIMAL(10, 2) DEFAULT 0.00,
    min_stock_level INTEGER DEFAULT 0,
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock', 'reserved', 'damaged')),
    supplier VARCHAR(255),
    purchase_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    
    -- Category-specific fields (JSON for flexibility)
    category_specific_fields JSONB,
    
    -- Copper specific fields
    copper_type VARCHAR(100),
    copper_grade VARCHAR(50),
    copper_purity DECIMAL(5, 4), -- e.g., 99.99%
    copper_thickness DECIMAL(8, 4), -- in mm
    copper_conductivity VARCHAR(50),
    
    -- PVC specific fields
    pvc_type VARCHAR(100),
    pvc_grade VARCHAR(50),
    pvc_color VARCHAR(50),
    pvc_thickness DECIMAL(8, 4), -- in mm
    pvc_hardness VARCHAR(20),
    pvc_temperature_rating VARCHAR(50),
    
    -- Packing Boxes specific fields
    box_type VARCHAR(100),
    box_dimensions VARCHAR(50), -- e.g., "10x5x3"
    box_material VARCHAR(50),
    box_capacity_weight DECIMAL(10, 2),
    box_capacity_volume DECIMAL(10, 2),
    
    -- Scrap specific fields
    scrap_type VARCHAR(100),
    scrap_source VARCHAR(100),
    scrap_purity DECIMAL(5, 4),
    scrap_condition VARCHAR(50),
    scrap_weight DECIMAL(10, 2),
    
    -- Stamps specific fields
    stamp_type VARCHAR(100),
    stamp_size VARCHAR(50),
    stamp_material VARCHAR(50),
    stamp_design VARCHAR(255),
    stamp_quality VARCHAR(50),
    
    -- Coils specific fields
    coil_name VARCHAR(255),
    coil_weight DECIMAL(10, 2),
    coil_length DECIMAL(10, 2),
    coil_thickness DECIMAL(8, 4),
    coil_diameter DECIMAL(10, 2),
    number_of_goats INTEGER DEFAULT 0, -- as requested
    coil_material VARCHAR(100),
    coil_grade VARCHAR(50),
    coil_resistance DECIMAL(10, 6),
    coil_insulation VARCHAR(50)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(location);
CREATE INDEX IF NOT EXISTS idx_inventory_purchase_date ON inventory(purchase_date);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;

CREATE TRIGGER update_inventory_updated_at 
    BEFORE UPDATE ON inventory 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) for Supabase
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (adjust according to your authentication needs)
CREATE POLICY "Users can view all inventory" ON inventory
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert inventory" ON inventory
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update inventory" ON inventory
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete inventory" ON inventory
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Add comments for documentation
COMMENT ON TABLE inventory IS 'Inventory table for ABS Cables Project supporting multiple categories';
COMMENT ON COLUMN inventory.category IS 'Category: copper, pvc, packing_boxes, scrap, stamps, coils';
COMMENT ON COLUMN inventory.category_specific_fields IS 'JSON field for additional category-specific attributes';
COMMENT ON COLUMN inventory.number_of_goats IS 'Number of goats for coil items (as requested)';
`