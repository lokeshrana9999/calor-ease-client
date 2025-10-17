'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { authUtils } from '@/lib/auth';
import { AuthState, LoginRequest, RegisterRequest, User } from '@/lib/types';

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const token = authUtils.getToken();
    const isAuthenticated = authUtils.isAuthenticated();

    setState({
      user: null, // We don't store user data in JWT for this API
      token,
      isAuthenticated,
      isLoading: false,
    });
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.login(data);

      authUtils.setToken(response.token);

      setState({
        user: null, // API doesn't return user data
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success('Login successful!');
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.register(data);

      authUtils.setToken(response.token);

      setState({
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success(response.message || 'Registration successful!');
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authUtils.removeToken();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

