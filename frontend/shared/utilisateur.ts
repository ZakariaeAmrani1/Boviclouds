import { z } from "zod";

// Status enum for utilisateur records
export enum UtilisateurStatus {
  ACTIF = "Actif",
  INACTIF = "Inactif",
  SUSPENDU = "Suspendu",
  EN_ATTENTE = "En attente",
}

// Role enum for utilisateur records
export enum UtilisateurRole {
  ADMINISTRATEUR = "Administrateur",
  INSEMINATEUR = "Inseminateur",
  IDENTIFICATEUR = "Identificateur",
  ELEVEUR = "Éleveur",
  CONTROLEUR = "Contrôleur",
  SUPPORT = "Non Définit",
}

// Base utilisateur record interface
export interface UtilisateurRecord {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  password: string;
  telephone?: string;
  role: UtilisateurRole;
  statut: UtilisateurStatus;
  civilite?: string;
  exploitation?: string;
  codeExploitation?: string;
  adresse?: string;
  region?: string;
  ville?: string;
  codePostal?: string;
  province?: string;
  dateCreation: string;
  dateModification: string;
  dernierConnexion?: string;
  notes?: string;
  avatar?: string;
}

// Input for creating a new utilisateur record
export interface CreateUtilisateurInput {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  telephone?: string;
  role: UtilisateurRole;
  statut?: UtilisateurStatus;
  exploitation?: string;
  codeExploitation?: string;
  adresse?: string;
  ville?: string;
  province?: string;
  region?: string;
  codePostal?: string;
  notes?: string;
}

// Input for updating an existing utilisateur record
export interface UpdateUtilisateurInput {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  role?: UtilisateurRole;
  statut?: UtilisateurStatus;
  exploitation?: string;
  codeExploitation?: string;
  adresse?: string;
  ville?: string;
  province?: string;
  region?: string;
  codePostal?: string;
  notes?: string;
}

// Search/filter parameters
export interface UtilisateurFilters {
  nom?: string;
  email?: string;
  role?: UtilisateurRole;
  statut?: UtilisateurStatus;
  exploitation?: string;
  codeExploitation?: string;
  ville?: string;
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
export interface UtilisateurResponse {
  success: boolean;
  data?: UtilisateurRecord;
  message?: string;
}

export interface UtilisateurListResponse {
  success: boolean;
  data?: PaginatedResponse<UtilisateurRecord>;
  message?: string;
}

// Zod validation schemas
export const CreateUtilisateurSchema = z.object({
  prenom: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  nom: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string().email("Format d'email invalide"),
  telephone: z.string().optional(),
  role: z.nativeEnum(UtilisateurRole, { required_error: "Le rôle est requis" }),
  statut: z.nativeEnum(UtilisateurStatus).optional(),
  exploitation: z.string().optional(),
  codeExploitation: z.string().optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateUtilisateurSchema = z.object({
  prenom: z
    .string()
    .min(1, "Le prénom ne peut pas être vide")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .optional(),
  nom: z
    .string()
    .min(1, "Le nom ne peut pas être vide")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .optional(),
  email: z.string().email("Format d'email invalide").optional(),
  telephone: z.string().optional(),
  role: z.nativeEnum(UtilisateurRole).optional(),
  statut: z.nativeEnum(UtilisateurStatus).optional(),
  exploitation: z.string().optional(),
  codeExploitation: z.string().optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z.string().optional(),
  notes: z.string().optional(),
});

export const UtilisateurFiltersSchema = z.object({
  nom: z.string().optional(),
  email: z.string().optional(),
  role: z.nativeEnum(UtilisateurRole).optional(),
  statut: z.nativeEnum(UtilisateurStatus).optional(),
  exploitation: z.string().optional(),
  codeExploitation: z.string().optional(),
  ville: z.string().optional(),
  dateCreation: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Utility function to get full name
export const getFullName = (utilisateur: UtilisateurRecord): string => {
  return `${utilisateur.prenom} ${utilisateur.nom}`;
};

// Utility function to get initials
export const getInitials = (utilisateur: UtilisateurRecord): string => {
  return `${utilisateur.prenom.charAt(0)}${utilisateur.nom.charAt(0)}`.toUpperCase();
};
