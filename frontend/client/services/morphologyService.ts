import {
  MorphologyRecord,
  MorphologyListResponse,
  MorphologyResponse,
  CreateMorphologyInput,
  IdentificationImageResponse,
  MorphologyImageResponse,
  MorphologyFilters,
  MorphologyStats,
  PaginationParams,
} from "@shared/morphology";

class MorphologyService {
  private baseUrl = "/api/morphology";

  async getMorphologies(
    filters: MorphologyFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<MorphologyListResponse> {
    const params = new URLSearchParams();
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    // Add pagination
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch morphologies");
    }
    return response.json();
  }

  async getMorphology(id: string): Promise<MorphologyResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch morphology");
    }
    return response.json();
  }

  async processIdentificationImage(image: File): Promise<IdentificationImageResponse> {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${this.baseUrl}/process-identification`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process identification image");
    }
    return response.json();
  }

  async processMorphologyImage(
    cow_id: string,
    image: File
  ): Promise<MorphologyImageResponse> {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("cow_id", cow_id);

    const response = await fetch(`${this.baseUrl}/process-morphology`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process morphology image");
    }
    return response.json();
  }

  async createMorphology(data: {
    cow_id: string;
    source_detection: string;
    hauteur_au_garrot: { valeur: number; unite: string };
    largeur_du_corps: { valeur: number; unite: string };
    longueur_du_corps: { valeur: number; unite: string };
  }): Promise<MorphologyResponse> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create morphology record");
    }
    return response.json();
  }

  async deleteMorphology(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete morphology");
    }
  }

  async getStats(): Promise<MorphologyStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    if (!response.ok) {
      throw new Error("Failed to fetch morphology stats");
    }
    return response.json();
  }

  async exportData(
    format: "csv" | "json" | "pdf" = "csv",
    filters: MorphologyFilters = {}
  ): Promise<void> {
    const params = new URLSearchParams();
    params.append("format", format);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await fetch(`${this.baseUrl}/export?${params}`);
    if (!response.ok) {
      throw new Error("Failed to export morphology data");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `morphology_export_${new Date().toISOString().split("T")[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Mock data for demonstration
  getMockMorphologies(): MorphologyRecord[] {
    return [
      {
        _id: "morph-1",
        cow_id: "FR1234567890",
        timestamp: new Date().toISOString(),
        source_detection: "Caméra automatique",
        hauteur_au_garrot: { valeur: 125, unite: "cm" },
        largeur_du_corps: { valeur: 58, unite: "cm" },
        longueur_du_corps: { valeur: 145, unite: "cm" },
        createdBy: "Système",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "morph-2",
        cow_id: "FR0987654321",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        source_detection: "Mesure manuelle",
        hauteur_au_garrot: { valeur: 118, unite: "cm" },
        largeur_du_corps: { valeur: 55, unite: "cm" },
        longueur_du_corps: { valeur: 138, unite: "cm" },
        createdBy: "Vétérinaire",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
}

export const morphologyService = new MorphologyService();
