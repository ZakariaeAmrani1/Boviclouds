import { RequestHandler } from "express";
import { z } from "zod";
import {
  Sujet,
  TraitementListResponse,
  CreateSujetRequest,
  UpdateSujetRequest,
  TraitementStats,
} from "@shared/traitement";

// Validation schemas
const createSujetSchema = z.object({
  nniSujet: z.string().min(1, "NNI sujet is required"),
  doc: z.string().min(1, "Doc is required"),
  dateNaissance: z.string().min(1, "Date naissance is required"),
  race: z.string().min(1, "Race is required"),
  sexe: z.string().min(1, "Sexe is required"),
  type: z.string().min(1, "Type is required"),
});

const updateSujetSchema = z.object({
  nniSujet: z.string().optional(),
  doc: z.string().optional(),
  dateNaissance: z.string().optional(),
  race: z.string().optional(),
  sexe: z.string().optional(),
  type: z.string().optional(),
});

// Mock data storage (replace with actual database in production)
let mockSujets: Sujet[] = [
  {
    id: "sujet-1",
    nniSujet: "camera 1",
    doc: "Main Entrance",
    dateNaissance: "Main Entrance",
    race: "Main Entrance",
    sexe: "Achraf",
    type: "Achraf",
    createdBy: "Achraf",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  {
    id: "sujet-2",
    nniSujet: "camera 2",
    doc: "Back Door",
    dateNaissance: "Back Door",
    race: "Back Door",
    sexe: "Achraf",
    type: "Achraf",
    createdBy: "Achraf",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
  },
  {
    id: "sujet-3",
    nniSujet: "camera 3",
    doc: "Eating Place",
    dateNaissance: "Eating Place",
    race: "Eating Place",
    sexe: "Achraf",
    type: "Achraf",
    createdBy: "Achraf",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date(),
  },
];

// Get all sujets with filtering and pagination
export const getSujets: RequestHandler = (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const race = req.query.race as string;
    const sexe = req.query.sexe as string;
    const type = req.query.type as string;

    let filteredSujets = [...mockSujets];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSujets = filteredSujets.filter(
        (sujet) =>
          sujet.nniSujet.toLowerCase().includes(searchLower) ||
          sujet.doc.toLowerCase().includes(searchLower) ||
          sujet.race.toLowerCase().includes(searchLower) ||
          sujet.sexe.toLowerCase().includes(searchLower) ||
          sujet.type.toLowerCase().includes(searchLower),
      );
    }

    if (race) {
      filteredSujets = filteredSujets.filter((sujet) => sujet.race === race);
    }

    if (sexe) {
      filteredSujets = filteredSujets.filter((sujet) => sujet.sexe === sexe);
    }

    if (type) {
      filteredSujets = filteredSujets.filter((sujet) => sujet.type === type);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSujets = filteredSujets.slice(startIndex, endIndex);

    const response: TraitementListResponse = {
      sujets: paginatedSujets,
      total: filteredSujets.length,
      page,
      limit,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting sujets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single sujet by ID
export const getSujet: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const sujet = mockSujets.find((s) => s.id === id);

    if (!sujet) {
      return res.status(404).json({ error: "Sujet not found" });
    }

    res.json(sujet);
  } catch (error) {
    console.error("Error getting sujet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new sujet
export const createSujet: RequestHandler = (req, res) => {
  try {
    const validatedData = createSujetSchema.parse(req.body);

    const newSujet: Sujet = {
      id: `sujet-${Date.now()}`,
      ...validatedData,
      createdBy: "Current User", // In real app, get from authentication
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockSujets.push(newSujet);

    res.status(201).json(newSujet);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    }

    console.error("Error creating sujet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update sujet
export const updateSujet: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateSujetSchema.parse(req.body);

    const sujetIndex = mockSujets.findIndex((s) => s.id === id);

    if (sujetIndex === -1) {
      return res.status(404).json({ error: "Sujet not found" });
    }

    const updatedSujet: Sujet = {
      ...mockSujets[sujetIndex],
      ...validatedData,
      updatedAt: new Date(),
    };

    mockSujets[sujetIndex] = updatedSujet;

    res.json(updatedSujet);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    }

    console.error("Error updating sujet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete sujet
export const deleteSujet: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const sujetIndex = mockSujets.findIndex((s) => s.id === id);

    if (sujetIndex === -1) {
      return res.status(404).json({ error: "Sujet not found" });
    }

    mockSujets.splice(sujetIndex, 1);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting sujet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get traitement statistics
export const getTraitementStats: RequestHandler = (req, res) => {
  try {
    const stats: TraitementStats = {
      total: mockSujets.length,
      identification: mockSujets.length, // All sujets are in identification for now
      insemination: 0,
      lactation: 0,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error getting traitement stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export sujets data
export const exportSujetsData: RequestHandler = (req, res) => {
  try {
    const format = (req.query.format as string) || "csv";
    const search = req.query.search as string;
    const race = req.query.race as string;
    const sexe = req.query.sexe as string;
    const type = req.query.type as string;

    let filteredSujets = [...mockSujets];

    // Apply same filters as getSujets
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSujets = filteredSujets.filter(
        (sujet) =>
          sujet.nniSujet.toLowerCase().includes(searchLower) ||
          sujet.doc.toLowerCase().includes(searchLower) ||
          sujet.race.toLowerCase().includes(searchLower) ||
          sujet.sexe.toLowerCase().includes(searchLower) ||
          sujet.type.toLowerCase().includes(searchLower),
      );
    }

    if (race) {
      filteredSujets = filteredSujets.filter((sujet) => sujet.race === race);
    }

    if (sexe) {
      filteredSujets = filteredSujets.filter((sujet) => sujet.sexe === sexe);
    }

    if (type) {
      filteredSujets = filteredSujets.filter((sujet) => sujet.type === type);
    }

    if (format === "csv") {
      const csvHeaders = [
        "ID",
        "NNI Sujet",
        "Doc",
        "Date Naissance",
        "Race",
        "Sexe",
        "Type",
        "Created By",
        "Created At",
      ];

      const csvRows = filteredSujets.map((sujet) => [
        sujet.id,
        sujet.nniSujet,
        sujet.doc,
        sujet.dateNaissance,
        sujet.race,
        sujet.sexe,
        sujet.type,
        sujet.createdBy,
        sujet.createdAt.toISOString(),
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="traitement_export_${new Date().toISOString().split("T")[0]}.csv"`,
      );
      res.send(csvContent);
    } else if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="traitement_export_${new Date().toISOString().split("T")[0]}.json"`,
      );
      res.json(filteredSujets);
    } else {
      res.status(400).json({ error: "Unsupported export format" });
    }
  } catch (error) {
    console.error("Error exporting sujets data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
