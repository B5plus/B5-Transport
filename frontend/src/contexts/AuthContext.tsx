import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterRequest } from '../types';
import { authAPI } from '../services/api';
import { APP_CONFIG } from '../config/api';
import { toast } from 'react-toastify';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
      const storedUser = localStorage.getItem(APP_CONFIG.USER_KEY);

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          await authAPI.getProfile();
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
          localStorage.removeItem(APP_CONFIG.USER_KEY);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      setUser(response.user);
      setToken(response.token);
      
      localStorage.setItem(APP_CONFIG.TOKEN_KEY, response.token);
      localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(response.user));
      
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      
      setUser(response.user);
      setToken(response.token);
      
      localStorage.setItem(APP_CONFIG.TOKEN_KEY, response.token);
      localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(response.user));
      
      toast.success('Registration successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
      localStorage.removeItem(APP_CONFIG.USER_KEY);
      toast.success('Logged out successfully');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
