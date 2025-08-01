"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';
import { EmployeeFormModal, NewEmployeePayload } from './EmployeeFormModal';

export function EmployeesList() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:7654/funcionarios', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha ao buscar os funcionários. Apenas gerentes podem aceder.');
        const data: User[] = await response.json();
        setEmployees(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1); // Volta pra página 1 ao buscar
  }, [searchTerm]);

  const filteredAndSortedEmployees = useMemo(() => {
    let sortedEmployees = [...employees];
    if (sortConfig.key) {
      sortedEmployees.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    if (!searchTerm) return sortedEmployees;
    return sortedEmployees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cpf.includes(searchTerm)
    );
  }, [employees, searchTerm, sortConfig]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedEmployees.slice(start, end);
  }, [filteredAndSortedEmployees, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);

  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSaveNewEmployee = async (newEmployeeData: NewEmployeePayload) => {
    if (!token) throw new Error("Autenticação necessária.");
    const response = await fetch('http://localhost:7654/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newEmployeeData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao criar o funcionário.');
    }
    const createdEmployee: User = await response.json();
    setEmployees(prev => [createdEmployee, ...prev]);
  };

  const handleEdit = (employee: User) => {
    setEditingEmployeeId(employee.id);
    setEditFormData({ name: employee.name, email: employee.email, cpf: employee.cpf, role: employee.role });
  };

  const handleCancelEdit = () => {
    setEditingEmployeeId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (employeeId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:7654/funcionarios/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error('Falha ao atualizar o funcionário.');
      const updatedEmployee: User = await response.json();
      setEmployees(employees.map(e => e.id === employeeId ? updatedEmployee : e));
      handleCancelEdit();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;
    try {
      const response = await fetch(`http://localhost:7654/funcionarios/${employeeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao excluir o funcionário.');
      setEmployees(employees.filter(e => e.id !== employeeId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatCPF = (cpf: string): string => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  if (loading) return <p className="text-center text-gray-500">A carregar equipa...</p>;
  if (error) return <p className="text-center text-red-500">Erro: {error}</p>;

  return (
    <>
      <EmployeeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewEmployee}
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
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="w-20 text-center py-3">
                  <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-md hover:bg-blue-300">
                    <PlusCircle size={24} />
                  </button>
                </th>
                <th onClick={() => requestSort('name')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
                <th onClick={() => requestSort('role')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cargo</th>
                <th onClick={() => requestSort('cpf')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">CPF</th>
                <th onClick={() => requestSort('email')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="py-4 whitespace-nowrap"></td>
                  {editingEmployeeId === employee.id ? (
                    <>
                      <td className="px-6 py-4"><input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full p-2 border rounded-md text-gray-700" /></td>
                      <td className="px-6 py-4">
                        <select value={editFormData.role} onChange={(e) => setEditFormData({...editFormData, role: e.target.value as 'funcionario' | 'gerente'})} className="w-full p-2 border rounded-md text-gray-700">
                          <option value="funcionario">Funcionário</option>
                          <option value="gerente">Gerente</option>
                        </select>
                      </td>
                      <td className="px-6 py-4"><input value={editFormData.cpf} onChange={(e) => setEditFormData({...editFormData, cpf: e.target.value})} className="w-full p-2 border rounded-md text-gray-700" /></td>
                      <td className="px-6 py-4"><input value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full p-2 border rounded-md text-gray-700" /></td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{capitalize(employee.role)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCPF(employee.cpf)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      {editingEmployeeId === employee.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(employee.id)} className="text-green-600 hover:text-green-800"><Save size={20} /></button>
                          <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800"><XCircle size={20} /></button>
                        </>
                      ) : (
                        <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:text-blue-800"><Edit size={20} /></button>
                      )}
                      <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
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