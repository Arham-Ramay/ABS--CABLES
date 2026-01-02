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
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function ProductionViewPage() {
  const params = useParams();
  const router = useRouter();
  const { productionRecords, getProductionById, deleteProductionRecord } =
    useProduction();

  const [production, setProduction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        } else {
          // If not found in existing records, fetch from database
          try {
            const record = await getProductionById(id);
            if (record) {
              setProduction(record);
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

  const handleDelete = async () => {
    if (!production) return;

    if (confirm("Are you sure you want to delete this production record?")) {
      try {
        await deleteProductionRecord(production.id);
        alert("Production record deleted successfully!");
        router.push("/production");
      } catch (err) {
        console.error("Failed to delete production record:", err);
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
                Production Record Details
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/production/edit/${production.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Information - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details Card */}
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Package className="h-6 w-6" />
                  Product Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Core details about the production record
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Product Name
                      </label>
                      <p className="text-xl font-semibold text-blue-900">
                        {production.product_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Product Code
                      </label>
                      <p className="text-xl font-semibold text-blue-900">
                        {production.product_code}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Production Date
                      </label>
                      <p className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        {production.production_date}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Quantity Produced
                      </label>
                      <p className="text-xl font-semibold text-blue-900">
                        {production.quantity_produced} units
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Quantity Defective
                      </label>
                      <p className="text-xl font-semibold text-blue-900">
                        {production.quantity_defective} units
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Production Line
                      </label>
                      <p className="text-xl font-semibold text-blue-900">
                        {production.production_line || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Production Details Card */}
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Settings className="h-6 w-6" />
                  Production Details
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Additional production information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Shift
                      </label>
                      <p className="text-xl font-semibold text-blue-900 capitalize">
                        {production.shift}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Produced By
                      </label>
                      <p className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        {production.produced_by || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Status
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            production.status
                          )}`}
                        >
                          {production.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Quality Check
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            production.quality_check
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {production.quality_check ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Passed
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Failed
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes Card */}
            {production.notes && (
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="h-6 w-6" />
                    Notes
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Additional information about this production
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {production.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white sticky top-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-blue-100">
                  Common tasks for this record
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Link href={`/production/edit/${production.id}`}>
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Record
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="w-full h-12 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Record
                </Button>

                <Link href="/production">
                  <Button variant="outline" className="w-full h-12">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to List
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="shadow-xl border-0 bg-white mt-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-xl">Summary</CardTitle>
                <CardDescription className="text-blue-100">
                  Production metrics at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-blue-900">
                    {production.quantity_produced > 0
                      ? Math.round(
                          ((production.quantity_produced -
                            production.quantity_defective) /
                            production.quantity_produced) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Good Units</span>
                  <span className="font-semibold text-green-600">
                    {production.quantity_produced -
                      production.quantity_defective}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Defective Units</span>
                  <span className="font-semibold text-red-600">
                    {production.quantity_defective}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
