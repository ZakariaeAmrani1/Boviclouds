import { RequestHandler } from "express";
import {
  LactationRecord,
  CreateLactationInput,
  UpdateLactationInput,
  LactationFilters,
  PaginatedResponse,
  LactationStats,
} from "@shared/lactation";
import axios from "axios";
import dayjs from "dayjs";

// Mock data store (in production, this would be a database)
let lactationRecords: LactationRecord[] = [
  {
    id: "1",
    sujet_id: "507f1f77bcf86cd799439011", // Mock ObjectId for subject
    date_velage: "2024-01-15",
    n_lactation: 1,
    lait_kg: 35.5,
    kg_mg: 1.42,
    pct_proteine: 3.2,
    pct_mg: 4.0,
    controleur_laitier_id: "507f1f77bcf86cd799439022", // Mock ObjectId for controller
    createdAt: "2024-01-16T08:30:00Z",
    updatedAt: "2024-01-16T08:30:00Z",
  },
  {
    id: "2",
    sujet_id: "507f1f77bcf86cd799439012",
    date_velage: "2024-01-20",
    n_lactation: 2,
    lait_kg: 42.3,
    kg_mg: 1.69,
    pct_proteine: 3.4,
    pct_mg: 4.2,
    controleur_laitier_id: "507f1f77bcf86cd799439023",
    createdAt: "2024-01-21T14:20:00Z",
    updatedAt: "2024-01-21T14:20:00Z",
  },
  {
    id: "3",
    sujet_id: "507f1f77bcf86cd799439013",
    date_velage: "2024-01-25",
    n_lactation: 1,
    lait_kg: 28.7,
    kg_mg: 1.15,
    pct_proteine: 3.1,
    pct_mg: 4.0,
    controleur_laitier_id: "507f1f77bcf86cd799439022",
    createdAt: "2024-01-26T11:45:00Z",
    updatedAt: "2024-01-26T11:45:00Z",
  },
  {
    id: "4",
    sujet_id: "507f1f77bcf86cd799439014",
    date_velage: "2024-02-01",
    n_lactation: 3,
    lait_kg: 48.9,
    kg_mg: 1.96,
    pct_proteine: 3.6,
    pct_mg: 4.5,
    controleur_laitier_id: "507f1f77bcf86cd799439024",
    createdAt: "2024-02-02T16:10:00Z",
    updatedAt: "2024-02-02T16:10:00Z",
  },
];

let nextId = 5;

