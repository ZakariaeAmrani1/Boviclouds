import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserRoleFromToken, isTokenExpired } from "../utils/auth";
import { UtilisateurRole } from "@shared/utilisateur";

interface User {
  CIN: string;
  email: string;
  nom_ar: string;
  prenom_ar: string;
  nom_lat: string;
  prenom_lat: string;
  civilite: string;
  adresse: string;
  region: string;
  province: string;
  password: string;
  raison_sociale: "";
  role?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  login: (
    email: string,
    password: string,
    keepLoggedIn?: boolean,
  ) => Promise<boolean>;
  register: (data: any) => Promise<Boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasAccess: (route: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("access_token");
      const keepLoggedIn = localStorage.getItem("keep_logged_in");

      if (savedUser && accessToken) {
        try {
          // Check if token is expired
          if (isTokenExpired(accessToken)) {
            // Token expired, clear everything
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            localStorage.removeItem("keep_logged_in");
            setIsLoading(false);
            return;
          }

          const userData = JSON.parse(savedUser);
          const role = getUserRoleFromToken();

          setUser(userData);
          setUserRole(role);
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("keep_logged_in");
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (
    email: string,
    password: string,
    keepLoggedIn = false,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${apiUrl}auth/login`, {
        email: email,
        password: password,
      });

      const userData = res.data.data.user;
      const accessToken = res.data.data.access_token;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("keep_logged_in", JSON.stringify(keepLoggedIn));

      // Extract role from JWT token
      const role = getUserRoleFromToken();
      setUserRole(role[0]);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error posting data:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (data: any): Promise<Boolean> => {
    setIsLoading(true);
    console.log(data);
    try {
      const res = await axios.post(`${apiUrl}auth/register`, {
        CIN: data.cin,
        email: data.email,
        nom_ar: data.nomArabe,
        prenom_ar: data.prenomArabe,
        nom_lat: data.nomFamille,
        prenom_lat: data.prenom,
        telephone: data.telephone,
        civilite: data.civilite,
        adresse: data.adresse,
        region: data.region,
        province: data.province,
        password: data.motDePasse,
        raison_sociale: "",
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error posting data:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("keep_logged_in");
  };

  // Check if user has access to a specific route
  const hasAccess = (route: string): boolean => {
    if (!userRole) return false;

    const { hasAccess: hasRouteAccess } = require("../utils/auth");
    return hasRouteAccess(userRole, route);
  };

  const value: AuthContextType = {
    user,
    userRole,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
    hasAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
