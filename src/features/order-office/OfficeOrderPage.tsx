'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import MenuDayTabs from '@/components/MenuDayTabs';
import MenuCategory from '@/components/MenuCategory';
import CategoryIcon from '@/components/CategoryIcon';
import CartBar from '@/components/CartBar';
import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import FoodGallery from '@/components/FoodGallery';
import HowItWorks from '@/components/HowItWorks';
import Differentiators from '@/components/Differentiators';
import FaqSection from '@/components/FaqSection';
import FooterSection from '@/components/FooterSection';
import SocialProof from '@/components/SocialProof';
import MenuParallaxBackground from '@/components/MenuParallaxBackground';
import { getOfficeDeliveryDates, getAllOfficeMenuDates, getOrderDeadline } from '@/lib/office-delivery';
import staticMenuData from '@/data/menu.json';
import { Truck } from 'lucide-react';

type CategoryData = { nazwa: string; name_translations?: Record<string, string>; cena: string; is_vege?: boolean; is_spicy?: boolean }[];
type MenuData = Record<string, Record<string, CategoryData>>;

export default function OfficeOrderPage() {
  const t = useTranslations('menu');
  const tCat = useTranslations('categories');
  const locale = useLocale();

  const [menuData, setMenuData] = useState<MenuData>(staticMenuData as MenuData);

  useEffect(() => {
    fetch('/api/menu')
      .then((r) => r.json())
      .then(({ menu }) => {
        if (menu && Object.keys(menu).length > 0) setMenuData(menu);
      })
      .catch(() => {/* fallback to static */});
  }, []);

  // D+4 office delivery date logic
  const allDates = getAllOfficeMenuDates(Object.keys(menuData));
  const availableDates = getOfficeDeliveryDates(Object.keys(menuData));
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const dates = getOfficeDeliveryDates(Object.keys(menuData));
    setSelectedDate((prev) => (prev && menuData[prev] ? prev : (dates[0] ?? '')));
  }, [menuData]);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    const dayMenu = menuData[selectedDate] as Record<string, CategoryData> | undefined;
    if (dayMenu) Object.keys(dayMenu).forEach((c) => { initial[c] = true; });
    setOpenCategories(initial);
  }, [selectedDate, menuData]);

  const scrollToCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: true }));
    setTimeout(() => {
      const el = document.getElementById(`category-${category}`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 160;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  };

  const dayMenu = selectedDate ? (menuData[selectedDate] as Record<string, CategoryData> | undefined) : undefined;
  const categories = dayMenu ? Object.keys(dayMenu) : [];
  const getdishes = (cat: string) => dayMenu?.[cat] ?? [];

  // Order deadline for currently selected date
  const orderDeadline = selectedDate ? getOrderDeadline(selectedDate) : null;
  const deadlineFormatted = orderDeadline
    ? orderDeadline.toLocaleDateString(locale, { weekday: 'long' }) +
      `, ${String(orderDeadline.getDate()).padStart(2, '0')}.${String(orderDeadline.getMonth() + 1).padStart(2, '0')} – 10:00`
    : null;

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      <div className="h-16" />

      <HeroSection />
      <TrustBar />
      <FoodGallery />
      <Differentiators />

      <div id="menu-section" className="relative w-full">
        <MenuParallaxBackground />

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="hidden lg:block absolute top-40 -left-[15%] w-[600px] h-[600px] bg-[#ed8788]/20 rounded-full blur-[120px]" />
          <div className="hidden lg:block absolute top-[30%] -right-[10%] w-[500px] h-[500px] bg-[#1B4332]/10 rounded-full blur-[100px]" />
          <div className="hidden lg:block absolute bottom-[20%] -left-[10%] w-[700px] h-[700px] bg-[#E8967A]/15 rounded-full blur-[120px]" />
          <div className="hidden lg:block absolute bottom-[5%] -right-[15%] w-[600px] h-[600px] bg-[#EAF0CE]/40 rounded-full blur-[100px]" />
        </div>

        {/* Delivery info bar — Trunkrs + 4-day lead time */}
        <div className="bg-[#1B4332] relative z-10">
          <div className="mx-auto max-w-2xl px-5 py-6 md:py-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Truck className="h-6 w-6 text-[#E8967A]" />
              <p className="font-heading font-black text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight text-white drop-shadow-sm">
                {t('deliveryWindow')}
              </p>
            </div>
            <p className="text-sm md:text-base text-[#ed8788] font-medium">
              {t('orderDeadlineOffice')}
            </p>
            {deadlineFormatted && (
              <p className="text-xs text-white/60 mt-1">
                {t('orderDeadlineFor')} {selectedDate}: {deadlineFormatted}
              </p>
            )}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80">
              <span className="font-bold text-[#E8967A]">€5,00</span>
              <span>{t('deliveryCostLabel')}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 relative z-10">
          <div className="sticky top-16 z-20 bg-[#FDF6EC] pt-3 md:pt-4 lg:pt-5 pb-2 md:pb-3 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 shadow-sm">
            <MenuDayTabs
              dates={allDates}
              availableDates={availableDates}
              selectedDate={selectedDate ?? ''}
              onSelectDate={setSelectedDate}
            />
            {categories.length > 0 && (
              <div className="flex gap-2 mt-2 w-max mx-auto max-w-full overflow-x-auto scrollbar-hide px-1 pb-1">
                {categories.map((category) => {
                  const label = tCat(category as Parameters<typeof tCat>[0]);
                  const firstWord = label.split(' ')[0];
                  return (
                    <button
                      key={category}
                      onClick={() => scrollToCategory(category)}
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-white border border-[#1B4332]/20 px-3 py-1 text-[#1B4332] transition-all hover:border-[#1B4332]/50 hover:shadow-sm active:scale-95"
                    >
                      <CategoryIcon category={category} className="h-3.5 w-3.5 text-[#ed8788]" />
                      <span className="text-[11px] font-semibold whitespace-nowrap">{firstWord}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pb-32 pt-4">
            {availableDates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-6xl mb-4">🐻</span>
                <p className="font-heading font-black text-2xl text-[#1B4332]">{t('noAvailableDays')}</p>
              </div>
            ) : dayMenu ? (
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <MenuCategory
                    key={category}
                    category={category}
                    dishes={getdishes(category)}
                    date={selectedDate}
                    isOpen={openCategories[category] ?? true}
                    onToggle={() =>
                      setOpenCategories((prev) => ({ ...prev, [category]: !(prev[category] ?? true) }))
                    }
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <HowItWorks />
      <SocialProof />
      <FaqSection />
      <FooterSection />

      <CartBar />
      <CartDrawer />
    </div>
  );
}
