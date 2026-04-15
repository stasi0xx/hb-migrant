'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { X, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { deleteAccount } from '@/app/[locale]/account/profile/actions';

interface Props {
  locale: string;
  onClose: () => void;
}

export default function DeleteAccountModal({ locale, onClose }: Props) {
  const t = useTranslations('auth.konto.profil.deleteModal');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isConfirmed = confirmText === 'DELETE';

  function handleDelete() {
    if (!isConfirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteAccount(locale);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && !isPending && onClose()}
    >
      <div className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white sm:max-w-md sm:rounded-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C3D1C]/8 px-5 py-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500" />
            <h2 className="font-heading text-lg text-[#1C3D1C]">{t('title')}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#1C3D1C]/40 transition hover:bg-[#1C3D1C]/8 hover:text-[#1C3D1C] disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <p className="text-sm text-[#1C3D1C]/70 leading-relaxed">{t('body')}</p>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
              {t('confirmLabel')}
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-red-200 bg-red-50/50 px-4 py-2.5 text-sm text-[#1C3D1C] placeholder:text-[#1C3D1C]/25 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 transition font-mono tracking-wider"
              placeholder={t('confirmPlaceholder')}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoFocus
              disabled={isPending}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#1C3D1C]/8 px-5 py-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#1C3D1C]/50 transition hover:bg-[#1C3D1C]/5 hover:text-[#1C3D1C] disabled:opacity-40"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending || !isConfirmed}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-red-600 disabled:opacity-40 active:scale-[0.98]"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? t('deleting') : t('confirm')}
          </button>
        </div>

      </div>
    </div>
  );
}
