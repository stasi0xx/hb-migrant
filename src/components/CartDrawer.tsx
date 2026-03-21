'use client';

import { useCartStore } from '@/store/cart';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { parseMenuDate } from '@/lib/utils';
import { ShoppingBag, Tag, X, Trash2, Minus, Plus } from 'lucide-react';

export default function CartDrawer() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const { items, isOpen, closeCart, total, originalTotal, savings, itemCount, removeItem, updateQuantity } =
    useCartStore();

  const [mounted, setMounted] = useState(false);

  const count = mounted ? itemCount() : 0;
  const totalAmount = mounted ? total() : 0;
  const savingsAmount = mounted ? savings() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const formatDate = (dateStr: string) => {
    const d = parseMenuDate(dateStr);
    return d.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-1">
          <div>
            <h2 className="font-heading text-2xl text-[#1C3D1C]">{t('title')}</h2>
            <p className="text-sm text-[#1C3D1C]/60">
              {t('deliveryInfo')}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C3D1C]/8">
                <ShoppingBag className="h-8 w-8 text-[#1C3D1C]/40" />
              </div>
              <p className="font-heading text-xl text-[#1C3D1C]">{t('empty')}</p>
              <p className="mt-1 text-sm text-gray-400">{t('emptyDesc')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">

              {/* Items grouped by date */}
              {Object.entries(groupedItems).map(([date, dateItems]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-700 uppercase tracking-wide text-[#1C3D1C]/50">
                      {t('forDate')} {formatDate(date)}
                    </span>
                    <div className="flex-1 h-px bg-[#1C3D1C]/10" />
                  </div>
                  <div className="flex flex-col gap-2">
                    {dateItems.map((item) => (
                      <div
                        key={`${item.id}-${item.date}`}
                        className="flex items-start gap-3 rounded-xl bg-[#FDF6EC] p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-600 text-[#1C3D1C] leading-snug">{item.name}</p>
                          <p className="mt-1 text-sm font-700 text-[#E8967A]">
                            {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.date, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1C3D1C]/10 text-[#1C3D1C] transition-colors hover:bg-[#1C3D1C]/20"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[20px] text-center text-sm font-700 text-[#1C3D1C]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.date, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1C3D1C]/10 text-[#1C3D1C] transition-colors hover:bg-[#1C3D1C]/20"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id, item.date)}
                            className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-400 transition-colors hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 pb-safe">
            {savingsAmount > 0 && (
              <div className="flex items-center justify-between mb-2 rounded-xl bg-[#D4A843]/15 px-3 py-2 border border-[#D4A843]/30">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#D4A843]" />
                  <span className="text-sm font-700 text-[#1C3D1C]">
                    {t('discountLabel')}
                  </span>
                </div>
                <span className="text-sm font-800 text-[#D4A843]">
                  -{savingsAmount.toFixed(2).replace('.', ',')} zł
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <span className="font-700 text-[#1C3D1C]">{t('total')}</span>
              <span className="font-heading text-2xl text-[#1C3D1C]">
                {totalAmount.toFixed(2).replace('.', ',')} zł
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full rounded-2xl bg-[#E8967A] py-4 text-center font-heading text-xl text-white shadow-lg transition-all hover:bg-[#d4755a] active:scale-98"
            >
              {t('orderButton')} →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