// Helper function to apply filters
const applyFilters = (
  records: LactationRecord[],
  filters: LactationFilters,
): LactationRecord[] => {
  return records.filter((record) => {
    if (filters.sujet_id && record.sujet_id !== filters.sujet_id) {
      return false;
    }
    if (filters.n_lactation && record.n_lactation !== filters.n_lactation) {
      return false;
    }
    if (filters.lait_kg_min && record.lait_kg < filters.lait_kg_min) {
      return false;
    }
    if (filters.lait_kg_max && record.lait_kg > filters.lait_kg_max) {
      return false;
    }
    if (filters.controleur_laitier_id && record.controleur_laitier_id !== filters.controleur_laitier_id) {
      return false;
    }
    if (filters.date_min) {
      const recordDate = new Date(record.date_velage);
      const filterDate = new Date(filters.date_min);
      if (recordDate < filterDate) {
        return false;
      }
    }
    if (filters.date_max) {
      const recordDate = new Date(record.date_velage);
      const filterDate = new Date(filters.date_max);
      if (recordDate > filterDate) {
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

// GET /api/lactation - Get all lactation records with filtering and pagination
export const handleGetLactations: RequestHandler = async (req, res) => {
  try {
    // In a real application, you would fetch from the backend API
    // For now, we'll use mock data but keep the structure for future backend integration

    // TODO: Uncomment when backend API is ready
    // const apiUrl = process.env.SERVER_API_URL;
    // const response = await axios.get(`${apiUrl}lactations`);
    // lactationRecords = response.data.map((data: any) => ({
    //   id: data._id,
    //   sujet_id: data.sujet_id,
    //   date_velage: data.date_velage,
    //   n_lactation: data.n_lactation,
    //   lait_kg: data.lait_kg,
    //   kg_mg: data.kg_mg,
    //   pct_proteine: data.pct_proteine,
    //   pct_mg: data.pct_mg,
    //   controleur_laitier_id: data.controleur_laitier_id,
    //   createdAt: data.createdAt,
    //   updatedAt: data.updatedAt,
    // }));

    // Use mock data for now
    if (lactationRecords.length === 0) {
      lactationRecords = [
        {
          id: "1",
          sujet_id: "507f1f77bcf86cd799439011",
          date_velage: "2024-01-15",
          n_lactation: 1,
          lait_kg: 35.5,
          kg_mg: 1.42,
          pct_proteine: 3.2,
          pct_mg: 4.0,
          controleur_laitier_id: "507f1f77bcf86cd799439022",
          createdAt: "2024-01-16T08:30:00Z",
          updatedAt: "2024-01-16T08:30:00Z",
        },
        {
          id: "2",
          sujet_id: "507f1f77bcf86cd799439012",
          date_velage: "2024-01-20",
          n_lactation: 2,
          lait_kg: 42.3,
          kg_mg: 1.69,
          pct_proteine: 3.4,
          pct_mg: 4.2,
          controleur_laitier_id: "507f1f77bcf86cd799439023",
          createdAt: "2024-01-21T14:20:00Z",
          updatedAt: "2024-01-21T14:20:00Z",
        },
        {
          id: "3",
          sujet_id: "507f1f77bcf86cd799439013",
          date_velage: "2024-01-25",
          n_lactation: 1,
          lait_kg: 28.7,
          kg_mg: 1.15,
          pct_proteine: 3.1,
          pct_mg: 4.0,
          controleur_laitier_id: "507f1f77bcf86cd799439022",
          createdAt: "2024-01-26T11:45:00Z",
          updatedAt: "2024-01-26T11:45:00Z",
        },
        {
          id: "4",
          sujet_id: "507f1f77bcf86cd799439014",
          date_velage: "2024-02-01",
          n_lactation: 3,
          lait_kg: 48.9,
          kg_mg: 1.96,
          pct_proteine: 3.6,
          pct_mg: 4.5,
          controleur_laitier_id: "507f1f77bcf86cd799439024",
          createdAt: "2024-02-02T16:10:00Z",
          updatedAt: "2024-02-02T16:10:00Z",
        },
        {
          id: "5",
          sujet_id: "507f1f77bcf86cd799439015",
          date_velage: "2024-02-05",
          n_lactation: 1,
          lait_kg: 31.2,
          kg_mg: 1.25,
          pct_proteine: 3.3,
          pct_mg: 4.1,
          controleur_laitier_id: "507f1f77bcf86cd799439025",
          createdAt: "2024-02-06T10:15:00Z",
          updatedAt: "2024-02-06T10:15:00Z",
        },
        {
          id: "6",
          sujet_id: "507f1f77bcf86cd799439016",
          date_velage: "2024-02-10",
          n_lactation: 4,
          lait_kg: 52.1,
          kg_mg: 2.08,
          pct_proteine: 3.8,
          pct_mg: 4.8,
          controleur_laitier_id: "507f1f77bcf86cd799439022",
          createdAt: "2024-02-11T14:30:00Z",
          updatedAt: "2024-02-11T14:30:00Z",
        },
        {
          id: "7",
          sujet_id: "507f1f77bcf86cd799439017",
          date_velage: "2024-02-15",
          n_lactation: 2,
          lait_kg: 38.9,
          kg_mg: 1.56,
          pct_proteine: 3.5,
          pct_mg: 4.3,
          controleur_laitier_id: "507f1f77bcf86cd799439023",
          createdAt: "2024-02-16T09:45:00Z",
          updatedAt: "2024-02-16T09:45:00Z",
        },
        {
          id: "8",
          sujet_id: "507f1f77bcf86cd799439018",
          date_velage: "2024-02-20",
          n_lactation: 1,
          lait_kg: 29.4,
          kg_mg: 1.18,
          pct_proteine: 3.0,
          pct_mg: 3.9,
          controleur_laitier_id: "507f1f77bcf86cd799439024",
          createdAt: "2024-02-21T16:20:00Z",
          updatedAt: "2024-02-21T16:20:00Z",
        },
        {
          id: "9",
          sujet_id: "507f1f77bcf86cd799439019",
          date_velage: "2024-02-25",
          n_lactation: 3,
          lait_kg: 45.7,
          kg_mg: 1.83,
          pct_proteine: 3.7,
          pct_mg: 4.6,
          controleur_laitier_id: "507f1f77bcf86cd799439025",
          createdAt: "2024-02-26T11:10:00Z",
          updatedAt: "2024-02-26T11:10:00Z",
        },
        {
          id: "10",
          sujet_id: "507f1f77bcf86cd799439020",
          date_velage: "2024-03-01",
          n_lactation: 2,
          lait_kg: 40.8,
          kg_mg: 1.63,
          pct_proteine: 3.4,
          pct_mg: 4.4,
          controleur_laitier_id: "507f1f77bcf86cd799439022",
          createdAt: "2024-03-02T13:25:00Z",
          updatedAt: "2024-03-02T13:25:00Z",
        },
      ];
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filters: LactationFilters = {
      sujet_id: req.query.sujet_id as string,
      n_lactation: req.query.n_lactation ? parseInt(req.query.n_lactation as string) : undefined,
      lait_kg_min: req.query.lait_kg_min ? parseFloat(req.query.lait_kg_min as string) : undefined,
      lait_kg_max: req.query.lait_kg_max ? parseFloat(req.query.lait_kg_max as string) : undefined,
      controleur_laitier_id: req.query.controleur_laitier_id as string,
      date_min: req.query.date_min as string,
      date_max: req.query.date_max as string,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof LactationFilters] === undefined) {
        delete filters[key as keyof LactationFilters];
      }
    });

    const filteredRecords = applyFilters(lactationRecords, filters);

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
    console.error("Error getting lactations:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des lactations",
    });
  }
};

// GET /api/lactation/:id - Get a single lactation record
export const handleGetLactation: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const record = lactationRecords.find((r) => r.id === id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Lactation non trouvée",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error getting lactation:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la lactation",
    });
  }
};

