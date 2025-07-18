import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  Edit3,
  Save,
  X,
  Upload,
  Download,
  Trash2,
  Shield,
  Bell,
  Settings,
  ChevronRight,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Clock,
  Palette,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { useProfile } from "../hooks/useProfile";
import {
  UserProfile,
  UpdateProfileInput,
  UpdatePreferencesInput,
  ChangePasswordInput,
  getFullName,
  getInitials,
  getAvatarUrl,
} from "@shared/profile";
import {
  validateProfileUpdate,
  validatePasswordChange,
  getFieldError,
  ValidationError,
} from "../lib/profileValidation";

const EditProfile: React.FC = () => {
  const { toast } = useToast();
  const {
    profile,
    loading,
    updateProfile: updateProfileData,
    updatePreferences: updatePreferencesData,
    changePassword: changeProfilePassword,
    uploadAvatar: uploadProfileAvatar,
    enableTwoFactor: enableProfileTwoFactor,
    verifyTwoFactor: verifyProfileTwoFactor,
    disableTwoFactor: disableProfileTwoFactor,
    downloadProfileData: downloadProfile,
  } = useProfile();

  // UI state
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Form states
  const [personalForm, setPersonalForm] = useState<UpdateProfileInput>({});
  const [passwordForm, setPasswordForm] = useState<ChangePasswordInput>({
    motDePasseActuel: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Validation errors
  const [personalErrors, setPersonalErrors] = useState<ValidationError[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<ValidationError[]>([]);

  // Modal states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<{
    qrCode?: string;
    secret?: string;
  }>({});
  const [verificationCode, setVerificationCode] = useState("");

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setPersonalForm({
        prenom: profile.prenom,
        nom: profile.nom,
        email: profile.email,
        telephone: profile.telephone,
        poste: profile.poste,
        departement: profile.departement,
        localisation: profile.localisation,
        biographie: profile.biographie,
        dateNaissance: profile.dateNaissance,
        adresse: profile.adresse,
        ville: profile.ville,
        codePostal: profile.codePostal,
        pays: profile.pays,
      });
    }
  }, [profile]);

  // Handle personal info update
  const handlePersonalUpdate = async () => {
    const validation = validateProfileUpdate(personalForm);
    setPersonalErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    try {
      setSaving(true);
      await updateProfileData(personalForm);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    const validation = validatePasswordChange(passwordForm);
    setPasswordErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    try {
      setSaving(true);
      await changeProfilePassword(passwordForm);
      setPasswordForm({
        motDePasseActuel: "",
        nouveauMotDePasse: "",
        confirmerMotDePasse: "",
      });
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadProfileAvatar(file);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = async (
    preferences: UpdatePreferencesInput,
  ) => {
    try {
      await updatePreferencesData(preferences);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle two-factor authentication
  const handleEnableTwoFactor = async () => {
    try {
      const data = await enableProfileTwoFactor();
      setTwoFactorData(data);
      setShowTwoFactorDialog(true);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleVerifyTwoFactor = async () => {
    try {
      await verifyProfileTwoFactor(verificationCode);
      setShowTwoFactorDialog(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Download profile data
  const handleDownloadData = async () => {
    try {
      await downloadProfile();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h2>
        <p className="text-gray-600">Impossible de charger le profil</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 text-sm">Accueil</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm font-medium">
            Modifier le profil
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2 mb-1">Paramètres du profil</h1>
            <p className="body-base">
              Gérez vos informations personnelles et vos préférences
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownloadData}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger mes données
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {profile.avatar ? (
                      <img
                        src={getAvatarUrl(profile)}
                        alt={getFullName(profile)}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      getInitials(profile)
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleAvatarUpload(file);
                      }
                    }}
                  />
                </div>
                <h3 className="heading-4">{getFullName(profile)}</h3>
                <p className="body-small">{profile.poste}</p>
                <p className="caption mt-1">{profile.departement}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">
                    {profile.email}
                  </span>
                </div>
                {profile.telephone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{profile.telephone}</span>
                  </div>
                )}
                {profile.localisation && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {profile.localisation}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Sécurité</span>
                  <Badge
                    variant={
                      profile.securite.deuxFacteurs ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {profile.securite.deuxFacteurs
                      ? "2FA Activée"
                      : "2FA Désactivée"}
                  </Badge>
                </div>
                <p className="caption">
                  Dernière connexion:{" "}
                  {profile.dernierConnexion
                    ? new Date(profile.dernierConnexion).toLocaleDateString(
                        "fr-FR",
                      )
                    : "Jamais"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personnel</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles et de contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={personalForm.prenom || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            prenom: e.target.value,
                          })
                        }
                        className={
                          getFieldError(personalErrors, "prenom")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {getFieldError(personalErrors, "prenom") && (
                        <p className="text-sm text-red-500 mt-1">
                          {getFieldError(personalErrors, "prenom")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={personalForm.nom || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            nom: e.target.value,
                          })
                        }
                        className={
                          getFieldError(personalErrors, "nom")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {getFieldError(personalErrors, "nom") && (
                        <p className="text-sm text-red-500 mt-1">
                          {getFieldError(personalErrors, "nom")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalForm.email || ""}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          email: e.target.value,
                        })
                      }
                      className={
                        getFieldError(personalErrors, "email")
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {getFieldError(personalErrors, "email") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError(personalErrors, "email")}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        value={personalForm.telephone || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            telephone: e.target.value,
                          })
                        }
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>

                    <div>
                      <Label htmlFor="poste">Poste *</Label>
                      <Input
                        id="poste"
                        value={personalForm.poste || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            poste: e.target.value,
                          })
                        }
                        className={
                          getFieldError(personalErrors, "poste")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {getFieldError(personalErrors, "poste") && (
                        <p className="text-sm text-red-500 mt-1">
                          {getFieldError(personalErrors, "poste")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departement">Département</Label>
                      <Input
                        id="departement"
                        value={personalForm.departement || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            departement: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="localisation">Localisation</Label>
                      <Input
                        id="localisation"
                        value={personalForm.localisation || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            localisation: e.target.value,
                          })
                        }
                        placeholder="Ville, Pays"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="biographie">Biographie</Label>
                    <Textarea
                      id="biographie"
                      rows={3}
                      value={personalForm.biographie || ""}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          biographie: e.target.value,
                        })
                      }
                      placeholder="Parlez-nous de vous..."
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {(personalForm.biographie || "").length}/500 caractères
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handlePersonalUpdate} disabled={saving}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Adresse
                  </CardTitle>
                  <CardDescription>
                    Informations sur votre adresse de contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      value={personalForm.adresse || ""}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          adresse: e.target.value,
                        })
                      }
                      placeholder="123 Rue de l'Agriculture"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ville">Ville</Label>
                      <Input
                        id="ville"
                        value={personalForm.ville || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            ville: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="codePostal">Code postal</Label>
                      <Input
                        id="codePostal"
                        value={personalForm.codePostal || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            codePostal: e.target.value,
                          })
                        }
                        placeholder="20000"
                        className={
                          getFieldError(personalErrors, "codePostal")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {getFieldError(personalErrors, "codePostal") && (
                        <p className="text-sm text-red-500 mt-1">
                          {getFieldError(personalErrors, "codePostal")}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pays">Pays</Label>
                      <Input
                        id="pays"
                        value={personalForm.pays || ""}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            pays: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handlePersonalUpdate} disabled={saving}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Préférences d'affichage
                  </CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de l'interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="langue">Langue</Label>
                      <Select
                        value={profile.preferences.langue}
                        onValueChange={(value: "fr" | "en" | "es") =>
                          handlePreferencesUpdate({ langue: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="theme">Thème</Label>
                      <Select
                        value={profile.preferences.theme}
                        onValueChange={(value: "light" | "dark" | "auto") =>
                          handlePreferencesUpdate({ theme: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Clair</SelectItem>
                          <SelectItem value="dark">Sombre</SelectItem>
                          <SelectItem value="auto">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="formatDate">Format de date</Label>
                      <Select
                        value={profile.preferences.formatDate}
                        onValueChange={(
                          value: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD",
                        ) => handlePreferencesUpdate({ formatDate: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="formatHeure">Format d'heure</Label>
                      <Select
                        value={profile.preferences.formatHeure}
                        onValueChange={(value: "12h" | "24h") =>
                          handlePreferencesUpdate({ formatHeure: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 heures</SelectItem>
                          <SelectItem value="12h">12 heures (AM/PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Gérez vos préférences de notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">
                          Notifications par email
                        </Label>
                        <p className="text-sm text-gray-500">
                          Recevez des notifications par email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={profile.preferences.notifications.email}
                        onCheckedChange={(checked) =>
                          handlePreferencesUpdate({
                            notifications: {
                              ...profile.preferences.notifications,
                              email: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">
                          Notifications push
                        </Label>
                        <p className="text-sm text-gray-500">
                          Recevez des notifications dans le navigateur
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={profile.preferences.notifications.push}
                        onCheckedChange={(checked) =>
                          handlePreferencesUpdate({
                            notifications: {
                              ...profile.preferences.notifications,
                              push: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-alerts">Alertes système</Label>
                        <p className="text-sm text-gray-500">
                          Alertes importantes du système
                        </p>
                      </div>
                      <Switch
                        id="system-alerts"
                        checked={
                          profile.preferences.notifications.alertesSysteme
                        }
                        onCheckedChange={(checked) =>
                          handlePreferencesUpdate({
                            notifications: {
                              ...profile.preferences.notifications,
                              alertesSysteme: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="production-alerts">
                          Alertes de production
                        </Label>
                        <p className="text-sm text-gray-500">
                          Notifications sur les métriques de production
                        </p>
                      </div>
                      <Switch
                        id="production-alerts"
                        checked={
                          profile.preferences.notifications.alertesProduction
                        }
                        onCheckedChange={(checked) =>
                          handlePreferencesUpdate({
                            notifications: {
                              ...profile.preferences.notifications,
                              alertesProduction: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="health-alerts">Alertes de santé</Label>
                        <p className="text-sm text-gray-500">
                          Notifications sur la santé du cheptel
                        </p>
                      </div>
                      <Switch
                        id="health-alerts"
                        checked={profile.preferences.notifications.alertesSante}
                        onCheckedChange={(checked) =>
                          handlePreferencesUpdate({
                            notifications: {
                              ...profile.preferences.notifications,
                              alertesSante: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="surveillance-alerts">
                          Alertes de surveillance
                        </Label>
                        <p className="text-sm text-gray-500">
                          Notifications des caméras et capteurs
                        </p>
                      </div>
                      <Switch
                        id="surveillance-alerts"
                        checked={
                          profile.preferences.notifications.alertesSurveillance
                        }
                        onCheckedChange={(checked) =>
                          handlePreferencesUpdate({
                            notifications: {
                              ...profile.preferences.notifications,
                              alertesSurveillance: checked,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-reports">
                          Rapports hebdomadaires
                        </Label>
                        <p className="text-sm text-gray-500">
                          Résumé des performances chaque semaine
                        </p>
                      </div>
                      <Switch
                        id="weekly-reports"
                        checked={
                          profile.preferences.notifications
                            .rapportsHebdomadaires
                        }
                        onCheckedChange={(checked) =>
                          handlePreferencesUpdate({
                            notifications: {
                              ...profile.preferences.notifications,
                              rapportsHebdomadaires: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Changer le mot de passe
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe pour sécuriser votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">
                      Mot de passe actuel *
                    </Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.motDePasseActuel}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            motDePasseActuel: e.target.value,
                          })
                        }
                        className={
                          getFieldError(passwordErrors, "motDePasseActuel")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {getFieldError(passwordErrors, "motDePasseActuel") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError(passwordErrors, "motDePasseActuel")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="new-password">Nouveau mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.nouveauMotDePasse}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            nouveauMotDePasse: e.target.value,
                          })
                        }
                        className={
                          getFieldError(passwordErrors, "nouveauMotDePasse")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {getFieldError(passwordErrors, "nouveauMotDePasse") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError(passwordErrors, "nouveauMotDePasse")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">
                      Confirmer le mot de passe *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmerMotDePasse}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmerMotDePasse: e.target.value,
                          })
                        }
                        className={
                          getFieldError(passwordErrors, "confirmerMotDePasse")
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {getFieldError(passwordErrors, "confirmerMotDePasse") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError(passwordErrors, "confirmerMotDePasse")}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handlePasswordChange} disabled={saving}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Modification...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Changer le mot de passe
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Authentification à deux facteurs
                  </CardTitle>
                  <CardDescription>
                    Ajoutez une couche de sécurité supplémentaire à votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Authentification à deux facteurs
                      </p>
                      <p className="text-sm text-gray-500">
                        {profile.securite.deuxFacteurs
                          ? "Activée - Votre compte est protégé"
                          : "Désactivée - Activez pour plus de sécurité"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          profile.securite.deuxFacteurs
                            ? "default"
                            : "secondary"
                        }
                      >
                        {profile.securite.deuxFacteurs
                          ? "Activée"
                          : "Désactivée"}
                      </Badge>
                      {profile.securite.deuxFacteurs ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => disableProfileTwoFactor()}
                        >
                          Désactiver
                        </Button>
                      ) : (
                        <Button size="sm" onClick={handleEnableTwoFactor}>
                          Activer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Données personnelles
                  </CardTitle>
                  <CardDescription>
                    Gérez vos données personnelles et votre vie privée
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium">Télécharger mes données</p>
                      <p className="text-sm text-gray-500">
                        Obtenez une copie de toutes vos données
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleDownloadData}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium text-red-900">
                        Supprimer mon compte
                      </p>
                      <p className="text-sm text-red-600">
                        Supprimez définitivement votre compte et toutes vos
                        données
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Two-Factor Authentication Dialog */}
      <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Activer l'authentification à deux facteurs
            </DialogTitle>
            <DialogDescription>
              Scannez le code QR avec votre application d'authentification puis
              entrez le code à 6 chiffres
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {twoFactorData.qrCode && (
              <div className="text-center">
                <img
                  src={twoFactorData.qrCode}
                  alt="QR Code 2FA"
                  className="mx-auto w-48 h-48 border border-gray-200 rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Secret:{" "}
                  <code className="text-xs">{twoFactorData.secret}</code>
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="verification-code">Code de vérification</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTwoFactorDialog(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleVerifyTwoFactor}>Vérifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-900">
              Supprimer le compte
            </DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Toutes vos données seront
              définitivement supprimées.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Attention
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    Cette action supprimera définitivement votre compte et
                    toutes les données associées.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="delete-password">
                Confirmer avec votre mot de passe
              </Label>
              <Input
                id="delete-password"
                type="password"
                placeholder="Votre mot de passe"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive">Supprimer le compte</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfile;
