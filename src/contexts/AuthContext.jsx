import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // Simulate API call - In production, this would be a real API call
    // Mock users for demo
    const mockUsers = [
      { id: 1, email: 'admin@foodorder.com', password: 'admin123', name: 'Admin User', role: 'admin' },
      { id: 2, email: 'user@foodorder.com', password: 'user123', name: 'Regular User', role: 'user' },
      { id: 3, email: 'test@test.com', password: 'test123', name: 'Test User', role: 'user' }
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password; // Don't store password
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      return { success: false, error: 'Email hoặc mật khẩu không đúng' };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    // Simulate API call
    // Check if email already exists
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const existingUser = JSON.parse(storedUser);
      if (existingUser.email === email) {
        return { success: false, error: 'Email đã được sử dụng' };
      }
    }

    // Create new user with 'user' role by default
    const newUser = {
      id: Date.now(),
      name,
      email,
      role: 'user'
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
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
