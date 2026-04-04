'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AdminContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  getAdminPassword: () => string | null;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '2!!9Miche$p';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('adminPassword', password);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('adminPassword');
  };

  const getAdminPassword = () => {
    return isAuthenticated ? ADMIN_PASSWORD : null;
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, getAdminPassword }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
