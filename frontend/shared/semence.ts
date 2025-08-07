import { z } from "zod";

// Base semence record interface
export interface SemenceRecord {
  id: string;
  identificateur: string;
  nom_taureau: string;
  race_taureau: string;
  num_taureau: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Input for creating a new semence record
export interface CreateSemenceInput {
  identificateur: string;
  nom_taureau: string;
  race_taureau: string;
  num_taureau: string;
  createdBy: string;
  token?: string;
}

// Input for updating an existing semence record
export interface UpdateSemenceInput {
  identificateur?: string;
  nom_taureau?: string;
  race_taureau?: string;
  num_taureau?: string;
}

// Search/filter parameters
export interface SemenceFilters {
  identificateur?: string;
  nom_taureau?: string;
  race_taureau?: string;
  num_taureau?: string;
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
export interface SemenceResponse {
  success: boolean;
  data?: SemenceRecord;
  message?: string;
}

export interface SemenceListResponse {
  success: boolean;
  data?: PaginatedResponse<SemenceRecord>;
  message?: string;
}

// Statistics interface
export interface SemenceStats {
  total: number;
  thisMonth: number;
  thisYear: number;
  topRaces: Array<{
    race_taureau: string;
    count: number;
  }>;
  topTaureaux: Array<{
    nom_taureau: string;
    count: number;
  }>;
}

// User interface for dropdowns (shared from insemination)
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
export const CreateSemenceSchema = z.object({
  identificateur: z.string().min(1, "L'identificateur est requis"),
  nom_taureau: z.string().min(1, "Le nom du taureau est requis"),
  race_taureau: z.string().min(1, "La race du taureau est requise"),
  num_taureau: z.string().min(1, "Le numéro du taureau est requis"),
  createdBy: z.string().min(1, "Le créateur est requis"),
});

export const UpdateSemenceSchema = z.object({
  identificateur: z.string().min(1, "L'identificateur est requis").optional(),
  nom_taureau: z.string().min(1, "Le nom du taureau est requis").optional(),
  race_taureau: z.string().min(1, "La race du taureau est requise").optional(),
  num_taureau: z.string().min(1, "Le numéro du taureau est requis").optional(),
});

export const SemenceFiltersSchema = z.object({
  identificateur: z.string().optional(),
  nom_taureau: z.string().optional(),
  race_taureau: z.string().optional(),
  num_taureau: z.string().optional(),
  createdBy: z.string().optional(),
  dateCreation: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
