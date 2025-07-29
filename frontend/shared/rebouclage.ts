import { z } from "zod";

// Status enum for rebouclage records
export enum RebouclageStatus {
  ACTIF = "Actif",
  EN_ATTENTE = "En attente",
  ANNULE = "Annulé",
}

// Base rebouclage record interface
export interface RebouclageRecord {
  id: string;
  ancienNNI: string;
  nouveauNNI: string;
  identificateur_id: string;
  dateRebouclage: string;
  dateCreation: string;
  dateModification: string;
  CréePar: string;
}

// Input for creating a new rebouclage record
export interface CreateRebouclageInput {
  ancienNNI: string;
  nouveauNNI: string;
  identificateur_id: string;
  dateRebouclage?: string;
}

// Input for updating an existing rebouclage record
export interface UpdateRebouclageInput {
  ancienNNI?: string;
  nouveauNNI?: string;
  identificateur_id: string;
  dateRebouclage?: string;
  statut?: RebouclageStatus;
  notes?: string;
  codeExploitation?: string;
}

// Search/filter parameters
export interface RebouclageFilters {
  ancienNNI?: string;
  nouveauNNI?: string;
  codeExploitation?: string;
  dateCreation?: string;
  statut?: RebouclageStatus;
  creePar?: string;
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
export interface RebouclageResponse {
  success: boolean;
  data?: RebouclageRecord;
  message?: string;
}

export interface RebouclageListResponse {
  success: boolean;
  data?: PaginatedResponse<RebouclageRecord>;
  message?: string;
}

// Zod validation schemas
export const CreateRebouclageSchema = z.object({
  ancienNNI: z.string().min(1, "L'ancien NNI est requis"),
  nouveauNNI: z.string().min(1, "Le nouveau NNI est requis"),
  dateRebouclage: z.string().optional(),
  creePar: z.string().min(1, "Le créateur est requis"),
  statut: z.nativeEnum(RebouclageStatus).optional(),
  notes: z.string().optional(),
  codeExploitation: z.string().optional(),
});

export const UpdateRebouclageSchema = z.object({
  ancienNNI: z.string().min(1).optional(),
  nouveauNNI: z.string().min(1).optional(),
  dateRebouclage: z.string().optional(),
  statut: z.nativeEnum(RebouclageStatus).optional(),
  notes: z.string().optional(),
  codeExploitation: z.string().optional(),
});

export const RebouclageFiltersSchema = z.object({
  ancienNNI: z.string().optional(),
  nouveauNNI: z.string().optional(),
  codeExploitation: z.string().optional(),
  dateCreation: z.string().optional(),
  statut: z.nativeEnum(RebouclageStatus).optional(),
  creePar: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
