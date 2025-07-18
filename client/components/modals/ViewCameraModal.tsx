import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, BehaviorDetection } from "@shared/cctv";
import {
  Eye,
  Camera as CameraIcon,
  MapPin,
  User,
  Calendar,
  Activity,
  Play,
  Pause,
  Download,
} from "lucide-react";

interface ViewCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  camera: Camera | null;
  behaviors?: BehaviorDetection[];
  onDownloadRecording?: (cameraId: string) => Promise<void>;
}

const ViewCameraModal: React.FC<ViewCameraModalProps> = ({
  isOpen,
  onClose,
  camera,
  behaviors = [],
  onDownloadRecording,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!camera || !onDownloadRecording) return;

    setIsDownloading(true);
    try {
      await onDownloadRecording(camera.id);
    } catch (error) {
      console.error("Failed to download recording:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "inactive":
        return "Inactif";
      case "maintenance":
        return "Maintenance";
      default:
        return "Inconnu";
    }
  };

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case "standing":
        return "bg-green-100 text-green-800";
      case "eating":
        return "bg-orange-100 text-orange-800";
      case "sleeping":
        return "bg-blue-100 text-blue-800";
      case "moving":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBehaviorText = (behavior: string) => {
    switch (behavior) {
      case "standing":
        return "Debout";
      case "eating":
        return "En train de manger";
      case "sleeping":
        return "En repos";
      case "moving":
        return "En mouvement";
      default:
        return behavior;
    }
  };

  if (!camera) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            Détails de la caméra
          </DialogTitle>
          <DialogDescription>
            Informations détaillées et flux en direct de la caméra "
            {camera.name}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera Feed */}
          {camera.streamUrl && (
            <div className="relative">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <img
                  src={camera.streamUrl}
                  alt={`Camera ${camera.name}`}
                  className="w-full h-full object-cover"
                />

                {/* Status overlay */}
                <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      camera.status === "active"
                        ? "bg-green-500 animate-pulse"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  {camera.name} ({camera.zone})
                </div>

                {/* Recording indicator */}
                {camera.isRecording && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    REC
                  </div>
                )}

                {/* Play/Pause overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Camera Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Informations générales
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CameraIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nom</p>
                    <p className="text-sm text-gray-900">{camera.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Zone</p>
                    <p className="text-sm text-gray-900">{camera.zone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Créé par
                    </p>
                    <p className="text-sm text-gray-900">{camera.createdBy}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Date de création
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(camera.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Statut</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    État actuel
                  </p>
                  <Badge className={getStatusColor(camera.status)}>
                    {getStatusText(camera.status)}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Enregistrement
                  </p>
                  <Badge
                    className={
                      camera.isRecording
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {camera.isRecording ? "En cours" : "Arrêté"}
                  </Badge>
                </div>

                {camera.lastActivity && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Dernière activité
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(camera.lastActivity).toLocaleString("fr-FR")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Behaviors */}
          {behaviors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Comportements détectés récemment
              </h3>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {behaviors.slice(0, 5).map((behavior) => (
                  <div
                    key={behavior.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={getBehaviorColor(behavior.behavior)}>
                        {getBehaviorText(behavior.behavior)}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Confiance: {Math.round(behavior.confidence * 100)}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(behavior.detectedAt).toLocaleTimeString(
                        "fr-FR",
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {onDownloadRecording && camera.isRecording && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2"
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? "Téléchargement..." : "Télécharger"}
            </Button>
          )}
          <Button type="button" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCameraModal;
