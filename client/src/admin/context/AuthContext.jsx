import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setAdmin(data.data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleExpired = () => setSessionExpired(true);
    window.addEventListener('session-expired', handleExpired);
    return () => window.removeEventListener('session-expired', handleExpired);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const { data } = await api.post('/auth/login', { email, password, rememberMe });
    setAdmin(data.data.admin);
    setSessionExpired(false);
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setAdmin(null);
  };

  const dismissSessionExpired = () => setSessionExpired(false);

  return (
    <AuthContext.Provider
      value={{ admin, loading, login, logout, sessionExpired, dismissSessionExpired, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
