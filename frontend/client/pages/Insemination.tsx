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
  Calendar,
  Zap,
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
  useInseminationList,
  useInsemination,
  useInseminationExport,
  useUsers,
} from "../hooks/useInsemination";
import { InseminationRecord, InseminationFilters } from "@shared/insemination";

// Import the modals
import AddInseminationModal from "../components/modals/AddInseminationModal";
import EditInseminationModal from "../components/modals/EditInseminationModal";
import ViewInseminationModal from "../components/modals/ViewInseminationModal";
import DeleteInseminationModal from "../components/modals/DeleteInseminationModal";

type ModalMode = "create" | "edit" | "view";

const Insemination: React.FC = () => {
  const { toast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedRecord, setSelectedRecord] =
    useState<InseminationRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] =
    useState<InseminationRecord | null>(null);
  const [inseminateurss, setInseminateur] = useState(null);
  const [responsabless, setResponsables] = useState(null);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    nni: "",
    semence_id: "",
    inseminateur_id: "",
    responsable_local_id: "",
    date_dissemination: "",
    createdBy: "",
  });

  // Hooks
  const {
    data: inseminationData,
    loading: listLoading,
    error: listError,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    refresh,
  } = useInseminationList({}, { page: 1, limit: 10 });

  const {
    loading: actionLoading,
    error: actionError,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
  } = useInsemination();

  const { loading: exportLoading, exportData } = useInseminationExport();

  const { users, getUserName } = useUsers();
  const inseminateurs = users.filter((user) => user.role === "INSEMINATEUR");
  const responsables = users.filter(
    (user) => user.role === "RESPONSABLE_LOCAL",
  );
  // Event handlers
  const handleSearchInputChange = (
    field: string,
    value: string | undefined,
  ) => {
    setSearchForm((prev) => ({ ...prev, [field]: value || "" }));
  };

  const handleSearch = () => {
    // Convert empty strings to undefined for filtering
    const cleanFilters: InseminationFilters = {
      nni: searchForm.nni || undefined,
      semence_id: searchForm.semence_id || undefined,
      inseminateur_id: searchForm.inseminateur_id || undefined,
      responsable_local_id: searchForm.responsable_local_id || undefined,
      date_dissemination: searchForm.date_dissemination || undefined,
      createdBy: searchForm.createdBy || undefined,
    };
    updateFilters(cleanFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      nni: "",
      semence_id: "",
      inseminateur_id: "",
      responsable_local_id: "",
      date_dissemination: "",
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

  const openEditModal = async (record: InseminationRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setModalMode("edit");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openViewModal = async (record: InseminationRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setModalMode("view");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openDeleteDialog = (record: InseminationRecord) => {
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
  if (listLoading && !inseminationData) {
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

  const currentData = inseminationData?.data || [];
  const totalPages = inseminationData?.totalPages || 0;
  const total = inseminationData?.total || 0;

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                NNI
              </Label>
              <Input
                type="text"
                value={searchForm.nni || ""}
                onChange={(e) => handleSearchInputChange("nni", e.target.value)}
                className="w-full"
                placeholder="Rechercher par NNI..."
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                ID Semence
              </Label>
              <Input
                type="text"
                value={searchForm.semence_id || ""}
                onChange={(e) =>
                  handleSearchInputChange("semence_id", e.target.value)
                }
                className="w-full"
                placeholder="SEM123456..."
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Date de dissémination
              </Label>
              <Input
                type="date"
                value={searchForm.date_dissemination || ""}
                onChange={(e) =>
                  handleSearchInputChange("date_dissemination", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Inséminateur
              </Label>
              <Select
                value={searchForm.inseminateur_id || ""}
                onValueChange={(value) =>
                  handleSearchInputChange(
                    "inseminateur_id",
                    value === "all" ? "" : value,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un inséminateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {inseminateurs.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.prenom} {user.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Responsable local
              </Label>
              <Select
                value={searchForm.responsable_local_id || ""}
                onValueChange={(value) =>
                  handleSearchInputChange(
                    "responsable_local_id",
                    value === "all" ? "" : value,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un responsable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {responsables.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.prenom} {user.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Zap className="w-6 h-6 text-boviclouds-primary" />
            Insémination
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
                    NNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date dissémination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Semence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inséminateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable local
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
                      <span className="font-mono">{record.nni}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(record.date_dissemination)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge className="font-mono bg-blue-100 text-blue-800 border-blue-200">
                        {record.semence_id}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />
                        {getUserName(record.inseminateur_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-gray-400" />
                        {getUserName(record.responsable_local_id)}
                      </div>
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
              <Zap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune insémination trouvée
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par ajouter une nouvelle insémination.
              </p>
              <Button
                onClick={openCreateModal}
                className="bg-boviclouds-primary hover:bg-boviclouds-green-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une insémination
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
        <AddInseminationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {modalMode === "edit" && selectedRecord && (
        <EditInseminationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          insemination={selectedRecord}
        />
      )}

      {modalMode === "view" && selectedRecord && (
        <ViewInseminationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          insemination={selectedRecord}
        />
      )}

      {/* Delete confirmation dialog */}
      {recordToDelete && (
        <DeleteInseminationModal
          isOpen={isDeleteDialogOpen}
          onClose={handleDeleteClose}
          onSuccess={handleDeleteSuccess}
          insemination={recordToDelete}
        />
      )}
    </>
  );
};

export default Insemination;
