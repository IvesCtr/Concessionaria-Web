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
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace('/dashboard/vendas'); 
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) {
    return <p className="text-center p-10">Verificando autenticação...</p>;
  }

  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return null;
}
