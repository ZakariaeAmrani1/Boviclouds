import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { canAccessPath } from "../lib/roleNavigation";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has permission to access this route
  if (!canAccessPath(userRole, location.pathname)) {
    // Redirect to dashboard if no permission
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
