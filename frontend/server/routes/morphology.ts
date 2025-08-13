import { RequestHandler } from "express";
import { MorphologyRecord, MorphologyListResponse, MorphologyResponse } from "@shared/morphology";

// Mock database
let morphologies: MorphologyRecord[] = [
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

// Get all morphologies with pagination and filters
export const getMorphologies: RequestHandler = (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const cow_id = req.query.cow_id as string;
    const source_detection = req.query.source_detection as string;
    const dateFrom = req.query.dateFrom as string;
    const dateTo = req.query.dateTo as string;

    let filteredMorphologies = [...morphologies];

    // Apply filters
    if (cow_id) {
      filteredMorphologies = filteredMorphologies.filter(m => 
        m.cow_id.toLowerCase().includes(cow_id.toLowerCase())
      );
    }

    if (source_detection) {
      filteredMorphologies = filteredMorphologies.filter(m => 
        m.source_detection.toLowerCase().includes(source_detection.toLowerCase())
      );
    }

    if (dateFrom) {
      filteredMorphologies = filteredMorphologies.filter(m => 
        new Date(m.timestamp) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filteredMorphologies = filteredMorphologies.filter(m => 
        new Date(m.timestamp) <= new Date(dateTo)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMorphologies = filteredMorphologies.slice(startIndex, endIndex);

    const response: MorphologyListResponse = {
      success: true,
      data: {
        data: paginatedMorphologies,
        total: filteredMorphologies.length,
        page,
        limit,
        totalPages: Math.ceil(filteredMorphologies.length / limit),
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching morphologies:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch morphologies" 
    });
  }
};

// Get single morphology by ID
export const getMorphology: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const morphology = morphologies.find(m => m._id === id);

    if (!morphology) {
      return res.status(404).json({
        success: false,
        message: "Morphology not found",
      });
    }

    const response: MorphologyResponse = {
      success: true,
      data: morphology,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching morphology:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch morphology",
    });
  }
};

// Process identification image (Step 1)
export const processIdentificationImage: RequestHandler = (req, res) => {
  try {
    // Simulate image processing delay
    setTimeout(() => {
      // Mock cow identification
      const mockCowIds = ["FR1234567890", "FR0987654321", "FR1122334455", "FR5566778899"];
      const randomCowId = mockCowIds[Math.floor(Math.random() * mockCowIds.length)];
      
      res.json({
        success: true,
        data: {
          cow_id: randomCowId,
          confidence: 0.95,
        },
        message: "Vache identifiée avec succès",
      });
    }, 1500); // Simulate processing time
  } catch (error) {
    console.error("Error processing identification image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process identification image",
    });
  }
};

// Process morphology image (Step 2)
export const processMorphologyImage: RequestHandler = (req, res) => {
  try {
    const { cow_id } = req.body;

    if (!cow_id) {
      return res.status(400).json({
        success: false,
        message: "cow_id is required",
      });
    }

    // Simulate image processing delay
    setTimeout(() => {
      // Mock morphology measurements with some variance
      const baseHeight = 120;
      const baseWidth = 55;
      const baseLength = 140;
      
      const variance = () => (Math.random() - 0.5) * 10; // ±5 units variance

      res.json({
        success: true,
        data: {
          hauteur_au_garrot: {
            valeur: Math.round((baseHeight + variance()) * 10) / 10,
            unite: "cm",
          },
          largeur_du_corps: {
            valeur: Math.round((baseWidth + variance()) * 10) / 10,
            unite: "cm",
          },
          longueur_du_corps: {
            valeur: Math.round((baseLength + variance()) * 10) / 10,
            unite: "cm",
          },
          confidence: 0.92,
        },
        message: "Analyse morphologique terminée",
      });
    }, 2000); // Simulate processing time
  } catch (error) {
    console.error("Error processing morphology image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process morphology image",
    });
  }
};

