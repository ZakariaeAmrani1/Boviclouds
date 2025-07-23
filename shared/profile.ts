import { z } from "zod";

// User profile interface
export interface UserProfile {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  poste: string; // Job title
  avatar?: string;
  departement?: string;
  localisation?: string;
  biographie?: string;
  dateNaissance?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  preferences: UserPreferences;
  securite: SecuritySettings;
  dateCreation: string;
  dateModification: string;
  dernierConnexion?: string;
}

// User preferences interface
export interface UserPreferences {
  langue: "fr" | "en" | "es";
  fuseauHoraire: string;
  notifications: NotificationSettings;
  theme: "light" | "dark" | "auto";
  formatDate: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  formatHeure: "12h" | "24h";
}

// Notification settings interface
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  alertesSysteme: boolean;
  rapportsHebdomadaires: boolean;
  alertesProduction: boolean;
  alertesSante: boolean;
  alertesSurveillance: boolean;
}

// Security settings interface
export interface SecuritySettings {
  deuxFacteurs: boolean;
  sessionMultiples: boolean;
  derniereModificationMotDePasse?: string;
  tentativesConnexionEchouees: number;
  ipConnexionAutorisees?: string[];
}

// Input for updating profile
export interface UpdateProfileInput {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  poste?: string;
  departement?: string;
  localisation?: string;
  biographie?: string;
  dateNaissance?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
}

// Input for updating preferences
export interface UpdatePreferencesInput {
  langue?: "fr" | "en" | "es";
  fuseauHoraire?: string;
  notifications?: Partial<NotificationSettings>;
  theme?: "light" | "dark" | "auto";
  formatDate?: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  formatHeure?: "12h" | "24h";
}

// Input for updating security settings
export interface UpdateSecurityInput {
  deuxFacteurs?: boolean;
  sessionMultiples?: boolean;
  ipConnexionAutorisees?: string[];
}

// Change password input
export interface ChangePasswordInput {
  motDePasseActuel: string;
  nouveauMotDePasse: string;
  confirmerMotDePasse: string;
}

// Profile filters for admin
export interface ProfileFilters {
  recherche?: string;
  departement?: string;
  poste?: string;
  actif?: boolean;
}

// Utility functions
export const getFullName = (profile: UserProfile): string => {
  return `${profile.prenom} ${profile.nom}`.trim();
};

export const getInitials = (profile: UserProfile): string => {
  const prenom = profile.prenom.charAt(0).toUpperCase();
  const nom = profile.nom.charAt(0).toUpperCase();
  return `${prenom}${nom}`;
};

export const getAvatarUrl = (profile: UserProfile): string => {
  return (
    profile.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName(profile))}&background=3B82F6&color=fff&size=128`
  );
};

// Validation schemas using Zod
export const UpdateProfileSchema = z.object({
  prenom: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  nom: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string().email("L'email n'est pas valide"),
  telephone: z.string().optional(),
  poste: z
    .string()
    .min(1, "Le poste est requis")
    .max(100, "Le poste ne peut pas dépasser 100 caractères"),
  departement: z.string().optional(),
  localisation: z.string().optional(),
  biographie: z
    .string()
    .max(500, "La biographie ne peut pas dépasser 500 caractères")
    .optional(),
  dateNaissance: z.string().optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z
    .string()
    .regex(/^[0-9]{5}$/, "Le code postal doit contenir 5 chiffres")
    .optional(),
  pays: z.string().optional(),
});

export const ChangePasswordSchema = z
  .object({
    motDePasseActuel: z.string().min(1, "Le mot de passe actuel est requis"),
    nouveauMotDePasse: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /(?=.*[a-z])/,
        "Le mot de passe doit contenir au moins une lettre minuscule",
      )
      .regex(
        /(?=.*[A-Z])/,
        "Le mot de passe doit contenir au moins une lettre majuscule",
      )
      .regex(/(?=.*\d)/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(
        /(?=.*[@$!%*?&])/,
        "Le mot de passe doit contenir au moins un caractère spécial",
      ),
    confirmerMotDePasse: z.string(),
  })
  .refine((data) => data.nouveauMotDePasse === data.confirmerMotDePasse, {
    message: "La confirmation du mot de passe ne correspond pas",
    path: ["confirmerMotDePasse"],
  });

export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
