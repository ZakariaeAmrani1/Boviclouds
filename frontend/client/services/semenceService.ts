import {
  SemenceRecord,
  CreateSemenceInput,
  UpdateSemenceInput,
  SemenceFilters,
  PaginationParams,
  PaginatedResponse,
  SemenceStats,
  SemenceResponse,
  SemenceListResponse,
  User,
  UsersListResponse,
} from "@shared/semence";

<<<<<<< HEAD
const API_BASE_URL = "/api/semence";
=======
const API_BASE_URL = `${import.meta.env.VITE_API_URL3}/api/semence`;
>>>>>>> 11504cd228d3bf3db32e434f798117d567599449

export class SemenceService {
  /**
   * Get all semence records with optional filtering and pagination
   */
  static async getAll(
    filters: SemenceFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<SemenceRecord>> {
    const params = new URLSearchParams();
    const token = localStorage.getItem("access_token");
    params.append("token", token);

    // Add pagination params
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());

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

    const result: SemenceListResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération des semences",
      );
    }

    return result.data;
  }

  /**
   * Get a single semence record by ID
   */
  static async getById(id: string): Promise<SemenceRecord> {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Semence non trouvée");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SemenceResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération de la semence",
      );
    }

    return result.data;
  }

  /**
   * Create a new semence record
   */
  static async create(input: CreateSemenceInput): Promise<SemenceRecord> {
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

    const result: SemenceResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la création de la semence",
      );
    }

    return result.data;
  }

  /**
   * Update an existing semence record
   */
  static async update(
    id: string,
    input: UpdateSemenceInput,
  ): Promise<SemenceRecord> {
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

    const result: SemenceResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la mise à jour de la semence",
      );
    }

    return result.data;
  }

  /**
   * Delete a semence record
   */
  static async delete(id: string): Promise<void> {
    const params = new URLSearchParams();
    const token = localStorage.getItem("access_token");
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
        result.message || "Erreur lors de la suppression de la semence",
      );
    }
  }

  /**
   * Get semence statistics
   */
  static async getStats(): Promise<SemenceStats> {
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
   * Search semences by identificateur (quick search)
   */
  static async searchByIdentificateur(
    identificateur: string,
  ): Promise<SemenceRecord[]> {
    if (!identificateur.trim()) {
      return [];
    }

    const filters: SemenceFilters = { identificateur: identificateur.trim() };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Search semences by nom taureau
   */
  static async searchByNomTaureau(
    nomTaureau: string,
  ): Promise<SemenceRecord[]> {
    if (!nomTaureau.trim()) {
      return [];
    }

    const filters: SemenceFilters = { nom_taureau: nomTaureau.trim() };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Search semences by race taureau
   */
  static async searchByRaceTaureau(
    raceTaureau: string,
  ): Promise<SemenceRecord[]> {
    if (!raceTaureau.trim()) {
      return [];
    }

    const filters: SemenceFilters = { race_taureau: raceTaureau.trim() };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Search semences by numéro taureau
   */
  static async searchByNumTaureau(
    numTaureau: string,
  ): Promise<SemenceRecord[]> {
    if (!numTaureau.trim()) {
      return [];
    }

    const filters: SemenceFilters = { num_taureau: numTaureau.trim() };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Export semence data
   */
  static async export(
    filters: SemenceFilters = {},
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
   * Check if identificateur already exists (for validation)
   */
  static async checkDuplicateIdentificateur(
    identificateur: string,
    excludeId?: string,
  ): Promise<boolean> {
    try {
      const filters: SemenceFilters = {
        identificateur: identificateur.trim(),
      };
      const result = await this.getAll(filters, { page: 1, limit: 10 });

      if (excludeId) {
        // Filter out the record being edited
        const filteredRecords = result.data.filter(
          (record) => record.id !== excludeId,
        );
        return filteredRecords.length > 0;
      }

      return result.data.length > 0;
    } catch {
      // If there's an error, assume no duplicate to be safe
      return false;
    }
  }

  /**
   * Check if numéro taureau already exists (for validation)
   */
  static async checkDuplicateNumTaureau(
    numTaureau: string,
    excludeId?: string,
  ): Promise<boolean> {
    try {
      const filters: SemenceFilters = {
        num_taureau: numTaureau.trim(),
      };
      const result = await this.getAll(filters, { page: 1, limit: 10 });

      if (excludeId) {
        // Filter out the record being edited
        const filteredRecords = result.data.filter(
          (record) => record.id !== excludeId,
        );
        return filteredRecords.length > 0;
      }

      return result.data.length > 0;
    } catch {
      // If there's an error, assume no duplicate to be safe
      return false;
    }
  }

  /**
   * Get recent semences
   */
  static async getRecent(limit: number = 5): Promise<SemenceRecord[]> {
    const result = await this.getAll({}, { page: 1, limit });
    return result.data;
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
   * Get semences by date range
   */
  static async getByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<SemenceRecord[]> {
    // Note: This would need backend support for date range filtering
    // For now, we'll get all and filter client-side (not ideal for production)
    const result = await this.getAll({}, { page: 1, limit: 1000 });

    return result.data.filter((record) => {
      const createdDate = new Date(record.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return createdDate >= start && createdDate <= end;
    });
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
        const createdDate = new Date(record.createdAt);
        return createdDate.getMonth() + 1 === month;
      }).length;
    }

    return monthlyStats;
  }

  /**
   * Get semences by race (for analytics)
   */
  static async getByRace(race: string): Promise<SemenceRecord[]> {
    const filters: SemenceFilters = { race_taureau: race };
    const result = await this.getAll(filters, { page: 1, limit: 100 });
    return result.data;
  }

  /**
   * Get available races (for dropdown population)
   */
  static async getAvailableRaces(): Promise<string[]> {
    // This would ideally come from the backend, but for now we'll get all records
    // and extract unique races
    const result = await this.getAll({}, { page: 1, limit: 1000 });
    const races = [
      ...new Set(result.data.map((record) => record.race_taureau)),
    ];
    return races.sort();
  }

  /**
   * Get semences by taureau name (for tracking specific bulls)
   */
  static async getByTaureauName(nomTaureau: string): Promise<SemenceRecord[]> {
    const filters: SemenceFilters = { nom_taureau: nomTaureau };
    const result = await this.getAll(filters, { page: 1, limit: 100 });
    return result.data;
  }

  /**
   * Get available taureau names (for dropdown population)
   */
  static async getAvailableTaureauNames(): Promise<string[]> {
    // This would ideally come from the backend, but for now we'll get all records
    // and extract unique names
    const result = await this.getAll({}, { page: 1, limit: 1000 });
    const names = [...new Set(result.data.map((record) => record.nom_taureau))];
    return names.sort();
  }
}
