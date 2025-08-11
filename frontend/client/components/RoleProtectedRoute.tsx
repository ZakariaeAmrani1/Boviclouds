import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { hasAccess } from "../utils/auth";
import { AlertTriangle } from "lucide-react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRoute,
}) => {
  const { userRole, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No role assigned
  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Rôle Non Défini
          </h2>
          <p className="text-gray-600">
            Votre compte n'a pas de rôle assigné. Contactez l'administrateur.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has access to this route
  if (!hasAccess(userRole, requiredRoute)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Accès Refusé
          </h2>
          <p className="text-gray-600">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // User has access, render the children
  return <>{children}</>;
};

export default RoleProtectedRoute;
