-- Create enum for user roles (handle if already exists)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('superadmin', 'admin');
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Type already exists, ignore error
END $$;

-- Simple users table (Supabase handles auth automatically)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index for role lookup
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample users (remove these in production)
INSERT INTO users (email, first_name, last_name, role) VALUES
('superadmin@example.com', 'Super', 'Admin', 'superadmin'),
('admin@example.com', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;
