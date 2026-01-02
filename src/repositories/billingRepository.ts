import { supabase } from "@/lib/database";
import { TABLES } from "@/constants";
import { Billing } from "@/types";

export class BillingRepository {
  // Get all invoices
  static async getAll(): Promise<Billing[]> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("*")
      .order("billing_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get invoice by ID
  static async getById(id: string): Promise<Billing | null> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Create new invoice
  static async create(
    invoice: Omit<Billing, "id" | "created_at" | "updated_at">
  ): Promise<Billing> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .insert(invoice)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update invoice
  static async update(id: string, updates: Partial<Billing>): Promise<Billing> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete invoice
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.INVOICES)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Get invoice by invoice number
  static async getByInvoiceNumber(
    invoiceNumber: string
  ): Promise<Billing | null> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("*")
      .eq("invoice_number", invoiceNumber)
      .single();

    if (error) throw error;
    return data;
  }

  // Get invoices by customer
  static async getByCustomer(customerName: string): Promise<Billing[]> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("*")
      .eq("customer_name", customerName)
      .order("billing_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get invoices by date range
  static async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Billing[]> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("*")
      .gte("billing_date", startDate)
      .lte("billing_date", endDate)
      .order("billing_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get invoices by payment status
  static async getByPaymentStatus(status: string): Promise<Billing[]> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("*")
      .eq("payment_status", status)
      .order("billing_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get overdue invoices
  static async getOverdue(): Promise<Billing[]> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("*")
      .lt("due_date", new Date().toISOString().split("T")[0])
      .neq("payment_status", "paid")
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Update payment status
  static async updatePaymentStatus(
    id: string,
    status: "pending" | "paid" | "partial" | "overdue"
  ): Promise<Billing> {
    return this.update(id, { payment_status: status });
  }

  // Search invoices
  static async search(query: string): Promise<Billing[]> {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("*")
      .or(
        `invoice_number.ilike.%${query}%,customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`
      )
      .order("billing_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get billing statistics
  static async getStats() {
    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .select("final_amount, payment_status, due_date");

    if (error) throw error;

    const totalRevenue =
      data?.reduce((sum, invoice) => sum + invoice.final_amount, 0) || 0;
    const paidCount =
      data?.filter((invoice) => invoice.payment_status === "paid").length || 0;
    const pendingCount =
      data?.filter((invoice) => invoice.payment_status === "pending").length ||
      0;
    const overdueCount =
      data?.filter(
        (invoice) =>
          new Date(invoice.due_date) < new Date() &&
          invoice.payment_status !== "paid"
      ).length || 0;

    return {
      totalInvoices: data?.length || 0,
      totalRevenue,
      paidCount,
      pendingCount,
      overdueCount,
      averageInvoiceValue: data?.length ? totalRevenue / data.length : 0,
    };
  }
}
