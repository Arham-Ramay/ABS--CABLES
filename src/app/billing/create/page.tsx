"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Save,
  DollarSign,
  FileText,
  User,
  Calculator,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BillingRepository } from "@/repositories/billingRepository";

interface BillingFormData {
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  invoice_date: string;
  due_date: string;
  item_name: string;
  item_description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  payment_method: string;
  status: string;
  notes: string;
  created_by: string;
}

export default function BillingCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<BillingFormData>({
    invoice_number: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    client_address: "",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    item_name: "",
    item_description: "",
    quantity: 1,
    unit: "pcs",
    unit_price: 0,
    subtotal: 0,
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 0,
    amount_paid: 0,
    balance_due: 0,
    payment_status: "pending",
    payment_method: "bank_transfer",
    status: "draft",
    notes: "",
    created_by: "Admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate invoice number
  useEffect(() => {
    const generateInvoiceNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, "0");
      return `INV-${year}-${month}-${random}`;
    };

    setFormData((prev) => ({
      ...prev,
      invoice_number: generateInvoiceNumber(),
    }));
  }, []);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.quantity * formData.unit_price;
    const taxAmount = subtotal * 0.18; // 18% tax
    const totalAmount = subtotal - formData.discount_amount + taxAmount;
    const balanceDue = totalAmount - formData.amount_paid;

    return {
      subtotal,
      taxAmount,
      totalAmount,
      balanceDue,
    };
  };

  // Update totals when values change
  useEffect(() => {
    const totals = calculateTotals();
    setFormData((prev) => ({
      ...prev,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total_amount: totals.totalAmount,
      balance_due: totals.balanceDue,
    }));
  }, [
    formData.quantity,
    formData.unit_price,
    formData.discount_amount,
    formData.amount_paid,
  ]);

  // Handle form input change
  const handleInputChange = (
    field: keyof BillingFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.client_name ||
        !formData.item_name ||
        formData.unit_price <= 0
      ) {
        setError("Please fill in all required fields with valid values");
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const submissionData = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        client_address: formData.client_address,
        invoice_number: formData.invoice_number,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        item_name: formData.item_name,
        item_description: formData.item_description,
        quantity: formData.quantity,
        unit: formData.unit,
        unit_price: formData.unit_price,
        subtotal: formData.subtotal,
        discount_amount: formData.discount_amount,
        tax_amount: formData.tax_amount,
        total_amount: formData.total_amount,
        amount_paid: formData.amount_paid,
        balance_due: formData.balance_due,
        payment_status: formData.payment_status,
        payment_method: formData.payment_method,
        status: formData.status,
        notes: formData.notes,
        created_by: formData.created_by,
      };

      // Save to database using BillingRepository
      const savedInvoice = await BillingRepository.createInvoice(
        submissionData
      );

      console.log("Invoice saved successfully:", savedInvoice);
      alert("Invoice created successfully!");
      router.push("/billing");
    } catch (error) {
      console.error("Failed to create invoice:", error);
      setError("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
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
            Create New Invoice
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new invoice for your client
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-2xl">
            <FileText className="w-6 h-6 mr-2" />
            Invoice Information
          </CardTitle>
          <CardDescription className="text-blue-100">
            Enter the invoice and client details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Invoice Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Invoice Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Invoice Number *
                  </label>
                  <Input
                    value={formData.invoice_number}
                    onChange={(e) =>
                      handleInputChange("invoice_number", e.target.value)
                    }
                    placeholder="Auto-generated"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Invoice Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.invoice_date}
                    onChange={(e) =>
                      handleInputChange("invoice_date", e.target.value)
                    }
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Due Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) =>
                      handleInputChange("due_date", e.target.value)
                    }
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Client Name *
                  </label>
                  <Input
                    value={formData.client_name}
                    onChange={(e) =>
                      handleInputChange("client_name", e.target.value)
                    }
                    placeholder="Enter client name"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) =>
                      handleInputChange("client_email", e.target.value)
                    }
                    placeholder="client@example.com"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Phone
                  </label>
                  <Input
                    value={formData.client_phone}
                    onChange={(e) =>
                      handleInputChange("client_phone", e.target.value)
                    }
                    placeholder="+1234567890"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Payment Method
                  </label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) =>
                      handleInputChange("payment_method", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Address
                </label>
                <Textarea
                  value={formData.client_address}
                  onChange={(e) =>
                    handleInputChange("client_address", e.target.value)
                  }
                  placeholder="Enter client address"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Item Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Item Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Item Name *
                  </label>
                  <Input
                    value={formData.item_name}
                    onChange={(e) =>
                      handleInputChange("item_name", e.target.value)
                    }
                    placeholder="Enter item name"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange(
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="1"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Unit
                  </label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => handleInputChange("unit", value)}
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pcs</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="rolls">Rolls</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Unit Price *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) =>
                      handleInputChange(
                        "unit_price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.item_description}
                  onChange={(e) =>
                    handleInputChange("item_description", e.target.value)
                  }
                  placeholder="Enter item description"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Financial Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Discount Amount
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_amount}
                    onChange={(e) =>
                      handleInputChange(
                        "discount_amount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Tax Amount (18%)
                  </label>
                  <div className="h-12 text-lg font-semibold text-blue-900 flex items-center px-3 bg-gray-50 rounded-lg border">
                    ${formData.tax_amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Amount Paid
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount_paid}
                    onChange={(e) =>
                      handleInputChange(
                        "amount_paid",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Payment Status
                  </label>
                  <Select
                    value={formData.payment_status}
                    onValueChange={(value) =>
                      handleInputChange("payment_status", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-50 p-6 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Subtotal
                  </label>
                  <div className="text-2xl font-bold text-blue-900">
                    ${formData.subtotal.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Tax Amount
                  </label>
                  <div className="text-2xl font-bold text-orange-600">
                    ${formData.tax_amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Total Amount
                  </label>
                  <div className="text-2xl font-bold text-green-600">
                    ${formData.total_amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Balance Due
                  </label>
                  <div className="text-2xl font-bold text-purple-600">
                    ${formData.balance_due.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Additional Information
              </h3>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Notes
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes for the client"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <div className="space-x-4">
                <Link href="/billing">
                  <Button variant="outline" className="cursor-pointer">
                    Cancel
                  </Button>
                </Link>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Create Invoice
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
