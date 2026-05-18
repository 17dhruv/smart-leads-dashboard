"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStore } from "../../lib/api";
import type { ApiResponse } from "../../types/api";
import type { AuthPayload, AuthUser, UserRole } from "../../types/auth";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      const token = tokenStore.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<ApiResponse<AuthUser>>("/auth/me");
        setUser(response.data);
      } catch {
        tokenStore.clear();
      } finally {
        setIsLoading(false);
      }
    };

    void hydrateUser();
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const response = await api.post<ApiResponse<AuthPayload>>("/auth/login", input, { auth: false });
    tokenStore.set(response.data.token);
    setUser(response.data.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const response = await api.post<ApiResponse<AuthPayload>>("/auth/register", input, { auth: false });
    tokenStore.set(response.data.token);
    setUser(response.data.user);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
