import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useAPI, setUseAPI] = useState(true); // Flag to use API or fallback to localStorage

  // Load user from localStorage on mount
  useEffect(() => {
    try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
    }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      localStorage.removeItem('user');
    } finally {
    setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      if (useAPI) {
        const result = await authAPI.login(email, password);
        // Backend returns { success: true, token, user } or { error: "..." }
        if (result.token && result.user) {
          setUser(result.user);
          return { success: true, user: result.user };
        } else if (result.error) {
          return { success: false, error: result.error };
        } else {
          return { success: false, error: 'Đăng nhập thất bại' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to localStorage for demo
    const mockUsers = [
      { id: 1, email: 'admin@foodorder.com', password: 'admin123', name: 'Admin User', role: 'admin' },
        { id: 2, email: 'user@foodorder.com', password: 'user123', name: 'Regular User', role: 'user' }
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = { ...foundUser };
        delete userData.password;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
      }
      return { success: false, error: error.message || 'Email hoặc mật khẩu không đúng' };
    }
  };

  // Register function - Only for regular users, not admin
  const register = async (name, email, password) => {
    try {
      if (useAPI) {
        const result = await authAPI.register(name, email, password);
        // Backend returns { success: true, token, user } or { error: "..." }
        if (result.token && result.user) {
          setUser(result.user);
          return { success: true, user: result.user };
        } else if (result.error) {
          return { success: false, error: result.error };
        } else {
          return { success: false, error: 'Đăng ký thất bại' };
        }
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
