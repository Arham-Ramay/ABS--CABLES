import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { EmployeeRepository } from "@/repositories/employeeRepository";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await EmployeeRepository.getAll();
        setEmployees(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch employees"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const addEmployee = async (
    employee: Omit<Employee, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const newEmployee = await EmployeeRepository.create(employee);
      setEmployees((prev) => [newEmployee, ...prev]);
      return newEmployee;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add employee");
      throw err;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const updatedEmployee = await EmployeeRepository.update(id, updates);
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? updatedEmployee : emp))
      );
      return updatedEmployee;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update employee"
      );
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await EmployeeRepository.delete(id);
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, is_active: false } : emp))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete employee"
      );
      throw err;
    }
  };

  const getEmployeeById = async (id: string) => {
    try {
      return await EmployeeRepository.getById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch employee");
      throw err;
    }
  };

  const searchEmployees = async (query: string) => {
    try {
      return await EmployeeRepository.search(query);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search employees"
      );
      throw err;
    }
  };

  const filterByDepartment = (department: string) => {
    return employees.filter((item) => item.department === department);
  };

  const filterByStatus = (status: "active" | "inactive") => {
    return employees.filter((item) =>
      status === "active" ? item.is_active : !item.is_active
    );
  };

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    searchEmployees,
    filterByDepartment,
    filterByStatus,
  };
}
