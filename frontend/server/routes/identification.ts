import { RequestHandler } from "express";
import {
  IdentificationRecord,
  CreateIdentificationInput,
  UpdateIdentificationInput,
  IdentificationFilters,
  PaginationParams,
  PaginatedResponse,
  IdentificationStats,
  Race,
  Sexe,
  TypeAnimal,
} from "../../shared/identification";
import axios from "axios";

// Mock database - in a real app, this would be a proper database
let identifications: IdentificationRecord[] = [];

// Helper function to generate unique ID
const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to apply filters
const applyFilters = (
  data: IdentificationRecord[],
  filters: IdentificationFilters,
): IdentificationRecord[] => {
  return data.filter((record) => {
    if (
      filters.nni &&
      !record.infos_sujet.nni.toLowerCase().includes(filters.nni.toLowerCase())
    ) {
      return false;
    }
    if (filters.race && record.infos_sujet.race !== filters.race) {
      return false;
    }
    if (filters.sexe && record.infos_sujet.sexe !== filters.sexe) {
      return false;
    }
    if (filters.type && record.infos_sujet.type !== filters.type) {
      return false;
    }
    if (
      filters.eleveur_id &&
      record.complem.eleveur_id !== filters.eleveur_id
    ) {
      return false;
    }
    if (
      filters.exploitation_id &&
      record.complem.exploitation_id !== filters.exploitation_id
    ) {
      return false;
    }
    if (
      filters.responsable_local_id &&
      record.complem.responsable_local_id !== filters.responsable_local_id
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
      const recordDate = new Date(record.createdAt).toDateString();
      const filterDate = new Date(filters.dateCreation).toDateString();
      if (recordDate !== filterDate) {
        return false;
      }
    }
    return true;
  });
};

// Helper function to apply pagination
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

export const getIdentificationsforLactation: RequestHandler = async (
  req,
  res,
) => {
  const resp = [];
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const apiUrl = process.env.SERVER_API_URL;
    const { token } = req.query;
    const response = await axios.get(`${apiUrl}identifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    response.data.map((data) => {
      resp.push({
        id: data._id,
        nni: data.infos_sujet.nni,
        nom: data.infos_sujet.type,
        race: data.infos_sujet.race,
      });
    });

    const filters: IdentificationFilters = {
      nni: req.query.nni as string,
      race: req.query.race as Race,
      sexe: req.query.sexe as Sexe,
      type: req.query.type as TypeAnimal,
      eleveur_id: req.query.eleveur_id as string,
      exploitation_id: req.query.exploitation_id as string,
      responsable_local_id: req.query.responsable_local_id as string,
      createdBy: req.query.createdBy as string,
      dateCreation: req.query.dateCreation as string,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof IdentificationFilters] === undefined) {
        delete filters[key as keyof IdentificationFilters];
      }
    });

    const filteredData = applyFilters(resp, filters);
    const paginatedResult = applyPagination(filteredData, { page, limit });

    res.json({
      success: true,
      data: resp,
    });
  } catch (error) {
    console.error("Error fetching identifications:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des identifications",
    });
  }
};

// Get all identifications with pagination and filtering
export const getIdentifications: RequestHandler = async (req, res) => {
  identifications = [];
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const apiUrl = process.env.SERVER_API_URL;
    const { token } = req.query;
    const response = await axios.get(`${apiUrl}identifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    response.data.map((data) => {
      identifications.push({
        id: data.id,
        infos_sujet: {
          nni: data.infos_sujet.nni,
          date_naissance: data.infos_sujet.date_naissance,
          race: Race.ANGUS,
          sexe: data.infos_sujet.race === "MALE" ? Sexe.MALE : Sexe.FEMELLE,
          type:
            data.infos_sujet.type === "BOVIN"
              ? TypeAnimal.BOVIN
              : data.infos_sujet.type === "CARPIN"
                ? TypeAnimal.CAPRIN
                : TypeAnimal.OVIN,
        },
        infos_mere: {
          nni: data.infos_mere.nni,
          date_naissance: data.infos_mere.date_naissance,
          race: Race.ANGUS,
        },
        grand_pere_maternel: {
          nni: data.grand_pere_maternel.nni,
          date_naissance: data.grand_pere_maternel.date_naissance,
          race: Race.ANGUS,
        },
        pere: {
          nni: data.pere.nni,
          date_naissance: data.pere.date_naissance,
          race: Race.ANGUS,
        },
        grand_pere_paternel: {
          nni: data.grand_pere_paternel.nni,
          date_naissance: data.grand_pere_paternel.date_naissance,
          race: Race.ANGUS,
        },
        grand_mere_paternelle: {
          nni: data.grand_mere_paternelle.nni,
          date_naissance: data.grand_mere_paternelle.date_naissance,
          race: Race.ANGUS,
        },
        complem: {
          eleveur_id: data.complem.eleveur_id,
          exploitation_id: data.complem.exploitation_id,
          responsable_local_id: data.complem.responsable_local_id,
        },
        createdBy: "Stéphanie Moreau",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    const filters: IdentificationFilters = {
      nni: req.query.nni as string,
      race: req.query.race as Race,
      sexe: req.query.sexe as Sexe,
      type: req.query.type as TypeAnimal,
      eleveur_id: req.query.eleveur_id as string,
      exploitation_id: req.query.exploitation_id as string,
      responsable_local_id: req.query.responsable_local_id as string,
      createdBy: req.query.createdBy as string,
      dateCreation: req.query.dateCreation as string,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof IdentificationFilters] === undefined) {
        delete filters[key as keyof IdentificationFilters];
      }
    });

    const filteredData = applyFilters(identifications, filters);
    const paginatedResult = applyPagination(filteredData, { page, limit });

    res.json({
      success: true,
      data: paginatedResult,
    });
  } catch (error) {
    console.error("Error fetching identifications:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des identifications",
    });
  }
};

