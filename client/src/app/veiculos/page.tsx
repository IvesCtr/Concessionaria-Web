// client/src/app/dashboard/veiculos/page.tsx
import { VehiclesList } from "@/components/VehiclesList";

// Página aberta para desenvolvimento.
// No futuro, podemos adicionar a lógica de proteção como nas outras páginas.
export default function VeiculosPage() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800">Catálogo de Veículos</h1>
        </header>
        <main>
          <VehiclesList />
        </main>
      </div>
    </div>
  );
}
