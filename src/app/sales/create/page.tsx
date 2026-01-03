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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  DollarSign,
  Package,
  User,
  Calendar,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { SalesRepository } from "@/repositories/salesRepository";

export default function SalesCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Party Information
    party_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    billing_address: "",

    // Product Information
    coil_name: "",
    product_category: "",
    product_description: "",

    // Quantity and Pricing
    quantity: 0,
    unit: "pcs",
    unit_price: 0,
    total_amount: 0,

    // Financial Details
    tax_amount: 0,
    discount_amount: 0,
    final_amount: 0,

    // Accounting Fields
    debit: 0,
    credit: 0,
    payment_status: "pending" as "pending" | "paid" | "partial" | "overdue",
    payment_method: "",
    payment_due_date: "",

    // Transaction Details
    invoice_number: "",
    sale_date: new Date().toISOString().split("T")[0],
    delivery_date: "",

    // Status and Tracking
    status: "pending" as
      | "pending"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "cancelled",
    order_status: "processing" as
      | "processing"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "cancelled",

    // Comments and Notes
    comments: "",
    internal_notes: "",

    // Additional Fields
    reference_number: "",
    terms_conditions: "",
    delivery_address: "",
    created_by: "Admin",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission (exclude fields that are auto-generated)
      const submissionData = {
        party_name: formData.party_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        billing_address: formData.billing_address,
        coil_name: formData.coil_name,
        product_category: formData.product_category,
        product_description: formData.product_description,
        quantity: formData.quantity,
        unit: formData.unit,
        unit_price: formData.unit_price,
        total_amount: formData.total_amount,
        tax_amount: formData.tax_amount,
        discount_amount: formData.discount_amount,
        final_amount: formData.final_amount,
        debit: formData.debit,
        credit: formData.credit,
        payment_status: formData.payment_status,
        payment_method: formData.payment_method,
        payment_due_date: formData.payment_due_date,
        invoice_number: formData.invoice_number,
        sale_date: formData.sale_date,
        delivery_date: formData.delivery_date,
        status: formData.status,
        order_status: formData.order_status,
        comments: formData.comments,
        internal_notes: formData.internal_notes,
        reference_number: formData.reference_number,
        terms_conditions: formData.terms_conditions,
        delivery_address: formData.delivery_address,
        created_by: formData.created_by,
      };

      const newSale = await SalesRepository.create(submissionData);
      console.log("Sale created successfully:", newSale);
      alert("Sale created successfully!");
      router.push("/sales");
    } catch (err) {
      console.error("Failed to create sale:", err);
      alert("Failed to create sale. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalAmount = (currentData = formData) => {
    const total = currentData.quantity * currentData.unit_price;
    const final = total + currentData.tax_amount - currentData.discount_amount;
    return {
      total_amount: total,
      final_amount: Math.max(0, final),
    };
  };

  const resetForm = () => {
    setFormData({
      party_name: "",
      customer_email: "",
      customer_phone: "",
      customer_address: "",
      billing_address: "",
      coil_name: "",
      product_category: "",
      product_description: "",
      quantity: 0,
      unit: "pcs",
      unit_price: 0,
      total_amount: 0,
      tax_amount: 0,
      discount_amount: 0,
      final_amount: 0,
      debit: 0,
      credit: 0,
      payment_status: "pending",
      payment_method: "",
      payment_due_date: "",
      invoice_number: "",
      sale_date: new Date().toISOString().split("T")[0],
      delivery_date: "",
      status: "pending",
      order_status: "processing",
      comments: "",
      internal_notes: "",
      reference_number: "",
      terms_conditions: "",
      delivery_address: "",
      created_by: "Admin",
    });
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/sales">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sales
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Create New Sale</h1>
          <p className="text-gray-600 mt-2">
            Add a new sales transaction to the system
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="max-w-6xl mx-auto shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-2xl">
            <DollarSign className="w-6 h-6 mr-2" />
            Sales Information
          </CardTitle>
          <CardDescription className="text-blue-100">
            Enter the details for this sales transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Party/Customer Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Party Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Party Name *
                  </label>
                  <Input
                    value={formData.party_name}
                    onChange={(e) =>
                      setFormData({ ...formData, party_name: e.target.value })
                    }
                    placeholder="Enter party name"
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
                    value={formData.customer_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_email: e.target.value,
                      })
                    }
                    placeholder="party@example.com"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Phone
                  </label>
                  <Input
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_phone: e.target.value,
                      })
                    }
                    placeholder="+1234567890"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Billing Address
                  </label>
                  <Textarea
                    value={formData.billing_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_address: e.target.value,
                      })
                    }
                    placeholder="Enter billing address"
                    rows={3}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Delivery Address
                  </label>
                  <Textarea
                    value={formData.delivery_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery_address: e.target.value,
                      })
                    }
                    placeholder="Enter delivery address"
                    rows={3}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Product Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Coil Name *
                  </label>
                  <Input
                    value={formData.coil_name}
                    onChange={(e) =>
                      setFormData({ ...formData, coil_name: e.target.value })
                    }
                    placeholder="Enter coil name"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Product Category
                  </label>
                  <Select
                    value={formData.product_category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, product_category: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="copper">Copper</SelectItem>
                      <SelectItem value="pvc">PVC</SelectItem>
                      <SelectItem value="coils">Coils</SelectItem>
                      <SelectItem value="packing_boxes">
                        Packing Boxes
                      </SelectItem>
                      <SelectItem value="scrap">Scrap</SelectItem>
                      <SelectItem value="stamps">Stamps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Unit
                  </label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unit: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                      <SelectItem value="rolls">Rolls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Product Description
                </label>
                <Textarea
                  value={formData.product_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_description: e.target.value,
                    })
                  }
                  placeholder="Enter product description"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quantity and Pricing */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Quantity & Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.quantity === 0 ? "" : formData.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue =
                        value === "" ? 0 : parseFloat(value) || 0;
                      const newFormData = { ...formData, quantity: numValue };
                      const calculatedAmounts =
                        calculateFinalAmount(newFormData);
                      setFormData({
                        ...newFormData,
                        ...calculatedAmounts,
                      });
                    }}
                    placeholder="0"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Unit Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.unit_price === 0 ? "" : formData.unit_price}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue =
                        value === "" ? 0 : parseFloat(value) || 0;
                      const newFormData = { ...formData, unit_price: numValue };
                      const calculatedAmounts =
                        calculateFinalAmount(newFormData);
                      setFormData({
                        ...newFormData,
                        ...calculatedAmounts,
                      });
                    }}
                    placeholder="0.00"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Tax Amount
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.tax_amount === 0 ? "" : formData.tax_amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue =
                        value === "" ? 0 : parseFloat(value) || 0;
                      const newFormData = { ...formData, tax_amount: numValue };
                      const calculatedAmounts =
                        calculateFinalAmount(newFormData);
                      setFormData({
                        ...newFormData,
                        ...calculatedAmounts,
                      });
                    }}
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Discount Amount
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={
                      formData.discount_amount === 0
                        ? ""
                        : formData.discount_amount
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue =
                        value === "" ? 0 : parseFloat(value) || 0;
                      const newFormData = {
                        ...formData,
                        discount_amount: numValue,
                      };
                      const calculatedAmounts =
                        calculateFinalAmount(newFormData);
                      setFormData({
                        ...newFormData,
                        ...calculatedAmounts,
                      });
                    }}
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Accounting Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Debit Amount
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.debit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        debit: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Credit Amount
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.credit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credit: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Amount Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${formData.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tax Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      ${formData.tax_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Discount Amount</p>
                    <p className="text-xl font-bold text-red-600">
                      ${formData.discount_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Final Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${formData.final_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Invoice Number
                  </label>
                  <Input
                    value={formData.invoice_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invoice_number: e.target.value,
                      })
                    }
                    placeholder="INV-001"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Sale Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.sale_date}
                    onChange={(e) =>
                      setFormData({ ...formData, sale_date: e.target.value })
                    }
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Delivery Date
                  </label>
                  <Input
                    type="date"
                    value={formData.delivery_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery_date: e.target.value,
                      })
                    }
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Payment Due Date
                  </label>
                  <Input
                    type="date"
                    value={formData.payment_due_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_due_date: e.target.value,
                      })
                    }
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Payment Status
                  </label>
                  <Select
                    value={formData.payment_status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        payment_status: value as
                          | "pending"
                          | "paid"
                          | "partial"
                          | "overdue",
                      })
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Order Status
                  </label>
                  <Select
                    value={formData.order_status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        order_status: value as
                          | "processing"
                          | "confirmed"
                          | "shipped"
                          | "delivered"
                          | "cancelled",
                      })
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Payment Method
                  </label>
                  <Input
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value,
                      })
                    }
                    placeholder="Cash, Card, Bank Transfer"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Reference Number
                  </label>
                  <Input
                    value={formData.reference_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reference_number: e.target.value,
                      })
                    }
                    placeholder="REF-001"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Comments and Notes */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3">
                Comments & Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Comments (Customer-facing)
                  </label>
                  <Textarea
                    value={formData.comments}
                    onChange={(e) =>
                      setFormData({ ...formData, comments: e.target.value })
                    }
                    placeholder="Enter comments for customer"
                    rows={3}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Internal Notes
                  </label>
                  <Textarea
                    value={formData.internal_notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        internal_notes: e.target.value,
                      })
                    }
                    placeholder="Enter internal notes for staff"
                    rows={3}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Terms & Conditions
                </label>
                <Textarea
                  value={formData.terms_conditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      terms_conditions: e.target.value,
                    })
                  }
                  placeholder="Enter terms and conditions"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/sales">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-8 cursor-pointer"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="h-12 px-8 cursor-pointer"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 text-white font-semibold cursor-pointer"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Creating..." : "Create Sale"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