// Get single identification by ID
export const getIdentification: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const identification = identifications.find((i) => i.id === id);

    if (!identification) {
      return res.status(404).json({
        success: false,
        message: "Identification non trouvée",
      });
    }

    res.json({
      success: true,
      data: identification,
    });
  } catch (error) {
    console.error("Error fetching identification:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'identification",
    });
  }
};

// Create new identification
export const createIdentification: RequestHandler = async (req, res) => {
  try {
    let data: CreateIdentificationInput & { token?: string };
    let images: Express.Multer.File[] = [];

    // Check if request contains FormData (with images)
    if (req.is("multipart/form-data")) {
      // Parse JSON data from the 'data' field
      if (req.body.data) {
        data = JSON.parse(req.body.data);
      } else {
        return res.status(400).json({
          success: false,
          message: "Données manquantes dans la requête FormData",
        });
      }

      // Get uploaded images
      if (req.files && Array.isArray(req.files)) {
        images = req.files;
      } else if (req.files && "images" in req.files) {
        images = req.files.images as Express.Multer.File[];
      }
    } else {
      // Regular JSON request
      data = req.body;
    }

    // Basic validation
    if (!data.infos_sujet?.nni || !data.createdBy) {
      return res.status(400).json({
        success: false,
        message: "Le NNI du sujet et le créateur sont requis",
      });
    }

    // Forward to the actual backend API
    const apiUrl = process.env.SERVER_API_URL;
    const { token } = data;

    try {
      let response;

      if (images.length > 0) {
        // Create FormData for the backend request
        const FormData = require("form-data");
        const formData = new FormData();

        // Add JSON data
        formData.append(
          "data",
          JSON.stringify({
            infos_sujet: data.infos_sujet,
            infos_mere: data.infos_mere,
            grand_pere_maternel: data.grand_pere_maternel,
            pere: data.pere,
            grand_pere_paternel: data.grand_pere_paternel,
            grand_mere_paternelle: data.grand_mere_paternelle,
            complem: data.complem,
            createdBy: data.createdBy,
          }),
        );

        // Add images
        images.forEach((image, index) => {
          formData.append("images", image.buffer, image.originalname);
        });

        response = await axios.post(`${apiUrl}identifications`, formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Regular JSON request
        response = await axios.post(
          `${apiUrl}identifications`,
          {
            infos_sujet: data.infos_sujet,
            infos_mere: data.infos_mere,
            grand_pere_maternel: data.grand_pere_maternel,
            pere: data.pere,
            grand_pere_paternel: data.grand_pere_paternel,
            grand_mere_paternelle: data.grand_mere_paternelle,
            complem: data.complem,
            createdBy: data.createdBy,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      res.status(201).json({
        success: true,
        data: response.data,
        message: "Identification créée avec succès",
      });
    } catch (apiError: any) {
      console.error(
        "Error calling backend API:",
        apiError.response?.data || apiError.message,
      );
      res.status(apiError.response?.status || 500).json({
        success: false,
        message:
          apiError.response?.data?.message ||
          "Erreur lors de la création de l'identification",
      });
    }
  } catch (error) {
    console.error("Error creating identification:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'identification",
    });
  }
};

// Update identification
export const updateIdentification: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    let data: UpdateIdentificationInput & { token?: string };
    let images: Express.Multer.File[] = [];

    // Check if request contains FormData (with images)
    if (req.is("multipart/form-data")) {
      // Parse JSON data from the 'data' field
      if (req.body.data) {
        data = JSON.parse(req.body.data);
      } else {
        return res.status(400).json({
          success: false,
          message: "Données manquantes dans la requête FormData",
        });
      }

      // Get uploaded images
      if (req.files && Array.isArray(req.files)) {
        images = req.files;
      } else if (req.files && "images" in req.files) {
        images = req.files.images as Express.Multer.File[];
      }
    } else {
      // Regular JSON request
      data = req.body;
    }

    // Forward to the actual backend API
    const apiUrl = process.env.SERVER_API_URL;
    const { token } = data;

    try {
      let response;

      if (images.length > 0) {
        // Create FormData for the backend request
        const FormData = require("form-data");
        const formData = new FormData();

        // Add JSON data
        const updateData: UpdateIdentificationInput = {};
        if (data.infos_sujet) updateData.infos_sujet = data.infos_sujet;
        if (data.infos_mere) updateData.infos_mere = data.infos_mere;
        if (data.grand_pere_maternel)
          updateData.grand_pere_maternel = data.grand_pere_maternel;
        if (data.pere) updateData.pere = data.pere;
        if (data.grand_pere_paternel)
          updateData.grand_pere_paternel = data.grand_pere_paternel;
        if (data.grand_mere_paternelle)
          updateData.grand_mere_paternelle = data.grand_mere_paternelle;
        if (data.complem) updateData.complem = data.complem;

        formData.append("data", JSON.stringify(updateData));

        // Add images
        images.forEach((image, index) => {
          formData.append("images", image.buffer, image.originalname);
        });

        response = await axios.put(`${apiUrl}identifications/${id}`, formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Regular JSON request
        const updateData: UpdateIdentificationInput = {};
        if (data.infos_sujet) updateData.infos_sujet = data.infos_sujet;
        if (data.infos_mere) updateData.infos_mere = data.infos_mere;
        if (data.grand_pere_maternel)
          updateData.grand_pere_maternel = data.grand_pere_maternel;
        if (data.pere) updateData.pere = data.pere;
        if (data.grand_pere_paternel)
          updateData.grand_pere_paternel = data.grand_pere_paternel;
        if (data.grand_mere_paternelle)
          updateData.grand_mere_paternelle = data.grand_mere_paternelle;
        if (data.complem) updateData.complem = data.complem;

        response = await axios.put(
          `${apiUrl}identifications/${id}`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      res.json({
        success: true,
        data: response.data,
        message: "Identification mise à jour avec succès",
      });
    } catch (apiError: any) {
      console.error(
        "Error calling backend API:",
        apiError.response?.data || apiError.message,
      );
      res.status(apiError.response?.status || 500).json({
        success: false,
        message:
          apiError.response?.data?.message ||
          "Erreur lors de la mise à jour de l'identification",
      });
    }
  } catch (error) {
    console.error("Error updating identification:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'identification",
    });
  }
};

// Delete identification
export const deleteIdentification: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const identificationIndex = identifications.findIndex((i) => i.id === id);

    if (identificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Identification non trouvée",
      });
    }

    identifications.splice(identificationIndex, 1);

    res.json({
      success: true,
      message: "Identification supprimée avec succès",
    });
  } catch (error) {
    console.error("Error deleting identification:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'identification",
    });
  }
};

// Get identification statistics
export const getIdentificationStats: RequestHandler = (req, res) => {
  try {
    const stats: IdentificationStats = {
      total: identifications.length,
      bovins: identifications.filter(
        (i) => i.infos_sujet.type === TypeAnimal.BOVIN,
      ).length,
      ovins: identifications.filter(
        (i) => i.infos_sujet.type === TypeAnimal.OVIN,
      ).length,
      caprins: identifications.filter(
        (i) => i.infos_sujet.type === TypeAnimal.CAPRIN,
      ).length,
      maleCount: identifications.filter((i) => i.infos_sujet.sexe === Sexe.MALE)
        .length,
      femelleCount: identifications.filter(
        (i) => i.infos_sujet.sexe === Sexe.FEMELLE,
      ).length,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching identification stats:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};
