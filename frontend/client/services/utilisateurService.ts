import {
  UtilisateurRecord,
  CreateUtilisateurInput,
  UpdateUtilisateurInput,
  UtilisateurFilters,
  PaginationParams,
  PaginatedResponse,
  UtilisateurStatus,
  UtilisateurRole,
  getFullName,
} from "@shared/utilisateur";
import axios from "axios";
let UtilisateursData: UtilisateurRecord[] = [];
// Mock data store - this will simulate a database

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
  data: UtilisateurRecord[],
  filters: UtilisateurFilters,
): UtilisateurRecord[] => {
  return data.filter((record) => {
    if (
      filters.nom &&
      !getFullName(record).toLowerCase().includes(filters.nom.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.email &&
      !record.email.toLowerCase().includes(filters.email.toLowerCase())
    ) {
      return false;
    }
    if (filters.role && record.role !== filters.role) {
      return false;
    }
    if (filters.statut && record.statut !== filters.statut) {
      return false;
    }
    if (
      filters.exploitation &&
      !record.exploitation
        ?.toLowerCase()
        .includes(filters.exploitation.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.codeExploitation &&
      !record.codeExploitation
        ?.toLowerCase()
        .includes(filters.codeExploitation.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.ville &&
      !record.ville?.toLowerCase().includes(filters.ville.toLowerCase())
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

export class UtilisateurService {
  /**
   * Get all utilisateur records with optional filtering and pagination
   */
  static async getAll(
    filters: UtilisateurFilters = {},
    pagination: PaginationParams = { page: 1, limit: 10 },
  ): Promise<PaginatedResponse<UtilisateurRecord>> {
    const apiUrl = import.meta.env.VITE_API_URL;
    UtilisateursData = [];

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${apiUrl}users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      response.data.map((user) => {
        UtilisateursData.push({
          id: user._id,
          prenom: user.prenom_lat,
          nom: user.nom_lat,
          email: user.email,
          password: user.passwordHash,
          telephone: "0666666666",
          role:
            user.role[0] === "INSEMINATEUR"
              ? UtilisateurRole.INSEMINATEUR
              : user.role[0] === "ELEVEUR"
                ? UtilisateurRole.ELEVEUR
                : user.role[0] === "CONTROLEUR_LAITIER"
                  ? UtilisateurRole.CONTROLEUR
                  : UtilisateurRole.IDENTIFICATEUR,
          statut:
            user.statut === "APPROVED"
              ? UtilisateurStatus.ACTIF
              : user.statut === "PENDING"
                ? UtilisateurStatus.EN_ATTENTE
                : UtilisateurStatus.SUSPENDU,
          civilite: user.civilite,
          adresse: user.adresse,
          region: user.region,
          codePostal: "69002",
          dateCreation: user.date_creation,
          dateModification: user.date_modification,
        });
      });
    } catch (error) {
      console.error("Error getting inseminations:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const filteredData = applyFilters(UtilisateursData, filters);
    const paginatedResult = applyPagination(filteredData, pagination);

    return paginatedResult;
  }

  /**
   * Get a single utilisateur record by ID
   */
  static async getById(id: string): Promise<UtilisateurRecord | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const record = UtilisateursData.find((u) => u.id === id);
    return record || null;
  }

  /**
   * Create a new utilisateur record
   */
  static async create(
    input: CreateUtilisateurInput,
  ): Promise<UtilisateurRecord> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check if email already exists
    const existingUser = UtilisateursData.find(
      (u) => u.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    const now = new Date().toISOString();
    const newRecord: UtilisateurRecord = {
      id: generateId(),
      prenom: input.prenom,
      nom: input.nom,
      password: input.password,
      email: input.email,
      telephone: input.telephone,
      role: input.role,
      statut: input.statut || UtilisateurStatus.EN_ATTENTE,
      exploitation: input.exploitation,
      codeExploitation: input.codeExploitation,
      adresse: input.adresse,
      ville: input.ville,
      codePostal: input.codePostal,
      dateCreation: now,
      dateModification: now,
      notes: input.notes,
    };

    UtilisateursData.unshift(newRecord);
    return newRecord;
  }

  /**
   * Update an existing utilisateur record
   */
  static async update(
    id: string,
    input: UpdateUtilisateurInput,
  ): Promise<UtilisateurRecord | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    const recordIndex = UtilisateursData.findIndex((u) => u.id === id);
    if (recordIndex === -1) {
      return null;
    }

    // Check if email already exists (if changing email)
    if (input.email) {
      const existingUser = UtilisateursData.find(
        (u) =>
          u.email.toLowerCase() === input.email.toLowerCase() && u.id !== id,
      );
      if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà");
      }
    }

    const existingRecord = UtilisateursData[recordIndex];
    const updatedRecord: UtilisateurRecord = {
      ...existingRecord,
      ...input,
      dateModification: new Date().toISOString(),
    };

    UtilisateursData[recordIndex] = updatedRecord;
    return updatedRecord;
  }

  /**
   * Delete a utilisateur record
   */
  static async delete(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const initialLength = UtilisateursData.length;
    UtilisateursData = UtilisateursData.filter((u) => u.id !== id);
    return UtilisateursData.length < initialLength;
  }

  /**
   * Get statistics about utilisateur records
   */
  static async getStats(): Promise<{
    total: number;
    actif: number;
    inactif: number;
    enAttente: number;
    suspendu: number;
    byRole: Record<UtilisateurRole, number>;
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const total = UtilisateursData.length;
    const actif = UtilisateursData.filter(
      (u) => u.statut === UtilisateurStatus.ACTIF,
    ).length;
    const inactif = UtilisateursData.filter(
      (u) => u.statut === UtilisateurStatus.INACTIF,
    ).length;
    const enAttente = UtilisateursData.filter(
      (u) => u.statut === UtilisateurStatus.EN_ATTENTE,
    ).length;
    const suspendu = UtilisateursData.filter(
      (u) => u.statut === UtilisateurStatus.SUSPENDU,
    ).length;

    const byRole: Record<UtilisateurRole, number> = {
      [UtilisateurRole.ADMINISTRATEUR]: 0,
      [UtilisateurRole.INSEMINATEUR]: 0,
      [UtilisateurRole.IDENTIFICATEUR]: 0,
      [UtilisateurRole.ELEVEUR]: 0,
      [UtilisateurRole.CONTROLEUR]: 0,
      [UtilisateurRole.SUPPORT]: 0,
    };

    UtilisateursData.forEach((user) => {
      byRole[user.role]++;
    });

    return { total, actif, inactif, enAttente, suspendu, byRole };
  }

  /**
   * Export utilisateur data
   */
  static async export(
    filters: UtilisateurFilters = {},
    format: "csv" | "excel" = "csv",
  ): Promise<Blob> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const filteredData = applyFilters(UtilisateursData, filters);

    if (format === "csv") {
      const headers = [
        "ID",
        "Prénom",
        "Nom",
        "Email",
        "Téléphone",
        "Rôle",
        "Statut",
        "Exploitation",
        "Code Exploitation",
        "Ville",
        "Date Création",
        "Dernière Connexion",
      ];

      const csvContent = [
        headers.join(","),
        ...filteredData.map((record) =>
          [
            record.id,
            record.prenom,
            record.nom,
            record.email,
            record.telephone || "",
            record.role,
            record.statut,
            record.exploitation || "",
            record.codeExploitation || "",
            record.ville || "",
            formatDateToFrench(record.dateCreation),
            record.dernierConnexion
              ? formatDateToFrench(record.dernierConnexion)
              : "",
          ].join(","),
        ),
      ].join("\n");

      return new Blob([csvContent], { type: "text/csv" });
    }

    // For Excel format, we would normally generate an actual Excel file
    // For now, we'll return a CSV with Excel MIME type
    const headers = [
      "ID",
      "Prénom",
      "Nom",
      "Email",
      "Téléphone",
      "Rôle",
      "Statut",
      "Exploitation",
      "Code Exploitation",
      "Ville",
      "Date Création",
      "Dernière Connexion",
    ];

    const csvContent = [
      headers.join("\t"),
      ...filteredData.map((record) =>
        [
          record.id,
          record.prenom,
          record.nom,
          record.email,
          record.telephone || "",
          record.role,
          record.statut,
          record.exploitation || "",
          record.codeExploitation || "",
          record.ville || "",
          formatDateToFrench(record.dateCreation),
          record.dernierConnexion
            ? formatDateToFrench(record.dernierConnexion)
            : "",
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
