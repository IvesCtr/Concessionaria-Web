// client/src/components/SalesHistoryList.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sale } from '@/types';
import { DollarSign } from 'lucide-react';

export function SalesHistoryList() {
  // Usamos o token para o caso de reativarmos a segurança no futuro
  const { token } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:7654/historico', {
          headers: {
            // A autorização é necessária pois a rota no backend é protegida
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar o histórico de vendas. Verifique se está logado.');
        }

        const data: Sale[] = await response.json();
        setSales(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Mesmo com a página pública, a chamada à API pode precisar de um token.
    // Se não houver token, a chamada falhará graciosamente.
    fetchSalesHistory();
  }, [token]);

  // Funções de formatação para exibição
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Lógica de comissão de exemplo (5% do valor da venda)
  const calculateCommission = (value: number) => {
    return formatCurrency(value * 0.05); 
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Carregando histórico...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">Erro: {error}</p>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      {/* Filtros e Caixa (Desabilitados na Fase 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1 bg-green-100 text-green-800 p-6 rounded-lg flex flex-col items-center justify-center">
          <DollarSign size={40} className="mb-2" />
          <span className="text-3xl font-bold">{formatCurrency(1500)}</span>
          <span className="text-sm">Caixa (Exemplo)</span>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-gray-600">Pesquisar</label>
            <input type="text" placeholder="ID, Cliente..." className="mt-1 w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed" disabled />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Período</label>
            <input type="text" placeholder="dd/mm/yyyy - dd/mm/yyyy" className="mt-1 w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed" disabled />
          </div>
           <div>
            <label className="text-sm font-medium text-gray-600">Valor</label>
            <input type="text" placeholder="R$ - R$" className="mt-1 w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed" disabled />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Vendedor</label>
            <select className="mt-1 w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed" disabled><option>Todos</option></select>
          </div>
           <div>
            <label className="text-sm font-medium text-gray-600">Ordenar por</label>
            <select className="mt-1 w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed" disabled><option>Data</option></select>
          </div>
        </div>
      </div>

      {/* Tabela de Histórico */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Id Venda</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comissão</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Vendedor</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.length > 0 ? sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateCommission(sale.finalPrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{formatCurrency(sale.finalPrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(sale.saleDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.cliente.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.funcionario.name}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">Nenhuma venda encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginação (Fase 2) */}
      <div className="flex items-center justify-center border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
        <p className="text-sm text-gray-500">Paginação será implementada na Fase 2</p>
      </div>
    </div>
  );
}
