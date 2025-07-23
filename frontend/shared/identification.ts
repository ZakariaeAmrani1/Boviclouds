import { z } from "zod";

// Gender enum
export enum Sexe {
  MALE = "Mâle",
  FEMELLE = "Femelle",
}

// Animal types
export enum TypeAnimal {
  BOVIN = "Bovin",
  OVIN = "Ovin",
  CAPRIN = "Caprin",
}

// Breed types (common breeds for livestock)
export enum Race {
  CHAROLAISE = "Charolaise",
  LIMOUSINE = "Limousine",
  BLONDE_AQUITAINE = "Blonde d'Aquitaine",
  ANGUS = "Angus",
  HOLSTEIN = "Holstein",
  MONTBELIARDE = "Montbéliarde",
  NORMANDE = "Normande",
  TARENTAISE = "Tarentaise",
  AUBRAC = "Aubrac",
  SALERS = "Salers",
  AUTRE = "Autre",
}

// Subject information interface
export interface InfosSujet {
  nni: string;
  date_naissance: string;
  race: Race;
  sexe: Sexe;
  type: TypeAnimal;
}

// Mother information interface
export interface InfosMere {
  nni: string;
  date_naissance: string;
  race: Race;
}

// Maternal grandfather information interface
export interface GrandPereMaternel {
  nni: string;
  date_naissance: string;
  race: Race;
}

// Father information interface
export interface Pere {
  nni: string;
  date_naissance: string;
  race: Race;
}

// Paternal grandfather information interface
export interface GrandPerePaternal {
  nni: string;
  date_naissance: string;
  race: Race;
}

// Paternal grandmother information interface
export interface GrandMerePaternelle {
  nni: string;
  date_naissance: string;
  race: Race;
}

// Complementary information interface
export interface Complem {
  eleveur_id: string;
  exploitation_id: string;
  responsable_local_id: string;
}

// Base identification record interface
export interface IdentificationRecord {
  id: string;
  infos_sujet: InfosSujet;
  infos_mere: InfosMere;
  grand_pere_maternel: GrandPereMaternel;
  pere: Pere;
  grand_pere_paternel: GrandPerePaternal;
  grand_mere_paternelle: GrandMerePaternelle;
  complem: Complem;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Input for creating a new identification record
export interface CreateIdentificationInput {
  infos_sujet: InfosSujet;
  infos_mere: InfosMere;
  grand_pere_maternel: GrandPereMaternel;
  pere: Pere;
  grand_pere_paternel: GrandPerePaternal;
  grand_mere_paternelle: GrandMerePaternelle;
  complem: Complem;
  createdBy: string;
}

// Input for updating an existing identification record
export interface UpdateIdentificationInput {
  infos_sujet?: Partial<InfosSujet>;
  infos_mere?: Partial<InfosMere>;
  grand_pere_maternel?: Partial<GrandPereMaternel>;
  pere?: Partial<Pere>;
  grand_pere_paternel?: Partial<GrandPerePaternal>;
  grand_mere_paternelle?: Partial<GrandMerePaternelle>;
  complem?: Partial<Complem>;
}

// Search/filter parameters
export interface IdentificationFilters {
  nni?: string;
  race?: Race;
  sexe?: Sexe;
  type?: TypeAnimal;
  eleveur_id?: string;
  exploitation_id?: string;
  responsable_local_id?: string;
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
export interface IdentificationResponse {
  success: boolean;
  data?: IdentificationRecord;
  message?: string;
}

export interface IdentificationListResponse {
  success: boolean;
  data?: PaginatedResponse<IdentificationRecord>;
  message?: string;
}

// Statistics interface
export interface IdentificationStats {
  total: number;
  bovins: number;
  ovins: number;
  caprins: number;
  maleCount: number;
  femelleCount: number;
}

// Zod validation schemas
export const InfosSujetSchema = z.object({
  nni: z.string().min(1, "Le NNI est requis"),
  date_naissance: z.string().min(1, "La date de naissance est requise"),
  race: z.nativeEnum(Race),
  sexe: z.nativeEnum(Sexe),
  type: z.nativeEnum(TypeAnimal),
});

export const InfosMereSchema = z.object({
  nni: z.string().min(1, "Le NNI de la mère est requis"),
  date_naissance: z
    .string()
    .min(1, "La date de naissance de la mère est requise"),
  race: z.nativeEnum(Race),
});

export const GrandPereMaternelSchema = z.object({
  nni: z.string().min(1, "Le NNI du grand-père maternel est requis"),
  date_naissance: z
    .string()
    .min(1, "La date de naissance du grand-père maternel est requise"),
  race: z.nativeEnum(Race),
});

export const PereSchema = z.object({
  nni: z.string().min(1, "Le NNI du père est requis"),
  date_naissance: z.string().min(1, "La date de naissance du père est requise"),
  race: z.nativeEnum(Race),
});

export const GrandPerePaternalSchema = z.object({
  nni: z.string().min(1, "Le NNI du grand-père paternel est requis"),
  date_naissance: z
    .string()
    .min(1, "La date de naissance du grand-père paternel est requise"),
  race: z.nativeEnum(Race),
});

export const GrandMerePaternelleSchema = z.object({
  nni: z.string().min(1, "Le NNI de la grand-mère paternelle est requis"),
  date_naissance: z
    .string()
    .min(1, "La date de naissance de la grand-mère paternelle est requise"),
  race: z.nativeEnum(Race),
});

export const ComplemSchema = z.object({
  eleveur_id: z.string().min(1, "L'ID de l'éleveur est requis"),
  exploitation_id: z.string().min(1, "L'ID de l'exploitation est requis"),
  responsable_local_id: z
    .string()
    .min(1, "L'ID du responsable local est requis"),
});

export const CreateIdentificationSchema = z.object({
  infos_sujet: InfosSujetSchema,
  infos_mere: InfosMereSchema,
  grand_pere_maternel: GrandPereMaternelSchema,
  pere: PereSchema,
  grand_pere_paternel: GrandPerePaternalSchema,
  grand_mere_paternelle: GrandMerePaternelleSchema,
  complem: ComplemSchema,
  createdBy: z.string().min(1, "Le créateur est requis"),
});

export const UpdateIdentificationSchema = z.object({
  infos_sujet: InfosSujetSchema.partial().optional(),
  infos_mere: InfosMereSchema.partial().optional(),
  grand_pere_maternel: GrandPereMaternelSchema.partial().optional(),
  pere: PereSchema.partial().optional(),
  grand_pere_paternel: GrandPerePaternalSchema.partial().optional(),
  grand_mere_paternelle: GrandMerePaternelleSchema.partial().optional(),
  complem: ComplemSchema.partial().optional(),
});

export const IdentificationFiltersSchema = z.object({
  nni: z.string().optional(),
  race: z.nativeEnum(Race).optional(),
  sexe: z.nativeEnum(Sexe).optional(),
  type: z.nativeEnum(TypeAnimal).optional(),
  eleveur_id: z.string().optional(),
  exploitation_id: z.string().optional(),
  responsable_local_id: z.string().optional(),
  createdBy: z.string().optional(),
  dateCreation: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
