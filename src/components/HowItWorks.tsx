'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Leaf, ChefHat, Package, Truck, LucideIcon } from 'lucide-react';

const steps: {
  number: string;
  titleKey: 'step1Title' | 'step2Title' | 'step3Title' | 'step4Title' | 'step5Title';
  descKey: 'step1Desc' | 'step2Desc' | 'step3Desc' | 'step4Desc' | 'step5Desc';
  Icon: LucideIcon;
  rotation: number;
  tapeColor: string;
}[] = [
    {
      number: '01',
      titleKey: 'step1Title',
      descKey: 'step1Desc',
      Icon: ShoppingCart,
      rotation: -2,
      tapeColor: '#ed8788',
    },
    {
      number: '02',
      titleKey: 'step2Title',
      descKey: 'step2Desc',
      Icon: Leaf,
      rotation: 1.5,
      tapeColor: '#52B788',
    },
    {
      number: '03',
      titleKey: 'step3Title',
      descKey: 'step3Desc',
      Icon: ChefHat,
      rotation: -1,
      tapeColor: '#ed8788',
    },
    {
      number: '04',
      titleKey: 'step4Title',
      descKey: 'step4Desc',
      Icon: Package,
      rotation: 2,
      tapeColor: '#D4A017',
    },
    {
      number: '05',
      titleKey: 'step5Title',
      descKey: 'step5Desc',
      Icon: Truck,
      rotation: -1.5,
      tapeColor: '#52B788',
    },
  ];

// px of scroll between each new card starting to slide in
const SCROLL_PER_CARD = 300;
// px of scroll to complete one card's slide-in
const SLIDE_DURATION = 200;
// px of previous card still visible under the new one
const CARD_PEEK = 24;
// px of rest at the end so all cards are visible before leaving the section
const END_BUFFER = 600;

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];

    const init = () => {
      const section = sectionRef.current;
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (!section || !cards.length) return;

      // Use window.innerHeight instead of '100vh' — more reliable before layout settles
      gsap.set(cards.slice(1), { y: window.innerHeight, force3D: true });

      // Each card slides up and stays permanently — no unsticking
      cards.slice(1).forEach((card, idx) => {
        const tween = gsap.to(card, {
          y: 0,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: section,
            // Function-based values recalculate correctly on every refresh
            start: () => `top+=${idx * SCROLL_PER_CARD} top`,
            end: () => `top+=${idx * SCROLL_PER_CARD + SLIDE_DURATION} top`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Use the tween's own scrollTrigger reference — avoids race conditions
        // with ScrollTrigger.getAll() which could return a trigger from another component
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });

      ScrollTrigger.refresh();
    };

    // Wait for fonts + full layout before measuring positions.
    // On Vercel, fonts load from CDN after hydration — without this, GSAP
    // measures positions before font-swap causes layout shifts, breaking triggers.
    document.fonts.ready.then(init);

    return () => {
      triggers.forEach(st => st.kill());
    };
  }, []);

  const sectionHeight = (steps.length - 1) * SCROLL_PER_CARD + SLIDE_DURATION + END_BUFFER;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="bg-[#1B4332]"
      style={{ height: `${sectionHeight}px` }}
    >
      {/* Single sticky container — stays on screen for the entire section scroll */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Decorative background gradients for large screens */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="hidden lg:block absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-[#52B788]/20 rounded-full blur-[120px]" />
          <div className="hidden lg:block absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#ed8788]/15 rounded-full blur-[100px]" />
          <div className="hidden lg:block absolute bottom-[-5%] left-[10%] w-[700px] h-[700px] bg-[#D4A017]/15 rounded-full blur-[120px]" />


        </div>

        {/* Section header */}
        <div className="relative z-10 flex-shrink-0 px-6 pt-16 pb-6 text-center text-[#FDF6EC]">
          <p className="mb-2 mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#ed8788]">
            <img src="/images/logo.webp" alt="" className="inline-block h-4 w-auto mr-1 align-middle" /> {t('eyebrow')}
          </p>
          <h2 className="font-heading font-black text-4xl md:text-5xl mb-2">
            {t('title')}
          </h2>
          <p className="text-[#FDF6EC]/50 text-sm">{t('subtitle')}</p>
        </div>

        {/* Card stack — overflow:hidden hides cards at y:100vh before they animate in */}
        <div className="relative flex-1 overflow-hidden">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              className="absolute inset-x-0 top-0 flex justify-center px-6"
              style={{
                zIndex: i + 1,
                paddingTop: `${i * CARD_PEEK}px`,
              }}
            >
              {/* Rotated note */}
              <div
                className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl"
                style={{ transform: `rotate(${step.rotation}deg)`, transformOrigin: 'top center' }}
              >
                {/* Tape strip */}
                <div
                  className="mx-auto w-14 h-5 md:w-24 md:h-8 rounded-[2px] -mb-2.5 md:-mb-4"
                  style={{
                    backgroundColor: step.tapeColor,
                    opacity: 0.85,
                    position: 'relative',
                    zIndex: 1,
                  }}
                />

                {/* Note card */}
                <div
                  className="rounded-sm bg-[#FDF6EC] px-7 pt-6 pb-6 md:px-14 md:pt-12 md:pb-12"
                  style={{ boxShadow: '0 25px 70px rgba(0,0,0,0.45)' }}
                >
                  <div className="flex items-start justify-between mb-1 md:mb-2">
                    <span
                      className="font-heading font-black leading-none select-none text-[4.5rem] md:text-[6.5rem] lg:text-[8rem]"
                      style={{ color: '#1B4332', opacity: 0.07 }}
                    >
                      {step.number}
                    </span>
                    <step.Icon className="mt-2 text-[#1B4332] w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16" />
                  </div>

                  <h3 className="font-heading font-black text-xl md:text-3xl lg:text-4xl text-[#1B4332] mb-2 md:mb-4 -mt-6 md:-mt-10 lg:-mt-14">
                    {t(step.titleKey)}
                  </h3>

                  <p className="text-[#1B4332]/65 text-sm md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed">
                    {t(step.descKey)}
                  </p>

                  <div className="mt-4 md:mt-8 flex justify-end">
                    <img src="/images/logo.webp" alt="" className="h-10 md:h-16 lg:h-20 w-auto" style={{ opacity: 0.15, filter: 'saturate(0)' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
