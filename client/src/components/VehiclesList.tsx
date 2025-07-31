// client/src/components/VehiclesList.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Vehicle } from '@/types';
import { PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';
import { VehicleFormModal, NewVehiclePayload } from './VehicleFormModal';

export function VehiclesList() {
  const token = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Vehicle>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Vehicle; direction: 'asc' | 'desc' }>({ key: 'marca', direction: 'asc' });

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        // A rota GET /vehicles é pública, não precisa de token
        const response = await fetch('http://localhost:7654/vehicles');
        if (!response.ok) throw new Error('Falha ao buscar os veículos.');
        const data: Vehicle[] = await response.json();
        setVehicles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredAndSortedVehicles = useMemo(() => {
    let sortedVehicles = [...vehicles];
    if (sortConfig.key) {
      sortedVehicles.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    if (!searchTerm) return sortedVehicles;
    return sortedVehicles.filter(v =>
      v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm, sortConfig]);

  const requestSort = (key: keyof Vehicle) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const handleSaveNewVehicle = async (newVehicleData: NewVehiclePayload) => {
    if (!token) throw new Error("Autenticação necessária para esta ação.");
    
    const response = await fetch('http://localhost:7654/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newVehicleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar o veículo.');
    }
    const createdVehicle: Vehicle = await response.json();
    setVehicles(prev => [createdVehicle, ...prev]);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicleId(vehicle.id);
    setEditFormData({ ...vehicle });
  };

  const handleCancelEdit = () => {
    setEditingVehicleId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (vehicleId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:7654/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error('Falha ao atualizar o veículo.');
      const updatedVehicle: Vehicle = await response.json();
      setVehicles(vehicles.map(v => v.id === vehicleId ? updatedVehicle : v));
      handleCancelEdit();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;
    if (!token) { alert("Autenticação necessária."); return; }
    try {
      const response = await fetch(`http://localhost:7654/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao excluir o veículo.');
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) return <p className="text-center text-gray-500">Carregando catálogo...</p>;
  if (error) return <p className="text-center text-red-500">Erro: {error}</p>;

  return (
    <>
      <VehicleFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewVehicle}
      />
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <input 
          type="text" 
          placeholder="Pesquisar por marca ou modelo..." 
          className="w-full p-2 border rounded-md mb-6 text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="w-20 text-center py-3">
                  <button onClick={() => setIsModalOpen(true)} className="text-gray-700 p-2 rounded-md hover:bg-blue-200">
                    <PlusCircle size={24} />
                  </button>
                </th>
                <th onClick={() => requestSort('marca')} className="text-gray-700 cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Marca</th>
                <th onClick={() => requestSort('modelo')} className="text-gray-700 cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Modelo</th>
                <th onClick={() => requestSort('ano')} className="text-gray-700 cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Ano</th>
                <th onClick={() => requestSort('preco')} className="text-gray-700 cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Preço</th>
                <th onClick={() => requestSort('status')} className="text-gray-700 cursor-pointer px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="text-gray-700 px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td></td>
                  {editingVehicleId === vehicle.id ? (
                    <>
                      <td className="px-6 py-4"><input value={editFormData.marca} onChange={(e) => setEditFormData({...editFormData, marca: e.target.value})} className="w-full p-1 border rounded" /></td>
                      <td className="px-6 py-4"><input value={editFormData.modelo} onChange={(e) => setEditFormData({...editFormData, modelo: e.target.value})} className="w-full p-1 border rounded" /></td>
                      <td className="px-6 py-4"><input type="number" value={editFormData.ano} onChange={(e) => setEditFormData({...editFormData, ano: Number(e.target.value)})} className="w-full p-1 border rounded" /></td>
                      <td className="px-6 py-4"><input type="number" value={editFormData.preco} onChange={(e) => setEditFormData({...editFormData, preco: Number(e.target.value)})} className="w-full p-1 border rounded" /></td>
                      <td className="px-6 py-4">
                        <select value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value as 'disponivel' | 'vendido'})} className="w-full p-1 border rounded">
                          <option value="disponivel">Disponível</option>
                          <option value="vendido">Vendido</option>
                        </select>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.marca}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.modelo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.ano}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(vehicle.preco)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.status === 'disponivel' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {vehicle.status}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      {editingVehicleId === vehicle.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(vehicle.id)} className="text-green-600 hover:text-green-800"><Save size={20} /></button>
                          <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800"><XCircle size={20} /></button>
                        </>
                      ) : (
                        <button onClick={() => handleEdit(vehicle)} className="text-blue-600 hover:text-blue-800"><Edit size={20} /></button>
                      )}
                      <button onClick={() => handleDelete(vehicle.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
