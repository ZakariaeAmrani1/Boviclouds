import React from "react";
import { Eye, Calendar, User, Zap, Clock, FileText } from "lucide-react";
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
import { InseminationRecord } from "@shared/insemination";
import { useUsers } from "../../hooks/useInsemination";

interface ViewInseminationModalProps {
  isOpen: boolean;
  onClose: () => void;
  insemination: InseminationRecord;
}

const ViewInseminationModal: React.FC<ViewInseminationModalProps> = ({
  isOpen,
  onClose,
  insemination,
}) => {
  const { getUserName } = useUsers();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            Détails de l'insémination
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge()}
            <span className="text-sm text-gray-500">
              ID: {insemination.id}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-boviclouds-primary" />
              Informations principales
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">NNI</span>
                <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                  {insemination.nni}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Date de dissémination
                </span>
                <span className="text-gray-900">
                  {formatDate(insemination.date_dissemination)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700">ID Semence</span>
                <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                  {insemination.semence_id}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personnel Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-boviclouds-primary" />
              Personnel impliqué
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                <span className="font-medium text-blue-700">Inséminateur</span>
                <span className="text-blue-900 font-medium">
                  {getUserName(insemination.inseminateur_id)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                <span className="font-medium text-green-700">Responsable local</span>
                <span className="text-green-900 font-medium">
                  {getUserName(insemination.responsable_local_id)}
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
                <span className="font-medium text-gray-700">Créé par</span>
                <span className="text-gray-900">
                  {insemination.createdBy}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Date de création
                </span>
                <span className="text-gray-900">
                  {formatDateTime(insemination.createdAt)}
                </span>
              </div>

              {insemination.updatedAt !== insemination.createdAt && (
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
                  <span className="font-medium text-yellow-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Dernière modification
                  </span>
                  <span className="text-yellow-900">
                    {formatDateTime(insemination.updatedAt)}
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
                • Cette insémination a été réalisée le{" "}
                <strong>{formatDate(insemination.date_dissemination)}</strong>
              </p>
              <p>
                • L'animal identifié par le NNI <strong>{insemination.nni}</strong> a été inséminé
              </p>
              <p>
                • Semence utilisée: <strong>{insemination.semence_id}</strong>
              </p>
              <p>
                • Intervention réalisée par <strong>{getUserName(insemination.inseminateur_id)}</strong>
              </p>
              <p>
                • Sous la supervision de <strong>{getUserName(insemination.responsable_local_id)}</strong>
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

export default ViewInseminationModal;
