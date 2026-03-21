'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Dodaj zdjęcia niedźwiedzi do public/images/:
//   bear-fresh.webp    — miś w kucharskiej czapce / z garnkiem
//   bear-inao.webp     — miś jako inspektor jakości / z lupą / w berecie
//   bear-choice.webp   — miś jako kelner / z tacą pełną różnych dań
const cards = [
  {
    image: '/images/bear-fresh.webp',
    titleKey: 'freshTitle' as const,
    descKey: 'freshDesc' as const,
    statKey: 'freshStat' as const,
    statLabelKey: 'freshStatLabel' as const,
    statColor: '#D4A017',
  },
  {
    image: '/images/bear-inao.webp',
    titleKey: 'inaoTitle' as const,
    descKey: 'inaoDesc' as const,
    statKey: 'inaoStat' as const,
    statLabelKey: 'inaoStatLabel' as const,
    statColor: '#2D6A4F',
    imageRight: true,
  },
  {
    image: '/images/bear-choices.webp',
    titleKey: 'noFakeTitle' as const,
    descKey: 'noFakeDesc' as const,
    statKey: 'noFakeStat' as const,
    statLabelKey: 'noFakeStatLabel' as const,
    statColor: '#E8927C',
  },
];

function AnimatedCard({
  card,
  index,
  t,
}: {
  card: (typeof cards)[number];
  index: number;
  t: ReturnType<typeof useTranslations<'differentiators'>>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 120}ms` }}
      className={`bg-[#FDF6EC] rounded-2xl px-6 pt-5 pb-0 shadow-sm overflow-hidden transition-all duration-700 ease-out ${
        visible
          ? 'opacity-100 translate-x-0'
          : index % 2 === 0
            ? 'opacity-0 -translate-x-10'
            : 'opacity-0 translate-x-10'
      }`}
    >
      <div className="mb-3">
        <h3 className="font-heading font-black text-lg text-[#1B4332] mb-1">
          {t(card.titleKey)}
        </h3>
        <p className="text-sm text-[#1B4332]/60 leading-relaxed">
          {t(card.descKey)}
        </p>
      </div>
      <div className={`flex items-end ${'imageRight' in card && card.imageRight ? 'flex-row-reverse' : ''}`}>
        <Image
          src={card.image}
          alt={t(card.titleKey)}
          width={130}
          height={130}
          className="flex-shrink-0 object-contain object-bottom drop-shadow-md"
        />
        <div className="flex-1 flex flex-col items-center justify-center pb-4 px-2">
          <span
            style={{ color: card.statColor }}
            className="font-heading font-black text-5xl leading-none"
          >
            {t(card.statKey)}
          </span>
          <span className="text-[#1B4332]/40 text-[11px] font-semibold text-center leading-tight mt-1 uppercase tracking-wide">
            {t(card.statLabelKey)}
          </span>
        </div>
      </div>
    </div>
  );
}

function AnimatedHeading({ t }: { t: ReturnType<typeof useTranslations<'differentiators'>> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`text-center mb-10 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <span className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#E8927C]/40 text-[#E8927C] text-xs font-bold uppercase tracking-widest">
        {t('eyebrow')}
      </span>
      <h2 className="font-heading font-black text-4xl leading-[1.1] text-[#FDF6EC]">
        {t('titleStart')}{' '}
        <span className="text-[#E8927C] italic">{t('titleHighlight')}</span>
      </h2>
      <p className="mt-4 text-[#FDF6EC]/50 text-base font-medium">
        {t('subtitle')}
      </p>
    </div>
  );
}

export default function Differentiators() {
  const t = useTranslations('differentiators');

  return (
    <section className="bg-[#1B4332] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <AnimatedHeading t={t} />
        <div className="space-y-4">
          {cards.map((card, i) => (
            <AnimatedCard key={i} card={card} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
