"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
  Briefcase,
} from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import Link from "next/link";

export default function EmployeesPage() {
  const {
    employees,
    loading,
    error,
    deleteEmployee,
    searchEmployees,
    filterByDepartment,
    filterByStatus,
  } = useEmployees();

  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    const deptMatch =
      filterDepartment === "all" || emp.department === filterDepartment;
    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "active" ? emp.is_active : !emp.is_active);
    const searchMatch =
      !searchTerm ||
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase());

    return deptMatch && statusMatch && searchMatch;
  });

  const exportCSV = () => {
    const csvData = [
      [
        "Employee Code",
        "Name",
        "Email",
        "Phone",
        "Department",
        "Position",
        "Status",
        "Hire Date",
      ],
      ...filteredEmployees.map((emp) => [
        emp.employee_code,
        `${emp.first_name} ${emp.last_name}`,
        emp.email || "N/A",
        emp.phone || "N/A",
        emp.department || "N/A",
        emp.position,
        emp.is_active ? "Active" : "Inactive",
        emp.hire_date,
      ]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees-export.csv";
    a.click();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
      } catch (err) {
        console.error("Failed to delete employee:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">Error: {error}</div>;
  }

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(
    (emp) => emp.is_active
  ).length;
  const inactiveEmployees = filteredEmployees.filter(
    (emp) => !emp.is_active
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-black">Employee Management</h2>
        <div className="flex space-x-2">
          <Link href="/employees/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Employee
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Overview</CardTitle>
          <CardDescription>Summary of employee statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {totalEmployees}
              </div>
              <div className="text-sm text-black">Total Employees</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {activeEmployees}
              </div>
              <div className="text-sm text-black">Active</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <UserX className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {inactiveEmployees}
              </div>
              <div className="text-sm text-black">Inactive</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {
                  new Set(
                    filteredEmployees
                      .map((emp) => emp.department)
                      .filter(Boolean)
                  ).size
                }
              </div>
              <div className="text-sm text-black">Departments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Employee Records</CardTitle>
              <CardDescription>
                Manage and track employee information
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select
                value={filterDepartment}
                onValueChange={setFilterDepartment}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.employee_code}
                  </TableCell>
                  <TableCell className="text-black">
                    {employee.first_name} {employee.last_name}
                  </TableCell>
                  <TableCell className="text-black">
                    {employee.email || "-"}
                  </TableCell>
                  <TableCell className="text-black">
                    {employee.phone || "-"}
                  </TableCell>
                  <TableCell className="text-black">
                    {employee.department || "-"}
                  </TableCell>
                  <TableCell className="text-black">
                    {employee.position}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        employee.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/employees/view/${employee.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/employees/edit/${employee.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                        className="cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
