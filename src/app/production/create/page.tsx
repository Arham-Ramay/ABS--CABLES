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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function ProductionCreatePage() {
  const router = useRouter();
  const {
    productionRecords,
    loading,
    error,
    createProductionRecord,
    deleteProductionRecord,
    searchProductionRecords,
    filterByStatus,
  } = useProduction();

  // Form state
  const [formData, setFormData] = useState({
    product_name: "",
    product_code: "",
    quantity_produced: 0,
    quantity_defective: 0,
    production_date: new Date().toISOString().split("T")[0],
    production_line: "",
    shift: "day",
    produced_by: "",
    quality_check: false,
    notes: "",
    status: "in_progress" as
      | "in_progress"
      | "completed"
      | "quality_check"
      | "approved"
      | "rejected",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      product_name: "",
      product_code: "",
      quantity_produced: 0,
      quantity_defective: 0,
      production_date: new Date().toISOString().split("T")[0],
      production_line: "",
      shift: "day",
      produced_by: "",
      quality_check: false,
      notes: "",
      status: "in_progress",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createProductionRecord(formData);
      resetForm();
      alert("Production record created successfully!");
      // Redirect to main production page
      router.push("/production");
    } catch (error) {
      console.error("Failed to create production record:", error);
      alert("Failed to create production record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchProductionRecords(query);
    } else {
      searchProductionRecords("");
    }
  };

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "all") {
      searchProductionRecords("");
    } else {
      filterByStatus(status);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this production record?")) {
      try {
        await deleteProductionRecord(id);
        alert("Production record deleted successfully!");
      } catch (error) {
        console.error("Failed to delete production record:", error);
        alert("Failed to delete production record. Please try again.");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "quality_check":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/production">
              <Button
                variant="outline"
                size="lg"
                className="bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Production
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-blue-900">
                Create Production Record
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Plus className="h-6 w-6" />
                  Add New Production Record
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter production details to create a new record in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
                      Product Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="product_name"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Product Name *
                        </label>
                        <Input
                          id="product_name"
                          value={formData.product_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              product_name: e.target.value,
                            })
                          }
                          required
                          placeholder="e.g., Cable Assembly A"
                          className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product_code"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Product Code *
                        </label>
                        <Input
                          id="product_code"
                          value={formData.product_code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              product_code: e.target.value,
                            })
                          }
                          required
                          placeholder="e.g., CAB-001"
                          className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Production Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
                      Production Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="quantity_produced"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Quantity Produced *
                        </label>
                        <Input
                          id="quantity_produced"
                          type="number"
                          min="0"
                          value={formData.quantity_produced}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity_produced: parseInt(e.target.value) || 0,
                            })
                          }
                          required
                          placeholder="100"
                          className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="quantity_defective"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Quantity Defective
                        </label>
                        <Input
                          id="quantity_defective"
                          type="number"
                          min="0"
                          value={formData.quantity_defective}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity_defective: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                          className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="production_date"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Production Date *
                        </label>
                        <Input
                          id="production_date"
                          type="date"
                          value={formData.production_date}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              production_date: e.target.value,
                            })
                          }
                          required
                          className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="production_line"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Production Line
                        </label>
                        <Input
                          id="production_line"
                          value={formData.production_line}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              production_line: e.target.value,
                            })
                          }
                          placeholder="e.g., Line A, Line B"
                          className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="shift"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Shift
                        </label>
                        <Select
                          value={formData.shift}
                          onValueChange={(value) =>
                            setFormData({ ...formData, shift: value })
                          }
                        >
                          <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="day">Day Shift</SelectItem>
                            <SelectItem value="night">Night Shift</SelectItem>
                            <SelectItem value="morning">
                              Morning Shift
                            </SelectItem>
                            <SelectItem value="evening">
                              Evening Shift
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label
                          htmlFor="produced_by"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Produced By
                        </label>
                        <Input
                          id="produced_by"
                          value={formData.produced_by}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              produced_by: e.target.value,
                            })
                          }
                          placeholder="Employee name or ID"
                          className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-semibold text-blue-700 mb-2"
                        >
                          Production Status
                        </label>
                        <Select
                          value={formData.status}
                          onValueChange={(
                            value:
                              | "in_progress"
                              | "completed"
                              | "quality_check"
                              | "approved"
                              | "rejected"
                          ) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="quality_check">
                              Quality Check
                            </SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-semibold text-blue-700 mb-2"
                    >
                      Notes
                    </label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={4}
                      placeholder="Additional notes about this production record..."
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                    />
                  </div>

                  {/* Quality Check */}
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="quality_check"
                      checked={formData.quality_check}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quality_check: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                    />
                    <label
                      htmlFor="quality_check"
                      className="text-sm font-semibold text-blue-700"
                    >
                      Quality Check Passed
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Creating Record...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Create Production Record
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="h-14 px-8 text-lg font-semibold border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Reset Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Records - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-xl">
                  Recent Production Records
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Latest entries in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-red-600 text-sm">Error: {error}</div>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : productionRecords && productionRecords.length > 0 ? (
                    productionRecords.slice(0, 5).map((record) => (
                      <Card
                        key={record.id}
                        className="p-4 border border-blue-100 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-blue-900">
                                {record.product_name}
                              </h4>
                              <span className="text-sm text-blue-600">
                                ({record.product_code})
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                              <div>
                                <span className="font-medium">Qty:</span>{" "}
                                {record.quantity_produced}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span>{" "}
                                {record.production_date}
                              </div>
                              <div>
                                <span className="font-medium">Line:</span>{" "}
                                {record.production_line || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">By:</span>{" "}
                                {record.produced_by || "N/A"}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  record.status
                                )}`}
                              >
                                {record.status.replace("_", " ")}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  record.quality_check
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                Quality:{" "}
                                {record.quality_check ? "Passed" : "Failed"}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1 ml-4">
                            <Link href={`/production/edit/${record.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No production records yet. Create your first record using
                      the form.
                    </div>
                  )}
                </div>

                {productionRecords && productionRecords.length > 5 && (
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/production">
                      <Button variant="outline" className="w-full">
                        View All Records
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
