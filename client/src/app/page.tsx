import VehicleCard from '@/components/VehicleCard';
import { Vehicle } from '@/types';
import Link from 'next/link';

// Função para buscar os dados da sua API backend
// O Next.js gerencia o cache desta função automaticamente
async function getVehicles(): Promise<Vehicle[]> {
  try {
    // IMPORTANTE: Substitua a URL pela URL do seu backend.
    // Se estiver rodando localmente, pode ser 'http://localhost:3001'
    const response = await fetch('http://localhost:7654/vehicles', {
      next: {
        revalidate: 60, // Opcional: Revalida os dados a cada 60 segundos
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar os veículos');
    }
    
    return response.json();
  } catch (error) {
    console.error(error);
    return []; // Retorna um array vazio em caso de erro
  }
}

export default async function HomePage() {
  const vehicles = await getVehicles();

console.log('Dados recebidos do backend:', vehicles);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Aqui podemos adicionar o Header e a Barra de Busca no futuro */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          {/* A classe mb-6 foi removida daqui */}
          <h1 className="text-3xl font-bold text-gray-800">Veículos em Destaque</h1>
          
          <Link 
            href="/login"
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login de Funcionários
          </Link>
        </div>
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-12">Nenhum veículo encontrado no momento.</p>
        )}
      </div>
    </main>
  );
}