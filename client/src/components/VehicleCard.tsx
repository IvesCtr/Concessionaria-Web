import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/types'; // Importando nosso tipo

type VehicleCardProps = {
  vehicle: Vehicle;
};

// Função para formatar o preço para o padrão brasileiro (R$)
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/veiculos/${vehicle.id}`} className="block rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative w-full h-48">
        <Image
          src={vehicle.imagemUrl}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">{vehicle.marca.toUpperCase()} {vehicle.modelo.toUpperCase()}</h2>

        <p className="text-2xl font-extrabold text-gray-900 mt-4">
          {formatPrice(vehicle.preco)}
        </p>

        <p className="text-xs text-gray-400 mt-4">
          Fortaleza - CE
        </p>
      </div>
    </Link>
  );
}