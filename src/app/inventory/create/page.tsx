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

export default function InventoryCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    product_name: "",
    sku: "",
    current_stock: 0,
    min_threshold: 10,
    max_threshold: 100,
    warehouse_location: "",
    unit_price: 0,
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Creating inventory item:", formData);
      router.push("/inventory");
    } catch (err) {
      console.error("Failed to create inventory item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/inventory">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add Inventory Item</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
          <CardDescription>Add a new inventory item</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <Input
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                  required
                  className="cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <Input
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  required
                  className="cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock
                </label>
                <Input
                  type="number"
                  value={formData.current_stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current_stock: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unit_price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  className="cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Threshold
                </label>
                <Input
                  type="number"
                  value={formData.min_threshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_threshold: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Threshold
                </label>
                <Input
                  type="number"
                  value={formData.max_threshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_threshold: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="cursor-pointer"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse Location
                </label>
                <Select
                  value={formData.warehouse_location}
                  onValueChange={(value) =>
                    setFormData({ ...formData, warehouse_location: value })
                  }
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                    <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                    <SelectItem value="Warehouse C">Warehouse C</SelectItem>
                    <SelectItem value="Main Storage">Main Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">
                  Total Value:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${(formData.current_stock * formData.unit_price).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Link href="/inventory">
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
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Creating..." : "Create Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
