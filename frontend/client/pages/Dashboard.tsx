import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { UtilisateurRole } from "@shared/utilisateur";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import EleveurDashboard from "../components/dashboards/EleveurDashboard";
import InseminateurDashboard from "../components/dashboards/InseminateurDashboard";
import { AlertTriangle } from "lucide-react";

// Component to render appropriate dashboard based on user role
const Dashboard = () => {
  const { userRole } = useAuth();

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case UtilisateurRole.ADMINISTRATEUR:
      case UtilisateurRole.RESPONSABLE:
        return <AdminDashboard />;

      case UtilisateurRole.ELEVEUR:
        return <EleveurDashboard />;

      case UtilisateurRole.INSEMINATEUR:
        return <InseminateurDashboard />;

      case UtilisateurRole.IDENTIFICATEUR:
      case UtilisateurRole.CONTROLEUR:
        // For now, these roles use the admin dashboard
        // You can create specific dashboards later
        return <AdminDashboard />;

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Accès Restreint
              </h2>
              <p className="text-gray-600">
                Votre rôle ne vous permet pas d'accéder au tableau de bord.
              </p>
            </div>
          </div>
        );
    }
  };

  return renderDashboard();
};

export default Dashboard;
