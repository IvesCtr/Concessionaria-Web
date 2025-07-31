// client/src/components/SalesForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Passo 1: Importar o useRouter
import { useAuth } from '@/context/AuthContext';

// Interfaces para os dados que vamos buscar
interface VehicleDetails {
  modelo: string;
  cor: string;
}
interface ClientDetails {
  name: string;
}

export function SalesForm() {
  const router = useRouter(); // Passo 2: Instanciar o router
  const { token } = useAuth();

  // --- Estados para os dados do formulário ---
  const [vehicleId, setVehicleId] = useState('');
  const [clienteCpf, setClienteCpf] = useState('');
  const [funcionarioCpf, setFuncionarioCpf] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // --- Estados para os dados de exibição ---
  const [clientName, setClientName] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
  const saleDate = new Date().toLocaleDateString('pt-BR');

  // --- Estados de controle ---
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Nova função para lidar com a entrada de CPF, permitindo apenas números
  const handleCpfChange = (value: string, setter: (value: string) => void) => {
    const onlyNums = value.replace(/[^\d]/g, ''); // Remove tudo que não é dígito
    if (onlyNums.length <= 11) {
      setter(onlyNums);
    }
  };

  // Lógica para buscar o nome do cliente quando o CPF perde o foco
  const handleClientCpfBlur = async () => {
    if (clienteCpf.length !== 11) {
      setClientName('');
      return;
    }
    try {
      const response = await fetch(`http://localhost:7654/clientes/cpf/${clienteCpf}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) { 
        const err = await response.json();
        setClientName(`(${err.message || 'Não encontrado'})`);
        return; 
      }
      const data: ClientDetails = await response.json();
      setClientName(data.name);
    } catch (e) {
      setClientName('(Erro ao buscar cliente)');
    }
  };

  // Lógica para buscar os detalhes do veículo quando o ID perde o foco
  const handleVehicleIdBlur = async () => {
    if (!vehicleId) {
      setVehicleDetails(null);
      return;
    }
    try {
      const response = await fetch(`http://localhost:7654/vehicles/${vehicleId}`);
      if (!response.ok) { 
        setVehicleDetails({ modelo: '(Veículo não encontrado)', cor: '' }); 
        return; 
      }
      const data: VehicleDetails = await response.json();
      setVehicleDetails(data);
    } catch (e) {
      setVehicleDetails({ modelo: '(Erro ao buscar veículo)', cor: '' });
    }
  };

  // Lógica para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:7654/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleId,
          clienteCpf,
          funcionarioCpf,
          finalPrice: Number(finalPrice),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'Ocorreu um erro ao registrar a venda.');
      }

      setSuccess('Venda registrada com sucesso!');
      // Limpa todos os campos
      setVehicleId(''); setClienteCpf(''); setFuncionarioCpf(''); setFinalPrice(''); setObservacoes(''); setClientName(''); setVehicleDetails(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const inputClasses = "mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800";
  const readOnlyInputClasses = `${inputClasses} bg-gray-100 cursor-not-allowed`;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="clienteCpf" className="block text-sm font-medium text-gray-700">CPF do Cliente</label>
            <input 
              type="text" 
              id="clienteCpf" 
              value={clienteCpf} 
              onChange={(e) => handleCpfChange(e.target.value, setClienteCpf)} 
              onBlur={handleClientCpfBlur} 
              className={inputClasses} 
              placeholder="Digite o CPF do cliente" 
              required 
              maxLength={11} 
            />
          </div>
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
            <input type="text" id="clientName" value={clientName} className={readOnlyInputClasses} readOnly />
          </div>
          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">Código do Veículo</label>
            <input type="text" id="vehicleId" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} onBlur={handleVehicleIdBlur} className={inputClasses} placeholder="Digite o código do veículo" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">Modelo do Veículo</label>
              <input type="text" id="vehicleModel" value={vehicleDetails?.modelo || ''} className={readOnlyInputClasses} readOnly />
            </div>
            <div>
              <label htmlFor="vehicleColor" className="block text-sm font-medium text-gray-700">Cor do Veículo</label>
              <input type="text" id="vehicleColor" value={vehicleDetails?.cor || ''} className={readOnlyInputClasses} readOnly />
            </div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="finalPrice" className="block text-sm font-medium text-gray-700">Valor da Compra (R$)</label>
            <input type="number" id="finalPrice" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} className={inputClasses} placeholder="Ex: 70000" required />
          </div>
          <div>
            <label htmlFor="funcionarioCpf" className="block text-sm font-medium text-gray-700">Matrícula do Vendedor (CPF)</label>
            <input 
              type="text" 
              id="funcionarioCpf" 
              value={funcionarioCpf} 
              onChange={(e) => handleCpfChange(e.target.value, setFuncionarioCpf)} 
              className={inputClasses} 
              placeholder="CPF do funcionário que realizou a venda" 
              required 
              maxLength={11} 
            />
          </div>
          <div>
            <label htmlFor="saleDate" className="block text-sm font-medium text-gray-700">Data da venda</label>
            <input type="text" id="saleDate" value={saleDate} className={readOnlyInputClasses} readOnly />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea id="observacoes" value={observacoes} onChange={e => setObservacoes(e.target.value)} rows={3} className={inputClasses} placeholder="Detalhes adicionais da venda..."></textarea>
          </div>
        </div>
        {success && <p className="mt-4 text-center bg-green-100 text-green-700 p-3 rounded">{success}</p>}
        {error && <p className="mt-4 text-center bg-red-100 text-red-700 p-3 rounded">{error}</p>}
        <div className="flex justify-center gap-6 mt-8">
          <button 
            type="button" 
            onClick={() => router.push('/dashboard')} // Passo 3: Adicionar o onClick
            className="bg-red-200 hover:bg-red-300 text-red-800 font-bold py-3 px-24 rounded-lg transition-colors duration-300" // Passo 4: Corrigir px-25 para px-24
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="bg-green-200 hover:bg-green-300 text-green-800 font-bold py-3 px-24 rounded-lg transition-colors duration-300" // Passo 4: Corrigir px-25 para px-24
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Concluído'}
          </button>
        </div>
      </form>
    </div>
  );
}
