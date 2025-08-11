import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "./ui/badge";

const RoleIndicator: React.FC = () => {
  const { userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "INSEMINATEUR":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IDENTIFICATEUR":
        return "bg-green-100 text-green-800 border-green-200";
      case "CONTROLEUR_LAITIER":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "RESPONSABLE_LOCAL":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleDisplayName = (role: string | null) => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "INSEMINATEUR":
        return "Inseminateur";
      case "IDENTIFICATEUR":
        return "Identificateur";
      case "CONTROLEUR_LAITIER":
        return "Contrôleur Laitier";
      case "RESPONSABLE_LOCAL":
        return "Responsable Local";
      default:
        return "Utilisateur";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge className={`${getRoleColor(userRole)} font-medium`}>
        Rôle: {getRoleDisplayName(userRole)}
      </Badge>
    </div>
  );
};

export default RoleIndicator;
