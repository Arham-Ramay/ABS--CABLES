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
  Package,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

// Mock data for purchases
const mockPurchases = [
  {
    id: "1",
    order_number: "PO-001",
    supplier_name: "ABC Supplies",
    supplier_email: "contact@abc.com",
    order_date: "2024-01-15",
    expected_delivery: "2024-01-20",
    total_amount: 5000,
    status: "pending",
    payment_status: "unpaid",
    items_count: 5,
  },
  {
    id: "2",
    order_number: "PO-002",
    supplier_name: "XYZ Materials",
    supplier_email: "info@xyz.com",
    order_date: "2024-01-14",
    expected_delivery: "2024-01-18",
    total_amount: 3200,
    status: "processing",
    payment_status: "partial",
    items_count: 3,
  },
  {
    id: "3",
    order_number: "PO-003",
    supplier_name: "Global Components",
    supplier_email: "sales@global.com",
    order_date: "2024-01-13",
    expected_delivery: "2024-01-17",
    total_amount: 8500,
    status: "delivered",
    payment_status: "paid",
    items_count: 8,
  },
];

export default function PurchasePage() {
  const [purchases] = useState(mockPurchases);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      searchTerm === "" ||
      purchase.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || purchase.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const csvData = [
      [
        "Order Number",
        "Supplier",
        "Order Date",
        "Expected Delivery",
        "Total Amount",
        "Status",
        "Payment Status",
      ],
      ...filteredPurchases.map((purchase) => [
        purchase.order_number,
        purchase.supplier_name,
        purchase.order_date,
        purchase.expected_delivery,
        purchase.total_amount.toString(),
        purchase.status,
        purchase.payment_status,
      ]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purchases-export.csv";
    a.click();
  };

  const totalPurchases = filteredPurchases.length;
  const pendingPurchases = filteredPurchases.filter(
    (p) => p.status === "pending"
  ).length;
  const totalValue = filteredPurchases.reduce(
    (sum, purchase) => sum + purchase.total_amount,
    0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-orange-100 text-orange-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Purchase Orders</h2>
        <div className="flex space-x-2">
          <Link href="/purchase/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Purchase Order
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
          <CardTitle>Purchase Overview</CardTitle>
          <CardDescription>Summary of purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {totalPurchases}
              </div>
              <div className="text-sm text-gray-900">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Package className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {pendingPurchases}
              </div>
              <div className="text-sm text-gray-900">Pending Orders</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                ${totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-900">Total Value</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                Manage purchase orders and supplier relationships
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Search orders..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">
                    {purchase.order_number}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    <div>
                      <div className="font-medium">
                        {purchase.supplier_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {purchase.supplier_email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {purchase.order_date}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {purchase.expected_delivery}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    ${purchase.total_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        purchase.status
                      )}`}
                    >
                      {purchase.status.charAt(0).toUpperCase() +
                        purchase.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        purchase.payment_status
                      )}`}
                    >
                      {purchase.payment_status.charAt(0).toUpperCase() +
                        purchase.payment_status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {purchase.items_count}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/purchase/view/${purchase.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/purchase/edit/${purchase.id}`}>
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
