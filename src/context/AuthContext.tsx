"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/api';
import { apiService } from '@/services/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    // Listen for unauthorized 401 errors from API
    apiService.onUnauthorized(() => {
      setUser(null);
      localStorage.removeItem('user');
      router.push('/login');
    });

    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setLoading(false);
          return;
        }

        // Try to refresh token on mount to restore session
        const token = await apiService.refreshToken();
        if (token) {
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem('user');
          setUser(null);
          router.push('/login');
        }
      } catch (error: any) {
        console.error('Failed to restore session:', error);
        // Only wipe if definitively unauthorized
        if (error.response?.status === 401 || error.response?.status === 400) {
          localStorage.removeItem('user');
          setUser(null);
          router.push('/login');
        } else {
          // Transient error: keep the user state so the UI doesn't flicker/logout
          const storedUser = localStorage.getItem('user');
          if (storedUser) setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  const login = async (data: any) => {
    const response = await apiService.login(data);
    const userData = response.user;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/');
  };

  const register = async (data: any) => {
    await apiService.register(data);
    // After registration, usually login or redirect to login
    router.push('/login');
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      apiService.setAccessToken(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
