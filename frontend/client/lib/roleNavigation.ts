import {
  Home,
  Activity,
  FileSearch,
  Zap,
  FlaskConical,
  Milk,
  Building2,
  Users,
  Camera,
  Stethoscope,
  Calendar,
  Shield,
  FileText,
  Settings,
} from "lucide-react";

export interface MenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: string | null;
}

export type UserRole = 'ADMIN' | 'INSEMINATEUR' | 'IDENTIFICATEUR' | 'CONTROLEUR_LAITIER' | 'RESPONSABLE_LOCAL';

// Define all available menu items
const allMenuItems: MenuItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/",
    badge: null,
  },
  {
    icon: Activity,
    label: "Rebouclage",
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
    icon: Zap,
    label: "Insémination",
    path: "/insemination",
    badge: null,
  },
  {
    icon: FlaskConical,
    label: "Semences",
    path: "/semences",
    badge: null,
  },
  {
    icon: Milk,
    label: "Lactations",
    path: "/lactations",
    badge: null,
  },
  {
    icon: Building2,
    label: "Exploitations",
    path: "/exploitations",
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
];

// Define which pages each role can access
const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: [
    "/",
    "/rebouclage",
    "/identification",
    "/insemination",
    "/semences",
    "/lactations",
    "/exploitations",
    "/utilisateurs",
    "/cctv",
    "/traitement",
    "/planning",
    "/health",
    "/documents",
    "/settings",
  ],
  INSEMINATEUR: [
    "/",
    "/insemination",
    "/semences",
  ],
  IDENTIFICATEUR: [
    "/",
    "/identification",
    "/rebouclage",
  ],
  CONTROLEUR_LAITIER: [
    "/",
    "/lactations",
  ],
  RESPONSABLE_LOCAL: [
    "/",
    "/rebouclage",
    "/identification",
    "/insemination",
    "/semences",
    "/lactations",
    "/exploitations",
    "/utilisateurs",
    "/cctv",
    "/traitement",
    "/planning",
    "/health",
    "/documents",
    "/settings",
  ],
};

export const getMenuItemsForRole = (role: UserRole | null): MenuItem[] => {
  if (!role) {
    // Return only dashboard for unauthenticated users
    return allMenuItems.filter(item => item.path === "/");
  }

  const allowedPaths = rolePermissions[role] || ["/"];
  
  return allMenuItems.filter(item => allowedPaths.includes(item.path));
};

export const canAccessPath = (role: UserRole | null, path: string): boolean => {
  if (!role) {
    return path === "/" || path === "/login" || path === "/register";
  }

  const allowedPaths = rolePermissions[role] || ["/"];
  return allowedPaths.includes(path);
};
