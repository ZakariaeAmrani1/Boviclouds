import { useState, useEffect, useCallback } from "react";
import {
  LactationRecord,
  CreateLactationInput,
  UpdateLactationInput,
  LactationFilters,
  PaginationParams,
  PaginatedResponse,
  LactationStats,
  User,
  Identification,
} from "@shared/lactation";
import { LactationService } from "../services/lactationService";

// Hook for managing lactation list with filtering and pagination
export const useLactationList = (
  initialFilters: LactationFilters = {},
  initialPagination: PaginationParams = { page: 1, limit: 10 },
) => {
  const [data, setData] = useState<PaginatedResponse<LactationRecord> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LactationFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<PaginationParams>(initialPagination);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await LactationService.getAll(filters, pagination);
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

  const updateFilters = useCallback((newFilters: LactationFilters) => {
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

// Hook for individual lactation CRUD operations
export const useLactation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRecord = useCallback(
    async (input: CreateLactationInput): Promise<LactationRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await LactationService.create(input);
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
      input: UpdateLactationInput,
    ): Promise<LactationRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await LactationService.update(id, input);
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
      await LactationService.delete(id);
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
    async (id: string): Promise<LactationRecord | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await LactationService.getById(id);
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

// Hook for lactation export functionality
export const useLactationExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(
    async (
      filters: LactationFilters = {},
      format: "csv" | "excel" = "csv",
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const blob = await LactationService.export(filters, format);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `lactations_${new Date().toISOString().split("T")[0]}.${format}`;
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

// Hook for lactation statistics
export const useLactationStats = () => {
  const [stats, setStats] = useState<LactationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await LactationService.getStats();
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

// Hook for user management (for controleur laitier dropdown)
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await LactationService.getUsers();
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

// Hook for identification management (for sujet dropdown)
export const useIdentifications = () => {
  const [identifications, setIdentifications] = useState<Identification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdentifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await LactationService.getIdentifications();
      setIdentifications(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des identifications",
      );
      setIdentifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdentifications();
  }, [fetchIdentifications]);

  const getIdentificationName = useCallback(
    (identificationId: string): string => {
      const identification = identifications.find(
        (i) => i.id === identificationId,
      );
      return identification
        ? `${identification.nni} - ${identification.nom}`
        : identificationId;
    },
    [identifications],
  );

  const refresh = useCallback(() => {
    fetchIdentifications();
  }, [fetchIdentifications]);

  return {
    identifications,
    loading,
    error,
    getIdentificationName,
    refresh,
  };
};

// Hook for lactation search functionality
export const useLactationSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBySujetId = useCallback(
    async (sujetId: string): Promise<LactationRecord[]> => {
      if (!sujetId.trim()) return [];

      setLoading(true);
      setError(null);
      try {
        const result = await LactationService.searchBySujetId(sujetId);
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

  const searchByLactationNumber = useCallback(
    async (nLactation: number): Promise<LactationRecord[]> => {
      setLoading(true);
      setError(null);
      try {
        const result =
          await LactationService.searchByLactationNumber(nLactation);
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

  const searchByControleurLaitier = useCallback(
    async (controleurId: string): Promise<LactationRecord[]> => {
      if (!controleurId.trim()) return [];

      setLoading(true);
      setError(null);
      try {
        const result =
          await LactationService.searchByControleurLaitier(controleurId);
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

  const searchByDateRange = useCallback(
    async (startDate: string, endDate: string): Promise<LactationRecord[]> => {
      setLoading(true);
      setError(null);
      try {
        const result = await LactationService.getByDateRange(
          startDate,
          endDate,
        );
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

  return {
    loading,
    error,
    searchBySujetId,
    searchByLactationNumber,
    searchByControleurLaitier,
    searchByDateRange,
  };
};

// Hook for bulk operations
export const useLactationBulk = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await LactationService.bulkDelete(ids);
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

// Hook for lactation analytics
export const useLactationAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTopProducers = useCallback(
    async (limit: number = 10): Promise<LactationRecord[]> => {
      setLoading(true);
      setError(null);
      try {
        const result = await LactationService.getTopProducers(limit);
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la récupération",
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getAverageStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await LactationService.getAverageStats();
      return result;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du calcul des moyennes",
      );
      return { avgMilkKg: 0, avgProteinPct: 0, avgMgPct: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const getMonthlyStats = useCallback(
    async (year: number): Promise<Record<string, number>> => {
      setLoading(true);
      setError(null);
      try {
        const result = await LactationService.getMonthlyStats(year);
        return result;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du calcul des statistiques mensuelles",
        );
        return {};
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getByMilkProductionRange = useCallback(
    async (minKg: number, maxKg: number): Promise<LactationRecord[]> => {
      setLoading(true);
      setError(null);
      try {
        const result = await LactationService.getByMilkProductionRange(
          minKg,
          maxKg,
        );
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la récupération",
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    getTopProducers,
    getAverageStats,
    getMonthlyStats,
    getByMilkProductionRange,
  };
};

// Hook for lactation validation helpers
export const useLactationValidation = () => {
  const [loading, setLoading] = useState(false);

  const validateMilkProduction = useCallback(
    (
      milkKg: number,
      lactationNumber: number,
    ): { isValid: boolean; message?: string } => {
      if (lactationNumber === 1 && milkKg > 60) {
        return {
          isValid: false,
          message: "Production élevée pour une première lactation",
        };
      }

      if (milkKg < 5) {
        return {
          isValid: false,
          message: "Production très faible, vérifiez les données",
        };
      }

      if (milkKg > 80) {
        return {
          isValid: false,
          message: "Production très élevée, vérifiez les données",
        };
      }

      return { isValid: true };
    },
    [],
  );

  const validatePercentages = useCallback(
    (
      proteinPct: number,
      mgPct: number,
    ): { isValid: boolean; message?: string } => {
      if (proteinPct < 2.5 || proteinPct > 5.0) {
        return {
          isValid: false,
          message: "Pourcentage de protéine hors norme (2.5-5.0%)",
        };
      }

      if (mgPct < 2.5 || mgPct > 6.0) {
        return {
          isValid: false,
          message: "Pourcentage MG hors norme (2.5-6.0%)",
        };
      }

      return { isValid: true };
    },
    [],
  );

  const calculateMgConsistency = useCallback(
    (
      milkKg: number,
      mgKg: number,
      mgPct: number,
    ): { isConsistent: boolean; calculatedPct: number } => {
      if (milkKg <= 0) return { isConsistent: false, calculatedPct: 0 };

      const calculatedPct = (mgKg / milkKg) * 100;
      const tolerance = 0.5; // 0.5% tolerance
      const isConsistent = Math.abs(calculatedPct - mgPct) <= tolerance;

      return { isConsistent, calculatedPct };
    },
    [],
  );

  return {
    loading,
    validateMilkProduction,
    validatePercentages,
    calculateMgConsistency,
  };
};
