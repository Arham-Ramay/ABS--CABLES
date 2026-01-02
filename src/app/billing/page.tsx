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
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

// Mock data for billing
const mockBills = [
  {
    id: "1",
    invoice_number: "INV-001",
    customer_name: "Acme Corporation",
    customer_email: "billing@acme.com",
    issue_date: "2024-01-15",
    due_date: "2024-02-15",
    total_amount: 12500,
    status: "paid",
    payment_date: "2024-01-20",
    items_count: 8,
  },
  {
    id: "2",
    invoice_number: "INV-002",
    customer_name: "Tech Solutions",
    customer_email: "accounts@techsolutions.com",
    issue_date: "2024-01-14",
    due_date: "2024-02-14",
    total_amount: 8500,
    status: "pending",
    payment_date: null,
    items_count: 5,
  },
  {
    id: "3",
    invoice_number: "INV-003",
    customer_name: "Global Industries",
    customer_email: "finance@global.com",
    issue_date: "2024-01-10",
    due_date: "2024-02-10",
    total_amount: 22000,
    status: "overdue",
    payment_date: null,
    items_count: 12,
  },
];

export default function BillingPage() {
  const [bills] = useState(mockBills);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      searchTerm === "" ||
      bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customer_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || bill.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const csvData = [
      [
        "Invoice Number",
        "Customer",
        "Issue Date",
        "Due Date",
        "Total Amount",
        "Status",
        "Payment Date",
      ],
      ...filteredBills.map((bill) => [
        bill.invoice_number,
        bill.customer_name,
        bill.issue_date,
        bill.due_date,
        bill.total_amount.toString(),
        bill.status,
        bill.payment_date || "Not Paid",
      ]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "billing-export.csv";
    a.click();
  };

  const totalBills = filteredBills.length;
  const paidBills = filteredBills.filter((b) => b.status === "paid").length;
  const overdueBills = filteredBills.filter(
    (b) => b.status === "overdue"
  ).length;
  const totalRevenue = filteredBills.reduce(
    (sum, bill) => sum + (bill.status === "paid" ? bill.total_amount : 0),
    0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "pending":
        return <Clock className="w-3 h-3 mr-1" />;
      case "overdue":
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Billing & Invoices</h2>
        <div className="flex space-x-2">
          <Link href="/billing/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
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
          <CardTitle>Billing Overview</CardTitle>
          <CardDescription>Summary of invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {totalBills}
              </div>
              <div className="text-sm text-gray-900">Total Invoices</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {paidBills}
              </div>
              <div className="text-sm text-gray-900">Paid Invoices</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {overdueBills}
              </div>
              <div className="text-sm text-gray-900">Overdue</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                ${totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-900">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Manage customer invoices and payments
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Search invoices..."
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
                <TableHead>Invoice Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">
                    {bill.invoice_number}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    <div>
                      <div className="font-medium">{bill.customer_name}</div>
                      <div className="text-sm text-gray-500">
                        {bill.customer_email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {bill.issue_date}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {bill.due_date}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    ${bill.total_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        bill.status
                      )}`}
                    >
                      {getStatusIcon(bill.status)}
                      {bill.status.charAt(0).toUpperCase() +
                        bill.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {bill.payment_date || "Not Paid"}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {bill.items_count}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/billing/view/${bill.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/billing/edit/${bill.id}`}>
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
