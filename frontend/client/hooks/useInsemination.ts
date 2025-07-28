import { useState, useEffect, useCallback } from "react";
import {
  InseminationRecord,
  CreateInseminationInput,
  UpdateInseminationInput,
  InseminationFilters,
  PaginationParams,
  PaginatedResponse,
  InseminationStats,
  User,
} from "@shared/insemination";
import { InseminationService } from "../services/inseminationService";

// Hook for managing insemination list with filtering and pagination
export const useInseminationList = (
  initialFilters: InseminationFilters = {},
  initialPagination: PaginationParams = { page: 1, limit: 10 },
) => {
  const [data, setData] =
    useState<PaginatedResponse<InseminationRecord> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InseminationFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<PaginationParams>(initialPagination);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await InseminationService.getAll(filters, pagination);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newFilters: InseminationFilters) => {
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

// Hook for individual insemination CRUD operations
export const useInsemination = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecord = useCallback(
    async (
      input: CreateInseminationInput,
    ): Promise<InseminationRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await InseminationService.create(input);
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
      input: UpdateInseminationInput,
    ): Promise<InseminationRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await InseminationService.update(id, input);
        return result;
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
      await InseminationService.delete(id);
      return true;
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
    async (id: string): Promise<InseminationRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await InseminationService.getById(id);
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

// Hook for insemination export functionality
export const useInseminationExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(
    async (
      filters: InseminationFilters = {},
      format: "csv" | "excel" = "csv",
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const blob = await InseminationService.export(filters, format);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `inseminations_${new Date().toISOString().split("T")[0]}.${format}`;
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

// Hook for insemination statistics
export const useInseminationStats = () => {
  const [stats, setStats] = useState<InseminationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await InseminationService.getStats();
      setStats(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des statistiques",
      );
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
};

// Hook for user management (for dropdowns)
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await InseminationService.getUsers();
      setUsers(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des utilisateurs",
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getUsersByRole = useCallback(
    (role?: string): User[] => {
      if (!role) return users;
      return users.filter((user) => user.role === role);
    },
    [users],
  );

  const getUserName = useCallback(
    (userId: string): string => {
      const user = users.find((u) => u.id === userId);
      return user ? `${user.prenom} ${user.nom}` : userId;
    },
    [users],
  );

  const refresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    getUsersByRole,
    getUserName,
    refresh,
  };
};

// Hook for insemination search functionality
export const useInseminationSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByNNI = useCallback(
    async (nni: string): Promise<InseminationRecord[]> => {
      if (!nni.trim()) return [];

      setLoading(true);
      setError(null);
      try {
        const result = await InseminationService.searchByNNI(nni);
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la recherche",
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const searchBySemenceId = useCallback(
    async (semenceId: string): Promise<InseminationRecord[]> => {
      if (!semenceId.trim()) return [];

      setLoading(true);
      setError(null);
      try {
        const result = await InseminationService.searchBySemenceId(semenceId);
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la recherche",
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const checkDuplicateInsemination = useCallback(
    async (nni: string, date: string, excludeId?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await InseminationService.checkDuplicateInsemination(
          nni,
          date,
          excludeId,
        );
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la vérification",
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
    searchByNNI,
    searchBySemenceId,
    checkDuplicateInsemination,
  };
};

// Hook for bulk operations
export const useInseminationBulk = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await InseminationService.bulkDelete(ids);
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression en lot",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    bulkDelete,
  };
};
