'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface Week {
  id: string;
  week_start: string;
  week_end: string;
  status: 'draft' | 'published';
  created_at: string;
  item_count?: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export default function AdminMenuPage() {
  const router = useRouter();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWeeks = async () => {
    // Use service route to get all weeks (including drafts)
    const res = await fetch('/api/admin/weeks');
    if (res.ok) {
      const data = await res.json();
      setWeeks(data.weeks);
    }
    setLoading(false);
  };

  useEffect(() => { fetchWeeks(); }, []);

  const handlePublish = async (id: string, current: 'draft' | 'published') => {
    const newStatus = current === 'published' ? 'draft' : 'published';
    const label = newStatus === 'published' ? 'opublikować' : 'cofnąć do szkicu';
    if (!confirm(`Czy chcesz ${label} ten tydzień?`)) return;

    await fetch(`/api/admin/menu/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchWeeks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Usunąć ten tydzień? Tej operacji nie można cofnąć.')) return;
    await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
    fetchWeeks();
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1B4332] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐻</span>
          <h1 className="font-bold text-lg">Panel admina — Menu</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/menu/upload')}
            className="bg-[#E8927C] hover:bg-[#d4806b] text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
          >
            + Wgraj nowe PDF
          </button>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Wyloguj
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-400 py-20">Ładowanie...</div>
        ) : weeks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Brak menu. Wgraj pierwszy PDF.</p>
            <button
              onClick={() => router.push('/admin/menu/upload')}
              className="bg-[#1B4332] text-white rounded-xl px-6 py-3 font-semibold hover:bg-[#163728] transition-colors"
            >
              Wgraj PDF
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {weeks.map((week) => (
              <div
                key={week.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        week.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {week.status === 'published' ? 'Opublikowane' : 'Szkic'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatDate(week.week_start)} – {formatDate(week.week_end)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Dodano: {new Date(week.created_at).toLocaleDateString('pl-PL')}
                    {week.item_count !== undefined && ` · ${week.item_count} dań`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/menu/upload?week=${week.id}`)}
                    className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl px-3 py-1.5 transition-colors"
                  >
                    Podgląd
                  </button>
                  <button
                    onClick={() => handlePublish(week.id, week.status)}
                    className={`text-sm font-semibold rounded-xl px-3 py-1.5 transition-colors ${
                      week.status === 'published'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {week.status === 'published' ? 'Cofnij' : 'Opublikuj'}
                  </button>
                  <button
                    onClick={() => handleDelete(week.id)}
                    className="text-sm text-red-400 hover:text-red-600 border border-red-100 rounded-xl px-3 py-1.5 transition-colors"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
