import { supabase } from "@/lib/database";

export interface ProductionRecord {
  id: string;
  production_date: string;
  product_name: string;
  product_code: string;
  quantity_produced: number;
  quantity_defective: number;
  production_line?: string;
  shift: string;
  produced_by?: string;
  quality_check: boolean;
  quality_checked_by?: string;
  quality_check_date?: string;
  notes?: string;
  status:
    | "in_progress"
    | "completed"
    | "quality_check"
    | "approved"
    | "rejected";
  created_at: string;
  updated_at: string;
}

export class ProductionRepository {
  // Production Records CRUD
  static async getProductionRecords(): Promise<ProductionRecord[]> {
    const { data, error } = await supabase
      .from("production_records")
      .select("*")
      .order("production_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getProductionById(id: string): Promise<ProductionRecord | null> {
    const { data, error } = await supabase
      .from("production_records")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createProductionRecord(
    record: Omit<ProductionRecord, "id" | "created_at" | "updated_at">
  ): Promise<ProductionRecord> {
    const { data, error } = await supabase
      .from("production_records")
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProductionRecord(
    id: string,
    updates: Partial<ProductionRecord>
  ): Promise<ProductionRecord> {
    const { data, error } = await supabase
      .from("production_records")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProductionRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from("production_records")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // Search and Filter
  static async searchProductionRecords(
    query: string
  ): Promise<ProductionRecord[]> {
    const { data, error } = await supabase
      .from("production_records")
      .select("*")
      .or(`product_name.ilike.%${query}%,product_code.ilike.%${query}%`)
      .order("production_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getProductionByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ProductionRecord[]> {
    const { data, error } = await supabase
      .from("production_records")
      .select("*")
      .gte("production_date", startDate)
      .lte("production_date", endDate)
      .order("production_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getProductionByStatus(
    status: string
  ): Promise<ProductionRecord[]> {
    const { data, error } = await supabase
      .from("production_records")
      .select("*")
      .eq("status", status)
      .order("production_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Quality Control
  static async updateQualityCheck(
    id: string,
    qualityCheck: boolean,
    checkedBy?: string
  ): Promise<ProductionRecord> {
    return this.updateProductionRecord(id, {
      quality_check: qualityCheck,
      quality_checked_by: checkedBy,
      quality_check_date: new Date().toISOString(),
      status: qualityCheck ? "approved" : "rejected",
    });
  }

  // Statistics
  static async getProductionStats() {
    const { data, error } = await supabase
      .from("production_records")
      .select(
        "quantity_produced, quantity_defective, status, production_date, quality_check"
      );

    if (error) throw error;

    const stats = {
      totalProduced: 0,
      totalDefective: 0,
      completedRecords: 0,
      inProgressRecords: 0,
      qualityPassed: 0,
      qualityFailed: 0,
    };

    data?.forEach((record) => {
      stats.totalProduced += record.quantity_produced;
      stats.totalDefective += record.quantity_defective;

      if (record.status === "completed" || record.status === "approved") {
        stats.completedRecords++;
      } else if (record.status === "in_progress") {
        stats.inProgressRecords++;
      }

      if (record.quality_check) {
        stats.qualityPassed++;
      } else if (record.quality_check === false) {
        stats.qualityFailed++;
      }
    });

    return stats;
  }
}
