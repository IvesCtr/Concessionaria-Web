import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/types';
import { ArrowLeft, Calendar, Palette, CheckCircle, XCircle } from 'lucide-react';

async function getVehicleDetails(id: string): Promise<Vehicle | null> {
  try {
    const response = await fetch(`http://localhost:7654/vehicles/${id}`, {
      cache: 'no-store', 
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Falha ao buscar os detalhes do veículo');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleDetails(params.id);

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Veículo não encontrado</h1>
        <p className="text-gray-600 mb-8">O veículo que você está procurando não existe ou foi removido.</p>
        <Link href="/" className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          <ArrowLeft size={20} />
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const isAvailable = vehicle.status === 'disponivel';

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 text-lg">
          <ArrowLeft size={22} />
          Voltar para a lista
        </Link>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative w-full h-96 lg:h-auto min-h-[400px]">
              <Image
                src={vehicle.imagemUrl}
                alt={`${vehicle.marca} ${vehicle.modelo}`}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>

            <div className="lg:col-span-5 p-10 md:p-12 flex flex-col">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{vehicle.marca} {vehicle.modelo}</h1>
              
              <p className="text-4xl font-light text-gray-800 mt-6 mb-8">
                {formatCurrency(vehicle.preco)}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-gray-700 mb-8 text-lg">
                <div className="flex items-center gap-3">
                  <Calendar size={22} />
                  <span>Ano: <strong>{vehicle.ano}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <Palette size={22} />
                  <span>Cor: <strong>{vehicle.cor}</strong></span>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  {isAvailable ? 
                    <CheckCircle size={22} className="text-green-500" /> : 
                    <XCircle size={22} className="text-red-500" />
                  }
                  <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {isAvailable ? 'Disponível' : 'Vendido'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-8 mt-auto flex-grow flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {isAvailable ? "Interessado neste veículo?" : "Este veículo já foi vendido"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {isAvailable 
                    ? "Entre em contato com um de nossos vendedores para mais informações e para agendar um test-drive."
                    : "Mas não se preocupe, temos outras ótimas opções em nosso catálogo esperando por você!"
                  }
                </p>
                {/* Lógica condicional para o botão */}
                <button 
                  disabled={!isAvailable}
                  className={`w-full mt-auto font-bold py-4 px-6 rounded-lg transition-colors text-lg ${
                    isAvailable 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAvailable ? 'Tenho Interesse!' : 'Vendido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
