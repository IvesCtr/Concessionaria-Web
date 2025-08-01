'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout');
      
      router.push('/login');
      router.refresh(); 
    } catch (error) {
      console.error("Falha ao fazer logout:", error);
      alert("Não foi possível fazer logout. Tente novamente.");
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-200 hover:bg-red-300 text-red-800 font-bold py-2 px-4 rounded-lg transition-colors"
    >
      <LogOut size={18} />
      Sair
    </button>
  );
}
