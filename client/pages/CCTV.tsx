import React, { useState, useEffect } from "react";
import {
  Camera,
  BEHAVIOR_COLORS,
  CreateCameraRequest,
  UpdateCameraRequest,
} from "@shared/cctv";
import { cctvService } from "@/services/cctvService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Download,
  RotateCcw,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AddCameraModal from "@/components/modals/AddCameraModal";
import EditCameraModal from "@/components/modals/EditCameraModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import ViewCameraModal from "@/components/modals/ViewCameraModal";
import { useToast } from "@/hooks/use-toast";

interface CameraFeedProps {
  camera: Camera;
  behaviors?: any[];
  className?: string;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  camera,
  behaviors = [],
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
    >
      <img
        src={camera.streamUrl}
        alt={`Camera ${camera.name}`}
        className="w-full h-full object-cover"
      />

      {/* Camera overlay */}
      <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Camera {camera.id.slice(-1)} ({camera.zone})
      </div>

      {/* Behavior detection overlays */}
      {behaviors.map((behavior, index) => (
        <div
          key={index}
          className="absolute border-2 pointer-events-none"
          style={{
            left: `${(behavior.boundingBox?.x / 1000) * 100}%`,
            top: `${(behavior.boundingBox?.y / 400) * 100}%`,
            width: `${(behavior.boundingBox?.width / 1000) * 100}%`,
            height: `${(behavior.boundingBox?.height / 400) * 100}%`,
            borderColor:
              BEHAVIOR_COLORS[
                behavior.behavior as keyof typeof BEHAVIOR_COLORS
              ],
          }}
        />
      ))}

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
  );
};

const CCTV: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [behaviors, setBehaviors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      const mockCameras = cctvService.getMockCameras();
      const mockBehaviors = cctvService.getMockBehaviorDetections();
      setCameras(mockCameras);
      setBehaviors(mockBehaviors);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les caméras",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cameraId: string) => {
    const camera = cameras.find((c) => c.id === cameraId);
    if (camera) {
      setSelectedCamera(camera);
      setIsEditModalOpen(true);
    }
  };

  const handleView = (cameraId: string) => {
    const camera = cameras.find((c) => c.id === cameraId);
    if (camera) {
      setSelectedCamera(camera);
      setIsViewModalOpen(true);
    }
  };

  const handleDelete = (cameraId: string) => {
    const camera = cameras.find((c) => c.id === cameraId);
    if (camera) {
      setSelectedCamera(camera);
      setIsDeleteModalOpen(true);
    }
  };

  const handleAddCamera = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCameraSubmit = async (data: CreateCameraRequest) => {
    setIsModalLoading(true);
    try {
      await cctvService.createCamera(data);
      toast({
        title: "Succès",
        description: "Caméra ajoutée avec succès",
      });
      await loadCameras();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la caméra",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEditCameraSubmit = async (
    id: string,
    data: UpdateCameraRequest,
  ) => {
    setIsModalLoading(true);
    try {
      await cctvService.updateCamera(id, data);
      toast({
        title: "Succès",
        description: "Caméra mise à jour avec succès",
      });
      await loadCameras();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la caméra",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDeleteConfirm = async (cameraId: string) => {
    setIsModalLoading(true);
    try {
      await cctvService.deleteCamera(cameraId);
      toast({
        title: "Succès",
        description: "Caméra supprimée avec succès",
      });
      await loadCameras();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la caméra",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDownloadRecording = async (cameraId: string) => {
    try {
      await cctvService.downloadRecording(cameraId);
      toast({
        title: "Succès",
        description: "Téléchargement de l'enregistrement commencé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'enregistrement",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      await cctvService.exportCameraData("csv");
      toast({
        title: "Succès",
        description: "Export des données commencé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await loadCameras();
    toast({
      title: "Actualisé",
      description: "Liste des caméras actualisée",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cameras...</p>
        </div>
      </div>
    );
  }

  const mainCamera = cameras[0];
  const otherCameras = cameras.slice(1);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "CCTV", href: "/cctv" }]} />

      {/* Camera Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
        {/* Main Camera Feed */}
        {mainCamera && (
          <div className="lg:col-span-2">
            <CameraFeed
              camera={mainCamera}
              behaviors={behaviors.filter((b) => b.cameraId === mainCamera.id)}
              className="h-full"
            />
          </div>
        )}

        {/* Side Camera Feeds */}
        <div className="space-y-4">
          {otherCameras.map((camera) => (
            <CameraFeed
              key={camera.id}
              camera={camera}
              behaviors={behaviors.filter((b) => b.cameraId === camera.id)}
              className="h-[188px]"
            />
          ))}
        </div>
      </div>

      {/* Behavior Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-sm"></div>
          <span className="text-sm text-gray-700">Standing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-500 rounded-sm"></div>
          <span className="text-sm text-gray-700">Eating</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
          <span className="text-sm text-gray-700">Sleeping</span>
        </div>
      </div>

      {/* Camera List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-2">Camera List</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleAddCamera}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter camera
            </Button>
          </div>
        </div>

        {/* Camera Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Camera Id
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cree par
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cameras.map((camera) => (
                    <tr key={camera.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {camera.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {camera.zone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {camera.createdBy}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            camera.status === "active" ? "default" : "secondary"
                          }
                          className={
                            camera.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {camera.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(camera.id)}
                            className="text-emerald-600 hover:text-emerald-800 p-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleView(camera.id)}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(camera.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de 1 à {cameras.length} sur {cameras.length} utilisateurs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[32px]"
            >
              {currentPage}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCameraModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCameraSubmit}
        isLoading={isModalLoading}
      />

      <EditCameraModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCameraSubmit}
        camera={selectedCamera}
        isLoading={isModalLoading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        camera={selectedCamera}
        isLoading={isModalLoading}
      />

      <ViewCameraModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        camera={selectedCamera}
        behaviors={
          selectedCamera
            ? behaviors.filter((b) => b.cameraId === selectedCamera.id)
            : []
        }
        onDownloadRecording={handleDownloadRecording}
      />
    </div>
  );
};

export default CCTV;
