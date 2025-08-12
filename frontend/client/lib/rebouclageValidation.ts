import {
  CreateRebouclageInput,
  UpdateRebouclageInput,
  RebouclageStatus,
} from "@shared/rebouclage";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// NNI validation regex (French format)
const NNI_PATTERN = /^FR\d{10}$/;

// Validate NNI format
export const validateNNI = (nni: string): boolean => {
  return NNI_PATTERN.test(nni);
};

// Validate create input
export const validateCreateInput = (
  input: CreateRebouclageInput,
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!input.ancienNNI?.trim()) {
    errors.push({ field: "ancienNNI", message: "L'ancien NNI est requis" });
  } else if (!validateNNI(input.ancienNNI)) {
    errors.push({
      field: "ancienNNI",
      message: "Format NNI invalide (ex: FR1234567890)",
    });
  }

  if (!input.nouveauNNI?.trim()) {
    errors.push({ field: "nouveauNNI", message: "Le nouveau NNI est requis" });
  } else if (!validateNNI(input.nouveauNNI)) {
    errors.push({
      field: "nouveauNNI",
      message: "Format NNI invalide (ex: FR1234567890)",
    });
  }

  if (!input.identificateur_id?.trim()) {
    errors.push({ field: "identificateur_id", message: "L'identificateur est requis" });
  }

  // Check if ancien and nouveau NNI are different
  if (
    input.ancienNNI &&
    input.nouveauNNI &&
    input.ancienNNI === input.nouveauNNI
  ) {
    errors.push({
      field: "nouveauNNI",
      message: "Le nouveau NNI doit être différent de l'ancien NNI",
    });
  }

  // Validate date if provided
  if (input.dateRebouclage) {
    const date = new Date(input.dateRebouclage);
    const now = new Date();

    if (isNaN(date.getTime())) {
      errors.push({ field: "dateRebouclage", message: "Date invalide" });
    } else if (date > now) {
      errors.push({
        field: "dateRebouclage",
        message: "La date ne peut pas être dans le futur",
      });
    }
  }

  // These fields are not in CreateRebouclageInput interface anymore
  // They are in UpdateRebouclageInput only

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate update input
export const validateUpdateInput = (
  input: UpdateRebouclageInput,
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate NNI format if provided
  if (input.ancienNNI !== undefined) {
    if (!input.ancienNNI?.trim()) {
      errors.push({
        field: "ancienNNI",
        message: "L'ancien NNI ne peut pas être vide",
      });
    } else if (!validateNNI(input.ancienNNI)) {
      errors.push({
        field: "ancienNNI",
        message: "Format NNI invalide (ex: FR1234567890)",
      });
    }
  }

  if (input.nouveauNNI !== undefined) {
    if (!input.nouveauNNI?.trim()) {
      errors.push({
        field: "nouveauNNI",
        message: "Le nouveau NNI ne peut pas être vide",
      });
    } else if (!validateNNI(input.nouveauNNI)) {
      errors.push({
        field: "nouveauNNI",
        message: "Format NNI invalide (ex: FR1234567890)",
      });
    }
  }

  // Check if ancien and nouveau NNI are different (if both provided)
  if (
    input.ancienNNI &&
    input.nouveauNNI &&
    input.ancienNNI === input.nouveauNNI
  ) {
    errors.push({
      field: "nouveauNNI",
      message: "Le nouveau NNI doit être différent de l'ancien NNI",
    });
  }

  // Validate date if provided
  if (input.dateRebouclage !== undefined) {
    const date = new Date(input.dateRebouclage);
    const now = new Date();

    if (isNaN(date.getTime())) {
      errors.push({ field: "dateRebouclage", message: "Date invalide" });
    } else if (date > now) {
      errors.push({
        field: "dateRebouclage",
        message: "La date ne peut pas être dans le futur",
      });
    }
  }

  // Validate status if provided
  if (input.statut && !Object.values(RebouclageStatus).includes(input.statut)) {
    errors.push({ field: "statut", message: "Statut invalide" });
  }

  // Validate code exploitation format if provided
  if (
    input.codeExploitation !== undefined &&
    input.codeExploitation &&
    !/^[A-Z0-9]{3,10}$/.test(input.codeExploitation)
  ) {
    errors.push({
      field: "codeExploitation",
      message: "Code exploitation invalide (3-10 caractères alphanumériques)",
    });
  }

  // Validate notes length if provided
  if (input.notes !== undefined && input.notes && input.notes.length > 500) {
    errors.push({
      field: "notes",
      message: "Les notes ne peuvent pas dépasser 500 caractères",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Get field error message
export const getFieldError = (
  errors: ValidationError[],
  field: string,
): string | undefined => {
  const error = errors.find((e) => e.field === field);
  return error?.message;
};

// Format validation errors for display
export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map((error) => error.message).join(", ");
};
