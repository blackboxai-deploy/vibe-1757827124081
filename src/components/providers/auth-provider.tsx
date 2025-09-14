"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  employeeId?: string;
  email: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  avatar?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
}

interface LoginCredentials {
  employeeId?: string;
  email?: string;
  phone?: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage/session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("coden_token");
        if (token) {
          // Verify token and get user data
          const response = await fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            localStorage.removeItem("coden_token");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("coden_token", data.token);
        toast.success(`Selamat datang, ${data.user.name}!`);
        return true;
      } else {
        const error = await response.json();
        toast.error(error.message || "Login gagal");
        return false;
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login");
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Redirect to Google OAuth
      window.location.href = "/api/auth/google";
      return true;
    } catch (error) {
      toast.error("Terjadi kesalahan saat login dengan Google");
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      localStorage.removeItem("coden_token");
      toast.success("Berhasil logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("coden_token")}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        toast.success("Profil berhasil diperbarui");
        return true;
      } else {
        toast.error("Gagal memperbarui profil");
        return false;
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui profil");
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  allowedRoles?: ("ADMIN" | "STAFF" | "CUSTOMER")[]
) {
  return function AuthenticatedComponent(props: T) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Akses Terbatas
            </h2>
            <p className="text-gray-600 mb-6">
              Anda harus login untuk mengakses halaman ini.
            </p>
            <button
              onClick={() => window.location.href = "/admin/login"}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Akses Ditolak
            </h2>
            <p className="text-gray-600">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}