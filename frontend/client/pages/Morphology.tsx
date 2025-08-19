import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Plus,
  AlertTriangle,
  Upload,
  Camera,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { morphologyService } from "../services/morphologyService";
import { cctvService } from "../services/cctvService";
import ImageCaptureOptions from "../components/ImageCaptureOptions";
import {
  MorphologyRecord,
  MorphologyFormStep,
  MorphologyFormData,
  MorphologyFilters,
} from "@shared/morphology";
import { Camera as CameraType, CameraType as CamType } from "@shared/cctv";

const Morphology: React.FC = () => {
  const { toast } = useToast();

  // State management
  const [morphologies, setMorphologies] = useState<MorphologyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MorphologyRecord | null>(
    null,
  );
  const [recordToDelete, setRecordToDelete] = useState<MorphologyRecord | null>(
    null,
  );

  // Multi-step form states
  const [currentStep, setCurrentStep] =
    useState<MorphologyFormStep>("identification");
  const [formData, setFormData] = useState<MorphologyFormData>({
    cow_id: "",
    source_detection: "Caméra automatique",
  });
  const [stepLoading, setStepLoading] = useState(false);
  const [capturedIdentificationImage, setCapturedIdentificationImage] =
    useState<string | null>(null);
  const [capturedMorphologyImage, setCapturedMorphologyImage] = useState<
    string | null
  >(null);
  const [identificationFile, setIdentificationFile] = useState<File | null>(
    null,
  );
  const [morphologyFile, setMorphologyFile] = useState<File | null>(null);

  // Camera states
  const [cameras, setCameras] = useState<CameraType[]>([]);
  const [identificationCameras, setIdentificationCameras] = useState<
    CameraType[]
  >([]);
  const [morphologyCameras, setMorphologyCameras] = useState<CameraType[]>([]);

  // Search and filter states
  const [searchForm, setSearchForm] = useState({
    cow_id: "",
    source_detection: "all",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    loadMorphologies();
    loadCameras();
  }, [currentPage]);

  const loadMorphologies = async () => {
    try {
      setLoading(true);
      // Convert "all" to empty string for API call
      const apiFilters = {
        ...searchForm,
        source_detection:
          searchForm.source_detection === "all"
            ? ""
            : searchForm.source_detection,
      };

      // Use mock data for now - in real implementation use:
      // const response = await morphologyService.getMorphologies(apiFilters, { page: currentPage, limit: 10 });
      const mockData = await morphologyService.getMockMorphologies();
      if (mockData.success && mockData.data) {
        setMorphologies(mockData.data.data);
      }
      setTotalPages(1);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les morphologies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCameras = async () => {
    try {
      const mockCameras = await cctvService.getMockCameras();
      setCameras(mockCameras);

      const identCams = mockCameras.filter(
        (cam) => cam.type === CamType.IDENTIFICATION && cam.isOnline,
      );
      const morphCams = mockCameras.filter(
        (cam) => cam.type === CamType.MORPHOLOGY && cam.isOnline,
      );

      setIdentificationCameras(identCams);
      setMorphologyCameras(morphCams);
    } catch (error) {
      console.error("Error loading cameras:", error);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await loadMorphologies();
  };

  const handleReset = () => {
    setSearchForm({
      cow_id: "",
      source_detection: "all",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
    loadMorphologies();
  };

  const handleExport = async () => {
    try {
      const exportFilters = {
        ...searchForm,
        source_detection:
          searchForm.source_detection === "all"
            ? ""
            : searchForm.source_detection,
      };
      await morphologyService.exportData("csv", exportFilters);
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
    await loadMorphologies();
    toast({
      title: "Actualisé",
      description: "Liste des morphologies actualisée",
    });
  };

  const openAddModal = () => {
    setCurrentStep("identification");
    setFormData({
      cow_id: "",
      source_detection: "Caméra automatique",
    });
    setCapturedIdentificationImage(null);
    setCapturedMorphologyImage(null);
    setIdentificationFile(null);
    setMorphologyFile(null);
    setIsAddModalOpen(true);
  };

  const openViewModal = (record: MorphologyRecord) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const openDeleteDialog = (record: MorphologyRecord) => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    try {
      await morphologyService.deleteMorphology(recordToDelete._id);
      toast({
        title: "Succès",
        description: "Morphologie supprimée avec succès",
      });
      await loadMorphologies();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la morphologie",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleStepNext = async () => {
    if (currentStep === "identification") {
      if (!capturedIdentificationImage) {
        toast({
          title: "Erreur",
          description:
            "Veuillez capturer ou importer une image d'identification",
          variant: "destructive",
        });
        return;
      }

      try {
        setStepLoading(true);
        let response;

        // Check if we have a file upload or camera capture
        if (identificationFile) {
          // Use file upload method
          response =
            await morphologyService.processIdentificationImage(
              identificationFile,
            );
        } else {
          // Use camera capture method
          const identificationCamera = identificationCameras[0];
          if (!identificationCamera) {
            toast({
              title: "Erreur",
              description: "Aucune caméra d'identification disponible",
              variant: "destructive",
            });
            return;
          }
          response = await morphologyService.captureFromCamera(
            identificationCamera.id,
          );
        }

        if (response.success && response.data) {
          setFormData((prev) => ({ ...prev, cow_id: response.data!.cow_id }));
          setCurrentStep("morphology");
        } else {
          toast({
            title: "Erreur",
            description: response.message || "Impossible d'identifier la vache",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors du traitement de l'image",
          variant: "destructive",
        });
      } finally {
        setStepLoading(false);
      }
    } else if (currentStep === "morphology") {
      if (!capturedMorphologyImage) {
        toast({
          title: "Erreur",
          description: "Veuillez capturer ou importer une image de morphologie",
          variant: "destructive",
        });
        return;
      }

      try {
        setStepLoading(true);
        let response;

        // Check if we have a file upload or camera capture
        if (morphologyFile) {
          // Use file upload method
          response = await morphologyService.processMorphologyImage(
            formData.cow_id,
            morphologyFile,
          );
        } else {
          // Use camera capture method
          const morphologyCamera = morphologyCameras[0];
          if (!morphologyCamera) {
            toast({
              title: "Erreur",
              description: "Aucune caméra de morphologie disponible",
              variant: "destructive",
            });
            return;
          }
          response = await morphologyService.captureMorphologyFromCamera(
            morphologyCamera.id,
            formData.cow_id,
          );
        }

        if (response.success && response.data) {
          setFormData((prev) => ({ ...prev, measurements: response.data }));
          setCurrentStep("results");
        } else {
          toast({
            title: "Erreur",
            description:
              response.message || "Impossible d'analyser la morphologie",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors du traitement de l'image",
          variant: "destructive",
        });
      } finally {
        setStepLoading(false);
      }
    }
  };

  const handleStepBack = () => {
    if (currentStep === "morphology") {
      setCurrentStep("identification");
    } else if (currentStep === "results") {
      setCurrentStep("morphology");
    }
  };

  const handleSubmitMorphology = async () => {
    if (!formData.measurements) return;

    try {
      setStepLoading(true);
      const response = await morphologyService.createMorphology({
        cow_id: formData.cow_id,
        source_detection: formData.source_detection,
        hauteur_au_garrot: formData.measurements.hauteur_au_garrot,
        largeur_du_corps: formData.measurements.largeur_du_corps,
        longueur_du_corps: formData.measurements.longueur_du_corps,
      });

      if (response.success) {
        toast({
          title: "Succès",
          description: "Morphologie enregistrée avec succès",
        });
        setIsAddModalOpen(false);
        await loadMorphologies();
      } else {
        toast({
          title: "Erreur",
          description:
            response.message || "Impossible d'enregistrer la morphologie",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setStepLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-boviclouds-primary" />
          <p className="text-gray-600">Chargement des morphologies...</p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "identification":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 text-boviclouds-primary" />
              <h3 className="text-lg font-semibold mb-2">
                Identification de la vache
              </h3>
              <p className="text-gray-600">
                Utilisez la caméra d'identification pour capturer une image du
                museau de la vache
              </p>
            </div>

            <ImageCaptureOptions
              camera={
                identificationCameras.length > 0
                  ? identificationCameras[0]
                  : undefined
              }
              onCapture={(imageData) => {
                setCapturedIdentificationImage(imageData);
              }}
              onFileUpload={(file) => {
                setIdentificationFile(file);
                setFormData((prev) => ({
                  ...prev,
                  identification_image: file,
                }));
              }}
              capturing={stepLoading}
              captured={!!capturedIdentificationImage}
              title="Caméra d'Identification"
              description="Capturez une image claire du museau de la vache ou importez une image"
              defaultMode={
                identificationCameras.length > 0 ? "camera" : "upload"
              }
            />
          </div>
        );

      case "morphology":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 text-boviclouds-primary" />
              <h3 className="text-lg font-semibold mb-2">
                Analyse morphologique
              </h3>
              <p className="text-gray-600">
                Utilisez la caméra de morphologie pour capturer une image
                complète de la vache
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">
                  Vache identifiée: {formData.cow_id}
                </span>
              </div>
            </div>

            <ImageCaptureOptions
              camera={
                morphologyCameras.length > 0 ? morphologyCameras[0] : undefined
              }
              onCapture={(imageData) => {
                setCapturedMorphologyImage(imageData);
              }}
              onFileUpload={(file) => {
                setMorphologyFile(file);
                setFormData((prev) => ({ ...prev, morphology_image: file }));
              }}
              capturing={stepLoading}
              captured={!!capturedMorphologyImage}
              title="Caméra de Morphologie"
              description="Capturez une image complète de la vache en position debout ou importez une image"
              defaultMode={morphologyCameras.length > 0 ? "camera" : "upload"}
            />
          </div>
        );

      case "results":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">
                Résultats de l'analyse
              </h3>
              <p className="text-gray-600">
                Voici les mesures morphologiques détectées
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Vache: {formData.cow_id}</span>
              </div>
            </div>

            {formData.measurements && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-center">
                      Hauteur au garrot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-boviclouds-primary">
                      {formData.measurements.hauteur_au_garrot.valeur}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.measurements.hauteur_au_garrot.unite}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-center">
                      Largeur du corps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-boviclouds-primary">
                      {formData.measurements.largeur_du_corps.valeur}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.measurements.largeur_du_corps.unite}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-center">
                      Longueur du corps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-boviclouds-primary">
                      {formData.measurements.longueur_du_corps.valeur}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.measurements.longueur_du_corps.unite}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              ID Vache
            </Label>
            <Input
              type="text"
              value={searchForm.cow_id || ""}
              onChange={(e) =>
                setSearchForm((prev) => ({ ...prev, cow_id: e.target.value }))
              }
              className="w-full"
              placeholder="Rechercher par ID..."
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Source
            </Label>
            <Select
              value={searchForm.source_detection || "all"}
              onValueChange={(value) =>
                setSearchForm((prev) => ({
                  ...prev,
                  source_detection: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="Caméra automatique">
                  Caméra automatique
                </SelectItem>
                <SelectItem value="Mesure manuelle">Mesure manuelle</SelectItem>
                <SelectItem value="Inspection vétérinaire">
                  Inspection vétérinaire
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Date début
            </Label>
            <Input
              type="date"
              value={searchForm.dateFrom || ""}
              onChange={(e) =>
                setSearchForm((prev) => ({ ...prev, dateFrom: e.target.value }))
              }
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Date fin
            </Label>
            <Input
              type="date"
              value={searchForm.dateTo || ""}
              onChange={(e) =>
                setSearchForm((prev) => ({ ...prev, dateTo: e.target.value }))
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700"
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
          <Button onClick={handleReset} variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Morphologies
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Morphologie
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Vache
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hauteur (cm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Largeur (cm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Longueur (cm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {morphologies.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Aucune morphologie trouvée
                  </td>
                </tr>
              ) : (
                morphologies.map((record, index) => (
                  <tr
                    key={record._id || `record-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.cow_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.hauteur_au_garrot.valeur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.largeur_du_corps.valeur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.longueur_du_corps.valeur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">{record.source_detection}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(record)}
                          className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(record)}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Précédent
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Suivant
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * 10 + 1}
                  </span>{" "}
                  à{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, morphologies.length)}
                  </span>{" "}
                  sur <span className="font-medium">{morphologies.length}</span>{" "}
                  résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                      >
                        {page}
                      </Button>
                    ),
                  )}

                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Morphology Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Ajouter une Morphologie</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Step indicators */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center ${currentStep === "identification" ? "text-boviclouds-primary" : currentStep === "morphology" || currentStep === "results" ? "text-green-500" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === "identification" ? "border-boviclouds-primary bg-boviclouds-primary text-white" : currentStep === "morphology" || currentStep === "results" ? "border-green-500 bg-green-500 text-white" : "border-gray-300"}`}
                  >
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    Identification
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-400" />

                <div
                  className={`flex items-center ${currentStep === "morphology" ? "text-boviclouds-primary" : currentStep === "results" ? "text-green-500" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === "morphology" ? "border-boviclouds-primary bg-boviclouds-primary text-white" : currentStep === "results" ? "border-green-500 bg-green-500 text-white" : "border-gray-300"}`}
                  >
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Morphologie</span>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-400" />

                <div
                  className={`flex items-center ${currentStep === "results" ? "text-boviclouds-primary" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === "results" ? "border-boviclouds-primary bg-boviclouds-primary text-white" : "border-gray-300"}`}
                  >
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium">Résultats</span>
                </div>
              </div>
            </div>

            {renderStepContent()}
          </div>

          <DialogFooter className="flex-shrink-0">
            <div className="flex justify-between w-full">
              <Button
                onClick={handleStepBack}
                disabled={currentStep === "identification" || stepLoading}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddModalOpen(false)}
                  variant="outline"
                  disabled={stepLoading}
                >
                  Annuler
                </Button>

                {currentStep === "results" ? (
                  <Button
                    onClick={handleSubmitMorphology}
                    disabled={stepLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {stepLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Enregistrer
                  </Button>
                ) : (
                  <Button
                    onClick={handleStepNext}
                    disabled={
                      stepLoading ||
                      (currentStep === "identification" &&
                        !capturedIdentificationImage) ||
                      (currentStep === "morphology" && !capturedMorphologyImage)
                    }
                    className="bg-boviclouds-primary hover:bg-boviclouds-primary/90"
                  >
                    {stepLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Morphologie</DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    ID Vache
                  </Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRecord.cow_id}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Date
                  </Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateTime(selectedRecord.timestamp)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Source
                  </Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRecord.source_detection}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Créé par
                  </Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRecord.createdBy || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Mesures morphologiques
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-center">
                        Hauteur au garrot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-boviclouds-primary">
                        {selectedRecord.hauteur_au_garrot.valeur}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedRecord.hauteur_au_garrot.unite}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-center">
                        Largeur du corps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-boviclouds-primary">
                        {selectedRecord.largeur_du_corps.valeur}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedRecord.largeur_du_corps.unite}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-center">
                        Longueur du corps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-boviclouds-primary">
                        {selectedRecord.longueur_du_corps.valeur}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedRecord.longueur_du_corps.unite}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                <p>Êtes-vous sûr de vouloir supprimer cette morphologie ?</p>
                {recordToDelete && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">
                      Vache: {recordToDelete.cow_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {formatDate(recordToDelete.timestamp)}
                    </p>
                  </div>
                )}
                <p>Cette action est irréversible.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Morphology;
