// client/src/context/AuthContext.tsx
"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Precisaremos instalar essa biblioteca

// Interface para os dados do usuário extraídos do token
interface User {
  email: string;
  sub: string; // ID do usuário
  role: string;
}

// Interface para o valor do nosso contexto
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

// Criando o contexto com um valor padrão
const AuthContext = createContext<AuthContextType | null>(null);

// O Provedor do Contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Efeito para carregar o token do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      const decodedUser: User = jwtDecode(storedToken);
      setUser(decodedUser);
      setToken(storedToken);
    }
  }, []);

  const login = (accessToken: string) => {
    const decodedUser: User = jwtDecode(accessToken);
    localStorage.setItem('accessToken', accessToken);
    setUser(decodedUser);
    setToken(accessToken);
    router.push('/dashboard'); // Redireciona para um painel após o login
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setToken(null);
    router.push('/login'); // Redireciona para a página de login após o logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}