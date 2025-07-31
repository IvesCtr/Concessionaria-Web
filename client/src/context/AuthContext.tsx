// client/src/context/AuthContext.tsx
"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  sub: string; // ID do usuário
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        const decodedUser: User = jwtDecode(storedToken);
        setUser(decodedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Falha ao decodificar o token:", error);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (accessToken: string) => {
    const decodedUser: User = jwtDecode(accessToken);
    localStorage.setItem('accessToken', accessToken);
    setUser(decodedUser);
    setToken(accessToken);
    // REMOVEMOS O REDIRECIONAMENTO DAQUI.
    // A página de Login agora será responsável por redirecionar
    // ao perceber que o estado 'user' mudou.
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
