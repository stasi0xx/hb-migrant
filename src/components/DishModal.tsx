'use client';

import { useEffect } from 'react';
import { useCartStore, parsePrice, ONLINE_DISCOUNT } from '@/store/cart';
import { useTranslations } from 'next-intl';

// — Testowe dane szczegółów dania — zastąpić prawdziwymi z menu.json
const TEST_DETAIL = {
  image: '/images/bear-fresh.webp',
  description:
    'Klasyczny schabowy smażony na maśle klarowanym, podawany z puszystymi kopytkami i zasmażaną kapustą z kminkiem. Tak jak u babci — bez żadnych skrótów ani półproduktów.',
  ingredients:
    'wieprzowina 93%, mąka pszenna, jajko, bułka tarta, masło klarowane, kapusta biała, cebula, kminek, sól, pieprz czarny',
  macros: [
    { label: 'Kcal', value: '680' },
    { label: 'Białko', value: '42 g' },
    { label: 'Węglowodany', value: '58 g' },
    { label: 'Tłuszcze', value: '28 g' },
  ],
  allergens: ['Gluten', 'Jaja', 'Mleko'],
  reheat:
    'Mikrofala: 3–4 min w 800W pod przykryciem, na końcu 30 sek bez przykrycia żeby kopytka trochę obeschły. Piekarnik: 180°C przez 12 min — schab wyjdzie chrupiący jak świeżo usmażony.',
};

interface DishModalProps {
  id: string;
  name: string;
  category: string;
  priceStr: string;
  date: string;
  onClose: () => void;
}

export default function DishModal({ id, name, category, priceStr, date, onClose }: DishModalProps) {
  const t = useTranslations('menu');
  const { items, addItem } = useCartStore();

  const originalPrice = parsePrice(priceStr);
  const discountedPrice = parseFloat((originalPrice * (1 - ONLINE_DISCOUNT)).toFixed(2));
  const inCart = items.some((i) => i.id === id && i.date === date);

  // Zablokuj scroll body gdy modal otwarty
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAdd = () => {
    addItem({ id, name, category, originalPrice, date });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-2xl max-h-[92dvh] flex flex-col rounded-t-3xl bg-[#FDF6EC] overflow-hidden shadow-2xl animate-slide-up">

        {/* Image */}
        <div className="relative flex-shrink-0 h-52 bg-[#1B4332]/10">
          <img
            src={TEST_DETAIL.image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Drag handle */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/60" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Header */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#E8927C] mb-1">{category}</p>
            <h2 className="font-heading font-black text-2xl leading-tight text-[#1B4332]">{name}</h2>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="text-xl font-extrabold text-[#E8927C]">
                {discountedPrice.toFixed(2).replace('.', ',')} zł
              </span>
              <span className="text-sm font-medium text-gray-400 line-through">{priceStr}</span>
              <span className="rounded-full bg-[#D4A017] px-2 py-0.5 text-[10px] font-extrabold text-white">
                -5% online
              </span>
            </div>
          </div>

          {/* Opis */}
          <p className="text-sm leading-relaxed text-[#1B4332]/80">{TEST_DETAIL.description}</p>

          {/* Skład */}
          <section>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#1B4332] mb-1.5">
              Skład
            </h3>
            <p className="text-sm text-[#1B4332]/70 leading-relaxed">{TEST_DETAIL.ingredients}</p>
          </section>

          {/* Makro */}
          <section>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#1B4332] mb-2">
              Wartości odżywcze
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {TEST_DETAIL.macros.map((m) => (
                <div key={m.label} className="rounded-2xl bg-white border border-[#1B4332]/10 p-3 text-center">
                  <p className="font-extrabold text-base text-[#1B4332]">{m.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#1B4332]/50 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Alergeny */}
          <section>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#1B4332] mb-2">
              Alergeny
            </h3>
            <div className="flex flex-wrap gap-2">
              {TEST_DETAIL.allergens.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-[#E8927C]/40 bg-[#E8927C]/10 px-3 py-1 text-xs font-semibold text-[#E8927C]"
                >
                  {a}
                </span>
              ))}
            </div>
          </section>

          {/* Podgrzanie */}
          <section className="pb-2">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#1B4332] mb-1.5">
              Jak podgrzać?
            </h3>
            <div className="rounded-2xl bg-[#1B4332]/5 px-4 py-3">
              <p className="text-sm text-[#1B4332]/80 leading-relaxed">{TEST_DETAIL.reheat}</p>
            </div>
          </section>
        </div>

        {/* Sticky bottom CTA */}
        <div className="flex-shrink-0 px-5 py-4 bg-[#FDF6EC] border-t border-[#1B4332]/10">
          <button
            onClick={handleAdd}
            disabled={inCart}
            className={`w-full rounded-2xl py-3.5 font-bold text-base transition-all active:scale-[0.98] ${
              inCart
                ? 'bg-[#1B4332]/20 text-[#1B4332]/50 cursor-default'
                : 'bg-[#1B4332] text-white hover:bg-[#2d5a2d]'
            }`}
          >
            {inCart ? t('inCart') : `+ ${t('addToCart')} — ${discountedPrice.toFixed(2).replace('.', ',')} zł`}
          </button>
        </div>
      </div>
    </div>
  );
}
