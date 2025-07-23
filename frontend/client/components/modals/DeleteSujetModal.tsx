import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, AlertTriangle, X } from "lucide-react";
import {
  TraitementRecord,
  Sujet,
  InseminationRecord,
  LactationRecord,
} from "@shared/traitement";

interface DeleteSujetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recordId: string) => void;
  record: TraitementRecord | null;
  isLoading: boolean;
}

const DeleteSujetModal: React.FC<DeleteSujetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  record,
  isLoading,
}) => {
  if (!record) return null;

  const getRecordIdentifier = () => {
    return record.nniSujet;
  };

  const getRecordType = () => {
    switch (record.tabType) {
      case "identification":
        return "l'identification";
      case "insemination":
        return "l'insémination";
      case "lactation":
        return "la lactation";
      default:
        return "l'enregistrement";
    }
  };

  const getModalTitle = () => {
    switch (record.tabType) {
      case "identification":
        return "Supprimer l'Identification";
      case "insemination":
        return "Supprimer l'Insémination";
      case "lactation":
        return "Supprimer la Lactation";
      default:
        return "Supprimer l'Enregistrement";
    }
  };

  const getRecordDetails = () => {
    switch (record.tabType) {
      case "identification":
        const identification = record as Sujet;
        return (
          <div className="space-y-2">
            <p>
              <span className="font-medium">NNI:</span>{" "}
              {identification.nniSujet}
            </p>
            <p>
              <span className="font-medium">Document:</span>{" "}
              {identification.doc}
            </p>
            <p>
              <span className="font-medium">Race:</span> {identification.race}
            </p>
            <p>
              <span className="font-medium">Type:</span> {identification.type}
            </p>
          </div>
        );
      case "insemination":
        const insemination = record as InseminationRecord;
        return (
          <div className="space-y-2">
            <p>
              <span className="font-medium">NNI:</span> {insemination.nniSujet}
            </p>
            <p>
              <span className="font-medium">Taureau:</span>{" "}
              {insemination.taureau}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {insemination.dateInsemination}
            </p>
            <p>
              <span className="font-medium">Vétérinaire:</span>{" "}
              {insemination.veterinaire}
            </p>
          </div>
        );
      case "lactation":
        const lactation = record as LactationRecord;
        return (
          <div className="space-y-2">
            <p>
              <span className="font-medium">NNI:</span> {lactation.nniSujet}
            </p>
            <p>
              <span className="font-medium">Date de démarrage:</span>{" "}
              {lactation.dateDemarrage}
            </p>
            <p>
              <span className="font-medium">Production:</span>{" "}
              {lactation.productionJournaliere}L/jour
            </p>
            <p>
              <span className="font-medium">Qualité:</span>{" "}
              {lactation.qualiteLait}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleConfirm = () => {
    onConfirm(record.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            {getModalTitle()}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Cette action est irréversible. Toutes les données associées à cet
              enregistrement seront définitivement supprimées.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <p className="text-gray-900">
              Êtes-vous sûr de vouloir supprimer {getRecordType()} suivant
              {record.tabType === "identification" ||
              record.tabType === "insemination"
                ? ""
                : "e"}{" "}
              ?
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border">
              {getRecordDetails()}
            </div>

            <p className="text-sm text-gray-600">
              Créé par <span className="font-medium">{record.createdBy}</span>{" "}
              le {new Date(record.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Supprimer définitivement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSujetModal;
