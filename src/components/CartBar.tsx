'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { getSiteConfig } from '@/config/sites';
import { ShoppingBag } from 'lucide-react';

export default function CartBar() {
  const t = useTranslations('cart');
  const { items, total: getTotal, itemCount, openCart } = useCartStore();
  const [hasMounted, setHasMounted] = useState(false);
  const { currency } = getSiteConfig();

  useEffect(() => { setHasMounted(true); }, []);

  const count = hasMounted ? itemCount() : 0;
  const total = hasMounted ? getTotal() : 0;

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-safe">
      <button
        onClick={openCart}
        className="flex w-full items-center justify-between rounded-2xl bg-[#1C3D1C] px-5 py-4 shadow-2xl transition-all active:scale-98"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="h-6 w-6 text-white" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8967A] text-[10px] font-800 text-white">
              {count}
            </span>
          </div>
          <span className="font-700 text-white">{t('items')}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-heading text-xl text-white">
            {formatPrice(total, currency)}
          </span>
          <span className="rounded-full bg-[#E8967A] px-4 py-1.5 text-sm font-700 text-white">
            {t('orderButton')} →
          </span>
        </div>
      </button>
    </div>
  );
}
