'use client';

import { useLocale } from 'next-intl';
import { parseMenuDate, isDateAvailable } from '@/lib/utils';

interface MenuDayTabsProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  availableDates?: string[];
}

export default function MenuDayTabs({ dates, selectedDate, onSelectDate, availableDates }: MenuDayTabsProps) {
  const locale = useLocale();

  return (
    <div className="flex justify-start sm:justify-center gap-2 sm:gap-3 lg:gap-5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-hide">
      {dates.map((date) => {
        const d = parseMenuDate(date);
        const available = availableDates ? availableDates.includes(date) : isDateAvailable(date);
        const isSelected = date === selectedDate;

        const shortDay = d.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { weekday: 'short' });
        const dayMonth = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;

        return (
          <button
            key={date}
            onClick={() => available && onSelectDate(date)}
            disabled={!available}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 md:w-[72px] h-16 sm:h-20 md:h-[84px] rounded-2xl md:rounded-3xl transition-all ${isSelected
              ? 'bg-[#1C3D1C] text-white shadow-[0_8px_30px_rgba(28,61,28,0.2)] md:shadow-[0_10px_10px_rgba(28,61,28,0.25)] scale-105'
              : available
                ? 'bg-white text-[#1C3D1C] border-2 border-[#1C3D1C]/20 hover:border-[#1C3D1C]/50 hover:shadow-sm'
                : 'bg-white/50 text-[#1C3D1C]/30 border-2 border-[#1C3D1C]/10 cursor-not-allowed'
              }`}
          >
            <span className={`text-xs sm:text-sm font-black uppercase tracking-widest ${isSelected ? 'text-[#E8967A]' : ''}`}>
              {shortDay}
            </span>
            <span className="text-[11px] sm:text-xs font-bold opacity-80 mt-0.5 md:mt-1">{dayMonth}</span>
            {!available && (
              <span className="mt-0.5 md:mt-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest opacity-60">
                {locale === 'pl' ? 'Zamk.' : 'Closed'}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
