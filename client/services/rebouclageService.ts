import {
  RebouclageRecord,
  CreateRebouclageInput,
  UpdateRebouclageInput,
  RebouclageFilters,
  PaginationParams,
  PaginatedResponse,
  RebouclageStatus,
} from "@shared/rebouclage";

// Mock data store - this will simulate a database
let mockRebouclageData: RebouclageRecord[] = [
  {
    id: "1",
    ancienNNI: "FR2541963478",
    nouveauNNI: "FR2541963501",
    dateRebouclage: "2024-03-15T10:30:00",
    creePar: "Jean Dupont",
    statut: RebouclageStatus.ACTIF,
    dateCreation: "2024-03-15T10:30:00",
    dateModification: "2024-03-15T10:30:00",
    codeExploitation: "EXP001",
    notes: "Rebouclage effectué suite à changement d'exploitant",
  },
  {
    id: "2",
    ancienNNI: "FR2541963479",
    nouveauNNI: "FR2541963502",
    dateRebouclage: "2024-03-14T14:15:00",
    creePar: "Marie Martin",
    statut: RebouclageStatus.EN_ATTENTE,
    dateCreation: "2024-03-14T14:15:00",
    dateModification: "2024-03-14T14:15:00",
    codeExploitation: "EXP002",
    notes: "En attente de validation administrative",
  },
  {
    id: "3",
    ancienNNI: "FR2541963480",
    nouveauNNI: "FR2541963503",
    dateRebouclage: "2024-03-13T09:45:00",
    creePar: "Pierre Durand",
    statut: RebouclageStatus.ACTIF,
    dateCreation: "2024-03-13T09:45:00",
    dateModification: "2024-03-13T09:45:00",
    codeExploitation: "EXP003",
  },
  {
    id: "4",
    ancienNNI: "FR2541963481",
    nouveauNNI: "FR2541963504",
    dateRebouclage: "2024-03-12T16:20:00",
    creePar: "Sophie Bernard",
    statut: RebouclageStatus.ANNULE,
    dateCreation: "2024-03-12T16:20:00",
    dateModification: "2024-03-12T18:30:00",
    codeExploitation: "EXP004",
    notes: "Annulé - erreur dans les données",
  },
  {
    id: "5",
    ancienNNI: "FR2541963482",
    nouveauNNI: "FR2541963505",
    dateRebouclage: "2024-03-11T11:10:00",
    creePar: "Michel Robert",
    statut: RebouclageStatus.ACTIF,
    dateCreation: "2024-03-11T11:10:00",
    dateModification: "2024-03-11T11:10:00",
    codeExploitation: "EXP005",
  },
  {
    id: "6",
    ancienNNI: "FR2541963483",
    nouveauNNI: "FR2541963506",
    dateRebouclage: "2024-03-10T08:30:00",
    creePar: "Anne Dubois",
    statut: RebouclageStatus.ACTIF,
    dateCreation: "2024-03-10T08:30:00",
    dateModification: "2024-03-10T08:30:00",
    codeExploitation: "EXP006",
    notes: "Rebouclage automatique",
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
      filters.codeExploitation &&
      !record.codeExploitation
        ?.toLowerCase()
        .includes(filters.codeExploitation.toLowerCase())
    ) {
      return false;
    }
    if (filters.statut && record.statut !== filters.statut) {
      return false;
    }
    if (
      filters.creePar &&
      !record.creePar.toLowerCase().includes(filters.creePar.toLowerCase())
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const filteredData = applyFilters(mockRebouclageData, filters);
    const paginatedResult = applyPagination(filteredData, pagination);

    return paginatedResult;
  }

  /**
   * Get a single rebouclage record by ID
   */
  static async getById(id: string): Promise<RebouclageRecord | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const record = mockRebouclageData.find((r) => r.id === id);
    return record || null;
  }

  /**
   * Create a new rebouclage record
   */
  static async create(input: CreateRebouclageInput): Promise<RebouclageRecord> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const now = new Date().toISOString();
    const newRecord: RebouclageRecord = {
      id: generateId(),
      ancienNNI: input.ancienNNI,
      nouveauNNI: input.nouveauNNI,
      dateRebouclage: input.dateRebouclage || now,
      creePar: input.creePar,
      statut: input.statut || RebouclageStatus.EN_ATTENTE,
      dateCreation: now,
      dateModification: now,
      notes: input.notes,
      codeExploitation: input.codeExploitation,
    };

    mockRebouclageData.unshift(newRecord);
    return newRecord;
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

    const recordIndex = mockRebouclageData.findIndex((r) => r.id === id);
    if (recordIndex === -1) {
      return null;
    }

    const existingRecord = mockRebouclageData[recordIndex];
    const updatedRecord: RebouclageRecord = {
      ...existingRecord,
      ...input,
      dateModification: new Date().toISOString(),
    };

    mockRebouclageData[recordIndex] = updatedRecord;
    return updatedRecord;
  }

  /**
   * Delete a rebouclage record
   */
  static async delete(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const initialLength = mockRebouclageData.length;
    mockRebouclageData = mockRebouclageData.filter((r) => r.id !== id);
    return mockRebouclageData.length < initialLength;
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

    const total = mockRebouclageData.length;
    const actif = mockRebouclageData.filter(
      (r) => r.statut === RebouclageStatus.ACTIF,
    ).length;
    const enAttente = mockRebouclageData.filter(
      (r) => r.statut === RebouclageStatus.EN_ATTENTE,
    ).length;
    const annule = mockRebouclageData.filter(
      (r) => r.statut === RebouclageStatus.ANNULE,
    ).length;

    return { total, actif, enAttente, annule };
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

    const filteredData = applyFilters(mockRebouclageData, filters);

    if (format === "csv") {
      const headers = [
        "ID",
        "Ancien NNI",
        "Nouveau NNI",
        "Date Rebouclage",
        "Créé par",
        "Statut",
        "Code Exploitation",
        "Notes",
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
            record.creePar,
            record.statut,
            record.codeExploitation || "",
            record.notes || "",
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
      "Créé par",
      "Statut",
      "Code Exploitation",
      "Notes",
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
          record.creePar,
          record.statut,
          record.codeExploitation || "",
          record.notes || "",
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
  static resetMockData(): void {
    mockRebouclageData = [
      {
        id: "1",
        ancienNNI: "FR2541963478",
        nouveauNNI: "FR2541963501",
        dateRebouclage: "2024-03-15T10:30:00",
        creePar: "Jean Dupont",
        statut: RebouclageStatus.ACTIF,
        dateCreation: "2024-03-15T10:30:00",
        dateModification: "2024-03-15T10:30:00",
        codeExploitation: "EXP001",
        notes: "Rebouclage effectué suite à changement d'exploitant",
      },
      {
        id: "2",
        ancienNNI: "FR2541963479",
        nouveauNNI: "FR2541963502",
        dateRebouclage: "2024-03-14T14:15:00",
        creePar: "Marie Martin",
        statut: RebouclageStatus.EN_ATTENTE,
        dateCreation: "2024-03-14T14:15:00",
        dateModification: "2024-03-14T14:15:00",
        codeExploitation: "EXP002",
        notes: "En attente de validation administrative",
      },
      {
        id: "3",
        ancienNNI: "FR2541963480",
        nouveauNNI: "FR2541963503",
        dateRebouclage: "2024-03-13T09:45:00",
        creePar: "Pierre Durand",
        statut: RebouclageStatus.ACTIF,
        dateCreation: "2024-03-13T09:45:00",
        dateModification: "2024-03-13T09:45:00",
        codeExploitation: "EXP003",
      },
      {
        id: "4",
        ancienNNI: "FR2541963481",
        nouveauNNI: "FR2541963504",
        dateRebouclage: "2024-03-12T16:20:00",
        creePar: "Sophie Bernard",
        statut: RebouclageStatus.ANNULE,
        dateCreation: "2024-03-12T16:20:00",
        dateModification: "2024-03-12T18:30:00",
        codeExploitation: "EXP004",
        notes: "Annulé - erreur dans les données",
      },
      {
        id: "5",
        ancienNNI: "FR2541963482",
        nouveauNNI: "FR2541963505",
        dateRebouclage: "2024-03-11T11:10:00",
        creePar: "Michel Robert",
        statut: RebouclageStatus.ACTIF,
        dateCreation: "2024-03-11T11:10:00",
        dateModification: "2024-03-11T11:10:00",
        codeExploitation: "EXP005",
      },
      {
        id: "6",
        ancienNNI: "FR2541963483",
        nouveauNNI: "FR2541963506",
        dateRebouclage: "2024-03-10T08:30:00",
        creePar: "Anne Dubois",
        statut: RebouclageStatus.ACTIF,
        dateCreation: "2024-03-10T08:30:00",
        dateModification: "2024-03-10T08:30:00",
        codeExploitation: "EXP006",
        notes: "Rebouclage automatique",
      },
    ];
  }
}
