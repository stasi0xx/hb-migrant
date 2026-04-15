'use client';

import { useCartStore } from '@/store/cart';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { getSiteConfig } from '@/config/sites';
import { formatDeliveryDate } from '@/lib/migrant-delivery';
import { ShoppingBag, X, Trash2, Truck, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';
import ConfirmModal from '@/components/ConfirmModal';

export default function CartDrawer() {
  const t = useTranslations('cart');
  const tm = useTranslations('migrant');
  const tCat = useTranslations('categories');
  const locale = useLocale();
  const { cartPackage, isOpen, closeCart, clearCart, grandTotal, updateMealQuantity } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [mealsExpanded, setMealsExpanded] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const { currency } = getSiteConfig();

  const grandTotalAmount = mounted ? grandTotal() : 0;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const hasPackage = mounted && cartPackage != null;

  // Group meals by category for display
  type MealEntry = { id: string; name: string; category: string; quantity: number };
  const mealsByCategory: Record<string, MealEntry[]> = {};
  if (cartPackage) {
    for (const meal of cartPackage.meals) {
      if (!mealsByCategory[meal.category]) mealsByCategory[meal.category] = [];
      mealsByCategory[meal.category].push(meal);
    }
  }

  const packageTitle = cartPackage?.packageSize === 6
    ? tm('package6days')
    : tm('package3days');

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 9999 }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 flex flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh', zIndex: 9999 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-1">
          <div>
            <h2 className="font-heading text-2xl text-[#1C3D1C]">{t('title')}</h2>
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
          {!hasPackage ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C3D1C]/8">
                <ShoppingBag className="h-8 w-8 text-[#1C3D1C]/40" />
              </div>
              <p className="font-heading text-xl text-[#1C3D1C]">{t('empty')}</p>
              <p className="mt-1 text-sm text-gray-400">{t('emptyDesc')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-4">

              {/* Box header card */}
              <div className="flex items-center justify-between rounded-2xl bg-[#1C3D1C] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-[#E8967A] flex-shrink-0" />
                  <span className="font-heading text-lg text-white leading-none">{packageTitle}</span>
                </div>
                <button
                  onClick={() => setConfirmRemove(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                  aria-label={t('remove')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Delivery dates */}
              <div className="rounded-2xl bg-[#FDF6EC] px-4 py-3.5 flex flex-col gap-2">
                {cartPackage.deliveryEventDates.map((iso, i) => {
                  const d = new Date(iso);
                  return (
                    <div key={i} className="flex items-center gap-2.5">
                      <Truck className="h-4 w-4 text-[#E8967A] flex-shrink-0" />
                      <span className="text-sm font-semibold text-[#1C3D1C] capitalize">
                        {formatDeliveryDate(d, locale)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Selected meals — collapsible */}
              <div className="rounded-2xl border border-[#1C3D1C]/10 overflow-hidden">
                <button
                  onClick={() => setMealsExpanded(v => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 bg-white hover:bg-[#FDF6EC] transition-colors"
                >
                  <span className="text-sm font-bold text-[#1C3D1C]">{t('items')}</span>
                  {mealsExpanded
                    ? <ChevronUp className="h-4 w-4 text-[#1C3D1C]/40" />
                    : <ChevronDown className="h-4 w-4 text-[#1C3D1C]/40" />
                  }
                </button>

                {mealsExpanded && (
                  <div className="px-4 pb-3 bg-white flex flex-col gap-3">
                    {Object.entries(mealsByCategory).map(([category, meals]) => (
                      <div key={category}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1C3D1C]/40 mb-1.5">
                          {tCat(category as Parameters<typeof tCat>[0])}
                        </p>
                        <div className="flex flex-col gap-1">
                          {meals.map(meal => (
                            <div key={meal.id} className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C3D1C]/6 flex-shrink-0">
                                <CategoryIcon category={meal.category} className="h-3.5 w-3.5 text-[#1C3D1C]/60" />
                              </div>
                              <span className="flex-1 text-sm text-[#1C3D1C]/80 leading-snug">{meal.name}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateMealQuantity(meal.id, meal.quantity - 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1C3D1C]/8 text-[#1C3D1C]/60 hover:bg-[#1C3D1C]/15 transition-colors"
                                  aria-label="-"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-[#1C3D1C]">{meal.quantity}</span>
                                <button
                                  onClick={() => updateMealQuantity(meal.id, meal.quantity + 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1C3D1C]/8 text-[#1C3D1C]/60 hover:bg-[#1C3D1C]/15 transition-colors"
                                  aria-label="+"
                                >
                                  <Plus className="h-3 w-3" />
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
            </div>
          )}
        </div>

        {/* Footer */}
        {hasPackage && (
          <div className="border-t border-gray-100 px-5 py-4 pb-safe">
            {/* Price breakdown */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-[#1C3D1C]/60">
                {cartPackage!.packageSize}× {formatPrice(cartPackage!.boxPrice / cartPackage!.packageSize, currency)}
              </span>
              <span className="text-sm font-semibold text-[#1C3D1C]">
                {formatPrice(cartPackage!.boxPrice, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#1C3D1C]/60">{t('deliveryCost')}</span>
              <span className="text-sm font-semibold text-[#1C3D1C]">
                {formatPrice(cartPackage!.deliveryPrice, currency)}
              </span>
            </div>

            {/* Grand total */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[#1C3D1C]">{t('grandTotal')}</span>
              <span className="font-heading text-2xl text-[#1C3D1C]">
                {formatPrice(grandTotalAmount, currency)}
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
      <ConfirmModal
        isOpen={confirmRemove}
        question={t('removeConfirmQuestion')}
        confirmLabel={t('removeConfirmYes')}
        cancelLabel={t('removeConfirmNo')}
        onConfirm={() => { setConfirmRemove(false); clearCart(); closeCart(); }}
        onCancel={() => setConfirmRemove(false)}
      />
    </>
  );
}
