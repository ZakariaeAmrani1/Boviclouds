import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
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
      const savedUser = localStorage.getItem("boviclouds_user");
      const keepLoggedIn = localStorage.getItem("boviclouds_keep_logged_in");

      if (savedUser && keepLoggedIn === "true") {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("boviclouds_user");
          localStorage.removeItem("boviclouds_keep_logged_in");
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

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock authentication - in real app, this would be an API call
        if (email && password) {
          const mockUser: User = {
            id: "1",
            email: email,
            name: "John Doe",
            role: "Administrator",
          };

          setUser(mockUser);

          if (keepLoggedIn) {
            localStorage.setItem("boviclouds_user", JSON.stringify(mockUser));
            localStorage.setItem("boviclouds_keep_logged_in", "true");
          }

          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
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
      console.log(res);
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
    localStorage.removeItem("boviclouds_user");
    localStorage.removeItem("boviclouds_keep_logged_in");
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
