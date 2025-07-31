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
  FlaskConical,
  Hash,
  User,
} from "lucide-react";
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
  useSemenceList,
  useSemence,
  useSemenceExport,
  useUsers,
} from "../hooks/useSemence";
import { SemenceRecord, SemenceFilters } from "@shared/semence";

// Import the modals
import AddSemenceModal from "../components/modals/AddSemenceModal";
import EditSemenceModal from "../components/modals/EditSemenceModal";
import ViewSemenceModal from "../components/modals/ViewSemenceModal";
import DeleteSemenceModal from "../components/modals/DeleteSemenceModal";

type ModalMode = "create" | "edit" | "view";

const Semences: React.FC = () => {
  const { toast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedRecord, setSelectedRecord] =
    useState<SemenceRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] =
    useState<SemenceRecord | null>(null);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    identificateur: "",
    nom_taureau: "",
    race_taureau: "",
    num_taureau: "",
    createdBy: "",
  });

  // Hooks
  const {
    data: semenceData,
    loading: listLoading,
    error: listError,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    refresh,
  } = useSemenceList({}, { page: 1, limit: 10 });

  const {
    loading: actionLoading,
    error: actionError,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
  } = useSemence();

  const { loading: exportLoading, exportData } = useSemenceExport();

  const { users, getUserName } = useUsers();

  // Event handlers
  const handleSearchInputChange = (
    field: string,
    value: string | undefined,
  ) => {
    setSearchForm((prev) => ({ ...prev, [field]: value || "" }));
  };

  const handleSearch = () => {
    // Convert empty strings to undefined for filtering
    const cleanFilters: SemenceFilters = {
      identificateur: searchForm.identificateur || undefined,
      nom_taureau: searchForm.nom_taureau || undefined,
      race_taureau: searchForm.race_taureau || undefined,
      num_taureau: searchForm.num_taureau || undefined,
      createdBy: searchForm.createdBy || undefined,
    };
    updateFilters(cleanFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      identificateur: "",
      nom_taureau: "",
      race_taureau: "",
      num_taureau: "",
      createdBy: "",
    };
    setSearchForm(emptyFilters);
    updateFilters({});
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

  const openEditModal = async (record: SemenceRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setModalMode("edit");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openViewModal = async (record: SemenceRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setModalMode("view");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openDeleteDialog = (record: SemenceRecord) => {
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

  const handleDeleteSuccess = () => {
    refresh();
    setIsDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  // Show loading state
  if (listLoading && !semenceData) {
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

  const currentData = semenceData?.data || [];
  const totalPages = semenceData?.totalPages || 0;
  const total = semenceData?.total || 0;

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Identificateur
              </Label>
              <Input
                type="text"
                value={searchForm.identificateur || ""}
                onChange={(e) => handleSearchInputChange("identificateur", e.target.value)}
                className="w-full"
                placeholder="SEM123456..."
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du taureau
              </Label>
              <Input
                type="text"
                value={searchForm.nom_taureau || ""}
                onChange={(e) =>
                  handleSearchInputChange("nom_taureau", e.target.value)
                }
                className="w-full"
                placeholder="Napoleon..."
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Race du taureau
              </Label>
              <Input
                type="text"
                value={searchForm.race_taureau || ""}
                onChange={(e) =>
                  handleSearchInputChange("race_taureau", e.target.value)
                }
                className="w-full"
                placeholder="Holstein..."
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Numéro du taureau
              </Label>
              <Input
                type="text"
                value={searchForm.num_taureau || ""}
                onChange={(e) =>
                  handleSearchInputChange("num_taureau", e.target.value)
                }
                className="w-full"
                placeholder="FR12345678..."
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Créé par
              </Label>
              <Input
                type="text"
                value={searchForm.createdBy || ""}
                onChange={(e) =>
                  handleSearchInputChange("createdBy", e.target.value)
                }
                className="w-full"
                placeholder="Nom de l'utilisateur..."
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-boviclouds-primary" />
            Semences
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
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identificateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom du taureau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Race
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro du taureau
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
                      <Badge className="font-mono bg-blue-100 text-blue-800 border-blue-200">
                        {record.identificateur}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-medium">{record.nom_taureau}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {record.race_taureau}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-mono">{record.num_taureau}</span>
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

          {/* Empty state */}
          {currentData.length === 0 && !listLoading && (
            <div className="text-center py-12">
              <FlaskConical className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune semence trouvée
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par ajouter une nouvelle semence.
              </p>
              <Button
                onClick={openCreateModal}
                className="bg-boviclouds-primary hover:bg-boviclouds-green-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une semence
              </Button>
            </div>
          )}

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
        <AddSemenceModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {modalMode === "edit" && selectedRecord && (
        <EditSemenceModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          semence={selectedRecord}
        />
      )}

      {modalMode === "view" && selectedRecord && (
        <ViewSemenceModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          semence={selectedRecord}
        />
      )}

      {/* Delete confirmation dialog */}
      {recordToDelete && (
        <DeleteSemenceModal
          isOpen={isDeleteDialogOpen}
          onClose={handleDeleteClose}
          onSuccess={handleDeleteSuccess}
          semence={recordToDelete}
        />
      )}
    </>
  );
};

export default Semences;
