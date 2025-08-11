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
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get user role from JWT token
 */
export const getUserRoleFromToken = (): string | null => {
  const token = localStorage.getItem('access_token');
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
  [UtilisateurRole.ADMINISTRATEUR]: [
    'dashboard', 'rebouclage', 'identification', 'insemination', 'semences', 
    'lactations', 'exploitations', 'utilisateurs', 'cctv', 'traitement', 'profile'
  ],
  [UtilisateurRole.INSEMINATEUR]: [
    'dashboard', 'insemination', 'semences', 'profile'
  ],
  [UtilisateurRole.IDENTIFICATEUR]: [
    'dashboard', 'identification', 'rebouclage', 'profile'
  ],
  [UtilisateurRole.CONTROLEUR]: [
    'dashboard', 'lactations', 'profile'
  ],
  [UtilisateurRole.ELEVEUR]: [
    'dashboard', 'cctv', 'profile'
  ],
  [UtilisateurRole.RESPONSABLE]: [
    'dashboard', 'rebouclage', 'identification', 'insemination', 'semences', 
    'lactations', 'exploitations', 'utilisateurs', 'cctv', 'traitement', 'profile'
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
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.INSEMINATEUR,
    UtilisateurRole.IDENTIFICATEUR,
    UtilisateurRole.CONTROLEUR,
    UtilisateurRole.ELEVEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  rebouclage: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.IDENTIFICATEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  identification: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.IDENTIFICATEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  insemination: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.INSEMINATEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  semences: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.INSEMINATEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  lactations: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.CONTROLEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  exploitations: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  utilisateurs: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  cctv: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.ELEVEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  traitement: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.RESPONSABLE,
  ],
  profile: [
    UtilisateurRole.ADMINISTRATEUR,
    UtilisateurRole.INSEMINATEUR,
    UtilisateurRole.IDENTIFICATEUR,
    UtilisateurRole.CONTROLEUR,
    UtilisateurRole.ELEVEUR,
    UtilisateurRole.RESPONSABLE,
  ],
};
