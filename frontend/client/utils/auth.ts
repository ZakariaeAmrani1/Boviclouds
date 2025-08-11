/**
 * JWT token utilities for role-based access control
 */

import { UtilisateurRole } from "@shared/utilisateur";

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Decode JWT token without verification (for client-side role extraction)
 * Note: This is safe because the token was already verified by the server
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Get user role from JWT token
 */
export const getUserRoleFromToken = (): string | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.role || null;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);
    if (!payload) return true;

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

/**
 * Role-based navigation configuration
 */
export const ROLE_NAVIGATION: Record<string, string[]> = {
  ADMIN: [
    "dashboard",
    "rebouclage",
    "identification",
    "insemination",
    "semences",
    "lactations",
    "exploitations",
    "utilisateurs",
    "cctv",
    "traitement",
    "profile",
  ],
  INSEMINATEUR: ["dashboard", "insemination", "semences", "profile"],
  IDENTIFICATEUR: ["dashboard", "identification", "rebouclage", "profile"],
  CONTROLEUR_LAITIER: ["dashboard", "lactations", "profile"],
  ELEVEUR: ["dashboard", "cctv", "profile"],
  RESPONSABLE_LOCAL: [
    "dashboard",
    "rebouclage",
    "identification",
    "insemination",
    "semences",
    "lactations",
    "exploitations",
    "utilisateurs",
    "cctv",
    "traitement",
    "profile",
  ],
};

/**
 * Check if user has access to a specific route
 */
export const hasAccess = (role: string, route: string): boolean => {
  const allowedRoutes = ROLE_NAVIGATION[role] || [];
  return allowedRoutes.includes(route);
};

/**
 * Get allowed navigation items based on user role
 */
export const getAllowedNavigation = (role: string): string[] => {
  return ROLE_NAVIGATION[role] || [];
};

/**
 * Map routes to roles for easy checking
 */
export const ROUTE_ROLE_MAP: Record<string, string[]> = {
  dashboard: [
    "Administrateur",
    "Inseminateur",
    "Identificateur",
    "Contrôleur",
    "Éleveur",
    "Résponsable Local",
  ],
  rebouclage: ["Administrateur", "Identificateur", "Résponsable Local"],
  identification: ["Administrateur", "Identificateur", "Résponsable Local"],
  insemination: ["Administrateur", "Inseminateur", "Résponsable Local"],
  semences: ["Administrateur", "Inseminateur", "Résponsable Local"],
  lactations: ["Administrateur", "Contrôleur", "Résponsable Local"],
  exploitations: ["Administrateur", "Résponsable Local"],
  utilisateurs: ["Administrateur", "Résponsable Local"],
  cctv: ["Administrateur", "Éleveur", "Résponsable Local"],
  traitement: ["Administrateur", "Résponsable Local"],
  profile: [
    "Administrateur",
    "Inseminateur",
    "Identificateur",
    "Contrôleur",
    "Éleveur",
    "Résponsable Local",
  ],
};
