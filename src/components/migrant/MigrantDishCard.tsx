'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Leaf, Flame } from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';
import DishModal from '@/components/DishModal';

interface MigrantDishCardProps {
  id: string;
  name: string;
  category: string;
  priceStr: string;
  date: string;
  quantity: number;
  canAdd: boolean;
  isVege?: boolean;
  isSpicy?: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export default function MigrantDishCard({ id, name, category, priceStr, date, quantity, canAdd, isVege, isSpicy, onAdd, onRemove }: MigrantDishCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const mockupIndex = (name.length % 8) + 1;
  const imageSrc = `/images/food-${mockupIndex}.webp`;

  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
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
    <div className="w-full bg-white rounded-[22px] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col relative border border-[#1C3D1C]/5"
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
        {(isVege || isSpicy) && (
          <div className="absolute top-2 right-2 flex gap-1">
            {isVege && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-white text-[10px] font-bold backdrop-blur-sm">
                <Leaf className="h-2.5 w-2.5" />
              </span>
            )}
            {isSpicy && (
              <span className="flex items-center gap-1 rounded-full bg-orange-500/90 px-2 py-0.5 text-white text-[10px] font-bold backdrop-blur-sm">
                <Flame className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-3.5 pb-3.5">
        {/* Top row: Icon + Title */}
        <div className="flex items-start gap-3 -mt-6">
          <div className="w-[48px] h-[48px] shrink-0 bg-[#1C3D1C] text-white rounded-[14px] flex items-center justify-center border-[2.5px] border-white shadow-sm z-10 relative">
            <CategoryIcon category={category} className="h-5 w-5" />
          </div>
          <div className="flex-1 pt-[34px]">
            <h3 className="font-bold text-[14px] sm:text-[15px] leading-tight text-gray-900 line-clamp-2">
              {name}
            </h3>
          </div>
        </div>

        {/* Bottom row: Macros + Add / counter */}
        <div className="flex items-center justify-between mt-3.5">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="px-2 py-1 rounded-full bg-[#1C3D1C] text-white text-[10px] font-bold leading-none">450 kcal</span>
            <span className="px-2 py-1 rounded-full bg-[#1C3D1C] text-white text-[10px] font-bold leading-none">B {mockProtein}g</span>
            <span className="px-2 py-1 rounded-full bg-[#1C3D1C] text-white text-[10px] font-bold leading-none">W {mockCarbs}g</span>
            <span className="px-2 py-1 rounded-full bg-[#1C3D1C] text-white text-[10px] font-bold leading-none">T {mockFat}g</span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            {quantity === 0 ? (
              <button
                onClick={onAdd}
                disabled={!canAdd}
                className={`flex h-[34px] px-3.5 items-center justify-center gap-1.5 rounded-full transition-all ${
                  canAdd
                    ? 'bg-[#FDF6EC] hover:bg-[#F5EAD9] text-[#1C3D1C] border border-[#1C3D1C]/10'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="text-xl leading-none font-bold mt-[-2px]">+</span>
                <span className="text-[12px] font-bold">Add</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5 rounded-full bg-[#1C3D1C] px-1.5 h-[34px]">
                <button
                  onClick={onRemove}
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition-colors"
                >
                  −
                </button>
                <span className="text-sm font-bold text-white min-w-[14px] text-center">{quantity}</span>
                <button
                  onClick={onAdd}
                  disabled={!canAdd}
                  className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-white font-bold text-sm transition-colors ${
                    canAdd ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 cursor-not-allowed'
                  }`}
                >
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

