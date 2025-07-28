import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Users,
  FileText,
  Settings,
  HelpCircle,
  ChevronDown,
  Bell,
  Search,
  LogOut,
  Calendar,
  Shield,
  Zap,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Stethoscope,
  FileSearch,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/",
      badge: null,
    },
    {
      icon: Activity,
      label: "Production",
      path: "/rebouclage",
      badge: "12",
    },
    {
      icon: FileSearch,
      label: "Identification",
      path: "/identification",
      badge: null,
    },
    {
      icon: Users,
      label: "Utilisateurs",
      path: "/utilisateurs",
      badge: null,
    },
    {
      icon: Camera,
      label: "CCTV",
      path: "/cctv",
      badge: null,
    },
    {
      icon: Stethoscope,
      label: "Traitement",
      path: "/traitement",
      badge: null,
    },
    {
      icon: Calendar,
      label: "Planning",
      path: "/planning",
      badge: null,
    },
    {
      icon: Shield,
      label: "Health",
      path: "/health",
      badge: "5",
    },
    {
      icon: FileText,
      label: "Documents",
      path: "/documents",
      badge: null,
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      badge: null,
    },
  ];

  const handleMenuClick = (path: string) => {
    console.log(isOpen);
    navigate(path);
    // onClose(); // Close mobile sidebar after navigation
  };

  return (
    <>
      {/* Mobile Sidebar - Full width when open, hidden when closed */}
      <div
        className={`lg:hidden fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo Section with Close Button */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <h1 className="brand-title">Boviclouds</h1>
                <p className="brand-subtitle">Farm Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="nav-item flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white badge-text rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Mobile Bottom Section */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 transition-colors">
            <div className="relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <span className="nav-item">Notifications</span>
          </div>
        </div>
        {/* Mobile User Profile Section */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium text-xs">ZA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="nav-item text-gray-900 truncate">Zakariae Amrani</p>
              <p className="nav-secondary text-gray-500">Farm Manager</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isProfileOpen && (
            <div className="mt-2 py-1 space-y-1 border-t border-gray-100 pt-2">
              <button
                onClick={() => handleMenuClick("/profile")}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
                Profile
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Sidebar - Expands/Collapses between full width and mini */}
      <div
        className={`hidden lg:flex fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex-col z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Desktop Logo Section */}
        <div
          className={`p-4 border-b border-gray-100 flex-shrink-0 ${isOpen ? "" : "px-2"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            {isOpen && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  Boviclouds
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  Farm Management
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className={`flex-1 p-4 overflow-y-auto ${isOpen ? "" : "px-2"}`}>
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${isOpen ? "" : "justify-center"}`}
                  title={!isOpen ? item.label : ""}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {isOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 min-w-0 truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs font-medium rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!isOpen && item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                      {item.badge && (
                        <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Desktop Bottom Section */}
        <div
          className={`p-4 border-t border-gray-100 flex-shrink-0 ${isOpen ? "" : "px-2"}`}
        >
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 transition-colors relative group ${
              isOpen ? "" : "justify-center"
            }`}
            title={!isOpen ? "Notifications" : ""}
          >
            <div className="relative flex-shrink-0">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </div>
            </div>
            {isOpen && <span className="nav-item">Notifications</span>}

            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Notifications (3)
              </div>
            )}
          </div>
        </div>

        {/* Desktop User Profile Section */}
        <div
          className={`p-4 border-b border-gray-100 flex-shrink-0 ${isOpen ? "" : "px-2"}`}
        >
          <div
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
              isOpen ? "" : "justify-center"
            }`}
            onClick={() => isOpen && setIsProfileOpen(!isProfileOpen)}
            title={!isOpen ? "Zakariae Amrani" : ""}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-xs">ZA</span>
            </div>
            {isOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Zakariae Amrani
                  </p>
                  <p className="text-xs text-gray-500 truncate">Farm Manager</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </>
            )}
          </div>

          {isOpen && isProfileOpen && (
            <div className="mt-2 py-1 space-y-1 border-t border-gray-100 pt-2">
              <button
                onClick={() => handleMenuClick("/profile")}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
                Profile
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modern Collapse/Expand Button - Only visible on desktop */}
      {onToggle && (
        <button
          onClick={onToggle}
          className={`hidden lg:flex fixed top-6 z-50 items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-emerald-300 ${
            isOpen ? "left-60" : "left-12"
          }`}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
          )}
        </button>
      )}
    </>
  );
};

export default Sidebar;
