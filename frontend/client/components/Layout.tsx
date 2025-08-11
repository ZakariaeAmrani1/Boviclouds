import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import RoleTestSwitch from "./RoleTestSwitch";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={toggleSidebar}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <MobileHeader
          onMenuClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        />
        <div className="min-h-screen overflow-y-auto p-4 lg:p-6">
          {/* This is where the routed page content will be rendered */}
          <Outlet />
        </div>
      </div>

      {/* Role test switch for development */}
      <RoleTestSwitch />
    </div>
  );
};

export default Layout;
