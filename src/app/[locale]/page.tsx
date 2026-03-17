'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import MenuDayTabs from '@/components/MenuDayTabs';
import MenuCategory from '@/components/MenuCategory';
import CategoryIcon from '@/components/CategoryIcon';
import CartBar from '@/components/CartBar';
import CartDrawer from '@/components/CartDrawer';
import LanguageToggle from '@/components/LanguageToggle';
import { useCartStore } from '@/store/cart';
import { getAvailableDates } from '@/lib/utils';
import menuData from '@/data/menu.json';

type MenuData = typeof menuData;
type CategoryData = { nazwa: string; cena: string }[];

const MENU_DATES = Object.keys(menuData) as (keyof MenuData)[];

export default function HomePage() {
  const t = useTranslations('menu');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const { openCart, itemCount } = useCartStore();

  const tCat = useTranslations('categories');
  const availableDates = getAvailableDates(MENU_DATES);
  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates.length > 0 ? availableDates[0] : MENU_DATES[0]
  );
  const [hasMounted, setHasMounted] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    const dayMenu = menuData[selectedDate as keyof MenuData] as Record<string, CategoryData> | undefined;
    if (dayMenu) Object.keys(dayMenu).forEach(c => { initial[c] = true; });
    setOpenCategories(initial);
  }, [selectedDate]);

  const scrollToCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: true }));
    setTimeout(() => {
      const el = document.getElementById(`category-${category}`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 160;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  };

  const count = hasMounted ? itemCount() : 0;
  const dayMenu = menuData[selectedDate as keyof MenuData] as Record<string, CategoryData> | undefined;
  const categories = dayMenu ? Object.keys(dayMenu) : [];

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#1C3D1C] shadow-lg">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8967A]">
                <span className="font-heading text-base text-white leading-none">GN</span>
              </div>
              <div>
                <p className="font-heading text-lg leading-none text-white">{tNav('title')}</p>
                <p className="text-[10px] font-700 uppercase tracking-widest text-[#E8967A] opacity-80">
                  {tNav('subtitle')}
                </p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <button
                onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8967A] text-[10px] font-800 text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-[#1C3D1C] pb-5">
        <div className="mx-auto max-w-2xl px-4 pt-2 pb-4">
          <div className="rounded-2xl bg-white/10 px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🐻</span>
            <div>
              <p className="text-sm font-700 text-white">{t('orderDeadline')}</p>
              <p className="text-xs text-[#E8967A]">{t('deliveryWindow')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-2xl px-4">
        {/* Day tabs + category shortcuts */}
        <div className="sticky top-[64px] z-20 bg-[#FDF6EC] pt-3 pb-2 -mx-4 px-4 shadow-sm">
          <MenuDayTabs
            dates={MENU_DATES}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          {categories.length > 0 && (
            <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => {
                const label = tCat(category as Parameters<typeof tCat>[0]);
                const firstWord = label.split(' ')[0];
                return (
                  <button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-white border border-[#1C3D1C]/20 px-3 py-1 text-[#1C3D1C] transition-all hover:border-[#1C3D1C]/50 hover:shadow-sm active:scale-95"
                  >
                    <CategoryIcon category={category} className="h-3.5 w-3.5 text-[#E8967A]" />
                    <span className="text-[11px] font-600 whitespace-nowrap">{firstWord}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="pb-32 pt-4">
          {availableDates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-6xl mb-4">🐻</span>
              <p className="font-heading text-2xl text-[#1C3D1C]">{t('noAvailableDays')}</p>
            </div>
          ) : dayMenu ? (
            <div className="flex flex-col gap-3">
              {categories.map((category) => (
                <MenuCategory
                  key={category}
                  category={category}
                  dishes={dayMenu[category]}
                  date={selectedDate}
                  isOpen={openCategories[category] ?? true}
                  onToggle={() => setOpenCategories(prev => ({ ...prev, [category]: !(prev[category] ?? true) }))}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Cart components */}
      <CartBar />
      <CartDrawer />
    </div>
  );
}
