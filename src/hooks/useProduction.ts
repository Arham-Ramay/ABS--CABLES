import { useState, useEffect } from "react";
import {
  ProductionRepository,
  ProductionRecord,
} from "@/repositories/productionRepository";

export function useProduction() {
  const [productionRecords, setProductionRecords] = useState<
    ProductionRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all production records
  const fetchProductionRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductionRepository.getProductionRecords();
      setProductionRecords(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch production records"
      );
    } finally {
      setLoading(false);
    }
  };

  // Create new production record
  const createProductionRecord = async (
    recordData: Omit<ProductionRecord, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setError(null);
      const newRecord = await ProductionRepository.createProductionRecord(
        recordData
      );
      setProductionRecords((prev) => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create production record"
      );
      throw err;
    }
  };

  // Update production record
  const updateProductionRecord = async (
    id: string,
    updates: Partial<ProductionRecord>
  ) => {
    try {
      setError(null);
      const updatedRecord = await ProductionRepository.updateProductionRecord(
        id,
        updates
      );
      setProductionRecords((prev) =>
        prev.map((record) => (record.id === id ? updatedRecord : record))
      );
      return updatedRecord;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update production record"
      );
      throw err;
    }
  };

  // Delete production record
  const deleteProductionRecord = async (id: string) => {
    try {
      setError(null);
      await ProductionRepository.deleteProductionRecord(id);
      setProductionRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete production record"
      );
      throw err;
    }
  };

  // Get production by ID
  const getProductionById = async (
    id: string
  ): Promise<ProductionRecord | null> => {
    try {
      setError(null);
      return await ProductionRepository.getProductionById(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch production record"
      );
      throw err;
    }
  };

  // Search production records
  const searchProductionRecords = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductionRepository.searchProductionRecords(query);
      setProductionRecords(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to search production records"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter by date range
  const filterByDateRange = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductionRepository.getProductionByDateRange(
        startDate,
        endDate
      );
      setProductionRecords(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to filter by date range"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter by status
  const filterByStatus = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductionRepository.getProductionByStatus(status);
      setProductionRecords(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to filter by status"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update quality check
  const updateQualityCheck = async (
    id: string,
    qualityCheck: boolean,
    checkedBy?: string
  ) => {
    try {
      setError(null);
      const updatedRecord = await ProductionRepository.updateQualityCheck(
        id,
        qualityCheck,
        checkedBy
      );
      setProductionRecords((prev) =>
        prev.map((record) => (record.id === id ? updatedRecord : record))
      );
      return updatedRecord;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update quality check"
      );
      throw err;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchProductionRecords();
  }, []);

  return {
    productionRecords,
    loading,
    error,
    fetchProductionRecords,
    createProductionRecord,
    updateProductionRecord,
    deleteProductionRecord,
    getProductionById,
    searchProductionRecords,
    filterByDateRange,
    filterByStatus,
    updateQualityCheck,
  };
}
