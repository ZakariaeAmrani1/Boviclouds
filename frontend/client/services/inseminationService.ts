import {
  InseminationRecord,
  CreateInseminationInput,
  UpdateInseminationInput,
  InseminationFilters,
  PaginationParams,
  PaginatedResponse,
  InseminationStats,
  InseminationResponse,
  InseminationListResponse,
  User,
  UsersListResponse,
} from "@shared/insemination";

const API_BASE_URL = "/api/insemination";

export class InseminationService {
  /**
   * Get all insemination records with optional filtering and pagination
   */
  static async getAll(
    filters: InseminationFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<InseminationRecord>> {
    const params = new URLSearchParams();

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

    const result: InseminationListResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération des inséminations",
      );
    }

    return result.data;
  }

  /**
   * Get a single insemination record by ID
   */
  static async getById(id: string): Promise<InseminationRecord> {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Insémination non trouvée");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: InseminationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération de l'insémination",
      );
    }

    return result.data;
  }

  /**
   * Create a new insemination record
   */
  static async create(
    input: CreateInseminationInput,
  ): Promise<InseminationRecord> {
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

    const result: InseminationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la création de l'insémination",
      );
    }

    return result.data;
  }

  /**
   * Update an existing insemination record
   */
  static async update(
    id: string,
    input: UpdateInseminationInput,
  ): Promise<InseminationRecord> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
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

    const result: InseminationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la mise à jour de l'insémination",
      );
    }

    return result.data;
  }

  /**
   * Delete an insemination record
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
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
        result.message || "Erreur lors de la suppression de l'insémination",
      );
    }
  }

  /**
   * Get insemination statistics
   */
  static async getStats(): Promise<InseminationStats> {
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
   * Search inseminations by NNI (quick search)
   */
  static async searchByNNI(nni: string): Promise<InseminationRecord[]> {
    if (!nni.trim()) {
      return [];
    }

    const filters: InseminationFilters = { nni: nni.trim() };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Search inseminations by semence ID
   */
  static async searchBySemenceId(semenceId: string): Promise<InseminationRecord[]> {
    if (!semenceId.trim()) {
      return [];
    }

    const filters: InseminationFilters = { semence_id: semenceId.trim() };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Get inseminations by inseminateur
   */
  static async getByInseminateur(inseminateurId: string): Promise<InseminationRecord[]> {
    const filters: InseminationFilters = { inseminateur_id: inseminateurId };
    const result = await this.getAll(filters, { page: 1, limit: 100 });
    return result.data;
  }

  /**
   * Get inseminations by responsable local
   */
  static async getByResponsableLocal(responsableId: string): Promise<InseminationRecord[]> {
    const filters: InseminationFilters = { responsable_local_id: responsableId };
    const result = await this.getAll(filters, { page: 1, limit: 100 });
    return result.data;
  }

  /**
   * Export insemination data
   */
  static async export(
    filters: InseminationFilters = {},
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
   * Check if NNI already has insemination on the same date (for validation)
   */
  static async checkDuplicateInsemination(
    nni: string,
    date: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const filters: InseminationFilters = {
        nni: nni.trim(),
        date_dissemination: date,
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
   * Get recent inseminations
   */
  static async getRecent(limit: number = 5): Promise<InseminationRecord[]> {
    const result = await this.getAll({}, { page: 1, limit });
    return result.data;
  }

  /**
   * Get all users for dropdown menus
   */
  static async getUsers(): Promise<User[]> {
    const response = await fetch("/api/utilisateur");

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
   * Get users by role (for filtering inseminateurs vs responsables)
   */
  static async getUsersByRole(role?: string): Promise<User[]> {
    const users = await this.getUsers();
    
    if (!role) {
      return users;
    }

    return users.filter(user => user.role === role);
  }

  /**
   * Bulk operations helper
   */
  static async bulkDelete(ids: string[]): Promise<void> {
    const deletePromises = ids.map((id) => this.delete(id));
    await Promise.all(deletePromises);
  }

  /**
   * Get inseminations by date range
   */
  static async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<InseminationRecord[]> {
    // Note: This would need backend support for date range filtering
    // For now, we'll get all and filter client-side (not ideal for production)
    const result = await this.getAll({}, { page: 1, limit: 1000 });
    
    return result.data.filter(record => {
      const disseminationDate = new Date(record.date_dissemination);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return disseminationDate >= start && disseminationDate <= end;
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
      const monthKey = month.toString().padStart(2, '0');
      monthlyStats[monthKey] = records.filter(record => {
        const disseminationDate = new Date(record.date_dissemination);
        return disseminationDate.getMonth() + 1 === month;
      }).length;
    }

    return monthlyStats;
  }
}
