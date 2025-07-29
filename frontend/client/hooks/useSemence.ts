import { useState, useEffect, useCallback } from "react";
import {
  SemenceRecord,
  CreateSemenceInput,
  UpdateSemenceInput,
  SemenceFilters,
  PaginationParams,
  PaginatedResponse,
  SemenceStats,
  User,
} from "@shared/semence";
import { SemenceService } from "../services/semenceService";

// Hook for managing semence list with filtering and pagination
export const useSemenceList = (
  initialFilters: SemenceFilters = {},
  initialPagination: PaginationParams = { page: 1, limit: 10 },
) => {
  const [data, setData] =
    useState<PaginatedResponse<SemenceRecord> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SemenceFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<PaginationParams>(initialPagination);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await SemenceService.getAll(filters, pagination);
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

  const updateFilters = useCallback((newFilters: SemenceFilters) => {
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

// Hook for individual semence CRUD operations
export const useSemence = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecord = useCallback(
    async (
      input: CreateSemenceInput,
    ): Promise<SemenceRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.create(input);
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
      input: UpdateSemenceInput,
    ): Promise<SemenceRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.update(id, input);
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
      await SemenceService.delete(id);
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
    async (id: string): Promise<SemenceRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.getById(id);
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

// Hook for semence export functionality
export const useSemenceExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(
    async (
      filters: SemenceFilters = {},
      format: "csv" | "excel" = "csv",
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const blob = await SemenceService.export(filters, format);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `semences_${new Date().toISOString().split("T")[0]}.${format}`;
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

// Hook for semence statistics
export const useSemenceStats = () => {
  const [stats, setStats] = useState<SemenceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await SemenceService.getStats();
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

// Hook for user management (for dropdowns) - shared with insemination
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await SemenceService.getUsers();
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

// Hook for semence search functionality
export const useSemenceSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByIdentificateur = useCallback(
    async (identificateur: string): Promise<SemenceRecord[]> => {
      if (!identificateur.trim()) return [];

      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.searchByIdentificateur(identificateur);
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

  const searchByNomTaureau = useCallback(
    async (nomTaureau: string): Promise<SemenceRecord[]> => {
      if (!nomTaureau.trim()) return [];

      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.searchByNomTaureau(nomTaureau);
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

  const searchByRaceTaureau = useCallback(
    async (raceTaureau: string): Promise<SemenceRecord[]> => {
      if (!raceTaureau.trim()) return [];

      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.searchByRaceTaureau(raceTaureau);
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

  const searchByNumTaureau = useCallback(
    async (numTaureau: string): Promise<SemenceRecord[]> => {
      if (!numTaureau.trim()) return [];

      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.searchByNumTaureau(numTaureau);
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

  const checkDuplicateIdentificateur = useCallback(
    async (identificateur: string, excludeId?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.checkDuplicateIdentificateur(
          identificateur,
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

  const checkDuplicateNumTaureau = useCallback(
    async (numTaureau: string, excludeId?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const result = await SemenceService.checkDuplicateNumTaureau(
          numTaureau,
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
    searchByIdentificateur,
    searchByNomTaureau,
    searchByRaceTaureau,
    searchByNumTaureau,
    checkDuplicateIdentificateur,
    checkDuplicateNumTaureau,
  };
};

// Hook for bulk operations
export const useSemenceBulk = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await SemenceService.bulkDelete(ids);
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

// Hook for race and taureau data (for dropdowns and analytics)
export const useSemenceMetadata = () => {
  const [races, setRaces] = useState<string[]>([]);
  const [taureauNames, setTaureauNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [raceData, taureauData] = await Promise.all([
        SemenceService.getAvailableRaces(),
        SemenceService.getAvailableTaureauNames(),
      ]);
      setRaces(raceData);
      setTaureauNames(taureauData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des métadonnées",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  const refresh = useCallback(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return {
    races,
    taureauNames,
    loading,
    error,
    refresh,
  };
};
