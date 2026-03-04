import { createContext, useContext, useState, ReactNode } from 'react';

type AdminContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  getAdminPassword: () => string | null;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD || '2!!9Miche$p';

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
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
