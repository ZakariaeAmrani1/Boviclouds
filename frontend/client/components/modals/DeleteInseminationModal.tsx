import React, { useState } from "react";
import { AlertTriangle, RefreshCw, Trash2, Calendar, Zap } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useToast } from "../../hooks/use-toast";
import { useInsemination, useUsers } from "../../hooks/useInsemination";
import { InseminationRecord } from "@shared/insemination";

interface DeleteInseminationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  insemination: InseminationRecord;
}

const DeleteInseminationModal: React.FC<DeleteInseminationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  insemination,
}) => {
  const { toast } = useToast();
  const { loading, deleteRecord } = useInsemination();
  const { getUserName } = useUsers();
  const [confirmText, setConfirmText] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const handleDelete = async () => {
    const success = await deleteRecord(insemination.id);
    
    if (success) {
      toast({
        title: "Succès",
        description: "L'insémination a été supprimée avec succès.",
      });
      onSuccess();
      onClose();
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  // For extra security, require typing "SUPPRIMER" to confirm
  const isDeleteConfirmed = confirmText.toUpperCase() === "SUPPRIMER";

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirmer la suppression
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-gray-700">
                Êtes-vous absolument sûr de vouloir supprimer cette insémination ?
                Cette action est <strong>irréversible</strong>.
              </p>

              {/* Insemination details */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-md space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-900">
                    Détails de l'insémination à supprimer
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">ID:</span>
                    <span className="font-mono text-red-900 bg-white px-1 rounded">
                      {insemination.id}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">NNI:</span>
                    <span className="font-mono text-red-900 bg-white px-1 rounded">
                      {insemination.nni}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Date:</span>
                    <span className="text-red-900">
                      {formatDate(insemination.date_dissemination)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Semence:</span>
                    <span className="font-mono text-red-900 bg-white px-1 rounded">
                      {insemination.semence_id}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Inséminateur:</span>
                    <span className="text-red-900">
                      {getUserName(insemination.inseminateur_id)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Responsable:</span>
                    <span className="text-red-900">
                      {getUserName(insemination.responsable_local_id)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning about consequences */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Attention:</strong> La suppression de cette insémination peut impacter:
                </p>
                <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
                  <li>Les statistiques de reproduction</li>
                  <li>Le suivi généalogique de l'animal</li>
                  <li>Les rapports historiques</li>
                </ul>
              </div>

              {/* Confirmation input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Pour confirmer la suppression, tapez <strong>SUPPRIMER</strong> ci-dessous:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Tapez SUPPRIMER"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  disabled={loading}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
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
            onClick={handleDelete}
            disabled={!isDeleteConfirmed || loading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInseminationModal;
