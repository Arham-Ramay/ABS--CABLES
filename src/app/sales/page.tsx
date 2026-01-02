"use client";

import { useState } from "react";
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
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

// Mock data for sales
const mockSales = [
  {
    id: "1",
    invoice_number: "INV-001",
    customer_name: "John Customer",
    customer_email: "john@example.com",
    customer_phone: "+1234567890",
    sale_date: "2024-01-15",
    total_amount: 1500,
    final_amount: 1650,
    payment_status: "paid" as const,
    payment_method: "Credit Card",
  },
  {
    id: "2",
    invoice_number: "INV-002",
    customer_name: "Jane Customer",
    customer_email: "jane@example.com",
    customer_phone: "+1234567891",
    sale_date: "2024-01-16",
    total_amount: 2000,
    final_amount: 2200,
    payment_status: "pending" as const,
    payment_method: "Bank Transfer",
  },
];

export default function SalesPage() {
  const [sales] = useState(mockSales);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      searchTerm === "" ||
      sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || sale.payment_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const csvData = [
      ["Invoice", "Customer", "Email", "Phone", "Date", "Amount", "Status"],
      ...filteredSales.map((sale) => [
        sale.invoice_number,
        sale.customer_name,
        sale.customer_email || "N/A",
        sale.customer_phone || "N/A",
        sale.sale_date,
        sale.final_amount.toString(),
        sale.payment_status,
      ]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-export.csv";
    a.click();
  };

  const totalSales = filteredSales.length;
  const paidSales = filteredSales.filter(
    (sale) => sale.payment_status === "paid"
  ).length;
  const pendingSales = filteredSales.filter(
    (sale) => sale.payment_status === "pending"
  ).length;
  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + sale.final_amount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Sales Management</h2>
        <div className="flex space-x-2">
          <Link href="/sales/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Sale
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
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Summary of sales statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {totalSales}
              </div>
              <div className="text-sm text-gray-800">Total Sales</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {paidSales}
              </div>
              <div className="text-sm text-gray-800">Paid</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {pendingSales}
              </div>
              <div className="text-sm text-gray-800">Pending</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                ${totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-800">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sales Records</CardTitle>
              <CardDescription>Manage and track sales data</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    {sale.invoice_number}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {sale.customer_name}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {sale.customer_email || "-"}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {sale.customer_phone || "-"}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {sale.sale_date}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    ${sale.final_amount}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        sale.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : sale.payment_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : sale.payment_status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {sale.payment_status.charAt(0).toUpperCase() +
                        sale.payment_status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/sales/view/${sale.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/sales/edit/${sale.id}`}>
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
