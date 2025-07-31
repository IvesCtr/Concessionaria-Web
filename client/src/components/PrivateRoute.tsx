// client/src/components/PrivateRoute.tsx
"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user, token } = useAuth();
  const router = useRouter();

  // Se ainda estiver carregando o estado de autenticação, pode mostrar um loader
  if (!token && typeof window !== 'undefined') {
    // Redireciona apenas no lado do cliente após a verificação inicial
    router.replace('/login');
    return <p>Redirecionando para o login...</p>; 
  }

  // Se não há usuário ou o papel do usuário não está na lista de permitidos
  if (!user || !allowedRoles.includes(user.role)) {
    // Pode redirecionar para uma página de "acesso negado" ou para o login
    router.replace('/login'); 
    return <p>Acesso negado. Redirecionando...</p>;
  }

  // Se tudo estiver OK, mostra a página
  return <>{children}</>;
}