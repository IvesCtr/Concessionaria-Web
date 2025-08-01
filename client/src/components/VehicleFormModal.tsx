// client/src/components/VehicleFormModal.tsx
"use client";

import { useState } from 'react';
import { Vehicle } from '@/types';

// Tipo para os dados de criação de um novo veículo
export type NewVehiclePayload = Omit<Vehicle, 'id'>;

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newVehicleData: NewVehiclePayload) => Promise<void>;
}

export function VehicleFormModal({ isOpen, onClose, onSave }: VehicleFormModalProps) {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState<number | ''>('');
  const [cor, setCor] = useState('');
  const [preco, setPreco] = useState<number | ''>('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [status, setStatus] = useState<'disponivel' | 'vendido'>('disponivel');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ano || !preco) return; // Validação simples
    setLoading(true);
    setError(null);

    try {
      await onSave({ marca, modelo, ano, cor, preco, imagemUrl, status });
      // Limpa o formulário
      setMarca(''); setModelo(''); setAno(''); setCor(''); setPreco(''); setImagemUrl(''); setStatus('disponivel');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao criar o veículo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Novo Veículo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
              <input id="marca" type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
            </div>
            <div>
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo</label>
              <input id="modelo" type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
            </div>
            <div>
              <label htmlFor="ano" className="block text-sm font-medium text-gray-700">Ano</label>
              <input id="ano" type="number" value={ano} onChange={(e) => setAno(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
            </div>
            <div>
              <label htmlFor="cor" className="block text-sm font-medium text-gray-700">Cor</label>
              <input id="cor" type="text" value={cor} onChange={(e) => setCor(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
              <input id="preco" type="number" value={preco} onChange={(e) => setPreco(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md text-gray-700" placeholder="Ex: 50000" required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="imagemUrl" className="block text-sm font-medium text-gray-700">URL da imagem</label>
              <input id="imagemUrl" type="text" value={imagemUrl} onChange={(e) => setImagemUrl(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 text-gray-600 rounded-md hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="py-2 px-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 disabled:opacity-70">
              {loading ? 'Salvando...' : 'Salvar Veículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
