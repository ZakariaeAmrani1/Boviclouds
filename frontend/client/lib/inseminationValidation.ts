import { z } from "zod";
import {
  CreateInseminationSchema as BaseCreateSchema,
  UpdateInseminationSchema as BaseUpdateSchema,
} from "@shared/insemination";

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

// Full create insemination validation schema
export const CreateInseminationValidationSchema = z
  .object({
    nni: nniValidation,
    date_dissemination: dateValidation,
    semence_id: z.string().min(1, "L'ID de la semence est requis"),
    inseminateur_id: z.string().min(1, "L'inséminateur est requis"),
    responsable_local_id: z.string().min(1, "Le responsable local est requis"),
    createdBy: z.string().min(1, "Le créateur est requis"),
  })
  .superRefine((data, ctx) => {
    // Cross-validation rules

    // 1. Dissemination date should not be in the future
    const disseminationDate = new Date(data.date_dissemination);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (disseminationDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de dissémination ne peut pas être dans le futur",
        path: ["date_dissemination"],
      });
    }

    // 2. Dissemination date should not be too old (more than 5 years)
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    if (disseminationDate < fiveYearsAgo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de dissémination ne peut pas être antérieure à 5 ans",
        path: ["date_dissemination"],
      });
    }

    // 3. Validate inseminateur and responsable are different
    if (data.inseminateur_id === data.responsable_local_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "L'inséminateur et le responsable local doivent être différents",
        path: ["responsable_local_id"],
      });
    }

    // 4. Validate semence_id format (assuming it follows a pattern)
    const semencePattern = /^SEM\d{6}$/; // Example: SEM123456
    if (!semencePattern.test(data.semence_id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Format d'ID de semence invalide (ex: SEM123456)",
        path: ["semence_id"],
      });
    }
  });

// Update insemination validation schema
export const UpdateInseminationValidationSchema = z
  .object({
    nni: nniValidation.optional(),
    date_dissemination: dateValidation.optional(),
    semence_id: z.string().min(1, "L'ID de la semence est requis").optional(),
    inseminateur_id: z.string().min(1, "L'inséminateur est requis").optional(),
    responsable_local_id: z.string().min(1, "Le responsable local est requis").optional(),
  })
  .superRefine((data, ctx) => {
    // Cross-validation rules for updates (only validate if fields are present)

    if (data.date_dissemination) {
      // 1. Dissemination date should not be in the future
      const disseminationDate = new Date(data.date_dissemination);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (disseminationDate > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La date de dissémination ne peut pas être dans le futur",
          path: ["date_dissemination"],
        });
      }

      // 2. Dissemination date should not be too old
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      if (disseminationDate < fiveYearsAgo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La date de dissémination ne peut pas être antérieure à 5 ans",
          path: ["date_dissemination"],
        });
      }
    }

    // 3. Validate inseminateur and responsable are different (if both are present)
    if (data.inseminateur_id && data.responsable_local_id && 
        data.inseminateur_id === data.responsable_local_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "L'inséminateur et le responsable local doivent être différents",
        path: ["responsable_local_id"],
      });
    }

    // 4. Validate semence_id format (if present)
    if (data.semence_id) {
      const semencePattern = /^SEM\d{6}$/;
      if (!semencePattern.test(data.semence_id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format d'ID de semence invalide (ex: SEM123456)",
          path: ["semence_id"],
        });
      }
    }
  });

// Filter validation schema
export const InseminationFiltersValidationSchema = z.object({
  nni: z.string().optional(),
  semence_id: z.string().optional(),
  inseminateur_id: z.string().optional(),
  responsable_local_id: z.string().optional(),
  date_dissemination: z.string().optional(),
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

// Utility function to validate semence ID format
export const validateSemenceIdFormat = (semenceId: string): boolean => {
  const semencePattern = /^SEM\d{6}$/;
  return semencePattern.test(semenceId);
};

// Utility function to generate a sample semence ID
export const generateSampleSemenceId = (): string => {
  const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `SEM${randomNumber}`;
};

// Export types for TypeScript inference
export type CreateInseminationFormData = z.infer<
  typeof CreateInseminationValidationSchema
>;
export type UpdateInseminationFormData = z.infer<
  typeof UpdateInseminationValidationSchema
>;
export type InseminationFiltersFormData = z.infer<
  typeof InseminationFiltersValidationSchema
>;
