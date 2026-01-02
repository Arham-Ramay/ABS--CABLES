import { supabase } from "@/lib/database";
import { TABLES } from "@/constants";
import { Sale } from "@/types";

export class SalesRepository {
  // Get all sales orders
  static async getAll(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .select("*")
      .order("sale_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get sales order by ID
  static async getById(id: string): Promise<Sale | null> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create new sales order
  static async create(
    order: Omit<Sale, "id" | "created_at" | "updated_at">
  ): Promise<Sale> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update sales order
  static async update(id: string, updates: Partial<Sale>): Promise<Sale> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete sales order
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Get sales by invoice number
  static async getByInvoiceNumber(invoiceNumber: string): Promise<Sale | null> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .select("*")
      .eq("invoice_number", invoiceNumber)
      .single();

    if (error) throw error;
    return data;
  }

  // Get sales by customer
  static async getByCustomer(customerName: string): Promise<Sale[]> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .select("*")
      .eq("customer_name", customerName)
      .order("sale_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get sales by date range
  static async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Sale[]> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .select("*")
      .gte("sale_date", startDate)
      .lte("sale_date", endDate)
      .order("sale_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get sales by payment status
  static async getByPaymentStatus(status: string): Promise<Sale[]> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .select("*")
      .eq("payment_status", status)
      .order("sale_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Update payment status
  static async updatePaymentStatus(
    id: string,
    status: "pending" | "paid" | "partial" | "overdue"
  ): Promise<Sale> {
    return this.update(id, { payment_status: status });
  }

  // Search sales
  static async search(query: string): Promise<Sale[]> {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .select("*")
      .or(
        `invoice_number.ilike.%${query}%,customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`
      )
      .order("sale_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get sales statistics
  static async getStats() {
    const { data, error } = await supabase
      .from(TABLES.SALES_ORDERS)
      .select("final_amount, payment_status");

    if (error) throw error;

    const totalRevenue =
      data?.reduce((sum, sale) => sum + sale.final_amount, 0) || 0;
    const paidCount =
      data?.filter((sale) => sale.payment_status === "paid").length || 0;
    const pendingCount =
      data?.filter((sale) => sale.payment_status === "pending").length || 0;
    const overdueCount =
      data?.filter((sale) => sale.payment_status === "overdue").length || 0;

    return {
      totalSales: data?.length || 0,
      totalRevenue,
      paidCount,
      pendingCount,
      overdueCount,
      averageSaleValue: data?.length ? totalRevenue / data.length : 0,
    };
  }
}
