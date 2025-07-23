import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            i === currentPage
              ? "bg-boviclouds-primary text-white"
              : "text-boviclouds-gray-700 hover:bg-boviclouds-gray-100"
          }`}
        >
          {i}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
      <div className="text-sm text-boviclouds-gray-700 font-inter">
        Affichage de {startItem} à {endItem} sur {totalItems} utilisateurs
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-boviclouds-gray-700 bg-white border border-boviclouds-gray-300 rounded-md hover:bg-boviclouds-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>

        <div className="flex gap-1">{renderPageNumbers()}</div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-boviclouds-gray-700 bg-white border border-boviclouds-gray-300 rounded-md hover:bg-boviclouds-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Pagination;
