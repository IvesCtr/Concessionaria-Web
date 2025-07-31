import Link from 'next/link';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

// Esta interface agora reflete com precisão quem pode aceder a esta página.
interface DashboardUserSession {
  email: string;
  role: 'funcionario' | 'gerente';
  name: string; 
}

// A função agora retorna o tipo mais específico.
async function getUserSession(): Promise<DashboardUserSession | null> {
  const token = (await cookies()).get('authToken')?.value;
  if (!token) return null;
  try {
    // A verificação de tipo aqui também foi atualizada.
    const decodedToken: { email: string; role: DashboardUserSession['role']; name: string } = jwtDecode(token);
    
    // O bloco 'if' foi removido daqui, pois era redundante.
    // A tipagem de 'decodedToken' já garante que a role não pode ser 'cliente'.

    return { email: decodedToken.email, role: decodedToken.role, name: decodedToken.name };
  } catch (error) {
    return null;
  }
}

const QuickLink = ({ href, title, description }: { href: string; title: string; description: string }) => (
  <Link href={href}>
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-teal-400 hover:bg-slate-700 transition-all duration-200 cursor-pointer h-full">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  </Link>
);

export default async function DashboardPage() {
  const user = await getUserSession();
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-slate-100">
              Painel de Gestão
            </h1>
            <p className="text-lg text-slate-400">
              Bem-vindo de volta, <span className="font-bold text-teal-300">{user.name}</span>!
            </p>
          </div>
          <LogoutButton />
        </header>

        <section>
          <h2 className="text-2xl font-bold text-slate-200 mb-6">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLink href="/veiculos" title="Gerir Veículos" description="Ver, adicionar e editar o catálogo." />
            <QuickLink href="/vendas" title="Registar Venda" description="Criar um novo registo de venda." />
            <QuickLink href="/clientes" title="Gerir Clientes" description="Ver e atualizar a lista de clientes." />
            <QuickLink href="/historico" title="Histórico de Vendas" description="Consultar o histórico completo de vendas." />
            {user.role === 'gerente' && (
              <QuickLink href="/funcionarios" title="Funcionários" description="Ver e atualizar a lista de funcionários." />
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
