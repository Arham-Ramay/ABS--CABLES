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
  Trash2,
  Eye,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
} from "lucide-react";
import Link from "next/link";
import { SalesRepository } from "@/repositories/salesRepository";
import { Sale } from "@/types";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load sales data from database
  useEffect(() => {
    const loadSales = async () => {
      try {
        const salesData = await SalesRepository.getAll();
        setSales(salesData);
      } catch (error) {
        console.error("Error loading sales:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      searchTerm === "" ||
      sale.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.coil_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || sale.payment_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const csvData = [
      [
        "Invoice",
        "Party Name",
        "Coil Name",
        "Email",
        "Phone",
        "Date",
        "Quantity",
        "Unit Price",
        "Total",
        "Final Amount",
        "Status",
      ],
      ...filteredSales.map((sale) => [
        sale.invoice_number || "N/A",
        sale.party_name,
        sale.coil_name,
        sale.customer_email || "N/A",
        sale.customer_phone || "N/A",
        sale.sale_date,
        sale.quantity.toString(),
        sale.unit_price.toString(),
        sale.total_amount.toString(),
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await SalesRepository.delete(id);
        setSales(sales.filter((sale) => sale.id !== id));
      } catch (error) {
        console.error("Error deleting sale:", error);
        alert("Failed to delete sale. Please try again.");
      }
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">Sales Management</h2>
          <p className="text-gray-600 mt-2">
            Manage and track your sales transactions
          </p>
        </div>
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

      {/* Sales Overview Cards */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="text-2xl">Sales Overview</CardTitle>
          <CardDescription className="text-blue-100">
            Real-time sales statistics and metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
              <ShoppingCart className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-600">
                {totalSales}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Total Sales
              </div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-600">
                {paidSales}
              </div>
              <div className="text-sm text-gray-700 font-medium">Paid</div>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
              <Clock className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-yellow-600">
                {pendingSales}
              </div>
              <div className="text-sm text-gray-700 font-medium">Pending</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
              <DollarSign className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-600">
                ${totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                Total Revenue
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Records Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-gray-900">
                Sales Records
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage and track all sales transactions
              </CardDescription>
            </div>
            <div className="flex space-x-3">
              <Input
                placeholder="Search by party, invoice, or coil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 h-10"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 h-10">
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">
                    Invoice
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Party Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Coil Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Quantity
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Unit Price
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Final Amount
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center py-8 text-gray-500"
                    >
                      {loading ? "Loading..." : "No sales records found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow
                      key={sale.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {sale.invoice_number || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-900 font-medium">
                        {sale.party_name}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-blue-600" />
                          {sale.coil_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {sale.customer_email || "-"}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {sale.customer_phone || "-"}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {sale.quantity} {sale.unit}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        ${sale.unit_price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-900 font-semibold">
                        ${sale.final_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                              className="cursor-pointer hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/sales/edit/${sale.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(sale.id)}
                            className="cursor-pointer hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
