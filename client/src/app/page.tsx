import VehicleCard from '@/components/VehicleCard';
import { Vehicle } from '@/types';
import Link from 'next/link';

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const response = await fetch('http://localhost:7654/vehicles', {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar os veículos');
    }
    
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HomePage() {
  const vehicles = await getVehicles();

console.log('Dados recebidos do backend:', vehicles);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
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