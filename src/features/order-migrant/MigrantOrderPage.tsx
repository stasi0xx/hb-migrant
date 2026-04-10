'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import MigrantPackageBuilder, { SelectedMeal } from '@/components/migrant/MigrantPackageBuilder';
import { useCartStore } from '@/store/cart';
import {
  getAvailableMigrantWindows,
  getAvailableMigrantWeekSlots,
  formatWindowDeadline,
  formatDeliveryDate,
  formatEatingDays,
  type MigrantWindow,
  type MigrantWeekSlot,
} from '@/lib/migrant-delivery';
import staticMenuData from '@/data/menu.json';
import { Package, Truck, Clock, CalendarDays } from 'lucide-react';

type CategoryData = { nazwa: string; cena: string; is_vege?: boolean; is_spicy?: boolean }[];
type MenuData = Record<string, Record<string, CategoryData>>;
type PackageSize = 3 | 6;

export default function MigrantOrderPage() {
  const tm = useTranslations('migrant');
  const tCat = useTranslations('categories');
  const router = useRouter();
  const addItem = useCartStore(s => s.addItem);
  const clearCart = useCartStore(s => s.clearCart);
  const setPackageMeta = useCartStore(s => s.setPackageMeta);

  const bearRef = useRef<HTMLImageElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);

  const [menuData, setMenuData] = useState<MenuData>(staticMenuData as MenuData);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const bear = bearRef.current;
    const section = step1Ref.current;
    if (!bear || !section) return;

    const tween = gsap.fromTo(
      bear,
      { x: -120, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(({ menu }) => {
        if (menu && Object.keys(menu).length > 0) setMenuData(menu);
      })
      .catch(() => { });
  }, []);

  const allMenuDates = Object.keys(menuData);
  const availableWindows = useMemo(() => getAvailableMigrantWindows(allMenuDates), [allMenuDates]);
  const availableWeekSlots = useMemo(() => getAvailableMigrantWeekSlots(allMenuDates), [allMenuDates]);

  const [packageSize, setPackageSize] = useState<PackageSize | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<MigrantWindow | null>(null);
  const [selectedWeekSlot, setSelectedWeekSlot] = useState<MigrantWeekSlot | null>(null);

  // Menu data filtered to only the selected slot's eating days
  const slotMenuData = useMemo<MenuData>(() => {
    const dates = selectedWindow
      ? selectedWindow.deliveryDays
      : selectedWeekSlot
        ? [...selectedWeekSlot.windowA.deliveryDays, ...selectedWeekSlot.windowB.deliveryDays]
        : [];
    return Object.fromEntries(
      dates.map(d => [d, menuData[d]]).filter(([, v]) => v != null)
    ) as MenuData;
  }, [selectedWindow, selectedWeekSlot, menuData]);

  const isSlotSelected = selectedWindow !== null || selectedWeekSlot !== null;

  const handlePackageSelect = (size: PackageSize) => {
    setPackageSize(size);
    setSelectedWindow(null);
    setSelectedWeekSlot(null);
  };

  const handleWindowSelect = (win: MigrantWindow) => {
    setSelectedWindow(win);
    setSelectedWeekSlot(null);
  };

  const handleWeekSlotSelect = (slot: MigrantWeekSlot) => {
    setSelectedWeekSlot(slot);
    setSelectedWindow(null);
  };

  const resetSelection = () => {
    setPackageSize(null);
    setSelectedWindow(null);
    setSelectedWeekSlot(null);
  };

  const resetSlot = () => {
    setSelectedWindow(null);
    setSelectedWeekSlot(null);
  };

  const handlePackageConfirm = (selectedMeals: SelectedMeal[]) => {
    clearCart();

    // Store actual Trunkrs delivery event dates (not eating days) for checkout display
    const deliveryEventDates: Date[] = selectedWindow
      ? [selectedWindow.deliveryDate]
      : selectedWeekSlot
        ? [selectedWeekSlot.windowA.deliveryDate, selectedWeekSlot.windowB.deliveryDate]
        : [];
    setPackageMeta({
      deliveryEventDates: deliveryEventDates.map(d => d.toISOString()),
      eatingDays: packageSize!,
    });

    selectedMeals.forEach(meal => {
      for (let i = 0; i < meal.quantity; i++) {
        addItem({
          id: meal.id,
          name: meal.name,
          category: meal.category,
          originalPrice: meal.originalPrice,
          date: meal.date,
        });
      }
    });
    router.push('/checkout');
  };

  // Summary label for the selected slot
  const slotSummaryLabel = selectedWindow
    ? selectedWindow.dayRangeLabel
    : selectedWeekSlot
      ? selectedWeekSlot.weekLabel
      : '';

  const slotDeadline = selectedWindow?.deadline ?? selectedWeekSlot?.deadline;

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      <div className="h-16" />

      <HeroSection />
      <TrustBar />
      <FoodGallery />
      <Differentiators />

      <div id="menu-section" className="relative w-full">
        <MenuParallaxBackground />

        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="hidden lg:block absolute top-40 -left-[15%] w-[600px] h-[600px] bg-[#ed8788]/20 rounded-full blur-[120px]" />
          <div className="hidden lg:block absolute top-[30%] -right-[10%] w-[500px] h-[500px] bg-[#1B4332]/10 rounded-full blur-[100px]" />
          <div className="hidden lg:block absolute bottom-[20%] -left-[10%] w-[700px] h-[700px] bg-[#E8967A]/15 rounded-full blur-[120px]" />
          <div className="hidden lg:block absolute bottom-[5%] -right-[15%] w-[600px] h-[600px] bg-[#EAF0CE]/40 rounded-full blur-[100px]" />
        </div>

        {/* ── STEP 1: Package selector ───────────────────────────────────────── */}
        {!packageSize && (
          <div ref={step1Ref} className="bg-[#FDF6EC] relative z-10 overflow-hidden">
            {/* Bear — desktop only */}
            <Image
              ref={bearRef}
              src="/images/bear-left.webp"
              alt=""
              width={340}
              height={480}
              className="hidden lg:block absolute left-[-6%] bottom-0 h-[75%] w-auto object-contain object-bottom pointer-events-none select-none"
              style={{ opacity: 0 }}
            />
            <div className="mx-auto max-w-2xl px-6 py-16 md:py-24 text-center">

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-3 mb-10">
                <span className="h-8 w-8 rounded-full bg-[#E8927C] text-white font-black text-sm flex items-center justify-center">1</span>
                <span className="h-px w-10 bg-[#1B4332]/20" />
                <span className="h-8 w-8 rounded-full bg-[#1B4332]/10 text-[#1B4332]/30 font-black text-sm flex items-center justify-center">2</span>
                <span className="h-px w-10 bg-[#1B4332]/20" />
                <span className="h-8 w-8 rounded-full bg-[#1B4332]/10 text-[#1B4332]/30 font-black text-sm flex items-center justify-center">3</span>
              </div>

              <h2 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tight text-[#1B4332] mb-12">
                {tm('packageTitle')}
              </h2>

              {availableWindows.length === 0 ? (
                <p className="text-[#1B4332]/60 text-base mt-4">{tm('noWindowAvailable')}</p>
              ) : (
                <div className="flex flex-col gap-4 mt-2">
                  {/* Featured: 6-day */}
                  <button
                    onClick={() => handlePackageSelect(6)}
                    disabled={availableWeekSlots.length === 0}
                    className="relative flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-[#D4A017]/10 hover:bg-[#D4A017]/20 border-2 border-[#D4A017]/50 hover:border-[#D4A017] px-7 py-7 text-[#1B4332] transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-left"
                  >
                    <Package className="h-11 w-11 text-[#D4A017] flex-shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1 items-center sm:items-start">
                      <span className="font-heading font-black text-2xl uppercase">{tm('package6days')}</span>
                      <span className="text-[#1B4332]/60 text-sm">{tm('package6daysDesc')}</span>
                      <div className="flex gap-3 mt-1 text-sm text-[#1B4332]/60">
                        <span>6× {tCat('Zupy')}</span>
                        <span className="text-[#1B4332]/25">·</span>
                        <span>6× {tCat('Obiady')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-end gap-1 flex-shrink-0">
                      <span className="text-2xl font-black text-[#D4A017]">{tm('price6days')}</span>
                      <span className="text-xs text-[#1B4332]/40">{tm('perDay')}</span>
                    </div>
                    <span className="absolute -top-2 -right-2 rounded-full bg-[#D4A017] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                      {tm('bestValue')}
                    </span>
                  </button>

                  {/* Secondary: 3-day */}
                  <button
                    onClick={() => handlePackageSelect(3)}
                    className="relative flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-[#1B4332]/5 hover:bg-[#1B4332]/10 border border-[#1B4332]/15 hover:border-[#E8927C]/60 px-6 py-5 text-[#1B4332] transition-all active:scale-[0.99] text-left"
                  >
                    <Package className="h-8 w-8 text-[#E8927C] flex-shrink-0" />
                    <div className="flex flex-col gap-1 flex-1 items-center sm:items-start">
                      <span className="font-heading font-black text-xl uppercase">{tm('package3days')}</span>
                      <span className="text-[#1B4332]/50 text-sm">{tm('package3daysDesc')}</span>
                      <div className="flex gap-3 mt-1 text-xs text-[#1B4332]/45">
                        <span>3× {tCat('Zupy')}</span>
                        <span className="text-[#1B4332]/25">·</span>
                        <span>3× {tCat('Obiady')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-end gap-1 flex-shrink-0">
                      <span className="text-xl font-black text-[#E8927C]">{tm('price3days')}</span>
                      <span className="text-xs text-[#1B4332]/40">{tm('perDay')}</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Slot selector ──────────────────────────────────────────── */}
        {packageSize && !isSlotSelected && (
          <div className="bg-[#1B4332] relative z-10">
            <div className="mx-auto max-w-2xl px-5 py-10 md:py-14">
              <button
                onClick={resetSelection}
                className="mb-6 text-sm text-white/40 hover:text-white/80 transition-colors"
              >
                ← {tm('changePackage')}
              </button>
              <p className="text-[#E8927C] font-semibold text-xs uppercase tracking-widest mb-3 text-center">
                {tm('stepWindow')}
              </p>
              <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tight text-white mb-8 text-center">
                {tm('windowTitle')}
              </h2>

              {/* 3-day: individual slot cards */}
              {packageSize === 3 && (
                <div className="flex flex-col gap-4">
                  {availableWindows.map(win => (
                    <button
                      key={win.id}
                      onClick={() => handleWindowSelect(win)}
                      className="flex flex-col gap-3 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-[#E8927C] p-5 text-left text-white transition-all active:scale-[0.99]"
                    >
                      {/* Delivery date */}
                      <div className="flex items-center gap-2.5">
                        <Truck className="h-5 w-5 text-[#E8927C] flex-shrink-0" />
                        <span className="font-bold text-sm">
                          {tm('deliveryOn')}: {formatDeliveryDate(win.deliveryDate)}
                        </span>
                      </div>

                      {/* Eating days */}
                      <div className="flex items-center gap-2.5">
                        <CalendarDays className="h-5 w-5 text-white/50 flex-shrink-0" />
                        <span className="text-white/70 text-sm">
                          {tm('youEat')}: {formatEatingDays(win.deliveryDays)}
                        </span>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-5 w-5 text-white/40 flex-shrink-0" />
                        <span className="text-white/50 text-xs">
                          {tm('deadlineLabel')}: {formatWindowDeadline(win.deadline)}
                        </span>
                      </div>
                    </button>
                  ))}

                  {availableWindows.length === 0 && (
                    <p className="text-white/60 text-base text-center">{tm('noWindowAvailable')}</p>
                  )}
                </div>
              )}

              {/* 6-day: week slot cards */}
              {packageSize === 6 && (
                <div className="flex flex-col gap-4">
                  {availableWeekSlots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleWeekSlotSelect(slot)}
                      className="flex flex-col gap-3 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-[#D4A017] p-5 text-left text-white transition-all active:scale-[0.99]"
                    >
                      {/* Week label */}
                      <span className="font-heading font-black text-xl text-[#D4A017]">
                        {tm('weekOf')} {slot.weekLabel}
                      </span>

                      {/* Two deliveries */}
                      <div className="flex items-start gap-2.5">
                        <Truck className="h-5 w-5 text-[#D4A017] flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1 text-sm font-semibold">
                          <span>{formatDeliveryDate(slot.windowA.deliveryDate)}</span>
                          <span>{formatDeliveryDate(slot.windowB.deliveryDate)}</span>
                        </div>
                      </div>

                      {/* All eating days */}
                      <div className="flex items-center gap-2.5">
                        <CalendarDays className="h-5 w-5 text-white/50 flex-shrink-0" />
                        <span className="text-white/70 text-sm">
                          {tm('youEat')}: {formatEatingDays([
                            ...slot.windowA.deliveryDays,
                            ...slot.windowB.deliveryDays,
                          ])}
                        </span>
                      </div>

                      {/* Binding deadline */}
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-5 w-5 text-white/40 flex-shrink-0" />
                        <span className="text-white/50 text-xs">
                          {tm('deadlineLabel')}: {formatWindowDeadline(slot.deadline)}
                        </span>
                      </div>
                    </button>
                  ))}

                  {availableWeekSlots.length === 0 && (
                    <p className="text-white/60 text-base text-center">{tm('noWindowAvailable')}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Menu ──────────────────────────────────────────────────── */}
        {packageSize && isSlotSelected && Object.keys(slotMenuData).length > 0 && (
          <div className="relative z-10">
            <MigrantPackageBuilder
              menuData={slotMenuData}
              packageSize={packageSize}
              slotLabel={slotSummaryLabel}
              slotDeadline={slotDeadline}
              onChangeSlot={resetSlot}
              onConfirm={handlePackageConfirm}
              onCancel={resetSelection}
            />
          </div>
        )}
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
