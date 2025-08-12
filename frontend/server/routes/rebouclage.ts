import { RequestHandler } from "express";
import FormData from "form-data";
import axios from "axios";

export interface RebouclageRecord {
  id: string;
  ancienNNI: string;
  nouveauNNI: string;
  identificateur_id: string;
  dateRebouclage: string;
  dateCreation: string;
  dateModification: string;
  CréePar: string;
  mode?: 'manual' | 'automatic';
}

export interface CreateRebouclageInput {
  ancienNNI: string;
  nouveauNNI: string;
  identificateur_id: string;
  dateRebouclage?: string;
  mode?: 'manual' | 'automatic';
}

export interface AutomaticRebouclageInput {
  nouveauNNI: string;
  identificateur_id: string;
  dateRebouclage?: string;
  mode: 'automatic';
}

const getAuthHeaders = (req: any) => {
  const token = req.headers.authorization || req.body.token;
  return {
    Authorization: token,
  };
};

// Get all rebouclage records
export const handleGetRebouclages: RequestHandler = async (req, res) => {
  try {
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000/api/v1/";
    const headers = getAuthHeaders(req);

    const response = await axios.get(`${apiUrl}rebouclages`, {
      headers,
      params: req.query,
    });

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error getting rebouclages:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error getting rebouclages",
    });
  }
};

// Get single rebouclage by ID
export const handleGetRebouclage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000/api/v1/";
    const headers = getAuthHeaders(req);

    const response = await axios.get(`${apiUrl}rebouclages/${id}`, {
      headers,
    });

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error getting rebouclage:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error getting rebouclage",
    });
  }
};

// Create rebouclage (manual mode)
export const handleCreateRebouclage: RequestHandler = async (req, res) => {
  try {
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000/api/v1/";
    let data: CreateRebouclageInput & { token?: string };
    
    // Parse JSON data from request body
    if (req.is("application/json")) {
      data = req.body;
    } else {
      return res.status(400).json({
        success: false,
        message: "Content-Type must be application/json for manual mode",
      });
    }

    const headers = getAuthHeaders(req);

    // Create the rebouclage in manual mode
    const backendData = {
      operation_id: data.identificateur_id,
      id_sujet: "placeholder", // This should be derived from the ancien_nni
      ancien_nni: data.ancienNNI,
      nouveau_nni: data.nouveauNNI,
      date_creation: data.dateRebouclage || new Date().toISOString(),
      identificateur_id: data.identificateur_id,
    };

    const response = await axios.post(`${apiUrl}rebouclages`, backendData, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });

    res.json({
      success: true,
      data: response.data,
      message: "Rebouclage créé avec succès",
    });
  } catch (error: any) {
    console.error("Error creating rebouclage:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error creating rebouclage",
    });
  }
};

// Create rebouclage with automatic image processing
export const handleCreateRebouclageAutomatic: RequestHandler = async (req, res) => {
  try {
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000/api/v1/";
    let data: AutomaticRebouclageInput & { token?: string };
    let images: Express.Multer.File[] = [];

    // Check if request contains FormData (with images)
    if (req.is("multipart/form-data")) {
      // Parse form data
      try {
        data = JSON.parse(req.body.data || "{}");
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON data in form",
        });
      }

      // Get uploaded images
      if (req.files && Array.isArray(req.files)) {
        images = req.files;
      } else if (req.files && "image" in req.files) {
        images = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
      }

      if (images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Au moins une image est requise pour le mode automatique",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Content-Type must be multipart/form-data for automatic mode",
      });
    }

    const headers = getAuthHeaders(req);

    // First, process the image to extract the ancien NNI
    // This is a mock implementation - replace with actual image processing service
    const mockProcessImage = async (imageBuffer: Buffer): Promise<string> => {
      // Simulate image processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock OCR result - in real implementation, this would be actual OCR
      const mockNNI = `FR${Date.now().toString().slice(-10)}`;
      return mockNNI;
    };

    try {
      // Process the first image to extract ancien NNI
      const ancienNNI = await mockProcessImage(images[0].buffer);

      // Create the rebouclage with extracted ancien NNI
      const backendData = {
        operation_id: data.identificateur_id,
        id_sujet: "placeholder", // This should be derived from the ancien_nni
        ancien_nni: ancienNNI,
        nouveau_nni: data.nouveauNNI,
        date_creation: data.dateRebouclage || new Date().toISOString(),
        identificateur_id: data.identificateur_id,
      };

      const response = await axios.post(`${apiUrl}rebouclages`, backendData, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });

      res.json({
        success: true,
        data: {
          ...response.data,
          extractedAncienNNI: ancienNNI,
          mode: 'automatic'
        },
        message: "Rebouclage créé avec succès en mode automatique",
      });
    } catch (imageProcessingError) {
      console.error("Error processing image:", imageProcessingError);
      res.status(500).json({
        success: false,
        message: "Erreur lors du traitement de l'image",
      });
    }
  } catch (error: any) {
    console.error("Error creating automatic rebouclage:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error creating automatic rebouclage",
    });
  }
};

