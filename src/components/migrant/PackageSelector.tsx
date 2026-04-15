'use client';

import { useTranslations } from 'next-intl';
import { Package } from 'lucide-react';
import StepIndicator from './StepIndicator';
import { type MigrantWindow, type MigrantWeekSlot } from '@/lib/migrant-delivery';

type PackageSize = 3 | 6;

type Props = {
  availableWindows: MigrantWindow[];
  availableWeekSlots: MigrantWeekSlot[];
  onSelect: (size: PackageSize) => void;
};

export default function PackageSelector({ availableWindows, availableWeekSlots, onSelect }: Props) {
  const tm = useTranslations('migrant');
  const tCat = useTranslations('categories');

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24 text-center">
      <StepIndicator active={1} />

      <h2 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tight text-[#1B4332] mb-12">
        {tm('packageTitle')}
      </h2>

      {availableWindows.length === 0 ? (
        <p className="text-[#1B4332]/60 text-base mt-4">{tm('noWindowAvailable')}</p>
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          {/* Featured: 6-day */}
          <button
            onClick={() => onSelect(6)}
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
            onClick={() => onSelect(3)}
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
  );
}
