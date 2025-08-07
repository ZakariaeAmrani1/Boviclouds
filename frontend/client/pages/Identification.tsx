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
  AlertTriangle,
  X,
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
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import {
  useIdentificationList,
  useIdentification,
  useIdentificationExport,
} from "../hooks/useIdentification";
import {
  IdentificationRecord,
  CreateIdentificationInput,
  UpdateIdentificationInput,
  IdentificationFilters,
  Race,
  Sexe,
  TypeAnimal,
} from "@shared/identification";

// Import the modals (we'll create these next)
import AddIdentificationModal from "../components/modals/AddIdentificationModal";
import EditIdentificationModal from "../components/modals/EditIdentificationModal";
import ViewIdentificationModal from "../components/modals/ViewIdentificationModal";
import DeleteIdentificationModal from "../components/modals/DeleteIdentificationModal";

type ModalMode = "create" | "edit" | "view";

const Identification: React.FC = () => {
  const { toast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedRecord, setSelectedRecord] =
    useState<IdentificationRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] =
    useState<IdentificationRecord | null>(null);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    nni: "",
    race: "all" as Race | "all",
    sexe: "all" as Sexe | "all",
    type: "all" as TypeAnimal | "all",
    eleveur_id: "",
    exploitation_id: "",
    responsable_local_id: "",
    createdBy: "",
  });

  // Hooks
  const {
    data: identificationData,
    loading: listLoading,
    error: listError,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    refresh,
  } = useIdentificationList({}, { page: 1, limit: 10 });

  const {
    loading: actionLoading,
    error: actionError,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
  } = useIdentification();

  const { loading: exportLoading, exportData } = useIdentificationExport();

  // Event handlers
  const handleSearchInputChange = (
    field: string,
    value: string | Race | Sexe | TypeAnimal | "all" | undefined,
  ) => {
    // Convert "all" values to undefined for filtering
    const filterValue = value === "all" ? undefined : value;
    setSearchForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // Convert "all" values to undefined for filtering
    const cleanFilters = {
      nni: searchForm.nni || undefined,
      race: searchForm.race === "all" ? undefined : searchForm.race,
      sexe: searchForm.sexe === "all" ? undefined : searchForm.sexe,
      type: searchForm.type === "all" ? undefined : searchForm.type,
      eleveur_id: searchForm.eleveur_id || undefined,
      exploitation_id: searchForm.exploitation_id || undefined,
      responsable_local_id: searchForm.responsable_local_id || undefined,
      createdBy: searchForm.createdBy || undefined,
    };
    updateFilters(cleanFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      nni: "",
      race: "all" as Race | "all",
      sexe: "all" as Sexe | "all",
      type: "all" as TypeAnimal | "all",
      eleveur_id: "",
      exploitation_id: "",
      responsable_local_id: "",
      createdBy: "",
    };
    setSearchForm(emptyFilters);
    updateFilters({
      nni: "",
      race: undefined,
      sexe: undefined,
      type: undefined,
      eleveur_id: "",
      exploitation_id: "",
      responsable_local_id: "",
      createdBy: "",
    });
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

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (record: IdentificationRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setModalMode("edit");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openViewModal = async (record: IdentificationRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setModalMode("view");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openDeleteDialog = (record: IdentificationRecord) => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const handleModalSuccess = () => {
    refresh();
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;

    const success = await deleteRecord(recordToDelete.id);
    if (success) {
      toast({
        title: "Succès",
        description: "L'identification a été supprimée avec succès.",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getTypeColor = (type: TypeAnimal) => {
    switch (type) {
      case TypeAnimal.BOVIN:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case TypeAnimal.OVIN:
        return "bg-green-100 text-green-800 border-green-200";
      case TypeAnimal.CAPRIN:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSexeColor = (sexe: Sexe) => {
    switch (sexe) {
      case Sexe.MALE:
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case Sexe.FEMELLE:
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Show loading state
  if (listLoading && !identificationData) {
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

  const currentData = identificationData?.data || [];
  const totalPages = identificationData?.totalPages || 0;
  const total = identificationData?.total || 0;

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NNI
              </label>
              <Input
                type="text"
                value={searchForm.nni || ""}
                onChange={(e) => handleSearchInputChange("nni", e.target.value)}
                className="w-full"
                placeholder="Rechercher par NNI..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <Select
                value={searchForm.type || ""}
                onValueChange={(value) =>
                  handleSearchInputChange("type", value as TypeAnimal)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value={TypeAnimal.BOVIN}>Bovin</SelectItem>
                  <SelectItem value={TypeAnimal.OVIN}>Ovin</SelectItem>
                  <SelectItem value={TypeAnimal.CAPRIN}>Caprin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexe
              </label>
              <Select
                value={searchForm.sexe || ""}
                onValueChange={(value) =>
                  handleSearchInputChange("sexe", value as Sexe)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value={Sexe.MALE}>Mâle</SelectItem>
                  <SelectItem value={Sexe.FEMELLE}>Femelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Race
              </label>
              <Select
                value={searchForm.race || ""}
                onValueChange={(value) =>
                  handleSearchInputChange("race", value as Race)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une race" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value={Race.CHAROLAISE}>Charolaise</SelectItem>
                  <SelectItem value={Race.LIMOUSINE}>Limousine</SelectItem>
                  <SelectItem value={Race.HOLSTEIN}>Holstein</SelectItem>
                  <SelectItem value={Race.BLONDE_AQUITAINE}>
                    Blonde d'Aquitaine
                  </SelectItem>
                  <SelectItem value={Race.ANGUS}>Angus</SelectItem>
                  <SelectItem value={Race.MONTBELIARDE}>
                    Montbéliarde
                  </SelectItem>
                  <SelectItem value={Race.NORMANDE}>Normande</SelectItem>
                  <SelectItem value={Race.TARENTAISE}>Tarentaise</SelectItem>
                  <SelectItem value={Race.AUBRAC}>Aubrac</SelectItem>
                  <SelectItem value={Race.SALERS}>Salers</SelectItem>
                  <SelectItem value={Race.AUTRE}>Autre</SelectItem>
                </SelectContent>
              </Select>
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
            Identification
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={openCreateModal}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
            <Button
              onClick={handleExport}
              disabled={exportLoading}
              variant="outline"
            >
              {exportLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exporter
            </Button>
            <Button onClick={refresh} disabled={listLoading} variant="outline">
              <RefreshCw
                className={`w-4 h-4 mr-2 ${listLoading ? "animate-spin" : ""}`}
              />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr key="table-header">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de naissance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sexe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Race
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé par
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
                      {record.infos_sujet.nni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.infos_sujet.date_naissance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getTypeColor(record.infos_sujet.type)}>
                        {record.infos_sujet.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getSexeColor(record.infos_sujet.sexe)}>
                        {record.infos_sujet.sexe}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.infos_sujet.race}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.createdBy}
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
                <Button
                  onClick={() =>
                    updatePagination({
                      ...pagination,
                      page: pagination.page - 1,
                    })
                  }
                  disabled={pagination.page === 1 || listLoading}
                  variant="outline"
                >
                  Précédent
                </Button>
                <Button
                  onClick={() =>
                    updatePagination({
                      ...pagination,
                      page: pagination.page + 1,
                    })
                  }
                  disabled={pagination.page === totalPages || listLoading}
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
                    <Button
                      onClick={() =>
                        updatePagination({
                          ...pagination,
                          page: pagination.page - 1,
                        })
                      }
                      disabled={pagination.page === 1 || listLoading}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          onClick={() =>
                            updatePagination({ ...pagination, page })
                          }
                          disabled={listLoading}
                          variant={
                            page === pagination.page ? "default" : "outline"
                          }
                          size="sm"
                        >
                          {page}
                        </Button>
                      ),
                    )}

                    <Button
                      onClick={() =>
                        updatePagination({
                          ...pagination,
                          page: pagination.page + 1,
                        })
                      }
                      disabled={pagination.page === totalPages || listLoading}
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
      </div>

      {/* Modals */}
      {modalMode === "create" && (
        <AddIdentificationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {modalMode === "edit" && selectedRecord && (
        <EditIdentificationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          identification={selectedRecord}
        />
      )}

      {modalMode === "view" && selectedRecord && (
        <ViewIdentificationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          identification={selectedRecord}
        />
      )}

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
                <p>Êtes-vous sûr de vouloir supprimer cette identification ?</p>
                {recordToDelete && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">
                      NNI: {recordToDelete.infos_sujet.nni}
                    </p>
                    <p className="text-sm text-gray-600">
                      Type: {recordToDelete.infos_sujet.type} -{" "}
                      {recordToDelete.infos_sujet.sexe}
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

export default Identification;
