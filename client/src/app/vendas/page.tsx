// client/src/app/dashboard/vendas/page.tsx
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { PrivateRoute } from "@/components/PrivateRoute";
import { SalesForm } from "@/components/SalesForm";

export default function VendasPage() {
  return (
    // <PrivateRoute allowedRoles={['FUNCIONARIO', 'GERENTE']}> // LINHA COMENTADA
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Registrar Nova Venda</h1>
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 py-2 px-4 bg-blue-100 text-blue-800 font-semibold rounded-md hover:bg-blue-200 transition-colors"
        >
          <LayoutDashboard size={20} />
          Voltar ao Dashboard
        </Link>
      </header>

      <main className="w-full max-w-4xl">
        <SalesForm />
      </main>
    </div>

    // </PrivateRoute> // LINHA COMENTADA
  );
}