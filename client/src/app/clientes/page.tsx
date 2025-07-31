// client/src/app/dashboard/clientes/page.tsx
import { PrivateRoute } from "@/components/PrivateRoute";
import { ClientsList } from "@/components/ClientsList";

export default function ClientesPage() {
  return (
    // <PrivateRoute allowedRoles={['FUNCIONARIO', 'GERENTE']}> // LINHA COMENTADA
      <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-gray-800">Clientes</h1>
          </header>
          <main>
            <ClientsList />
          </main>
        </div>
      </div>
    // </PrivateRoute> // LINHA COMENTADA
  );
}