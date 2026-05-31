import React, { useState } from 'react';
import { authApi, AuthResponse } from '../api/auth';

export default function Auth({ onAuthSuccess }: { onAuthSuccess: (data: AuthResponse) => void }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthSuccess = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    onAuthSuccess(data);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Informe seu nome.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const data = await authApi.register({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      handleAuthSuccess(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedEmail = email.trim();

    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const data = await authApi.login({
        email: trimmedEmail,
        password,
      });

      handleAuthSuccess(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-md bg-zinc-800 rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="The Mirror Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-neutral-50 mb-8">
            Bem-vindo(a) ao The Mirror
          </h1>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                !isSignUp
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                isSignUp
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              Cadastrar
            </button>
          </div>
          {error && (
            <div className="mb-4 text-center text-red-500 font-medium text-sm">
              {error}
            </div>
          )}
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-zinc-700 text-white placeholder-zinc-400"
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-zinc-700 text-white placeholder-zinc-400"
              />
            </div>
            <div>
                <input
                  type="password"
                  placeholder="Senha (mínimo 8 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  className="w-full px-3 py-2 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38bdf8] bg-zinc-700 text-white placeholder-zinc-400"
                />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#38bdf8] text-[#020d18] py-2 px-4 rounded-md hover:bg-[#7dd3fc] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? 'Processando...' : isSignUp ? 'Cadastrar' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
