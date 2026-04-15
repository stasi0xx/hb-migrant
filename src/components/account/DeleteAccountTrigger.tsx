'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import DeleteAccountModal from './DeleteAccountModal';

interface Props {
  locale: string;
}

export default function DeleteAccountTrigger({ locale }: Props) {
  const t = useTranslations('auth.konto.profil');
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-400" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
            {t('dangerZone')}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#1C3D1C]">{t('deleteAccountTitle')}</p>
            <p className="mt-0.5 text-xs text-[#1C3D1C]/45">{t('deleteAccountSub')}</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 active:scale-[0.98]"
          >
            {t('deleteAccountButton')}
          </button>
        </div>
      </div>

      {open && <DeleteAccountModal locale={locale} onClose={() => setOpen(false)} />}
    </>
  );
}
