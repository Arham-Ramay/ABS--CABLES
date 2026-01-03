import { supabase } from "@/lib/database";
import { BillingInvoice, BillingItem, BillingPayment } from "@/types";

export class BillingRepository {
  // Invoice operations
  static async getAllInvoices(): Promise<BillingInvoice[]> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .order("invoice_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getInvoiceById(id: string): Promise<BillingInvoice | null> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createInvoice(
    invoice: Omit<BillingInvoice, "id" | "created_at" | "updated_at">
  ): Promise<BillingInvoice> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .insert(invoice)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateInvoice(
    id: string,
    updates: Partial<BillingInvoice>
  ): Promise<BillingInvoice> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase
      .from("billing_invoices")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  static async getInvoiceByNumber(
    invoiceNumber: string
  ): Promise<BillingInvoice | null> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .eq("invoice_number", invoiceNumber)
      .single();

    if (error) throw error;
    return data;
  }

  // Item operations
  static async getInvoiceItems(invoiceId: string): Promise<BillingItem[]> {
    const { data, error } = await supabase
      .from("billing_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createInvoiceItem(
    item: Omit<BillingItem, "id" | "created_at" | "updated_at">
  ): Promise<BillingItem> {
    const { data, error } = await supabase
      .from("billing_items")
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateInvoiceItem(
    id: string,
    updates: Partial<BillingItem>
  ): Promise<BillingItem> {
    const { data, error } = await supabase
      .from("billing_items")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteInvoiceItem(id: string): Promise<void> {
    const { error } = await supabase
      .from("billing_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Payment operations
  static async getInvoicePayments(
    invoiceId: string
  ): Promise<BillingPayment[]> {
    const { data, error } = await supabase
      .from("billing_payments")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("payment_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createPayment(
    payment: Omit<BillingPayment, "id" | "created_at" | "updated_at">
  ): Promise<BillingPayment> {
    const { data, error } = await supabase
      .from("billing_payments")
      .insert(payment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePayment(
    id: string,
    updates: Partial<BillingPayment>
  ): Promise<BillingPayment> {
    const { data, error } = await supabase
      .from("billing_payments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePayment(id: string): Promise<void> {
    const { error } = await supabase
      .from("billing_payments")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Search and filter operations
  static async searchInvoices(query: string): Promise<BillingInvoice[]> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .or(
        `invoice_number.ilike.%${query}%,client_name.ilike.%${query}%,client_email.ilike.%${query}%`
      )
      .order("invoice_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getInvoicesByClient(
    clientName: string
  ): Promise<BillingInvoice[]> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .eq("client_name", clientName)
      .order("invoice_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getInvoicesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<BillingInvoice[]> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .gte("invoice_date", startDate)
      .lte("invoice_date", endDate)
      .order("invoice_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getInvoicesByStatus(status: string): Promise<BillingInvoice[]> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .eq("status", status)
      .order("invoice_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getInvoicesByPaymentStatus(
    paymentStatus: string
  ): Promise<BillingInvoice[]> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .eq("payment_status", paymentStatus)
      .order("invoice_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getOverdueInvoices(): Promise<BillingInvoice[]> {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("*")
      .lt("due_date", new Date().toISOString().split("T")[0])
      .neq("payment_status", "paid")
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Statistics
  static async getBillingStats() {
    const { data, error } = await supabase
      .from("billing_invoices")
      .select("total_amount, payment_status, due_date, invoice_date");

    if (error) throw error;

    const totalRevenue =
      data?.reduce((sum, invoice) => sum + invoice.total_amount, 0) || 0;
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

    // Get current month revenue
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthRevenue =
      data
        ?.filter((invoice) => invoice.invoice_date.startsWith(currentMonth))
        .reduce((sum, invoice) => sum + invoice.total_amount, 0) || 0;

    return {
      totalInvoices: data?.length || 0,
      totalRevenue,
      currentMonthRevenue,
      paidCount,
      pendingCount,
      overdueCount,
      averageInvoiceValue: data?.length ? totalRevenue / data.length : 0,
    };
  }

  // Complete invoice with items
  static async getInvoiceWithItems(invoiceId: string) {
    const invoice = await this.getInvoiceById(invoiceId);
    if (!invoice) return null;

    const items = await this.getInvoiceItems(invoiceId);
    const payments = await this.getInvoicePayments(invoiceId);

    return {
      ...invoice,
      items,
      payments,
    };
  }

  // Update invoice payment status and amount
  static async updateInvoicePayment(
    invoiceId: string,
    paymentAmount: number,
    paymentMethod: string
  ): Promise<BillingInvoice> {
    const invoice = await this.getInvoiceById(invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const newAmountPaid = invoice.amount_paid + paymentAmount;
    const newBalanceDue = invoice.total_amount - newAmountPaid;
    const newPaymentStatus = newBalanceDue <= 0 ? "paid" : "partial";

    // Create payment record
    await this.createPayment({
      invoice_id: invoiceId,
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: paymentMethod,
      amount: paymentAmount,
      payment_status: "completed",
      created_by: "Admin",
    });

    // Update invoice
    return this.updateInvoice(invoiceId, {
      amount_paid: newAmountPaid,
      balance_due: Math.max(0, newBalanceDue),
      payment_status: newPaymentStatus,
      payment_method: paymentMethod,
    });
  }
}
