// client/src/app/dashboard/clientes/page.tsx
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { ClientsList } from "@/components/ClientsList";

export default function ClientesPage() {
  return (
    // <PrivateRoute allowedRoles={['FUNCIONARIO', 'GERENTE']}> // LINHA COMENTADA
      <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-5xl font-bold text-gray-800">Clientes</h1>
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 py-2 px-4 bg-blue-100 text-blue-800 font-semibold rounded-md hover:bg-blue-200 transition-colors"
            >
              <LayoutDashboard size={20} />
              Voltar ao Dashboard
            </Link>
          </header>
          <main>
            <ClientsList />
          </main>
        </div>
      </div>
    // </PrivateRoute> // LINHA COMENTADA
  );
}
