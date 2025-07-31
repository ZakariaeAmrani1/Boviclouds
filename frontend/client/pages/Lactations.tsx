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
  Milk,
  Hash,
  User,
  Calendar,
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
  useLactationList,
  useLactation,
  useLactationExport,
  useUsers,
  useIdentifications,
} from "../hooks/useLactation";
import { LactationRecord, LactationFilters } from "@shared/lactation";
import { formatDateForDisplay } from "../lib/lactationValidation";

// Import the modals
import AddLactationModal from "../components/modals/AddLactationModal";
import EditLactationModal from "../components/modals/EditLactationModal";
import ViewLactationModal from "../components/modals/ViewLactationModal";
import DeleteLactationModal from "../components/modals/DeleteLactationModal";

type ModalMode = "create" | "edit" | "view";

const Lactations: React.FC = () => {
  const { toast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedRecord, setSelectedRecord] =
    useState<LactationRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] =
    useState<LactationRecord | null>(null);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    sujet_id: "",
    n_lactation: "",
    lait_kg_min: "",
    lait_kg_max: "",
    controleur_laitier_id: "",
    date_min: "",
    date_max: "",
  });

  // Hooks
  const {
    data: lactationData,
    loading: listLoading,
    error: listError,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    refresh,
  } = useLactationList({}, { page: 1, limit: 10 });

  const {
    loading: actionLoading,
    error: actionError,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
  } = useLactation();

  const { loading: exportLoading, exportData } = useLactationExport();

  const { users, getUserName } = useUsers();
  const { identifications, getIdentificationName } = useIdentifications();

  // Event handlers
  const handleSearchInputChange = (
    field: string,
    value: string | undefined,
  ) => {
    setSearchForm((prev) => ({ ...prev, [field]: value || "" }));
  };

  const handleSearch = () => {
    // Convert empty strings to undefined for filtering
    const cleanFilters: LactationFilters = {
      sujet_id: searchForm.sujet_id || undefined,
      n_lactation: searchForm.n_lactation ? parseInt(searchForm.n_lactation) : undefined,
      lait_kg_min: searchForm.lait_kg_min ? parseFloat(searchForm.lait_kg_min) : undefined,
      lait_kg_max: searchForm.lait_kg_max ? parseFloat(searchForm.lait_kg_max) : undefined,
      controleur_laitier_id: searchForm.controleur_laitier_id || undefined,
      date_min: searchForm.date_min || undefined,
      date_max: searchForm.date_max || undefined,
    };
    updateFilters(cleanFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      sujet_id: "",
      n_lactation: "",
      lait_kg_min: "",
      lait_kg_max: "",
      controleur_laitier_id: "",
      date_min: "",
      date_max: "",
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

  const openEditModal = async (record: LactationRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setModalMode("edit");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openViewModal = async (record: LactationRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setModalMode("view");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openDeleteDialog = (record: LactationRecord) => {
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
    return formatDateForDisplay(dateString);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  // Show loading state
  if (listLoading && !lactationData) {
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

  const currentData = lactationData?.data || [];
  const totalPages = lactationData?.totalPages || 0;
  const total = lactationData?.total || 0;

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Sujet
              </Label>
              <Select
                value={searchForm.sujet_id}
                onValueChange={(value) => handleSearchInputChange("sujet_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un sujet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sujets</SelectItem>
                  {identifications.map((identification) => (
                    <SelectItem key={identification.id} value={identification.id}>
                      {identification.nni} - {identification.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Numéro de lactation
              </Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={searchForm.n_lactation || ""}
                onChange={(e) => handleSearchInputChange("n_lactation", e.target.value)}
                className="w-full"
                placeholder="1, 2, 3..."
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Contrôleur laitier
              </Label>
              <Select
                value={searchForm.controleur_laitier_id}
                onValueChange={(value) => handleSearchInputChange("controleur_laitier_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un contrôleur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les contrôleurs</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.prenom} {user.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Production min (kg)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={searchForm.lait_kg_min || ""}
                onChange={(e) => handleSearchInputChange("lait_kg_min", e.target.value)}
                className="w-full"
                placeholder="0"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Production max (kg)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={searchForm.lait_kg_max || ""}
                onChange={(e) => handleSearchInputChange("lait_kg_max", e.target.value)}
                className="w-full"
                placeholder="100"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date de début
              </Label>
              <Input
                type="date"
                value={searchForm.date_min || ""}
                onChange={(e) => handleSearchInputChange("date_min", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date de fin
              </Label>
              <Input
                type="date"
                value={searchForm.date_max || ""}
                onChange={(e) => handleSearchInputChange("date_max", e.target.value)}
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Milk className="w-6 h-6 text-boviclouds-primary" />
            Lactations
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
                    Sujet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Vêlage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Lactation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lait (kg)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Protéine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % MG
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contrôleur
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
                      <div className="max-w-xs truncate">
                        {getIdentificationName(record.sujet_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.date_velage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge 
                        className={`${
                          record.n_lactation === 1 
                            ? "bg-blue-100 text-blue-800 border-blue-200" 
                            : "bg-green-100 text-green-800 border-green-200"
                        }`}
                      >
                        {record.n_lactation}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge 
                        className={`${
                          record.lait_kg > 50 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : record.lait_kg < 20
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }`}
                      >
                        {record.lait_kg} kg
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-mono">{record.pct_proteine}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-mono">{record.pct_mg}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {getUserName(record.controleur_laitier_id)}
                      </div>
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
              <Milk className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune lactation trouvée
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par ajouter une nouvelle lactation.
              </p>
              <Button
                onClick={openCreateModal}
                className="bg-boviclouds-primary hover:bg-boviclouds-green-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une lactation
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
        <AddLactationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {modalMode === "edit" && selectedRecord && (
        <EditLactationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          lactation={selectedRecord}
        />
      )}

      {modalMode === "view" && selectedRecord && (
        <ViewLactationModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          lactation={selectedRecord}
        />
      )}

      {/* Delete confirmation dialog */}
      {recordToDelete && (
        <DeleteLactationModal
          isOpen={isDeleteDialogOpen}
          onClose={handleDeleteClose}
          onSuccess={handleDeleteSuccess}
          lactation={recordToDelete}
        />
      )}
    </>
  );
};

export default Lactations;