// Update rebouclage
export const handleUpdateRebouclage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000/api/v1/";
    const headers = getAuthHeaders(req);

    const response = await axios.put(`${apiUrl}rebouclages/${id}`, req.body, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });

    res.json({
      success: true,
      data: response.data,
      message: "Rebouclage mis à jour avec succès",
    });
  } catch (error: any) {
    console.error("Error updating rebouclage:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error updating rebouclage",
    });
  }
};

// Delete rebouclage
export const handleDeleteRebouclage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000/api/v1/";
    const headers = getAuthHeaders(req);

    await axios.delete(`${apiUrl}rebouclages/${id}`, {
      headers,
    });

    res.json({
      success: true,
      message: "Rebouclage supprimé avec succès",
    });
  } catch (error: any) {
    console.error("Error deleting rebouclage:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error deleting rebouclage",
    });
  }
};

// Export rebouclages
export const handleExportRebouclages: RequestHandler = async (req, res) => {
  try {
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000/api/v1/";
    const headers = getAuthHeaders(req);
    const format = req.query.format as string || 'csv';

    const response = await axios.get(`${apiUrl}rebouclages/export`, {
      headers,
      params: { format },
      responseType: 'arraybuffer'
    });

    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileName = `rebouclages.${format === 'csv' ? 'csv' : 'xlsx'}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(response.data);
  } catch (error: any) {
    console.error("Error exporting rebouclages:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error exporting rebouclages",
    });
  }
};

// Extract NNI from image
export const handleExtractNNI: RequestHandler = async (req, res) => {
  try {
    let image: Express.Multer.File | undefined;

    // Get uploaded image
    if (req.files && Array.isArray(req.files)) {
      image = req.files[0];
    } else if (req.files && "image" in req.files) {
      image = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
    } else if (req.file) {
      image = req.file;
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Une image est requise pour l'extraction du NNI",
      });
    }

    try {
      // Mock OCR processing - in real implementation, you would use an OCR service
      // like Google Vision API, AWS Textract, or a custom OCR solution
      const mockProcessImage = async (imageBuffer: Buffer): Promise<string> => {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock OCR result - in real implementation, this would be actual OCR
        // You could also implement some basic pattern recognition here
        const mockNNI = `FR${Date.now().toString().slice(-10)}`;

        // Simulate some potential errors
        const shouldError = Math.random() < 0.1; // 10% chance of error for demo
        if (shouldError) {
          throw new Error("NNI non détecté dans l'image. Veuillez essayer avec une image plus claire.");
        }

        return mockNNI;
      };

      const extractedNNI = await mockProcessImage(image.buffer);

      res.json({
        success: true,
        extractedNNI,
        message: "NNI extrait avec succès",
      });
    } catch (imageProcessingError: any) {
      console.error("Error processing image:", imageProcessingError);
      res.status(400).json({
        success: false,
        message: imageProcessingError.message || "Erreur lors du traitement de l'image",
      });
    }
  } catch (error: any) {
    console.error("Error extracting NNI:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error extracting NNI",
    });
  }
};

// Get rebouclage stats
export const handleGetRebouclageStats: RequestHandler = async (req, res) => {
  try {
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000/api/v1/";
    const headers = getAuthHeaders(req);

    // Mock stats - replace with actual backend call when available
    const mockStats = {
      total: 150,
      thisMonth: 12,
      automatic: 45,
      manual: 105,
      success_rate: 98.5
    };

    res.json({
      success: true,
      data: mockStats,
    });
  } catch (error: any) {
    console.error("Error getting rebouclage stats:", error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Error getting rebouclage stats",
    });
  }
};
