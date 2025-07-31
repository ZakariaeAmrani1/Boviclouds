import React, { useState } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useToast } from "../../hooks/use-toast";
import { useLactation, useUsers, useIdentifications } from "../../hooks/useLactation";
import { LactationRecord } from "@shared/lactation";
import { formatDateForDisplay } from "../../lib/lactationValidation";

interface DeleteLactationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lactation: LactationRecord;
}

const DeleteLactationModal: React.FC<DeleteLactationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lactation,
}) => {
  const { toast } = useToast();
  const { loading, error, deleteRecord } = useLactation();
  const { getUserName } = useUsers();
  const { getIdentificationName } = useIdentifications();
  
  const [confirmText, setConfirmText] = useState("");
  const confirmationText = "SUPPRIMER";

  const handleDelete = async () => {
    if (confirmText !== confirmationText) {
      toast({
        title: "Confirmation requise",
        description: `Veuillez taper "${confirmationText}" pour confirmer la suppression.`,
        variant: "destructive",
      });
      return;
    }

    const success = await deleteRecord(lactation.id);
    
    if (success) {
      toast({
        title: "Suppression réussie",
        description: "La lactation a été supprimée avec succès.",
      });
      onSuccess();
      onClose();
      setConfirmText("");
    } else {
      toast({
        title: "Erreur de suppression",
        description: error || "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const isConfirmValid = confirmText === confirmationText;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirmer la suppression
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Message */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900">
                  Attention : Cette action est irréversible
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  La suppression de cette lactation entraînera la perte définitive de toutes les données associées.
                  Cette action ne peut pas être annulée.
                </p>
              </div>
            </div>
          </div>

          {/* Lactation Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Détails de la lactation à supprimer :
            </h4>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Sujet:</span>
                  <div className="font-medium">
                    {getIdentificationName(lactation.sujet_id)}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600">Date de vêlage:</span>
                  <div className="font-medium">
                    {formatDateForDisplay(lactation.date_velage)}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600">Numéro de lactation:</span>
                  <div className="font-medium">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {lactation.n_lactation}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600">Production lait:</span>
                  <div className="font-medium">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {lactation.lait_kg} kg
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600">Contrôleur laitier:</span>
                  <div className="font-medium">
                    {getUserName(lactation.controleur_laitier_id)}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600">Créé le:</span>
                  <div className="text-sm text-gray-500">
                    {new Date(lactation.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700">
              Pour confirmer la suppression, tapez{" "}
              <span className="font-mono font-bold text-red-600">
                {confirmationText}
              </span>{" "}
              dans le champ ci-dessous :
            </label>
            <input
              id="confirmText"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder={confirmationText}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                confirmText && !isConfirmValid
                  ? "border-red-300 bg-red-50"
                  : confirmText && isConfirmValid
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300"
              }`}
              disabled={loading}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-sm text-red-600">
                Le texte saisi ne correspond pas à "{confirmationText}"
              </p>
            )}
          </div>

          {/* Additional Warnings */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Les données de production seront définitivement perdues</p>
            <p>• Cette action affectera les statistiques et rapports</p>
            <p>• Assurez-vous d'avoir sauvegardé les données importantes</p>
          </div>
        </div>

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
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer définitivement
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLactationModal;
