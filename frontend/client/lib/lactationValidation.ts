import { z } from "zod";
import {
  CreateLactationSchema as BaseCreateSchema,
  UpdateLactationSchema as BaseUpdateSchema,
} from "@shared/lactation";

// Custom validation messages in French
const requiredMsg = "Ce champ est requis";
const invalidDateMsg = "Format de date invalide";
const invalidNumberMsg = "Nombre invalide";

// Date validation (must be a valid date)
const dateValidation = z
  .string()
  .min(1, requiredMsg)
  .refine((date) => !isNaN(Date.parse(date)), invalidDateMsg)
  .transform((date) => {
    // Ensure the date is in YYYY-MM-DD format for consistent storage
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  });

// Lactation number validation (must be positive integer)
const lactationNumberValidation = z
  .number()
  .int("Le numéro de lactation doit être un nombre entier")
  .min(1, "Le numéro de lactation doit être au moins 1")
  .max(20, "Le numéro de lactation ne peut pas dépasser 20");

// Milk quantity validation (must be positive)
const milkQuantityValidation = z
  .number()
  .min(0, "La quantité de lait ne peut pas être négative")
  .max(100, "La quantité de lait semble trop élevée (max 100kg)")
  .refine((val) => val >= 0, "La quantité de lait doit être positive");

// MG quantity validation
const mgQuantityValidation = z
  .number()
  .min(0, "Le kg MG ne peut pas être négatif")
  .max(10, "Le kg MG semble trop élevé (max 10kg)")
  .refine((val) => val >= 0, "Le kg MG doit être positif");

// Protein percentage validation
const proteinPercentageValidation = z
  .number()
  .min(0, "Le pourcentage de protéine ne peut pas être négatif")
  .max(15, "Le pourcentage de protéine semble trop élevé (max 15%)")
  .refine((val) => val >= 0 && val <= 100, "Le pourcentage doit être entre 0 et 100");

// MG percentage validation
const mgPercentageValidation = z
  .number()
  .min(0, "Le pourcentage MG ne peut pas être négatif")
  .max(15, "Le pourcentage MG semble trop élevé (max 15%)")
  .refine((val) => val >= 0 && val <= 100, "Le pourcentage doit être entre 0 et 100");

// Subject ID validation (MongoDB ObjectId)
const subjectIdValidation = z
  .string()
  .min(1, requiredMsg)
  .regex(/^[0-9a-fA-F]{24}$/, "Identifiant de sujet invalide");

// Controleur laitier ID validation (MongoDB ObjectId)
const controleurIdValidation = z
  .string()
  .min(1, requiredMsg)
  .regex(/^[0-9a-fA-F]{24}$/, "Identifiant de contrôleur laitier invalide");

// Client-side specific validation schemas with enhanced error messages

