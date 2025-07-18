import {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateProfileSchema,
  ChangePasswordSchema,
} from "@shared/profile";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation regex
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// French phone validation regex (mobile and landline)
const PHONE_PATTERN = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;

// French postal code validation regex
const POSTAL_CODE_PATTERN = /^[0-9]{5}$/;

// Name validation (only letters, spaces, hyphens, apostrophes)
const NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s\-']+$/;

// Validate email format
export const validateEmail = (email: string): boolean => {
  return EMAIL_PATTERN.test(email);
};

// Validate phone format
export const validatePhone = (phone: string): boolean => {
  if (!phone || phone.trim() === "") return true; // Optional field
  return PHONE_PATTERN.test(phone.replace(/\s/g, ""));
};

// Validate postal code format
export const validatePostalCode = (postalCode: string): boolean => {
  if (!postalCode || postalCode.trim() === "") return true; // Optional field
  return POSTAL_CODE_PATTERN.test(postalCode);
};

// Validate name format
export const validateName = (name: string): boolean => {
  return NAME_PATTERN.test(name.trim());
};

// Validate profile update input
export const validateProfileUpdate = (
  input: UpdateProfileInput,
): ValidationResult => {
  try {
    UpdateProfileSchema.parse(input);
    return { isValid: true, errors: [] };
  } catch (error: any) {
    const errors: ValidationError[] = [];

    if (error.errors) {
      error.errors.forEach((err: any) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
        });
      });
    }

    return { isValid: false, errors };
  }
};

// Validate password change input
export const validatePasswordChange = (
  input: ChangePasswordInput,
): ValidationResult => {
  try {
    ChangePasswordSchema.parse(input);
    return { isValid: true, errors: [] };
  } catch (error: any) {
    const errors: ValidationError[] = [];

    if (error.errors) {
      error.errors.forEach((err: any) => {
        errors.push({
          field: err.path.join("."),
          message: err.message,
        });
      });
    }

    return { isValid: false, errors };
  }
};

// Get specific field error
export const getFieldError = (
  errors: ValidationError[],
  fieldName: string,
): string | undefined => {
  return errors.find((error) => error.field === fieldName)?.message;
};

// Validate individual fields
export const validateField = (
  fieldName: string,
  value: any,
): ValidationError | null => {
  switch (fieldName) {
    case "prenom":
    case "nom":
      if (!value || value.trim() === "") {
        return {
          field: fieldName,
          message: `Le ${fieldName === "prenom" ? "prénom" : "nom"} est requis`,
        };
      }
      if (!validateName(value)) {
        return {
          field: fieldName,
          message: `Le ${fieldName === "prenom" ? "prénom" : "nom"} ne peut contenir que des lettres, espaces, tirets et apostrophes`,
        };
      }
      if (value.length > 50) {
        return {
          field: fieldName,
          message: `Le ${fieldName === "prenom" ? "prénom" : "nom"} ne peut pas dépasser 50 caractères`,
        };
      }
      break;

    case "email":
      if (!value || value.trim() === "") {
        return { field: fieldName, message: "L'email est requis" };
      }
      if (!validateEmail(value)) {
        return { field: fieldName, message: "L'email n'est pas valide" };
      }
      break;

    case "telephone":
      if (value && !validatePhone(value)) {
        return {
          field: fieldName,
          message: "Le numéro de téléphone n'est pas valide",
        };
      }
      break;

    case "poste":
      if (!value || value.trim() === "") {
        return { field: fieldName, message: "Le poste est requis" };
      }
      if (value.length > 100) {
        return {
          field: fieldName,
          message: "Le poste ne peut pas dépasser 100 caractères",
        };
      }
      break;

    case "codePostal":
      if (value && !validatePostalCode(value)) {
        return {
          field: fieldName,
          message: "Le code postal doit contenir 5 chiffres",
        };
      }
      break;

    case "biographie":
      if (value && value.length > 500) {
        return {
          field: fieldName,
          message: "La biographie ne peut pas dépasser 500 caractères",
        };
      }
      break;
  }

  return null;
};
