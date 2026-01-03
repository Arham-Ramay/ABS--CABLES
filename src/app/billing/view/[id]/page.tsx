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
  ArrowLeft,
  Edit,
  FileText,
  User,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
} from "lucide-react";
import Link from "next/link";
import { BillingRepository } from "@/repositories/billingRepository";

export default function BillingViewPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data: any = await BillingRepository.getInvoiceById(invoiceId);

        if (!data) {
          setError("Invoice not found");
          return;
        }

        setInvoice(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch invoice:", error);
        setError("Failed to load invoice data");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 mr-1" />;
      default:
        return <Clock className="w-4 h-4 mr-1" />;
    }
  };

  const exportPDF = () => {
    // Simple print functionality for now
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            {error || "Invoice not found"}
          </div>
          <Link href="/billing">
            <Button className="cursor-pointer">Back to Billing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/billing">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Billing
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Invoice Details
            </h1>
            <p className="text-gray-600 mt-2">
              View invoice #{invoice.invoice_number}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/billing/edit/${invoiceId}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit Invoice
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={exportPDF}
            className="cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Invoice Header */}
      <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Invoice #{invoice.invoice_number}
              </CardTitle>
              <CardDescription className="text-blue-100 mt-2">
                Created on {new Date(invoice.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
                {getStatusIcon(invoice.status)}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    invoice.status
                  )}`}
                >
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </span>
              </div>
              <div className="text-blue-100 text-sm">
                Due: {new Date(invoice.due_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Client Information
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium text-gray-900">
                    {invoice.client_name}
                  </div>
                </div>
                {invoice.client_email && (
                  <div className="flex items-start">
                    <Mail className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">
                        {invoice.client_email}
                      </div>
                    </div>
                  </div>
                )}
                {invoice.client_phone && (
                  <div className="flex items-start">
                    <Phone className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium text-gray-900">
                        {invoice.client_phone}
                      </div>
                    </div>
                  </div>
                )}
                {invoice.client_address && (
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium text-gray-900">
                        {invoice.client_address}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Invoice Details
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Invoice Date</div>
                  <div className="font-medium text-gray-900">
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Due Date</div>
                  <div className="font-medium text-gray-900">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Payment Method</div>
                  <div className="font-medium text-gray-900">
                    {invoice.payment_method || "Not specified"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Payment Status</div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        invoice.payment_status
                      )}`}
                    >
                      {invoice.payment_status.charAt(0).toUpperCase() +
                        invoice.payment_status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Item Information */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Item Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Item Name</div>
                  <div className="font-medium text-gray-900 text-lg">
                    {invoice.item_name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Description</div>
                  <div className="font-medium text-gray-900">
                    {invoice.item_description || "No description provided"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Quantity</div>
                  <div className="font-medium text-gray-900">
                    {invoice.quantity} {invoice.unit}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Unit Price</div>
                  <div className="font-medium text-gray-900">
                    ${invoice.unit_price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Financial Summary
            </h3>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-blue-700">Subtotal</div>
                  <div className="text-2xl font-bold text-blue-900">
                    ${invoice.subtotal.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700">Discount Amount</div>
                  <div className="text-2xl font-bold text-orange-600">
                    -${invoice.discount_amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700">Tax Amount (18%)</div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${invoice.tax_amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700">Total Amount</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${invoice.total_amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700">Amount Paid</div>
                  <div className="text-2xl font-bold text-blue-900">
                    ${invoice.amount_paid.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700">Balance Due</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${invoice.balance_due.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div className="space-x-4">
              <Link href="/billing">
                <Button variant="outline" className="cursor-pointer">
                  Back to List
                </Button>
              </Link>
            </div>
            <div className="space-x-2">
              <Link href={`/billing/edit/${invoiceId}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Invoice
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={exportPDF}
                className="cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
