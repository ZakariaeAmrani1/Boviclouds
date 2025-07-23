import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import SearchBar from "../components/SearchBar";
import TabNavigation from "../components/TabNavigation";
import UserTable from "../components/UserTable";
import Pagination from "../components/Pagination";
import AddUserModal from "../components/AddUserModal";

// Sample data for different tabs
const eleveursData = [
  {
    id: 1,
    fullName: "Jean Dupont",
    email: "jean.dupont@email.com",
    role: "Eleveur",
    exploitation: "Ferme des Prés",
    status: "Actif" as const,
  },
  {
    id: 2,
    fullName: "Marie Martin",
    email: "marie.martin@email.com",
    role: "Eleveur",
    exploitation: "Ranch Martin",
    status: "Actif" as const,
  },
  {
    id: 3,
    fullName: "Pierre Legrand",
    email: "pierre.legrand@email.com",
    role: "Eleveur",
    exploitation: "Domaine Legrand",
    status: "Inactif" as const,
  },
];

const utilisateursData = [
  {
    id: 4,
    fullName: "Sophie Leroy",
    email: "sophie.leroy@email.com",
    role: "Administrateur",
    exploitation: "Bovins & Co",
    status: "Actif" as const,
  },
  {
    id: 5,
    fullName: "Michel Robert",
    email: "michel.robert@email.com",
    role: "Gestionnaire",
    exploitation: "Admin Central",
    status: "Actif" as const,
  },
  {
    id: 6,
    fullName: "Dr. Claire Dubois",
    email: "claire.dubois@email.com",
    role: "Vétérinaire",
    exploitation: "Clinique Vét.",
    status: "Actif" as const,
  },
];

const exploitationsData = [
  {
    id: 7,
    fullName: "Ferme des Prés",
    email: "contact@fermedespres.fr",
    role: "Exploitation",
    exploitation: "Code: EXP001",
    status: "Actif" as const,
  },
  {
    id: 8,
    fullName: "Ranch Martin",
    email: "info@ranchmartin.fr",
    role: "Exploitation",
    exploitation: "Code: EXP002",
    status: "Actif" as const,
  },
  {
    id: 9,
    fullName: "Domaine Legrand",
    email: "contact@domainelegrand.fr",
    role: "Exploitation",
    exploitation: "Code: EXP003",
    status: "Inactif" as const,
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("utilisateurs");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "eleveurs":
        return eleveursData;
      case "exploitations":
        return exploitationsData;
      default:
        return utilisateursData;
    }
  };

  const users = getCurrentData();

  const getPageTitle = () => {
    switch (activeTab) {
      case "eleveurs":
        return "Gestion des éleveurs";
      case "exploitations":
        return "Gestion des exploitations";
      default:
        return "Gestion des utilisateurs";
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case "eleveurs":
        return "Gérez les éleveurs de votre plateforme boviclouds";
      case "exploitations":
        return "Gérez les exploitations de votre plateforme boviclouds";
      default:
        return "Gérez les utilisateurs de votre plateforme boviclouds";
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "eleveurs":
        return "Vous cherchez quel éleveur ...";
      case "exploitations":
        return "Vous cherchez quelle exploitation ...";
      default:
        return "Vous cherchez quel utilisateur ...";
    }
  };

  const breadcrumbItems = [
    { label: "Accueil", href: "#" },
    { label: getPageTitle() },
  ];

  const handleUserEdit = (userId: number) => {
    console.log("Edit user:", userId);
  };

  const handleUserView = (userId: number) => {
    console.log("View user:", userId);
  };

  const handleUserDelete = (userId: number) => {
    console.log("Delete user:", userId);
  };

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // Reset page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSearchValue("");
  }, [activeTab]);

  return (
    <div className="p-4 sm:p-6">
      {/* Header with Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 text-sm">Accueil</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm font-medium">
            {getPageTitle().replace("Gestion des ", "")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {getPageDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              placeholder={getSearchPlaceholder()}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center px-4 py-2 bg-white border border-boviclouds-gray-300 text-boviclouds-gray-700 rounded-md hover:bg-boviclouds-gray-50 font-inter text-sm font-medium transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filtrer
            </button>

            <button
              onClick={handleAddUser}
              className="flex items-center justify-center px-4 py-2 bg-boviclouds-primary text-white rounded-md hover:bg-boviclouds-primary/90 font-inter text-sm font-medium transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Ajouter{" "}
              {activeTab === "eleveurs"
                ? "Éleveur"
                : activeTab === "exploitations"
                  ? "Exploitation"
                  : "Utilisateur"}
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
        <UserTable
          users={filteredUsers}
          onEdit={handleUserEdit}
          onView={handleUserView}
          onDelete={handleUserDelete}
        />

        {/* Pagination */}
        {filteredUsers.length > 4 && (
          <div className="border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredUsers.length / 4)}
              totalItems={filteredUsers.length}
              itemsPerPage={4}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        tabType={activeTab as "eleveurs" | "utilisateurs" | "exploitations"}
      />
    </div>
  );
};

export default Index;
