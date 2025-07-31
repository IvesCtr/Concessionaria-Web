import Link from 'next/link';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import {
  Car,
  DollarSign,
  Users,
  History,
  UserPlus,
  Home // 1. Importamos o ícone de "Home"
} from 'lucide-react';
// Importamos o seu componente LogoutButton
import { LogoutButton } from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

interface DashboardUserSession {
  email: string;
  role: 'funcionario' | 'gerente';
  name: string; 
}

async function getUserSession(): Promise<DashboardUserSession | null> {
  const token = (await cookies()).get('authToken')?.value;
  if (!token) return null;
  try {
    const decodedToken: { email: string; role: DashboardUserSession['role']; name: string } = jwtDecode(token);
    return { email: decodedToken.email, role: decodedToken.role, name: decodedToken.name };
  } catch (error) {
    return null;
  }
}

const QuickLink = ({ href, title, description, icon }: { href: string; title: string; description: string; icon: ReactNode }) => (
  <Link href={href} className="block group">
    <div className="bg-white p-6 rounded-xl border border-gray-200 group-hover:border-blue-500 group-hover:shadow-lg transition-all duration-300 h-full">
      <div className="flex items-center gap-4 mb-3">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </Link>
);

export default async function DashboardPage() {
  const user = await getUserSession();
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* 2. Criei um container para o título e o novo botão */}
          <div className="flex items-center gap-4">
            {/* 3. Adicionei o botão de voltar para a página inicial */}
            <Link href="http://localhost:3000/" className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg transition-colors">
              <Home size={24} />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Painel de Gestão
              </h1>
              <p className="text-lg text-gray-500 mt-1">
                Bem-vindo, <span className="font-bold text-blue-600">{user.name}</span>!
              </p>
            </div>
          </div>
          <LogoutButton />
        </header>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickLink 
              href="/veiculos" 
              title="Gerir Veículos" 
              description="Ver, adicionar e editar o catálogo." 
              icon={<Car size={24} />}
            />
            <QuickLink 
              href="/vendas" 
              title="Registar Venda" 
              description="Criar um novo registo de venda." 
              icon={<DollarSign size={24} />}
            />
            <QuickLink 
              href="/clientes" 
              title="Gerir Clientes" 
              description="Ver e atualizar a lista de clientes." 
              icon={<Users size={24} />}
            />
            <QuickLink 
              href="/historico" 
              title="Histórico de Vendas" 
              description="Consultar o histórico completo de vendas." 
              icon={<History size={24} />}
            />
            {user.role === 'gerente' && (
              <QuickLink 
                href="/funcionarios" 
                title="Funcionários" 
                description="Ver e atualizar a lista de funcionários" 
                icon={<UserPlus size={24} />}
              />
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
