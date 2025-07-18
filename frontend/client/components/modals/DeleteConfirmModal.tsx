import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "@shared/cctv";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cameraId: string) => Promise<void>;
  camera: Camera | null;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  camera,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    if (!camera) return;

    try {
      await onConfirm(camera.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete camera:", error);
    }
  };

  if (!camera) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Supprimer la caméra
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Êtes-vous sûr de vouloir supprimer
            cette caméra ?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Nom:</span>
              <span className="text-sm text-gray-900">{camera.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Zone:</span>
              <span className="text-sm text-gray-900">{camera.zone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Statut:</span>
              <span
                className={`text-sm px-2 py-1 rounded-full text-xs font-medium ${
                  camera.status === "active"
                    ? "bg-green-100 text-green-800"
                    : camera.status === "inactive"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-orange-100 text-orange-800"
                }`}
              >
                {camera.status === "active"
                  ? "Actif"
                  : camera.status === "inactive"
                    ? "Inactif"
                    : "Maintenance"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Créé par:
              </span>
              <span className="text-sm text-gray-900">{camera.createdBy}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Attention !</p>
                <p className="mt-1">
                  La suppression de cette caméra supprimera également :
                </p>
                <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                  <li>Tous les enregistrements associés</li>
                  <li>L'historique des détections comportementales</li>
                  <li>Les paramètres de configuration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Suppression...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Supprimer définitivement
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
