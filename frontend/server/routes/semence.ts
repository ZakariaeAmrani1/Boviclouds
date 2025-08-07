import { RequestHandler } from "express";
import {
  SemenceRecord,
  CreateSemenceInput,
  UpdateSemenceInput,
  SemenceFilters,
  PaginatedResponse,
  SemenceStats,
} from "@shared/semence";
import axios from "axios";
import dayjs from "dayjs";

// Mock data store (in production, this would be a database)
let semenceRecords: SemenceRecord[] = [
  {
    id: "1",
    identificateur: "SEM123456",
    nom_taureau: "Napoleon",
    race_taureau: "Holstein",
    num_taureau: "FR12345678",
    createdBy: "admin",
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-01-10T08:30:00Z",
  },
  {
    id: "2",
    identificateur: "SEM654321",
    nom_taureau: "Caesar",
    race_taureau: "Charolaise",
    num_taureau: "FR87654321",
    createdBy: "admin",
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "3",
    identificateur: "SEM789012",
    nom_taureau: "Hercules",
    race_taureau: "Limousine",
    num_taureau: "FR11223344",
    createdBy: "admin",
    createdAt: "2024-01-20T11:45:00Z",
    updatedAt: "2024-01-20T11:45:00Z",
  },
  {
    id: "4",
    identificateur: "SEM345678",
    nom_taureau: "Apollo",
    race_taureau: "Blonde d'Aquitaine",
    num_taureau: "FR99887766",
    createdBy: "admin",
    createdAt: "2024-01-25T16:10:00Z",
    updatedAt: "2024-01-25T16:10:00Z",
  },
];

let nextId = 5;

// Helper function to apply filters
const applyFilters = (
  records: SemenceRecord[],
  filters: SemenceFilters,
): SemenceRecord[] => {
  return records.filter((record) => {
    if (
      filters.identificateur &&
      !record.identificateur
        .toLowerCase()
        .includes(filters.identificateur.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.nom_taureau &&
      !record.nom_taureau
        .toLowerCase()
        .includes(filters.nom_taureau.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.race_taureau &&
      !record.race_taureau
        .toLowerCase()
        .includes(filters.race_taureau.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.num_taureau &&
      !record.num_taureau
        .toLowerCase()
        .includes(filters.num_taureau.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.createdBy &&
      !record.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())
    ) {
      return false;
    }
    if (filters.dateCreation) {
      const recordDate = new Date(record.createdAt).toISOString().split("T")[0];
      const filterDate = new Date(filters.dateCreation)
        .toISOString()
        .split("T")[0];
      if (recordDate !== filterDate) {
        return false;
      }
    }
    return true;
  });
};

// Helper function to paginate results
const paginate = <T>(
  items: T[],
  page: number,
  limit: number,
): PaginatedResponse<T> => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = items.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
};

// GET /api/semence - Get all semence records with filtering and pagination
export const handleGetSemences: RequestHandler = async (req, res) => {
  semenceRecords = [];
  try {
    // In a real application, you would fetch from the backend API
    // For now, we'll use mock data but keep the structure for future backend integration

    const { token } = req.query;
    const apiUrl = process.env.SERVER_API_URL;
    const response = await axios.get(`${apiUrl}semences`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    semenceRecords = response.data.map((data) => ({
      id: data._id,
      identificateur: data.identificateur,
      nom_taureau: data.nom_taureau,
      race_taureau: data.race_taureau,
      num_taureau: data.num_taureau,
      createdBy: "Administrateur",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters: SemenceFilters = {
      identificateur: req.query.identificateur as string,
      nom_taureau: req.query.nom_taureau as string,
      race_taureau: req.query.race_taureau as string,
      num_taureau: req.query.num_taureau as string,
      createdBy: req.query.createdBy as string,
      dateCreation: req.query.dateCreation as string,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof SemenceFilters] === undefined) {
        delete filters[key as keyof SemenceFilters];
      }
    });

    const filteredRecords = applyFilters(semenceRecords, filters);

    // Sort by creation date (newest first)
    filteredRecords.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const paginatedResult = paginate(filteredRecords, page, limit);

    res.json({
      success: true,
      data: paginatedResult,
    });
  } catch (error) {
    console.error("Error getting semences:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des semences",
    });
  }
};

// GET /api/semence/:id - Get a single semence record
export const handleGetSemence: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const record = semenceRecords.find((r) => r.id === id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Semence non trouvée",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error getting semence:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la semence",
    });
  }
};

// POST /api/semence - Create a new semence record
export const handleCreateSemence: RequestHandler = async (req, res) => {
  try {
    const input: CreateSemenceInput = req.body;

    // Basic validation
    if (
      !input.identificateur ||
      !input.nom_taureau ||
      !input.race_taureau ||
      !input.num_taureau
    ) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être renseignés",
      });
    }

    // Check for duplicate identificateur
    const existingRecordByIdentificateur = semenceRecords.find(
      (r) => r.identificateur === input.identificateur,
    );

    if (existingRecordByIdentificateur) {
      return res.status(400).json({
        success: false,
        message: "Une semence avec cet identificateur existe déjà",
      });
    }

    // Check for duplicate num_taureau
    const existingRecordByNumTaureau = semenceRecords.find(
      (r) => r.num_taureau === input.num_taureau,
    );

    if (existingRecordByNumTaureau) {
      return res.status(400).json({
        success: false,
        message: "Une semence avec ce numéro de taureau existe déjà",
      });
    }

    // Backend API call would be like this:
    const apiUrl = process.env.SERVER_API_URL;
    const response = await axios.post(
      `${apiUrl}semences`,
      {
        identificateur: input.identificateur,
        nom_taureau: input.nom_taureau,
        race_taureau: input.race_taureau,
        num_taureau: input.num_taureau,
      },

      {
        headers: {
          Authorization: `Bearer ${input.token}`,
        },
      },
    );

    // Create new record
    const newRecord: SemenceRecord = {
      id: nextId.toString(),
      ...input,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    semenceRecords.push(newRecord);
    nextId++;

    res.status(201).json({
      success: true,
      data: newRecord,
      message: "Semence créée avec succès",
    });
  } catch (error) {
    console.error("Error creating semence:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la semence",
    });
  }
};

