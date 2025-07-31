import { RequestHandler } from "express";
import {
  InseminationRecord,
  CreateInseminationInput,
  UpdateInseminationInput,
  InseminationFilters,
  PaginatedResponse,
  InseminationStats,
} from "@shared/insemination";
import axios from "axios";
import dayjs from "dayjs";

// Mock data store (in production, this would be a database)
let inseminationRecords: InseminationRecord[] = [
  {
    id: "1",
    nni: "FR1234567890",
    date_dissemination: "2024-01-15",
    semence_id: "SEM123456",
    inseminateur_id: "user1",
    responsable_local_id: "user2",
    createdBy: "admin",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    nni: "FR9876543210",
    date_dissemination: "2024-01-20",
    semence_id: "SEM654321",
    inseminateur_id: "user3",
    responsable_local_id: "user2",
    createdBy: "admin",
    createdAt: "2024-01-20T14:15:00Z",
    updatedAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    nni: "FR5555666677",
    date_dissemination: "2024-02-01",
    semence_id: "SEM789012",
    inseminateur_id: "user1",
    responsable_local_id: "user4",
    createdBy: "admin",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-01T09:00:00Z",
  },
];

let nextId = 4;

// Helper function to apply filters
const applyFilters = (
  records: InseminationRecord[],
  filters: InseminationFilters,
): InseminationRecord[] => {
  return records.filter((record) => {
    if (
      filters.nni &&
      !record.nni.toLowerCase().includes(filters.nni.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.semence_id &&
      !record.semence_id
        .toLowerCase()
        .includes(filters.semence_id.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.inseminateur_id &&
      record.inseminateur_id !== filters.inseminateur_id
    ) {
      return false;
    }
    if (
      filters.responsable_local_id &&
      record.responsable_local_id !== filters.responsable_local_id
    ) {
      return false;
    }
    if (filters.date_dissemination) {
      const recordDate = new Date(record.date_dissemination)
        .toISOString()
        .split("T")[0];
      const filterDate = new Date(filters.date_dissemination)
        .toISOString()
        .split("T")[0];
      if (recordDate !== filterDate) {
        return false;
      }
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

// GET /api/insemination - Get all insemination records with filtering and pagination
export const handleGetInseminations: RequestHandler = async (req, res) => {
  inseminationRecords = [];
  const apiUrl = process.env.SERVER_API_URL;
  try {
    const response = await axios.get(`${apiUrl}inseminations`);

    response.data.map((data) => {
      inseminationRecords.push({
        id: data._id,
        nni: data.nni,
        date_dissemination: dayjs(data.date_dissemination).format("YYYY-MM-DD"),
        semence_id: data.semence_id.identificateur,
        inseminateur_id: data.inseminateur_id._id,
        responsable_local_id: data.responsable_local_id._id,
        createdBy:
          data.inseminateur_id.nom_lat + " " + data.inseminateur_id.prenom_lat,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filters: InseminationFilters = {
      nni: req.query.nni as string,
      semence_id: req.query.semence_id as string,
      inseminateur_id: req.query.inseminateur_id as string,
      responsable_local_id: req.query.responsable_local_id as string,
      date_dissemination: req.query.date_dissemination as string,
      createdBy: req.query.createdBy as string,
      dateCreation: req.query.dateCreation as string,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof InseminationFilters] === undefined) {
        delete filters[key as keyof InseminationFilters];
      }
    });

    const filteredRecords = applyFilters(inseminationRecords, filters);

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
    console.error("Error getting inseminations:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des inséminations",
    });
  }
};

// GET /api/insemination/:id - Get a single insemination record
export const handleGetInsemination: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const record = inseminationRecords.find((r) => r.id === id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Insémination non trouvée",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error getting insemination:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'insémination",
    });
  }
};

// POST /api/insemination - Create a new insemination record
export const handleCreateInsemination: RequestHandler = async (req, res) => {
  try {
    const input: CreateInseminationInput = req.body;

    // Basic validation
    if (
      !input.nni ||
      !input.date_dissemination ||
      !input.semence_id ||
      !input.inseminateur_id ||
      !input.responsable_local_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être renseignés",
      });
    }

    // Check for duplicate (same NNI on same date)
    const existingRecord = inseminationRecords.find(
      (r) =>
        r.nni === input.nni &&
        r.date_dissemination === input.date_dissemination,
    );

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: "Une insémination existe déjà pour ce NNI à cette date",
      });
    }

    const apiUrl = process.env.SERVER_API_URL;
    const response = await axios.post(`${apiUrl}inseminations`, {
      nni: input.nni,
      date_dissemination: `${input.date_dissemination}T10:00:00Z`,
      semence_id: input.semence_id,
      inseminateur_id: input.inseminateur_id,
      responsable_local_id: input.responsable_local_id,
    });
    // Create new record
    const newRecord: InseminationRecord = {
      id: nextId.toString(),
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inseminationRecords.push(newRecord);
    nextId++;

    res.status(201).json({
      success: true,
      data: newRecord,
      message: "Insémination créée avec succès",
    });
  } catch (error) {
    console.log("Error creating insemination:", error.response);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'insémination",
    });
  }
};

