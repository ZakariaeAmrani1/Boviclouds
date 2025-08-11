import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { getCurrentUserRole } from "../lib/roleNavigation";
import type { UserRole } from "../lib/roleNavigation";
import { ChevronDown, ChevronUp } from "lucide-react";

const RoleTestSwitch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentRole = getCurrentUserRole();

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const roles: { role: UserRole; label: string; description: string }[] = [
    { role: "ADMIN", label: "Admin", description: "Toutes les pages" },
    { role: "INSEMINATEUR", label: "Inseminateur", description: "Dashboard, Inséminations, Semences" },
    { role: "IDENTIFICATEUR", label: "Identificateur", description: "Dashboard, Identifications, Rebouclage" },
    { role: "CONTROLEUR_LAITIER", label: "Contrôleur Laitier", description: "Dashboard, Lactations" },
    { role: "RESPONSABLE_LOCAL", label: "Responsable Local", description: "Toutes les pages" },
  ];

  const setTestRole = (role: UserRole) => {
    localStorage.setItem('test_role', role);
    window.location.reload(); // Reload to apply changes
  };

  const clearTestRole = () => {
    localStorage.removeItem('test_role');
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Test Rôles</CardTitle>
              <Badge variant="outline" className="text-xs">
                Actuel: {currentRole}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {isOpen && (
          <CardContent className="pt-0 space-y-2">
            {roles.map((roleInfo) => (
              <Button
                key={roleInfo.role}
                variant={currentRole === roleInfo.role ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => setTestRole(roleInfo.role)}
              >
                <div>
                  <div className="font-medium text-xs">{roleInfo.label}</div>
                  <div className="text-xs opacity-70">{roleInfo.description}</div>
                </div>
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={clearTestRole}
            >
              Réinitialiser
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default RoleTestSwitch;
