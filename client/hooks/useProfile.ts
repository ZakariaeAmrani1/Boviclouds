import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { ProfileService } from "../services/profileService";
import {
  UserProfile,
  UpdateProfileInput,
  UpdatePreferencesInput,
  ChangePasswordInput,
} from "@shared/profile";

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await ProfileService.getCurrentProfile();
      setProfile(profileData);
    } catch (err) {
      const errorMessage = "Impossible de charger le profil";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileInput) => {
    try {
      const updatedProfile = await ProfileService.updateProfile(data);
      setProfile(updatedProfile);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      return updatedProfile;
    } catch (err) {
      const errorMessage = "Impossible de mettre à jour le profil";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePreferences = async (data: UpdatePreferencesInput) => {
    try {
      const updatedProfile = await ProfileService.updatePreferences(data);
      setProfile(updatedProfile);
      toast({
        title: "Succès",
        description: "Préférences mises à jour avec succès",
      });
      return updatedProfile;
    } catch (err) {
      const errorMessage = "Impossible de mettre à jour les préférences";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const changePassword = async (data: ChangePasswordInput) => {
    try {
      await ProfileService.changePassword(data);
      toast({
        title: "Succès",
        description: "Mot de passe modifié avec succès",
      });
    } catch (err) {
      const errorMessage = "Impossible de modifier le mot de passe";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const avatarUrl = await ProfileService.uploadAvatar(file);
      if (profile) {
        setProfile({ ...profile, avatar: avatarUrl });
      }
      toast({
        title: "Succès",
        description: "Avatar mis à jour avec succès",
      });
      return avatarUrl;
    } catch (err) {
      const errorMessage = "Impossible de télécharger l'avatar";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteAvatar = async () => {
    try {
      await ProfileService.deleteAvatar();
      if (profile) {
        setProfile({ ...profile, avatar: undefined });
      }
      toast({
        title: "Succès",
        description: "Avatar supprimé avec succès",
      });
    } catch (err) {
      const errorMessage = "Impossible de supprimer l'avatar";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const enableTwoFactor = async () => {
    try {
      const data = await ProfileService.enableTwoFactor();
      return data;
    } catch (err) {
      const errorMessage = "Impossible d'activer la 2FA";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const verifyTwoFactor = async (token: string) => {
    try {
      await ProfileService.verifyTwoFactor(token);
      if (profile) {
        setProfile({
          ...profile,
          securite: { ...profile.securite, deuxFacteurs: true },
        });
      }
      toast({
        title: "Succès",
        description: "Authentification à deux facteurs activée",
      });
    } catch (err) {
      const errorMessage = "Code de vérification incorrect";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const disableTwoFactor = async () => {
    try {
      await ProfileService.disableTwoFactor();
      if (profile) {
        setProfile({
          ...profile,
          securite: { ...profile.securite, deuxFacteurs: false },
        });
      }
      toast({
        title: "Succès",
        description: "Authentification à deux facteurs désactivée",
      });
    } catch (err) {
      const errorMessage = "Impossible de désactiver la 2FA";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const downloadProfileData = async () => {
    try {
      const blob = await ProfileService.downloadProfileData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `profile-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = "Impossible de télécharger les données";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    updatePreferences,
    changePassword,
    uploadAvatar,
    deleteAvatar,
    enableTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
    downloadProfileData,
  };
};
