// client/src/components/SalesHistoryList.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sale } from '@/types';
import { DollarSign } from 'lucide-react';

export function SalesHistoryList() {
  const { token } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Sale | 'cliente' | 'vendedor'; direction: 'asc' | 'desc' }>({
    key: 'saleDate',
    direction: 'desc',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Token de autenticação não encontrado. Faça o login novamente.');
      return;
    }

    const fetchSalesHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:7654/historico', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar o histórico de vendas. Verifique suas permissões.');
        }

        const data: Sale[] = await response.json();
        setSales(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesHistory();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredAndSortedSales = useMemo(() => {
    let filteredSales = sales.filter((sale) =>
      sale.cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.funcionario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.slice(-6).toUpperCase().includes(searchTerm.toUpperCase())
    );

    if (sortConfig.key) {
      filteredSales.sort((a, b) => {
        let valA: any, valB: any;
        if (sortConfig.key === 'cliente') {
          valA = a.cliente.name;
          valB = b.cliente.name;
        } else if (sortConfig.key === 'vendedor') {
          valA = a.funcionario.name;
          valB = b.funcionario.name;
        } else {
          valA = a[sortConfig.key as keyof Sale];
          valB = b[sortConfig.key as keyof Sale];
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredSales;
  }, [sales, searchTerm, sortConfig]);

  const paginatedSales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedSales.slice(startIndex, endIndex);
  }, [filteredAndSortedSales, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedSales.length / itemsPerPage);

  const totalRevenue = useMemo(() => {
    return filteredAndSortedSales.reduce((total, sale) => total + sale.finalPrice, 0);
  }, [filteredAndSortedSales]);

  const requestSort = (key: keyof Sale | 'cliente' | 'vendedor') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
  const calculateCommission = (value: number) => formatCurrency(value * 0.05);

  if (loading) return <p className="text-center text-gray-500 py-10">Carregando histórico...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Erro: {error}</p>;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1 bg-green-100 text-green-800 p-6 rounded-lg flex flex-col items-center justify-center">
          <DollarSign size={40} className="mb-2" />
          <span className="text-3xl font-bold">{formatCurrency(totalRevenue)}</span>
          <span className="text-sm">Caixa (Vendas Filtradas)</span>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 items-end">
          <div>
            <label htmlFor="search" className="text-sm font-medium text-gray-600">Pesquisar por Cliente, Vendedor ou ID</label>
            <input
              id="search"
              type="text"
              placeholder="Digite para pesquisar..."
              className="mt-1 w-full p-2 border rounded-md text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th onClick={() => requestSort('id')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Id Venda</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comissão</th>
              <th onClick={() => requestSort('finalPrice')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Valor</th>
              <th onClick={() => requestSort('saleDate')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
              <th onClick={() => requestSort('cliente')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
              <th onClick={() => requestSort('vendedor')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Vendedor</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedSales.length > 0 ? paginatedSales.map((sale) => (
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
                <td colSpan={6} className="text-center py-10 text-gray-500">Nenhuma venda encontrada para os filtros aplicados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'}`}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'}`}
          >
            &gt;
          </button>
        </div>
    </div>
  );
}