// Full create lactation validation schema
export const CreateLactationValidationSchema = z
  .object({
    sujet_id: subjectIdValidation,
    date_velage: dateValidation,
    n_lactation: lactationNumberValidation,
    lait_kg: milkQuantityValidation,
    kg_mg: mgQuantityValidation,
    pct_proteine: proteinPercentageValidation,
    pct_mg: mgPercentageValidation,
    controleur_laitier_id: controleurIdValidation,
  })
  .superRefine((data, ctx) => {
    // Cross-validation rules

    // 1. Date velage cannot be in the future
    const velageDate = new Date(data.date_velage);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (velageDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de vêlage ne peut pas être dans le futur",
        path: ["date_velage"],
      });
    }

    // 2. Date velage should not be too old (reasonable range)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    
    if (velageDate < tenYearsAgo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de vêlage semble trop ancienne (plus de 10 ans)",
        path: ["date_velage"],
      });
    }

    // 3. Validate MG percentage is consistent with MG quantity
    if (data.lait_kg > 0 && data.kg_mg > 0) {
      const calculatedMgPct = (data.kg_mg / data.lait_kg) * 100;
      const tolerance = 0.5; // 0.5% tolerance
      
      if (Math.abs(calculatedMgPct - data.pct_mg) > tolerance) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Le pourcentage MG (${data.pct_mg}%) ne correspond pas au calcul (${calculatedMgPct.toFixed(2)}%)`,
          path: ["pct_mg"],
        });
      }
    }

    // 4. Validate realistic protein percentage (typically 2.8-4.5%)
    if (data.pct_proteine < 2.5 || data.pct_proteine > 5.0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le pourcentage de protéine semble hors norme (attendu: 2.5-5.0%)",
        path: ["pct_proteine"],
      });
    }

    // 5. Validate realistic MG percentage (typically 3.0-5.5%)
    if (data.pct_mg < 2.5 || data.pct_mg > 6.0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le pourcentage MG semble hors norme (attendu: 2.5-6.0%)",
        path: ["pct_mg"],
      });
    }

    // 6. Validate reasonable milk production for lactation number
    if (data.n_lactation === 1 && data.lait_kg > 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Production élevée pour une première lactation (vérifiez les données)",
        path: ["lait_kg"],
      });
    }
  });

// Update lactation validation schema
export const UpdateLactationValidationSchema = z
  .object({
    sujet_id: subjectIdValidation.optional(),
    date_velage: dateValidation.optional(),
    n_lactation: lactationNumberValidation.optional(),
    lait_kg: milkQuantityValidation.optional(),
    kg_mg: mgQuantityValidation.optional(),
    pct_proteine: proteinPercentageValidation.optional(),
    pct_mg: mgPercentageValidation.optional(),
    controleur_laitier_id: controleurIdValidation.optional(),
  })
  .superRefine((data, ctx) => {
    // Cross-validation rules for updates (only validate if fields are present)

    // 1. Date validation (if present)
    if (data.date_velage) {
      const velageDate = new Date(data.date_velage);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (velageDate > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La date de vêlage ne peut pas être dans le futur",
          path: ["date_velage"],
        });
      }

      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      
      if (velageDate < tenYearsAgo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La date de vêlage semble trop ancienne (plus de 10 ans)",
          path: ["date_velage"],
        });
      }
    }

    // 2. MG consistency validation (if both values are present)
    if (data.lait_kg !== undefined && data.kg_mg !== undefined && data.pct_mg !== undefined) {
      if (data.lait_kg > 0 && data.kg_mg > 0) {
        const calculatedMgPct = (data.kg_mg / data.lait_kg) * 100;
        const tolerance = 0.5;
        
        if (Math.abs(calculatedMgPct - data.pct_mg) > tolerance) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Le pourcentage MG (${data.pct_mg}%) ne correspond pas au calcul (${calculatedMgPct.toFixed(2)}%)`,
            path: ["pct_mg"],
          });
        }
      }
    }

    // 3. Protein percentage validation (if present)
    if (data.pct_proteine !== undefined && (data.pct_proteine < 2.5 || data.pct_proteine > 5.0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le pourcentage de protéine semble hors norme (attendu: 2.5-5.0%)",
        path: ["pct_proteine"],
      });
    }

    // 4. MG percentage validation (if present)
    if (data.pct_mg !== undefined && (data.pct_mg < 2.5 || data.pct_mg > 6.0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le pourcentage MG semble hors norme (attendu: 2.5-6.0%)",
        path: ["pct_mg"],
      });
    }

    // 5. First lactation validation (if both fields are present)
    if (data.n_lactation !== undefined && data.lait_kg !== undefined) {
      if (data.n_lactation === 1 && data.lait_kg > 60) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Production élevée pour une première lactation (vérifiez les données)",
          path: ["lait_kg"],
        });
      }
    }
  });

// Filter validation schema
export const LactationFiltersValidationSchema = z.object({
  sujet_id: z.string().optional(),
  date_velage: z.string().optional(),
  n_lactation: z.number().optional(),
  lait_kg_min: z.number().min(0).optional(),
  lait_kg_max: z.number().min(0).optional(),
  controleur_laitier_id: z.string().optional(),
  date_min: z.string().optional(),
  date_max: z.string().optional(),
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

// Utility function to validate date format
export const validateDateFormat = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};

// Utility function to calculate MG percentage from quantities
export const calculateMgPercentage = (milkKg: number, mgKg: number): number => {
  if (milkKg <= 0) return 0;
  return (mgKg / milkKg) * 100;
};

// Utility function to calculate MG quantity from percentage
export const calculateMgQuantity = (milkKg: number, mgPct: number): number => {
  return (milkKg * mgPct) / 100;
};

// Utility function to validate reasonable milk production
export const validateMilkProduction = (milkKg: number, lactationNumber: number): boolean => {
  // Basic validation rules based on lactation number
  if (lactationNumber === 1) {
    return milkKg >= 15 && milkKg <= 60; // First lactation range
  } else if (lactationNumber <= 3) {
    return milkKg >= 20 && milkKg <= 70; // Peak lactation range
  } else {
    return milkKg >= 15 && milkKg <= 65; // Later lactation range
  }
};

// Utility function to get expected milk production range
export const getExpectedMilkRange = (lactationNumber: number): { min: number; max: number } => {
  if (lactationNumber === 1) {
    return { min: 15, max: 50 };
  } else if (lactationNumber <= 3) {
    return { min: 20, max: 60 };
  } else {
    return { min: 15, max: 55 };
  }
};

// Utility function to validate percentage values
export const validatePercentage = (percentage: number, min: number = 0, max: number = 100): boolean => {
  return percentage >= min && percentage <= max;
};

// Utility function to format date for display
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

// Utility function to format date for input
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Common validation ranges
export const VALIDATION_RANGES = {
  milkKg: { min: 0, max: 100 },
  mgKg: { min: 0, max: 10 },
  proteinPct: { min: 2.5, max: 5.0 },
  mgPct: { min: 2.5, max: 6.0 },
  lactationNumber: { min: 1, max: 20 },
};

// Export types for TypeScript inference
export type CreateLactationFormData = z.infer<
  typeof CreateLactationValidationSchema
>;
export type UpdateLactationFormData = z.infer<
  typeof UpdateLactationValidationSchema
>;
export type LactationFiltersFormData = z.infer<
  typeof LactationFiltersValidationSchema
>;
