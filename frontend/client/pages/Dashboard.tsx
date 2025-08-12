import React from "react";
import { getCurrentUserRole } from "../lib/roleNavigation";

// Import role-specific dashboards
import AdminDashboard from "../components/dashboards/AdminDashboard";
import InseminateurDashboard from "../components/dashboards/InseminateurDashboard";
import IdentificateurDashboard from "../components/dashboards/IdentificateurDashboard";
import ControleurLaitierDashboard from "../components/dashboards/ControleurLaitierDashboard";
import ResponsableLocalDashboard from "../components/dashboards/ResponsableLocalDashboard";
import EleveurDashboard from "../components/dashboards/EleveurDashboard";

const Dashboard: React.FC = () => {
  const currentRole = getCurrentUserRole();

  // Render the appropriate dashboard based on user role
  switch (currentRole) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'INSEMINATEUR':
      return <InseminateurDashboard />;
    case 'IDENTIFICATEUR':
      return <IdentificateurDashboard />;
    case 'CONTROLEUR_LAITIER':
      return <ControleurLaitierDashboard />;
    case 'RESPONSABLE_LOCAL':
      return <ResponsableLocalDashboard />;
    case 'ELEVEUR':
      return <EleveurDashboard />;
    default:
      return <AdminDashboard />; // Fallback to admin dashboard
  }
};

export default Dashboard;
