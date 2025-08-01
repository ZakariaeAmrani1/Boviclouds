import {
  LactationRecord,
  CreateLactationInput,
  UpdateLactationInput,
  LactationFilters,
  PaginationParams,
  PaginatedResponse,
  LactationStats,
  LactationResponse,
  LactationListResponse,
  User,
  UsersListResponse,
  Identification,
  IdentificationsListResponse,
} from "@shared/lactation";

const API_BASE_URL = "/api/lactation";

export class LactationService {
  /**
   * Get all lactation records with optional filtering and pagination
   */
  static async getAll(
    filters: LactationFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<LactationRecord>> {
    const token = localStorage.getItem("access_token");
    const params = new URLSearchParams();

    // Add pagination params
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());
    params.append("token", token);

    // Add filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: LactationListResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération des lactations",
      );
    }

    return result.data;
  }

  /**
   * Get a single lactation record by ID
   */
  static async getById(id: string): Promise<LactationRecord> {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Lactation non trouvée");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: LactationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération de la lactation",
      );
    }

    return result.data;
  }

  /**
   * Create a new lactation record
   */
  static async create(input: CreateLactationInput): Promise<LactationRecord> {
    const token = localStorage.getItem("access_token");
    input.token = token;
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(
        errorResult.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result: LactationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la création de la lactation",
      );
    }

    return result.data;
  }

  /**
   * Update an existing lactation record
   */
  static async update(
    id: string,
    input: UpdateLactationInput,
  ): Promise<LactationRecord> {
    const token = localStorage.getItem("access_token");
    const data = {
      input: input,
      token: token,
    };
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(
        errorResult.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result: LactationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la mise à jour de la lactation",
      );
    }

    return result.data;
  }

  /**
   * Delete a lactation record
   */
  static async delete(id: string): Promise<void> {
    const params = new URLSearchParams();
    const token = localStorage.getItem("access_token");
    params.append("token", token);
    const response = await fetch(`${API_BASE_URL}/${id}?${params.toString()}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(
        errorResult.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message || "Erreur lors de la suppression de la lactation",
      );
    }
  }

  /**
   * Get lactation statistics
   */
  static async getStats(): Promise<LactationStats> {
    const response = await fetch(`${API_BASE_URL}/stats`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération des statistiques",
      );
    }

    return result.data;
  }

  /**
   * Export lactation data
   */
  static async export(
    filters: LactationFilters = {},
    format: "csv" | "excel" = "csv",
  ): Promise<Blob> {
    const params = new URLSearchParams();

    // Add filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    params.append("format", format);

    const response = await fetch(`${API_BASE_URL}/export?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  /**
   * Get all users for dropdown menus
   */
  static async getUsers(): Promise<User[]> {
    const token = localStorage.getItem("access_token");
    const response = await fetch("/api/utilisateur", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: UsersListResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération des utilisateurs",
      );
    }
    const data = result.data.filter(
      (user) => user.role === "CONTROLEUR_LAITIER",
    );
    return data;
  }

  /**
   * Get all identifications for dropdown menus
   */
  static async getIdentifications(): Promise<Identification[]> {
    const token = localStorage.getItem("access_token");
    const params = new URLSearchParams();
    params.append("token", token);
    const response = await fetch(`/api/identifications?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: IdentificationsListResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération des identifications",
      );
    }

    return result.data;
  }

  /**
   * Search lactations by sujet_id
   */
  static async searchBySujetId(sujetId: string): Promise<LactationRecord[]> {
    if (!sujetId.trim()) {
      return [];
    }

    const filters: LactationFilters = { sujet_id: sujetId.trim() };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Search lactations by lactation number
   */
  static async searchByLactationNumber(
    nLactation: number,
  ): Promise<LactationRecord[]> {
    const filters: LactationFilters = { n_lactation: nLactation };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Search lactations by controleur laitier
   */
  static async searchByControleurLaitier(
    controleurId: string,
  ): Promise<LactationRecord[]> {
    if (!controleurId.trim()) {
      return [];
    }

    const filters: LactationFilters = {
      controleur_laitier_id: controleurId.trim(),
    };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Get lactations by date range
   */
  static async getByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<LactationRecord[]> {
    const filters: LactationFilters = {
      date_min: startDate,
      date_max: endDate,
    };
    const result = await this.getAll(filters, { page: 1, limit: 1000 });
    return result.data;
  }

  /**
   * Get recent lactations
   */
  static async getRecent(limit: number = 5): Promise<LactationRecord[]> {
    const result = await this.getAll({}, { page: 1, limit });
    return result.data;
  }

  /**
   * Get users by role (for filtering)
   */
  static async getUsersByRole(role?: string): Promise<User[]> {
    const users = await this.getUsers();

    if (!role) {
      return users;
    }

    return users.filter((user) => user.role === role);
  }

  /**
   * Bulk operations helper
   */
  static async bulkDelete(ids: string[]): Promise<void> {
    const deletePromises = ids.map((id) => this.delete(id));
    await Promise.all(deletePromises);
  }

  /**
   * Get monthly statistics for a given year
   */
  static async getMonthlyStats(year: number): Promise<Record<string, number>> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const records = await this.getByDateRange(startDate, endDate);

    const monthlyStats: Record<string, number> = {};

    for (let month = 1; month <= 12; month++) {
      const monthKey = month.toString().padStart(2, "0");
      monthlyStats[monthKey] = records.filter((record) => {
        const createdDate = new Date(record.date_velage);
        return createdDate.getMonth() + 1 === month;
      }).length;
    }

    return monthlyStats;
  }

  /**
   * Get lactations by milk production range
   */
  static async getByMilkProductionRange(
    minKg: number,
    maxKg: number,
  ): Promise<LactationRecord[]> {
    const filters: LactationFilters = {
      lait_kg_min: minKg,
      lait_kg_max: maxKg,
    };
    const result = await this.getAll(filters, { page: 1, limit: 100 });
    return result.data;
  }

  /**
   * Get top milk producers
   */
  static async getTopProducers(limit: number = 10): Promise<LactationRecord[]> {
    // This would ideally be handled by the backend with sorting
    const result = await this.getAll({}, { page: 1, limit: 1000 });
    return result.data.sort((a, b) => b.lait_kg - a.lait_kg).slice(0, limit);
  }

  /**
   * Get average milk production statistics
   */
  static async getAverageStats(): Promise<{
    avgMilkKg: number;
    avgProteinPct: number;
    avgMgPct: number;
  }> {
    const result = await this.getAll({}, { page: 1, limit: 1000 });
    const records = result.data;

    if (records.length === 0) {
      return { avgMilkKg: 0, avgProteinPct: 0, avgMgPct: 0 };
    }

    const totals = records.reduce(
      (acc, record) => ({
        milk: acc.milk + record.lait_kg,
        protein: acc.protein + record.pct_proteine,
        mg: acc.mg + record.pct_mg,
      }),
      { milk: 0, protein: 0, mg: 0 },
    );

    return {
      avgMilkKg: totals.milk / records.length,
      avgProteinPct: totals.protein / records.length,
      avgMgPct: totals.mg / records.length,
    };
  }
}
