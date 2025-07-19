import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('medireminder_user');
    const token = localStorage.getItem('medireminder_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('medireminder_users') || '[]');
    const foundUser = users.find((u: any) => u.username === username);
    
    if (foundUser && foundUser.password === password) {
      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        avatar: foundUser.avatar,
        theme: foundUser.theme || 'light',
        createdAt: foundUser.createdAt,
        isAdmin: foundUser.isAdmin || false
      };
      
      setUser(userSession);
      localStorage.setItem('medireminder_user', JSON.stringify(userSession));
      localStorage.setItem('medireminder_token', 'mock_jwt_token_' + foundUser.id);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('medireminder_users') || '[]');
    
    // Check if username exists
    if (users.find((u: any) => u.username === username)) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password, // In real app, this would be hashed
      email: '',
      avatar: '',
      theme: 'light',
      createdAt: new Date().toISOString(),
      isAdmin: username === 'admin' // Make first admin user
    };
    
    users.push(newUser);
    localStorage.setItem('medireminder_users', JSON.stringify(users));
    
    // Auto login after registration
    const userSession = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      theme: newUser.theme,
      createdAt: newUser.createdAt,
      isAdmin: newUser.isAdmin
    };
    
    setUser(userSession);
    localStorage.setItem('medireminder_user', JSON.stringify(userSession));
    localStorage.setItem('medireminder_token', 'mock_jwt_token_' + newUser.id);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medireminder_user');
    localStorage.removeItem('medireminder_token');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('medireminder_user', JSON.stringify(updatedUser));
      
      // Apply theme to document
      if (updates.theme) {
        applyTheme(updates.theme);
      }
      
      // Update in users array too
      const users = JSON.parse(localStorage.getItem('medireminder_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('medireminder_users', JSON.stringify(users));
      }
    }
  };

  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Apply theme on initial load
    if (user?.theme) {
      applyTheme(user.theme);
    }
  }, [user?.theme]);

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};