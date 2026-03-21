'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import MenuDayTabs from '@/components/MenuDayTabs';
import MenuCategory from '@/components/MenuCategory';
import CategoryIcon from '@/components/CategoryIcon';
import CartBar from '@/components/CartBar';
import CartDrawer from '@/components/CartDrawer';
import LanguageToggle from '@/components/LanguageToggle';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import HowItWorks from '@/components/HowItWorks';
import Differentiators from '@/components/Differentiators';
import FaqSection from '@/components/FaqSection';
import FooterSection from '@/components/FooterSection';
import SocialProof from '@/components/SocialProof';
import { useCartStore } from '@/store/cart';
import { getAvailableDates } from '@/lib/utils';
import menuData from '@/data/menu.json';

type MenuData = typeof menuData;
type CategoryData = { nazwa: string; cena: string }[];

const MENU_DATES = Object.keys(menuData) as (keyof MenuData)[];

export default function HomePage() {
  const t = useTranslations('menu');
  const locale = useLocale();
  const { openCart, itemCount } = useCartStore();

  const tCat = useTranslations('categories');
  const availableDates = getAvailableDates(MENU_DATES);
  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates.length > 0 ? availableDates[0] : MENU_DATES[0]
  );
  const [hasMounted, setHasMounted] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  const count = hasMounted ? itemCount() : 0;
  const dayMenu = menuData[selectedDate as keyof MenuData] as Record<string, CategoryData> | undefined;
  const categories = dayMenu ? Object.keys(dayMenu) : [];

  const q = searchQuery.trim().toLowerCase();
  const filteredCategories = q
    ? categories.filter((cat) =>
      (dayMenu?.[cat] ?? []).some((d) => d.nazwa.toLowerCase().includes(q))
    )
    : categories;
  const getdishes = (cat: string) =>
    q ? (dayMenu?.[cat] ?? []).filter((d) => d.nazwa.toLowerCase().includes(q)) : (dayMenu?.[cat] ?? []);

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 overflow-hidden bg-[#1B4332] shadow-lg [transform:translateZ(0)] [backface-visibility:hidden]">
        <div className="mx-auto max-w-2xl px-5 py-3.5">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 flex-shrink-0 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj dania..."
                className="flex-1 bg-transparent text-white placeholder-white/40 text-sm font-medium outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {/* Logo */}
              <img src="/images/logo.webp" alt="Głodny Niedźwiedź" className="h-9 w-auto" />

              {/* Right actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </button>
                <LanguageToggle />
                <button
                  onClick={openCart}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8927C] text-[10px] font-bold text-white">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer pod fixed header */}
      <div className="h-16" />

      {/* Hero → TrustBar → Differentiators */}
      <HeroSection />
      <TrustBar />
      <Differentiators />

      {/* Menu section */}
      <div id="menu-section">
        {/* Order info bar */}
        <div className="bg-[#1B4332]">
          <div className="mx-auto max-w-2xl overflow-hidden">
            {/* Bear delivery van — slides in from right, full width */}
            <div className="animate-slide-in-right">
              <img
                src="/images/bear-delivery.webp"
                alt=""
                className="w-full h-auto object-contain"
              />
            </div>
            {/* Text below */}
            <div className="px-5 pb-4 text-center">
              <p className="font-heading font-black text-2xl uppercase tracking-tight text-white">
                {t('deliveryWindow')}
              </p>
              <p className="text-sm text-[#E8927C] mt-0.5">{t('orderDeadline')}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-2xl px-4">
          {/* Day tabs + category shortcuts */}
          <div className="sticky top-16 z-20 bg-[#FDF6EC] pt-3 pb-2 -mx-4 px-4 shadow-sm">
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
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-white border border-[#1B4332]/20 px-3 py-1 text-[#1B4332] transition-all hover:border-[#1B4332]/50 hover:shadow-sm active:scale-95"
                    >
                      <CategoryIcon category={category} className="h-3.5 w-3.5 text-[#E8927C]" />
                      <span className="text-[11px] font-semibold whitespace-nowrap">{firstWord}</span>
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
                <p className="font-heading font-black text-2xl text-[#1B4332]">{t('noAvailableDays')}</p>
              </div>
            ) : dayMenu ? (
              <div className="flex flex-col gap-3">
                {filteredCategories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="text-5xl mb-3">🐻</span>
                    <p className="font-heading font-black text-lg text-[#1B4332]">Brak wyników</p>
                    <p className="text-sm text-[#1B4332]/50 mt-1">Spróbuj innej nazwy</p>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <MenuCategory
                      key={category}
                      category={category}
                      dishes={getdishes(category)}
                      date={selectedDate}
                      isOpen={q ? true : (openCategories[category] ?? true)}
                      onToggle={() => setOpenCategories(prev => ({ ...prev, [category]: !(prev[category] ?? true) }))}
                    />
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Below-menu sections */}
      <HowItWorks />
      <SocialProof />
      <FaqSection />
      <FooterSection />

      {/* Cart components */}
      <CartBar />
      <CartDrawer />
    </div>
  );
}
