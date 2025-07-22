import { RequestHandler } from "express";
import {
  UserProfile,
  UpdateProfileInput,
  UpdatePreferencesInput,
  UpdateSecurityInput,
  ChangePasswordInput,
  getFullName,
  getInitials,
  getAvatarUrl,
} from "../../shared/profile";

// Mock user profile data - replace with actual database implementation
const mockProfile: UserProfile = {
  id: "user-001",
  prenom: "Zakariae",
  nom: "Amrani",
  email: "zakariae.amrani@boviclouds.com",
  telephone: "+33 6 12 34 56 78",
  poste: "Farm Manager",
  departement: "Gestion d'Exploitation",
  localisation: "Casablanca, Maroc",
  biographie:
    "Gestionnaire d'exploitation avec 10 ans d'expérience dans l'élevage bovin moderne. Spécialisé dans l'optimisation des rendements et le bien-être animal.",
  dateNaissance: "1990-05-15",
  adresse: "123 Rue de l'Agriculture",
  ville: "Casablanca",
  codePostal: "20000",
  pays: "Maroc",
  preferences: {
    langue: "fr",
    fuseauHoraire: "Africa/Casablanca",
    notifications: {
      email: true,
      push: true,
      alertesSysteme: true,
      rapportsHebdomadaires: true,
      alertesProduction: true,
      alertesSante: true,
      alertesSurveillance: false,
    },
    theme: "light",
    formatDate: "DD/MM/YYYY",
    formatHeure: "24h",
  },
  securite: {
    deuxFacteurs: false,
    sessionMultiples: true,
    derniereModificationMotDePasse: "2024-01-15T10:30:00Z",
    tentativesConnexionEchouees: 0,
    ipConnexionAutorisees: [],
  },
  dateCreation: "2023-01-01T00:00:00Z",
  dateModification: "2024-01-15T10:30:00Z",
  dernierConnexion: "2024-01-20T14:25:00Z",
};

// Mock activity log
const mockActivityLog = [
  {
    id: "act-001",
    action: "Connexion",
    description: "Connexion depuis Chrome/Windows",
    ip: "192.168.1.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    date: "2024-01-20T14:25:00Z",
  },
  {
    id: "act-002",
    action: "Mise à jour profil",
    description: "Modification des informations personnelles",
    ip: "192.168.1.1",
    date: "2024-01-19T09:15:00Z",
  },
  {
    id: "act-003",
    action: "Changement mot de passe",
    description: "Mot de passe modifié avec succès",
    ip: "192.168.1.1",
    date: "2024-01-15T10:30:00Z",
  },
];

// Get current user profile
export const getCurrentProfile: RequestHandler = (_req, res) => {
  res.json(mockProfile);
};

// Update profile
export const updateProfile: RequestHandler = (req, res) => {
  try {
    const updateData: UpdateProfileInput = req.body;

    // Simulate updating the profile
    const updatedProfile: UserProfile = {
      ...mockProfile,
      ...updateData,
      dateModification: new Date().toISOString(),
    };

    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors de la mise à jour du profil",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Update preferences
export const updatePreferences: RequestHandler = (req, res) => {
  try {
    const updateData: UpdatePreferencesInput = req.body;

    const updatedProfile: UserProfile = {
      ...mockProfile,
      preferences: {
        ...mockProfile.preferences,
        ...updateData,
        notifications: {
          ...mockProfile.preferences.notifications,
          ...updateData.notifications,
        },
      },
      dateModification: new Date().toISOString(),
    };

    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors de la mise à jour des préférences",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Update security settings
export const updateSecurity: RequestHandler = (req, res) => {
  try {
    const updateData: UpdateSecurityInput = req.body;

    const updatedProfile: UserProfile = {
      ...mockProfile,
      securite: {
        ...mockProfile.securite,
        ...updateData,
      },
      dateModification: new Date().toISOString(),
    };

    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors de la mise à jour de la sécurité",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Change password
export const changePassword: RequestHandler = (req, res) => {
  try {
    const { motDePasseActuel, nouveauMotDePasse }: ChangePasswordInput =
      req.body;

    // In a real implementation, you would:
    // 1. Verify the current password
    // 2. Hash the new password
    // 3. Update the database

    // Simulate password validation
    if (motDePasseActuel !== "currentPassword123") {
      return res.status(400).json({
        error: "Mot de passe actuel incorrect",
      });
    }

    // Simulate successful password change
    res.json({
      message: "Mot de passe modifié avec succès",
    });
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors du changement de mot de passe",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Upload avatar
export const uploadAvatar: RequestHandler = (req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Validate the uploaded file
    // 2. Resize/optimize the image
    // 3. Store it in cloud storage
    // 4. Update the user's avatar URL in the database

    const mockAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName(mockProfile))}&background=3B82F6&color=fff&size=128&_t=${Date.now()}`;

    res.json({
      avatarUrl: mockAvatarUrl,
      message: "Avatar téléchargé avec succès",
    });
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors du téléchargement de l'avatar",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Delete avatar
export const deleteAvatar: RequestHandler = (_req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Delete the avatar file from storage
    // 2. Update the user's avatar URL to null in the database

    res.json({
      message: "Avatar supprimé avec succès",
    });
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors de la suppression de l'avatar",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Get activity log
export const getActivityLog: RequestHandler = (_req, res) => {
  res.json(mockActivityLog);
};

// Enable two-factor authentication
export const enableTwoFactor: RequestHandler = (_req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Generate a secret key
    // 2. Create a QR code
    // 3. Store the secret temporarily until verified

    const mockSecret = "JBSWY3DPEHPK3PXP";
    const mockQRCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;

    res.json({
      secret: mockSecret,
      qrCode: mockQRCode,
    });
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors de l'activation de la 2FA",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Verify two-factor authentication
export const verifyTwoFactor: RequestHandler = (req, res) => {
  try {
    const { token } = req.body;

    // In a real implementation, you would:
    // 1. Verify the TOTP token
    // 2. Enable 2FA for the user
    // 3. Generate backup codes

    if (token !== "123456") {
      return res.status(400).json({
        error: "Code de vérification incorrect",
      });
    }

    res.json({
      message: "Authentification à deux facteurs activée avec succès",
      backupCodes: ["12345678", "87654321", "11111111", "22222222", "33333333"],
    });
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors de la vérification de la 2FA",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Disable two-factor authentication
export const disableTwoFactor: RequestHandler = (_req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Verify the user's identity
    // 2. Disable 2FA in the database
    // 3. Remove backup codes

    res.json({
      message: "Authentification à deux facteurs désactivée avec succès",
    });
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors de la désactivation de la 2FA",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Download profile data
export const downloadProfileData: RequestHandler = (_req, res) => {
  try {
    const profileData = {
      profile: mockProfile,
      activityLog: mockActivityLog,
      exportDate: new Date().toISOString(),
    };

    const jsonData = JSON.stringify(profileData, null, 2);

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="profile-data-${new Date().toISOString().split("T")[0]}.json"`,
    );

    res.send(jsonData);
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors du téléchargement des données",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Delete account
export const deleteAccount: RequestHandler = (req, res) => {
  try {
    const { password } = req.body;

    // In a real implementation, you would:
    // 1. Verify the password
    // 2. Mark the account for deletion
    // 3. Send confirmation email
    // 4. Schedule data cleanup

    if (password !== "currentPassword123") {
      return res.status(400).json({
        error: "Mot de passe incorrect",
      });
    }

    res.json({
      message: "Demande de suppression de compte enregistrée",
    });
  } catch (error) {
    res.status(400).json({
      error: "Erreur lors de la suppression du compte",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};
