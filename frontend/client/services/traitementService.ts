import {
  Sujet,
  InseminationRecord,
  LactationRecord,
  TraitementRecord,
  TraitementListResponse,
  CreateSujetRequest,
  CreateInseminationRequest,
  CreateLactationRequest,
  UpdateSujetRequest,
  UpdateInseminationRequest,
  UpdateLactationRequest,
  TraitementStats,
  TraitementFilter,
  TraitementTab,
} from "@shared/traitement";

class TraitementService {
<<<<<<< HEAD
  private baseUrl = "/api/traitement";
=======
  private baseUrl = `${import.meta.env.VITE_API_URL3}/api/traitement`;
>>>>>>> 11504cd228d3bf3db32e434f798117d567599449

  async getRecords(
    page = 1,
    limit = 10,
    tab: TraitementTab = "identification",
    filter?: TraitementFilter,
  ): Promise<TraitementListResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filter) {
      if (filter.search) params.append("search", filter.search);
      if (filter.race) params.append("race", filter.race);
      if (filter.sexe) params.append("sexe", filter.sexe);
      if (filter.type) params.append("type", filter.type);
      if (filter.dateNaissanceFrom)
        params.append("dateNaissanceFrom", filter.dateNaissanceFrom);
      if (filter.dateNaissanceTo)
        params.append("dateNaissanceTo", filter.dateNaissanceTo);
    }

    const response = await fetch(`${this.baseUrl}/sujets?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch sujets");
    }
    return response.json();
  }

  async getRecord(id: string): Promise<TraitementRecord> {
    const response = await fetch(`${this.baseUrl}/records/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch record");
    }
    return response.json();
  }

  async createRecord(
    data:
      | CreateSujetRequest
      | CreateInseminationRequest
      | CreateLactationRequest,
  ): Promise<TraitementRecord> {
    const endpoint = this.getEndpointForTab(data.tabType || "identification");
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create record");
    }
    return response.json();
  }

  async updateRecord(
    id: string,
    data:
      | UpdateSujetRequest
      | UpdateInseminationRequest
      | UpdateLactationRequest,
    tab: TraitementTab,
  ): Promise<TraitementRecord> {
    const endpoint = this.getEndpointForTab(tab);
    const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update record");
    }
    return response.json();
  }

  async deleteRecord(id: string, tab: TraitementTab): Promise<void> {
    const endpoint = this.getEndpointForTab(tab);
    const response = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete record");
    }
  }

  private getEndpointForTab(tab: TraitementTab): string {
    switch (tab) {
      case "identification":
        return "sujets";
      case "insemination":
        return "inseminations";
      case "lactation":
        return "lactations";
      default:
        return "sujets";
    }
  }

  async getTraitementStats(): Promise<TraitementStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    if (!response.ok) {
      throw new Error("Failed to fetch traitement stats");
    }
    return response.json();
  }

  async exportSujetsData(
    format: "csv" | "json" | "pdf" = "csv",
    filter?: TraitementFilter,
  ): Promise<void> {
    const params = new URLSearchParams();
    params.append("format", format);

    if (filter) {
      if (filter.search) params.append("search", filter.search);
      if (filter.race) params.append("race", filter.race);
      if (filter.sexe) params.append("sexe", filter.sexe);
      if (filter.type) params.append("type", filter.type);
      if (filter.dateNaissanceFrom)
        params.append("dateNaissanceFrom", filter.dateNaissanceFrom);
      if (filter.dateNaissanceTo)
        params.append("dateNaissanceTo", filter.dateNaissanceTo);
    }

    const response = await fetch(`${this.baseUrl}/export?${params}`);
    if (!response.ok) {
      throw new Error("Failed to export sujets data");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `traitement_export_${new Date().toISOString().split("T")[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async refreshSujetsList(): Promise<TraitementListResponse> {
    const timestamp = new Date().getTime();
    const response = await fetch(`${this.baseUrl}/sujets?refresh=${timestamp}`);
    if (!response.ok) {
      throw new Error("Failed to refresh sujets");
    }
    return response.json();
  }

  // Mock data for demonstration purposes
  getMockRecords(tab: TraitementTab = "identification"): TraitementRecord[] {
    switch (tab) {
      case "identification":
        return this.getMockIdentifications();
      case "insemination":
        return this.getMockInseminations();
      case "lactation":
        return this.getMockLactations();
      default:
        return this.getMockIdentifications();
    }
  }

  private getMockIdentifications(): Sujet[] {
    return [
      {
        id: "ident-1",
        nniSujet: "FR001234567",
        doc: "Passeport Bovin",
        dateNaissance: "2023-03-15",
        race: "holstein",
        sexe: "female",
        type: "vache",
        tabType: "identification",
        createdBy: "Dr. Martin",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "ident-2",
        nniSujet: "FR001234568",
        doc: "Certificat Naissance",
        dateNaissance: "2023-05-22",
        race: "montbeliarde",
        sexe: "male",
        type: "taureau",
        tabType: "identification",
        createdBy: "Dr. Martin",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
      },
      {
        id: "ident-3",
        nniSujet: "FR001234569",
        doc: "Passeport Bovin",
        dateNaissance: "2024-01-10",
        race: "limousine",
        sexe: "female",
        type: "genisse",
        tabType: "identification",
        createdBy: "Dr. Dubois",
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
      },
    ];
  }

  private getMockInseminations(): InseminationRecord[] {
    return [
      {
        id: "insem-1",
        nniSujet: "FR001234567",
        taureau: "EXCELLENCE-001",
        dateInsemination: "2024-02-15",
        veterinaire: "Dr. Veterinaire A",
        methode: "artificielle",
        statut: "reussi",
        tabType: "insemination",
        createdBy: "Dr. Martin",
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-15"),
      },
      {
        id: "insem-2",
        nniSujet: "FR001234569",
        taureau: "CHAMPION-002",
        dateInsemination: "2024-02-20",
        veterinaire: "Dr. Veterinaire B",
        methode: "artificielle",
        statut: "en_cours",
        tabType: "insemination",
        createdBy: "Dr. Dubois",
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date("2024-02-20"),
      },
      {
        id: "insem-3",
        nniSujet: "FR001234570",
        taureau: "ELITE-003",
        dateInsemination: "2024-02-25",
        veterinaire: "Dr. Veterinaire A",
        methode: "transfert_embryon",
        statut: "en_attente",
        tabType: "insemination",
        createdBy: "Dr. Martin",
        createdAt: new Date("2024-02-25"),
        updatedAt: new Date("2024-02-25"),
      },
    ];
  }

  private getMockLactations(): LactationRecord[] {
    return [
      {
        id: "lact-1",
        nniSujet: "FR001234567",
        dateDemarrage: "2024-01-05",
        productionJournaliere: 28.5,
        qualiteLait: "excellente",
        periode: "pic",
        statut: "active",
        tabType: "lactation",
        createdBy: "Technicien Lait",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-30"),
      },
      {
        id: "lact-2",
        nniSujet: "FR001234571",
        dateDemarrage: "2023-12-10",
        productionJournaliere: 22.3,
        qualiteLait: "bonne",
        periode: "milieu",
        statut: "active",
        tabType: "lactation",
        createdBy: "Technicien Lait",
        createdAt: new Date("2023-12-10"),
        updatedAt: new Date("2024-01-25"),
      },
      {
        id: "lact-3",
        nniSujet: "FR001234572",
        dateDemarrage: "2023-11-20",
        productionJournaliere: 15.8,
        qualiteLait: "moyenne",
        periode: "fin",
        statut: "terminee",
        tabType: "lactation",
        createdBy: "Technicien Lait",
        createdAt: new Date("2023-11-20"),
        updatedAt: new Date("2024-01-15"),
      },
    ];
  }

  getMockTraitementStats(): TraitementStats {
    return {
      total: 9,
      identification: 3,
      insemination: 3,
      lactation: 3,
    };
  }
}

export const traitementService = new TraitementService();
