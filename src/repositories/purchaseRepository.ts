import { supabase } from "@/lib/database";
import { TABLES } from "@/constants";
import { PurchaseOrder } from "@/types";

export class PurchaseRepository {
  // Get all purchase orders
  static async getAll(): Promise<PurchaseOrder[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .order("order_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get purchase order by ID
  static async getById(id: string): Promise<PurchaseOrder | null> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create new purchase order
  static async create(
    order: Omit<PurchaseOrder, "id" | "created_at" | "updated_at">
  ): Promise<PurchaseOrder> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update purchase order
  static async update(
    id: string,
    updates: Partial<PurchaseOrder>
  ): Promise<PurchaseOrder> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete purchase order
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Get purchase orders by supplier
  static async getBySupplier(supplierName: string): Promise<PurchaseOrder[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .eq("supplier_name", supplierName)
      .order("order_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get purchase orders by status
  static async getByStatus(status: string): Promise<PurchaseOrder[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .eq("order_status", status)
      .order("order_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Search purchase orders
  static async search(query: string): Promise<PurchaseOrder[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .or(
        `order_number.ilike.%${query}%,supplier_name.ilike.%${query}%,product_name.ilike.%${query}%`
      )
      .order("order_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get purchase statistics
  static async getStats() {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("payment_status, order_status, final_amount");

    if (error) throw error;

    const stats = {
      totalOrders: data?.length || 0,
      totalAmount:
        data?.reduce((sum, order) => sum + order.final_amount, 0) || 0,
      paidOrders:
        data?.filter((order) => order.payment_status === "paid").length || 0,
      pendingOrders:
        data?.filter((order) => order.payment_status === "pending").length || 0,
      deliveredOrders:
        data?.filter((order) => order.order_status === "delivered").length || 0,
    };

    return stats;
  }
}
