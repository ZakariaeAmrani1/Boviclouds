import { useState, useEffect, useCallback } from "react";
import {
  UtilisateurRecord,
  CreateUtilisateurInput,
  UpdateUtilisateurInput,
  UtilisateurFilters,
  PaginationParams,
  PaginatedResponse,
  UtilisateurStatus,
  UtilisateurRole,
} from "@shared/utilisateur";
import { UtilisateurService } from "../services/utilisateurService";

// Hook for managing utilisateur list
export const useUtilisateurList = (
  initialFilters: UtilisateurFilters = {},
  initialPagination: PaginationParams = { page: 1, limit: 10 },
) => {
  const [data, setData] = useState<PaginatedResponse<UtilisateurRecord> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UtilisateurFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<PaginationParams>(initialPagination);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await UtilisateurService.getAll(filters, pagination);
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

  const updateFilters = useCallback((newFilters: UtilisateurFilters) => {
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

// Hook for managing single utilisateur record operations
export const useUtilisateur = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecord = useCallback(
    async (
      input: CreateUtilisateurInput,
    ): Promise<UtilisateurRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await UtilisateurService.create(input);
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
      input: UpdateUtilisateurInput,
    ): Promise<UtilisateurRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await UtilisateurService.update(id, input);
        if (!result) {
          setError("Utilisateur non trouvé");
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
      const result = await UtilisateurService.delete(id);
      console.log(result);
      if (!result) {
        setError("Impossible de supprimer l'utilisateur");
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
    async (id: string): Promise<UtilisateurRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await UtilisateurService.getById(id);
        if (!result) {
          setError("Utilisateur non trouvé");
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

// Hook for utilisateur statistics
export const useUtilisateurStats = () => {
  const [stats, setStats] = useState<{
    total: number;
    actif: number;
    inactif: number;
    enAttente: number;
    suspendu: number;
    byRole: Record<UtilisateurRole, number>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await UtilisateurService.getStats();
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
export const useUtilisateurExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(
    async (
      filters: UtilisateurFilters = {},
      format: "csv" | "excel" = "csv",
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const blob = await UtilisateurService.export(filters, format);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `utilisateurs_export_${new Date().toISOString().split("T")[0]}.${format}`;
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
