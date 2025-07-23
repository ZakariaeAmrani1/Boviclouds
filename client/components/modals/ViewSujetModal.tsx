import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Calendar, User, FileText, Download } from "lucide-react";
import {
  TraitementRecord,
  Sujet,
  InseminationRecord,
  LactationRecord,
} from "@shared/traitement";

interface ViewSujetModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: TraitementRecord | null;
  onDownload?: (recordId: string) => void;
}

const ViewSujetModal: React.FC<ViewSujetModalProps> = ({
  isOpen,
  onClose,
  record,
  onDownload,
}) => {
  if (!record) return null;

  const getModalTitle = () => {
    switch (record.tabType) {
      case "identification":
        return "Détails de l'Identification";
      case "insemination":
        return "Détails de l'Insémination";
      case "lactation":
        return "Détails de la Lactation";
      default:
        return "Détails de l'Enregistrement";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      // Insemination statuses
      en_cours: { color: "bg-blue-100 text-blue-800", text: "En cours" },
      reussi: { color: "bg-green-100 text-green-800", text: "Réussi" },
      echec: { color: "bg-red-100 text-red-800", text: "Échec" },
      en_attente: {
        color: "bg-yellow-100 text-yellow-800",
        text: "En attente",
      },
      // Lactation statuses
      active: { color: "bg-green-100 text-green-800", text: "Active" },
      terminee: { color: "bg-gray-100 text-gray-800", text: "Terminée" },
      suspendue: { color: "bg-orange-100 text-orange-800", text: "Suspendue" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      text: status,
    };
    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {config.text}
      </Badge>
    );
  };

  const renderIdentificationDetails = (sujet: Sujet) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              NNI Sujet
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {sujet.nniSujet}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Document
            </label>
            <p className="text-gray-900">{sujet.doc}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Date de Naissance
            </label>
            <p className="text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              {sujet.dateNaissance}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Race</label>
            <p className="text-gray-900">{sujet.race}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Sexe</label>
            <p className="text-gray-900">{sujet.sexe}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Type</label>
            <p className="text-gray-900">{sujet.type}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInseminationDetails = (insemination: InseminationRecord) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              NNI Sujet
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {insemination.nniSujet}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Taureau</label>
            <p className="text-gray-900">{insemination.taureau}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Date d'Insémination
            </label>
            <p className="text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              {insemination.dateInsemination}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Vétérinaire
            </label>
            <p className="text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              {insemination.veterinaire}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Méthode</label>
            <p className="text-gray-900">{insemination.methode}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Statut</label>
            <div className="mt-1">{getStatusBadge(insemination.statut)}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLactationDetails = (lactation: LactationRecord) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              NNI Sujet
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {lactation.nniSujet}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Date de Démarrage
            </label>
            <p className="text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              {lactation.dateDemarrage}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Production Journalière
            </label>
            <p className="text-gray-900">
              <span className="text-2xl font-bold text-primary">
                {lactation.productionJournaliere}
              </span>
              <span className="text-sm text-gray-500 ml-1">litres/jour</span>
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Qualité du Lait
            </label>
            <p className="text-gray-900">{lactation.qualiteLait}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Période</label>
            <p className="text-gray-900">{lactation.periode}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Statut</label>
            <div className="mt-1">{getStatusBadge(lactation.statut)}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetadata = () => (
    <div className="border-t pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-600">Créé par</label>
          <p className="text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            {record.createdBy}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">
            Date de création
          </label>
          <p className="text-gray-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            {new Date(record.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>
      {record.updatedAt !== record.createdAt && (
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-600">
            Dernière modification
          </label>
          <p className="text-gray-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            {new Date(record.updatedAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {getModalTitle()}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {record.tabType === "identification" &&
            renderIdentificationDetails(record as Sujet)}
          {record.tabType === "insemination" &&
            renderInseminationDetails(record as InseminationRecord)}
          {record.tabType === "lactation" &&
            renderLactationDetails(record as LactationRecord)}

          <Separator />

          {renderMetadata()}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {onDownload && (
              <Button
                variant="outline"
                onClick={() => onDownload(record.id)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
            )}
          </div>
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSujetModal;
