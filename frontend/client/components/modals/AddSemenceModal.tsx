import React, { useState, useEffect } from "react";
import { RefreshCw, FlaskConical, User, Hash } from "lucide-react";
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
import { CreateSemenceInput } from "@shared/semence";
import {
  CreateSemenceValidationSchema,
  formatValidationErrors,
  validateIdentificateurFormat,
  validateNumTaureauFormat,
  generateSampleIdentificateur,
  generateSampleNumTaureau,
  COMMON_RACES,
} from "../../lib/semenceValidation";

interface AddSemenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  identificateur: string;
  nom_taureau: string;
  race_taureau: string;
  num_taureau: string;
}

const AddSemenceModal: React.FC<AddSemenceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { loading, error, createRecord } = useSemence();
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

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Real-time validation for specific fields
    if (
      field === "identificateur" &&
      value &&
      !validateIdentificateurFormat(value)
    ) {
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
    setFormData({
      identificateur: "",
      nom_taureau: "",
      race_taureau: "",
      num_taureau: "",
    });
    setValidationErrors({});
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

    try {
      // Validate form data
      const input: CreateSemenceInput = {
        identificateur: formData.identificateur.toUpperCase(),
        nom_taureau: formData.nom_taureau.trim(),
        race_taureau: formData.race_taureau.trim(),
        num_taureau: formData.num_taureau.toUpperCase(),
        createdBy: "Administrateur",
      };

      // Validate using Zod schema
      CreateSemenceValidationSchema.parse(input);

      // Create the semence record
      const result = await createRecord(input);

      if (result) {
        toast({
          title: "Succès",
          description: "La semence a été créée avec succès.",
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
          description: error || "Une erreur est survenue lors de la création.",
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
            <FlaskConical className="w-5 h-5 text-boviclouds-primary" />
            Ajouter une semence
          </DialogTitle>
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
                onChange={(e) =>
                  handleFormChange("identificateur", e.target.value)
                }
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
                title="Générer un identificateur"
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
              <p className="text-sm text-red-600">
                {validationErrors.nom_taureau}
              </p>
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
            <Select
              value={formData.race_taureau}
              onValueChange={(value) => handleFormChange("race_taureau", value)}
              disabled={loading}
            >
              <SelectTrigger
                className={
                  validationErrors.race_taureau ? "border-red-500" : ""
                }
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
            {formData.race_taureau === "custom" && (
              <Input
                type="text"
                value={
                  formData.race_taureau === "custom"
                    ? ""
                    : formData.race_taureau
                }
                onChange={(e) =>
                  handleFormChange("race_taureau", e.target.value)
                }
                placeholder="Saisir la race manuellement"
                className={
                  validationErrors.race_taureau ? "border-red-500" : ""
                }
                disabled={loading}
              />
            )}
            {validationErrors.race_taureau && (
              <p className="text-sm text-red-600">
                {validationErrors.race_taureau}
              </p>
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
                onChange={(e) =>
                  handleFormChange("num_taureau", e.target.value)
                }
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
                title="Générer un numéro"
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
                L'identificateur et le numéro du taureau doivent être
                différents.
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
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid() || loading}
            className="w-full sm:w-auto bg-boviclouds-primary hover:bg-boviclouds-green-dark"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              "Créer la semence"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSemenceModal;
