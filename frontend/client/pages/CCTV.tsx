import React, { useState, useEffect } from "react";
import {
  Camera,
  OnlineCamera,
  CameraType,
  BEHAVIOR_COLORS,
  CAMERA_TYPE_COLORS,
  CreateCameraRequest,
  UpdateCameraRequest,
} from "@shared/cctv";
import { cctvService } from "@/services/cctvService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Wifi,
  WifiOff,
  MonitorPlay,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/hooks/use-toast";

interface CameraFeedProps {
  camera: Camera;
  behaviors?: any[];
  className?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  camera,
  behaviors = [],
  className = "",
  isSelected = false,
  onSelect,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden cursor-pointer ${className} ${
        isSelected ? "ring-4 ring-boviclouds-primary" : ""
      }`}
      onClick={onSelect}
    >
      <img
        src={camera.streamUrl}
        alt={`Camera ${camera.name}`}
        className="w-full h-full object-cover"
      />

      {/* Camera overlay */}
      <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${camera.isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
        ></div>
        Camera {camera.id.slice(-1)} ({camera.zone})
      </div>

      {/* Camera type badge */}
      {camera.type && (
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {camera.type}
        </div>
      )}

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
      {/* <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
      </div> */}
    </div>
  );
};

const CCTV: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [onlineCameras, setOnlineCameras] = useState<OnlineCamera[]>([]);
  const [behaviors, setBehaviors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineCamerasLoading, setOnlineCamerasLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCameraForStream, setSelectedCameraForStream] =
    useState<Camera | null>(null);
  const [activeTab, setActiveTab] = useState("live");
  const [editingCameraId, setEditingCameraId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      const mockCameras = await cctvService.getMockCameras();
      const mockBehaviors = cctvService.getMockBehaviorDetections();
      setCameras(mockCameras);
      setBehaviors(mockBehaviors);

      // Auto-select first online camera for streaming
      const firstOnlineCamera = mockCameras.find((cam) => cam.isOnline);
      if (firstOnlineCamera) {
        setSelectedCameraForStream(firstOnlineCamera);
      }
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

  const loadOnlineCameras = async () => {
    try {
      setOnlineCamerasLoading(true);
      // Simulate API call
      const mockOnlineCameras = cctvService.getMockOnlineCameras();
      setOnlineCameras(mockOnlineCameras);
      toast({
        title: "Succès",
        description: `${mockOnlineCameras.filter((cam) => cam.isOnline).length} caméras en ligne détectées`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les caméras en ligne",
        variant: "destructive",
      });
    } finally {
      setOnlineCamerasLoading(false);
    }
  };

  const handleAssignCameraType = async (cameraId: string, type: CameraType) => {
    try {
      // In real implementation, this would call the API
      // await cctvService.assignCameraType(cameraId, type);
      const camType =
        type === CameraType.BEHAVIOR
          ? "comportement"
          : type === CameraType.IDENTIFICATION
            ? "identification"
            : "morphologie";
      await cctvService.updateCameraType(cameraId, camType);
      setCameras((prev) =>
        prev.map((cam) => (cam.index === cameraId ? { ...cam, type } : cam)),
      );

      toast({
        title: "Succès",
        description: "Type de caméra assigné avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le type de caméra",
        variant: "destructive",
      });
    }
  };

  const getCameraTypeColor = (type?: CameraType) => {
    if (!type) return "bg-gray-100 text-gray-800";

    switch (type) {
      case CameraType.BEHAVIOR:
        return "bg-blue-100 text-blue-800";
      case CameraType.IDENTIFICATION:
        return "bg-purple-100 text-purple-800";
      case CameraType.MORPHOLOGY:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des caméras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "CCTV", href: "/cctv" }]} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live">Streaming Live</TabsTrigger>
          <TabsTrigger value="setup">Configuration Caméras</TabsTrigger>
        </TabsList>

        {/* Live Streaming Tab */}
        <TabsContent value="live" className="space-y-6">
          <div className="space-y-4">
            {/* Camera Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">
                  {selectedCameraForStream
                    ? selectedCameraForStream.name
                    : "Aucune caméra"}
                </h3>
                {selectedCameraForStream && (
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getCameraTypeColor(
                        selectedCameraForStream.type,
                      )}
                    >
                      {selectedCameraForStream.type || "Non assigné"}
                    </Badge>
                    <Badge
                      variant={
                        selectedCameraForStream.isOnline
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedCameraForStream.isOnline
                        ? "En ligne"
                        : "Hors ligne"}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Camera Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const onlineCameras = cameras.filter((cam) => cam.isOnline);
                    const currentIndex = onlineCameras.findIndex(
                      (cam) => cam.id === selectedCameraForStream?.id,
                    );
                    const prevIndex =
                      currentIndex <= 0
                        ? onlineCameras.length - 1
                        : currentIndex - 1;
                    setSelectedCameraForStream(onlineCameras[prevIndex]);
                  }}
                  disabled={cameras.filter((cam) => cam.isOnline).length <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>

                <p className="px-3 py-1 bg-gray-100 rounded text-sm">
                  {selectedCameraForStream
                    ? `${cameras.filter((cam) => cam.isOnline).findIndex((cam) => cam.id === selectedCameraForStream.id) + 1} / ${cameras.filter((cam) => cam.isOnline).length}`
                    : "0 / 0"}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const onlineCameras = cameras.filter((cam) => cam.isOnline);
                    const currentIndex = onlineCameras.findIndex(
                      (cam) => cam.id === selectedCameraForStream?.id,
                    );
                    const nextIndex =
                      currentIndex >= onlineCameras.length - 1
                        ? 0
                        : currentIndex + 1;
                    setSelectedCameraForStream(onlineCameras[nextIndex]);
                  }}
                  disabled={cameras.filter((cam) => cam.isOnline).length <= 1}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Single Camera Feed */}
            {selectedCameraForStream ? (
              <>
                <CameraFeed
                  camera={selectedCameraForStream}
                  behaviors={behaviors.filter(
                    (b) => b.cameraId === selectedCameraForStream.id,
                  )}
                  className="h-[600px] w-[1000px]"
                  isSelected={true}
                />
              </>
            ) : (
              <Card className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <MonitorPlay className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune caméra disponible
                  </h3>
                  <p className="text-gray-600">
                    Assurez-vous qu'au moins une caméra est en ligne pour
                    commencer le streaming
                  </p>
                </div>
              </Card>
            )}
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
        </TabsContent>

        {/* Camera Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Configuration des Caméras
              </h2>
              <Button
                onClick={loadOnlineCameras}
                disabled={onlineCamerasLoading}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {onlineCamerasLoading ? (
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wifi className="w-4 h-4 mr-2" />
                )}
                Détecter Caméras en Ligne
              </Button>
            </div>

            {/* Current Cameras with Type Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>Caméras Détectées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Caméra
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Zone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cameras.map((camera) => (
                        <tr key={camera.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {camera.isOnline ? (
                                <Wifi className="w-4 h-4 text-green-500" />
                              ) : (
                                <WifiOff className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {camera.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {camera.zone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {editingCameraId === camera.id ? (
                                <>
                                  <Select
                                    defaultValue={camera.type}
                                    onValueChange={(value) => {
                                      handleAssignCameraType(
                                        camera.index,
                                        value as CameraType,
                                      );
                                      setEditingCameraId(null);
                                    }}
                                  >
                                    <SelectTrigger className="w-64">
                                      <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={CameraType.BEHAVIOR}>
                                        {CameraType.BEHAVIOR}
                                      </SelectItem>
                                      <SelectItem
                                        value={CameraType.IDENTIFICATION}
                                      >
                                        {CameraType.IDENTIFICATION}
                                      </SelectItem>
                                      <SelectItem value={CameraType.MORPHOLOGY}>
                                        {CameraType.MORPHOLOGY}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingCameraId(null)}
                                  >
                                    Annuler
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Badge
                                    className={
                                      camera.type
                                        ? getCameraTypeColor(camera.type)
                                        : "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {camera.type || "Non assigné"}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setEditingCameraId(camera.id)
                                    }
                                  >
                                    Modifier
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={
                                camera.isOnline ? "default" : "secondary"
                              }
                              className={
                                camera.isOnline
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {camera.isOnline ? "En ligne" : "Hors ligne"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CCTV;
