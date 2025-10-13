import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALLOWED_EMAILS = [
  'enzo.tomas@grupoboticario.com.br',
  'etiqlogba@grupoboticario.com.br',
  'andersono@grupoboticario.com.br',
  'lukas.rodrigues@grupoboticario.com.br',
  'deleon@grupoboticario.com.br',
  'juriti@grupoboticario.com.br',
  'normaf@grupoboticario.com.br',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail && ALLOWED_EMAILS.includes(savedEmail)) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
    }
  }, []);

  const login = (email: string): boolean => {
    if (ALLOWED_EMAILS.includes(email.toLowerCase())) {
      setIsAuthenticated(true);
      setUserEmail(email);
      localStorage.setItem('userEmail', email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};