// Create new morphology record
export const createMorphology: RequestHandler = (req, res) => {
  try {
    const {
      cow_id,
      source_detection,
      hauteur_au_garrot,
      largeur_du_corps,
      longueur_du_corps,
    } = req.body;

    if (!cow_id || !hauteur_au_garrot || !largeur_du_corps || !longueur_du_corps) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    const newMorphology: MorphologyRecord = {
      _id: `morph-${Date.now()}`,
      cow_id,
      timestamp: new Date().toISOString(),
      source_detection: source_detection || "Caméra automatique",
      hauteur_au_garrot,
      largeur_du_corps,
      longueur_du_corps,
      createdBy: "Système", // In real app, get from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    morphologies.unshift(newMorphology); // Add to beginning

    const response: MorphologyResponse = {
      success: true,
      data: newMorphology,
      message: "Morphologie créée avec succès",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating morphology:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create morphology",
    });
  }
};

// Delete morphology
export const deleteMorphology: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const morphologyIndex = morphologies.findIndex(m => m._id === id);

    if (morphologyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Morphology not found",
      });
    }

    morphologies.splice(morphologyIndex, 1);
    
    res.json({
      success: true,
      message: "Morphologie supprimée avec succès",
    });
  } catch (error) {
    console.error("Error deleting morphology:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete morphology",
    });
  }
};

// Get morphology statistics
export const getMorphologyStats: RequestHandler = (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthMorphologies = morphologies.filter(m => 
      new Date(m.timestamp) >= startOfMonth
    );

    const avgHeight = morphologies.length > 0 
      ? morphologies.reduce((sum, m) => sum + m.hauteur_au_garrot.valeur, 0) / morphologies.length
      : 0;

    const avgWidth = morphologies.length > 0
      ? morphologies.reduce((sum, m) => sum + m.largeur_du_corps.valeur, 0) / morphologies.length
      : 0;

    const avgLength = morphologies.length > 0
      ? morphologies.reduce((sum, m) => sum + m.longueur_du_corps.valeur, 0) / morphologies.length
      : 0;

    const stats = {
      total: morphologies.length,
      thisMonth: thisMonthMorphologies.length,
      averageHeight: Math.round(avgHeight * 10) / 10,
      averageWidth: Math.round(avgWidth * 10) / 10,
      averageLength: Math.round(avgLength * 10) / 10,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching morphology stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch morphology stats",
    });
  }
};

// Export morphology data
export const exportMorphologyData: RequestHandler = (req, res) => {
  try {
    const format = req.query.format as string || "csv";
    
    // Apply same filters as getMorphologies
    const cow_id = req.query.cow_id as string;
    const source_detection = req.query.source_detection as string;
    const dateFrom = req.query.dateFrom as string;
    const dateTo = req.query.dateTo as string;

    let filteredMorphologies = [...morphologies];

    if (cow_id) {
      filteredMorphologies = filteredMorphologies.filter(m => 
        m.cow_id.toLowerCase().includes(cow_id.toLowerCase())
      );
    }

    if (source_detection) {
      filteredMorphologies = filteredMorphologies.filter(m => 
        m.source_detection.toLowerCase().includes(source_detection.toLowerCase())
      );
    }

    if (dateFrom) {
      filteredMorphologies = filteredMorphologies.filter(m => 
        new Date(m.timestamp) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filteredMorphologies = filteredMorphologies.filter(m => 
        new Date(m.timestamp) <= new Date(dateTo)
      );
    }

    if (format === "csv") {
      const csvHeader = "ID,Vache ID,Date,Hauteur (cm),Largeur (cm),Longueur (cm),Source,Créé par\n";
      const csvData = filteredMorphologies.map(m => 
        `${m._id},${m.cow_id},${m.timestamp},${m.hauteur_au_garrot.valeur},${m.largeur_du_corps.valeur},${m.longueur_du_corps.valeur},"${m.source_detection}",${m.createdBy || ""}`
      ).join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=morphologies.csv");
      res.send(csvHeader + csvData);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=morphologies.json");
      res.json(filteredMorphologies);
    }
  } catch (error) {
    console.error("Error exporting morphology data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export morphology data",
    });
  }
};
