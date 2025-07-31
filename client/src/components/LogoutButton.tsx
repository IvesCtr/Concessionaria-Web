'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react'; // Adicionando o ícone para consistência

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Chama a nossa API de logout para limpar o cookie
      await fetch('/api/logout');
      
      // Redireciona o utilizador para a página de login
      router.push('/login');
      // Força uma atualização para garantir que o estado do servidor seja limpo
      router.refresh(); 
    } catch (error) {
      console.error("Falha ao fazer logout:", error);
      alert("Não foi possível fazer logout. Tente novamente.");
    }
  };

  return (
    <button 
      onClick={handleLogout}
      // Classes de estilo atualizadas para o tema pastel
      className="flex items-center gap-2 bg-red-200 hover:bg-red-300 text-red-800 font-bold py-2 px-4 rounded-lg transition-colors"
    >
      <LogOut size={18} />
      Sair
    </button>
  );
}
