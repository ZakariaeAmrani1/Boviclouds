import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronDown } from "lucide-react";
import type { UserRole } from "../lib/roleNavigation";

const RoleIndicator: React.FC = () => {
  const { userRole, isAuthenticated } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

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

  const testRoles: UserRole[] = [
    "ADMIN",
    "INSEMINATEUR",
    "IDENTIFICATEUR",
    "CONTROLEUR_LAITIER",
    "RESPONSABLE_LOCAL"
  ];

  const switchRole = (newRole: UserRole) => {
    // Just update the user object in localStorage for testing sidebar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        user.role = newRole;
        localStorage.setItem('user', JSON.stringify(user));
        window.location.reload(); // Reload to apply changes
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <Badge
          className={`${getRoleColor(userRole)} font-medium cursor-pointer flex items-center gap-1`}
          onClick={() => setShowRoleMenu(!showRoleMenu)}
        >
          Rôle: {getRoleDisplayName(userRole)}
          {import.meta.env.DEV && <ChevronDown className="h-3 w-3" />}
        </Badge>

        {import.meta.env.DEV && showRoleMenu && (
          <Card className="absolute top-full mt-2 right-0 w-48">
            <CardContent className="p-2">
              <div className="text-xs text-muted-foreground mb-2">Test des rôles:</div>
              <div className="space-y-1">
                {testRoles.map((role) => (
                  <Button
                    key={role}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-auto py-1"
                    onClick={() => {
                      switchRole(role);
                      setShowRoleMenu(false);
                    }}
                  >
                    {getRoleDisplayName(role)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoleIndicator;
