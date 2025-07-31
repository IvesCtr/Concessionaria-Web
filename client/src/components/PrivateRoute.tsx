// client/src/components/PrivateRoute.tsx
"use client";

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Não faz nada enquanto o estado de autenticação está sendo verificado.
    if (isLoading) {
      return;
    }

    // Se o carregamento terminou e não há usuário, redireciona para o login.
    if (!user) {
      router.replace('/login');
      return;
    }

    // Se o usuário existe, mas o papel dele não é permitido, redireciona para uma página segura.
    if (!allowedRoles.includes(user.role)) {
      // Você pode criar uma página de "acesso negado" ou redirecionar para a home do dashboard
      router.replace('/dashboard/vendas'); 
    }
  }, [user, isLoading, router, allowedRoles]);

  // 1. Enquanto está carregando, mostra uma mensagem.
  if (isLoading) {
    return <p className="text-center p-10">Verificando autenticação...</p>;
  }

  // 2. Se o usuário está logado e tem o papel correto, mostra o conteúdo da página.
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // 3. Em todos os outros casos (ex: usuário sem permissão sendo redirecionado), não mostra nada.
  return null;
}
