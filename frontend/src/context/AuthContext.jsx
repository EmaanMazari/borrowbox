import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bookbazar_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('/auth/profile/');
          setUser(res.data);
          localStorage.setItem('bookbazar_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Failed to verify existing session:', err);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login/', { username, password });
    const { user: userData, tokens } = res.data;
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('bookbazar_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register/', formData);
    const { user: userData, tokens } = res.data;
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('bookbazar_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('bookbazar_user');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.patch('/auth/profile/', data);
    setUser(res.data);
    localStorage.setItem('bookbazar_user', JSON.stringify(res.data));
    return res.data;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.is_staff || user?.is_superuser,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
