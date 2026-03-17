'use client';

import { useCartStore, parsePrice, ONLINE_DISCOUNT } from '@/store/cart';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface DishCardProps {
  id: string;
  name: string;
  category: string;
  priceStr: string;
  date: string;
}

export default function DishCard({ id, name, category, priceStr, date }: DishCardProps) {
  const t = useTranslations('menu');
  const { items, addItem, removeItem, updateQuantity } = useCartStore();
  const [justAdded, setJustAdded] = useState(false);

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

  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm transition-all hover:shadow-md">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-600 leading-snug text-[#1C3D1C]">{name}</p>
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <p className="text-base font-800 text-[#E8967A]">
            {discountedPrice.toFixed(2).replace('.', ',')} zł
          </p>
          <p className="text-xs font-500 text-gray-400 line-through">
            {priceStr}
          </p>
          <span className="rounded-full bg-[#D4A843] px-1.5 py-0.5 text-[10px] font-800 text-white leading-tight">
            -5% online
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center">
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-700 transition-all ${
              justAdded
                ? 'bg-[#1C3D1C] text-white scale-95'
                : 'bg-[#1C3D1C] text-white hover:bg-[#2d5a2d] active:scale-95'
            }`}
          >
            <span className="text-base leading-none">+</span>
            <span>{justAdded ? t('added') : t('addToCart')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-[#1C3D1C] px-1.5 py-1">
            <button
              onClick={handleDecrease}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30 active:scale-90 text-lg font-bold leading-none"
            >
              −
            </button>
            <span className="min-w-[20px] text-center text-sm font-bold text-white">
              {quantity}
            </span>
            <button
              onClick={handleAdd}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30 active:scale-90 text-lg font-bold leading-none"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
