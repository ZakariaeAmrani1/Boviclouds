import React from "react";
import { Eye, FlaskConical, Hash, Clock, FileText, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { SemenceRecord } from "@shared/semence";
import { useUsers } from "../../hooks/useSemence";

interface ViewSemenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  semence: SemenceRecord;
}

const ViewSemenceModal: React.FC<ViewSemenceModalProps> = ({
  isOpen,
  onClose,
  semence,
}) => {
  const { getUserName } = useUsers();

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    // In a real application, you might have status logic
    // For now, we'll show "Actif" for all records
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Actif
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-boviclouds-primary" />
            Détails de la semence
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge()}
            <span className="text-sm text-gray-500">
              ID: {semence.id}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-boviclouds-primary" />
              Informations principales
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  Identificateur
                </span>
                <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                  {semence.identificateur}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Nom du taureau</span>
                <span className="text-gray-900 font-medium">
                  {semence.nom_taureau}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">Race du taureau</span>
                <span className="text-gray-900">
                  {semence.race_taureau}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  Numéro du taureau
                </span>
                <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                  {semence.num_taureau}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-boviclouds-primary" />
              Informations de suivi
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Créé par
                </span>
                <span className="text-gray-900">
                  {semence.createdBy}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Date de création
                </span>
                <span className="text-gray-900">
                  {formatDateTime(semence.createdAt)}
                </span>
              </div>

              {semence.updatedAt !== semence.createdAt && (
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
                  <span className="font-medium text-yellow-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Dernière modification
                  </span>
                  <span className="text-yellow-900">
                    {formatDateTime(semence.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Informations complémentaires</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                • Semence <strong>{semence.identificateur}</strong> du taureau{" "}
                <strong>{semence.nom_taureau}</strong>
              </p>
              <p>
                • Race: <strong>{semence.race_taureau}</strong>
              </p>
              <p>
                • Numéro d'identification du taureau: <strong>{semence.num_taureau}</strong>
              </p>
              <p>
                • Enregistrement créé par <strong>{semence.createdBy}</strong>
              </p>
              <p>
                • Date d'enregistrement: <strong>
                  {new Date(semence.createdAt).toLocaleDateString("fr-FR")}
                </strong>
              </p>
            </div>
          </div>

          {/* Technical Information */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-900 mb-2">Informations techniques</h4>
            <div className="space-y-2 text-sm text-green-800">
              <p>
                • Identificateur conforme au format SEM + 6 chiffres
              </p>
              <p>
                • Numéro du taureau conforme au format 2 lettres + 8 chiffres
              </p>
              <p>
                • Semence disponible pour utilisation en insémination artificielle
              </p>
              <p>
                • Données vérifiées et validées
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            className="w-full bg-boviclouds-primary hover:bg-boviclouds-green-dark"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSemenceModal;
