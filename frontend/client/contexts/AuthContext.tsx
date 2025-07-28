import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

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
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    keepLoggedIn?: boolean,
  ) => Promise<boolean>;
  register: (data: any) => Promise<Boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem("user");
      const keepLoggedIn = localStorage.getItem("keep_logged_in");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("user");
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
      setUser(res.data.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("access_token", res.data.data.access_token);
      localStorage.setItem("keep_logged_in", JSON.stringify(keepLoggedIn));
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

    try {
      const res = await axios.post(`${apiUrl}auth/register`, {
        CIN: data.cin,
        email: data.email,
        nom_ar: data.nomArabe,
        prenom_ar: data.prenomArabe,
        nom_lat: data.nomFamille,
        prenom_lat: data.prenom,
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
    localStorage.removeItem("user");
    localStorage.removeItem("keep_logged_in");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
