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
} from "lucide-react";

export interface MenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: string | null;
}

export type UserRole = 'ADMIN' | 'INSEMINATEUR' | 'IDENTIFICATEUR' | 'CONTROLEUR_LAITIER' | 'RESPONSABLE_LOCAL' | 'ELEVEUR';

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
  ],
  ELEVEUR: [
    "/",
    "/cctv",
  ],
};

// Simple function to get current user role from localStorage without JWT interference
export const getCurrentUserRole = (): UserRole => {
  try {
    // For testing, check if there's a test role set
    const testRole = localStorage.getItem('test_role');
    if (testRole && ['ADMIN', 'INSEMINATEUR', 'IDENTIFICATEUR', 'CONTROLEUR_LAITIER', 'RESPONSABLE_LOCAL', 'ELEVEUR'].includes(testRole)) {
      return testRole as UserRole;
    }

    // Try to get role from user object in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role && ['ADMIN', 'INSEMINATEUR', 'IDENTIFICATEUR', 'CONTROLEUR_LAITIER', 'RESPONSABLE_LOCAL', 'ELEVEUR'].includes(user.role)) {
          return user.role as UserRole;
        }
      } catch (error) {
        console.error('Error parsing saved user for role:', error);
      }
    }

    // Default to ADMIN for now until backend provides role
    return 'ADMIN';
  } catch (error) {
    console.error('Error getting current user role:', error);
    return 'ADMIN';
  }
};

export const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
  const allowedPaths = rolePermissions[role] || ["/"];
  return allMenuItems.filter(item => allowedPaths.includes(item.path));
};
