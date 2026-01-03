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
  Package,
  User,
  DollarSign,
  Truck,
  FileText,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { PurchaseRepository } from "@/repositories/purchaseRepository";
import { PurchaseOrder } from "@/types";

export default function PurchaseEditPage() {
  const params = useParams();
  const router = useRouter();
  const purchaseId = params.id as string;

  const [formData, setFormData] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch purchase order data on component mount
  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const purchase = await PurchaseRepository.getById(purchaseId);
        if (purchase) {
          setFormData(purchase);
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

  // Calculate total and final amounts when relevant fields change
  const calculateFinalAmount = (currentData: PurchaseOrder) => {
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
  };

  // Update amounts when relevant fields change
  const handleInputChange = (
    field: keyof PurchaseOrder,
    value: string | number
  ) => {
    if (!formData) return;

    const updatedData = { ...formData, [field]: value };

    // Recalculate amounts if relevant fields changed
    if (
      field === "quantity_ordered" ||
      field === "unit_price" ||
      field === "tax_amount" ||
      field === "shipping_cost" ||
      field === "discount_amount"
    ) {
      const { total_amount, final_amount } = calculateFinalAmount(updatedData);
      setFormData({ ...updatedData, total_amount, final_amount });
    } else {
      setFormData(updatedData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setError(null);

    try {
      // Prepare data for update
      const updateData = {
        ...formData,
        updated_by: "Admin",
        updated_at: new Date().toISOString(),
      };

      await PurchaseRepository.update(purchaseId, updateData);
      alert("Purchase order updated successfully!");
      router.push("/purchase");
    } catch (error) {
      console.error("Failed to update purchase order:", error);
      setError("Failed to update purchase order. Please try again.");
    } finally {
      setSaving(false);
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

  if (error || !formData) {
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
            Edit Purchase Order
          </h1>
          <p className="text-gray-600 mt-2">
            Update purchase order {formData.order_number}
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
            Update the details for this purchase order
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

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
                      handleInputChange("supplier_name", e.target.value)
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
                      handleInputChange(
                        "supplier_contact_person",
                        e.target.value
                      )
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
                      handleInputChange("supplier_email", e.target.value)
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
                      handleInputChange("supplier_phone", e.target.value)
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
                      handleInputChange("supplier_address", e.target.value)
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
                      handleInputChange("product_name", e.target.value)
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
                      handleInputChange("product_category", value)
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
                    onValueChange={(value) => handleInputChange("unit", value)}
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
                      handleInputChange(
                        "quantity_ordered",
                        parseFloat(e.target.value) || 0
                      )
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
                      handleInputChange(
                        "quantity_received",
                        parseFloat(e.target.value) || 0
                      )
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
                  Product Description
                </label>
                <Textarea
                  value={formData.product_description}
                  onChange={(e) =>
                    handleInputChange("product_description", e.target.value)
                  }
                  placeholder="Enter product description"
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
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
                      handleInputChange(
                        "tax_amount",
                        parseFloat(e.target.value) || 0
                      )
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
                      handleInputChange(
                        "shipping_cost",
                        parseFloat(e.target.value) || 0
                      )
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
                      handleInputChange(
                        "discount_amount",
                        parseFloat(e.target.value) || 0
                      )
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
                      handleInputChange(
                        "amount_paid",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    className="h-12 text-lg border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-blue-900 border-b pb-3 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Order Status & Payment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Order Status
                  </label>
                  <Select
                    value={formData.order_status}
                    onValueChange={(value) =>
                      handleInputChange("order_status", value as any)
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
                    Payment Status
                  </label>
                  <Select
                    value={formData.payment_status}
                    onValueChange={(value) =>
                      handleInputChange("payment_status", value as any)
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
                      handleInputChange("payment_method", value)
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <div className="space-x-4">
                <Link href="/purchase">
                  <Button variant="outline" className="cursor-pointer">
                    Cancel
                  </Button>
                </Link>
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Update Purchase Order
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
