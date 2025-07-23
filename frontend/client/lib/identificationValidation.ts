import { z } from "zod";
import {
  Race,
  Sexe,
  TypeAnimal,
  CreateIdentificationSchema as BaseCreateSchema,
  UpdateIdentificationSchema as BaseUpdateSchema,
} from "@shared/identification";

// Custom validation messages in French
const requiredMsg = "Ce champ est requis";
const invalidDateMsg = "Date invalide";
const invalidNNIMsg = "Format NNI invalide";

// NNI validation pattern (French livestock identification format)
const NNI_PATTERN = /^[A-Z]{2}\d{10}$/;

// Date validation helper
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date <= new Date();
};

// Enhanced NNI validation
const nniValidation = z
  .string()
  .min(1, requiredMsg)
  .regex(NNI_PATTERN, invalidNNIMsg)
  .transform((val) => val.toUpperCase());

// Enhanced date validation
const dateValidation = z
  .string()
  .min(1, requiredMsg)
  .refine(isValidDate, { message: invalidDateMsg });

// Client-side specific validation schemas with enhanced error messages

// Subject information validation
export const InfosSujetValidationSchema = z.object({
  nni: nniValidation,
  date_naissance: dateValidation,
  race: z.nativeEnum(Race, { required_error: "La race est requise" }),
  sexe: z.nativeEnum(Sexe, { required_error: "Le sexe est requis" }),
  type: z.nativeEnum(TypeAnimal, {
    required_error: "Le type d'animal est requis",
  }),
});

// Mother information validation
export const InfosMereValidationSchema = z.object({
  nni: nniValidation,
  date_naissance: dateValidation,
  race: z.nativeEnum(Race, {
    required_error: "La race de la mère est requise",
  }),
});

// Maternal grandfather validation
export const GrandPereMaternelValidationSchema = z.object({
  nni: nniValidation,
  date_naissance: dateValidation,
  race: z.nativeEnum(Race, {
    required_error: "La race du grand-père maternel est requise",
  }),
});

// Father validation
export const PereValidationSchema = z.object({
  nni: nniValidation,
  date_naissance: dateValidation,
  race: z.nativeEnum(Race, { required_error: "La race du père est requise" }),
});

// Paternal grandfather validation
export const GrandPerePaternalValidationSchema = z.object({
  nni: nniValidation,
  date_naissance: dateValidation,
  race: z.nativeEnum(Race, {
    required_error: "La race du grand-père paternel est requise",
  }),
});

// Paternal grandmother validation
export const GrandMerePaternelleValidationSchema = z.object({
  nni: nniValidation,
  date_naissance: dateValidation,
  race: z.nativeEnum(Race, {
    required_error: "La race de la grand-mère paternelle est requise",
  }),
});

// Complementary information validation
export const ComplemValidationSchema = z.object({
  eleveur_id: z.string().min(1, "L'ID de l'éleveur est requis"),
  exploitation_id: z.string().min(1, "L'ID de l'exploitation est requis"),
  responsable_local_id: z
    .string()
    .min(1, "L'ID du responsable local est requis"),
});

// Full create identification validation schema
export const CreateIdentificationValidationSchema = z
  .object({
    infos_sujet: InfosSujetValidationSchema,
    infos_mere: InfosMereValidationSchema,
    grand_pere_maternel: GrandPereMaternelValidationSchema,
    pere: PereValidationSchema,
    grand_pere_paternel: GrandPerePaternalValidationSchema,
    grand_mere_paternelle: GrandMerePaternelleValidationSchema,
    complem: ComplemValidationSchema,
    createdBy: z.string().min(1, "Le créateur est requis"),
  })
  .superRefine((data, ctx) => {
    // Cross-validation rules

    // 1. Subject birth date should be after parents' birth dates
    const sujetBirth = new Date(data.infos_sujet.date_naissance);
    const mereBirth = new Date(data.infos_mere.date_naissance);
    const pereBirth = new Date(data.pere.date_naissance);

    if (sujetBirth <= mereBirth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La date de naissance du sujet doit être postérieure à celle de la mère",
        path: ["infos_sujet", "date_naissance"],
      });
    }

    if (sujetBirth <= pereBirth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La date de naissance du sujet doit être postérieure à celle du père",
        path: ["infos_sujet", "date_naissance"],
      });
    }

    // 2. Parents should be born after grandparents
    const grandPereMBirth = new Date(data.grand_pere_maternel.date_naissance);
    const grandPerePBirth = new Date(data.grand_pere_paternel.date_naissance);
    const grandMerePBirth = new Date(data.grand_mere_paternelle.date_naissance);

    if (mereBirth <= grandPereMBirth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La date de naissance de la mère doit être postérieure à celle du grand-père maternel",
        path: ["infos_mere", "date_naissance"],
      });
    }

    if (pereBirth <= grandPerePBirth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La date de naissance du père doit être postérieure à celle du grand-père paternel",
        path: ["pere", "date_naissance"],
      });
    }

    if (pereBirth <= grandMerePBirth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "La date de naissance du père doit être postérieure à celle de la grand-mère paternelle",
        path: ["pere", "date_naissance"],
      });
    }

    // 3. All NNIs should be unique within the record
    const nnis = [
      data.infos_sujet.nni,
      data.infos_mere.nni,
      data.grand_pere_maternel.nni,
      data.pere.nni,
      data.grand_pere_paternel.nni,
      data.grand_mere_paternelle.nni,
    ];

    const uniqueNNIs = new Set(nnis);
    if (uniqueNNIs.size !== nnis.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tous les NNIs doivent être uniques dans cette identification",
        path: ["infos_sujet", "nni"],
      });
    }

    // 4. Race consistency validation (optional - you might want different rules)
    // For now, we'll just ensure all animals of the same lineage can have different races
    // but you might want to add specific business rules here
  });

// Update identification validation schema
export const UpdateIdentificationValidationSchema = z.object({
  infos_sujet: InfosSujetValidationSchema.partial().optional(),
  infos_mere: InfosMereValidationSchema.partial().optional(),
  grand_pere_maternel: GrandPereMaternelValidationSchema.partial().optional(),
  pere: PereValidationSchema.partial().optional(),
  grand_pere_paternel: GrandPerePaternalValidationSchema.partial().optional(),
  grand_mere_paternelle:
    GrandMerePaternelleValidationSchema.partial().optional(),
  complem: ComplemValidationSchema.partial().optional(),
});

// Quick validation schemas for individual sections (useful for step-by-step forms)
export const QuickValidationSchemas = {
  sujet: InfosSujetValidationSchema,
  mere: InfosMereValidationSchema,
  grandPereMaternel: GrandPereMaternelValidationSchema,
  pere: PereValidationSchema,
  grandPerePaternal: GrandPerePaternalValidationSchema,
  grandMerePaternelle: GrandMerePaternelleValidationSchema,
  complem: ComplemValidationSchema,
};

// Filter validation schema
export const IdentificationFiltersValidationSchema = z.object({
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

// Utility function to validate NNI format only
export const validateNNIFormat = (nni: string): boolean => {
  return NNI_PATTERN.test(nni.toUpperCase());
};

// Utility function to validate date only
export const validateDate = (dateString: string): boolean => {
  return isValidDate(dateString);
};

// Export types for TypeScript inference
export type CreateIdentificationFormData = z.infer<
  typeof CreateIdentificationValidationSchema
>;
export type UpdateIdentificationFormData = z.infer<
  typeof UpdateIdentificationValidationSchema
>;
export type IdentificationFiltersFormData = z.infer<
  typeof IdentificationFiltersValidationSchema
>;
