'use client';

import { useCartStore, parsePrice, ONLINE_DISCOUNT } from '@/store/cart';
import { getSiteConfig } from '@/config/sites';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import DishModal from './DishModal';
import CategoryIcon from './CategoryIcon';
import { Leaf, Flame, Utensils } from 'lucide-react';

const { currency, onlineDiscount } = getSiteConfig();
const currencySymbol = currency === 'EUR' ? '€' : 'zł';

function formatPrice(amount: number): string {
  if (currency === 'EUR') {
    return `€${amount.toFixed(2).replace('.', ',')}`;
  }
  return `${amount.toFixed(2).replace('.', ',')} zł`;
}

interface DishCardProps {
  id: string;
  name: string;
  category: string;
  priceStr: string;
  date: string;
  isVege?: boolean;
  isSpicy?: boolean;
}

export default function DishCard({ id, name, category, priceStr, date, isVege, isSpicy }: DishCardProps) {
  const t = useTranslations('menu');
  const { items, addItem, removeItem, updateQuantity } = useCartStore();
  const [justAdded, setJustAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const originalPrice = parsePrice(priceStr);
  const discountedPrice = parseFloat((originalPrice * (1 - ONLINE_DISCOUNT)).toFixed(2));
  const cartItem = items.find((i) => i.id === id && i.date === date);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({ id, name, category, originalPrice, date });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      removeItem(id, date);
    } else {
      updateQuantity(id, date, quantity - 1);
    }
  };

  // Pseudo-random mock image index (1-8) based on dish name length
  const mockupIndex = (name.length % 8) + 1;
  const imageSrc = `/images/food-${mockupIndex}.webp`;

  // Mock macro values derived from dish name (placeholder until real data)
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const mockKcal = 320 + (seed % 280);
  const mockProtein = 18 + (seed % 22);
  const mockCarbs = 30 + ((seed * 3) % 40);
  const mockFat = 8 + ((seed * 7) % 18);

  return (
    <>
      {modalOpen && (
        <DishModal
          id={id}
          name={name}
          category={category}
          priceStr={priceStr}
          date={date}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div
        className="w-full bg-white rounded-[22px] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col relative border border-[#1C3D1C]/5"
        onClick={() => setModalOpen(true)}
      >
        {/* Cover Image */}
        <div className="relative w-full h-[110px] sm:h-[130px] bg-[#e8e0d5]">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>

        {/* Content Section */}
        <div className="px-3.5 pb-3.5">

          {/* Top row: Logo + Title + Price */}
          <div className="flex items-start gap-3 -mt-6">

            {/* Overlapping Logo */}
            <div className="w-[48px] h-[48px] shrink-0 bg-[#1C3D1C] text-white rounded-[14px] flex items-center justify-center border-[2.5px] border-white shadow-sm z-10 relative">
              <CategoryIcon category={category} className="h-5 w-5" />
            </div>

            {/* Title & Price */}
            <div className="flex-1 flex justify-between items-start pt-[28px] gap-2">
              <h3 className="font-bold text-[14px] sm:text-[15px] leading-tight text-gray-900 line-clamp-2 pr-1">
                {name}
              </h3>
              <span className="text-[15px] font-black text-[#E8967A] shrink-0 mt-[1px]">
                {formatPrice(discountedPrice)}
              </span>
            </div>
          </div>

          {/* Macro row */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1C3D1C] text-white text-[10px] font-bold leading-none">
              {mockKcal} kcal
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1C3D1C] text-white text-[10px] font-bold leading-none">
              B {mockProtein}g
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1C3D1C] text-white text-[10px] font-bold leading-none">
              W {mockCarbs}g
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1C3D1C] text-white text-[10px] font-bold leading-none">
              T {mockFat}g
            </span>
          </div>

          {/* Bottom row: Meta Pins + Add to Cart */}
          <div className="flex items-end justify-between mt-3.5 pl-0.5">

            {onlineDiscount > 0 ? (
              /* Connecting Pins — discount sites */
              <div className="flex flex-col gap-1.5 relative">
                {/* Dotted line */}
                <div className="absolute left-[6px] top-[14px] bottom-[14px] border-l-[1.5px] border-dotted border-gray-300"></div>

                {/* Pin 1: Online Discount */}
                <div className="flex items-center gap-2.5 z-10">
                  <div className="w-[14px] h-[14px] shrink-0 rounded-full border-[1.5px] border-[#1C3D1C] bg-white flex items-center justify-center">
                    <div className="w-[4px] h-[4px] rounded-full bg-[#1C3D1C]"></div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 leading-none">{t('discountBadge')}</span>
                  <span className="text-[10px] font-bold text-[#E8967A] leading-none mt-0.5 ml-[-1px]">online</span>
                </div>

                {/* Pin 2: Original Price */}
                <div className="flex items-center gap-2.5 z-10">
                  <div className="w-[14px] h-[14px] shrink-0 rounded-full border-[1.5px] border-gray-300 bg-white flex items-center justify-center">
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 leading-none">{t('regularPrice')}</span>
                  <span className="text-[10px] font-medium text-gray-400 line-through leading-none mt-0.5 ml-[-1px]">{formatPrice(originalPrice)}</span>
                </div>
              </div>
            ) : (
              /* Dietary badges — no-discount sites */
              <div className="flex items-center gap-1.5 flex-wrap">
                {isVege && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold leading-none">
                    <Leaf className="h-2.5 w-2.5" />
                    {t('vege')}
                  </span>
                )}
                {isSpicy && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-bold leading-none">
                    <Flame className="h-2.5 w-2.5" />
                    {t('spicy')}
                  </span>
                )}
                {!isVege && !isSpicy && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-medium leading-none">
                    <Utensils className="h-2.5 w-2.5" />
                    {t('normal')}
                  </span>
                )}
              </div>
            )}

            {/* Add Counter / Button */}
            <div className="shrink-0 pb-0.5" onClick={(e) => e.stopPropagation()}>
              {quantity === 0 ? (
                <button
                  onClick={handleAdd}
                  className={`flex h-[34px] px-3.5 items-center justify-center gap-1.5 rounded-full transition-all ${justAdded ? 'bg-[#1C3D1C] text-white scale-95' : 'bg-[#FDF6EC] hover:bg-[#F5EAD9] text-[#1C3D1C] border border-[#1C3D1C]/10'
                    }`}
                >
                  <span className="text-xl leading-none font-bold mt-[-2px]">+</span>
                  <span className="text-[12px] font-bold">{justAdded ? t('added') : t('addToCart')}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5 rounded-full bg-[#1C3D1C] px-1.5 h-[34px]">
                  <button onClick={handleDecrease} className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition-colors">
                    −
                  </button>
                  <span className="text-sm font-bold text-white min-w-[14px] text-center">
                    {quantity}
                  </span>
                  <button onClick={handleAdd} className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition-colors">
                    +
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
