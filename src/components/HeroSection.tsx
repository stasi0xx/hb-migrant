'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { Link } from '@/i18n/navigation';

export default function HeroSection() {
  const t = useTranslations('hero');
  const bearRef = useRef<HTMLImageElement>(null);
  const glutRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const btnSecondaryRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!bearRef.current) return;
    gsap.fromTo(
      bearRef.current,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    if (btnRef.current) {
      gsap.fromTo(btnRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.6, ease: 'power3.out', delay: 0.8 }
      );
    }
    if (btnSecondaryRef.current) {
      gsap.fromTo(btnSecondaryRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.6, ease: 'power3.out', delay: 1.3 }
      );
    }
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
    <section className="relative bg-[#1B4332] overflow-hidden min-h-[480px] sm:min-h-[560px] md:min-h-[640px] lg:min-h-[720px] flex items-center">
      {/* Bear image */}
      <img
        ref={bearRef}
        src="/images/gn-hero.webp"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-[-6%] h-[64%] max-h-[300px] sm:right-[-4%] sm:h-[70%] sm:max-h-[380px] md:right-[-2%] md:h-[88%] md:max-h-[540px] lg:right-[0%] lg:h-[95%] lg:max-h-[660px] object-contain pointer-events-none select-none opacity-0"
      />

      <div className="relative z-10 w-full px-5 py-10 sm:px-8 sm:py-14 md:px-14 md:py-20 lg:px-20 lg:py-24">
        <div className="max-w-[58%] sm:max-w-[54%] md:max-w-[55%] lg:max-w-[50%] xl:max-w-[48%] md:ml-[5%] lg:ml-[8%] xl:ml-[12%] 2xl:ml-[15%]">
          {/* Headline */}
          <h1 className="mb-3 sm:mb-4 md:mb-5">
            <span
              ref={glutRef}
              className="font-heading font-black italic leading-none tracking-tight text-[#ed8788] whitespace-nowrap"
              style={{ fontSize: 'clamp(4rem, 9vw, 8rem)', display: 'inline-block' }}
            >
              {t('headline1')}
            </span>
            <span
              className="block font-heading font-black leading-[1.05] tracking-tight text-[#FDF6EC]"
              style={{ fontSize: 'clamp(3rem, 5.8vw, 6.2rem)' }}
            >
              {t('headline2')}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-[#FDF6EC]/70 text-lg sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8">
            {t.rich('subheadline', {
              b: (chunks) => (
                <span className="font-bold text-[#FDF6EC]">{chunks}</span>
              ),
            })}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 pt-2">
            <button
              onClick={scrollToMenu}
              ref={btnRef}
              className="w-full sm:w-auto text-center rounded-full bg-[#ed8788] px-8 sm:px-10 md:px-12 py-4 md:py-5 font-heading font-extrabold text-lg md:text-xl text-white shadow-lg hover:opacity-90 scale-x-0 origin-left"
            >
              {t('cta')}
            </button>
            <Link
              href="/for-business"
              ref={btnSecondaryRef}
              className="w-full sm:w-auto block text-center rounded-full bg-[#FDF6EC] px-8 sm:px-10 md:px-12 py-4 md:py-5 font-heading font-extrabold text-lg md:text-xl text-[#1B4332] shadow-lg hover:opacity-90 scale-x-0 origin-left"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
