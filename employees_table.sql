-- Single Comprehensive Employees Table with All Tracking
CREATE TABLE employees (
    -- Basic Employee Information
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    bank_account VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    
    -- Personal Information
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    marital_status VARCHAR(20),
    nationality VARCHAR(50),
    pan_card VARCHAR(20),
    aadhaar_card VARCHAR(20),
    
    -- Salary Tracking (JSON for monthly records)
    salary_records JSONB DEFAULT '[]'::jsonb, -- Array of monthly salary records
    current_month_salary DECIMAL(12,2) DEFAULT 0,
    basic_salary DECIMAL(12,2) DEFAULT 0,
    hra DECIMAL(12,2) DEFAULT 0,
    da DECIMAL(12,2) DEFAULT 0,
    ta DECIMAL(12,2) DEFAULT 0,
    other_allowances DECIMAL(12,2) DEFAULT 0,
    gross_salary DECIMAL(12,2) DEFAULT 0,
    pf_deduction DECIMAL(12,2) DEFAULT 0,
    esi_deduction DECIMAL(12,2) DEFAULT 0,
    professional_tax DECIMAL(12,2) DEFAULT 0,
    income_tax DECIMAL(12,2) DEFAULT 0,
    other_deductions DECIMAL(12,2) DEFAULT 0,
    total_deductions DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2) DEFAULT 0,
    last_payment_date DATE,
    payment_method VARCHAR(20) DEFAULT 'bank_transfer',
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
    
    -- Attendance Tracking (JSON for daily records)
    attendance_records JSONB DEFAULT '[]'::jsonb, -- Array of daily attendance records
    current_month_days_present INTEGER DEFAULT 0,
    current_month_days_absent INTEGER DEFAULT 0,
    current_month_leave_days INTEGER DEFAULT 0,
    current_month_overtime_hours DECIMAL(4,2) DEFAULT 0,
    total_working_days INTEGER DEFAULT 0,
    
    -- Leave Management (JSON for leave records)
    leave_records JSONB DEFAULT '[]'::jsonb, -- Array of leave requests
    sick_leave_balance INTEGER DEFAULT 12,
    casual_leave_balance INTEGER DEFAULT 12,
    earned_leave_balance INTEGER DEFAULT 15,
    total_leave_taken INTEGER DEFAULT 0,
    
    -- Performance Tracking (JSON for performance records)
    performance_records JSONB DEFAULT '[]'::jsonb, -- Array of performance reviews
    current_rating DECIMAL(3,2) DEFAULT 0,
    last_review_date DATE,
    
    -- Document Management (JSON for document records)
    document_records JSONB DEFAULT '[]'::jsonb, -- Array of document records
    
    -- Additional Information
    notes TEXT,
    internal_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Indexes for better performance
CREATE INDEX idx_employees_employee_code ON employees(employee_code);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_is_active ON employees(is_active);
CREATE INDEX idx_employees_hire_date ON employees(hire_date);
CREATE INDEX idx_employees_payment_status ON employees(payment_status);
CREATE INDEX idx_employees_salary_records ON employees USING GIN(salary_records);
CREATE INDEX idx_employees_attendance_records ON employees USING GIN(attendance_records);
CREATE INDEX idx_employees_leave_records ON employees USING GIN(leave_records);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data with JSON structures
INSERT INTO employees (
    employee_code, first_name, last_name, email, phone, address, position, 
    department, hire_date, salary, bank_account, emergency_contact_name, 
    emergency_contact_phone, date_of_birth, gender, blood_group, 
    marital_status, nationality, pan_card, aadhaar_card,
    basic_salary, hra, da, ta, other_allowances, gross_salary,
    pf_deduction, esi_deduction, professional_tax, income_tax,
    total_deductions, net_salary, payment_status,
    current_month_days_present, current_month_days_absent,
    sick_leave_balance, casual_leave_balance, earned_leave_balance,
    current_rating, notes
) VALUES 
(
    'EMP001', 'John', 'Doe', 'john.doe@company.com', '9876543210', 
    '123 Main St, City, State', 'Production Manager', 'Production', 
    '2023-01-15', 45000.00, '1234567890', 'Jane Doe', '9876543211', 
    '1990-05-15', 'Male', 'O+', 'Married', 'Indian', 'ABCDE1234F', 
    '123456789012',
    30000.00, 9000.00, 3000.00, 1500.00, 500.00, 44000.00,
    1800.00, 500.00, 200.00, 2000.00, 4500.00, 39500.00, 'paid',
    22, 0, 12, 12, 15, 4.5, 'Experienced production manager'
),
(
    'EMP002', 'Jane', 'Smith', 'jane.smith@company.com', '9876543212', 
    '456 Oak Ave, City, State', 'Accountant', 'Billing', 
    '2023-02-20', 35000.00, '0987654321', 'John Smith', '9876543213', 
    '1992-08-22', 'Female', 'A+', 'Single', 'Indian', 'FGHIJ5678K', 
    '234567890123',
    25000.00, 7500.00, 2500.00, 1000.00, 500.00, 36500.00,
    1500.00, 400.00, 200.00, 1500.00, 3600.00, 32900.00, 'paid',
    20, 2, 12, 12, 15, 4.2, 'Skilled accountant'
),
(
    'EMP003', 'Mike', 'Johnson', 'mike.johnson@company.com', '9876543213', 
    '789 Pine Rd, City, State', 'Sales Executive', 'Sales', 
    '2023-03-10', 28000.00, '1122334455', 'Sarah Johnson', '9876543214', 
    '1988-12-10', 'Male', 'B+', 'Married', 'Indian', 'KLMNO9012L', 
    '345678901234',
    20000.00, 6000.00, 2000.00, 800.00, 400.00, 29200.00,
    1200.00, 300.00, 200.00, 1000.00, 2700.00, 26500.00, 'pending',
    18, 4, 12, 12, 15, 3.8, 'Good sales performer'
);

