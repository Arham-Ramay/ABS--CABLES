"use client";

import { useState, useEffect } from "react";
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
  Eye,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { BillingRepository } from "@/repositories/billingRepository";
import { BillingInvoice } from "@/types";

export default function BillingPage() {
  const [bills, setBills] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch real-time data from database
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const data = await BillingRepository.getAllInvoices();
        setBills(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
        setError("Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      searchTerm === "" ||
      bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.client_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || bill.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalBills = bills.length;
  const paidBills = bills.filter(
    (bill) => bill.payment_status === "paid"
  ).length;
  const overdueBills = bills.filter((bill) => bill.status === "overdue").length;
  const totalRevenue = bills
    .filter((bill) => bill.payment_status === "paid")
    .reduce((sum, bill) => sum + bill.total_amount, 0);

  const exportCSV = () => {
    const csvData = [
      [
        "Invoice Number",
        "Client Name",
        "Invoice Date",
        "Due Date",
        "Total Amount",
        "Payment Status",
        "Status",
      ],
      ...filteredBills.map((bill) => [
        bill.invoice_number,
        bill.client_name,
        bill.invoice_date,
        bill.due_date,
        bill.total_amount.toString(),
        bill.payment_status,
        bill.status,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "billing_invoices.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading invoices...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">{error}</div>
              <Button
                onClick={() => window.location.reload()}
                className="cursor-pointer"
              >
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">
                        {searchTerm || filterStatus !== "all"
                          ? "No invoices found matching your criteria"
                          : "No invoices found. Create your first invoice!"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">
                        {bill.invoice_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bill.client_name}</div>
                          <div className="text-sm text-gray-500">
                            {bill.client_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{bill.invoice_date}</TableCell>
                      <TableCell>{bill.due_date}</TableCell>
                      <TableCell className="font-medium">
                        ${bill.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bill.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : bill.payment_status === "partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {bill.payment_status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bill.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : bill.status === "sent"
                              ? "bg-blue-100 text-blue-800"
                              : bill.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {bill.status}
                        </span>
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
