import React, { useState } from "react";
import { AlertTriangle, RefreshCw, Trash2, FlaskConical, Hash } from "lucide-react";
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
import { useSemence, useUsers } from "../../hooks/useSemence";
import { SemenceRecord } from "@shared/semence";

interface DeleteSemenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  semence: SemenceRecord;
}

const DeleteSemenceModal: React.FC<DeleteSemenceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  semence,
}) => {
  const { toast } = useToast();
  const { loading, deleteRecord } = useSemence();
  const { getUserName } = useUsers();
  const [confirmText, setConfirmText] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const handleDelete = async () => {
    const success = await deleteRecord(semence.id);
    
    if (success) {
      toast({
        title: "Succès",
        description: "La semence a été supprimée avec succès.",
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
                Êtes-vous absolument sûr de vouloir supprimer cette semence ?
                Cette action est <strong>irréversible</strong>.
              </p>

              {/* Semence details */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-md space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-900">
                    Détails de la semence à supprimer
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">ID:</span>
                    <span className="font-mono text-red-900 bg-white px-1 rounded">
                      {semence.id}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Identificateur:</span>
                    <span className="font-mono text-red-900 bg-white px-1 rounded">
                      {semence.identificateur}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Nom du taureau:</span>
                    <span className="text-red-900 font-medium">
                      {semence.nom_taureau}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Race:</span>
                    <span className="text-red-900">
                      {semence.race_taureau}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Numéro taureau:</span>
                    <span className="font-mono text-red-900 bg-white px-1 rounded">
                      {semence.num_taureau}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-red-700">Créé par:</span>
                    <span className="text-red-900">
                      {semence.createdBy}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-red-700">Date de création:</span>
                    <span className="text-red-900">
                      {formatDate(semence.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning about consequences */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Attention:</strong> La suppression de cette semence peut impacter:
                </p>
                <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
                  <li>Les inséminations utilisant cette semence</li>
                  <li>Les statistiques de reproduction</li>
                  <li>Le suivi généalogique des animaux</li>
                  <li>Les rapports historiques</li>
                  <li>La traçabilité des accouplements</li>
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

export default DeleteSemenceModal;
