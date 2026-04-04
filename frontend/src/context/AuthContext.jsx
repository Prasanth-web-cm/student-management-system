import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const savedUserData = localStorage.getItem('user');
        if (savedUserData && savedUserData !== 'undefined') {
          const savedUser = JSON.parse(savedUserData);
          if (savedUser) {
            setUser(savedUser);
          }
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      // Clean up corrupted storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const login = async (role, credentials) => {
    try {
      const endpoint = role === 'admin' ? '/api/auth/admin/login' : '/api/auth/student/login';
      const response = await axios.post(`${API_BASE}${endpoint}`, credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
