"use client";

import { useState } from 'react';
import { User } from '@/types';

// Tipo para os dados de criação de um novo funcionário
export type NewEmployeePayload = Omit<User, 'id'> & { password?: string };

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEmployeeData: NewEmployeePayload) => Promise<void>;
}

export function EmployeeFormModal({ isOpen, onClose, onSave }: EmployeeFormModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'funcionario' | 'gerente'>('funcionario'); // Estado para o cargo
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave({ name, email, cpf, password, role });
      // Limpa o formulário e fecha o modal
      setName('');
      setEmail('');
      setCpf('');
      setPassword('');
      setRole('funcionario');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao criar o funcionário.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Novo Funcionário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF (11 dígitos, sem pontos)</label>
            <input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required maxLength={11}  />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha Provisória</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
          </div>
          {/* Campo de Seleção para o Cargo */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'funcionario' | 'gerente')} className="mt-1 w-full p-2 border rounded-md text-gray-700">
              <option value="funcionario">Funcionário</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 text-gray-600 rounded-md hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="py-2 px-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 disabled:opacity-70">
              {loading ? 'A guardar...' : 'Guardar Funcionário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
