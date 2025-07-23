import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import {
  UpdateSujetRequest,
  UpdateInseminationRequest,
  UpdateLactationRequest,
  TraitementRecord,
  Sujet,
  InseminationRecord,
  LactationRecord,
  RACE_OPTIONS,
  SEXE_OPTIONS,
  TYPE_OPTIONS,
  METHODE_INSEMINATION_OPTIONS,
  STATUT_INSEMINATION_OPTIONS,
  QUALITE_LAIT_OPTIONS,
  PERIODE_LACTATION_OPTIONS,
  STATUT_LACTATION_OPTIONS,
} from "@shared/traitement";

interface EditSujetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    id: string,
    data:
      | UpdateSujetRequest
      | UpdateInseminationRequest
      | UpdateLactationRequest,
  ) => void;
  record: TraitementRecord | null;
  isLoading: boolean;
}

const EditSujetModal: React.FC<EditSujetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  record,
  isLoading,
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (record) {
      if (record.tabType === "lactation") {
        const lactationRecord = record as LactationRecord;
        setFormData({
          ...lactationRecord,
          productionJournaliere:
            lactationRecord.productionJournaliere.toString(),
        });
      } else {
        setFormData(record);
      }
    }
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;

    const { id, createdAt, updatedAt, createdBy, tabType, ...updateData } =
      formData;

    if (record.tabType === "identification") {
      onSubmit(record.id, updateData as UpdateSujetRequest);
    } else if (record.tabType === "insemination") {
      onSubmit(record.id, updateData as UpdateInseminationRequest);
    } else if (record.tabType === "lactation") {
      onSubmit(record.id, {
        ...updateData,
        productionJournaliere:
          parseFloat(updateData.productionJournaliere) || 0,
      } as UpdateLactationRequest);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const getModalTitle = () => {
    if (!record) return "Modifier un Enregistrement";

    switch (record.tabType) {
      case "identification":
        return "Modifier l'Identification";
      case "insemination":
        return "Modifier l'Insémination";
      case "lactation":
        return "Modifier la Lactation";
      default:
        return "Modifier un Enregistrement";
    }
  };

  const renderIdentificationForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nniSujet">NNI Sujet *</Label>
          <Input
            id="nniSujet"
            placeholder="Numéro d'identification"
            value={formData.nniSujet || ""}
            onChange={(e) => handleInputChange("nniSujet", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="doc">Document *</Label>
          <Input
            id="doc"
            placeholder="Type de document"
            value={formData.doc || ""}
            onChange={(e) => handleInputChange("doc", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateNaissance">Date de Naissance *</Label>
          <Input
            id="dateNaissance"
            type="date"
            value={formData.dateNaissance || ""}
            onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="race">Race *</Label>
          <Select
            value={formData.race || ""}
            onValueChange={(value) => handleInputChange("race", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une race" />
            </SelectTrigger>
            <SelectContent>
              {RACE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sexe">Sexe *</Label>
          <Select
            value={formData.sexe || ""}
            onValueChange={(value) => handleInputChange("sexe", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le sexe" />
            </SelectTrigger>
            <SelectContent>
              {SEXE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type || ""}
            onValueChange={(value) => handleInputChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );

  const renderInseminationForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nniSujet">NNI Sujet *</Label>
          <Input
            id="nniSujet"
            placeholder="Numéro d'identification"
            value={formData.nniSujet || ""}
            onChange={(e) => handleInputChange("nniSujet", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taureau">Taureau *</Label>
          <Input
            id="taureau"
            placeholder="Nom du taureau"
            value={formData.taureau || ""}
            onChange={(e) => handleInputChange("taureau", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateInsemination">Date d'Insémination *</Label>
          <Input
            id="dateInsemination"
            type="date"
            value={formData.dateInsemination || ""}
            onChange={(e) =>
              handleInputChange("dateInsemination", e.target.value)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="veterinaire">Vétérinaire *</Label>
          <Input
            id="veterinaire"
            placeholder="Nom du vétérinaire"
            value={formData.veterinaire || ""}
            onChange={(e) => handleInputChange("veterinaire", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="methode">Méthode *</Label>
          <Select
            value={formData.methode || ""}
            onValueChange={(value) => handleInputChange("methode", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la méthode" />
            </SelectTrigger>
            <SelectContent>
              {METHODE_INSEMINATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="statut">Statut *</Label>
          <Select
            value={formData.statut || ""}
            onValueChange={(value) => handleInputChange("statut", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le statut" />
            </SelectTrigger>
            <SelectContent>
              {STATUT_INSEMINATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );

  const renderLactationForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nniSujet">NNI Sujet *</Label>
          <Input
            id="nniSujet"
            placeholder="Numéro d'identification"
            value={formData.nniSujet || ""}
            onChange={(e) => handleInputChange("nniSujet", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateDemarrage">Date de Démarrage *</Label>
          <Input
            id="dateDemarrage"
            type="date"
            value={formData.dateDemarrage || ""}
            onChange={(e) => handleInputChange("dateDemarrage", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productionJournaliere">
            Production Journalière (L) *
          </Label>
          <Input
            id="productionJournaliere"
            type="number"
            step="0.1"
            placeholder="0.0"
            value={formData.productionJournaliere || ""}
            onChange={(e) =>
              handleInputChange("productionJournaliere", e.target.value)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="qualiteLait">Qualité du Lait *</Label>
          <Select
            value={formData.qualiteLait || ""}
            onValueChange={(value) => handleInputChange("qualiteLait", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la qualité" />
            </SelectTrigger>
            <SelectContent>
              {QUALITE_LAIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="periode">Période *</Label>
          <Select
            value={formData.periode || ""}
            onValueChange={(value) => handleInputChange("periode", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la période" />
            </SelectTrigger>
            <SelectContent>
              {PERIODE_LACTATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="statut">Statut *</Label>
          <Select
            value={formData.statut || ""}
            onValueChange={(value) => handleInputChange("statut", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le statut" />
            </SelectTrigger>
            <SelectContent>
              {STATUT_LACTATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {getModalTitle()}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {record.tabType === "identification" && renderIdentificationForm()}
            {record.tabType === "insemination" && renderInseminationForm()}
            {record.tabType === "lactation" && renderLactationForm()}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Modifier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSujetModal;
