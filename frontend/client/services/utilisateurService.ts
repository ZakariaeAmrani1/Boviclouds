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

// Mock data store - this will simulate a database
let mockUtilisateurData: UtilisateurRecord[] = [
  {
    id: "1",
    prenom: "Sophie",
    nom: "Leroy",
    email: "sophie.leroy@boviclouds.com",
    telephone: "0602030405",
    role: UtilisateurRole.ADMINISTRATEUR,
    statut: UtilisateurStatus.ACTIF,
    exploitation: "Administration Boviclouds",
    codeExploitation: "ADM001",
    adresse: "15 Avenue des Champs",
    ville: "Paris",
    codePostal: "75008",
    dateCreation: "2024-01-15T09:00:00",
    dateModification: "2024-03-10T14:30:00",
    dernierConnexion: "2024-03-15T08:45:00",
    notes: "Administrateur principal du système",
  },
  {
    id: "2",
    prenom: "Michel",
    nom: "Robert",
    email: "michel.robert@boviclouds.com",
    telephone: "0607080910",
    role: UtilisateurRole.GESTIONNAIRE,
    statut: UtilisateurStatus.ACTIF,
    exploitation: "Gestion Centrale",
    codeExploitation: "GES001",
    adresse: "42 Rue de la Paix",
    ville: "Lyon",
    codePostal: "69002",
    dateCreation: "2024-01-20T10:15:00",
    dateModification: "2024-03-08T16:20:00",
    dernierConnexion: "2024-03-14T19:30:00",
    notes: "Gestionnaire des opérations quotidiennes",
  },
  {
    id: "3",
    prenom: "Claire",
    nom: "Dubois",
    email: "dr.claire.dubois@vetclinic.fr",
    telephone: "0612345678",
    role: UtilisateurRole.VETERINAIRE,
    statut: UtilisateurStatus.ACTIF,
    exploitation: "Clinique Vétérinaire du Centre",
    codeExploitation: "VET001",
    adresse: "8 Place de la République",
    ville: "Toulouse",
    codePostal: "31000",
    dateCreation: "2024-02-01T11:00:00",
    dateModification: "2024-03-05T13:45:00",
    dernierConnexion: "2024-03-13T10:15:00",
    notes: "Vétérinaire spécialisée en bovins",
  },
  {
    id: "4",
    prenom: "Jean",
    nom: "Dupont",
    email: "jean.dupont@fermedespres.fr",
    telephone: "0623456789",
    role: UtilisateurRole.ELEVEUR,
    statut: UtilisateurStatus.ACTIF,
    exploitation: "Ferme des Prés",
    codeExploitation: "EXP001",
    adresse: "Route de la Ferme",
    ville: "Normandie",
    codePostal: "14000",
    dateCreation: "2024-02-10T14:30:00",
    dateModification: "2024-03-01T09:20:00",
    dernierConnexion: "2024-03-12T07:00:00",
    notes: "Éleveur de bovins laitiers - 150 têtes",
  },
  {
    id: "5",
    prenom: "Marie",
    nom: "Martin",
    email: "marie.martin@ranchmartin.fr",
    telephone: "0634567890",
    role: UtilisateurRole.ELEVEUR,
    statut: UtilisateurStatus.ACTIF,
    exploitation: "Ranch Martin",
    codeExploitation: "EXP002",
    adresse: "Chemin du Ranch",
    ville: "Bordeaux",
    codePostal: "33000",
    dateCreation: "2024-02-15T08:45:00",
    dateModification: "2024-02-28T15:10:00",
    dernierConnexion: "2024-03-11T18:30:00",
    notes: "Élevage mixte bovins/ovins",
  },
  {
    id: "6",
    prenom: "Pierre",
    nom: "Legrand",
    email: "pierre.legrand@domainelegrand.fr",
    telephone: "0645678901",
    role: UtilisateurRole.ELEVEUR,
    statut: UtilisateurStatus.INACTIF,
    exploitation: "Domaine Legrand",
    codeExploitation: "EXP003",
    adresse: "Domaine de la Vallée",
    ville: "Strasbourg",
    codePostal: "67000",
    dateCreation: "2024-01-25T12:00:00",
    dateModification: "2024-03-01T10:00:00",
    dernierConnexion: "2024-02-20T16:45:00",
    notes: "Compte temporairement désactivé - migration système",
  },
  {
    id: "7",
    prenom: "Anne",
    nom: "Petit",
    email: "anne.petit@boviclouds.com",
    telephone: "0656789012",
    role: UtilisateurRole.CONSULTANT,
    statut: UtilisateurStatus.ACTIF,
    exploitation: "Consulting Agricole",
    codeExploitation: "CON001",
    adresse: "25 Boulevard des Experts",
    ville: "Nantes",
    codePostal: "44000",
    dateCreation: "2024-02-20T16:15:00",
    dateModification: "2024-03-07T11:30:00",
    dernierConnexion: "2024-03-10T14:20:00",
    notes: "Consultante en optimisation d'élevage",
  },
  {
    id: "8",
    prenom: "Thomas",
    nom: "Moreau",
    email: "thomas.moreau@support.boviclouds.com",
    telephone: "0667890123",
    role: UtilisateurRole.SUPPORT,
    statut: UtilisateurStatus.EN_ATTENTE,
    exploitation: "Support Technique",
    codeExploitation: "SUP001",
    adresse: "10 Rue du Support",
    ville: "Lille",
    codePostal: "59000",
    dateCreation: "2024-03-01T09:30:00",
    dateModification: "2024-03-01T09:30:00",
    notes: "Nouveau membre de l'équipe support - en formation",
  },
];

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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const filteredData = applyFilters(mockUtilisateurData, filters);
    const paginatedResult = applyPagination(filteredData, pagination);

    return paginatedResult;
  }

  /**
   * Get a single utilisateur record by ID
   */
  static async getById(id: string): Promise<UtilisateurRecord | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const record = mockUtilisateurData.find((u) => u.id === id);
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
    const existingUser = mockUtilisateurData.find(
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

    mockUtilisateurData.unshift(newRecord);
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

    const recordIndex = mockUtilisateurData.findIndex((u) => u.id === id);
    if (recordIndex === -1) {
      return null;
    }

    // Check if email already exists (if changing email)
    if (input.email) {
      const existingUser = mockUtilisateurData.find(
        (u) =>
          u.email.toLowerCase() === input.email.toLowerCase() && u.id !== id,
      );
      if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà");
      }
    }

    const existingRecord = mockUtilisateurData[recordIndex];
    const updatedRecord: UtilisateurRecord = {
      ...existingRecord,
      ...input,
      dateModification: new Date().toISOString(),
    };

    mockUtilisateurData[recordIndex] = updatedRecord;
    return updatedRecord;
  }

  /**
   * Delete a utilisateur record
   */
  static async delete(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const initialLength = mockUtilisateurData.length;
    mockUtilisateurData = mockUtilisateurData.filter((u) => u.id !== id);
    return mockUtilisateurData.length < initialLength;
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

    const total = mockUtilisateurData.length;
    const actif = mockUtilisateurData.filter(
      (u) => u.statut === UtilisateurStatus.ACTIF,
    ).length;
    const inactif = mockUtilisateurData.filter(
      (u) => u.statut === UtilisateurStatus.INACTIF,
    ).length;
    const enAttente = mockUtilisateurData.filter(
      (u) => u.statut === UtilisateurStatus.EN_ATTENTE,
    ).length;
    const suspendu = mockUtilisateurData.filter(
      (u) => u.statut === UtilisateurStatus.SUSPENDU,
    ).length;

    const byRole: Record<UtilisateurRole, number> = {
      [UtilisateurRole.ADMINISTRATEUR]: 0,
      [UtilisateurRole.GESTIONNAIRE]: 0,
      [UtilisateurRole.VETERINAIRE]: 0,
      [UtilisateurRole.ELEVEUR]: 0,
      [UtilisateurRole.CONSULTANT]: 0,
      [UtilisateurRole.SUPPORT]: 0,
    };

    mockUtilisateurData.forEach((user) => {
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

    const filteredData = applyFilters(mockUtilisateurData, filters);

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
  static resetMockData(): void {
    mockUtilisateurData = [
      {
        id: "1",
        prenom: "Sophie",
        nom: "Leroy",
        email: "sophie.leroy@boviclouds.com",
        telephone: "0602030405",
        role: UtilisateurRole.ADMINISTRATEUR,
        statut: UtilisateurStatus.ACTIF,
        exploitation: "Administration Boviclouds",
        codeExploitation: "ADM001",
        adresse: "15 Avenue des Champs",
        ville: "Paris",
        codePostal: "75008",
        dateCreation: "2024-01-15T09:00:00",
        dateModification: "2024-03-10T14:30:00",
        dernierConnexion: "2024-03-15T08:45:00",
        notes: "Administrateur principal du système",
      },
      {
        id: "2",
        prenom: "Michel",
        nom: "Robert",
        email: "michel.robert@boviclouds.com",
        telephone: "0607080910",
        role: UtilisateurRole.GESTIONNAIRE,
        statut: UtilisateurStatus.ACTIF,
        exploitation: "Gestion Centrale",
        codeExploitation: "GES001",
        adresse: "42 Rue de la Paix",
        ville: "Lyon",
        codePostal: "69002",
        dateCreation: "2024-01-20T10:15:00",
        dateModification: "2024-03-08T16:20:00",
        dernierConnexion: "2024-03-14T19:30:00",
        notes: "Gestionnaire des opérations quotidiennes",
      },
      {
        id: "3",
        prenom: "Claire",
        nom: "Dubois",
        email: "dr.claire.dubois@vetclinic.fr",
        telephone: "0612345678",
        role: UtilisateurRole.VETERINAIRE,
        statut: UtilisateurStatus.ACTIF,
        exploitation: "Clinique Vétérinaire du Centre",
        codeExploitation: "VET001",
        adresse: "8 Place de la République",
        ville: "Toulouse",
        codePostal: "31000",
        dateCreation: "2024-02-01T11:00:00",
        dateModification: "2024-03-05T13:45:00",
        dernierConnexion: "2024-03-13T10:15:00",
        notes: "Vétérinaire spécialisée en bovins",
      },
      {
        id: "4",
        prenom: "Jean",
        nom: "Dupont",
        email: "jean.dupont@fermedespres.fr",
        telephone: "0623456789",
        role: UtilisateurRole.ELEVEUR,
        statut: UtilisateurStatus.ACTIF,
        exploitation: "Ferme des Prés",
        codeExploitation: "EXP001",
        adresse: "Route de la Ferme",
        ville: "Normandie",
        codePostal: "14000",
        dateCreation: "2024-02-10T14:30:00",
        dateModification: "2024-03-01T09:20:00",
        dernierConnexion: "2024-03-12T07:00:00",
        notes: "Éleveur de bovins laitiers - 150 têtes",
      },
      {
        id: "5",
        prenom: "Marie",
        nom: "Martin",
        email: "marie.martin@ranchmartin.fr",
        telephone: "0634567890",
        role: UtilisateurRole.ELEVEUR,
        statut: UtilisateurStatus.ACTIF,
        exploitation: "Ranch Martin",
        codeExploitation: "EXP002",
        adresse: "Chemin du Ranch",
        ville: "Bordeaux",
        codePostal: "33000",
        dateCreation: "2024-02-15T08:45:00",
        dateModification: "2024-02-28T15:10:00",
        dernierConnexion: "2024-03-11T18:30:00",
        notes: "Élevage mixte bovins/ovins",
      },
      {
        id: "6",
        prenom: "Pierre",
        nom: "Legrand",
        email: "pierre.legrand@domainelegrand.fr",
        telephone: "0645678901",
        role: UtilisateurRole.ELEVEUR,
        statut: UtilisateurStatus.INACTIF,
        exploitation: "Domaine Legrand",
        codeExploitation: "EXP003",
        adresse: "Domaine de la Vallée",
        ville: "Strasbourg",
        codePostal: "67000",
        dateCreation: "2024-01-25T12:00:00",
        dateModification: "2024-03-01T10:00:00",
        dernierConnexion: "2024-02-20T16:45:00",
        notes: "Compte temporairement désactivé - migration système",
      },
      {
        id: "7",
        prenom: "Anne",
        nom: "Petit",
        email: "anne.petit@boviclouds.com",
        telephone: "0656789012",
        role: UtilisateurRole.CONSULTANT,
        statut: UtilisateurStatus.ACTIF,
        exploitation: "Consulting Agricole",
        codeExploitation: "CON001",
        adresse: "25 Boulevard des Experts",
        ville: "Nantes",
        codePostal: "44000",
        dateCreation: "2024-02-20T16:15:00",
        dateModification: "2024-03-07T11:30:00",
        dernierConnexion: "2024-03-10T14:20:00",
        notes: "Consultante en optimisation d'élevage",
      },
      {
        id: "8",
        prenom: "Thomas",
        nom: "Moreau",
        email: "thomas.moreau@support.boviclouds.com",
        telephone: "0667890123",
        role: UtilisateurRole.SUPPORT,
        statut: UtilisateurStatus.EN_ATTENTE,
        exploitation: "Support Technique",
        codeExploitation: "SUP001",
        adresse: "10 Rue du Support",
        ville: "Lille",
        codePostal: "59000",
        dateCreation: "2024-03-01T09:30:00",
        dateModification: "2024-03-01T09:30:00",
        notes: "Nouveau membre de l'équipe support - en formation",
      },
    ];
  }
}