// POST /api/lactation - Create a new lactation record
export const handleCreateLactation: RequestHandler = async (req, res) => {
  try {
    const input: CreateLactationInput = req.body;

    // Basic validation
    if (
      !input.sujet_id ||
      !input.date_velage ||
      !input.n_lactation ||
      input.lait_kg < 0 ||
      input.kg_mg < 0 ||
      input.pct_proteine < 0 ||
      input.pct_mg < 0 ||
      !input.controleur_laitier_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être renseignés avec des valeurs valides",
      });
    }

    // TODO: Backend API call would be like this:
    // const apiUrl = process.env.SERVER_API_URL;
    // const response = await axios.post(`${apiUrl}lactations`, {
    //   sujet_id: input.sujet_id,
    //   date_velage: input.date_velage,
    //   n_lactation: input.n_lactation,
    //   lait_kg: input.lait_kg,
    //   kg_mg: input.kg_mg,
    //   pct_proteine: input.pct_proteine,
    //   pct_mg: input.pct_mg,
    //   controleur_laitier_id: input.controleur_laitier_id,
    // });

    // Create new record
    const newRecord: LactationRecord = {
      id: nextId.toString(),
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    lactationRecords.push(newRecord);
    nextId++;

    res.status(201).json({
      success: true,
      data: newRecord,
      message: "Lactation créée avec succès",
    });
  } catch (error) {
    console.error("Error creating lactation:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la lactation",
    });
  }
};

// PUT /api/lactation/:id - Update an existing lactation record
export const handleUpdateLactation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const input: UpdateLactationInput = req.body;

    const recordIndex = lactationRecords.findIndex((r) => r.id === id);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Lactation non trouvée",
      });
    }

    // TODO: Backend API call would be like this:
    // const apiUrl = process.env.SERVER_API_URL;
    // const response = await axios.patch(`${apiUrl}lactations/${id}`, input);

    // Update record
    const updatedRecord: LactationRecord = {
      ...lactationRecords[recordIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    lactationRecords[recordIndex] = updatedRecord;

    res.json({
      success: true,
      data: updatedRecord,
      message: "Lactation mise à jour avec succès",
    });
  } catch (error) {
    console.error("Error updating lactation:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la lactation",
    });
  }
};

