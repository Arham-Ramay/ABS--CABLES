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
  Package,
  AlertTriangle,
  CheckCircle,
  Warehouse,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

// Mock data for inventory
const mockInventory = [
  {
    id: "1",
    product_name: "Copper Cable 10mm",
    sku: "CC-001",
    current_stock: 150,
    min_threshold: 50,
    max_threshold: 500,
    warehouse_location: "Warehouse A",
    last_updated: "2024-01-15",
    unit_price: 25.5,
    total_value: 3825,
  },
  {
    id: "2",
    product_name: "Fiber Optic Cable",
    sku: "FO-002",
    current_stock: 25,
    min_threshold: 30,
    max_threshold: 200,
    warehouse_location: "Warehouse B",
    last_updated: "2024-01-14",
    unit_price: 45.0,
    total_value: 1125,
  },
  {
    id: "3",
    product_name: "Ethernet Cable CAT6",
    sku: "EC-003",
    current_stock: 200,
    min_threshold: 75,
    max_threshold: 400,
    warehouse_location: "Warehouse A",
    last_updated: "2024-01-15",
    unit_price: 12.75,
    total_value: 2550,
  },
];

export default function InventoryPage() {
  const [inventory] = useState(mockInventory);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "low" && item.current_stock <= item.min_threshold) ||
      (filterStatus === "normal" &&
        item.current_stock > item.min_threshold &&
        item.current_stock < item.max_threshold) ||
      (filterStatus === "overstock" &&
        item.current_stock >= item.max_threshold);

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const csvData = [
      [
        "Product",
        "SKU",
        "Stock",
        "Min Threshold",
        "Max Threshold",
        "Location",
        "Unit Price",
        "Total Value",
      ],
      ...filteredInventory.map((item) => [
        item.product_name,
        item.sku,
        item.current_stock.toString(),
        item.min_threshold.toString(),
        item.max_threshold.toString(),
        item.warehouse_location,
        item.unit_price.toString(),
        item.total_value.toString(),
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
    (item) => item.current_stock <= item.min_threshold
  ).length;
  const totalStockValue = filteredInventory.reduce(
    (sum, item) => sum + item.total_value,
    0
  );

  const getStockStatus = (item: (typeof mockInventory)[0]) => {
    if (item.current_stock <= item.min_threshold) return "low";
    if (item.current_stock >= item.max_threshold) return "overstock";
    return "normal";
  };

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
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.product_name}
                  </TableCell>
                  <TableCell className="text-gray-900">{item.sku}</TableCell>
                  <TableCell className="text-gray-900">
                    {item.current_stock}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {item.min_threshold}/{item.max_threshold}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {item.warehouse_location}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    ${item.unit_price}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    ${item.total_value}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        getStockStatus(item) === "low"
                          ? "bg-red-100 text-red-800"
                          : getStockStatus(item) === "overstock"
                          ? "bg-yellow-100 text-yellow-800"
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
                      {getStockStatus(item).charAt(0).toUpperCase() +
                        getStockStatus(item).slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/inventory/view/${item.id}`}>
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
