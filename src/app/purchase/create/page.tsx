"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Package,
  User,
  DollarSign,
  Truck,
  FileText,
  CreditCard,
} from "lucide-react";
import { PurchaseRepository } from "@/repositories/purchaseRepository";

export default function PurchaseCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Supplier Information
    supplier_name: "",
    supplier_email: "",
    supplier_phone: "",
    supplier_address: "",
    supplier_contact_person: "",

    // Order Information
    order_number: "",
    order_date: new Date().toISOString().split("T")[0],
    expected_delivery_date: "",
    actual_delivery_date: "",

    // Product Information
    product_name: "",
    product_category: "",
    product_description: "",
    quantity_ordered: 0,
    quantity_received: 0,
    unit: "pcs",
    unit_price: 0,

    // Financial Information
    total_amount: 0,
    tax_amount: 0,
    shipping_cost: 0,
    discount_amount: 0,
    final_amount: 0,

    // Payment Information
    payment_status: "pending" as "pending" | "partial" | "paid" | "overdue",
    payment_method: "",
    payment_due_date: "",
    amount_paid: 0,

    // Order Status
    order_status: "pending" as
      | "pending"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "cancelled"
      | "partial_delivered",

    // Additional Information
    invoice_number: "",
    tracking_number: "",
    shipping_address: "",
    billing_address: "",
    notes: "",
    internal_notes: "",
    terms_conditions: "",
    reference_number: "",

    // Quality Control
    quality_status: "pending" as
      | "pending"
      | "approved"
      | "rejected"
      | "inspected",
    quality_notes: "",

    // Metadata
    created_by: "Admin",
    updated_by: "Admin",
  });

  const [loading, setLoading] = useState(false);

  // Generate order number automatically
  useEffect(() => {
    const generateOrderNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `PO-${year}${month}${day}-${random}`;
    };

    setFormData((prev) => ({
      ...prev,
      order_number: generateOrderNumber(),
    }));
  }, []);

  // Calculate total and final amounts
  const calculateFinalAmount = useCallback((currentData: typeof formData) => {
    const total = currentData.quantity_ordered * currentData.unit_price;
    const final =
      total +
      currentData.tax_amount +
      currentData.shipping_cost -
      currentData.discount_amount;
    return {
      total_amount: total,
      final_amount: Math.max(0, final),
    };
  }, []);

  // Update amounts when relevant fields change
  useEffect(() => {
    const { total_amount, final_amount } = calculateFinalAmount(formData);
    setFormData((prev) => ({
      ...prev,
      total_amount,
      final_amount,
    }));
  }, [
    formData.quantity_ordered,
    formData.unit_price,
    formData.tax_amount,
    formData.shipping_cost,
    formData.discount_amount,
    calculateFinalAmount,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        order_date: formData.order_date,
        expected_delivery_date: formData.expected_delivery_date || undefined,
        actual_delivery_date: formData.actual_delivery_date || undefined,
        payment_due_date: formData.payment_due_date || undefined,
      };

      const newPurchase = await PurchaseRepository.create(submissionData);
      console.log("Purchase order created successfully:", newPurchase);
      alert("Purchase order created successfully!");
      router.push("/purchase");
    } catch (error) {
      console.error("Failed to create purchase order:", error);
      alert("Failed to create purchase order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supplier_name: "",
      supplier_email: "",
      supplier_phone: "",
      supplier_address: "",
      supplier_contact_person: "",
      order_number: "",
      order_date: new Date().toISOString().split("T")[0],
      expected_delivery_date: "",
      actual_delivery_date: "",
      product_name: "",
      product_category: "",
      product_description: "",
      quantity_ordered: 0,
      quantity_received: 0,
      unit: "pcs",
      unit_price: 0,
      total_amount: 0,
      tax_amount: 0,
      shipping_cost: 0,
      discount_amount: 0,
      final_amount: 0,
      payment_status: "pending",
      payment_method: "",
      payment_due_date: "",
      amount_paid: 0,
      order_status: "pending",
      invoice_number: "",
      tracking_number: "",
      shipping_address: "",
      billing_address: "",
      notes: "",
      internal_notes: "",
      terms_conditions: "",
      reference_number: "",
      quality_status: "pending",
      quality_notes: "",
      created_by: "Admin",
      updated_by: "Admin",
    });
  };

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
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
            Create New Purchase Order
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new purchase order to the system
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="max-w-6xl mx-auto shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-2xl">
            <Package className="w-6 h-6 mr-2" />
            Purchase Order Information
          </CardTitle>
          <CardDescription className="text-blue-100">
            Enter the details for this purchase order
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Supplier Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Supplier Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Supplier Name *
                  </label>
                  <Input
                    value={formData.supplier_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier_name: e.target.value,
                      })
                    }
                    placeholder="Enter supplier name"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Contact Person
                  </label>
                  <Input
                    value={formData.supplier_contact_person}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier_contact_person: e.target.value,
                      })
                    }
                    placeholder="Contact person name"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.supplier_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier_email: e.target.value,
                      })
                    }
                    placeholder="supplier@example.com"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Phone
                  </label>
                  <Input
                    value={formData.supplier_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier_phone: e.target.value,
                      })
                    }
                    placeholder="+1234567890"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Supplier Address
                  </label>
                  <Textarea
                    value={formData.supplier_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplier_address: e.target.value,
                      })
                    }
                    placeholder="Enter supplier address"
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
                    Product Name *
                  </label>
                  <Input
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                    placeholder="Enter product name"
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
                      <SelectItem value="packing_boxes">
                        Packing Boxes
                      </SelectItem>
                      <SelectItem value="scrap">Scrap</SelectItem>
                      <SelectItem value="stamps">Stamps</SelectItem>
                      <SelectItem value="coils">Coils</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                      <SelectItem value="rolls">Rolls</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Quantity Ordered *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.quantity_ordered}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity_ordered: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Quantity Received
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.quantity_received}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity_received: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
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
                      setFormData({
                        ...formData,
                        unit_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
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

            {/* Order Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Order Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Order Number
                  </label>
                  <Input
                    value={formData.order_number}
                    onChange={(e) =>
                      setFormData({ ...formData, order_number: e.target.value })
                    }
                    placeholder="PO-001"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Order Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.order_date}
                    onChange={(e) =>
                      setFormData({ ...formData, order_date: e.target.value })
                    }
                    required
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Expected Delivery Date
                  </label>
                  <Input
                    type="date"
                    value={formData.expected_delivery_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expected_delivery_date: e.target.value,
                      })
                    }
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Actual Delivery Date
                  </label>
                  <Input
                    type="date"
                    value={formData.actual_delivery_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actual_delivery_date: e.target.value,
                      })
                    }
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
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
                    Tracking Number
                  </label>
                  <Input
                    value={formData.tracking_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracking_number: e.target.value,
                      })
                    }
                    placeholder="TRK-001"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Tax Amount
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tax_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tax_amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Shipping Cost
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.shipping_cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_cost: parseFloat(e.target.value) || 0,
                      })
                    }
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
                    min="0"
                    step="0.01"
                    value={formData.discount_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50 p-6 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Total Amount
                  </label>
                  <div className="text-2xl font-bold text-blue-900">
                    ${formData.total_amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Final Amount
                  </label>
                  <div className="text-2xl font-bold text-green-600">
                    ${formData.final_amount.toFixed(2)}
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
                      setFormData({
                        ...formData,
                        amount_paid: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Payment Status
                  </label>
                  <Select
                    value={formData.payment_status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, payment_status: value as any })
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Payment Method
                  </label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) =>
                      setFormData({ ...formData, payment_method: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
            </div>

            {/* Order Status */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Order Status & Quality
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Order Status
                  </label>
                  <Select
                    value={formData.order_status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, order_status: value as any })
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="partial_delivered">
                        Partial Delivered
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Quality Status
                  </label>
                  <Select
                    value={formData.quality_status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, quality_status: value as any })
                    }
                  >
                    <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="inspected">Inspected</SelectItem>
                    </SelectContent>
                  </Select>
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

              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Quality Notes
                </label>
                <Textarea
                  value={formData.quality_notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quality_notes: e.target.value,
                    })
                  }
                  placeholder="Quality inspection notes"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Shipping Address
                  </label>
                  <Textarea
                    value={formData.shipping_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_address: e.target.value,
                      })
                    }
                    placeholder="Enter shipping address"
                    rows={3}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
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
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Notes
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Enter order notes"
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
                    placeholder="Internal notes (not visible to supplier)"
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
            <div className="flex justify-between pt-6 border-t">
              <div className="space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="cursor-pointer"
                >
                  Reset Form
                </Button>
                <Link href="/purchase">
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
                    Create Purchase Order
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
