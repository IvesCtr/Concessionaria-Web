// client/src/components/ClientsList.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react'; // Ícones modernos

export function ClientsList() {
  const { token } = useAuth();
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:7654/clientes', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar os clientes.');
        }

        const data: User[] = await response.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  const handleDelete = async (clientId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:7654/clientes/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir o cliente.');
      }

      // Remove o cliente da lista local para atualizar a UI instantaneamente
      setClients(clients.filter(client => client.id !== clientId));
      alert('Cliente excluído com sucesso!');

    } catch (err: any) {
      setError(err.message);
      alert(`Erro: ${err.message}`);
    }
  };
  
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (loading) {
    return <p className="text-center text-gray-500">Carregando clientes...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Erro: {error}</p>;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      {/* Cabeçalho com Busca e Ordenação (Fase 2) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-1/2">
          <label htmlFor="search" className="text-sm font-medium text-gray-600">Pesquisar</label>
          <input id="search" type="text" placeholder="Nome, CPF ou Email..." className="mt-1 w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed" disabled />
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="sort" className="text-sm font-medium text-gray-600">Ordenar por</label>
          <select id="sort" className="mt-1 w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed" disabled>
            <option>Nome</option>
          </select>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th scope="col" className="w-20 text-center py-3">
                <button className="p-2 rounded-md hover:bg-gray-600 transition-colors">
                  <PlusCircle size={24} />
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">CPF</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCPF(client.cpf)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-4">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