// DELETE /api/lactation/:id - Delete a lactation record
export const handleDeleteLactation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const recordIndex = lactationRecords.findIndex((r) => r.id === id);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Lactation non trouvée",
      });
    }

    // TODO: Backend API call would be like this:
    // const apiUrl = process.env.SERVER_API_URL;
    // const response = await axios.delete(`${apiUrl}lactations/${id}`);

    lactationRecords.splice(recordIndex, 1);

    res.json({
      success: true,
      message: "Lactation supprimée avec succès",
    });
  } catch (error) {
    console.error("Error deleting lactation:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la lactation",
    });
  }
};

// GET /api/lactation/stats - Get lactation statistics
export const handleGetLactationStats: RequestHandler = (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate statistics
    const total = lactationRecords.length;

    const thisMonth = lactationRecords.filter((record) => {
      const recordDate = new Date(record.createdAt);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    }).length;

    const thisYear = lactationRecords.filter((record) => {
      const recordDate = new Date(record.createdAt);
      return recordDate.getFullYear() === currentYear;
    }).length;

    // Calculate averages
    const averageLaitKg = lactationRecords.reduce((sum, record) => sum + record.lait_kg, 0) / total || 0;
    const averagePctProteine = lactationRecords.reduce((sum, record) => sum + record.pct_proteine, 0) / total || 0;
    const averagePctMg = lactationRecords.reduce((sum, record) => sum + record.pct_mg, 0) / total || 0;

    // Calculate top producers (by total milk production)
    const subjectProduction = lactationRecords.reduce(
      (acc, record) => {
        acc[record.sujet_id] = (acc[record.sujet_id] || 0) + record.lait_kg;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topProducers = Object.entries(subjectProduction)
      .map(([sujet_id, totalLaitKg]) => ({ sujet_id, totalLaitKg }))
      .sort((a, b) => b.totalLaitKg - a.totalLaitKg)
      .slice(0, 5);

    const stats: LactationStats = {
      total,
      thisMonth,
      thisYear,
      averageLaitKg,
      averagePctProteine,
      averagePctMg,
      topProducers,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting lactation stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};

// GET /api/lactation/export - Export lactation data
export const handleExportLactations: RequestHandler = (req, res) => {
  try {
    const format = (req.query.format as string) || "csv";

    const filters: LactationFilters = {
      sujet_id: req.query.sujet_id as string,
      n_lactation: req.query.n_lactation ? parseInt(req.query.n_lactation as string) : undefined,
      lait_kg_min: req.query.lait_kg_min ? parseFloat(req.query.lait_kg_min as string) : undefined,
      lait_kg_max: req.query.lait_kg_max ? parseFloat(req.query.lait_kg_max as string) : undefined,
      controleur_laitier_id: req.query.controleur_laitier_id as string,
      date_min: req.query.date_min as string,
      date_max: req.query.date_max as string,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof LactationFilters] === undefined) {
        delete filters[key as keyof LactationFilters];
      }
    });

    const filteredRecords = applyFilters(lactationRecords, filters);

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "ID",
        "Sujet ID",
        "Date Vêlage",
        "N° Lactation",
        "Lait (kg)",
        "KG MG",
        "% Protéine",
        "% MG",
        "Contrôleur Laitier ID",
        "Date Création",
        "Date Modification",
      ];

      const csvContent = [
        headers.join(","),
        ...filteredRecords.map((record) =>
          [
            record.id,
            record.sujet_id,
            record.date_velage,
            record.n_lactation,
            record.lait_kg,
            record.kg_mg,
            record.pct_proteine,
            record.pct_mg,
            record.controleur_laitier_id,
            record.createdAt,
            record.updatedAt,
          ].join(","),
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=lactations.csv");
      res.send(csvContent);
    } else {
      // For Excel format, we'd typically use a library like xlsx
      // For now, return JSON
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=lactations.json",
      );
      res.json(filteredRecords);
    }
  } catch (error) {
    console.error("Error exporting lactations:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'export des lactations",
    });
  }
};
