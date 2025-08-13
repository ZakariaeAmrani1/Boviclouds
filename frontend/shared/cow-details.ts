import { z } from "zod";

// Morphological measurement data structure
export interface MorphologicalMeasurement {
  valeur: number;
  unite: string;
  confiance: number;
  etat: string;
  notes: string;
}

export interface MorphologicalData {
  hauteur_au_garrot: MorphologicalMeasurement;
  largeur_du_corps: MorphologicalMeasurement;
  longueur_du_corps: MorphologicalMeasurement;
}

export interface MorphologicalDetection {
  _id: string;
  timestamp: string;
  image_url: string;
  source_detection: string;
  donnees_morphologiques: MorphologicalData;
}

// Family member interfaces with optional names
export interface FamilyMember {
  nni: string;
  nom?: string;
  date_naissance: string;
  race: string;
}

export interface SubjectInfo {
  nni: string;
  date_naissance: string;
  race: string;
  sexe: string;
  photos: string[];
  type: string;
}

export interface MotherInfo {
  nni: string;
  date_naissance: string;
  race: string;
}

export interface ComplementaryInfo {
  eleveur_id: string;
  exploitation_id: string;
  responsable_local_id: string;
}

// Complete detailed cow data structure
export interface DetailedCowData {
  _id: string;
  infos_sujet: SubjectInfo;
  infos_mere: MotherInfo;
  grand_pere_maternel: FamilyMember;
  pere: FamilyMember;
  grand_pere_paternel: FamilyMember;
  grand_mere_paternelle: FamilyMember;
  complem: ComplementaryInfo;
  detections_morphologiques: MorphologicalDetection[];
}

// Chart data structure for growth visualization
export interface GrowthDataPoint {
  date: string;
  timestamp: string;
  hauteur_au_garrot: number;
  largeur_du_corps: number;
  longueur_du_corps: number;
  age_days: number;
  confiance_moyenne: number;
}

// Statistics for morphological data
export interface MorphologicalStats {
  latest: MorphologicalData;
  first: MorphologicalData;
  growth_rates: {
    hauteur_au_garrot: number;
    largeur_du_corps: number;
    longueur_du_corps: number;
  };
  total_measurements: number;
  measurement_span_days: number;
}

// API response type
export interface DetailedCowResponse {
  success: boolean;
  data?: DetailedCowData;
  message?: string;
}

// Zod validation schemas
export const MorphologicalMeasurementSchema = z.object({
  valeur: z.number(),
  unite: z.string(),
  confiance: z.number().min(0).max(1),
  etat: z.string(),
  notes: z.string(),
});

export const MorphologicalDataSchema = z.object({
  hauteur_au_garrot: MorphologicalMeasurementSchema,
  largeur_du_corps: MorphologicalMeasurementSchema,
  longueur_du_corps: MorphologicalMeasurementSchema,
});

export const MorphologicalDetectionSchema = z.object({
  _id: z.string(),
  timestamp: z.string(),
  image_url: z.string(),
  source_detection: z.string(),
  donnees_morphologiques: MorphologicalDataSchema,
});

export const FamilyMemberSchema = z.object({
  nni: z.string(),
  nom: z.string().optional(),
  date_naissance: z.string(),
  race: z.string(),
});

export const SubjectInfoSchema = z.object({
  nni: z.string(),
  date_naissance: z.string(),
  race: z.string(),
  sexe: z.string(),
  photos: z.array(z.string()),
  type: z.string(),
});

export const MotherInfoSchema = z.object({
  nni: z.string(),
  date_naissance: z.string(),
  race: z.string(),
});

export const ComplementaryInfoSchema = z.object({
  eleveur_id: z.string(),
  exploitation_id: z.string(),
  responsable_local_id: z.string(),
});

export const DetailedCowDataSchema = z.object({
  _id: z.string(),
  infos_sujet: SubjectInfoSchema,
  infos_mere: MotherInfoSchema,
  grand_pere_maternel: FamilyMemberSchema,
  pere: FamilyMemberSchema,
  grand_pere_paternel: FamilyMemberSchema,
  grand_mere_paternelle: FamilyMemberSchema,
  complem: ComplementaryInfoSchema,
  detections_morphologiques: z.array(MorphologicalDetectionSchema),
});
