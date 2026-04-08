'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface MenuItem {
  id?: string;         // present when loaded from DB (edit mode)
  name: string;
  name_translations?: Record<string, string>;
  price_pln: number;
  price_eur: number;
  is_vege: boolean;
  is_spicy: boolean;
  _deleted?: boolean;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface MenuDay {
  date: string;
  day_name: string;
  categories: MenuCategory[];
}

type Step = 'upload' | 'preview' | 'saved';

const SUPPORTED_LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
];

type LangStatus = 'idle' | 'loading' | 'done' | 'error';

function UploadPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekId = searchParams.get('week');

  const [step, setStep] = useState<Step>(weekId ? 'saved' : 'upload');
  const [days, setDays] = useState<MenuDay[]>([]);
  const [parsing, setParsing] = useState(false);
  const [langStatus, setLangStatus] = useState<Record<string, LangStatus>>({});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [savedWeekId, setSavedWeekId] = useState<string | null>(weekId);
  const [selectedDay, setSelectedDay] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load existing week items when in edit/view mode
  useEffect(() => {
    if (!weekId) return;
    fetch(`/api/admin/weeks/${weekId}/items`)
      .then((r) => r.json())
      .then((data) => {
        if (data.days) {
          setDays(data.days);
          setStep('saved');
        }
      });
  }, [weekId]);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Wybierz plik PDF');
      return;
    }
    setError('');
    setParsing(true);

    const formData = new FormData();
    formData.append('pdf', file);

    const res = await fetch('/api/admin/parse-menu', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Błąd parsowania PDF');
      setParsing(false);
      return;
    }

    setDays(data.days);
    setStep('preview');
    setParsing(false);
    setLangStatus({});
  }, []);

  const handleTranslateLang = useCallback(async (langCode: string) => {
    setLangStatus((prev) => ({ ...prev, [langCode]: 'loading' }));

    // Collect all unique dish names
    const names = Array.from(
      new Set(days.flatMap((d) => d.categories.flatMap((c) => c.items.map((i) => i.name))))
    );

    try {
      const res = await fetch('/api/admin/translate-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names, language: langCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Apply translations to all matching items
      setDays((prev) =>
        prev.map((day) => ({
          ...day,
          categories: day.categories.map((cat) => ({
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              name_translations: {
                ...item.name_translations,
                [langCode]: data.translations[item.name] || item.name_translations?.[langCode] || '',
              },
            })),
          })),
        }))
      );
      setLangStatus((prev) => ({ ...prev, [langCode]: 'done' }));
    } catch (e: any) {
      setLangStatus((prev) => ({ ...prev, [langCode]: 'error' }));
    }
  }, [days]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const updateItem = (dayIdx: number, catIdx: number, itemIdx: number, patch: Partial<MenuItem>) => {
    setDays((prev) => {
      const next = structuredClone(prev);
      Object.assign(next[dayIdx].categories[catIdx].items[itemIdx], patch);
      return next;
    });
  };

  const removeItem = (dayIdx: number, catIdx: number, itemIdx: number) => {
    setDays((prev) => {
      const next = structuredClone(prev);
      next[dayIdx].categories[catIdx].items.splice(itemIdx, 1);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const res = await fetch('/api/admin/save-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Błąd zapisu');
      setSaving(false);
      return;
    }

    setSavedWeekId(data.id);
    setStep('saved');
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!savedWeekId) return;
    setPublishing(true);

    const res = await fetch(`/api/admin/menu/${savedWeekId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'published' }),
    });

    if (res.ok) {
      router.push('/admin/menu');
    } else {
      const data = await res.json();
      setError(data.error || 'Błąd publikacji');
      setPublishing(false);
    }
  };

  const totalItems = days.reduce(
    (acc, d) => acc + d.categories.reduce((a, c) => a + c.items.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1B4332] text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push('/admin/menu')} className="text-white/70 hover:text-white text-sm">
          ← Wróć
        </button>
        <h1 className="font-bold text-lg">
          {step === 'upload' ? 'Wgraj nowe menu' : step === 'preview' ? 'Podgląd — sprawdź i zapisz' : 'Zapisany szkic'}
        </h1>
        {step !== 'upload' && (
          <span className="ml-auto text-sm text-white/70">
            {days.length} dni · {totalItems} dań
          </span>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* STEP 1: Upload */}
        {step === 'upload' && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-[#1B4332]/30 rounded-2xl p-16 text-center hover:border-[#1B4332]/60 transition-colors cursor-pointer bg-white"
            onClick={() => !parsing && fileRef.current?.click()}
          >
            {parsing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-14 w-14 rounded-full border-4 border-[#1B4332]/20 border-t-[#1B4332] animate-spin" />
                <p className="font-semibold text-gray-800 text-lg">Odczytywanie PDF i ekstrakcja dań...</p>
                <p className="text-sm text-gray-400">Może potrwać ~15–20 sekund</p>
              </div>
            ) : (
              <>
                <div className="text-5xl mb-4">📄</div>
                <p className="font-semibold text-gray-700 text-lg mb-2">Przeciągnij PDF lub kliknij aby wybrać</p>
                <p className="text-sm text-gray-400">Format: poniedziałek–piątek, 5 stron</p>
                <p className="text-xs text-gray-300 mt-2">Ekstrakcja: ~15s · Tłumaczenia: możliwe po wgraniu</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        )}

        {/* STEP 2 & 3: Preview / Saved */}
        {(step === 'preview' || step === 'saved') && days.length > 0 && (
          <>
            {/* Language translation panel — only in preview mode */}
            {step === 'preview' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-bold text-gray-800 text-sm">🌍 Tłumaczenia</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Kliknij język aby przetłumaczyć wszystkie dania (~15s na język)</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {Object.values(langStatus).filter((s) => s === 'done').length} / {SUPPORTED_LANGS.length} gotowych
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_LANGS.map((lang) => {
                    const status = langStatus[lang.code] ?? 'idle';
                    return (
                      <button
                        key={lang.code}
                        onClick={() => status !== 'loading' && handleTranslateLang(lang.code)}
                        disabled={status === 'loading'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          status === 'done'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : status === 'loading'
                            ? 'bg-[#1B4332]/10 border-[#1B4332]/20 text-[#1B4332] cursor-wait'
                            : status === 'error'
                            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.code.toUpperCase()}</span>
                        {status === 'loading' && (
                          <span className="inline-block h-3 w-3 rounded-full border-2 border-[#1B4332]/30 border-t-[#1B4332] animate-spin" />
                        )}
                        {status === 'done' && <span>✓</span>}
                        {status === 'error' && <span title="Błąd – kliknij ponownie">↻</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Day tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {days.map((day, idx) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex-shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedDay === idx
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {day.day_name}
                  <span className="ml-1.5 text-xs opacity-60">{day.date}</span>
                </button>
              ))}
            </div>

            {/* Categories for selected day */}
            {days[selectedDay]?.categories.map((cat, catIdx) => (
              <div key={cat.name} className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                  <h3 className="font-bold text-[#1B4332] text-sm uppercase tracking-wide">{cat.name}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {cat.items.map((item, itemIdx) => (
                    <ItemRow
                      key={itemIdx}
                      item={item}
                      readOnly={step === 'saved'}
                      onChange={(patch) => updateItem(selectedDay, catIdx, itemIdx, patch)}
                      onDelete={() => removeItem(selectedDay, catIdx, itemIdx)}
                    />
                  ))}
                  {cat.items.length === 0 && (
                    <p className="text-xs text-gray-400 px-5 py-3">Brak dań</p>
                  )}
                </div>
              </div>
            ))}

            {/* Action bar */}
            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
            )}

            <div className="flex gap-3 mt-6">
              {step === 'preview' && (
                <>
                  <button
                    onClick={() => { setStep('upload'); setDays([]); }}
                    className="border border-gray-200 text-gray-600 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Wgraj inny PDF
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#1B4332] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#163728] disabled:opacity-60 transition-colors"
                  >
                    {saving ? 'Zapisywanie...' : 'Zapisz szkic'}
                  </button>
                </>
              )}
              {step === 'saved' && (
                <>
                  <button
                    onClick={() => router.push('/admin/menu')}
                    className="border border-gray-200 text-gray-600 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Wróć do listy
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="bg-green-600 text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
                  >
                    {publishing ? 'Publikowanie...' : '✓ Opublikuj to menu'}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function ItemRow({
  item,
  readOnly,
  onChange,
  onDelete,
}: {
  item: MenuItem;
  readOnly: boolean;
  onChange: (patch: Partial<MenuItem>) => void;
  onDelete: () => void;
}) {
  const LANGS = ['en', 'nl', 'de', 'fr', 'es', 'it', 'pt', 'cs', 'hu', 'ro', 'bg'] as const;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [translations, setTranslations] = useState<Record<string, string>>(
    () => Object.fromEntries(LANGS.map((l) => [l, item.name_translations?.[l] || '']))
  );
  const [pricePln, setPricePln] = useState((item.price_pln ?? 0).toString());
  const [priceEur, setPriceEur] = useState((item.price_eur ?? 0).toString());

  const save = () => {
    onChange({
      name,
      name_translations: {
        ...item.name_translations,
        pl: name,
        ...Object.fromEntries(
          LANGS.map((l) => [l, translations[l]?.trim() || undefined])
        ),
      } as any,
      price_pln: parseFloat(pricePln) || item.price_pln || 0,
      price_eur: parseFloat(priceEur) || item.price_eur || 0,
    });
    setEditing(false);
  };

  return (
    <div className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="PL: Polska nazwa"
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
              />
              <input
                value={pricePln}
                onChange={(e) => setPricePln(e.target.value)}
                placeholder="PLN"
                className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
              />
              <input
                value={priceEur}
                onChange={(e) => setPriceEur(e.target.value)}
                placeholder="EUR"
                className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LANGS.map((lang) => (
                <input
                  key={lang}
                  value={translations[lang] || ''}
                  onChange={(e) => setTranslations((prev) => ({ ...prev, [lang]: e.target.value }))}
                  placeholder={lang.toUpperCase()}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                />
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <button onClick={() => setEditing(false)} className="text-gray-400 text-sm px-2 border border-gray-200 rounded-lg">Anuluj</button>
              <button onClick={save} className="bg-[#1B4332] text-white text-sm font-semibold px-4 py-1 rounded-lg">Zapisz</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-gray-800">{item.name}</span>
              <span className="text-xs text-[#E8927C] font-semibold shrink-0">
                {parseFloat((item.price_pln ?? 0).toString()).toFixed(2)} zł / {parseFloat((item.price_eur ?? 0).toString()).toFixed(2)} €
              </span>
            </div>
            <div className="text-[11px] text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
              {(['en','nl','de','fr','es','it','pt','cs','hu','ro','bg'] as const).map((lang) =>
                item.name_translations?.[lang] ? (
                  <span key={lang}><span className="font-medium text-gray-400 uppercase">{lang}:</span> {item.name_translations[lang]}</span>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Vege toggle */}
        <button
          onClick={() => !readOnly && onChange({ is_vege: !item.is_vege })}
          title="Wege"
          className={`text-base rounded-lg px-1.5 py-0.5 transition-colors ${
            item.is_vege ? 'bg-green-100' : 'opacity-20 hover:opacity-40'
          } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          🌿
        </button>
        {/* Spicy toggle */}
        <button
          onClick={() => !readOnly && onChange({ is_spicy: !item.is_spicy })}
          title="Ostre"
          className={`text-base rounded-lg px-1.5 py-0.5 transition-colors ${
            item.is_spicy ? 'bg-red-100' : 'opacity-20 hover:opacity-40'
          } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          🌶️
        </button>
        {!readOnly && (
          <>
            <button
              onClick={() => setEditing(true)}
              className="text-gray-300 hover:text-gray-600 text-xs px-1 transition-colors"
            >
              ✎
            </button>
            <button
              onClick={onDelete}
              className="text-gray-200 hover:text-red-400 text-xs px-1 transition-colors"
            >
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense>
      <UploadPageInner />
    </Suspense>
  );
}
