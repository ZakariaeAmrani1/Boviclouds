import {
  CreateUtilisateurInput,
  UpdateUtilisateurInput,
  UtilisateurStatus,
  UtilisateurRole,
} from "@shared/utilisateur";

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
  return PHONE_PATTERN.test(phone.replace(/\s/g, ""));
};

// Validate postal code format
export const validatePostalCode = (postalCode: string): boolean => {
  return POSTAL_CODE_PATTERN.test(postalCode);
};

// Validate name format
export const validateName = (name: string): boolean => {
  return NAME_PATTERN.test(name.trim());
};

// Validate create input
export const validateCreateInput = (
  input: CreateUtilisateurInput,
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!input.prenom?.trim()) {
    errors.push({ field: "prenom", message: "Le prénom est requis" });
  } else if (input.prenom.trim().length < 2) {
    errors.push({
      field: "prenom",
      message: "Le prénom doit contenir au moins 2 caractères",
    });
  } else if (input.prenom.trim().length > 50) {
    errors.push({
      field: "prenom",
      message: "Le prénom ne peut pas dépasser 50 caractères",
    });
  } else if (!validateName(input.prenom)) {
    errors.push({
      field: "prenom",
      message:
        "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes",
    });
  }

  if (!input.nom?.trim()) {
    errors.push({ field: "nom", message: "Le nom est requis" });
  } else if (input.nom.trim().length < 2) {
    errors.push({
      field: "nom",
      message: "Le nom doit contenir au moins 2 caractères",
    });
  } else if (input.nom.trim().length > 50) {
    errors.push({
      field: "nom",
      message: "Le nom ne peut pas dépasser 50 caractères",
    });
  } else if (!validateName(input.nom)) {
    errors.push({
      field: "nom",
      message:
        "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes",
    });
  }

  if (!input.email?.trim()) {
    errors.push({ field: "email", message: "L'email est requis" });
  } else if (!validateEmail(input.email)) {
    errors.push({
      field: "email",
      message: "Format d'email invalide",
    });
  }

  // Optional fields validation
  if (input.telephone && !validatePhone(input.telephone)) {
    errors.push({
      field: "telephone",
      message: "Format de téléphone invalide (ex: 0123456789 ou +33123456789)",
    });
  }

  if (!Object.values(UtilisateurRole).includes(input.role)) {
    errors.push({ field: "role", message: "Rôle invalide" });
  }

  if (
    input.statut &&
    !Object.values(UtilisateurStatus).includes(input.statut)
  ) {
    errors.push({ field: "statut", message: "Statut invalide" });
  }

  // Exploitation code validation
  if (
    input.codeExploitation &&
    !/^[A-Z0-9]{3,10}$/.test(input.codeExploitation)
  ) {
    errors.push({
      field: "codeExploitation",
      message: "Code exploitation invalide (3-10 caractères alphanumériques)",
    });
  }

  // Postal code validation
  if (input.codePostal && !validatePostalCode(input.codePostal)) {
    errors.push({
      field: "codePostal",
      message: "Code postal invalide (5 chiffres)",
    });
  }

  // Notes length validation
  if (input.notes && input.notes.length > 500) {
    errors.push({
      field: "notes",
      message: "Les notes ne peuvent pas dépasser 500 caractères",
    });
  }

  // Business logic validation
  if (input.role === UtilisateurRole.ELEVEUR && !input.exploitation?.trim()) {
    errors.push({
      field: "exploitation",
      message: "L'exploitation est requise pour les éleveurs",
    });
  }

  if (
    input.role === UtilisateurRole.ELEVEUR &&
    !input.codeExploitation?.trim()
  ) {
    errors.push({
      field: "codeExploitation",
      message: "Le code d'exploitation est requis pour les éleveurs",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate update input
export const validateUpdateInput = (
  input: UpdateUtilisateurInput,
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate fields only if they are provided
  if (input.prenom !== undefined) {
    if (!input.prenom?.trim()) {
      errors.push({
        field: "prenom",
        message: "Le prénom ne peut pas être vide",
      });
    } else if (input.prenom.trim().length < 2) {
      errors.push({
        field: "prenom",
        message: "Le prénom doit contenir au moins 2 caractères",
      });
    } else if (input.prenom.trim().length > 50) {
      errors.push({
        field: "prenom",
        message: "Le prénom ne peut pas dépasser 50 caractères",
      });
    } else if (!validateName(input.prenom)) {
      errors.push({
        field: "prenom",
        message:
          "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes",
      });
    }
  }

  if (input.nom !== undefined) {
    if (!input.nom?.trim()) {
      errors.push({
        field: "nom",
        message: "Le nom ne peut pas être vide",
      });
    } else if (input.nom.trim().length < 2) {
      errors.push({
        field: "nom",
        message: "Le nom doit contenir au moins 2 caractères",
      });
    } else if (input.nom.trim().length > 50) {
      errors.push({
        field: "nom",
        message: "Le nom ne peut pas dépasser 50 caractères",
      });
    } else if (!validateName(input.nom)) {
      errors.push({
        field: "nom",
        message:
          "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes",
      });
    }
  }

  if (input.email !== undefined) {
    if (!input.email?.trim()) {
      errors.push({
        field: "email",
        message: "L'email ne peut pas être vide",
      });
    } else if (!validateEmail(input.email)) {
      errors.push({
        field: "email",
        message: "Format d'email invalide",
      });
    }
  }

  if (input.telephone !== undefined && input.telephone) {
    if (!validatePhone(input.telephone)) {
      errors.push({
        field: "telephone",
        message:
          "Format de téléphone invalide (ex: 0123456789 ou +33123456789)",
      });
    }
  }

  if (input.role && !Object.values(UtilisateurRole).includes(input.role)) {
    errors.push({ field: "role", message: "Rôle invalide" });
  }

  if (
    input.statut &&
    !Object.values(UtilisateurStatus).includes(input.statut)
  ) {
    errors.push({ field: "statut", message: "Statut invalide" });
  }

  if (
    input.codePostal !== undefined &&
    input.codePostal &&
    !validatePostalCode(input.codePostal)
  ) {
    errors.push({
      field: "codePostal",
      message: "Code postal invalide (5 chiffres)",
    });
  }

  if (input.notes !== undefined && input.notes && input.notes.length > 500) {
    errors.push({
      field: "notes",
      message: "Les notes ne peuvent pas dépasser 500 caractères",
    });
  }

  // Business logic validation for role changes
  if (input.role === UtilisateurRole.ELEVEUR && !input.exploitation?.trim()) {
    errors.push({
      field: "exploitation",
      message: "L'exploitation est requise pour les éleveurs",
    });
  }

  if (
    input.role === UtilisateurRole.ELEVEUR &&
    !input.codeExploitation?.trim()
  ) {
    errors.push({
      field: "codeExploitation",
      message: "Le code d'exploitation est requis pour les éleveurs",
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

// Validate form completion for different roles
export const validateFormCompletion = (
  formData: any,
  role: UtilisateurRole,
): string[] => {
  const missingFields: string[] = [];

  if (!formData.prenom?.trim()) missingFields.push("Prénom");
  if (!formData.nom?.trim()) missingFields.push("Nom");
  if (!formData.email?.trim()) missingFields.push("Email");

  // Role-specific required fields
  switch (role) {
    case UtilisateurRole.ELEVEUR:
      if (!formData.exploitation?.trim()) missingFields.push("Exploitation");
      if (!formData.codeExploitation?.trim())
        missingFields.push("Code d'exploitation");
      break;
    case UtilisateurRole.IDENTIFICATEUR:
      if (!formData.telephone?.trim()) missingFields.push("Téléphone");
      break;
    case UtilisateurRole.ADMINISTRATEUR:
    case UtilisateurRole.INSEMINATEUR:
      // No additional required fields
      break;
  }

  return missingFields;
};
