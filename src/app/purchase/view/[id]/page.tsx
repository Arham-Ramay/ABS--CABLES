"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  User,
  DollarSign,
  Truck,
  FileText,
  CreditCard,
  Calendar,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { PurchaseRepository } from "@/repositories/purchaseRepository";
import { PurchaseOrder } from "@/types";

export default function PurchaseViewPage() {
  const params = useParams();
  const router = useRouter();
  const purchaseId = params.id as string;

  const [purchase, setPurchase] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch purchase order data on component mount
  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const purchaseData = await PurchaseRepository.getById(purchaseId);
        if (purchaseData) {
          setPurchase(purchaseData);
        } else {
          setError("Purchase order not found");
        }
      } catch (error) {
        console.error("Failed to fetch purchase order:", error);
        setError("Failed to load purchase order");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [purchaseId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "partial_delivered":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-orange-100 text-orange-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  const getQualityStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "inspected":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "paid":
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
      case "partial":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
      case "rejected":
      case "overdue":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading purchase order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {error || "Purchase order not found"}
            </p>
            <Link href="/purchase">
              <Button variant="outline">Back to Purchase</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/purchase">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Purchase
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Purchase Order Details
            </h1>
            <p className="text-gray-600 mt-2">
              Order Number: {purchase.order_number}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/purchase/edit/${purchase.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit Order
            </Button>
          </Link>
          <Button variant="outline" className="cursor-pointer">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <Card className="max-w-6xl mx-auto shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-2xl">
            <Package className="w-6 h-6 mr-2" />
            Order Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(purchase.order_status)}
              </div>
              <div className="text-sm font-medium text-blue-700 mb-1">
                Order Status
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  purchase.order_status
                )}`}
              >
                {purchase.order_status.charAt(0).toUpperCase() +
                  purchase.order_status.slice(1).replace("_", " ")}
              </span>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(purchase.payment_status)}
              </div>
              <div className="text-sm font-medium text-green-700 mb-1">
                Payment Status
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                  purchase.payment_status
                )}`}
              >
                {purchase.payment_status.charAt(0).toUpperCase() +
                  purchase.payment_status.slice(1)}
              </span>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(purchase.quality_status)}
              </div>
              <div className="text-sm font-medium text-purple-700 mb-1">
                Quality Status
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getQualityStatusColor(
                  purchase.quality_status
                )}`}
              >
                {purchase.quality_status.charAt(0).toUpperCase() +
                  purchase.quality_status.slice(1)}
              </span>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-yellow-700 mb-1">
                Final Amount
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                ${purchase.final_amount.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Information */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <User className="w-5 h-5 mr-2" />
              Supplier Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Supplier Name
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {purchase.supplier_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Contact Person
                </label>
                <p className="text-lg text-gray-900">
                  {purchase.supplier_contact_person || "Not specified"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">
                    {purchase.supplier_email || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-gray-900">
                    {purchase.supplier_phone || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {purchase.supplier_address || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <Package className="w-5 h-5 mr-2" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Product Name
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {purchase.product_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Category
                </label>
                <p className="text-gray-900 capitalize">
                  {purchase.product_category || "Not specified"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Quantity Ordered
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {purchase.quantity_ordered} {purchase.unit}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Quantity Received
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {purchase.quantity_received} {purchase.unit}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Unit Price
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  ${purchase.unit_price.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-900">
                  {purchase.product_description || "No description"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Details */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-xl">
            <DollarSign className="w-5 h-5 mr-2" />
            Financial Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Subtotal
              </label>
              <p className="text-lg font-semibold text-gray-900">
                ${purchase.total_amount.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Tax Amount
              </label>
              <p className="text-lg font-semibold text-gray-900">
                ${purchase.tax_amount.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Shipping Cost
              </label>
              <p className="text-lg font-semibold text-gray-900">
                ${purchase.shipping_cost.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Discount
              </label>
              <p className="text-lg font-semibold text-gray-900">
                -${purchase.discount_amount.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Final Amount
                </label>
                <p className="text-2xl font-bold text-green-600">
                  ${purchase.final_amount.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Amount Paid
                </label>
                <p className="text-2xl font-bold text-blue-600">
                  ${purchase.amount_paid.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-xl">
            <Calendar className="w-5 h-5 mr-2" />
            Order Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Order Date
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.order_date}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Expected Delivery
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.expected_delivery_date || "Not set"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Actual Delivery
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.actual_delivery_date || "Not delivered yet"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Payment Due Date
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.payment_due_date || "Not set"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Payment Method
              </label>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {purchase.payment_method || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Invoice Number
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {purchase.invoice_number || "Not generated"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {(purchase.notes ||
        purchase.internal_notes ||
        purchase.quality_notes ||
        purchase.terms_conditions) && (
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <FileText className="w-5 h-5 mr-2" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {purchase.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Notes
                  </label>
                  <p className="text-gray-900 mt-1">{purchase.notes}</p>
                </div>
              )}
              {purchase.internal_notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Internal Notes
                  </label>
                  <p className="text-gray-900 mt-1">
                    {purchase.internal_notes}
                  </p>
                </div>
              )}
              {purchase.quality_notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Quality Notes
                  </label>
                  <p className="text-gray-900 mt-1">{purchase.quality_notes}</p>
                </div>
              )}
              {purchase.terms_conditions && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Terms & Conditions
                  </label>
                  <p className="text-gray-900 mt-1">
                    {purchase.terms_conditions}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
