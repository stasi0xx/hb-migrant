'use client';

import { useTranslations } from 'next-intl';
import { CalendarDays, PackageCheck, Star, Zap, Award } from 'lucide-react';

const items = [
  { Icon: CalendarDays, labelKey: 'since' as const },
  { Icon: PackageCheck, labelKey: 'delivery' as const },
  { Icon: Star, labelKey: 'rating' as const },
  { Icon: Zap, labelKey: 'fresh' as const },
  { Icon: Award, labelKey: 'inao' as const },
];

export default function TrustBar() {
  const t = useTranslations('trust');

  return (
    <section className="bg-[#FDF6EC] py-5 overflow-hidden border-b border-[#1B4332]/10">
      <div className="flex gap-3 animate-marquee whitespace-nowrap">
        {Array.from({ length: 10 }, () => items).flat().map((item, i) => (
          <span
            key={i}
            className="inline-flex flex-shrink-0 items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-[#1B4332]/10 font-bold text-sm text-[#1B4332] shadow-sm"
          >
            <item.Icon size={16} strokeWidth={2} className="text-[#E8927C]" />
            {t(item.labelKey)}
          </span>
        ))}
      </div>
    </section>
  );
}
