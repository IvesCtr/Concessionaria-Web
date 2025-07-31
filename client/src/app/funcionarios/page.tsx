import { EmployeesList } from "@/components/EmployeesList";
// import { PrivateRoute } from "@/components/PrivateRoute"; // Descomente se/quando criar este componente

export default function FuncionariosPage() {
  return (
    // <PrivateRoute allowedRoles={['gerente']}> 
    // Apenas Gerentes devem aceder a esta página.
    // O PrivateRoute seria o componente ideal para reforçar esta segurança no frontend.
      <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-gray-800">Funcionários</h1>
          </header>
          <main>
            <EmployeesList />
          </main>
        </div>
      </div>
    // </PrivateRoute>
  );
}
