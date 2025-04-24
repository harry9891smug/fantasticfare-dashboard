"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  mobile_number?: string;
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/auth");
  }, [router]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse user data", error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [logout]);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    router.push("/dashboard");
  }, [router]);

  useEffect(() => {
    if (loading) return; // Wait until auth check completes

    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === "/auth";

    if (isAuthenticated === false && !isAuthPage) {
      router.push("/auth");
    } else if (isAuthenticated === true && isAuthPage) {
      router.push("/dashboard");
    }
    // No redirect if isAuthenticated is null or paths match
  }, [isAuthenticated, loading, router]);

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};