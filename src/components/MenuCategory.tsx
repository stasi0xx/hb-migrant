'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import DishCard from './DishCard';
import CategoryIcon from './CategoryIcon';
import { slugify } from '@/lib/utils';

interface Dish {
  nazwa: string;
  cena: string;
}

interface MenuCategoryProps {
  category: string;
  dishes: Dish[];
  date: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function MenuCategory({ category, dishes, date, isOpen: isOpenProp, onToggle }: MenuCategoryProps) {
  const t = useTranslations('categories');
  const [localOpen, setLocalOpen] = useState(true);

  const isOpen = isOpenProp !== undefined ? isOpenProp : localOpen;
  const handleToggle = onToggle ?? (() => setLocalOpen(v => !v));

  const localizedCategory = t(category as Parameters<typeof t>[0]);

  return (
    <div id={`category-${category}`} className="rounded-2xl bg-[#FDF6EC] overflow-hidden border border-[#1C3D1C]/10">
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-[#1C3D1C]/5"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1C3D1C] text-[#E8967A]">
            <CategoryIcon category={category} className="h-4 w-4" />
          </span>
          <span className="font-heading text-lg text-[#1C3D1C]">{localizedCategory}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-600 text-[#1C3D1C]/50">{dishes.length}</span>
          <svg
            className={`h-5 w-5 text-[#1C3D1C]/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          {dishes.map((dish, idx) => {
            const id = `${slugify(date)}-${slugify(category)}-${slugify(dish.nazwa)}-${idx}`;
            return (
              <DishCard
                key={id}
                id={id}
                name={dish.nazwa}
                category={category}
                priceStr={dish.cena}
                date={date}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
