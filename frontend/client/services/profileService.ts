import {
  UserProfile,
  UpdateProfileInput,
  UpdatePreferencesInput,
  UpdateSecurityInput,
  ChangePasswordInput,
} from "@shared/profile";

export class ProfileService {
  private static baseURL = `${import.meta.env.VITE_API_URL3}/api/profile`;

  // Get current user profile
  static async getCurrentProfile(): Promise<UserProfile> {
    const response = await fetch(`${this.baseURL}/me`);
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération du profil: ${response.status}`,
      );
    }
    return response.json();
  }

  // Update profile information
  static async updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
    const response = await fetch(`${this.baseURL}/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la mise à jour du profil: ${response.status}`,
      );
    }

    return response.json();
  }

  // Update user preferences
  static async updatePreferences(
    data: UpdatePreferencesInput,
  ): Promise<UserProfile> {
    const response = await fetch(`${this.baseURL}/me/preferences`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la mise à jour des préférences: ${response.status}`,
      );
    }

    return response.json();
  }

  // Update security settings
  static async updateSecurity(data: UpdateSecurityInput): Promise<UserProfile> {
    const response = await fetch(`${this.baseURL}/me/security`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la mise à jour de la sécurité: ${response.status}`,
      );
    }

    return response.json();
  }

  // Change password
  static async changePassword(data: ChangePasswordInput): Promise<void> {
    const response = await fetch(`${this.baseURL}/me/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors du changement de mot de passe: ${response.status}`,
      );
    }
  }

  // Upload avatar
  static async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${this.baseURL}/me/avatar`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors du téléchargement de l'avatar: ${response.status}`,
      );
    }

    const result = await response.json();
    return result.avatarUrl;
  }

  // Delete avatar
  static async deleteAvatar(): Promise<void> {
    const response = await fetch(`${this.baseURL}/me/avatar`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la suppression de l'avatar: ${response.status}`,
      );
    }
  }

  // Get profile activity log
  static async getActivityLog(): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/me/activity`);
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération du journal d'activité: ${response.status}`,
      );
    }
    return response.json();
  }

  // Enable two-factor authentication
  static async enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
    const response = await fetch(`${this.baseURL}/me/2fa/enable`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de l'activation de la 2FA: ${response.status}`,
      );
    }

    return response.json();
  }

  // Verify and confirm two-factor authentication
  static async verifyTwoFactor(token: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/me/2fa/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la vérification de la 2FA: ${response.status}`,
      );
    }
  }

  // Disable two-factor authentication
  static async disableTwoFactor(): Promise<void> {
    const response = await fetch(`${this.baseURL}/me/2fa/disable`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la désactivation de la 2FA: ${response.status}`,
      );
    }
  }

  // Download profile data (GDPR compliance)
  static async downloadProfileData(): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/me/download`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors du téléchargement des données: ${response.status}`,
      );
    }

    return response.blob();
  }

  // Delete account
  static async deleteAccount(password: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/me`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erreur lors de la suppression du compte: ${response.status}`,
      );
    }
  }
}
