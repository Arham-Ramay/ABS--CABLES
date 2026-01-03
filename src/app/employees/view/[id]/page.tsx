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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { EmployeeRepository } from "@/repositories/employeeRepository";
import { Employee } from "@/types";

export default function EmployeeViewPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeData = await EmployeeRepository.getById(employeeId);
        if (employeeData) {
          setEmployee(employeeData);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "$0.00";
    return `$${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employee details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
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
      <div className="flex items-center justify-between">
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
            <h1 className="text-4xl font-bold text-gray-900">
              Employee Details
            </h1>
            <p className="text-gray-600 mt-2">
              {employee.first_name} {employee.last_name} (
              {employee.employee_code})
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/employees/edit/${employee.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit Employee
            </Button>
          </Link>
          <Button variant="outline" className="cursor-pointer">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <Card className="max-w-6xl mx-auto shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-2xl">
            <Users className="w-6 h-6 mr-2" />
            Employee Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium text-blue-700 mb-1">
                Position
              </div>
              <div className="text-lg font-bold text-blue-900">
                {employee.position}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(employee.payment_status || "pending")}
              </div>
              <div className="text-sm font-medium text-green-700 mb-1">
                Payment Status
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  employee.payment_status || "pending"
                )}`}
              >
                {(employee.payment_status || "pending")
                  .charAt(0)
                  .toUpperCase() +
                  (employee.payment_status || "pending").slice(1)}
              </span>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm font-medium text-purple-700 mb-1">
                Net Salary
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(employee.net_salary)}
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-sm font-medium text-yellow-700 mb-1">
                Employment Status
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  employee.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {employee.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Employee Code
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.employee_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">
                    {formatDate(employee.date_of_birth)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Gender
                  </label>
                  <p className="text-gray-900 capitalize">
                    {employee.gender || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Blood Group
                  </label>
                  <p className="text-gray-900">
                    {employee.blood_group || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Marital Status
                  </label>
                  <p className="text-gray-900 capitalize">
                    {employee.marital_status || "Not specified"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Nationality
                </label>
                <p className="text-gray-900">
                  {employee.nationality || "Not specified"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">
                    {employee.email || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-gray-900">
                    {employee.phone || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {employee.address || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Information */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <Briefcase className="w-5 h-5 mr-2" />
              Job Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Position
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {employee.position}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Department
                </label>
                <p className="text-gray-900 capitalize">
                  {employee.department}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Hire Date
                </label>
                <p className="text-gray-900">
                  {formatDate(employee.hire_date)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Employment Status
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    employee.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Bank Account
                </label>
                <p className="text-gray-900">
                  {employee.bank_account || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Notes
                </label>
                <p className="text-gray-900">
                  {employee.notes || "No notes available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Details */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-xl">
            <DollarSign className="w-5 h-5 mr-2" />
            Salary Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Basic Salary
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(employee.basic_salary || employee.salary)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">HRA</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(employee.hra)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">DA</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(employee.da)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">TA</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(employee.ta)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Other Allowances
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(employee.other_allowances)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Gross Salary
              </label>
              <p className="text-lg font-semibold text-blue-600">
                {formatCurrency(employee.gross_salary || employee.salary)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Total Deductions
              </label>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(employee.total_deductions)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Net Salary
              </label>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(employee.net_salary || employee.salary)}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Payment Method
                </label>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {employee.payment_method || "bank_transfer"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Last Payment Date
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(employee.last_payment_date)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-xl">
            <Phone className="w-5 h-5 mr-2" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Contact Name
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {employee.emergency_contact_name || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Contact Phone
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {employee.emergency_contact_phone || "Not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Government Documents */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-xl">
            <CreditCard className="w-5 h-5 mr-2" />
            Government Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                PAN Card Number
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {employee.pan_card || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Aadhaar Card Number
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {employee.aadhaar_card || "Not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance & Leave Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <Calendar className="w-5 h-5 mr-2" />
              Current Month Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {employee.current_month_days_present || 0}
                </div>
                <div className="text-sm text-gray-700">Days Present</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {employee.current_month_days_absent || 0}
                </div>
                <div className="text-sm text-gray-700">Days Absent</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {employee.current_month_leave_days || 0}
                </div>
                <div className="text-sm text-gray-700">Leave Days</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {employee.current_month_overtime_hours || 0}h
                </div>
                <div className="text-sm text-gray-700">Overtime Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <Award className="w-5 h-5 mr-2" />
              Leave Balances & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-lg font-bold text-blue-600">
                    {employee.sick_leave_balance || 12}
                  </div>
                  <div className="text-xs text-gray-700">Sick Leave</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">
                    {employee.casual_leave_balance || 12}
                  </div>
                  <div className="text-xs text-gray-700">Casual Leave</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-lg font-bold text-purple-600">
                    {employee.earned_leave_balance || 15}
                  </div>
                  <div className="text-xs text-gray-700">Earned Leave</div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Current Rating
                    </label>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {employee.current_rating || 0}
                      </div>
                      <div className="text-sm text-gray-600 ml-2">/5.0</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Review
                    </label>
                    <p className="text-gray-900">
                      {formatDate(employee.last_review_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
