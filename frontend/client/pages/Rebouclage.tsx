import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  X,
  AlertTriangle,
  Upload,
  Camera,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
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
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import {
  useRebouclageList,
  useRebouclage,
  useRebouclageExport,
} from "../hooks/useRebouclage";
import {
  RebouclageRecord,
  CreateRebouclageInput,
  CreateRebouclageAutomaticInput,
  UpdateRebouclageInput,
  RebouclageFilters,
  RebouclageStatus,
} from "@shared/rebouclage";
import {
  validateCreateInput,
  validateUpdateInput,
  getFieldError,
  ValidationError,
} from "../lib/rebouclageValidation";

type ModalMode = "create" | "edit" | "view";

interface FormData {
  ancienNNI: string;
  nouveauNNI: string;
  dateRebouclage: string;
  indentificateur_id: string;
  mode: 'manual' | 'automatic';
  selectedImage?: File;
}

const Rebouclage: React.FC = () => {
  const { toast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedRecord, setSelectedRecord] = useState<RebouclageRecord | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<RebouclageRecord | null>(
    null,
  );

  // Form states
  const [searchForm, setSearchForm] = useState<RebouclageFilters>({
    ancienNNI: "",
    codeExploitation: "",
    dateCreation: "",
  });

  const [formData, setFormData] = useState<FormData>({
    ancienNNI: "",
    nouveauNNI: "",
    dateRebouclage: "",
    indentificateur_id: "",
    mode: 'manual',
    selectedImage: undefined,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );

  // Hooks
  const {
    data: rebouclageData,
    loading: listLoading,
    error: listError,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    refresh,
  } = useRebouclageList(searchForm, { page: 1, limit: 10 });

  const {
    loading: actionLoading,
    error: actionError,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
  } = useRebouclage();

  const { loading: exportLoading, exportData } = useRebouclageExport();

  // Event handlers
  const handleSearchInputChange = (
    field: keyof RebouclageFilters,
    value: string,
  ) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    updateFilters(searchForm);
  };

  const handleReset = () => {
    const emptyFilters = {
      ancienNNI: "",
      codeExploitation: "",
      dateCreation: "",
    };
    setSearchForm(emptyFilters);
    updateFilters(emptyFilters);
  };

  const handleExport = async () => {
    const success = await exportData(filters, "csv");
    if (success) {
      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès.",
      });
    } else {
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export.",
        variant: "destructive",
      });
    }
  };

  const handleFormChange = (field: keyof FormData, value: string | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier image",
          variant: "destructive",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, selectedImage: file }));
    }
  };

  const resetForm = () => {
    setFormData({
      ancienNNI: "",
      nouveauNNI: "",
      dateRebouclage: "",
      indentificateur_id: "",
      mode: 'manual',
      selectedImage: undefined,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (record: RebouclageRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setFormData({
        ancienNNI: fullRecord.ancienNNI,
        nouveauNNI: fullRecord.nouveauNNI,
        dateRebouclage: fullRecord.dateRebouclage,
        indentificateur_id: fullRecord.identificateur_id,
      });
      setModalMode("edit");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openViewModal = async (record: RebouclageRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setFormData({
        ancienNNI: fullRecord.ancienNNI,
        nouveauNNI: fullRecord.nouveauNNI,
        dateRebouclage: fullRecord.dateRebouclage,
        indentificateur_id: fullRecord.identificateur_id,
      });
      setModalMode("view");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openDeleteDialog = (record: RebouclageRecord) => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    setValidationErrors([]);

    try {
      if (modalMode === "create") {
        if (formData.mode === 'automatic') {
          // Automatic mode validation
          if (!formData.selectedImage) {
            toast({
              title: "Erreur de validation",
              description: "Veuillez sélectionner une image pour le mode automatique.",
              variant: "destructive",
            });
            return;
          }
          if (!formData.nouveauNNI.trim()) {
            toast({
              title: "Erreur de validation",
              description: "Le nouveau NNI est requis.",
              variant: "destructive",
            });
            return;
          }
          if (!formData.indentificateur_id.trim()) {
            toast({
              title: "Erreur de validation",
              description: "L'identificateur est requis.",
              variant: "destructive",
            });
            return;
          }

          const automaticInput: CreateRebouclageAutomaticInput = {
            nouveauNNI: formData.nouveauNNI.trim(),
            identificateur_id: formData.indentificateur_id.trim(),
            dateRebouclage: formData.dateRebouclage || undefined,
            mode: 'automatic',
            image: formData.selectedImage,
          };

          const result = await createRecord(automaticInput);
          if (result) {
            toast({
              title: "Succès",
              description: "Le rebouclage a été créé avec succès en mode automatique.",
            });
            refresh();
            setIsModalOpen(false);
          }
        } else {
          // Manual mode validation
          const input: CreateRebouclageInput = {
            ancienNNI: formData.ancienNNI.trim(),
            nouveauNNI: formData.nouveauNNI.trim(),
            dateRebouclage: formData.dateRebouclage || undefined,
            identificateur_id: formData.indentificateur_id.trim(),
            mode: 'manual',
          };

          const validation = validateCreateInput(input);
          if (!validation.isValid) {
            setValidationErrors(validation.errors);
            toast({
              title: "Erreur de validation",
              description: "Veuillez corriger les erreurs dans le formulaire.",
              variant: "destructive",
            });
            return;
          }

          const result = await createRecord(input);
          if (result) {
            toast({
              title: "Succès",
              description: "Le rebouclage a été créé avec succès.",
            });
            refresh();
            setIsModalOpen(false);
          }
        }
      } else if (modalMode === "edit" && selectedRecord) {
        const input: UpdateRebouclageInput = {
          ancienNNI: formData.ancienNNI.trim(),
          nouveauNNI: formData.nouveauNNI.trim(),
          dateRebouclage: formData.dateRebouclage || undefined,
          identificateur_id: formData.indentificateur_id.trim(),
        };

        const validation = validateUpdateInput(input);
        if (!validation.isValid) {
          setValidationErrors(validation.errors);
          toast({
            title: "Erreur de validation",
            description: "Veuillez corriger les erreurs dans le formulaire.",
            variant: "destructive",
          });
          return;
        }

        const result = await updateRecord(selectedRecord.id, input);
        if (result) {
          toast({
            title: "Succès",
            description: "Le rebouclage a été mis à jour avec succès.",
          });
          refresh();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'opération.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;

    const success = await deleteRecord(recordToDelete.id);
    if (success) {
      toast({
        title: "Succès",
        description: "Le rebouclage a été supprimé avec succès.",
      });
      refresh();
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setValidationErrors([]);
    resetForm();
  };

  const getStatusColor = (statut: RebouclageStatus) => {
    switch (statut) {
      case RebouclageStatus.ACTIF:
        return "bg-green-100 text-green-800 border-green-200";
      case RebouclageStatus.EN_ATTENTE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case RebouclageStatus.ANNULE:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  // Show loading state
  if (listLoading && !rebouclageData) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-boviclouds-primary" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (listError) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{listError}</p>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const currentData = rebouclageData?.data || [];
  const totalPages = rebouclageData?.totalPages || 0;
  const total = rebouclageData?.total || 0;

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancien NNI
              </label>
              <input
                type="text"
                value={searchForm.ancienNNI || ""}
                onChange={(e) =>
                  handleSearchInputChange("ancienNNI", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Rechercher par ancien NNI..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code exploitation
              </label>
              <input
                type="text"
                value={searchForm.codeExploitation || ""}
                onChange={(e) =>
                  handleSearchInputChange("codeExploitation", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Code exploitation..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date création
              </label>
              <input
                type="date"
                value={searchForm.dateCreation || ""}
                onChange={(e) =>
                  handleSearchInputChange("dateCreation", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSearch}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </button>
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Rebouclage
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={openCreateModal}
              disabled={actionLoading}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </button>
            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto disabled:opacity-50"
            >
              {exportLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exporter
            </button>
            <button
              onClick={refresh}
              disabled={listLoading}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors w-full sm:w-auto disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${listLoading ? "animate-spin" : ""}`}
              />
              Actualiser
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ancien NNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nouveau NNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date du rebouclage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé par
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
                {currentData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.ancienNNI}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.nouveauNNI}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.dateRebouclage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.CréePar}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-green-100 text-green-800 border-green-200`}
                      >
                        Effectué
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(record)}
                          className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                          title="Voir"
                          disabled={actionLoading}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(record)}
                          className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                          title="Modifier"
                          disabled={actionLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(record)}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                          title="Supprimer"
                          disabled={actionLoading}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    updatePagination({
                      ...pagination,
                      page: pagination.page - 1,
                    })
                  }
                  disabled={pagination.page === 1 || listLoading}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() =>
                    updatePagination({
                      ...pagination,
                      page: pagination.page + 1,
                    })
                  }
                  disabled={pagination.page === totalPages || listLoading}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    à{" "}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, total)}
                    </span>{" "}
                    sur <span className="font-medium">{total}</span> résultats
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        updatePagination({
                          ...pagination,
                          page: pagination.page - 1,
                        })
                      }
                      disabled={pagination.page === 1 || listLoading}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() =>
                            updatePagination({ ...pagination, page })
                          }
                          disabled={listLoading}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.page
                              ? "z-10 bg-green-50 border-green-500 text-green-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          } disabled:opacity-50`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() =>
                        updatePagination({
                          ...pagination,
                          page: pagination.page + 1,
                        })
                      }
                      disabled={pagination.page === totalPages || listLoading}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for CRUD operations */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogPortal>
          <DialogOverlay className="bg-black/20" />
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium text-black">
                {modalMode === "create" && "Ajouter un rebouclage"}
                {modalMode === "edit" && "Modifier le rebouclage"}
                {modalMode === "view" && "Détails du rebouclage"}
              </DialogTitle>
              {modalMode === "view" && (
                <button
                  onClick={handleModalClose}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 py-4 sm:py-6">
              {/* Left Column */}
              <div className="space-y-3 sm:space-y-4">
                {/* Ancien NNI */}
                <div className="space-y-2">
                  <Label
                    htmlFor="ancienNNI"
                    className="text-sm font-normal text-black"
                  >
                    Ancien NNI *
                  </Label>
                  <Input
                    id="ancienNNI"
                    value={formData.ancienNNI}
                    onChange={(e) => {
                      handleFormChange("ancienNNI", e.target.value);
                      setValidationErrors((prev) =>
                        prev.filter((err) => err.field !== "ancienNNI"),
                      );
                    }}
                    className={`h-10 sm:h-12 px-3 sm:px-4 text-sm rounded-xl ${
                      getFieldError(validationErrors, "ancienNNI")
                        ? "border-red-500 focus:border-red-500"
                        : "border-boviclouds-gray-100"
                    }`}
                    placeholder="Ex: FR1234567890"
                    disabled={modalMode === "view"}
                  />
                  {getFieldError(validationErrors, "ancienNNI") && (
                    <p className="text-sm text-red-600">
                      {getFieldError(validationErrors, "ancienNNI")}
                    </p>
                  )}
                </div>

                {/* Nouveau NNI */}
                <div className="space-y-2">
                  <Label
                    htmlFor="nouveauNNI"
                    className="text-sm font-normal text-black"
                  >
                    Nouveau NNI *
                  </Label>
                  <Input
                    id="nouveauNNI"
                    value={formData.nouveauNNI}
                    onChange={(e) => {
                      handleFormChange("nouveauNNI", e.target.value);
                      setValidationErrors((prev) =>
                        prev.filter((err) => err.field !== "nouveauNNI"),
                      );
                    }}
                    className={`h-10 sm:h-12 px-3 sm:px-4 text-sm rounded-xl ${
                      getFieldError(validationErrors, "nouveauNNI")
                        ? "border-red-500 focus:border-red-500"
                        : "border-boviclouds-gray-100"
                    }`}
                    placeholder="Ex: FR1234567890"
                    disabled={modalMode === "view"}
                  />
                  {getFieldError(validationErrors, "nouveauNNI") && (
                    <p className="text-sm text-red-600">
                      {getFieldError(validationErrors, "nouveauNNI")}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3 sm:space-y-4">
                {/* Date du rebouclage */}
                <div className="space-y-2">
                  <Label
                    htmlFor="dateRebouclage"
                    className="text-sm font-normal text-black"
                  >
                    Date du rebouclage
                  </Label>
                  <div className="relative">
                    <Input
                      id="dateRebouclage"
                      type="datetime-local"
                      value={formData.dateRebouclage}
                      onChange={(e) => {
                        handleFormChange("dateRebouclage", e.target.value);
                        setValidationErrors((prev) =>
                          prev.filter((err) => err.field !== "dateRebouclage"),
                        );
                      }}
                      className={`h-10 sm:h-12 px-3 sm:px-4 text-sm rounded-xl pr-10 sm:pr-12 ${
                        getFieldError(validationErrors, "dateRebouclage")
                          ? "border-red-500 focus:border-red-500"
                          : "border-boviclouds-gray-100"
                      }`}
                      disabled={modalMode === "view"}
                    />
                    <Calendar className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
                  </div>
                  {getFieldError(validationErrors, "dateRebouclage") && (
                    <p className="text-sm text-red-600">
                      {getFieldError(validationErrors, "dateRebouclage")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{actionError}</p>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-boviclouds-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                className="w-full sm:w-32 h-10 rounded-lg text-sm font-normal border-boviclouds-gray-300 text-boviclouds-gray-800 hover:bg-boviclouds-gray-50"
              >
                {modalMode === "view" ? "Fermer" : "Annuler"}
              </Button>
              {modalMode !== "view" && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={actionLoading}
                  className="w-full sm:w-32 h-10 rounded-lg text-sm font-semibold bg-boviclouds-primary hover:bg-boviclouds-primary/90 text-white disabled:opacity-50"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : modalMode === "create" ? (
                    "Créer"
                  ) : (
                    "Mettre à jour"
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Delete confirmation dialog */}
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
            <AlertDialogDescription asChild>
              <div>
                <p>Êtes-vous sûr de vouloir supprimer ce rebouclage ?</p>
                {recordToDelete && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">
                      Ancien NNI: {recordToDelete.ancienNNI}
                    </p>
                    <p className="font-medium">
                      Nouveau NNI: {recordToDelete.nouveauNNI}
                    </p>
                  </div>
                )}
                <p>Cette action est irréversible.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Rebouclage;
