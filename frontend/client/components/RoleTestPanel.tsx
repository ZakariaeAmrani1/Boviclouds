import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { setTestRole } from "../lib/roleTestUtils";
import type { UserRole } from "../lib/roleNavigation";
import { ChevronDown, ChevronUp } from "lucide-react";

const RoleTestPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  const roles: { role: UserRole | null; label: string; description: string }[] = [
    { role: null, label: "Déconnecté", description: "Aucun rôle" },
    { role: "ADMIN", label: "Admin", description: "Accès à toutes les pages" },
    { role: "INSEMINATEUR", label: "Inseminateur", description: "Dashboard, Inséminations, Semences" },
    { role: "IDENTIFICATEUR", label: "Identificateur", description: "Dashboard, Identifications, Rebouclage" },
    { role: "CONTROLEUR_LAITIER", label: "Contrôleur Laitier", description: "Dashboard, Lactations" },
    { role: "RESPONSABLE_LOCAL", label: "Responsable Local", description: "Accès complet comme Admin" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Test des Rôles</CardTitle>
              <Badge variant="outline" className="text-xs">Dev Mode</Badge>
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
          <CardContent className="pt-0">
            <div className="space-y-2">
              {roles.map((roleInfo) => (
                <div key={roleInfo.role || 'logout'} className="space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => setTestRole(roleInfo.role)}
                  >
                    <div>
                      <div className="font-medium text-xs">{roleInfo.label}</div>
                      <div className="text-xs text-muted-foreground">{roleInfo.description}</div>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Cliquez sur un rôle pour simuler la connexion avec ce rôle.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default RoleTestPanel;
