import React, { useState, useEffect } from "react";
import { RefreshCw, FlaskConical, Edit, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../hooks/use-toast";
import { useSemence, useUsers } from "../../hooks/useSemence";
import {
  SemenceRecord,
  UpdateSemenceInput,
} from "@shared/semence";
import {
  UpdateSemenceValidationSchema,
  formatValidationErrors,
  validateIdentificateurFormat,
  validateNumTaureauFormat,
  generateSampleIdentificateur,
  generateSampleNumTaureau,
  COMMON_RACES,
} from "../../lib/semenceValidation";

interface EditSemenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  semence: SemenceRecord;
}

interface FormData {
  identificateur: string;
  nom_taureau: string;
  race_taureau: string;
  num_taureau: string;
}

const EditSemenceModal: React.FC<EditSemenceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  semence,
}) => {
  const { toast } = useToast();
  const { loading, error, updateRecord } = useSemence();
  const { users, loading: usersLoading, getUserName } = useUsers();

  const [formData, setFormData] = useState<FormData>({
    identificateur: "",
    nom_taureau: "",
    race_taureau: "",
    num_taureau: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when modal opens or semence changes
  useEffect(() => {
    if (isOpen && semence) {
      const initialData = {
        identificateur: semence.identificateur,
        nom_taureau: semence.nom_taureau,
        race_taureau: semence.race_taureau,
        num_taureau: semence.num_taureau,
      };
      setFormData(initialData);
      setHasChanges(false);
      setValidationErrors({});
    }
  }, [isOpen, semence]);

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Check if there are changes from original
      const originalData = {
        identificateur: semence.identificateur,
        nom_taureau: semence.nom_taureau,
        race_taureau: semence.race_taureau,
        num_taureau: semence.num_taureau,
      };

      const hasChanged = Object.keys(newData).some(
        (key) =>
          newData[key as keyof FormData] !==
          originalData[key as keyof FormData],
      );
      setHasChanges(hasChanged);

      return newData;
    });

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Real-time validation for specific fields
    if (field === "identificateur" && value && !validateIdentificateurFormat(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "Format d'identificateur invalide (ex: SEM123456)",
      }));
    }

    if (field === "num_taureau" && value && !validateNumTaureauFormat(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "Format de numéro de taureau invalide (ex: FR12345678)",
      }));
    }
  };

  const resetForm = () => {
    if (semence) {
      setFormData({
        identificateur: semence.identificateur,
        nom_taureau: semence.nom_taureau,
        race_taureau: semence.race_taureau,
        num_taureau: semence.num_taureau,
      });
    }
    setValidationErrors({});
    setHasChanges(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateIdentificateur = () => {
    const newId = generateSampleIdentificateur();
    handleFormChange("identificateur", newId);
    toast({
      title: "Identificateur généré",
      description: `Identificateur généré: ${newId}`,
    });
  };

  const generateNumTaureau = () => {
    const newNum = generateSampleNumTaureau();
    handleFormChange("num_taureau", newNum);
    toast({
      title: "Numéro généré",
      description: `Numéro de taureau généré: ${newNum}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!hasChanges) {
      toast({
        title: "Aucun changement",
        description: "Aucune modification n'a été apportée.",
      });
      return;
    }

    try {
      // Prepare update data (only changed fields)
      const updateData: UpdateSemenceInput = {};

      if (formData.identificateur !== semence.identificateur) {
        updateData.identificateur = formData.identificateur.toUpperCase();
      }
      if (formData.nom_taureau !== semence.nom_taureau) {
        updateData.nom_taureau = formData.nom_taureau.trim();
      }
      if (formData.race_taureau !== semence.race_taureau) {
        updateData.race_taureau = formData.race_taureau.trim();
      }
      if (formData.num_taureau !== semence.num_taureau) {
        updateData.num_taureau = formData.num_taureau.toUpperCase();
      }

      // Validate using Zod schema
      UpdateSemenceValidationSchema.parse(updateData);

      // Update the semence record
      const result = await updateRecord(semence.id, updateData);

      if (result) {
        toast({
          title: "Succès",
          description: "La semence a été mise à jour avec succès.",
        });
        onSuccess();
        handleClose();
      }
    } catch (err: any) {
      if (err.name === "ZodError") {
        const formattedErrors = formatValidationErrors(err);
        setValidationErrors(formattedErrors);
        toast({
          title: "Erreur de validation",
          description: "Veuillez corriger les erreurs dans le formulaire.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description:
            error || "Une erreur est survenue lors de la mise à jour.",
          variant: "destructive",
        });
      }
    }
  };

  const isFormValid = () => {
    return (
      formData.identificateur &&
      formData.nom_taureau &&
      formData.race_taureau &&
      formData.num_taureau &&
      Object.keys(validationErrors).length === 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-boviclouds-primary" />
            Modifier la semence
          </DialogTitle>
          <p className="text-sm text-gray-600">
            ID: {semence.id} | Créé le{" "}
            {new Date(semence.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identificateur Field */}
          <div className="space-y-2">
            <Label htmlFor="identificateur" className="text-sm font-medium">
              <Hash className="w-4 h-4 inline mr-1" />
              Identificateur <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="identificateur"
                type="text"
                value={formData.identificateur}
                onChange={(e) => handleFormChange("identificateur", e.target.value)}
                placeholder="SEM123456"
                className={
                  validationErrors.identificateur
                    ? "border-red-500 flex-1"
                    : "flex-1"
                }
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateIdentificateur}
                disabled={loading}
                title="Générer un nouvel identificateur"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            {validationErrors.identificateur && (
              <p className="text-sm text-red-600">
                {validationErrors.identificateur}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Format: SEM suivi de 6 chiffres (ex: SEM123456)
            </p>
          </div>

          {/* Nom Taureau Field */}
          <div className="space-y-2">
            <Label htmlFor="nom_taureau" className="text-sm font-medium">
              Nom du taureau <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nom_taureau"
              type="text"
              value={formData.nom_taureau}
              onChange={(e) => handleFormChange("nom_taureau", e.target.value)}
              placeholder="Napoleon"
              className={validationErrors.nom_taureau ? "border-red-500" : ""}
              disabled={loading}
            />
            {validationErrors.nom_taureau && (
              <p className="text-sm text-red-600">{validationErrors.nom_taureau}</p>
            )}
            <p className="text-xs text-gray-500">
              Nom du taureau (2-50 caractères, lettres et espaces uniquement)
            </p>
          </div>

          {/* Race Taureau Field */}
          <div className="space-y-2">
            <Label htmlFor="race_taureau" className="text-sm font-medium">
              Race du taureau <span className="text-red-500">*</span>
            </Label>
            {COMMON_RACES.includes(formData.race_taureau) ? (
              <Select
                value={formData.race_taureau}
                onValueChange={(value) => handleFormChange("race_taureau", value)}
                disabled={loading}
              >
                <SelectTrigger
                  className={validationErrors.race_taureau ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Sélectionner une race" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_RACES.map((race) => (
                    <SelectItem key={race} value={race}>
                      {race}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Autre (saisie manuelle)</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={formData.race_taureau}
                  onChange={(e) => handleFormChange("race_taureau", e.target.value)}
                  placeholder="Race du taureau"
                  className={validationErrors.race_taureau ? "border-red-500" : ""}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleFormChange("race_taureau", COMMON_RACES[0])}
                  disabled={loading}
                >
                  Utiliser une race prédéfinie
                </Button>
              </div>
            )}
            {validationErrors.race_taureau && (
              <p className="text-sm text-red-600">{validationErrors.race_taureau}</p>
            )}
            <p className="text-xs text-gray-500">
              Race du taureau (2-30 caractères)
            </p>
          </div>

          {/* Numéro Taureau Field */}
          <div className="space-y-2">
            <Label htmlFor="num_taureau" className="text-sm font-medium">
              <Hash className="w-4 h-4 inline mr-1" />
              Numéro du taureau <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="num_taureau"
                type="text"
                value={formData.num_taureau}
                onChange={(e) => handleFormChange("num_taureau", e.target.value)}
                placeholder="FR12345678"
                className={
                  validationErrors.num_taureau
                    ? "border-red-500 flex-1"
                    : "flex-1"
                }
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateNumTaureau}
                disabled={loading}
                title="Générer un nouveau numéro"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            {validationErrors.num_taureau && (
              <p className="text-sm text-red-600">
                {validationErrors.num_taureau}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Format: 2 lettres suivies de 8 chiffres (ex: FR12345678)
            </p>
          </div>

          {/* Cross-validation error */}
          {validationErrors.num_taureau?.includes("différents") && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                L'identificateur et le numéro du taureau doivent être différents.
              </p>
            </div>
          )}

          {/* Changes indicator */}
          {hasChanges && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Des modifications ont été apportées au formulaire.
              </p>
            </div>
          )}
        </form>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={loading || !hasChanges}
            className="w-full sm:w-auto"
          >
            Réinitialiser
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid() || !hasChanges || loading}
            className="w-full sm:w-auto bg-boviclouds-primary hover:bg-boviclouds-green-dark"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Sauvegarder les modifications"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSemenceModal;
