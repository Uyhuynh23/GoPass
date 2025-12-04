// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import authService, {
  LoginReq,
  RegisterReq,
  User,
} from "@/services/auth.service";
import { setAuthToken } from "@/services/apiClient";
import { AUTH_STORAGE_KEY } from "@/utils/constants";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (p: LoginReq) => Promise<{ ok: boolean; message?: string }>;
  register: (p: RegisterReq) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved auth from localStorage on mount (client-side only)
  useEffect(() => {
    setIsMounted(true);

    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.user && parsed.accessToken) {
            setUser(parsed.user);
            setAccessToken(parsed.accessToken);
            setRefreshToken(parsed.refreshToken || null);
            setAuthToken(parsed.accessToken);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load auth from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save auth to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      if (user && accessToken) {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ user, accessToken, refreshToken })
        );
      }
    }
  }, [user, accessToken, refreshToken, isMounted]);

  const clearError = () => setError(null);

  const login = async (payload: LoginReq) => {
    try {
      setError(null);
      const res = await authService.login(payload);

      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      setAuthToken(res.accessToken);
      setUser(res.user);

      return { ok: true };
    } catch (err: any) {
      const msg = err?.message || "Đăng nhập thất bại";
      setError(msg);
      return { ok: false, message: msg };
    }
  };

  const register = async (payload: RegisterReq) => {
    try {
      setError(null);
      const res = await authService.register(payload);

      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      setAuthToken(res.accessToken);
      setUser(res.user);

      return { ok: true };
    } catch (err: any) {
      const msg = err?.message || "Đăng ký thất bại";
      setError(msg);
      return { ok: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setAuthToken(null);
      setError(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  };

  const refreshMe = async () => {
    try {
      const user = await authService.me();
      setUser(user);
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        error,
        login,
        register,
        logout,
        refreshMe,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
