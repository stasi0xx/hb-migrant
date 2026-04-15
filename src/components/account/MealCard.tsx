'use client';

import { useState } from 'react';

interface MealDetails {
  description: string;
  ingredients: string;
  macros: { kcal: number; protein: number; carbs: number; fat: number };
  allergens: string[];
  preparation: string;
}

// Mock details — replace with real data when available
const MOCK_DETAILS: MealDetails = {
  description:
    'Klasyczny schabowy z ziemniakami puree i surówką z kapusty kiszonej. Domowy smak prosto z kuchni.',
  ingredients:
    'Schab wieprzowy, bułka tarta, jajko, mąka pszenna, olej rzepakowy, ziemniaki, kapusta kiszona, marchew, cebula, sól, pieprz czarny',
  macros: { kcal: 680, protein: 42, carbs: 58, fat: 28 },
  allergens: ['Gluten', 'Jajka', 'Mleko'],
  preparation:
    'Gotowe do spożycia. Podgrzać w mikrofalówce 3–4 min lub na patelni 5 min pod przykryciem.',
};

// Typography scale based on how many cards share the row
function useScale(count: number) {
  if (count === 1) return {
    name:        'text-xl md:text-3xl lg:text-4xl',
    desc:        'text-sm md:text-base lg:text-lg',
    macroVal:    'text-base md:text-xl lg:text-2xl',
    macroLabel:  'text-[11px] md:text-sm lg:text-base',
    sectionHead: 'text-xs md:text-sm lg:text-base',
    sectionBody: 'text-xs md:text-sm lg:text-base',
    allergen:    'text-xs md:text-sm lg:text-base',
    padding:     'p-5 md:p-7 lg:p-8',
    gap:         'gap-3 md:gap-4 lg:gap-5',
    nameDefault: 'text-xl md:text-3xl lg:text-4xl',
  };
  if (count === 2) return {
    name:        'text-sm md:text-xl lg:text-2xl',
    desc:        'text-[11px] md:text-sm lg:text-base',
    macroVal:    'text-xs md:text-base lg:text-lg',
    macroLabel:  'text-[9px] md:text-xs lg:text-sm',
    sectionHead: 'text-[10px] md:text-xs lg:text-sm',
    sectionBody: 'text-[10px] md:text-xs lg:text-sm',
    allergen:    'text-[10px] md:text-xs lg:text-sm',
    padding:     'p-3.5 md:p-5 lg:p-6',
    gap:         'gap-2 md:gap-3 lg:gap-4',
    nameDefault: 'text-sm md:text-xl lg:text-2xl',
  };
  // 3 cards
  return {
    name:        'text-[11px] md:text-sm lg:text-base',
    desc:        'text-[9px] md:text-[11px] lg:text-xs',
    macroVal:    'text-[10px] md:text-xs lg:text-sm',
    macroLabel:  'text-[8px] md:text-[10px] lg:text-xs',
    sectionHead: 'text-[8px] md:text-[10px] lg:text-xs',
    sectionBody: 'text-[8px] md:text-[10px] lg:text-xs',
    allergen:    'text-[8px] md:text-[10px] lg:text-xs',
    padding:     'p-2.5 md:p-3.5 lg:p-4',
    gap:         'gap-1.5 md:gap-2 lg:gap-2.5',
    nameDefault: 'text-[11px] md:text-sm lg:text-base',
  };
}

interface MealCardProps {
  name: string;
  image: string;
  quantity: number;
  count: number; // total cards in the mosaic row
}

export function MealCard({ name, image, quantity, count }: MealCardProps) {
  const [active, setActive] = useState(false);
  const s = useScale(count);

  const handleMouseEnter = () => setActive(true);
  const handleMouseLeave = () => setActive(false);
  const handleClick = (e: React.MouseEvent) => {
    if ((e.nativeEvent as PointerEvent).pointerType === 'touch') {
      setActive((v) => !v);
    }
  };

  const d = MOCK_DETAILS;

  return (
    <div
      className="relative cursor-pointer overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={name} className="h-full w-full object-cover" />

      {/* Default: gradient + name at bottom */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 ${
          active ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <p
        className={`absolute bottom-2 left-2 right-2 line-clamp-2 font-bold leading-tight text-white transition-all duration-300 ${s.nameDefault} ${
          active ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {name}
      </p>

      {/* Details overlay */}
      <div
        className={`absolute inset-0 flex flex-col overflow-y-auto bg-[#1C3D1C]/96 transition-all duration-300 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E8967A]/70 [&::-webkit-scrollbar-thumb]:rounded-full ${s.padding} ${s.gap} ${
          active ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* Name */}
        <p className={`font-extrabold leading-tight text-white ${s.name}`}>{name}</p>

        {/* Description */}
        <p className={`leading-snug text-white/65 ${s.desc}`}>{d.description}</p>

        {/* Macros */}
        <div className="grid grid-cols-4 gap-1">
          {(
            [
              { label: 'kcal',    val: String(d.macros.kcal) },
              { label: 'białko',  val: `${d.macros.protein}g` },
              { label: 'węgle',   val: `${d.macros.carbs}g` },
              { label: 'tłuszcz', val: `${d.macros.fat}g` },
            ] as { label: string; val: string }[]
          ).map((m) => (
            <div key={m.label} className="flex flex-col items-center rounded-lg bg-white/10 py-1.5">
              <span className={`font-extrabold text-white ${s.macroVal}`}>{m.val}</span>
              <span className={`text-white/45 ${s.macroLabel}`}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div>
          <p className={`font-bold uppercase tracking-wide text-[#E8967A] ${s.sectionHead}`}>Skład</p>
          <p className={`mt-0.5 leading-snug text-white/55 ${s.sectionBody}`}>{d.ingredients}</p>
        </div>

        {/* Allergens */}
        <div>
          <p className={`font-bold uppercase tracking-wide text-[#E8967A] ${s.sectionHead}`}>Alergeny</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {d.allergens.map((a) => (
              <span
                key={a}
                className={`rounded-full bg-[#E8967A]/20 px-1.5 py-0.5 font-semibold text-[#E8967A] ${s.allergen}`}
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Preparation */}
        <div>
          <p className={`font-bold uppercase tracking-wide text-[#E8967A] ${s.sectionHead}`}>
            Przygotowanie
          </p>
          <p className={`mt-0.5 leading-snug text-white/55 ${s.sectionBody}`}>{d.preparation}</p>
        </div>
      </div>

      {/* Quantity badge */}
      {quantity > 1 && (
        <span className="absolute right-2 top-2 z-10 rounded-full bg-[#E8967A] px-1.5 py-0.5 text-[10px] font-extrabold text-white">
          {quantity}×
        </span>
      )}
    </div>
  );
}
