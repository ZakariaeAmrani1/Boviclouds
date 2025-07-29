import React, { useState } from "react";
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
  X,
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
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
  useUtilisateurList,
  useUtilisateur,
  useUtilisateurExport,
} from "../hooks/useUtilisateur";
import {
  UtilisateurRecord,
  CreateUtilisateurInput,
  UpdateUtilisateurInput,
  UtilisateurFilters,
  UtilisateurStatus,
  UtilisateurRole,
  getFullName,
  getInitials,
} from "@shared/utilisateur";
import {
  validateCreateInput,
  validateUpdateInput,
  getFieldError,
  ValidationError,
} from "../lib/utilisateurValidation";

type ModalMode = "create" | "edit" | "view";

interface FormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  role: UtilisateurRole;
  statut: UtilisateurStatus;
  password: string;
  passwordConfirmation: string;
  adresse: string;
  region: string;
  province: string;
  notes: string;
}

const Utilisateurs: React.FC = () => {
  const { toast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedRecord, setSelectedRecord] =
    useState<UtilisateurRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] =
    useState<UtilisateurRecord | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [searchForm, setSearchForm] = useState<UtilisateurFilters>({
    nom: "",
    email: "",
    role: undefined,
    statut: undefined,
  });

  const [formData, setFormData] = useState<FormData>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    role: UtilisateurRole.ELEVEUR,
    statut: UtilisateurStatus.EN_ATTENTE,
    password: "",
    passwordConfirmation: "",
    adresse: "",
    region: "",
    province: "",
    notes: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );

  // Hooks
  const {
    data: utilisateurData,
    loading: listLoading,
    error: listError,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    refresh,
  } = useUtilisateurList(searchForm, { page: 1, limit: 10 });

  const {
    loading: actionLoading,
    error: actionError,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecord,
  } = useUtilisateur();

  const { loading: exportLoading, exportData } = useUtilisateurExport();

  // Event handlers
  const handleSearchInputChange = (
    field: keyof UtilisateurFilters,
    value: string | UtilisateurRole | UtilisateurStatus | undefined,
  ) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    updateFilters(searchForm);
  };

  const handleReset = () => {
    const emptyFilters = {
      nom: "",
      email: "",
      role: undefined,
      statut: undefined,
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

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      role: UtilisateurRole.ELEVEUR,
      statut: UtilisateurStatus.EN_ATTENTE,
      password: "",
      passwordConfirmation: "",
      adresse: "",
      region: "",
      province: "",
      notes: "",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (record: UtilisateurRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setFormData({
        prenom: fullRecord.prenom,
        nom: fullRecord.nom,
        email: fullRecord.email,
        telephone: fullRecord.telephone || "",
        role: fullRecord.role,
        statut: fullRecord.statut,
        password: fullRecord.email || "",
        passwordConfirmation: fullRecord.email || "",
        adresse: fullRecord.adresse || "",
        region: fullRecord.region || "",
        province: fullRecord.province || "",
        notes: fullRecord.notes || "",
      });
      setModalMode("edit");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openViewModal = async (record: UtilisateurRecord) => {
    const fullRecord = await getRecord(record.id);
    if (fullRecord) {
      setFormData({
        prenom: fullRecord.prenom,
        nom: fullRecord.nom,
        email: fullRecord.email,
        telephone: fullRecord.telephone || "",
        role: fullRecord.role,
        statut: fullRecord.statut,
        password: fullRecord.email || "",
        passwordConfirmation: fullRecord.email || "",
        adresse: fullRecord.adresse || "",
        region: fullRecord.region || "",
        province: fullRecord.province || "",
        notes: fullRecord.notes || "",
      });
      setModalMode("view");
      setSelectedRecord(fullRecord);
      setIsModalOpen(true);
    }
  };

  const openDeleteDialog = (record: UtilisateurRecord) => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    setValidationErrors([]);

    try {
      if (modalMode === "create") {
        const input: CreateUtilisateurInput = {
          prenom: formData.prenom.trim(),
          nom: formData.nom.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          telephone: formData.telephone.trim() || undefined,
          role: formData.role,
          statut: formData.statut,
          exploitation: formData.password.trim() || undefined,
          codeExploitation: formData.passwordConfirmation.trim() || undefined,
          adresse: formData.adresse.trim() || undefined,
          ville: formData.region.trim() || undefined,
          codePostal: formData.province.trim() || undefined,
          notes: formData.notes.trim() || undefined,
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
            description: "L'utilisateur a été créé avec succès.",
          });
          refresh();
          setIsModalOpen(false);
        }
      } else if (modalMode === "edit" && selectedRecord) {
        const input: UpdateUtilisateurInput = {
          prenom: formData.prenom.trim(),
          nom: formData.nom.trim(),
          email: formData.email.trim(),
          telephone: formData.telephone.trim() || undefined,
          role: formData.role,
          statut: formData.statut,
          exploitation: formData.password.trim() || undefined,
          codeExploitation: formData.passwordConfirmation.trim() || undefined,
          adresse: formData.adresse.trim() || undefined,
          region: formData.region.trim() || undefined,
          province: formData.province.trim() || undefined,
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
            description: "L'utilisateur a été mis à jour avec succès.",
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
        description: "L'utilisateur a été supprimé avec succès.",
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

  const getStatusColor = (statut: UtilisateurStatus) => {
    switch (statut) {
      case UtilisateurStatus.ACTIF:
        return "bg-green-100 text-green-800 border-green-200";
      case UtilisateurStatus.INACTIF:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case UtilisateurStatus.EN_ATTENTE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case UtilisateurStatus.SUSPENDU:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: UtilisateurRole) => {
    switch (role) {
      case UtilisateurRole.ADMINISTRATEUR:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case UtilisateurRole.INSEMINATEUR:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case UtilisateurRole.IDENTIFICATEUR:
        return "bg-teal-100 text-teal-800 border-teal-200";
      case UtilisateurRole.ELEVEUR:
        return "bg-green-100 text-green-800 border-green-200";
      case UtilisateurRole.CONTROLEUR:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case UtilisateurRole.SUPPORT:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  // Show loading state
  if (listLoading && !utilisateurData) {
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

  const currentData = utilisateurData?.data || [];
  const totalPages = utilisateurData?.totalPages || 0;
  const total = utilisateurData?.total || 0;

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="heading-2 mb-2">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">
            Gérez les utilisateurs de votre plateforme boviclouds
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom ou Prénom
              </label>
              <input
                type="text"
                value={searchForm.nom || ""}
                onChange={(e) => handleSearchInputChange("nom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Rechercher par nom..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="text"
                value={searchForm.email || ""}
                onChange={(e) =>
                  handleSearchInputChange("email", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Rechercher par email..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <Select
                value={searchForm.role || "all-roles"}
                onValueChange={(value) =>
                  handleSearchInputChange(
                    "role",
                    value === "all-roles"
                      ? undefined
                      : (value as UtilisateurRole),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-roles">Tous les rôles</SelectItem>
                  <SelectItem value={UtilisateurRole.ADMINISTRATEUR}>
                    Administrateur
                  </SelectItem>
                  <SelectItem value={UtilisateurRole.INSEMINATEUR}>
                    Inseminateur
                  </SelectItem>
                  <SelectItem value={UtilisateurRole.IDENTIFICATEUR}>
                    Identificateur
                  </SelectItem>
                  <SelectItem value={UtilisateurRole.ELEVEUR}>
                    Éleveur
                  </SelectItem>
                  <SelectItem value={UtilisateurRole.CONTROLEUR}>
                    Contrôleur
                  </SelectItem>
                  <SelectItem value={UtilisateurRole.SUPPORT}>
                    Support
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <Select
                value={searchForm.statut || "all-statuts"}
                onValueChange={(value) =>
                  handleSearchInputChange(
                    "statut",
                    value === "all-statuts"
                      ? undefined
                      : (value as UtilisateurStatus),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuts">Tous les statuts</SelectItem>
                  <SelectItem value={UtilisateurStatus.ACTIF}>Actif</SelectItem>
                  <SelectItem value={UtilisateurStatus.INACTIF}>
                    Inactif
                  </SelectItem>
                  <SelectItem value={UtilisateurStatus.EN_ATTENTE}>
                    En attente
                  </SelectItem>
                  <SelectItem value={UtilisateurStatus.SUSPENDU}>
                    Suspendu
                  </SelectItem>
                </SelectContent>
              </Select>
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
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Utilisateurs ({total})
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={openCreateModal}
              disabled={actionLoading}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full sm:w-auto disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter Utilisateur
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
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-boviclouds-primary flex items-center justify-center mr-4">
                          <span className="text-white font-medium text-sm">
                            {getInitials(record)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getFullName(record)}
                          </div>
                          {record.telephone && (
                            <div className="text-sm text-gray-500">
                              {record.telephone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(record.role)}`}
                      >
                        {record.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {record.adresse && (
                          <div className="font-medium">{record.adresse}</div>
                        )}
                        {record.region && (
                          <div className="text-gray-500">{record.region}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(record.statut)}`}
                      >
                        {record.statut}
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
                {modalMode === "create" && "Ajouter un utilisateur"}
                {modalMode === "edit" && "Modifier l'utilisateur"}
                {modalMode === "view" && "Détails de l'utilisateur"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 py-4 sm:py-6">
              {/* Left Column */}
              <div className="space-y-3 sm:space-y-4">
                {/* Prénom */}
                <div className="space-y-2">
                  <Label
                    htmlFor="prenom"
                    className="text-sm font-normal text-black flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Prénom *
                  </Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => {
                      handleFormChange("prenom", e.target.value);
                      setValidationErrors((prev) =>
                        prev.filter((err) => err.field !== "prenom"),
                      );
                    }}
                    className={`h-10 sm:h-12 px-3 sm:px-4 text-sm rounded-xl ${
                      getFieldError(validationErrors, "prenom")
                        ? "border-red-500 focus:border-red-500"
                        : "border-boviclouds-gray-100"
                    }`}
                    placeholder="Ex: Jean"
                    disabled={modalMode === "view"}
                  />
                  {getFieldError(validationErrors, "prenom") && (
                    <p className="text-sm text-red-600">
                      {getFieldError(validationErrors, "prenom")}
                    </p>
                  )}
                </div>

                {/* Nom */}
                <div className="space-y-2">
                  <Label
                    htmlFor="nom"
                    className="text-sm font-normal text-black flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Nom *
                  </Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => {
                      handleFormChange("nom", e.target.value);
                      setValidationErrors((prev) =>
                        prev.filter((err) => err.field !== "nom"),
                      );
                    }}
                    className={`h-10 sm:h-12 px-3 sm:px-4 text-sm rounded-xl ${
                      getFieldError(validationErrors, "nom")
                        ? "border-red-500 focus:border-red-500"
                        : "border-boviclouds-gray-100"
                    }`}
                    placeholder="Ex: Dupont"
                    disabled={modalMode === "view"}
                  />
                  {getFieldError(validationErrors, "nom") && (
                    <p className="text-sm text-red-600">
                      {getFieldError(validationErrors, "nom")}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-normal text-black flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleFormChange("email", e.target.value);
                      setValidationErrors((prev) =>
                        prev.filter((err) => err.field !== "email"),
                      );
                    }}
                    className={`h-10 sm:h-12 px-3 sm:px-4 text-sm rounded-xl ${
                      getFieldError(validationErrors, "email")
                        ? "border-red-500 focus:border-red-500"
                        : "border-boviclouds-gray-100"
                    }`}
                    placeholder="Ex: jean.dupont@example.com"
                    disabled={modalMode === "view"}
                  />
                  {getFieldError(validationErrors, "email") && (
                    <p className="text-sm text-red-600">
                      {getFieldError(validationErrors, "email")}
                    </p>
                  )}
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="telephone"
                    className="text-sm font-normal text-black flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => {
                      handleFormChange("telephone", e.target.value);
                      setValidationErrors((prev) =>
                        prev.filter((err) => err.field !== "telephone"),
                      );
                    }}
                    className={`h-10 sm:h-12 px-3 sm:px-4 text-sm rounded-xl ${
                      getFieldError(validationErrors, "telephone")
                        ? "border-red-500 focus:border-red-500"
                        : "border-boviclouds-gray-100"
                    }`}
                    placeholder="Ex: 0123456789"
                    disabled={modalMode === "view"}
                  />
                  {getFieldError(validationErrors, "telephone") && (
                    <p className="text-sm text-red-600">
                      {getFieldError(validationErrors, "telephone")}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3 sm:space-y-4">
                {/* Rôle */}
                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-sm font-normal text-black"
                  >
                    Rôle *
                  </Label>
                  {modalMode === "view" ? (
                    <div
                      className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full border ${getRoleColor(formData.role)}`}
                    >
                      {formData.role}
                    </div>
                  ) : (
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleFormChange("role", value as UtilisateurRole)
                      }
                    >
                      <SelectTrigger className="h-10 sm:h-12 text-sm">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UtilisateurRole.ADMINISTRATEUR}>
                          Administrateur
                        </SelectItem>
                        <SelectItem value={UtilisateurRole.INSEMINATEUR}>
                          Inseminateur
                        </SelectItem>
                        <SelectItem value={UtilisateurRole.IDENTIFICATEUR}>
                          Identificateur
                        </SelectItem>
                        <SelectItem value={UtilisateurRole.ELEVEUR}>
                          Éleveur
                        </SelectItem>
                        <SelectItem value={UtilisateurRole.CONTROLEUR}>
                          Contrôleur
                        </SelectItem>
                        <SelectItem value={UtilisateurRole.SUPPORT}>
                          Non Définit
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label
                    htmlFor="statut"
                    className="text-sm font-normal text-black"
                  >
                    Statut
                  </Label>
                  {modalMode === "view" ? (
                    <div
                      className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full border ${getStatusColor(formData.statut)}`}
                    >
                      {formData.statut}
                    </div>
                  ) : (
                    <Select
                      value={formData.statut}
                      onValueChange={(value) =>
                        handleFormChange("statut", value as UtilisateurStatus)
                      }
                    >
                      <SelectTrigger className="h-10 sm:h-12 text-sm">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UtilisateurStatus.EN_ATTENTE}>
                          En attente
                        </SelectItem>
                        <SelectItem value={UtilisateurStatus.ACTIF}>
                          Actif
                        </SelectItem>
                        <SelectItem value={UtilisateurStatus.INACTIF}>
                          Inactif
                        </SelectItem>
                        <SelectItem value={UtilisateurStatus.SUSPENDU}>
                          Suspendu
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Exploitation */}
                <div className="space-y-2">
                  <Label
                    htmlFor="exploitation"
                    className="text-sm font-normal text-black"
                  >
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      value={formData.password}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) =>
                        handleFormChange("password", e.target.value)
                      }
                      className="h-10 sm:h-12 px-3 sm:px-4 text-sm border-boviclouds-gray-100 rounded-xl"
                      placeholder="Ex: Ferme des Prés"
                      disabled={true}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(false)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9A9A9A] hover:text-boviclouds-primary transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showPassword ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="adresse"
                  className="text-sm font-normal text-black flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Adresse
                </Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleFormChange("adresse", e.target.value)}
                  className="h-10 sm:h-12 px-3 sm:px-4 text-sm border-boviclouds-gray-100 rounded-xl"
                  placeholder="Ex: 123 Rue de la Ferme"
                  disabled={modalMode === "view"}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="ville"
                  className="text-sm font-normal text-black"
                >
                  Région
                </Label>
                <Input
                  id="ville"
                  value={formData.region}
                  onChange={(e) => handleFormChange("region", e.target.value)}
                  className="h-10 sm:h-12 px-3 sm:px-4 text-sm border-boviclouds-gray-100 rounded-xl"
                  placeholder="Ex: Paris"
                  disabled={modalMode === "view"}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="province"
                  className="text-sm font-normal text-black"
                >
                  Province
                </Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => {
                    handleFormChange("province", e.target.value);
                    setValidationErrors((prev) =>
                      prev.filter((err) => err.field !== "province"),
                    );
                  }}
                  className={`h-10 sm:h-12 px-3 sm:px-4 text-sm rounded-xl ${
                    getFieldError(validationErrors, "province")
                      ? "border-red-500 focus:border-red-500"
                      : "border-boviclouds-gray-100"
                  }`}
                  placeholder="Ex: 75001"
                  disabled={modalMode === "view"}
                />
                {getFieldError(validationErrors, "province") && (
                  <p className="text-sm text-red-600">
                    {getFieldError(validationErrors, "province")}
                  </p>
                )}
              </div>
            </div>

            {/* Notes section */}
            {/* <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-normal text-black">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => {
                  handleFormChange("notes", e.target.value);
                  setValidationErrors((prev) =>
                    prev.filter((err) => err.field !== "notes"),
                  );
                }}
                className={`min-h-[80px] px-3 py-2 text-sm rounded-xl ${
                  getFieldError(validationErrors, "notes")
                    ? "border-red-500 focus:border-red-500"
                    : "border-boviclouds-gray-100"
                }`}
                placeholder="Ajoutez des notes sur cet utilisateur..."
                disabled={modalMode === "view"}
                maxLength={500}
              />
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formData.notes.length}/500 caractères</span>
                {getFieldError(validationErrors, "notes") && (
                  <span className="text-red-600">
                    {getFieldError(validationErrors, "notes")}
                  </span>
                )}
              </div>
            </div> */}

            {/* User Info Section (View Mode) */}
            {modalMode === "view" && selectedRecord && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Informations système
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Date de création:</span>
                    <span className="ml-2 font-medium">
                      {formatDateTime(selectedRecord.dateCreation)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">
                      Dernière modification:
                    </span>
                    <span className="ml-2 font-medium">
                      {formatDateTime(selectedRecord.dateModification)}
                    </span>
                  </div>
                  {selectedRecord.dernierConnexion && (
                    <div>
                      <span className="text-gray-500">Dernière connexion:</span>
                      <span className="ml-2 font-medium">
                        {formatDateTime(selectedRecord.dernierConnexion)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
                {recordToDelete && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">
                      {getFullName(recordToDelete)} ({recordToDelete.email})
                    </p>
                    <p className="text-sm text-gray-600">
                      Rôle: {recordToDelete.role}
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

export default Utilisateurs;