-- Sample JSON data for salary records (for employee EMP001)
UPDATE employees SET salary_records = '[
    {
        "month": "2024-01",
        "basic_salary": 30000.00,
        "hra": 9000.00,
        "da": 3000.00,
        "ta": 1500.00,
        "other_allowances": 500.00,
        "gross_salary": 44000.00,
        "pf_deduction": 1800.00,
        "esi_deduction": 500.00,
        "professional_tax": 200.00,
        "income_tax": 2000.00,
        "other_deductions": 0.00,
        "total_deductions": 4500.00,
        "net_salary": 39500.00,
        "payment_date": "2024-01-31",
        "payment_method": "bank_transfer",
        "payment_status": "paid",
        "transaction_id": "TXN123456789"
    }
]'::jsonb WHERE employee_code = 'EMP001';

-- Sample JSON data for attendance records (for employee EMP001)
UPDATE employees SET attendance_records = '[
    {
        "date": "2024-01-01",
        "check_in": "09:00",
        "check_out": "18:00",
        "total_hours": 9.00,
        "overtime_hours": 1.00,
        "status": "present"
    },
    {
        "date": "2024-01-02",
        "check_in": "09:15",
        "check_out": "18:30",
        "total_hours": 9.25,
        "overtime_hours": 1.25,
        "status": "present"
    }
]'::jsonb WHERE employee_code = 'EMP001';

-- Sample JSON data for leave records (for employee EMP001)
UPDATE employees SET leave_records = '[
    {
        "id": "leave_001",
        "type": "sick",
        "start_date": "2024-01-15",
        "end_date": "2024-01-16",
        "total_days": 2,
        "reason": "Fever and cold",
        "status": "approved",
        "approved_by": "Manager",
        "approved_date": "2024-01-14"
    }
]'::jsonb WHERE employee_code = 'EMP001';

-- Sample JSON data for performance records (for employee EMP001)
UPDATE employees SET performance_records = '[
    {
        "id": "perf_001",
        "period": "2023-Q4",
        "review_date": "2023-12-31",
        "overall_rating": 4.5,
        "technical_skills": 4.2,
        "communication": 4.5,
        "teamwork": 4.7,
        "punctuality": 4.8,
        "quality": 4.3,
        "strengths": "Strong leadership, excellent technical skills",
        "areas_for_improvement": "Time management",
        "goals": "Complete advanced certification",
        "reviewer": "Department Head"
    }
]'::jsonb WHERE employee_code = 'EMP001';

-- Sample JSON data for document records (for employee EMP001)
UPDATE employees SET document_records = '[
    {
        "id": "doc_001",
        "type": "resume",
        "name": "John_Doe_Resume.pdf",
        "upload_date": "2023-01-15",
        "file_path": "/documents/resumes/EMP001_resume.pdf",
        "file_size": 245760,
        "mime_type": "application/pdf",
        "is_active": true
    },
    {
        "id": "doc_002",
        "type": "id_proof",
        "name": "John_Doe_Aadhaar.pdf",
        "upload_date": "2023-01-15",
        "file_path": "/documents/id_proofs/EMP001_aadhaar.pdf",
        "file_size": 512000,
        "mime_type": "application/pdf",
        "is_active": true
    }
]'::jsonb WHERE employee_code = 'EMP001';

-- Comments for understanding the JSON structures:
/*
salary_records structure:
[
    {
        "month": "YYYY-MM",
        "basic_salary": number,
        "hra": number,
        "da": number,
        "ta": number,
        "other_allowances": number,
        "gross_salary": number,
        "pf_deduction": number,
        "esi_deduction": number,
        "professional_tax": number,
        "income_tax": number,
        "other_deductions": number,
        "total_deductions": number,
        "net_salary": number,
        "payment_date": "YYYY-MM-DD",
        "payment_method": "bank_transfer|cash|check",
        "payment_status": "pending|paid|failed",
        "transaction_id": "string"
    }
]

attendance_records structure:
[
    {
        "date": "YYYY-MM-DD",
        "check_in": "HH:MM",
        "check_out": "HH:MM",
        "total_hours": number,
        "overtime_hours": number,
        "status": "present|absent|leave|half_day"
    }
]

leave_records structure:
[
    {
        "id": "string",
        "type": "sick|casual|earned|unpaid",
        "start_date": "YYYY-MM-DD",
        "end_date": "YYYY-MM-DD",
        "total_days": number,
        "reason": "string",
        "status": "pending|approved|rejected",
        "approved_by": "string",
        "approved_date": "YYYY-MM-DD"
    }
]

performance_records structure:
[
    {
        "id": "string",
        "period": "YYYY-Q1|YYYY-Q2|YYYY-Q3|YYYY-Q4",
        "review_date": "YYYY-MM-DD",
        "overall_rating": number (0-5),
        "technical_skills": number,
        "communication": number,
        "teamwork": number,
        "punctuality": number,
        "quality": number,
        "strengths": "string",
        "areas_for_improvement": "string",
        "goals": "string",
        "reviewer": "string"
    }
]

document_records structure:
[
    {
        "id": "string",
        "type": "resume|id_proof|address_proof|contract|other",
        "name": "string",
        "upload_date": "YYYY-MM-DD",
        "file_path": "string",
        "file_size": number,
        "mime_type": "string",
        "is_active": boolean
    }
]
*/
