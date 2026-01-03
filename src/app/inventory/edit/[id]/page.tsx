"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InventoryRepository } from "@/repositories/inventoryRepository";
import { Inventory } from "@/types";
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
import { ArrowLeft, Save, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export default function InventoryEditPage() {
  const params = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "copper" as
      | "copper"
      | "pvc"
      | "packing_boxes"
      | "scrap"
      | "stamps"
      | "coils",
    description: "",
    quantity: 0,
    unit: "pcs",
    unit_price: 0,
    min_stock_level: 0,
    location: "",
    status: "available" as
      | "available"
      | "out_of_stock"
      | "reserved"
      | "damaged",
    supplier: "",
    purchase_date: "",

    // Copper fields
    copper_type: "",
    copper_grade: "",
    copper_purity: 0,
    copper_thickness: 0,
    copper_conductivity: "",

    // PVC fields
    pvc_type: "",
    pvc_grade: "",
    pvc_color: "",
    pvc_thickness: 0,
    pvc_hardness: "",
    pvc_temperature_rating: "",

    // Packing boxes fields
    box_type: "",
    box_dimensions: "",
    box_material: "",
    box_capacity_weight: 0,
    box_capacity_volume: 0,

    // Scrap fields
    scrap_type: "",
    scrap_source: "",
    scrap_purity: 0,
    scrap_condition: "",
    scrap_weight: 0,

    // Stamps fields
    stamp_type: "",
    stamp_size: "",
    stamp_material: "",
    stamp_design: "",
    stamp_quality: "",

    // Coils fields
    coil_name: "",
    coil_weight: 0,
    coil_length: 0,
    coil_thickness: 0,
    coil_diameter: 0,
    number_of_goats: 0,
    coil_material: "",
    coil_grade: "",
    coil_resistance: 0,
    coil_insulation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const id = params.id as string;
        if (!id) {
          setError("Invalid item ID");
          setIsLoading(false);
          return;
        }

        const item = await InventoryRepository.getById(id);
        if (!item) {
          setError("Item not found");
          setIsLoading(false);
          return;
        }

        // Populate form with item data
        setFormData({
          name: item.name || "",
          category: item.category || "copper",
          description: item.description || "",
          quantity: item.quantity || 0,
          unit: item.unit || "pcs",
          unit_price: item.unit_price || 0,
          min_stock_level: item.min_stock_level || 0,
          location: item.location || "",
          status: item.status || "available",
          supplier: item.supplier || "",
          purchase_date: item.purchase_date || "",

          // Copper fields
          copper_type: item.copper_type || "",
          copper_grade: item.copper_grade || "",
          copper_purity: item.copper_purity || 0,
          copper_thickness: item.copper_thickness || 0,
          copper_conductivity: item.copper_conductivity || "",

          // PVC fields
          pvc_type: item.pvc_type || "",
          pvc_grade: item.pvc_grade || "",
          pvc_color: item.pvc_color || "",
          pvc_thickness: item.pvc_thickness || 0,
          pvc_hardness: item.pvc_hardness || "",
          pvc_temperature_rating: item.pvc_temperature_rating || "",

          // Packing boxes fields
          box_type: item.box_type || "",
          box_dimensions: item.box_dimensions || "",
          box_material: item.box_material || "",
          box_capacity_weight: item.box_capacity_weight || 0,
          box_capacity_volume: item.box_capacity_volume || 0,

          // Scrap fields
          scrap_type: item.scrap_type || "",
          scrap_source: item.scrap_source || "",
          scrap_purity: item.scrap_purity || 0,
          scrap_condition: item.scrap_condition || "",
          scrap_weight: item.scrap_weight || 0,

          // Stamps fields
          stamp_type: item.stamp_type || "",
          stamp_size: item.stamp_size || "",
          stamp_material: item.stamp_material || "",
          stamp_design: item.stamp_design || "",
          stamp_quality: item.stamp_quality || "",

          // Coils fields
          coil_name: item.coil_name || "",
          coil_weight: item.coil_weight || 0,
          coil_length: item.coil_length || 0,
          coil_thickness: item.coil_thickness || 0,
          coil_diameter: item.coil_diameter || 0,
          number_of_goats: item.number_of_goats || 0,
          coil_material: item.coil_material || "",
          coil_grade: item.coil_grade || "",
          coil_resistance: item.coil_resistance || 0,
          coil_insulation: item.coil_insulation || "",
        });

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const id = params.id as string;

      // Only include fields that are relevant for the selected category
      const updateData: Partial<Inventory> = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        quantity: formData.quantity,
        unit: formData.unit,
        unit_price: formData.unit_price,
        min_stock_level: formData.min_stock_level,
        location: formData.location,
        status: formData.status,
        supplier: formData.supplier,
        purchase_date: formData.purchase_date,
      };

      // Add category-specific fields
      if (formData.category === "copper") {
        Object.assign(updateData, {
          copper_type: formData.copper_type,
          copper_grade: formData.copper_grade,
          copper_purity: formData.copper_purity,
          copper_thickness: formData.copper_thickness,
          copper_conductivity: formData.copper_conductivity,
        });
      } else if (formData.category === "pvc") {
        Object.assign(updateData, {
          pvc_type: formData.pvc_type,
          pvc_grade: formData.pvc_grade,
          pvc_color: formData.pvc_color,
          pvc_thickness: formData.pvc_thickness,
          pvc_hardness: formData.pvc_hardness,
          pvc_temperature_rating: formData.pvc_temperature_rating,
        });
      } else if (formData.category === "packing_boxes") {
        Object.assign(updateData, {
          box_type: formData.box_type,
          box_dimensions: formData.box_dimensions,
          box_material: formData.box_material,
          box_capacity_weight: formData.box_capacity_weight,
          box_capacity_volume: formData.box_capacity_volume,
        });
      } else if (formData.category === "scrap") {
        Object.assign(updateData, {
          scrap_type: formData.scrap_type,
          scrap_source: formData.scrap_source,
          scrap_purity: formData.scrap_purity,
          scrap_condition: formData.scrap_condition,
          scrap_weight: formData.scrap_weight,
        });
      } else if (formData.category === "stamps") {
        Object.assign(updateData, {
          stamp_type: formData.stamp_type,
          stamp_size: formData.stamp_size,
          stamp_material: formData.stamp_material,
          stamp_design: formData.stamp_design,
          stamp_quality: formData.stamp_quality,
        });
      } else if (formData.category === "coils") {
        Object.assign(updateData, {
          coil_name: formData.coil_name,
          coil_weight: formData.coil_weight,
          coil_length: formData.coil_length,
          coil_thickness: formData.coil_thickness,
          coil_diameter: formData.coil_diameter,
          number_of_goats: formData.number_of_goats,
          coil_material: formData.coil_material,
          coil_grade: formData.coil_grade,
          coil_resistance: formData.coil_resistance,
          coil_insulation: formData.coil_insulation,
        });
      }

      await InventoryRepository.update(id, updateData);
      alert("Inventory item updated successfully!");
      router.push("/inventory/view");
    } catch (error) {
      console.error("Failed to update inventory item:", error);
      alert("Failed to update inventory item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategorySpecificFields = () => {
    switch (formData.category) {
      case "copper":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Copper Specific Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Copper Type
                </label>
                <Input
                  value={formData.copper_type}
                  onChange={(e) =>
                    setFormData({ ...formData, copper_type: e.target.value })
                  }
                  placeholder="e.g., Bare Copper, Tinned Copper"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Copper Grade
                </label>
                <Input
                  value={formData.copper_grade}
                  onChange={(e) =>
                    setFormData({ ...formData, copper_grade: e.target.value })
                  }
                  placeholder="e.g., C110, C101"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Purity (%)
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.copper_purity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      copper_purity: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="99.99"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Thickness (mm)
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.copper_thickness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      copper_thickness: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.5"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Conductivity
                </label>
                <Input
                  value={formData.copper_conductivity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      copper_conductivity: e.target.value,
                    })
                  }
                  placeholder="e.g., 58 MS/m"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case "pvc":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              PVC Specific Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  PVC Type
                </label>
                <Input
                  value={formData.pvc_type}
                  onChange={(e) =>
                    setFormData({ ...formData, pvc_type: e.target.value })
                  }
                  placeholder="e.g., PVC Compound, PVC Resin"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  PVC Grade
                </label>
                <Input
                  value={formData.pvc_grade}
                  onChange={(e) =>
                    setFormData({ ...formData, pvc_grade: e.target.value })
                  }
                  placeholder="e.g., Grade A, Grade B"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Color
                </label>
                <Input
                  value={formData.pvc_color}
                  onChange={(e) =>
                    setFormData({ ...formData, pvc_color: e.target.value })
                  }
                  placeholder="e.g., Black, Red, Blue"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Thickness (mm)
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.pvc_thickness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pvc_thickness: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="2.0"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Hardness
                </label>
                <Input
                  value={formData.pvc_hardness}
                  onChange={(e) =>
                    setFormData({ ...formData, pvc_hardness: e.target.value })
                  }
                  placeholder="e.g., 80 Shore A"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Temperature Rating
                </label>
                <Input
                  value={formData.pvc_temperature_rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pvc_temperature_rating: e.target.value,
                    })
                  }
                  placeholder="e.g., 70°C, 90°C"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case "packing_boxes":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Packing Boxes Specific Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Box Type
                </label>
                <Input
                  value={formData.box_type}
                  onChange={(e) =>
                    setFormData({ ...formData, box_type: e.target.value })
                  }
                  placeholder="e.g., Cardboard, Wooden, Plastic"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Dimensions (LxWxH)
                </label>
                <Input
                  value={formData.box_dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, box_dimensions: e.target.value })
                  }
                  placeholder="e.g., 30x20x15 cm"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Material
                </label>
                <Input
                  value={formData.box_material}
                  onChange={(e) =>
                    setFormData({ ...formData, box_material: e.target.value })
                  }
                  placeholder="e.g., Corrugated, Solid"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Capacity Weight (kg)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box_capacity_weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      box_capacity_weight: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="50"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Capacity Volume (L)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.box_capacity_volume}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      box_capacity_volume: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="25"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case "scrap":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Scrap Specific Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Scrap Type
                </label>
                <Input
                  value={formData.scrap_type}
                  onChange={(e) =>
                    setFormData({ ...formData, scrap_type: e.target.value })
                  }
                  placeholder="e.g., Copper Scrap, PVC Scrap"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Source
                </label>
                <Input
                  value={formData.scrap_source}
                  onChange={(e) =>
                    setFormData({ ...formData, scrap_source: e.target.value })
                  }
                  placeholder="e.g., Production, Returns"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Purity (%)
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.scrap_purity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scrap_purity: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="85.5"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Condition
                </label>
                <Input
                  value={formData.scrap_condition}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scrap_condition: e.target.value,
                    })
                  }
                  placeholder="e.g., Good, Fair, Poor"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.scrap_weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scrap_weight: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="100"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case "stamps":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Stamps Specific Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Stamp Type
                </label>
                <Input
                  value={formData.stamp_type}
                  onChange={(e) =>
                    setFormData({ ...formData, stamp_type: e.target.value })
                  }
                  placeholder="e.g., Rubber, Metal, Digital"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Size
                </label>
                <Input
                  value={formData.stamp_size}
                  onChange={(e) =>
                    setFormData({ ...formData, stamp_size: e.target.value })
                  }
                  placeholder="e.g., 2x2 inches, 5x5 cm"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Material
                </label>
                <Input
                  value={formData.stamp_material}
                  onChange={(e) =>
                    setFormData({ ...formData, stamp_material: e.target.value })
                  }
                  placeholder="e.g., Rubber, Steel, Brass"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Design
                </label>
                <Input
                  value={formData.stamp_design}
                  onChange={(e) =>
                    setFormData({ ...formData, stamp_design: e.target.value })
                  }
                  placeholder="e.g., Logo, Text, Pattern"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Quality
                </label>
                <Input
                  value={formData.stamp_quality}
                  onChange={(e) =>
                    setFormData({ ...formData, stamp_quality: e.target.value })
                  }
                  placeholder="e.g., Premium, Standard"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case "coils":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Coils Specific Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Coil Name
                </label>
                <Input
                  value={formData.coil_name}
                  onChange={(e) =>
                    setFormData({ ...formData, coil_name: e.target.value })
                  }
                  placeholder="e.g., Copper Coil 100m"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.coil_weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coil_weight: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="50"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Length (m)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.coil_length}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coil_length: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="100"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Thickness (mm)
                </label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.coil_thickness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coil_thickness: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="2.5"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Diameter (mm)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.coil_diameter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coil_diameter: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="300"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Number of Goats
                </label>
                <Input
                  type="number"
                  value={formData.number_of_goats}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      number_of_goats: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Material
                </label>
                <Input
                  value={formData.coil_material}
                  onChange={(e) =>
                    setFormData({ ...formData, coil_material: e.target.value })
                  }
                  placeholder="e.g., Copper, Aluminum"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Grade
                </label>
                <Input
                  value={formData.coil_grade}
                  onChange={(e) =>
                    setFormData({ ...formData, coil_grade: e.target.value })
                  }
                  placeholder="e.g., Grade A, Industrial"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Resistance (Ω)
                </label>
                <Input
                  type="number"
                  step="0.000001"
                  value={formData.coil_resistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coil_resistance: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.08"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Insulation
                </label>
                <Input
                  value={formData.coil_insulation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coil_insulation: e.target.value,
                    })
                  }
                  placeholder="e.g., PVC, XLPE"
                  className="h-12 text-lg border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-600">{error}</p>
            <Link href="/inventory/view">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inventory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/inventory/view">
              <Button
                variant="outline"
                size="lg"
                className="bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Inventory
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-blue-900">
                Edit Inventory Item
              </h1>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Package className="h-6 w-6" />
              Update Inventory Item
            </CardTitle>
            <CardDescription className="text-blue-100">
              Modify the details of this inventory item
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Item Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder="e.g., Copper Wire 2.5mm"
                      className="h-12 text-lg border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Category *
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          category: value as
                            | "copper"
                            | "pvc"
                            | "packing_boxes"
                            | "scrap"
                            | "stamps"
                            | "coils",
                        })
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                      placeholder="100"
                      className="h-12 text-lg border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Unit *
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
                        <SelectItem value="m">Meters</SelectItem>
                        <SelectItem value="l">Liters</SelectItem>
                        <SelectItem value="boxes">Boxes</SelectItem>
                        <SelectItem value="rolls">Rolls</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Unit Price
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.unit_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          unit_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                      className="h-12 text-lg border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Min Stock Level
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.min_stock_level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_stock_level: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="10"
                      className="h-12 text-lg border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Location
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g., Warehouse A, Shelf 1"
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
                        setFormData({
                          ...formData,
                          status: value as
                            | "available"
                            | "out_of_stock"
                            | "reserved"
                            | "damaged",
                        })
                      }
                    >
                      <SelectTrigger className="h-12 text-lg border-blue-200 focus:border-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="out_of_stock">
                          Out of Stock
                        </SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Supplier
                    </label>
                    <Input
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      placeholder="e.g., ABC Suppliers"
                      className="h-12 text-lg border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Purchase Date
                    </label>
                    <Input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purchase_date: e.target.value,
                        })
                      }
                      className="h-12 text-lg border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Additional details about this inventory item..."
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                />
              </div>

              {/* Category Specific Fields */}
              {formData.category && renderCategorySpecificFields()}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.category}
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 border-b-2 border-white mr-3"></Loader2>
                      Updating Item...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Update Inventory Item
                    </>
                  )}
                </Button>
                <Link href="/inventory/view">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 px-8 text-lg font-semibold border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
