"use client";

import { useState } from 'react';
import { User } from '@/types';

// 1. Criamos um novo tipo para os dados de criação de um cliente.
//    Ele inclui todos os campos de User (exceto id e role) e adiciona a senha.
export type NewClientPayload = Omit<User, 'id'> & { password?: string };

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 2. A função onSave agora espera o novo tipo de dados.
  onSave: (newClientData: NewClientPayload) => Promise<void>;
}

export function ClientFormModal({ isOpen, onClose, onSave }: ClientFormModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 3. O objeto enviado agora corresponde ao tipo NewClientPayload.
      await onSave({ name, email, cpf, password, 'role': 'cliente' });
      setName('');
      setEmail('');
      setCpf('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao criar o cliente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Adicionar Novo Cliente</h2>
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
            <input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required maxLength={11} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha Provisória</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-700" required />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 text-gray-600 rounded-md hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="py-2 px-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 disabled:opacity-70">
              {loading ? 'A guardar...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
