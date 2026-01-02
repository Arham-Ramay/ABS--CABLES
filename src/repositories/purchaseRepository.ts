import { supabase } from "@/lib/database";
import { TABLES } from "@/constants";
import { Purchase } from "@/types";

export class PurchaseRepository {
  // Get all purchase orders
  static async getAll(): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .order("purchase_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get purchase order by ID
  static async getById(id: string): Promise<Purchase | null> {
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
    order: Omit<Purchase, "id" | "created_at" | "updated_at">
  ): Promise<Purchase> {
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
    updates: Partial<Purchase>
  ): Promise<Purchase> {
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

  // Get purchase order by order number
  static async getByOrderNumber(orderNumber: string): Promise<Purchase | null> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .eq("purchase_order_number", orderNumber)
      .single();

    if (error) throw error;
    return data;
  }

  // Get purchase orders by supplier
  static async getBySupplier(supplierName: string): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .eq("supplier_name", supplierName)
      .order("purchase_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get purchase orders by date range
  static async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .gte("purchase_date", startDate)
      .lte("purchase_date", endDate)
      .order("purchase_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get purchase orders by payment status
  static async getByPaymentStatus(status: string): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .eq("payment_status", status)
      .order("purchase_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Update payment status
  static async updatePaymentStatus(
    id: string,
    status: "pending" | "paid" | "partial"
  ): Promise<Purchase> {
    return this.update(id, { payment_status: status });
  }

  // Search purchase orders
  static async search(query: string): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("*")
      .or(
        `purchase_order_number.ilike.%${query}%,supplier_name.ilike.%${query}%,supplier_email.ilike.%${query}%`
      )
      .order("purchase_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get purchase statistics
  static async getStats() {
    const { data, error } = await supabase
      .from(TABLES.PURCHASE_ORDERS)
      .select("final_amount, payment_status");

    if (error) throw error;

    const totalPurchases =
      data?.reduce((sum, purchase) => sum + purchase.final_amount, 0) || 0;
    const paidCount =
      data?.filter((purchase) => purchase.payment_status === "paid").length ||
      0;
    const pendingCount =
      data?.filter((purchase) => purchase.payment_status === "pending")
        .length || 0;
    const partialCount =
      data?.filter((purchase) => purchase.payment_status === "partial")
        .length || 0;

    return {
      totalOrders: data?.length || 0,
      totalPurchases,
      paidCount,
      pendingCount,
      partialCount,
      averageOrderValue: data?.length ? totalPurchases / data.length : 0,
    };
  }
}
