"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Save,
  User,
  DollarSign,
  Calendar,
  Phone,
  FileText,
  CreditCard,
  Users,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { EmployeeRepository } from "@/repositories/employeeRepository";
import { Employee } from "@/types";

export default function EmployeeEditPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [formData, setFormData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employee = await EmployeeRepository.getById(employeeId);
        if (employee) {
          setFormData(employee);
        } else {
          setError("Employee not found");
        }
      } catch (error) {
        console.error("Failed to fetch employee:", error);
        setError("Failed to load employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Calculate salary components when salary changes
  const calculateSalaryComponents = (baseSalary: number) => {
    const hra = baseSalary * 0.3; // 30% of basic
    const da = baseSalary * 0.1; // 10% of basic
    const ta = baseSalary * 0.05; // 5% of basic
    const other_allowances = baseSalary * 0.015; // 1.5% of basic
    const gross_salary = baseSalary + hra + da + ta + other_allowances;

    const pf_deduction = Math.min(baseSalary * 0.12, 1800); // 12% of basic, max 1800
    const esi_deduction = Math.min(gross_salary * 0.0075, 500); // 0.75% of gross, max 500
    const professional_tax = 200; // Fixed
    const income_tax = gross_salary * 0.05; // Simplified 5%
    const total_deductions =
      pf_deduction + esi_deduction + professional_tax + income_tax;
    const net_salary = gross_salary - total_deductions;

    return {
      basic_salary: baseSalary,
      hra,
      da,
      ta,
      other_allowances,
      gross_salary,
      pf_deduction,
      esi_deduction,
      professional_tax,
      income_tax,
      total_deductions,
      net_salary,
    };
  };

  // Update salary components when salary changes
  const handleInputChange = (
    field: keyof Employee,
    value: string | number | boolean
  ) => {
    if (!formData) return;

    const updatedData = { ...formData, [field]: value };

    // Recalculate salary components if salary changed
    if (field === "salary") {
      const salaryComponents = calculateSalaryComponents(Number(value));
      setFormData({ ...updatedData, ...salaryComponents });
    } else {
      setFormData(updatedData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setError(null);

    try {
      // Prepare data for update
      const updateData = {
        ...formData,
        updated_by: "Admin",
        updated_at: new Date().toISOString(),
      };

      await EmployeeRepository.update(employeeId, updateData);
      alert("Employee updated successfully!");
      router.push("/employees");
    } catch (error) {
      console.error("Failed to update employee:", error);
      setError("Failed to update employee. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Employee not found"}</p>
            <Link href="/employees">
              <Button variant="outline">Back to Employees</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/employees">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Employees
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-gray-600 mt-2">
            Update employee {formData.employee_code} information
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="max-w-6xl mx-auto shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-2xl">
            <Users className="w-6 h-6 mr-2" />
            Employee Information
          </CardTitle>
          <CardDescription className="text-blue-100">
            Update the employee details and salary information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Employee Code *
                  </label>
                  <Input
                    value={formData.employee_code}
                    onChange={(e) =>
                      handleInputChange("employee_code", e.target.value)
                    }
                    placeholder="Employee code"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    placeholder="Enter first name"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    placeholder="Enter last name"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="employee@example.com"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Phone
                  </label>
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1234567890"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.date_of_birth || ""}
                    onChange={(e) =>
                      handleInputChange("date_of_birth", e.target.value)
                    }
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Gender
                  </label>
                  <Select
                    value={formData.gender || ""}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Blood Group
                  </label>
                  <Select
                    value={formData.blood_group || ""}
                    onValueChange={(value) =>
                      handleInputChange("blood_group", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Marital Status
                  </label>
                  <Select
                    value={formData.marital_status || ""}
                    onValueChange={(value) =>
                      handleInputChange("marital_status", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Nationality
                  </label>
                  <Input
                    value={formData.nationality || ""}
                    onChange={(e) =>
                      handleInputChange("nationality", e.target.value)
                    }
                    placeholder="Indian"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Address
                </label>
                <Textarea
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Job Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Job Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Position *
                  </label>
                  <Input
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    placeholder="e.g., Production Manager"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Department *
                  </label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Hire Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) =>
                      handleInputChange("hire_date", e.target.value)
                    }
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Salary Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Monthly Salary *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) =>
                      handleInputChange(
                        "salary",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Bank Account
                  </label>
                  <Input
                    value={formData.bank_account || ""}
                    onChange={(e) =>
                      handleInputChange("bank_account", e.target.value)
                    }
                    placeholder="Bank account for salary"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Payment Status
                  </label>
                  <Select
                    value={formData.payment_status || "pending"}
                    onValueChange={(value) =>
                      handleInputChange("payment_status", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-blue-50 p-6 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Basic Salary
                  </label>
                  <div className="text-lg font-bold text-blue-900">
                    $
                    {formData.basic_salary?.toFixed(2) ||
                      formData.salary.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Gross Salary
                  </label>
                  <div className="text-lg font-bold text-blue-900">
                    $
                    {formData.gross_salary?.toFixed(2) ||
                      formData.salary.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Total Deductions
                  </label>
                  <div className="text-lg font-bold text-red-600">
                    ${formData.total_deductions?.toFixed(2) || "0.00"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Net Salary
                  </label>
                  <div className="text-lg font-bold text-green-600">
                    $
                    {formData.net_salary?.toFixed(2) ||
                      formData.salary.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <Input
                    value={formData.emergency_contact_name || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "emergency_contact_name",
                        e.target.value
                      )
                    }
                    placeholder="Emergency contact person"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <Input
                    value={formData.emergency_contact_phone || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "emergency_contact_phone",
                        e.target.value
                      )
                    }
                    placeholder="Emergency contact number"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Government Documents */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Government Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    PAN Card Number
                  </label>
                  <Input
                    value={formData.pan_card || ""}
                    onChange={(e) =>
                      handleInputChange("pan_card", e.target.value)
                    }
                    placeholder="ABCDE1234F"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Aadhaar Card Number
                  </label>
                  <Input
                    value={formData.aadhaar_card || ""}
                    onChange={(e) =>
                      handleInputChange("aadhaar_card", e.target.value)
                    }
                    placeholder="123456789012"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Employee Status
                  </label>
                  <Select
                    value={formData.is_active.toString()}
                    onValueChange={(value) =>
                      handleInputChange("is_active", value === "true")
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Notes
                </label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about the employee"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <div className="space-x-4">
                <Link href="/employees">
                  <Button variant="outline" className="cursor-pointer">
                    Cancel
                  </Button>
                </Link>
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Update Employee
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
