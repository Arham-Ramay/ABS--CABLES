"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  User,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SalesRepository } from "@/repositories/salesRepository";
import { Sale } from "@/types";

export default function SalesViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [saleId, setSaleId] = useState<string>("");

  // Handle async params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setSaleId(id);
    };
    getParams();
  }, [params]);

  // Load sale data
  useEffect(() => {
    const loadSale = async () => {
      if (!saleId) return;

      try {
        const saleData = await SalesRepository.getById(saleId);
        setSale(saleData);
      } catch (error) {
        console.error("Error loading sale:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSale();
  }, [saleId]);

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "partial":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "overdue":
        return "text-red-700 bg-red-100";
      case "partial":
        return "text-orange-700 bg-orange-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-700 bg-green-100";
      case "shipped":
        return "text-blue-700 bg-blue-100";
      case "confirmed":
        return "text-purple-700 bg-purple-100";
      case "processing":
        return "text-yellow-700 bg-yellow-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this sale?")) {
      try {
        await SalesRepository.delete(saleId);
        alert("Sale deleted successfully!");
        router.push("/sales");
      } catch (error) {
        console.error("Failed to delete sale:", error);
        alert("Failed to delete sale. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold">Sale Not Found</h3>
            <p className="text-red-600">
              The sale you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/sales">
              <Button
                variant="outline"
                size="lg"
                className="bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Sales
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-blue-900">Sale Details</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/sales/edit/${saleId}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Edit className="mr-2 h-5 w-5" />
                Edit Sale
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Information Card */}
          <Card className="lg:col-span-1 bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Party Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {sale.party_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">
                      {sale.customer_email || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">
                      {sale.customer_phone || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Billing Address
                  </label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-900">
                      {sale.billing_address || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Delivery Address
                  </label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-900">
                      {sale.delivery_address || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information Card */}
          <Card className="lg:col-span-1 bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Coil Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {sale.coil_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Category
                  </label>
                  <p className="text-gray-900">
                    {sale.product_category || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <p className="text-gray-900">
                    {sale.product_description || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Quantity
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {sale.quantity} {sale.unit}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Unit Price
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    ${sale.unit_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary Card */}
          <Card className="lg:col-span-1 bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">
                    Total Amount
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    ${sale.total_amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">
                    Tax Amount
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    +${sale.tax_amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">
                    Discount Amount
                  </label>
                  <p className="text-lg font-semibold text-red-600">
                    -${sale.discount_amount.toFixed(2)}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-600">
                      Final Amount
                    </label>
                    <p className="text-2xl font-bold text-blue-600">
                      ${sale.final_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">
                    Debit
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    ${sale.debit.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">
                    Credit
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    ${sale.credit.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Details */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Invoice Number
                </label>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-900">
                    {sale.invoice_number || "-"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Sale Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Delivery Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">
                    {sale.delivery_date
                      ? new Date(sale.delivery_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Payment Due Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">
                    {sale.payment_due_date
                      ? new Date(sale.payment_due_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Payment Method
                </label>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{sale.payment_method || "-"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Payment Status
                </label>
                <div className="flex items-center gap-2">
                  {getPaymentStatusIcon(sale.payment_status)}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                      sale.payment_status
                    )}`}
                  >
                    {sale.payment_status.charAt(0).toUpperCase() +
                      sale.payment_status.slice(1)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Order Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(
                    sale.order_status
                  )}`}
                >
                  {sale.order_status.charAt(0).toUpperCase() +
                    sale.order_status.slice(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <CardTitle>Customer Comments</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-900">
                {sale.comments || "No comments provided"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-slate-600 text-white">
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-900">
                {sale.internal_notes || "No internal notes provided"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terms and Conditions */}
        {sale.terms_conditions && (
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-900">{sale.terms_conditions}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
