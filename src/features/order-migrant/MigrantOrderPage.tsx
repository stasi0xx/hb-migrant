'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import { SelectedMeal } from '@/lib/migrant-types';
import MigrantPackageBuilder from '@/components/migrant/MigrantPackageBuilder';
import PackageSelector from '@/components/migrant/PackageSelector';
import SlotSelector from '@/components/migrant/SlotSelector';
import { useCartStore } from '@/store/cart';
import {
  getAvailableMigrantWindows,
  getAvailableMigrantWeekSlots,
  type MigrantWindow,
  type MigrantWeekSlot,
} from '@/lib/migrant-delivery';
import staticMenuData from '@/data/menu.json';
import { getSiteConfig } from '@/config/sites';

type CategoryData = { nazwa: string; cena: string; is_vege?: boolean; is_spicy?: boolean }[];
type MenuData = Record<string, Record<string, CategoryData>>;
type PackageSize = 3 | 6;

export default function MigrantOrderPage() {
  const router = useRouter();
  const addItem = useCartStore(s => s.addItem);
  const clearCart = useCartStore(s => s.clearCart);
  const setPackageMeta = useCartStore(s => s.setPackageMeta);
  const setCartPackage = useCartStore(s => s.setCartPackage);

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

  const [menuReady, setMenuReady] = useState(false);

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(({ menu }) => {
        if (menu && Object.keys(menu).length > 0) setMenuData(menu);
      })
      .catch(() => { })
      .finally(() => setMenuReady(true));
  }, []);

  const allMenuDates = Object.keys(menuData);
  const availableWindows = useMemo(() => getAvailableMigrantWindows(allMenuDates), [allMenuDates]);
  const availableWeekSlots = useMemo(() => getAvailableMigrantWeekSlots(allMenuDates), [allMenuDates]);

  const cartPackage = useCartStore(s => s.cartPackage);

  const [packageSize, setPackageSize] = useState<PackageSize | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<MigrantWindow | null>(null);
  const [selectedWeekSlot, setSelectedWeekSlot] = useState<MigrantWeekSlot | null>(null);

  // Restore state from a persisted cart once the fresh menu is loaded.
  // React 18 batches setMenuData + setMenuReady → by the time this effect fires,
  // availableWindows is already computed from the fresh API data.
  // If the saved slot is no longer available (deadline passed), only packageSize is
  // restored and the user lands on step 2 to pick a new slot.
  useEffect(() => {
    if (!menuReady || !cartPackage) return;

    setPackageSize(cartPackage.packageSize);

    if (cartPackage.packageSize === 3) {
      const targetIso = cartPackage.deliveryEventDates[0];
      const match = availableWindows.find(w => w.deliveryDate.toISOString() === targetIso);
      if (match) setSelectedWindow(match);
    } else {
      const [isoA, isoB] = cartPackage.deliveryEventDates;
      const match = availableWeekSlots.find(
        s =>
          s.windowA.deliveryDate.toISOString() === isoA &&
          s.windowB.deliveryDate.toISOString() === isoB
      );
      if (match) setSelectedWeekSlot(match);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuReady]);

  // Menu data filtered to only the selected slot's eating days
  const slotMenuData = useMemo<MenuData>(() => {
    // 3-day: use the selected window's menu week
    // 6-day: use only the LATER delivery's menu week (windowB)
    const dates = selectedWindow
      ? (selectedWindow.menuDays ?? [])
      : selectedWeekSlot
        ? (selectedWeekSlot.windowB.menuDays ?? [])
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
    const deliveryEventIsos = deliveryEventDates.map(d => d.toISOString());

    setPackageMeta({
      deliveryEventDates: deliveryEventIsos,
      eatingDays: packageSize!,
    });

    // Build the box summary for cart display
    const site = getSiteConfig();
    const foodCostPerDay = site.checkout.packageFoodCostPerDay ?? 9.98;
    const deliveryCostPerDay = site.delivery.type === 'per-day' ? (site.delivery.costPerDay ?? 1.66) : 0;
    const boxPrice = parseFloat((packageSize! * foodCostPerDay).toFixed(2));
    const deliveryPrice = parseFloat((packageSize! * deliveryCostPerDay).toFixed(2));
    setCartPackage({
      packageSize: packageSize!,
      deliveryEventDates: deliveryEventIsos,
      meals: selectedMeals.map(m => ({ id: m.id, name: m.name, category: m.category, quantity: m.quantity })),
      boxPrice,
      deliveryPrice,
      totalPrice: parseFloat((boxPrice + deliveryPrice).toFixed(2)),
    });

    // Keep items populated for checkout API compatibility
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
            <PackageSelector
              availableWindows={availableWindows}
              availableWeekSlots={availableWeekSlots}
              onSelect={handlePackageSelect}
            />
          </div>
        )}

        {/* ── STEP 2: Slot selector ──────────────────────────────────────────── */}
        {packageSize && !isSlotSelected && (
          <div className="bg-[#FDF6EC] relative z-10 overflow-hidden">
            <SlotSelector
              packageSize={packageSize}
              availableWindows={availableWindows}
              availableWeekSlots={availableWeekSlots}
              onWindowSelect={handleWindowSelect}
              onWeekSlotSelect={handleWeekSlotSelect}
              onBack={resetSelection}
            />
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

      <CartDrawer />
    </div>
  );
}
