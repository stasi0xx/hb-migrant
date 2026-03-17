'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === 'pl' ? 'en' : 'pl';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-full border-2 border-[#E8967A] px-3 py-1 text-sm font-bold text-[#E8967A] transition-all hover:bg-[#E8967A] hover:text-white disabled:opacity-50"
    >
      <span className={locale === 'pl' ? 'opacity-100' : 'opacity-40'}>PL</span>
      <span className="text-[#1C3D1C] opacity-30">/</span>
      <span className={locale === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
    </button>
  );
}
