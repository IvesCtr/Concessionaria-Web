// client/src/app/dashboard/vendas/page.tsx
import { PrivateRoute } from "@/components/PrivateRoute";
import { SalesForm } from "@/components/SalesForm";

export default function VendasPage() {
  return (
    // <PrivateRoute allowedRoles={['FUNCIONARIO', 'GERENTE']}> // LINHA COMENTADA
      <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4 sm:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Registrar Nova Venda</h1>
        </header>
        <main className="w-full max-w-4xl">
          <SalesForm />
        </main>
      </div>
    // </PrivateRoute> // LINHA COMENTADA
  );
}