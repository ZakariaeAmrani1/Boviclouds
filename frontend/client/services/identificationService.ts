import {
  IdentificationRecord,
  CreateIdentificationInput,
  UpdateIdentificationInput,
  IdentificationFilters,
  PaginationParams,
  PaginatedResponse,
  IdentificationStats,
  IdentificationResponse,
  IdentificationListResponse,
} from "@shared/identification";
import { ImageData } from "../components/ui/multi-image-upload";

const API_BASE_URL = "/api/identification";

export class IdentificationService {
  /**
   * Get all identification records with optional filtering and pagination
   */
  static async getAll(
    filters: IdentificationFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<IdentificationRecord>> {
    const token = localStorage.getItem("access_token");
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
    params.append("token", token);
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: IdentificationListResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération des identifications",
      );
    }

    return result.data;
  }

  /**
   * Get a single identification record by ID
   */
  static async getById(id: string): Promise<IdentificationRecord> {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Identification non trouvée");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: IdentificationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la récupération de l'identification",
      );
    }

    return result.data;
  }

  /**
   * Create a new identification record
   */
  static async create(
    input: CreateIdentificationInput,
    images?: ImageData[],
  ): Promise<IdentificationRecord> {
    const token = localStorage.getItem("access_token");

    // If images are provided, use FormData
    if (images && images.length > 0) {
      const formData = new FormData();

      // Add JSON data as a field
      formData.append("data", JSON.stringify({ ...input, token }));

      // Add images
      images.forEach((imageData, index) => {
        formData.append(`images`, imageData.file);
      });

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(
          errorResult.message || `HTTP error! status: ${response.status}`,
        );
      }

      const result: IdentificationResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(
          result.message || "Erreur lors de la création de l'identification",
        );
      }

      return result.data;
    }

    // If no images, use regular JSON
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...input, token }),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(
        errorResult.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result: IdentificationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la création de l'identification",
      );
    }

    return result.data;
  }

  /**
   * Update an existing identification record
   */
  static async update(
    id: string,
    input: UpdateIdentificationInput,
    images?: ImageData[],
  ): Promise<IdentificationRecord> {
    const token = localStorage.getItem("access_token");

    // If images are provided, use FormData
    if (images && images.length > 0) {
      const formData = new FormData();

      // Add JSON data as a field
      formData.append("data", JSON.stringify({ ...input, token }));

      // Add images
      images.forEach((imageData, index) => {
        formData.append(`images`, imageData.file);
      });

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(
          errorResult.message || `HTTP error! status: ${response.status}`,
        );
      }

      const result: IdentificationResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(
          result.message || "Erreur lors de la mise à jour de l'identification",
        );
      }

      return result.data;
    }

    // If no images, use regular JSON
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...input, token }),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(
        errorResult.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result: IdentificationResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message || "Erreur lors de la mise à jour de l'identification",
      );
    }

    return result.data;
  }

  /**
   * Delete an identification record
   */
  static async delete(id: string): Promise<void> {
    const token = localStorage.getItem("access_token");
    const params = new URLSearchParams();
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
        result.message || "Erreur lors de la suppression de l'identification",
      );
    }
  }

  /**
   * Get identification statistics
   */
  static async getStats(): Promise<IdentificationStats> {
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
   * Search identifications by NNI (quick search)
   */
  static async searchByNNI(nni: string): Promise<IdentificationRecord[]> {
    if (!nni.trim()) {
      return [];
    }

    const filters: IdentificationFilters = { nni: nni.trim() };
    const result = await this.getAll(filters, { page: 1, limit: 10 });
    return result.data;
  }

  /**
   * Export identification data
   */
  static async export(
    filters: IdentificationFilters = {},
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
   * Check if NNI is unique (for validation)
   */
  static async isNNIUnique(nni: string, excludeId?: string): Promise<boolean> {
    try {
      const existingRecords = await this.searchByNNI(nni);

      if (excludeId) {
        // Filter out the record being edited
        const filteredRecords = existingRecords.filter(
          (record) => record.id !== excludeId,
        );
        return filteredRecords.length === 0;
      }

      return existingRecords.length === 0;
    } catch {
      // If there's an error, assume not unique to be safe
      return false;
    }
  }

  /**
   * Get recent identifications
   */
  static async getRecent(limit: number = 5): Promise<IdentificationRecord[]> {
    const result = await this.getAll({}, { page: 1, limit });
    return result.data;
  }

  /**
   * Bulk operations helper
   */
  static async bulkDelete(ids: string[]): Promise<void> {
    const deletePromises = ids.map((id) => this.delete(id));
    await Promise.all(deletePromises);
  }
}
