import { z } from "zod";

// Morphological measurement interface
export interface MorphologyMeasurement {
  valeur: number;
  unite: string;
}

// Base morphology record interface
export interface MorphologyRecord {
  _id: string;
  cow_id: string;
  timestamp: string;
  source_detection: string;
  hauteur_au_garrot: MorphologyMeasurement;
  largeur_du_corps: MorphologyMeasurement;
  longueur_du_corps: MorphologyMeasurement;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Input for creating a new morphology record
export interface CreateMorphologyInput {
  cow_id: string;
  identification_image: File;
  morphology_image: File;
  source_detection?: string;
}

// Response from identification image processing
export interface IdentificationImageResponse {
  success: boolean;
  data?: {
    cow_id: string;
    confidence: number;
  };
  message?: string;
}

// Response from morphology image processing
export interface MorphologyImageResponse {
  success: boolean;
  data?: {
    hauteur_au_garrot: MorphologyMeasurement;
    largeur_du_corps: MorphologyMeasurement;
    longueur_du_corps: MorphologyMeasurement;
    confidence: number;
  };
  message?: string;
}

// Search/filter parameters
export interface MorphologyFilters {
  cow_id?: string;
  source_detection?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API response types
export interface MorphologyResponse {
  success: boolean;
  data?: MorphologyRecord;
  message?: string;
}

export interface MorphologyListResponse {
  success: boolean;
  data?: PaginatedResponse<MorphologyRecord>;
  message?: string;
}

// Statistics interface
export interface MorphologyStats {
  total: number;
  thisMonth: number;
  averageHeight: number;
  averageWidth: number;
  averageLength: number;
}

// Multi-step form states
export type MorphologyFormStep = "identification" | "morphology" | "results";

export interface MorphologyFormData {
  cow_id: string;
  identification_image?: File;
  morphology_image?: File;
  source_detection: string;
  measurements?: {
    hauteur_au_garrot: MorphologyMeasurement;
    largeur_du_corps: MorphologyMeasurement;
    longueur_du_corps: MorphologyMeasurement;
  };
}

// Zod validation schemas
export const MorphologyMeasurementSchema = z.object({
  valeur: z.number().positive("La valeur doit être positive"),
  unite: z.string().min(1, "L'unité est requise"),
});

export const CreateMorphologySchema = z.object({
  cow_id: z.string().min(1, "L'ID de la vache est requis"),
  source_detection: z.string().min(1, "La source de détection est requise"),
  hauteur_au_garrot: MorphologyMeasurementSchema,
  largeur_du_corps: MorphologyMeasurementSchema,
  longueur_du_corps: MorphologyMeasurementSchema,
});

export const MorphologyFiltersSchema = z.object({
  cow_id: z.string().optional(),
  source_detection: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  createdBy: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
