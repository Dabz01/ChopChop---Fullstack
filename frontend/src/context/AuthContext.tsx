'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { authApi, loadAuthTokenFromStorage, setAuthToken } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (phoneOrEmail: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthTokenFromStorage();
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => {
        setUser(null);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (phoneOrEmail: string, password: string) => {
    const res = await authApi.login(phoneOrEmail, password);
    setUser(res.user);
  };

  const register = async (payload: {
    name: string;
    phone: string;
    email?: string;
    password: string;
  }) => {
    const res = await authApi.register(payload);
    setUser(res.user);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
