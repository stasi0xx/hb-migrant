'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SlidersHorizontal, Search } from 'lucide-react';
import { filterMigrantMenu } from '@/lib/migrant-delivery';
import { slugify } from '@/lib/utils';
import { parsePrice } from '@/store/cart';

import { MenuData, SelectedMeal, Filters, ALLOWED_CATEGORIES, isSoupCategory } from '@/lib/migrant-types';
import FilterPanel from '@/components/builder/FilterPanel';
import StickyProgressBar from '@/components/builder/StickyProgressBar';
import CategorySection from '@/components/builder/CategorySection';
import MobileFilterModal from '@/components/builder/MobileFilterMobile';
import { useCartStore } from '@/store/cart';

interface MigrantPackageBuilderProps {
  menuData: MenuData;
  packageSize: 3 | 6;
  slotLabel: string;
  slotDeadline?: Date;
  onChangeSlot: () => void;
  onConfirm: (selectedMeals: SelectedMeal[]) => void;
  onCancel: () => void;
}

export default function MigrantPackageBuilder({
  menuData,
  packageSize,
  slotLabel,
  slotDeadline,
  onChangeSlot,
  onConfirm,
  onCancel,
}: MigrantPackageBuilderProps) {
  const tCat = useTranslations('categories');
  const tm = useTranslations('migrant');
  const locale = useLocale();

  const filteredMenu = useMemo(() => filterMigrantMenu(menuData), [menuData]);

  const flatCategories = useMemo(() => {
    const cats: Record<string, SelectedMeal[]> = {};
    for (const [date, categoriesObj] of Object.entries(filteredMenu)) {
      for (const [catName, dishes] of Object.entries(categoriesObj)) {
        if (!ALLOWED_CATEGORIES.some(a => catName.toLowerCase().includes(a))) continue;
        if (!cats[catName]) cats[catName] = [];
        for (const dish of dishes) {
          const localizedName = dish.name_translations?.[locale] || dish.name_translations?.['en'] || dish.nazwa;
          if (!cats[catName].find(d => d.name === localizedName)) {
            cats[catName].push({
              id: `${slugify(date)}-${slugify(catName)}-${slugify(dish.nazwa)}`,
              name: localizedName,
              category: catName,
              originalPrice: parsePrice(dish.cena),
              date,
              quantity: 0,
              is_vege: dish.is_vege,
              is_spicy: dish.is_spicy,
            });
          }
        }
      }
    }
    return cats;
  }, [filteredMenu, locale]);

  const categoryKeys = Object.keys(flatCategories);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categoryKeys.map(k => [k, true]))
  );
  const [selections, setSelections] = useState<Record<string, SelectedMeal>>({});
  const cartPackage = useCartStore(s => s.cartPackage);

  // Keep selections in sync with cartPackage (covers both initial hydration
  // and external edits from CartDrawer).
  useEffect(() => {
    if (!cartPackage?.meals?.length) return;
    const next: Record<string, SelectedMeal> = {};
    for (const meal of cartPackage.meals) {
      const dish = flatCategories[meal.category]?.find(d => d.id === meal.id);
      if (dish) next[meal.id] = { ...dish, quantity: meal.quantity };
    }
    if (Object.keys(next).length > 0) setSelections(next);
  }, [flatCategories, cartPackage]);
  const [filters, setFilters] = useState<Filters>({ search: '', vege: false, spicy: false });
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const activeFilterCount = (filters.search ? 1 : 0) + (filters.vege ? 1 : 0) + (filters.spicy ? 1 : 0);

  const displayCategories = useMemo(() => {
    const result: Record<string, SelectedMeal[]> = {};
    for (const [cat, dishes] of Object.entries(flatCategories)) {
      const filtered = dishes.filter(d => {
        if (filters.search && !d.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.vege && !d.is_vege) return false;
        if (filters.spicy && !d.is_spicy) return false;
        return true;
      });
      if (filtered.length > 0) result[cat] = filtered;
    }
    return result;
  }, [flatCategories, filters]);

  const displayCategoryKeys = Object.keys(displayCategories);

  const soupSelected = Object.values(selections).filter(m => isSoupCategory(m.category)).reduce((acc, m) => acc + m.quantity, 0);
  const mainSelected = Object.values(selections).filter(m => !isSoupCategory(m.category)).reduce((acc, m) => acc + m.quantity, 0);
  const isComplete = soupSelected === packageSize && mainSelected === packageSize;

  const prevSoupSelected = useRef(soupSelected);
  const prevMainSelected = useRef(mainSelected);
  const menuRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inMenuSection, setInMenuSection] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInMenuSection(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToMenu = () => {
    setTimeout(() => {
      if (!menuRef.current) return;
      const top = menuRef.current.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 150);
  };

  useEffect(() => {
    const crossed = prevSoupSelected.current < packageSize && soupSelected >= packageSize;
    prevSoupSelected.current = soupSelected;
    if (!crossed) return;
    setOpenCategories(prev => {
      const next = { ...prev };
      for (const k of Object.keys(next)) if (isSoupCategory(k)) next[k] = false;
      return next;
    });
    scrollToMenu();
  }, [soupSelected, packageSize]);

  useEffect(() => {
    const crossed = prevMainSelected.current < packageSize && mainSelected >= packageSize;
    prevMainSelected.current = mainSelected;
    if (!crossed) return;
    setOpenCategories(prev => {
      const next = { ...prev };
      for (const k of Object.keys(next)) if (!isSoupCategory(k)) next[k] = false;
      return next;
    });
    scrollToMenu();
  }, [mainSelected, packageSize]);

  const handleAdd = (dish: SelectedMeal) => {
    const categoryCount = isSoupCategory(dish.category) ? soupSelected : mainSelected;
    if (categoryCount >= packageSize) return;
    setSelections(prev => {
      const existing = prev[dish.id];
      if (existing) return { ...prev, [dish.id]: { ...existing, quantity: existing.quantity + 1 } };
      return { ...prev, [dish.id]: { ...dish, quantity: 1 } };
    });
  };

  const handleRemove = (dishId: string) => {
    setSelections(prev => {
      const existing = prev[dishId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const next = { ...prev };
        delete next[dishId];
        return next;
      }
      return { ...prev, [dishId]: { ...existing, quantity: existing.quantity - 1 } };
    });
  };

  const handleConfirm = () => {
    if (isComplete) onConfirm(Object.values(selections));
  };

  const clearFilters = () => setFilters({ search: '', vege: false, spicy: false });

  return (
    <div ref={rootRef} className="bg-[#FDF6EC] min-h-[50vh] pb-32">
      <StickyProgressBar
        soupSelected={soupSelected}
        mainSelected={mainSelected}
        packageSize={packageSize}
        slotLabel={slotLabel}
        slotDeadline={slotDeadline}
        isComplete={isComplete}
        onChangeSlot={onChangeSlot}
        onCancel={onCancel}
        onConfirm={handleConfirm}
      />

      <div ref={menuRef} className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 pt-4">
        <div className="flex gap-5 lg:gap-6 items-start">
          <aside className="hidden lg:block w-52 xl:w-56 shrink-0 sticky top-[calc(4rem+88px)]">
            <div className="bg-white rounded-2xl border border-[#1C3D1C]/10 p-4 shadow-sm">
              <FilterPanel filters={filters} setFilters={setFilters} activeFilterCount={activeFilterCount} clearFilters={clearFilters} />
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {displayCategoryKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-[#1C3D1C]/40">
                <Search className="h-8 w-8 mb-3 opacity-40" />
                <p className="text-sm font-medium">No dishes match your filters.</p>
                <button onClick={clearFilters} className="mt-2 text-xs text-[#E8927C] hover:underline">
                  {tm('filterClear')}
                </button>
              </div>
            ) : (
              displayCategoryKeys.map(category => (
                <CategorySection
                  key={category}
                  category={category}
                  localizedCategory={tCat(category as Parameters<typeof tCat>[0])}
                  dishes={displayCategories[category]}
                  isOpen={openCategories[category] ?? true}
                  onToggle={() => setOpenCategories(prev => ({ ...prev, [category]: !(prev[category] ?? true) }))}
                  selections={selections}
                  soupSelected={soupSelected}
                  mainSelected={mainSelected}
                  packageSize={packageSize}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setFilterModalOpen(true)}
        className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-[#1B4332] px-4 py-3 shadow-xl text-white font-bold text-sm active:scale-95 transition-all duration-200 ${inMenuSection ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}
      >
        <SlidersHorizontal className="h-4 w-4" />
        {tm('filterButton')}
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8927C] text-white text-[10px] font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>

      <MobileFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        activeFilterCount={activeFilterCount}
        clearFilters={clearFilters}
      />
    </div>
  );
}