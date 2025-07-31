// client/src/app/dashboard/historico/page.tsx
import { SalesHistoryList } from "@/components/SalesHistoryList";

// Deixamos a página sem a lógica de proteção para facilitar o desenvolvimento
export default function HistoricoVendasPage() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800">Histórico de Vendas</h1>
        </header>
        <main>
          <SalesHistoryList />
        </main>
      </div>
    </div>
  );
}
