import { useState, useEffect } from "react";
import {
  IdentificationRecord,
  CreateIdentificationInput,
  UpdateIdentificationInput,
  IdentificationFilters,
  PaginationParams,
  PaginatedResponse,
  IdentificationStats,
} from "@shared/identification";
import { IdentificationService } from "../services/identificationService";

// Hook for managing identification list with filters and pagination
export const useIdentificationList = (
  initialFilters: IdentificationFilters = {},
  initialPagination: PaginationParams = { page: 1, limit: 10 },
) => {
  const [data, setData] =
    useState<PaginatedResponse<IdentificationRecord> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IdentificationFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<PaginationParams>(initialPagination);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await IdentificationService.getAll(filters, pagination);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: IdentificationFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filtering
  };

  const updatePagination = (newPagination: PaginationParams) => {
    setPagination(newPagination);
  };

  const refresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [filters, pagination]);

  return {
    data,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    refresh,
  };
};

// Hook for individual identification operations (CRUD)
export const useIdentification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecord = async (
    id: string,
  ): Promise<IdentificationRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await IdentificationService.getById(id);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la récupération",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (
    input: CreateIdentificationInput,
  ): Promise<IdentificationRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await IdentificationService.create(input);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (
    id: string,
    input: UpdateIdentificationInput,
  ): Promise<IdentificationRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await IdentificationService.update(id, input);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await IdentificationService.delete(id);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord,
  };
};

// Hook for identification statistics
export const useIdentificationStats = () => {
  const [stats, setStats] = useState<IdentificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await IdentificationService.getStats();
      setStats(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des statistiques",
      );
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refresh,
  };
};

// Hook for identification export functionality
export const useIdentificationExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (
    filters: IdentificationFilters = {},
    format: "csv" | "excel" = "csv",
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const blob = await IdentificationService.export(filters, format);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `identifications_${new Date().toISOString().split("T")[0]}.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'export");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    exportData,
  };
};

// Hook for searching identifications by NNI
export const useIdentificationSearch = () => {
  const [results, setResults] = useState<IdentificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByNNI = async (nni: string) => {
    if (!nni.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await IdentificationService.searchByNNI(nni);
      setResults(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la recherche",
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    searchByNNI,
    clearResults,
  };
};

// Hook for NNI uniqueness validation
export const useNNIValidation = () => {
  const [loading, setLoading] = useState(false);

  const checkNNIUnique = async (
    nni: string,
    excludeId?: string,
  ): Promise<boolean> => {
    if (!nni.trim()) return true;

    setLoading(true);
    try {
      const isUnique = await IdentificationService.isNNIUnique(nni, excludeId);
      return isUnique;
    } catch {
      return false; // Assume not unique if there's an error
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    checkNNIUnique,
  };
};

// Hook for recent identifications
export const useRecentIdentifications = (limit: number = 5) => {
  const [recent, setRecent] = useState<IdentificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecent = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await IdentificationService.getRecent(limit);
      setRecent(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la récupération",
      );
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchRecent();
  };

  useEffect(() => {
    fetchRecent();
  }, [limit]);

  return {
    recent,
    loading,
    error,
    refresh,
  };
};