// PUT /api/insemination/:id - Update an existing insemination record
export const handleUpdateInsemination: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const input: UpdateInseminationInput = req.body;

    const recordIndex = inseminationRecords.findIndex((r) => r.id === id);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Insémination non trouvée",
      });
    }

    // Check for duplicate if NNI or date is being changed
    if (input.nni || input.date_dissemination) {
      const newNNI = input.nni || inseminationRecords[recordIndex].nni;
      const newDate =
        input.date_dissemination ||
        inseminationRecords[recordIndex].date_dissemination;

      const existingRecord = inseminationRecords.find(
        (r) =>
          r.id !== id && r.nni === newNNI && r.date_dissemination === newDate,
      );

      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: "Une insémination existe déjà pour ce NNI à cette date",
        });
      }
    }

    // Update record
    const updatedRecord: InseminationRecord = {
      ...inseminationRecords[recordIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const apiUrl = process.env.SERVER_API_URL;
    const response = await axios.patch(`${apiUrl}inseminations/${id}`, {
      nni: updatedRecord.nni,
      date_dissemination: updatedRecord.date_dissemination,
      semence_id: updatedRecord.semence_id,
      inseminateur_id: updatedRecord.inseminateur_id,
      responsable_local_id: updatedRecord.responsable_local_id,
    });

    inseminationRecords[recordIndex] = updatedRecord;

    res.json({
      success: true,
      data: updatedRecord,
      message: "Insémination mise à jour avec succès",
    });
  } catch (error) {
    console.error("Error updating insemination:", error.response.data.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'insémination",
    });
  }
};

// DELETE /api/insemination/:id - Delete an insemination record
export const handleDeleteInsemination: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const recordIndex = inseminationRecords.findIndex((r) => r.id === id);
    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Insémination non trouvée",
      });
    }

    const apiUrl = process.env.SERVER_API_URL;
    const response = await axios.delete(`${apiUrl}inseminations/${id}`);

    inseminationRecords.splice(recordIndex, 1);

    res.json({
      success: true,
      message: "Insémination supprimée avec succès",
    });
  } catch (error) {
    console.error("Error deleting insemination:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'insémination",
    });
  }
};

// GET /api/insemination/stats - Get insemination statistics
export const handleGetInseminationStats: RequestHandler = (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate statistics
    const total = inseminationRecords.length;

    const thisMonth = inseminationRecords.filter((record) => {
      const recordDate = new Date(record.date_dissemination);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    }).length;

    const thisYear = inseminationRecords.filter((record) => {
      const recordDate = new Date(record.date_dissemination);
      return recordDate.getFullYear() === currentYear;
    }).length;

    // Calculate top inseminateurs
    const inseminateurCounts = inseminationRecords.reduce(
      (acc, record) => {
        acc[record.inseminateur_id] = (acc[record.inseminateur_id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topInseminateurs = Object.entries(inseminateurCounts)
      .map(([inseminateur_id, count]) => ({ inseminateur_id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Mock success rate (in a real app, this would be calculated based on actual success data)
    const successRate = 85.5;

    const stats: InseminationStats = {
      total,
      thisMonth,
      thisYear,
      successRate,
      topInseminateurs,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting insemination stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};

// GET /api/insemination/export - Export insemination data
export const handleExportInseminations: RequestHandler = (req, res) => {
  try {
    const format = (req.query.format as string) || "csv";

    const filters: InseminationFilters = {
      nni: req.query.nni as string,
      semence_id: req.query.semence_id as string,
      inseminateur_id: req.query.inseminateur_id as string,
      responsable_local_id: req.query.responsable_local_id as string,
      date_dissemination: req.query.date_dissemination as string,
      createdBy: req.query.createdBy as string,
      dateCreation: req.query.dateCreation as string,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof InseminationFilters] === undefined) {
        delete filters[key as keyof InseminationFilters];
      }
    });

    const filteredRecords = applyFilters(inseminationRecords, filters);

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "ID",
        "NNI",
        "Date Dissémination",
        "ID Semence",
        "Inséminateur ID",
        "Responsable Local ID",
        "Créé par",
        "Date Création",
        "Date Modification",
      ];

      const csvContent = [
        headers.join(","),
        ...filteredRecords.map((record) =>
          [
            record.id,
            record.nni,
            record.date_dissemination,
            record.semence_id,
            record.inseminateur_id,
            record.responsable_local_id,
            record.createdBy,
            record.createdAt,
            record.updatedAt,
          ].join(","),
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=inseminations.csv",
      );
      res.send(csvContent);
    } else {
      // For Excel format, we'd typically use a library like xlsx
      // For now, return JSON
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=inseminations.json",
      );
      res.json(filteredRecords);
    }
  } catch (error) {
    console.error("Error exporting inseminations:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'export des inséminations",
    });
  }
};
