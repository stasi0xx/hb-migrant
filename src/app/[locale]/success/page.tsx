'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cart';
import { Clock, Mail } from 'lucide-react';

function SuccessContent() {
  const t = useTranslations('success');
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [hasCleared, setHasCleared] = useState(false);

  const orderId = searchParams.get('orderId') || '';

  useEffect(() => {
    if (!hasCleared) {
      clearCart();
      setHasCleared(true);
    }
  }, [clearCart, hasCleared]);

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col">
      {/* Header */}
      <header className="bg-[#1C3D1C]">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8967A]">
              <span className="font-heading text-base text-white">GN</span>
            </div>
            <div>
              <p className="font-heading text-lg text-white leading-none">Głodny Niedźwiedź</p>
              <p className="text-[10px] font-700 uppercase tracking-widest text-[#E8967A] opacity-80">
                EST. 2018 CATERING
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Success icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#1C3D1C]">
              <svg viewBox="0 0 64 64" fill="none" className="h-16 w-16" xmlns="http://www.w3.org/2000/svg">
                {/* ears */}
                <circle cx="14" cy="14" r="9" fill="#E8967A"/>
                <circle cx="50" cy="14" r="9" fill="#E8967A"/>
                <circle cx="14" cy="14" r="5" fill="#c47560"/>
                <circle cx="50" cy="14" r="5" fill="#c47560"/>
                {/* head */}
                <circle cx="32" cy="34" r="22" fill="#E8967A"/>
                {/* snout */}
                <ellipse cx="32" cy="42" rx="9" ry="6" fill="#c47560"/>
                {/* eyes */}
                <circle cx="24" cy="30" r="3" fill="#1C3D1C"/>
                <circle cx="40" cy="30" r="3" fill="#1C3D1C"/>
                {/* nose */}
                <ellipse cx="32" cy="39" rx="3" ry="2" fill="#1C3D1C"/>
              </svg>
              <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#E8967A] shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="font-heading text-4xl text-[#1C3D1C] mb-2">{t('title')}</h1>
          <p className="text-lg font-600 text-[#E8967A] mb-4">{t('subtitle')}</p>
          <p className="text-[#1C3D1C]/70 mb-6 leading-relaxed">{t('message')}</p>

          {orderId && (
            <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-[#1C3D1C]/60 mb-1">{t('orderNumber')}</p>
              <p className="font-heading text-2xl text-[#1C3D1C] tracking-widest">
                #{orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          )}

          <div className="mb-6 flex flex-col gap-2">
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm">
              <Clock className="h-6 w-6 text-[#E8967A] flex-shrink-0" />
              <p className="text-sm font-600 text-[#1C3D1C]">{t('deliveryInfo')}</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm">
              <Mail className="h-6 w-6 text-[#E8967A] flex-shrink-0" />
              <p className="text-sm font-600 text-[#1C3D1C]">
                Potwierdzenie zostało wysłane na Twój email
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block w-full rounded-2xl bg-[#1C3D1C] py-4 font-heading text-xl text-white shadow-lg transition-all hover:bg-[#2d5a2d] active:scale-98"
          >
            {t('backToMenu')} →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center"><span className="text-4xl">🐻</span></div>}>
      <SuccessContent />
    </Suspense>
  );
}
