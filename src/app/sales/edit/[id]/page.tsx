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
import { ArrowLeft, Save } from "lucide-react";

export default function SalesEditPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    invoice_number: "INV001",
    customer_name: "John Customer",
    customer_email: "john@example.com",
    customer_phone: "+1234567890",
    customer_address: "123 Main St",
    sale_date: "2024-01-15",
    total_amount: 1500,
    tax_amount: 150,
    discount_amount: 0,
    final_amount: 1650,
    payment_status: "paid",
    payment_method: "Credit Card",
    notes: "Regular customer",
  });

  const [loading, setLoading] = useState(false);

  const calculateFinalAmount = () => {
    const final =
      formData.total_amount + formData.tax_amount - formData.discount_amount;
    setFormData((prev) => ({ ...prev, final_amount: final }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual update logic with Supabase
      console.log("Updating sales order:", formData);
      router.push("/sales");
    } catch (error) {
      console.error("Error updating sales order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/sales">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sales
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-black">Edit Sales Order</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Sales Order Details</CardTitle>
          <CardDescription className="text-black">
            Update the sales order information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Invoice Number
                </label>
                <Input
                  value={formData.invoice_number}
                  onChange={(e) =>
                    handleChange("invoice_number", e.target.value)
                  }
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Customer Name
                </label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) =>
                    handleChange("customer_name", e.target.value)
                  }
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Customer Email
                </label>
                <Input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    handleChange("customer_email", e.target.value)
                  }
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Customer Phone
                </label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) =>
                    handleChange("customer_phone", e.target.value)
                  }
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Sale Date
                </label>
                <Input
                  type="date"
                  value={formData.sale_date}
                  onChange={(e) => handleChange("sale_date", e.target.value)}
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Total Amount
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.total_amount}
                  onChange={(e) => {
                    handleChange(
                      "total_amount",
                      parseFloat(e.target.value) || 0
                    );
                    calculateFinalAmount();
                  }}
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tax Amount
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.tax_amount}
                  onChange={(e) => {
                    handleChange("tax_amount", parseFloat(e.target.value) || 0);
                    calculateFinalAmount();
                  }}
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Discount Amount
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discount_amount}
                  onChange={(e) => {
                    handleChange(
                      "discount_amount",
                      parseFloat(e.target.value) || 0
                    );
                    calculateFinalAmount();
                  }}
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Final Amount
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.final_amount}
                  readOnly
                  className="bg-gray-50 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Payment Status
                </label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value) =>
                    handleChange("payment_status", value)
                  }
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending" className="cursor-pointer">
                      Pending
                    </SelectItem>
                    <SelectItem value="paid" className="cursor-pointer">
                      Paid
                    </SelectItem>
                    <SelectItem value="partial" className="cursor-pointer">
                      Partial
                    </SelectItem>
                    <SelectItem value="overdue" className="cursor-pointer">
                      Overdue
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Payment Method
                </label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) =>
                    handleChange("payment_method", value)
                  }
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card" className="cursor-pointer">
                      Credit Card
                    </SelectItem>
                    <SelectItem value="Debit Card" className="cursor-pointer">
                      Debit Card
                    </SelectItem>
                    <SelectItem value="Cash" className="cursor-pointer">
                      Cash
                    </SelectItem>
                    <SelectItem
                      value="Bank Transfer"
                      className="cursor-pointer"
                    >
                      Bank Transfer
                    </SelectItem>
                    <SelectItem value="Check" className="cursor-pointer">
                      Check
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Customer Address
              </label>
              <Input
                value={formData.customer_address}
                onChange={(e) =>
                  handleChange("customer_address", e.target.value)
                }
                className="cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md cursor-pointer"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/sales">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