// PUT /api/semence/:id - Update an existing semence record
export const handleUpdateSemence: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const input = req.body;

    const recordIndex = semenceRecords.findIndex((r) => r.id === id);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Semence non trouvée",
      });
    }

    // Check for duplicate identificateur if it's being changed
    if (input.identificateur) {
      const existingRecord = semenceRecords.find(
        (r) => r.id !== id && r.identificateur === input.identificateur,
      );

      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: "Une semence avec cet identificateur existe déjà",
        });
      }
    }

    // Check for duplicate num_taureau if it's being changed
    if (input.num_taureau) {
      const existingRecord = semenceRecords.find(
        (r) => r.id !== id && r.num_taureau === input.num_taureau,
      );

      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: "Une semence avec ce numéro de taureau existe déjà",
        });
      }
    }

    // Backend API call would be like this:
    const apiUrl = process.env.SERVER_API_URL;
    const response = await axios.patch(`${apiUrl}semences/${id}`, input.input, {
      headers: {
        Authorization: `Bearer ${input.token}`,
      },
    });

    // Update record
    const updatedRecord: SemenceRecord = {
      ...semenceRecords[recordIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    semenceRecords[recordIndex] = updatedRecord;

    res.json({
      success: true,
      data: updatedRecord,
      message: "Semence mise à jour avec succès",
    });
  } catch (error) {
    console.error("Error updating semence:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la semence",
    });
  }
};

// DELETE /api/semence/:id - Delete a semence record
export const handleDeleteSemence: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const recordIndex = semenceRecords.findIndex((r) => r.id === id);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Semence non trouvée",
      });
    }

    const { token } = req.query;
    const apiUrl = process.env.SERVER_API_URL;
    const response = await axios.delete(`${apiUrl}semences/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    semenceRecords.splice(recordIndex, 1);

    res.json({
      success: true,
      message: "Semence supprimée avec succès",
    });
  } catch (error) {
    console.error("Error deleting semence:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la semence",
    });
  }
};

// GET /api/semence/stats - Get semence statistics
export const handleGetSemenceStats: RequestHandler = (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate statistics
    const total = semenceRecords.length;

    const thisMonth = semenceRecords.filter((record) => {
      const recordDate = new Date(record.createdAt);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    }).length;

    const thisYear = semenceRecords.filter((record) => {
      const recordDate = new Date(record.createdAt);
      return recordDate.getFullYear() === currentYear;
    }).length;

    // Calculate top races
    const raceCounts = semenceRecords.reduce(
      (acc, record) => {
        acc[record.race_taureau] = (acc[record.race_taureau] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topRaces = Object.entries(raceCounts)
      .map(([race_taureau, count]) => ({ race_taureau, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate top taureaux
    const taureauCounts = semenceRecords.reduce(
      (acc, record) => {
        acc[record.nom_taureau] = (acc[record.nom_taureau] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topTaureaux = Object.entries(taureauCounts)
      .map(([nom_taureau, count]) => ({ nom_taureau, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats: SemenceStats = {
      total,
      thisMonth,
      thisYear,
      topRaces,
      topTaureaux,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting semence stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};

// GET /api/semence/export - Export semence data
export const handleExportSemences: RequestHandler = (req, res) => {
  try {
    const format = (req.query.format as string) || "csv";

    const filters: SemenceFilters = {
      identificateur: req.query.identificateur as string,
      nom_taureau: req.query.nom_taureau as string,
      race_taureau: req.query.race_taureau as string,
      num_taureau: req.query.num_taureau as string,
      createdBy: req.query.createdBy as string,
      dateCreation: req.query.dateCreation as string,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof SemenceFilters] === undefined) {
        delete filters[key as keyof SemenceFilters];
      }
    });

    const filteredRecords = applyFilters(semenceRecords, filters);

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "ID",
        "Identificateur",
        "Nom du Taureau",
        "Race du Taureau",
        "Numéro du Taureau",
        "Créé par",
        "Date Création",
        "Date Modification",
      ];

      const csvContent = [
        headers.join(","),
        ...filteredRecords.map((record) =>
          [
            record.id,
            record.identificateur,
            record.nom_taureau,
            record.race_taureau,
            record.num_taureau,
            record.createdBy,
            record.createdAt,
            record.updatedAt,
          ].join(","),
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=semences.csv");
      res.send(csvContent);
    } else {
      // For Excel format, we'd typically use a library like xlsx
      // For now, return JSON
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=semences.json",
      );
      res.json(filteredRecords);
    }
  } catch (error) {
    console.error("Error exporting semences:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'export des semences",
    });
  }
};
