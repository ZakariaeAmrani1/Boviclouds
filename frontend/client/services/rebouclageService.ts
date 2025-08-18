import {
  RebouclageRecord,
  CreateRebouclageInput,
  CreateRebouclageAutomaticInput,
  UpdateRebouclageInput,
  RebouclageFilters,
  PaginationParams,
  PaginatedResponse,
  RebouclageStatus,
  RebouclageAutomaticResponse,
} from "@shared/rebouclage";
import axios from "axios";

// Mock data store - this will simulate a database
let rebouclageData: RebouclageRecord[] = [];

// Generate unique ID for new records
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function to format date to French format
const formatDateToFrench = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

// Utility function to apply filters
const applyFilters = (
  data: RebouclageRecord[],
  filters: RebouclageFilters,
): RebouclageRecord[] => {
  return data.filter((record) => {
    if (
      filters.ancienNNI &&
      !record.ancienNNI.toLowerCase().includes(filters.ancienNNI.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.nouveauNNI &&
      !record.nouveauNNI
        .toLowerCase()
        .includes(filters.nouveauNNI.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.creePar &&
      !record.identificateur_id
        .toLowerCase()
        .includes(filters.creePar.toLowerCase())
    ) {
      return false;
    }
    if (filters.dateCreation) {
      const recordDate = new Date(record.dateCreation).toDateString();
      const filterDate = new Date(filters.dateCreation).toDateString();
      if (recordDate !== filterDate) {
        return false;
      }
    }
    return true;
  });
};

// Utility function to apply pagination
const applyPagination = <T>(
  data: T[],
  pagination: PaginationParams,
): PaginatedResponse<T> => {
  const total = data.length;
  const totalPages = Math.ceil(total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages,
  };
};

export class RebouclageService {
  /**
   * Get all rebouclage records with optional filtering and pagination
   */
  static async getAll(
    filters: RebouclageFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<RebouclageRecord>> {
    const apiUrl = import.meta.env.VITE_API_URL;
    rebouclageData = [];

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${apiUrl}rebouclages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      response.data.map((rebouclage) => {
        rebouclageData.push({
          id: rebouclage._id,
          ancienNNI: rebouclage.ancien_nni,
          nouveauNNI: rebouclage.nouveau_nni,
          dateRebouclage: rebouclage.date_creation,
          identificateur_id: rebouclage.identificateur_id._id,
          CréePar:
            rebouclage.identificateur_id.nom_lat +
            " " +
            rebouclage.identificateur_id.prenom_lat,
          dateCreation: rebouclage.createdAt,
          dateModification: rebouclage.updatedAt,
        });
      });
    } catch (error) {
      console.error("Error getting inseminations:", error);
    }

    const filteredData = applyFilters(rebouclageData, filters);
    const paginatedResult = applyPagination(filteredData, pagination);

    return paginatedResult;
  }

  /**
   * Get a single rebouclage record by ID
   */
  static async getById(id: string): Promise<RebouclageRecord | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const record = rebouclageData.find((r) => r.id === id);
    return record || null;
  }

  /**
   * Create a new rebouclage record (manual mode)
   */
  static async create(input: CreateRebouclageInput): Promise<RebouclageRecord> {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8080/api/";
      const token = localStorage.getItem("access_token");
      console.log(input);

      const response = await axios.post(
        `${apiUrl}rebouclages`,
        {
          ancien_nni: input.ancienNNI,
          nouveau_nni: input.nouveauNNI,
          date_creation: input.dateRebouclage,
          identificateur_id: input.identificateur_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Erreur lors de la création");
      }
    } catch (error: any) {
      console.error("Error creating rebouclage:", error);
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la création du rebouclage",
      );
    }
  }

  /**
   * Create a new rebouclage record (automatic mode with image)
   */
  static async createAutomatic(
    input: CreateRebouclageAutomaticInput,
  ): Promise<RebouclageRecord> {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8080/api/";
      const token = localStorage.getItem("access_token");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", input.image);
      formData.append(
        "data",
        JSON.stringify({
          nouveauNNI: input.nouveauNNI,
          identificateur_id: input.identificateur_id,
          dateRebouclage: input.dateRebouclage,
          mode: "automatic",
        }),
      );

      const response = await axios.post(
        `${apiUrl}rebouclage/automatic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Erreur lors de la création automatique",
        );
      }
    } catch (error: any) {
      console.error("Error creating automatic rebouclage:", error);
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la création automatique du rebouclage",
      );
    }
  }

  /**
   * Update an existing rebouclage record
   */
  static async update(
    id: string,
    input: UpdateRebouclageInput,
  ): Promise<RebouclageRecord | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    const recordIndex = rebouclageData.findIndex((r) => r.id === id);
    if (recordIndex === -1) {
      return null;
    }

    const existingRecord = rebouclageData[recordIndex];
    const updatedRecord: RebouclageRecord = {
      ...existingRecord,
      ...input,
      dateModification: new Date().toISOString(),
    };

    rebouclageData[recordIndex] = updatedRecord;
    return updatedRecord;
  }

  /**
   * Delete a rebouclage record
   */
  static async delete(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const initialLength = rebouclageData.length;
    rebouclageData = rebouclageData.filter((r) => r.id !== id);
    return rebouclageData.length < initialLength;
  }

  /**
   * Get statistics about rebouclage records
   */
  static async getStats(): Promise<{
    total: number;
    actif: number;
    enAttente: number;
    annule: number;
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    // const total = rebouclageData.length;
    // const actif = rebouclageData.filter(
    //   (r) => r.statut === RebouclageStatus.ACTIF,
    // ).length;
    // const enAttente = rebouclageData.filter(
    //   (r) => r.statut === RebouclageStatus.EN_ATTENTE,
    // ).length;
    // const annule = rebouclageData.filter(
    //   (r) => r.statut === RebouclageStatus.ANNULE,
    // ).length;

    return { total: 0, actif: 0, enAttente: 0, annule: 0 };
  }

  /**
   * Export rebouclage data
   */
  static async export(
    filters: RebouclageFilters = {},
    format: "csv" | "excel" = "csv",
  ): Promise<Blob> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const filteredData = applyFilters(rebouclageData, filters);

    if (format === "csv") {
      const headers = [
        "ID",
        "Ancien NNI",
        "Nouveau NNI",
        "Date Rebouclage",
        "Identificateur",
        "Date Création",
      ];

      const csvContent = [
        headers.join(","),
        ...filteredData.map((record) =>
          [
            record.id,
            record.ancienNNI,
            record.nouveauNNI,
            formatDateToFrench(record.dateRebouclage),
            record.identificateur_id,
            formatDateToFrench(record.dateCreation),
          ].join(","),
        ),
      ].join("\n");

      return new Blob([csvContent], { type: "text/csv" });
    }

    // For Excel format, we would normally generate an actual Excel file
    // For now, we'll return a CSV with Excel MIME type
    const headers = [
      "ID",
      "Ancien NNI",
      "Nouveau NNI",
      "Date Rebouclage",
      "Identificateur",
      "Date Création",
    ];

    const csvContent = [
      headers.join("\t"),
      ...filteredData.map((record) =>
        [
          record.id,
          record.ancienNNI,
          record.nouveauNNI,
          formatDateToFrench(record.dateRebouclage),
          record.identificateur_id,
          formatDateToFrench(record.dateCreation),
        ].join("\t"),
      ),
    ].join("\n");

    return new Blob([csvContent], {
      type: "application/vnd.ms-excel",
    });
  }

  /**
   * Reset mock data to initial state (useful for testing)
   */
}
