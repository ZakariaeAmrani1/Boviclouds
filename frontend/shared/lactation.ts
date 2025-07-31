import { z } from "zod";

// Base lactation record interface
export interface LactationRecord {
  id: string;
  sujet_id: string;
  date_velage: string;
  n_lactation: number;
  lait_kg: number;
  kg_mg: number;
  pct_proteine: number;
  pct_mg: number;
  controleur_laitier_id: string;
  createdAt: string;
  updatedAt: string;
}

// Input for creating a new lactation record
export interface CreateLactationInput {
  sujet_id: string;
  date_velage: string;
  n_lactation: number;
  lait_kg: number;
  kg_mg: number;
  pct_proteine: number;
  pct_mg: number;
  controleur_laitier_id: string;
}

// Input for updating an existing lactation record
export interface UpdateLactationInput {
  sujet_id?: string;
  date_velage?: string;
  n_lactation?: number;
  lait_kg?: number;
  kg_mg?: number;
  pct_proteine?: number;
  pct_mg?: number;
  controleur_laitier_id?: string;
}

// Search/filter parameters
export interface LactationFilters {
  sujet_id?: string;
  date_velage?: string;
  n_lactation?: number;
  lait_kg_min?: number;
  lait_kg_max?: number;
  controleur_laitier_id?: string;
  date_min?: string;
  date_max?: string;
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
export interface LactationResponse {
  success: boolean;
  data?: LactationRecord;
  message?: string;
}

export interface LactationListResponse {
  success: boolean;
  data?: PaginatedResponse<LactationRecord>;
  message?: string;
}

// Statistics interface
export interface LactationStats {
  total: number;
  thisMonth: number;
  thisYear: number;
  averageLaitKg: number;
  averagePctProteine: number;
  averagePctMg: number;
  topProducers: Array<{
    sujet_id: string;
    totalLaitKg: number;
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

// Identification interface for dropdowns
export interface Identification {
  id: string;
  nni: string;
  nom: string;
  race: string;
}

// Users list response
export interface UsersListResponse {
  success: boolean;
  data?: User[];
  message?: string;
}

// Identifications list response
export interface IdentificationsListResponse {
  success: boolean;
  data?: Identification[];
  message?: string;
}

// Zod validation schemas
export const CreateLactationSchema = z.object({
  sujet_id: z.string().min(1, "Le sujet est requis"),
  date_velage: z.string().min(1, "La date de vêlage est requise"),
  n_lactation: z.number().min(1, "Le numéro de lactation doit être supérieur à 0"),
  lait_kg: z.number().min(0, "La quantité de lait ne peut pas être négative"),
  kg_mg: z.number().min(0, "Le kg MG ne peut pas être négatif"),
  pct_proteine: z.number().min(0).max(100, "Le pourcentage de protéine doit être entre 0 et 100"),
  pct_mg: z.number().min(0).max(100, "Le pourcentage MG doit être entre 0 et 100"),
  controleur_laitier_id: z.string().min(1, "Le contrôleur laitier est requis"),
});

export const UpdateLactationSchema = z.object({
  sujet_id: z.string().min(1, "Le sujet est requis").optional(),
  date_velage: z.string().min(1, "La date de vêlage est requise").optional(),
  n_lactation: z.number().min(1, "Le numéro de lactation doit être supérieur à 0").optional(),
  lait_kg: z.number().min(0, "La quantité de lait ne peut pas être négative").optional(),
  kg_mg: z.number().min(0, "Le kg MG ne peut pas être négatif").optional(),
  pct_proteine: z.number().min(0).max(100, "Le pourcentage de protéine doit être entre 0 et 100").optional(),
  pct_mg: z.number().min(0).max(100, "Le pourcentage MG doit être entre 0 et 100").optional(),
  controleur_laitier_id: z.string().min(1, "Le contrôleur laitier est requis").optional(),
});

export const LactationFiltersSchema = z.object({
  sujet_id: z.string().optional(),
  date_velage: z.string().optional(),
  n_lactation: z.number().optional(),
  lait_kg_min: z.number().optional(),
  lait_kg_max: z.number().optional(),
  controleur_laitier_id: z.string().optional(),
  date_min: z.string().optional(),
  date_max: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
