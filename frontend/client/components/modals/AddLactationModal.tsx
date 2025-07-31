import React, { useState, useEffect } from "react";
import { RefreshCw, Milk, User, Hash, Calendar } from "lucide-react";
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
import { useLactation, useUsers, useIdentifications } from "../../hooks/useLactation";
import { CreateLactationInput } from "@shared/lactation";
import {
  CreateLactationValidationSchema,
  formatValidationErrors,
  calculateMgPercentage,
  formatDateForInput,
} from "../../lib/lactationValidation";

interface AddLactationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  sujet_id: string;
  date_velage: string;
  n_lactation: number;
  lait_kg: number;
  kg_mg: number;
  pct_proteine: number;
  pct_mg: number;
  controleur_laitier_id: string;
}

const AddLactationModal: React.FC<AddLactationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { loading, error, createRecord } = useLactation();
  const { users, loading: usersLoading } = useUsers();
  const { identifications, loading: identificationsLoading } = useIdentifications();

  const [formData, setFormData] = useState<FormData>({
    sujet_id: "",
    date_velage: "",
    n_lactation: 1,
    lait_kg: 0,
    kg_mg: 0,
    pct_proteine: 0,
    pct_mg: 0,
    controleur_laitier_id: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleFormChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Auto-calculate MG percentage when milk kg or mg kg changes
    if (field === "lait_kg" || field === "kg_mg") {
      const milkKg = field === "lait_kg" ? Number(value) : formData.lait_kg;
      const mgKg = field === "kg_mg" ? Number(value) : formData.kg_mg;
      
      if (milkKg > 0 && mgKg >= 0) {
        const calculatedMgPct = calculateMgPercentage(milkKg, mgKg);
        setFormData(prev => ({ ...prev, pct_mg: Number(calculatedMgPct.toFixed(2)) }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      sujet_id: "",
      date_velage: "",
      n_lactation: 1,
      lait_kg: 0,
      kg_mg: 0,
      pct_proteine: 0,
      pct_mg: 0,
      controleur_laitier_id: "",
    });
    setValidationErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const setDefaultDate = () => {
    const today = new Date();
    const formattedDate = formatDateForInput(today.toISOString());
    handleFormChange("date_velage", formattedDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validate form data
      const input: CreateLactationInput = {
        sujet_id: formData.sujet_id,
        date_velage: formData.date_velage,
        n_lactation: formData.n_lactation,
        lait_kg: formData.lait_kg,
        kg_mg: formData.kg_mg,
        pct_proteine: formData.pct_proteine,
        pct_mg: formData.pct_mg,
        controleur_laitier_id: formData.controleur_laitier_id,
      };

      // Validate using Zod schema
      CreateLactationValidationSchema.parse(input);

      // Create the lactation record
      const result = await createRecord(input);

      if (result) {
        toast({
          title: "Succès",
          description: "La lactation a été créée avec succès.",
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
      formData.sujet_id &&
      formData.date_velage &&
      formData.n_lactation > 0 &&
      formData.lait_kg >= 0 &&
      formData.kg_mg >= 0 &&
      formData.pct_proteine >= 0 &&
      formData.pct_mg >= 0 &&
      formData.controleur_laitier_id &&
      Object.keys(validationErrors).length === 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Milk className="w-5 h-5 text-boviclouds-primary" />
            Ajouter une lactation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sujet Field */}
            <div className="space-y-2">
              <Label htmlFor="sujet_id" className="text-sm font-medium">
                <User className="w-4 h-4 inline mr-1" />
                Sujet <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.sujet_id}
                onValueChange={(value) => handleFormChange("sujet_id", value)}
                disabled={loading || identificationsLoading}
              >
                <SelectTrigger
                  className={
                    validationErrors.sujet_id ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Sélectionner un sujet" />
                </SelectTrigger>
                <SelectContent>
                  {identifications.map((identification) => (
                    <SelectItem key={identification.id} value={identification.id}>
                      {identification.nni} - {identification.nom} ({identification.race})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.sujet_id && (
                <p className="text-sm text-red-600">
                  {validationErrors.sujet_id}
                </p>
              )}
            </div>

            {/* Date Velage Field */}
            <div className="space-y-2">
              <Label htmlFor="date_velage" className="text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date de vêlage <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="date_velage"
                  type="date"
                  value={formData.date_velage}
                  onChange={(e) => handleFormChange("date_velage", e.target.value)}
                  className={
                    validationErrors.date_velage
                      ? "border-red-500 flex-1"
                      : "flex-1"
                  }
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={setDefaultDate}
                  disabled={loading}
                  title="Date d'aujourd'hui"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
              {validationErrors.date_velage && (
                <p className="text-sm text-red-600">
                  {validationErrors.date_velage}
                </p>
              )}
            </div>

            {/* Numéro Lactation Field */}
            <div className="space-y-2">
              <Label htmlFor="n_lactation" className="text-sm font-medium">
                <Hash className="w-4 h-4 inline mr-1" />
                Numéro de lactation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="n_lactation"
                type="number"
                min="1"
                max="20"
                value={formData.n_lactation}
                onChange={(e) => handleFormChange("n_lactation", parseInt(e.target.value) || 1)}
                className={validationErrors.n_lactation ? "border-red-500" : ""}
                disabled={loading}
              />
              {validationErrors.n_lactation && (
                <p className="text-sm text-red-600">
                  {validationErrors.n_lactation}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Numéro de lactation (1-20)
              </p>
            </div>

            {/* Contrôleur Laitier Field */}
            <div className="space-y-2">
              <Label htmlFor="controleur_laitier_id" className="text-sm font-medium">
                <User className="w-4 h-4 inline mr-1" />
                Contrôleur laitier <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.controleur_laitier_id}
                onValueChange={(value) => handleFormChange("controleur_laitier_id", value)}
                disabled={loading || usersLoading}
              >
                <SelectTrigger
                  className={
                    validationErrors.controleur_laitier_id ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Sélectionner un contrôleur" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.prenom} {user.nom} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.controleur_laitier_id && (
                <p className="text-sm text-red-600">
                  {validationErrors.controleur_laitier_id}
                </p>
              )}
            </div>

            {/* Lait Kg Field */}
            <div className="space-y-2">
              <Label htmlFor="lait_kg" className="text-sm font-medium">
                Lait (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lait_kg"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.lait_kg}
                onChange={(e) => handleFormChange("lait_kg", parseFloat(e.target.value) || 0)}
                className={validationErrors.lait_kg ? "border-red-500" : ""}
                disabled={loading}
              />
              {validationErrors.lait_kg && (
                <p className="text-sm text-red-600">
                  {validationErrors.lait_kg}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Quantité de lait en kilogrammes
              </p>
            </div>

            {/* KG MG Field */}
            <div className="space-y-2">
              <Label htmlFor="kg_mg" className="text-sm font-medium">
                KG MG <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kg_mg"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={formData.kg_mg}
                onChange={(e) => handleFormChange("kg_mg", parseFloat(e.target.value) || 0)}
                className={validationErrors.kg_mg ? "border-red-500" : ""}
                disabled={loading}
              />
              {validationErrors.kg_mg && (
                <p className="text-sm text-red-600">
                  {validationErrors.kg_mg}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Kilogrammes de matière grasse
              </p>
            </div>

            {/* Pourcentage Protéine Field */}
            <div className="space-y-2">
              <Label htmlFor="pct_proteine" className="text-sm font-medium">
                % Protéine <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pct_proteine"
                type="number"
                min="0"
                max="15"
                step="0.01"
                value={formData.pct_proteine}
                onChange={(e) => handleFormChange("pct_proteine", parseFloat(e.target.value) || 0)}
                className={validationErrors.pct_proteine ? "border-red-500" : ""}
                disabled={loading}
              />
              {validationErrors.pct_proteine && (
                <p className="text-sm text-red-600">
                  {validationErrors.pct_proteine}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Pourcentage de protéine (2.5-5.0% typique)
              </p>
            </div>

            {/* Pourcentage MG Field */}
            <div className="space-y-2">
              <Label htmlFor="pct_mg" className="text-sm font-medium">
                % MG <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pct_mg"
                type="number"
                min="0"
                max="15"
                step="0.01"
                value={formData.pct_mg}
                onChange={(e) => handleFormChange("pct_mg", parseFloat(e.target.value) || 0)}
                className={validationErrors.pct_mg ? "border-red-500" : ""}
                disabled={loading}
              />
              {validationErrors.pct_mg && (
                <p className="text-sm text-red-600">
                  {validationErrors.pct_mg}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Pourcentage de matière grasse (calculé automatiquement)
              </p>
            </div>
          </div>

          {/* Validation warnings */}
          {validationErrors.pct_mg?.includes("correspond pas") && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {validationErrors.pct_mg}
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
              "Créer la lactation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLactationModal;
