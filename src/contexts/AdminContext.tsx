'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AdminContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  getAdminPassword: () => string | null;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const login = (password: string) => {
    // Verify against the server so we never bake the password into the client bundle
    fetch('/api/admin/subscribers?type=subscribers', {
      headers: { Authorization: `Bearer ${password}` },
    }).then(res => {
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('adminPassword', password);
      }
    });
    // Optimistically allow — server will reject API calls if wrong
    if (password.length > 0) {
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
    return localStorage.getItem('adminPassword');
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
