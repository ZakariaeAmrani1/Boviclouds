import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Calendar,
  User,
  Zap,
  Edit,
  FlaskConical,
} from "lucide-react";
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
import { useSemenceList } from "../../hooks/useSemence";
import {
  InseminationRecord,
  UpdateInseminationInput,
} from "@shared/insemination";
import {
  UpdateInseminationValidationSchema,
  formatValidationErrors,
  validateNNIFormat,
  validateSemenceIdFormat,
} from "../../lib/inseminationValidation";

interface EditInseminationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  insemination: InseminationRecord;
}

interface FormData {
  nni: string;
  date_dissemination: string;
  semence_id: string;
  inseminateur_id: string;
  responsable_local_id: string;
}

const EditInseminationModal: React.FC<EditInseminationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  insemination,
}) => {
  const { toast } = useToast();
  const { loading, error, updateRecord } = useInsemination();
  const { users, loading: usersLoading, getUserName } = useUsers();
  const { data: semenceData, loading: semenceLoading } = useSemenceList(
    {},
    { page: 1, limit: 100 },
  );
  const inseminateurs = users.filter((user) => user.role === "INSEMINATEUR");
  const responsables = users.filter(
    (user) => user.role === "RESPONSABLE_LOCAL",
  );
  const semences = semenceData?.data || [];

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

  const [hasChanges, setHasChanges] = useState(false);
  const [formReady, setFormReady] = useState(false);

  // Get today's date for max validation
  const today = new Date().toISOString().split("T")[0];

  // Initialize form data when modal opens or insemination changes
  useEffect(() => {
    if (isOpen && insemination) {
      // insemination.semence_id = semance.id;
      const initialData = {
        nni: insemination.nni,
        date_dissemination: insemination.date_dissemination,
        semence_id: insemination.semence_id,
        inseminateur_id: insemination.inseminateur_id,
        responsable_local_id: insemination.responsable_local_id,
      };

      setFormData(initialData);
      setHasChanges(false);
      setValidationErrors({});
      setFormReady(true);
    } else {
      setFormReady(false);
    }
  }, [isOpen, insemination]);
  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Check if there are changes from original
      const originalData = {
        nni: insemination.nni,
        date_dissemination: insemination.date_dissemination,
        semence_id: insemination.semence_id,
        inseminateur_id: insemination.inseminateur_id,
        responsable_local_id: insemination.responsable_local_id,
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
    if (insemination) {
      setFormData({
        nni: insemination.nni,
        date_dissemination: insemination.date_dissemination,
        semence_id: insemination.semence_id,
        inseminateur_id: insemination.inseminateur_id,
        responsable_local_id: insemination.responsable_local_id,
      });
    }
    setValidationErrors({});
    setHasChanges(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
      const updateData: UpdateInseminationInput = {};

      const semence = semences.find(
        (s) => s.identificateur === formData.semence_id,
      );

      if (formData.nni !== insemination.nni) {
        updateData.nni = formData.nni.toUpperCase();
      }
      if (formData.date_dissemination !== insemination.date_dissemination) {
        updateData.date_dissemination = formData.date_dissemination;
      }
      if (formData.semence_id !== insemination.semence_id) {
        updateData.semence_id = formData.semence_id;
      }
      if (formData.inseminateur_id !== insemination.inseminateur_id) {
        updateData.inseminateur_id = formData.inseminateur_id;
      }
      if (formData.responsable_local_id !== insemination.responsable_local_id) {
        updateData.responsable_local_id = formData.responsable_local_id;
      }

      updateData.semence_id = semence.id;

      // Validate using Zod schema
      UpdateInseminationValidationSchema.parse(updateData);

      // Update the insemination record
      const result = await updateRecord(insemination.id, updateData);

      if (result) {
        toast({
          title: "Succès",
          description: "L'insémination a été mise à jour avec succès.",
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
      formData.nni &&
      formData.date_dissemination &&
      formData.semence_id &&
      formData.inseminateur_id &&
      formData.responsable_local_id &&
      Object.keys(validationErrors).length === 0
    );
  };

  return (
    <>
      {isOpen && !formReady && (
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-boviclouds-primary" />
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      )}
      {isOpen && formReady && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-boviclouds-primary" />
                Modifier l'insémination
              </DialogTitle>
              <p className="text-sm text-gray-600">
                ID: {insemination.id} | Créé le{" "}
                {new Date(insemination.createdAt).toLocaleDateString("fr-FR")}
              </p>
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
                <Label
                  htmlFor="date_dissemination"
                  className="text-sm font-medium"
                >
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

              {/* Semence Selection Field */}
              <div className="space-y-2">
                <Label htmlFor="semence_id" className="text-sm font-medium">
                  <FlaskConical className="w-4 h-4 inline mr-1" />
                  Semence <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.semence_id}
                  onValueChange={(value) =>
                    handleFormChange("semence_id", value)
                  }
                  disabled={loading || semenceLoading}
                >
                  <SelectTrigger
                    className={
                      validationErrors.semence_id ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Sélectionner une semence" />
                  </SelectTrigger>
                  <SelectContent>
                    {semences.map((semence) => (
                      <SelectItem
                        key={semence.id}
                        value={semence.identificateur}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-800 bg-blue-100 px-2 py-1 rounded text-xs">
                            {semence.identificateur}
                          </span>
                          <span className="text-gray-700">
                            {semence.nom_taureau} ({semence.race_taureau})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    {semences.length === 0 && !semenceLoading && (
                      <SelectItem value="" disabled>
                        Aucune semence disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {validationErrors.semence_id && (
                  <p className="text-sm text-red-600">
                    {validationErrors.semence_id}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Sélectionnez une semence parmi celles disponibles
                </p>
                {semenceLoading && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Chargement des semences...
                  </p>
                )}
              </div>

              {/* Inseminateur Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="inseminateur_id"
                  className="text-sm font-medium"
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Inséminateur <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.inseminateur_id}
                  onValueChange={(value) => {
                    handleFormChange("inseminateur_id", value);
                  }}
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
                  onValueChange={(value) => {
                    handleFormChange("responsable_local_id", value);
                  }}
                  disabled={loading || usersLoading}
                >
                  <SelectTrigger
                    className={
                      validationErrors.responsable_local_id
                        ? "border-red-500"
                        : ""
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
              {validationErrors.responsable_local_id?.includes(
                "différents",
              ) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    L'inséminateur et le responsable local doivent être des
                    personnes différentes.
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
      )}
    </>
  );
};

export default EditInseminationModal;
