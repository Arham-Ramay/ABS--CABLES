"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
  Save,
  Package,
  Calendar,
  User,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export default function ProductionEditPage() {
  const params = useParams();
  const router = useRouter();
  const { productionRecords, getProductionById, updateProductionRecord } =
    useProduction();

  const [production, setProduction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    product_name: "",
    product_code: "",
    quantity_produced: 0,
    quantity_defective: 0,
    production_date: "",
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

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const id = params.id as string;
        if (!id) {
          setError("Production ID is required");
          setLoading(false);
          return;
        }

        // First try to find in existing records
        const existingRecord = productionRecords?.find(
          (record) => record.id === id
        );

        if (existingRecord) {
          setProduction(existingRecord);
          setFormData({
            product_name: existingRecord.product_name || "",
            product_code: existingRecord.product_code || "",
            quantity_produced: existingRecord.quantity_produced || 0,
            quantity_defective: existingRecord.quantity_defective || 0,
            production_date: existingRecord.production_date || "",
            production_line: existingRecord.production_line || "",
            shift: existingRecord.shift || "day",
            produced_by: existingRecord.produced_by || "",
            quality_check: existingRecord.quality_check || false,
            notes: existingRecord.notes || "",
            status: existingRecord.status || "in_progress",
          });
        } else {
          // If not found in existing records, fetch from database
          try {
            const record = await getProductionById(id);
            if (record) {
              setProduction(record);
              setFormData({
                product_name: record.product_name || "",
                product_code: record.product_code || "",
                quantity_produced: record.quantity_produced || 0,
                quantity_defective: record.quantity_defective || 0,
                production_date: record.production_date || "",
                production_line: record.production_line || "",
                shift: record.shift || "day",
                produced_by: record.produced_by || "",
                quality_check: record.quality_check || false,
                notes: record.notes || "",
                status: record.status || "in_progress",
              });
            } else {
              setError("Production record not found");
            }
          } catch (apiError) {
            console.error("API Error:", apiError);
            setError("Failed to fetch production record from database");
          }
        }
      } catch (err) {
        console.error("Error in fetchProduction:", err);
        setError("Failed to fetch production record");
      } finally {
        setLoading(false);
      }
    };

    fetchProduction();
  }, [params.id]); // Remove productionRecords and getProductionById from dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!production) return;

    setIsSubmitting(true);

    try {
      await updateProductionRecord(production.id, formData);
      alert("Production record updated successfully!");
      router.push("/production");
    } catch (error) {
      console.error("Failed to update production record:", error);
      alert("Failed to update production record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !production) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-4">
              {error || "Production record not found"}
            </div>
            <Link href="/production">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Production
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-4xl">
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
                Edit Production Record
              </h1>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Settings className="h-6 w-6" />
              Update Production Record
            </CardTitle>
            <CardDescription className="text-blue-100">
              Modify the details of this production record
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
                        handleInputChange("product_name", e.target.value)
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
                        handleInputChange("product_code", e.target.value)
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
                        handleInputChange(
                          "quantity_produced",
                          parseInt(e.target.value) || 0
                        )
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
                        handleInputChange(
                          "quantity_defective",
                          parseInt(e.target.value) || 0
                        )
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
                        handleInputChange("production_date", e.target.value)
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
                        handleInputChange("production_line", e.target.value)
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
                        handleInputChange("shift", value)
                      }
                    >
                      <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day Shift</SelectItem>
                        <SelectItem value="night">Night Shift</SelectItem>
                        <SelectItem value="morning">Morning Shift</SelectItem>
                        <SelectItem value="evening">Evening Shift</SelectItem>
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
                        handleInputChange("produced_by", e.target.value)
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
                      ) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_progress">In Progress</SelectItem>
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
                  onChange={(e) => handleInputChange("notes", e.target.value)}
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
                    handleInputChange("quality_check", e.target.checked)
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
                      Updating Record...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Update Production Record
                    </>
                  )}
                </Button>
                <Link href="/production">
                  <Button
                    variant="outline"
                    className="h-14 px-8 text-lg font-semibold border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
