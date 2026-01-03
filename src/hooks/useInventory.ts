import { useState, useEffect } from "react";
import { InventoryRepository } from "@/repositories/inventoryRepository";
import { Inventory } from "@/types";

export function useInventory() {
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all inventory items
  const fetchInventoryItems = async () => {
    try {
      console.log("Starting fetchInventoryItems...");
      setLoading(true);
      setError(null);
      const data = await InventoryRepository.getAll();
      console.log("Received data:", data);
      setInventoryItems(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch inventory items";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create new inventory item
  const createInventoryItem = async (
    itemData: Omit<Inventory, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setError(null);
      const newItem = await InventoryRepository.create(itemData);
      setInventoryItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create inventory item"
      );
      throw err;
    }
  };

  // Update inventory item
  const updateInventoryItem = async (
    id: string,
    updates: Partial<Inventory>
  ) => {
    try {
      setError(null);
      const updatedItem = await InventoryRepository.update(id, updates);
      setInventoryItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update inventory item"
      );
      throw err;
    }
  };

  // Delete inventory item
  const deleteInventoryItem = async (id: string) => {
    try {
      setError(null);
      await InventoryRepository.delete(id);
      setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete inventory item"
      );
      throw err;
    }
  };

  // Get inventory by ID
  const getInventoryById = async (id: string): Promise<Inventory | null> => {
    try {
      setError(null);
      return await InventoryRepository.getById(id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch inventory item"
      );
      throw err;
    }
  };

  // Search inventory items
  const searchInventoryItems = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await InventoryRepository.search(query);
      setInventoryItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search inventory items"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get inventory by category
  const getInventoryByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await InventoryRepository.getByCategory(category);
      setInventoryItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to filter by category"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get low stock items
  const getLowStockItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InventoryRepository.getLowStockItems();
      setInventoryItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch low stock items"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update stock level
  const updateStockLevel = async (
    id: string,
    quantity: number,
    operation: "add" | "subtract" | "set"
  ) => {
    try {
      setError(null);
      const updatedItem = await InventoryRepository.updateStock(
        id,
        quantity,
        operation
      );
      setInventoryItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update stock level"
      );
      throw err;
    }
  };

  // Get inventory statistics
  const getInventoryStats = async () => {
    try {
      setError(null);
      return await InventoryRepository.getStats();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch inventory stats"
      );
      throw err;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  return {
    inventoryItems,
    loading,
    error,
    fetchInventoryItems,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryById,
    searchInventoryItems,
    getInventoryByCategory,
    getLowStockItems,
    updateStockLevel,
    getInventoryStats,
  };
}
