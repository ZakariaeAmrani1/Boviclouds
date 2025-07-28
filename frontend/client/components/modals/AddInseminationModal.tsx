import React, { useState, useEffect } from "react";
import { RefreshCw, Calendar, User, Zap } from "lucide-react";
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
import { useInsemination, useUsers } from "../../hooks/useInsemination";
import { CreateInseminationInput } from "@shared/insemination";
import {
  CreateInseminationValidationSchema,
  formatValidationErrors,
  validateNNIFormat,
  validateSemenceIdFormat,
  generateSampleSemenceId,
} from "../../lib/inseminationValidation";

interface AddInseminationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  nni: string;
  date_dissemination: string;
  semence_id: string;
  inseminateur_id: string;
  responsable_local_id: string;
}

const AddInseminationModal: React.FC<AddInseminationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { loading, error, createRecord } = useInsemination();
  const { users, loading: usersLoading, getUserName } = useUsers();
  const inseminateurs = users.filter((user) => user.role === "INSEMINATEUR");
  const responsables = users.filter(
    (user) => user.role === "RESPONSABLE_LOCAL",
  );
  const [formData, setFormData] = useState<FormData>({
    nni: "",
    date_dissemination: "",
    semence_id: "",
    inseminateur_id: "",
    responsable_local_id: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [showSemenceHelp, setShowSemenceHelp] = useState(false);

  // Get today's date for default value
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      // Set default date to today
      setFormData((prev) => ({
        ...prev,
        date_dissemination: today,
      }));
    }
  }, [isOpen, today]);

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
    if (field === "nni" && value && !validateNNIFormat(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "Format NNI invalide (ex: FR1234567890)",
      }));
    }

    if (field === "semence_id" && value && !validateSemenceIdFormat(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "Format d'ID de semence invalide (ex: SEM123456)",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      nni: "",
      date_dissemination: today,
      semence_id: "",
      inseminateur_id: "",
      responsable_local_id: "",
    });
    setValidationErrors({});
    setShowSemenceHelp(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateSemenceId = () => {
    const newId = generateSampleSemenceId();
    handleFormChange("semence_id", newId);
    toast({
      title: "ID généré",
      description: `ID de semence généré: ${newId}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validate form data
      const input: CreateInseminationInput = {
        nni: formData.nni.toUpperCase(),
        date_dissemination: formData.date_dissemination,
        semence_id: formData.semence_id.toUpperCase(),
        inseminateur_id: formData.inseminateur_id,
        responsable_local_id: formData.responsable_local_id,
        createdBy: "current_user", // In a real app, this would come from auth context
      };

      // Validate using Zod schema
      CreateInseminationValidationSchema.parse(input);

      // Create the insemination record
      const result = await createRecord(input);

      if (result) {
        toast({
          title: "Succès",
          description: "L'insémination a été créée avec succès.",
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
      formData.nni &&
      formData.date_dissemination &&
      formData.semence_id &&
      formData.inseminateur_id &&
      formData.responsable_local_id &&
      Object.keys(validationErrors).length === 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-boviclouds-primary" />
            Ajouter une insémination
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NNI Field */}
          <div className="space-y-2">
            <Label htmlFor="nni" className="text-sm font-medium">
              NNI <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nni"
              type="text"
              value={formData.nni}
              onChange={(e) => handleFormChange("nni", e.target.value)}
              placeholder="FR1234567890"
              className={validationErrors.nni ? "border-red-500" : ""}
              disabled={loading}
            />
            {validationErrors.nni && (
              <p className="text-sm text-red-600">{validationErrors.nni}</p>
            )}
          </div>

          {/* Date Dissemination Field */}
          <div className="space-y-2">
            <Label htmlFor="date_dissemination" className="text-sm font-medium">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date de dissémination <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date_dissemination"
              type="date"
              value={formData.date_dissemination}
              onChange={(e) =>
                handleFormChange("date_dissemination", e.target.value)
              }
              max={today}
              className={
                validationErrors.date_dissemination ? "border-red-500" : ""
              }
              disabled={loading}
            />
            {validationErrors.date_dissemination && (
              <p className="text-sm text-red-600">
                {validationErrors.date_dissemination}
              </p>
            )}
          </div>

          {/* Semence ID Field */}
          <div className="space-y-2">
            <Label htmlFor="semence_id" className="text-sm font-medium">
              ID Semence <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="semence_id"
                type="text"
                value={formData.semence_id}
                onChange={(e) => handleFormChange("semence_id", e.target.value)}
                placeholder="SEM123456"
                className={
                  validationErrors.semence_id
                    ? "border-red-500 flex-1"
                    : "flex-1"
                }
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSemenceId}
                disabled={loading}
                title="Générer un ID"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            {validationErrors.semence_id && (
              <p className="text-sm text-red-600">
                {validationErrors.semence_id}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Format: SEM suivi de 6 chiffres (ex: SEM123456)
            </p>
          </div>

          {/* Inseminateur Field */}
          <div className="space-y-2">
            <Label htmlFor="inseminateur_id" className="text-sm font-medium">
              <User className="w-4 h-4 inline mr-1" />
              Inséminateur <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.inseminateur_id}
              onValueChange={(value) =>
                handleFormChange("inseminateur_id", value)
              }
              disabled={loading || usersLoading}
            >
              <SelectTrigger
                className={
                  validationErrors.inseminateur_id ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Sélectionner un inséminateur" />
              </SelectTrigger>
              <SelectContent>
                {inseminateurs.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.prenom} {user.nom} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.inseminateur_id && (
              <p className="text-sm text-red-600">
                {validationErrors.inseminateur_id}
              </p>
            )}
          </div>

          {/* Responsable Local Field */}
          <div className="space-y-2">
            <Label
              htmlFor="responsable_local_id"
              className="text-sm font-medium"
            >
              <User className="w-4 h-4 inline mr-1" />
              Responsable local <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.responsable_local_id}
              onValueChange={(value) =>
                handleFormChange("responsable_local_id", value)
              }
              disabled={loading || usersLoading}
            >
              <SelectTrigger
                className={
                  validationErrors.responsable_local_id ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Sélectionner un responsable local" />
              </SelectTrigger>
              <SelectContent>
                {responsables.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.prenom} {user.nom} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.responsable_local_id && (
              <p className="text-sm text-red-600">
                {validationErrors.responsable_local_id}
              </p>
            )}
          </div>

          {/* Cross-validation error */}
          {validationErrors.responsable_local_id?.includes("différents") && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                L'inséminateur et le responsable local doivent être des
                personnes différentes.
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
              "Créer l'insémination"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInseminationModal;
