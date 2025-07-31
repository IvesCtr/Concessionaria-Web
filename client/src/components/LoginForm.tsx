'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  // ALTERAÇÃO AQUI: O estado inicial agora é uma string vazia.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Chama a nossa API Route do Next.js, que lida com a
      // autenticação no backend e a criação do cookie.
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Se a resposta não for 'ok', o login falhou.
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Falha no login. Verifique as suas credenciais.');
      }
      const data = await response.json();
      const token = data['token'];
      localStorage.setItem('token', token);
      // Se o login for bem-sucedido, redireciona para o dashboard.
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // O JSX abaixo é o seu layout original, sem alterações visuais.
  return (
      <div className="bg-white rounded-2xl p-10 w-full max-w-md transition-all">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Bem-vindo!👋</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 transition text-gray-700 placeholder-gray-300"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 transition text-gray-700 placeholder-gray-300"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition disabled:opacity-70"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>

          <div className="text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition">
              Esqueceu a senha?
            </a>
          </div>
        </form>
      </div>
  );
}
