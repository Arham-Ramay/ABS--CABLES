"use client";

import { useState } from "react";
import { useProduction } from "@/hooks/useProduction";
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
  Search,
  Filter,
  Package,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function ProductionPage() {
  const {
    productionRecords,
    loading,
    error,
    createProductionRecord,
    deleteProductionRecord,
    searchProductionRecords,
    filterByStatus,
  } = useProduction();

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchProductionRecords(term);
    }
  };

  const handleFilter = (status: string) => {
    setFilterStatus(status);
    if (status === "all") {
      searchProductionRecords("");
    } else {
      filterByStatus(status);
    }
  };

  const exportCSV = () => {
    const csvData = [
      [
        "Product Name",
        "Product Code",
        "Quantity",
        "Date",
        "Line",
        "Produced By",
        "Quality Check",
        "Status",
      ],
      ...productionRecords.map((prod) => [
        prod.product_name,
        prod.product_code,
        prod.quantity_produced.toString(),
        prod.production_date,
        prod.production_line || "N/A",
        prod.produced_by || "N/A",
        prod.quality_check ? "Passed" : "Failed",
        prod.status,
      ]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "production-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this production record?")
    ) {
      try {
        await deleteProductionRecord(id);
      } catch (err) {
        console.error("Failed to delete production record:", err);
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

  const totalProduction = productionRecords.length;
  const passedQuality = productionRecords.filter(
    (prod) => prod.quality_check
  ).length;
  const failedQuality = productionRecords.filter(
    (prod) => !prod.quality_check
  ).length;
  const totalQuantity = productionRecords.reduce(
    (sum, prod) => sum + prod.quantity_produced,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-black">Production Management</h2>
        <div className="flex space-x-2">
          <Link href="/production/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Production
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
          <CardTitle>Production Overview</CardTitle>
          <CardDescription>Summary of production statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {totalProduction}
              </div>
              <div className="text-sm text-black">Total Records</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {passedQuality}
              </div>
              <div className="text-sm text-black">Passed Quality</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {failedQuality}
              </div>
              <div className="text-sm text-black">Failed Quality</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {totalQuantity.toLocaleString()}
              </div>
              <div className="text-sm text-black">Total Units</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Production Records</CardTitle>
              <CardDescription>
                Manage and track production data
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Search production..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64"
              />
              <Select value={filterStatus} onValueChange={handleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="quality_check">Quality Check</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Product Code</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Line</TableHead>
                <TableHead>Produced By</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionRecords.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell className="font-medium">
                    {prod.product_name}
                  </TableCell>
                  <TableCell className="text-black">
                    {prod.product_code}
                  </TableCell>
                  <TableCell className="text-black">
                    {prod.quantity_produced}
                  </TableCell>
                  <TableCell className="text-black">
                    {prod.production_date}
                  </TableCell>
                  <TableCell className="text-black">
                    {prod.production_line || "-"}
                  </TableCell>
                  <TableCell className="text-black">
                    {prod.produced_by || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        prod.quality_check
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prod.quality_check ? "Passed" : "Failed"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        prod.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : prod.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : prod.status === "quality_check"
                          ? "bg-yellow-100 text-yellow-800"
                          : prod.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prod.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/production/view/${prod.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/production/edit/${prod.id}`}>
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
                        onClick={() => handleDelete(prod.id)}
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
