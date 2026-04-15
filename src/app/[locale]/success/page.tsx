'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cart';
import { Clock, Mail, Star } from 'lucide-react';
import Image from 'next/image';

function SuccessContent() {
  const t = useTranslations('success');
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [hasCleared, setHasCleared] = useState(false);

  const orderId = searchParams.get('orderId') || '';
  const registrationToken = searchParams.get('register') || '';

  useEffect(() => {
    if (!hasCleared) {
      clearCart();
      setHasCleared(true);
    }
  }, [clearCart, hasCleared]);

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Success icon */}
          <div className="mb-6 flex justify-center mt-10">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#1C3D1C]">
              <Image
                src="/images/hb-logo.png"
                alt="Hongige Beer"
                width={72}
                height={72}
                className="object-contain"
              />
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
              <p className="text-sm font-600 text-[#1C3D1C]">{t('emailConfirm')}</p>
            </div>
          </div>

          {/* Create account CTA */}
          {registrationToken && (
            <div className="mb-4 rounded-2xl bg-[#1C3D1C] p-5 text-left">
              <div className="mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-[#D4A017] flex-shrink-0" />
                <p className="font-heading text-base text-white">{t('createAccountTitle')}</p>
              </div>
              <p className="mb-4 text-xs text-white/60 leading-relaxed">
                {t('createAccountDesc')}
              </p>
              <Link
                href={`/register?token=${registrationToken}`}
                className="block w-full rounded-xl bg-[#E8967A] py-3 text-center font-heading text-base text-white transition hover:bg-[#d4785e]"
              >
                {t('createAccountCta')}
              </Link>
            </div>
          )}

          <Link
            href="/"
            className="inline-block w-full rounded-2xl border border-[#1C3D1C]/20 bg-white py-4 font-heading text-xl text-[#1C3D1C] shadow-sm transition-all hover:bg-[#FDF6EC] active:scale-98 text-center"
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
