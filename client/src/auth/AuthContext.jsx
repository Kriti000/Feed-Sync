import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/check', { withCredentials: true });
      if (res.data.authenticated) {
        setIsAuthenticated(true);
        setUser(res.data.user);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });
      if (res.data.success) {
        setIsAuthenticated(true);
        setUser(res.data.user);
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value = { isAuthenticated, user, login, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
