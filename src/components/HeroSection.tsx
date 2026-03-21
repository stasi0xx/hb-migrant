'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';

export default function HeroSection() {
  const t = useTranslations('hero');
  const bearRef = useRef<HTMLImageElement>(null);
  const glutRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!bearRef.current) return;
    gsap.fromTo(
      bearRef.current,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    if (!btnRef.current) return;
    gsap.fromTo(btnRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.6, ease: 'power3.out', delay: 0.8 }
    );
  }, []);

  useEffect(() => {
    if (!glutRef.current) return;
    const tl = gsap.timeline({ delay: 0.05 });
    tl.fromTo(glutRef.current,
      { y: '-120%', scaleY: 1, transformOrigin: 'top center' },
      { y: '0%', scaleY: 1.4, transformOrigin: 'top center', duration: 0.4, ease: 'power3.in' }
    )
      .to(glutRef.current, {
        scaleY: 0.75, scaleX: 1.1, transformOrigin: 'top center', duration: 0.12, ease: 'power1.out',
      })
      .to(glutRef.current, {
        scaleY: 1, scaleX: 1, transformOrigin: 'top center', duration: 1, ease: 'elastic.out(1.2, 0.4)',
      });
  }, []);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-[#1B4332] overflow-hidden min-h-[520px] md:min-h-[680px] flex items-center">
      {/* Bear image */}
      <img
        ref={bearRef}
        src="/images/gn-hero.webp"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-[-4%] h-[72%] max-h-[380px] md:h-[95%] md:max-h-[620px] md:right-[4%] object-contain pointer-events-none select-none opacity-0"
      />

      <div className="relative z-10 w-full px-6 py-12 md:py-20 md:px-16 lg:px-24">
        <div className="max-w-[58%] md:max-w-[52%] lg:max-w-[46%]">
          {/* Headline */}
          <h1 className="mb-5">
            <span
              ref={glutRef}
              className="font-heading font-black italic leading-none tracking-tight text-[#E8927C] whitespace-nowrap"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', display: 'inline-block' }}
            >
              {t('headline1')}
            </span>
            <span
              className="block font-heading font-black leading-[1.05] tracking-tight text-[#FDF6EC]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              {t('headline2')}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-[#FDF6EC]/70 text-m md:text-xl mb-8">
            {t('subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 max-w-xs -ml-6 md:-ml-16 lg:-ml-24">
            <button
              onClick={scrollToMenu}
              ref={btnRef}
              className="w-full rounded-r-full rounded-l-none bg-[#E8927C] pl-10 pr-8 py-5 font-heading font-extrabold text-lg text-white shadow-lg hover:opacity-90 scale-x-0 origin-left"
            >
              {t('cta')}
            </button>
            <button
              onClick={scrollToMenu}
              className="text-center text-[#FDF6EC]/70 font-bold text-sm tracking-widest uppercase hover:text-[#E8927C] transition-colors pl-10"
            >
              {t('ctaSecondary')} ↓
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
