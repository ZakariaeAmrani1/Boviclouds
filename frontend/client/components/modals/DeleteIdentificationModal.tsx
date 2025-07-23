import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { IdentificationRecord } from "@shared/identification";

interface DeleteIdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  identification: IdentificationRecord | null;
  loading?: boolean;
}

const DeleteIdentificationModal: React.FC<DeleteIdentificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  identification,
  loading = false,
}) => {
  if (!identification) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Confirmer la suppression
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer cette identification ?
              </p>

              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">NNI:</span>
                    <span className="text-gray-900">
                      {identification.infos_sujet.nni}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="text-gray-900">
                      {identification.infos_sujet.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Sexe:</span>
                    <span className="text-gray-900">
                      {identification.infos_sujet.sexe}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Race:</span>
                    <span className="text-gray-900">
                      {identification.infos_sujet.race}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Date de naissance:
                    </span>
                    <span className="text-gray-900">
                      {new Date(
                        identification.infos_sujet.date_naissance,
                      ).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm font-medium">
                  ⚠️ Cette action est irréversible
                </p>
                <p className="text-red-700 text-sm mt-1">
                  Toutes les informations généalogiques seront définitivement
                  supprimées.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Suppression...
              </>
            ) : (
              "Supprimer définitivement"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteIdentificationModal;
