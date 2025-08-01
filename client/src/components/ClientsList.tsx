"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';
import { ClientFormModal } from './ClientFormModal';

export function ClientsList() {
  const { token } = useAuth();
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:7654/clientes', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha ao buscar os clientes. Verifique as suas permissões.');
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

  useEffect(() => {
    setCurrentPage(1); // Volta pra página 1 ao buscar
  }, [searchTerm]);

  const filteredAndSortedClients = useMemo(() => {
    let sortedClients = [...clients];

    if (sortConfig.key) {
      sortedClients.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (!searchTerm) {
      return sortedClients;
    }

    return sortedClients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cpf.includes(searchTerm)
    );
  }, [clients, searchTerm, sortConfig]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedClients.slice(startIndex, endIndex);
  }, [filteredAndSortedClients, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);

  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSaveNewClient = async (newClientData: Omit<User, 'id' | 'role'>) => {
    if (!token) throw new Error("Autenticação necessária.");

    const response = await fetch('http://localhost:7654/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newClientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar o cliente.');
    }

    const createdClient: User = await response.json();
    setClients(prevClients => [createdClient, ...prevClients]);
  };

  const handleEdit = (client: User) => {
    setEditingClientId(client.id);
    setEditFormData({ name: client.name, email: client.email, cpf: client.cpf });
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (clientId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:7654/clientes/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error('Falha ao atualizar o cliente.');

      const updatedClient: User = await response.json();
      setClients(clients.map(c => c.id === clientId ? updatedClient : c));
      handleCancelEdit();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      const response = await fetch(`http://localhost:7654/clientes/${clientId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao excluir o cliente.');
      setClients(clients.filter(c => c.id !== clientId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatCPF = (cpf: string): string => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (loading) return <p className="text-center text-gray-500">A carregar...</p>;
  if (error) return <p className="text-center text-red-500">Erro: {error}</p>;

  return (
    <>
      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewClient}
      />

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 text-gray-700">
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF ou email..."
            className="w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100 text-white">
              <tr>
                <th className="w-20 text-center py-3">
                  <button onClick={() => setIsModalOpen(true)} className="text-gray-700 p-2 rounded-md hover:bg-blue-300">
                    <PlusCircle size={24} />
                  </button>
                </th>
                <th onClick={() => requestSort('name')} className="text-gray-700 cursor-pointer px-6 py-3 text-left text-xs font-large uppercase tracking-wider">Nome</th>
                <th onClick={() => requestSort('cpf')} className="text-gray-700 cursor-pointer px-6 py-3 text-left text-xs font-large uppercase tracking-wider">CPF</th>
                <th onClick={() => requestSort('email')} className="text-gray-700 cursor-pointer px-6 py-3 text-left text-xs font-large uppercase tracking-wider">Email</th>
                <th className="text-gray-700 px-6 py-3 text-left text-xs font-large uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="py-4 whitespace-nowrap"></td>
                  {editingClientId === client.id ? (
                    <>
                      <td className="px-6 py-4"><input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full p-2 border rounded-md text-gray-700" /></td>
                      <td className="px-6 py-4"><input value={editFormData.cpf} onChange={(e) => setEditFormData({...editFormData, cpf: e.target.value})} className="w-full p-2 border rounded-md text-gray-700" /></td>
                      <td className="px-6 py-4"><input value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full p-2 border rounded-md text-gray-700" /></td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCPF(client.cpf)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      {editingClientId === client.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(client.id)} className="text-green-600 hover:text-green-800"><Save size={20} /></button>
                          <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800"><XCircle size={20} /></button>
                        </>
                      ) : (
                        <button onClick={() => handleEdit(client)} className="text-blue-600 hover:text-blue-800"><Edit size={20} /></button>
                      )}
                      <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
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
    </>
  );
}
