import { supabase } from "@/lib/database";
import { TABLES } from "@/constants";
import { Employee } from "@/types";

export class EmployeeRepository {
  // Get all employees
  static async getAll(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from(TABLES.EMPLOYEES)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get employee by ID
  static async getById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from(TABLES.EMPLOYEES)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create new employee
  static async create(
    employee: Omit<Employee, "id" | "created_at" | "updated_at">
  ): Promise<Employee> {
    const { data, error } = await supabase
      .from(TABLES.EMPLOYEES)
      .insert(employee)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update employee
  static async update(
    id: string,
    updates: Partial<Employee>
  ): Promise<Employee> {
    const { data, error } = await supabase
      .from(TABLES.EMPLOYEES)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete employee (soft delete by setting inactive)
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.EMPLOYEES)
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }

  // Get employees by department
  static async getByDepartment(department: string): Promise<Employee[]> {
    const { data, error } = await supabase
      .from(TABLES.EMPLOYEES)
      .select("*")
      .eq("department", department)
      .eq("is_active", true)
      .order("last_name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Search employees
  static async search(query: string): Promise<Employee[]> {
    const { data, error } = await supabase
      .from(TABLES.EMPLOYEES)
      .select("*")
      .or(
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,employee_code.ilike.%${query}%,email.ilike.%${query}%`
      )
      .order("last_name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Hard delete employee
  static async hardDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.EMPLOYEES)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
