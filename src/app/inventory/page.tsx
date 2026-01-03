"use client";

import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { Inventory } from "@/types";
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
  Package,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const { inventoryItems, loading, error, deleteInventoryItem } =
    useInventory();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = inventoryItems.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "low" &&
        item.quantity <= item.min_stock_level &&
        item.status !== "out_of_stock") ||
      (filterStatus === "normal" &&
        item.quantity > item.min_stock_level &&
        item.quantity < item.min_stock_level * 2) ||
      (filterStatus === "overstock" &&
        item.quantity >= item.min_stock_level * 2) ||
      (filterStatus === "out_of_stock" && item.status === "out_of_stock") ||
      (filterStatus === "available" && item.status === "available") ||
      (filterStatus === "reserved" && item.status === "reserved") ||
      (filterStatus === "damaged" && item.status === "damaged");

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const csvData = [
      [
        "Name",
        "Category",
        "Quantity",
        "Unit",
        "Min Stock Level",
        "Location",
        "Status",
        "Supplier",
        "Unit Price",
        "Total Value",
        "Purchase Date",
      ],
      ...filteredInventory.map((item) => [
        item.name,
        item.category,
        item.quantity.toString(),
        item.unit,
        item.min_stock_level.toString(),
        item.location || "",
        item.status,
        item.supplier || "",
        item.unit_price.toString(),
        (item.quantity * item.unit_price).toString(),
        item.purchase_date || "",
      ]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-export.csv";
    a.click();
  };

  const totalItems = filteredInventory.length;
  const lowStockItems = filteredInventory.filter(
    (item) =>
      item.quantity <= item.min_stock_level && item.status !== "out_of_stock"
  ).length;
  const totalStockValue = filteredInventory.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const getStockStatus = (item: Inventory) => {
    if (item.status === "out_of_stock") return "out_of_stock";
    if (item.status === "damaged") return "damaged";
    if (item.status === "reserved") return "reserved";
    if (item.quantity <= item.min_stock_level) return "low";
    if (item.quantity >= item.min_stock_level * 2) return "overstock";
    return "normal";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "out_of_stock":
        return <XCircle className="w-3 h-3 mr-1" />;
      case "reserved":
        return <Clock className="w-3 h-3 mr-1" />;
      case "damaged":
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      default:
        return <CheckCircle className="w-3 h-3 mr-1" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "copper":
        return "bg-orange-100 text-orange-800";
      case "pvc":
        return "bg-blue-100 text-blue-800";
      case "packing_boxes":
        return "bg-brown-100 text-brown-800";
      case "scrap":
        return "bg-gray-100 text-gray-800";
      case "stamps":
        return "bg-purple-100 text-purple-800";
      case "coils":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inventory item?")) {
      try {
        await deleteInventoryItem(id);
        alert("Inventory item deleted successfully!");
      } catch (error) {
        console.error("Failed to delete inventory item:", error);
        alert("Failed to delete inventory item. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold">
              Error Loading Inventory
            </h3>
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Inventory Management
        </h2>
        <div className="flex space-x-2">
          <Link href="/inventory/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
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
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>Summary of inventory statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {totalItems}
              </div>
              <div className="text-sm text-gray-800">Total Items</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {lowStockItems}
              </div>
              <div className="text-sm text-gray-800">Low Stock Items</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                ${totalStockValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-800">Total Value</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>
                Manage and track inventory levels
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Search items..."
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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No inventory items found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters or search query"
                  : "Get started by adding your first inventory item"}
              </p>
              <Link href="/inventory/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Item
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {item.category.replace("_", " ").toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="text-sm">
                        <div
                          className={`font-medium ${
                            item.quantity <= item.min_stock_level
                              ? "text-orange-600"
                              : "text-gray-900"
                          }`}
                        >
                          {item.quantity} {item.unit}
                        </div>
                        {item.quantity <= item.min_stock_level &&
                          item.status !== "out_of_stock" && (
                            <div className="text-xs text-orange-500">
                              Low stock
                            </div>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {item.min_stock_level} {item.unit}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {item.location || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            getStockStatus(item) === "low"
                              ? "bg-red-100 text-red-800"
                              : getStockStatus(item) === "overstock"
                              ? "bg-yellow-100 text-yellow-800"
                              : getStockStatus(item) === "out_of_stock"
                              ? "bg-red-100 text-red-800"
                              : getStockStatus(item) === "damaged"
                              ? "bg-orange-100 text-orange-800"
                              : getStockStatus(item) === "reserved"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {getStockStatus(item) === "low" && (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {getStockStatus(item) === "normal" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {getStockStatus(item) === "overstock" && (
                            <Package className="w-3 h-3 mr-1" />
                          )}
                          {getStockStatus(item) === "out_of_stock" && (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {getStockStatus(item) === "damaged" && (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {getStockStatus(item) === "reserved" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {getStockStatus(item).charAt(0).toUpperCase() +
                            getStockStatus(item).slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      ${item.unit_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/inventory/view`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/inventory/edit/${item.id}`}>
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
                          className="cursor-pointer text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
