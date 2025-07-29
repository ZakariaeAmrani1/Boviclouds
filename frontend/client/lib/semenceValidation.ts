import { z } from "zod";
import {
  CreateSemenceSchema as BaseCreateSchema,
  UpdateSemenceSchema as BaseUpdateSchema,
} from "@shared/semence";

// Custom validation messages in French
const requiredMsg = "Ce champ est requis";
const invalidIdentificateurMsg = "Format d'identificateur invalide";
const invalidNumTaureauMsg = "Format de numéro de taureau invalide";

// Identificateur validation pattern (semence identification format)
const IDENTIFICATEUR_PATTERN = /^SEM\d{6}$/;

// Numéro taureau validation pattern
const NUM_TAUREAU_PATTERN = /^[A-Z]{2}\d{8}$/;

// Enhanced identificateur validation
const identificateurValidation = z
  .string()
  .min(1, requiredMsg)
  .regex(IDENTIFICATEUR_PATTERN, invalidIdentificateurMsg)
  .transform((val) => val.toUpperCase());

// Enhanced numéro taureau validation
const numTaureauValidation = z
  .string()
  .min(1, requiredMsg)
  .regex(NUM_TAUREAU_PATTERN, invalidNumTaureauMsg)
  .transform((val) => val.toUpperCase());

// Nom taureau validation
const nomTaureauValidation = z
  .string()
  .min(1, requiredMsg)
  .min(2, "Le nom du taureau doit contenir au moins 2 caractères")
  .max(50, "Le nom du taureau ne peut pas dépasser 50 caractères")
  .regex(/^[A-Za-zÀ-ÿ\s-']+$/, "Le nom du taureau ne peut contenir que des lettres, espaces, tirets et apostrophes");

// Race taureau validation
const raceTaureauValidation = z
  .string()
  .min(1, requiredMsg)
  .min(2, "La race du taureau doit contenir au moins 2 caractères")
  .max(30, "La race du taureau ne peut pas dépasser 30 caractères")
  .regex(/^[A-Za-zÀ-ÿ\s-]+$/, "La race du taureau ne peut contenir que des lettres, espaces et tirets");

// Client-side specific validation schemas with enhanced error messages

// Full create semence validation schema
export const CreateSemenceValidationSchema = z
  .object({
    identificateur: identificateurValidation,
    nom_taureau: nomTaureauValidation,
    race_taureau: raceTaureauValidation,
    num_taureau: numTaureauValidation,
    createdBy: z.string().min(1, "Le créateur est requis"),
  })
  .superRefine((data, ctx) => {
    // Cross-validation rules

    // 1. Validate that identificateur and num_taureau are different
    if (data.identificateur === data.num_taureau) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "L'identificateur et le numéro du taureau doivent être différents",
        path: ["num_taureau"],
      });
    }

    // 2. Validate common taureau names (basic validation)
    const commonNames = ["INCONNU", "UNKNOWN", "TEST", "TEMP"];
    if (commonNames.includes(data.nom_taureau.toUpperCase())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Veuillez saisir le nom réel du taureau",
        path: ["nom_taureau"],
      });
    }

    // 3. Validate common races (basic validation)
    const commonRaces = ["INCONNU", "UNKNOWN", "TEST", "TEMP"];
    if (commonRaces.includes(data.race_taureau.toUpperCase())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Veuillez saisir la race réelle du taureau",
        path: ["race_taureau"],
      });
    }
  });

// Update semence validation schema
export const UpdateSemenceValidationSchema = z
  .object({
    identificateur: identificateurValidation.optional(),
    nom_taureau: nomTaureauValidation.optional(),
    race_taureau: raceTaureauValidation.optional(),
    num_taureau: numTaureauValidation.optional(),
  })
  .superRefine((data, ctx) => {
    // Cross-validation rules for updates (only validate if fields are present)

    // 1. Validate that identificateur and num_taureau are different (if both are present)
    if (
      data.identificateur &&
      data.num_taureau &&
      data.identificateur === data.num_taureau
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "L'identificateur et le numéro du taureau doivent être différents",
        path: ["num_taureau"],
      });
    }

    // 2. Validate taureau name (if present)
    if (data.nom_taureau) {
      const commonNames = ["INCONNU", "UNKNOWN", "TEST", "TEMP"];
      if (commonNames.includes(data.nom_taureau.toUpperCase())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Veuillez saisir le nom réel du taureau",
          path: ["nom_taureau"],
        });
      }
    }

    // 3. Validate race (if present)
    if (data.race_taureau) {
      const commonRaces = ["INCONNU", "UNKNOWN", "TEST", "TEMP"];
      if (commonRaces.includes(data.race_taureau.toUpperCase())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Veuillez saisir la race réelle du taureau",
          path: ["race_taureau"],
        });
      }
    }
  });

// Filter validation schema
export const SemenceFiltersValidationSchema = z.object({
  identificateur: z.string().optional(),
  nom_taureau: z.string().optional(),
  race_taureau: z.string().optional(),
  num_taureau: z.string().optional(),
  createdBy: z.string().optional(),
  dateCreation: z.string().optional(),
});

// Utility function to format validation errors
export const formatValidationErrors = (
  error: z.ZodError,
): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formattedErrors[path] = err.message;
  });

  return formattedErrors;
};

// Utility function to validate identificateur format only
export const validateIdentificateurFormat = (identificateur: string): boolean => {
  return IDENTIFICATEUR_PATTERN.test(identificateur.toUpperCase());
};

// Utility function to validate numéro taureau format only
export const validateNumTaureauFormat = (numTaureau: string): boolean => {
  return NUM_TAUREAU_PATTERN.test(numTaureau.toUpperCase());
};

// Utility function to validate nom taureau
export const validateNomTaureau = (nomTaureau: string): boolean => {
  const nameRegex = /^[A-Za-zÀ-ÿ\s-']+$/;
  return nameRegex.test(nomTaureau) && nomTaureau.length >= 2 && nomTaureau.length <= 50;
};

// Utility function to validate race taureau
export const validateRaceTaureau = (raceTaureau: string): boolean => {
  const raceRegex = /^[A-Za-zÀ-ÿ\s-]+$/;
  return raceRegex.test(raceTaureau) && raceTaureau.length >= 2 && raceTaureau.length <= 30;
};

// Utility function to generate a sample identificateur
export const generateSampleIdentificateur = (): string => {
  const randomNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `SEM${randomNumber}`;
};

// Utility function to generate a sample numéro taureau
export const generateSampleNumTaureau = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
                       letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNumber = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  return `${randomLetters}${randomNumber}`;
};

// Common races list for dropdown/suggestions
export const COMMON_RACES = [
  "Holstein",
  "Charolaise",
  "Limousine",
  "Blonde d'Aquitaine",
  "Simmental",
  "Angus",
  "Aubrac",
  "Salers",
  "Gasconne",
  "Parthenaise",
];

// Export types for TypeScript inference
export type CreateSemenceFormData = z.infer<
  typeof CreateSemenceValidationSchema
>;
export type UpdateSemenceFormData = z.infer<
  typeof UpdateSemenceValidationSchema
>;
export type SemenceFiltersFormData = z.infer<
  typeof SemenceFiltersValidationSchema
>;
