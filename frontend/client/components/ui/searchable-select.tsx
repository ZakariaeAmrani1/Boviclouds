import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: Option[];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  placeholder = "Sélectionner une option",
  value,
  onValueChange,
  options,
  loading = false,
  disabled = false,
  className = "",
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucune option trouvée",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (option.sublabel &&
            option.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={cn(
          "w-full h-12 px-4 text-sm rounded-xl border border-boviclouds-gray-100 bg-white text-left flex items-center justify-between",
          "hover:border-boviclouds-primary focus:outline-none focus:ring-2 focus:ring-boviclouds-primary focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "border-boviclouds-primary ring-2 ring-boviclouds-primary"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-gray-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && !disabled && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-boviclouds-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-4 h-4 mx-auto mb-2 border-2 border-boviclouds-primary border-t-transparent rounded-full"></div>
                Chargement...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between text-sm",
                    value === option.value && "bg-boviclouds-primary/10"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span className="text-xs text-gray-500">
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-boviclouds-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
