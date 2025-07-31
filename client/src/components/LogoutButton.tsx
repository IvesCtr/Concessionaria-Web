'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Chama a nossa API de logout
      await fetch('/api/logout');
      
      // Redireciona o utilizador para a página de login
      router.push('/login');
      // Força uma atualização do estado do router para garantir que a sessão é limpa
      router.refresh(); 
    } catch (error) {
      console.error("Falha ao fazer logout:", error);
      alert("Não foi possível fazer logout. Tente novamente.");
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
    >
      Logout
    </button>
  );
}
