'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cart';
import { Link } from '@/i18n/navigation';
import CheckoutForm from '@/components/CheckoutForm';
import LanguageToggle from '@/components/LanguageToggle';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const tNav = useTranslations('nav');
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center p-4">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#1C3D1C]/10">
          <svg className="h-10 w-10 text-[#1C3D1C]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h1 className="font-heading text-3xl text-[#1C3D1C] mb-2">
          {tNav('cart')}
        </h1>
        <p className="text-[#1C3D1C]/60 mb-6 text-center">
          Twój koszyk jest pusty. Dodaj coś do zamówienia!
        </p>
        <Link
          href="/"
          className="rounded-2xl bg-[#1C3D1C] px-8 py-3 font-heading text-xl text-white transition-all hover:bg-[#2d5a2d]"
        >
          Wróć do menu →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#1C3D1C] shadow-lg">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <p className="font-heading text-lg leading-none text-white">{t('title')}</p>
                <p className="text-[10px] font-700 uppercase tracking-widest text-[#E8967A] opacity-80">
                  GŁODNY NIEDŹWIEDŹ
                </p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 pb-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
