'use client';

import { useLocale } from 'next-intl';
import { parseMenuDate, isDateAvailable } from '@/lib/utils';

interface MenuDayTabsProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function MenuDayTabs({ dates, selectedDate, onSelectDate }: MenuDayTabsProps) {
  const locale = useLocale();

  return (
    <div className="flex justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {dates.map((date) => {
        const d = parseMenuDate(date);
        const available = isDateAvailable(date);
        const isSelected = date === selectedDate;

        const shortDay = d.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { weekday: 'short' });
        const dayMonth = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;

        return (
          <button
            key={date}
            onClick={() => available && onSelectDate(date)}
            disabled={!available}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all ${
              isSelected
                ? 'bg-[#1C3D1C] text-white shadow-lg scale-105'
                : available
                ? 'bg-white text-[#1C3D1C] border-2 border-[#1C3D1C]/20 hover:border-[#1C3D1C]/50 hover:shadow-sm'
                : 'bg-white/50 text-[#1C3D1C]/30 border-2 border-[#1C3D1C]/10 cursor-not-allowed'
            }`}
          >
            <span className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-[#E8967A]' : ''}`}>
              {shortDay}
            </span>
            <span className="text-[11px] font-semibold opacity-70 mt-0.5">{dayMonth}</span>
            {!available && (
              <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide opacity-50">
                {locale === 'pl' ? 'Zamk.' : 'Closed'}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
