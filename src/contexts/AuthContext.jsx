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
    try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
    } finally {
    setLoading(false);
    }
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

    // Check in mock users first
    let foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    // If not found, check in localStorage users
    if (!foundUser) {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        foundUser = storedUsers.find(u => u.email === email);
        // Note: In real app, password should be hashed and verified
        // For demo, we'll just check if user exists (password check would be done server-side)
        if (foundUser) {
          // For demo purposes, accept any password for registered users
          // In production, this should verify hashed password
        }
      } catch (error) {
        console.error('Error reading users from localStorage:', error);
        return { success: false, error: 'Đã xảy ra lỗi khi đọc dữ liệu. Vui lòng thử lại.' };
      }
    }
    
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

  // Register function - Only for regular users, not admin
  const register = async (name, email, password) => {
    try {
    // Simulate API call
      // Check if email already exists in mock users or localStorage
      const mockUsers = [
        { id: 1, email: 'admin@foodorder.com', password: 'admin123', name: 'Admin User', role: 'admin' },
        { id: 2, email: 'user@foodorder.com', password: 'user123', name: 'Regular User', role: 'user' },
        { id: 3, email: 'test@test.com', password: 'test123', name: 'Test User', role: 'user' }
      ];

      // Check in mock users
      const existsInMock = mockUsers.find(u => u.email === email);
      if (existsInMock) {
        return { success: false, error: 'Email đã được sử dụng' };
      }

      // Check in localStorage users
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existsInStored = storedUsers.find(u => u.email === email);
      if (existsInStored) {
        return { success: false, error: 'Email đã được sử dụng' };
    }

      // Create new user with 'user' role by default (never admin)
    const newUser = {
      id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'user' // Always 'user', never 'admin'
    };

      // Save to users list
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Set as current user
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, error: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.' };
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
