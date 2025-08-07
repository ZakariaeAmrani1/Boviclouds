import { z } from "zod";

// Base insemination record interface
export interface InseminationRecord {
  id: string;
  nni: string;
  date_dissemination: string;
  semence_id: string;
  inseminateur_id: string;
  responsable_local_id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Input for creating a new insemination record
export interface CreateInseminationInput {
  nni: string;
  date_dissemination: string;
  semence_id: string;
  inseminateur_id: string;
  responsable_local_id: string;
  createdBy: string;
  token?: string;
}

// Input for updating an existing insemination record
export interface UpdateInseminationInput {
  nni?: string;
  date_dissemination?: string;
  semence_id?: string;
  inseminateur_id?: string;
  responsable_local_id?: string;
  token?: string;
}

// Search/filter parameters
export interface InseminationFilters {
  nni?: string;
  semence_id?: string;
  inseminateur_id?: string;
  responsable_local_id?: string;
  date_dissemination?: string;
  createdBy?: string;
  dateCreation?: string;
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
export interface InseminationResponse {
  success: boolean;
  data?: InseminationRecord;
  message?: string;
}

export interface InseminationListResponse {
  success: boolean;
  data?: PaginatedResponse<InseminationRecord>;
  message?: string;
}

// Statistics interface
export interface InseminationStats {
  total: number;
  thisMonth: number;
  thisYear: number;
  successRate: number;
  topInseminateurs: Array<{
    inseminateur_id: string;
    count: number;
  }>;
}

// User interface for dropdowns
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

// Users list response
export interface UsersListResponse {
  success: boolean;
  data?: User[];
  message?: string;
}

// Zod validation schemas
export const CreateInseminationSchema = z.object({
  nni: z.string().min(1, "Le NNI est requis"),
  date_dissemination: z.string().min(1, "La date de dissémination est requise"),
  semence_id: z.string().min(1, "L'ID de la semence est requis"),
  inseminateur_id: z.string().min(1, "L'inséminateur est requis"),
  responsable_local_id: z.string().min(1, "Le responsable local est requis"),
  createdBy: z.string().min(1, "Le créateur est requis"),
});

export const UpdateInseminationSchema = z.object({
  nni: z.string().min(1, "Le NNI est requis").optional(),
  date_dissemination: z
    .string()
    .min(1, "La date de dissémination est requise")
    .optional(),
  semence_id: z.string().min(1, "L'ID de la semence est requis").optional(),
  inseminateur_id: z.string().min(1, "L'inséminateur est requis").optional(),
  responsable_local_id: z
    .string()
    .min(1, "Le responsable local est requis")
    .optional(),
});

export const InseminationFiltersSchema = z.object({
  nni: z.string().optional(),
  semence_id: z.string().optional(),
  inseminateur_id: z.string().optional(),
  responsable_local_id: z.string().optional(),
  date_dissemination: z.string().optional(),
  createdBy: z.string().optional(),
  dateCreation: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
