import { supabase } from "@/lib/database";
import { TABLES } from "@/constants";
import { Inventory } from "@/types";

export class InventoryRepository {
  // Get all inventory items
  static async getAll(): Promise<Inventory[]> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select("*")
      .order("product_name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Get inventory item by ID
  static async getById(id: string): Promise<Inventory | null> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create new inventory item
  static async create(
    item: Omit<Inventory, "id" | "created_at" | "updated_at">
  ): Promise<Inventory> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update inventory item
  static async update(
    id: string,
    updates: Partial<Inventory>
  ): Promise<Inventory> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete inventory item
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.INVENTORY)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Get inventory by product code
  static async getByProductCode(
    productCode: string
  ): Promise<Inventory | null> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select("*")
      .eq("product_code", productCode)
      .single();

    if (error) throw error;
    return data;
  }

  // Get inventory by category
  static async getByCategory(category: string): Promise<Inventory[]> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select("*")
      .eq("category", category)
      .order("product_name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Get low stock items
  static async getLowStockItems(): Promise<Inventory[]> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select("*")
      .lte("current_stock", "min_stock_level")
      .order("current_stock", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Update stock level
  static async updateStock(
    id: string,
    quantity: number,
    operation: "add" | "subtract" | "set"
  ): Promise<Inventory> {
    const item = await this.getById(id);
    if (!item) throw new Error("Inventory item not found");

    let newStock: number;
    switch (operation) {
      case "add":
        newStock = item.current_stock + quantity;
        break;
      case "subtract":
        newStock = Math.max(0, item.current_stock - quantity);
        break;
      case "set":
        newStock = quantity;
        break;
      default:
        throw new Error("Invalid operation");
    }

    return this.update(id, {
      current_stock: newStock,
    });
  }

  // Search inventory
  static async search(query: string): Promise<Inventory[]> {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select("*")
      .or(
        `product_name.ilike.%${query}%,product_code.ilike.%${query}%,description.ilike.%${query}%,supplier.ilike.%${query}%`
      )
      .order("product_name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Get inventory statistics
  static async getStats() {
    const { data, error } = await supabase
      .from(TABLES.INVENTORY)
      .select("current_stock, min_stock_level, unit_price, status");

    if (error) throw error;

    const totalValue =
      data?.reduce(
        (sum, item) => sum + item.current_stock * item.unit_price,
        0
      ) || 0;
    const lowStockCount =
      data?.filter((item) => item.current_stock <= item.min_stock_level)
        .length || 0;
    const outOfStockCount =
      data?.filter((item) => item.current_stock === 0).length || 0;

    return {
      totalItems: data?.length || 0,
      totalValue,
      lowStockCount,
      outOfStockCount,
      availableItems:
        data?.filter((item) => item.status === "available").length || 0,
    };
  }
}
