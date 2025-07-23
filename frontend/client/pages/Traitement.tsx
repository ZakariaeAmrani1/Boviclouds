import React, { useState, useEffect } from "react";
import {
  TraitementRecord,
  Sujet,
  InseminationRecord,
  LactationRecord,
  TraitementTab,
  TRAITEMENT_TABS,
  CreateSujetRequest,
  CreateInseminationRequest,
  CreateLactationRequest,
  UpdateSujetRequest,
  UpdateInseminationRequest,
  UpdateLactationRequest,
  TraitementFilter,
} from "@shared/traitement";
import { traitementService } from "@/services/traitementService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Filter,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AddSujetModal from "@/components/modals/AddSujetModal";
import EditSujetModal from "@/components/modals/EditSujetModal";
import ViewSujetModal from "@/components/modals/ViewSujetModal";
import DeleteSujetModal from "@/components/modals/DeleteSujetModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Traitement: React.FC = () => {
  const [records, setRecords] = useState<TraitementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState<TraitementTab>("identification");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [filter, setFilter] = useState<TraitementFilter>({});

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TraitementRecord | null>(
    null,
  );
  const [isModalLoading, setIsModalLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadRecords();
  }, [currentTab, filter]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const mockRecords = traitementService.getMockRecords(currentTab);
      setRecords(mockRecords);
      setSelectedRecords([]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les enregistrements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TraitementTab) => {
    setCurrentTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedRecords([]);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilter((prev) => ({ ...prev, search: value }));
  };

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId],
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === records.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(records.map((record) => record.id));
    }
  };

  const handleEdit = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setIsEditModalOpen(true);
    }
  };

  const handleView = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setIsViewModalOpen(true);
    }
  };

  const handleDelete = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setIsDeleteModalOpen(true);
    }
  };

  const handleAddRecord = () => {
    setIsAddModalOpen(true);
  };

  const handleFilter = () => {
    // TODO: Implement filter modal
    console.log("Open filter modal");
  };

  // Modal handlers
  const handleAddSubmit = async (
    data:
      | CreateSujetRequest
      | CreateInseminationRequest
      | CreateLactationRequest,
  ) => {
    setIsModalLoading(true);
    try {
      await traitementService.createRecord(data);
      toast({
        title: "Succès",
        description: "Enregistrement ajouté avec succès",
      });
      await loadRecords();
      setIsAddModalOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEditSubmit = async (
    id: string,
    data:
      | UpdateSujetRequest
      | UpdateInseminationRequest
      | UpdateLactationRequest,
  ) => {
    setIsModalLoading(true);
    try {
      await traitementService.updateRecord(id, data, currentTab);
      toast({
        title: "Succès",
        description: "Enregistrement modifié avec succès",
      });
      await loadRecords();
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDeleteConfirm = async (recordId: string) => {
    setIsModalLoading(true);
    try {
      await traitementService.deleteRecord(recordId, currentTab);
      toast({
        title: "Succès",
        description: "Enregistrement supprimé avec succès",
      });
      await loadRecords();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Chargement des enregistrements...
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(records.length / 10);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, records.length);
  const displayedRecords = records.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Traitement", href: "/traitement" },
          { label: "Identification", href: "/traitement" },
        ]}
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Vous cherchez quel ..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 h-12 border-gray-300 rounded-lg"
        />
      </div>

      {/* Header with Tabs and Actions */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-8">
          {/* Tabs */}
          <div className="flex items-center">
            {TRAITEMENT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "px-4 py-3 text-xs font-medium transition-colors border-b-2 relative",
                  currentTab === tab.id
                    ? "text-primary border-primary"
                    : "text-gray-500 border-transparent hover:text-gray-700",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFilter}
            className="border-primary text-primary hover:bg-primary/5"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="w-px h-8 bg-gray-200" />
          <Button
            onClick={handleAddRecord}
            className="bg-primary hover:bg-primary/90 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border border-gray-200 rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRecords.length === records.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border border-gray-800"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NNI sujet
                  </th>
                  {currentTab === "identification" && (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doc
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date naissance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Race
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sexe
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                    </>
                  )}
                  {currentTab === "insemination" && (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taureau
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date insémination
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vétérinaire
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Méthode
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </>
                  )}
                  {currentTab === "lactation" && (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date démarrage
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Production (L/j)
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qualité lait
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Période
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleSelectRecord(record.id)}
                        className="w-4 h-4 rounded border border-gray-800"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {record.nniSujet}
                      </div>
                    </td>

                    {currentTab === "identification" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as Sujet).doc}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as Sujet).dateNaissance}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as Sujet).race}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as Sujet).sexe}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as Sujet).type}
                          </div>
                        </td>
                      </>
                    )}

                    {currentTab === "insemination" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as InseminationRecord).taureau}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as InseminationRecord).dateInsemination}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as InseminationRecord).veterinaire}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as InseminationRecord).methode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as InseminationRecord).statut}
                          </div>
                        </td>
                      </>
                    )}

                    {currentTab === "lactation" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as LactationRecord).dateDemarrage}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">
                            {(record as LactationRecord).productionJournaliere}L
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as LactationRecord).qualiteLait}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as LactationRecord).periode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(record as LactationRecord).statut}
                          </div>
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(record.id)}
                          className="text-primary hover:text-primary/80 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleView(record.id)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-4" />
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
          Affichage de {startIndex + 1} à {endIndex} sur {records.length}{" "}
          enregistrements
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="opacity-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white min-w-[32px]"
          >
            {currentPage}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="opacity-50 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AddSujetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={isModalLoading}
        currentTab={currentTab}
      />

      <EditSujetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        record={selectedRecord}
        isLoading={isModalLoading}
      />

      <ViewSujetModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        record={selectedRecord}
      />

      <DeleteSujetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        record={selectedRecord}
        isLoading={isModalLoading}
      />
    </div>
  );
};

export default Traitement;
