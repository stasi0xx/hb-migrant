'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/menu');
    } else {
      const data = await res.json();
      setError(data.error || 'Błąd logowania');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B4332] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🐻</div>
          <h1 className="text-2xl font-bold text-[#1B4332]">Panel admina</h1>
          <p className="text-sm text-gray-500 mt-1">Głodny Niedźwiedź</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            autoFocus
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1B4332] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#163728] transition-colors disabled:opacity-60"
          >
            {loading ? 'Logowanie...' : 'Zaloguj'}
          </button>
        </form>
      </div>
    </div>
  );
}
