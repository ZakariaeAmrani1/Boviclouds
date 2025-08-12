import { useState, useEffect, useCallback } from "react";
import {
  RebouclageRecord,
  CreateRebouclageInput,
  CreateRebouclageAutomaticInput,
  UpdateRebouclageInput,
  RebouclageFilters,
  PaginationParams,
  PaginatedResponse,
  RebouclageStatus,
} from "@shared/rebouclage";
import { RebouclageService } from "../services/rebouclageService";

// Hook for managing rebouclage list
export const useRebouclageList = (
  initialFilters: RebouclageFilters = {},
  initialPagination: PaginationParams = { page: 1, limit: 10 },
) => {
  const [data, setData] = useState<PaginatedResponse<RebouclageRecord> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RebouclageFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<PaginationParams>(initialPagination);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await RebouclageService.getAll(filters, pagination);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newFilters: RebouclageFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const updatePagination = useCallback((newPagination: PaginationParams) => {
    setPagination(newPagination);
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

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

// Hook for managing single rebouclage record operations
export const useRebouclage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecord = useCallback(
    async (input: CreateRebouclageInput): Promise<RebouclageRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await RebouclageService.create(input);
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la création",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateRecord = useCallback(
    async (
      id: string,
      input: UpdateRebouclageInput,
    ): Promise<RebouclageRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await RebouclageService.update(id, input);
        if (!result) {
          setError("Enregistrement non trouvé");
        }
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la mise à jour",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteRecord = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await RebouclageService.delete(id);
      if (!result) {
        setError("Impossible de supprimer l'enregistrement");
      }
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecord = useCallback(
    async (id: string): Promise<RebouclageRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await RebouclageService.getById(id);
        if (!result) {
          setError("Enregistrement non trouvé");
        }
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la récupération",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
  };
};

// Hook for rebouclage statistics
export const useRebouclageStats = () => {
  const [stats, setStats] = useState<{
    total: number;
    actif: number;
    enAttente: number;
    annule: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await RebouclageService.getStats();
      setStats(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};

// Hook for exporting data
export const useRebouclageExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(
    async (
      filters: RebouclageFilters = {},
      format: "csv" | "excel" = "csv",
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const blob = await RebouclageService.export(filters, format);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `rebouclage_export_${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de l'export",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    exportData,
  };
};
