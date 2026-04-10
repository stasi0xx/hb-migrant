'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import FooterSection from '@/components/FooterSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Icon } from '@iconify/react';

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5'] as const;

const STEP_ICONS = [
  // Phone
  <svg key="1" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>,
  // Document
  <svg key="2" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>,
  // User check
  <svg key="3" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  // Shopping bag
  <svg key="4" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 9H4L5 9z" />
  </svg>,
  // Truck
  <svg key="5" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 8h4l3 5v3h-7V8z" />
  </svg>,
];

function LeadForm() {
  const t = useTranslations('b2b');
  const [form, setForm] = useState({ company: '', contactPerson: '', email: '', phone: '', employees: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const employeeOptions = ['employees1', 'employees2', 'employees3', 'employees4', 'employees5'] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/b2b-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-10 px-6">
        <img src="/images/logo.webp" alt="Głodny Niedźwiedź" className="mx-auto h-32 w-auto mb-4 drop-shadow-md hover:scale-105 transition-transform" />
        <h3 className="font-heading font-black text-2xl text-white mb-2">{t('successTitle')}</h3>
        <p className="text-white/70 text-sm">{t('successDesc')}</p>
      </div>
    );
  }

  const inputClass = "w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#ed8788] focus:bg-white/15 transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        required
        type="text"
        placeholder={t('company')}
        value={form.company}
        onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
        className={inputClass}
      />
      <input
        required
        type="text"
        placeholder={t('contactPerson')}
        value={form.contactPerson}
        onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))}
        className={inputClass}
      />
      <input
        required
        type="email"
        placeholder={t('email')}
        value={form.email}
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        className={inputClass}
      />
      <input
        required
        type="tel"
        placeholder={t('phone')}
        value={form.phone}
        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
        className={inputClass}
      />
      <select
        required
        value={form.employees}
        onChange={e => setForm(p => ({ ...p, employees: e.target.value }))}
        className={`${inputClass} ${!form.employees ? 'text-white/40' : 'text-white'}`}
      >
        <option value="" disabled className="text-gray-900">{t('employeesPlaceholder')}</option>
        {employeeOptions.map(key => (
          <option key={key} value={t(key)} className="text-gray-900">{t(key)}</option>
        ))}
      </select>

      {status === 'error' && (
        <p className="text-[#ed8788] text-sm text-center">{t('errorMsg')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-2 w-full rounded-full bg-[#ed8788] py-3.5 text-sm font-black text-white uppercase tracking-wider transition-all hover:bg-[#d4806b] active:scale-95 disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}

export default function DlaFirmPage() {
  const t = useTranslations('b2b');
  const bagRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineMasksRef = useRef<(SVGRectElement | null)[]>([]);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const floatingCtaRef = useRef<HTMLButtonElement>(null);
  const sectionsContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (bagRef.current) {
      gsap.fromTo(
        bagRef.current,
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.2, // Lekkie opóźnienie dla naturalnego wejścia
        }
      );
    }

    // Timeline draw animation
    lineMasksRef.current.forEach((mask, i) => {
      if (mask && stepRefs.current[i]) {
        gsap.to(mask, {
          attr: { height: 100 },
          ease: 'none',
          scrollTrigger: {
            trigger: stepRefs.current[i],
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          }
        });
      }
    });

    // Icons light up animation
    iconsRef.current.forEach((icon, i) => {
      if (icon && i > 0 && stepRefs.current[i - 1]) {
        gsap.fromTo(icon,
          { backgroundColor: '#FDF6EC', color: '#1B4332', scale: 0.8 },
          {
            backgroundColor: '#1B4332',
            color: '#ed8788',
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: stepRefs.current[i - 1],
              start: 'bottom center',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    });

    // Floating CTA
    if (floatingCtaRef.current && sectionsContentRef.current) {
      gsap.set(floatingCtaRef.current, { xPercent: -50, y: 100 });
      gsap.to(floatingCtaRef.current, {
        y: 0,
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionsContentRef.current,
          start: 'top center',
          end: 'bottom bottom',
          toggleActions: 'play reverse play reverse'
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      <div className="h-16" />

      {/* HERO */}
      <section className="bg-[#1B4332] overflow-hidden relative flex flex-col md:block">
        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-2xl px-6 pt-14 pb-8 md:py-14 order-1">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/40 text-xs font-semibold uppercase tracking-widest mb-10 hover:text-white/70 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('backLink')}
          </Link>

          {/* GN Lunch App logo SVG */}
          <div className="w-full md:w-[65%] min-w-[220px] mx-auto md:mx-0 flex justify-center md:justify-start">
            <img
              src="/images/gnlunchapp2.svg"
              alt="GN Lunch App"
              className="w-full h-auto"
            />
          </div>

          <p className="mt-4 mb-8 md:mb-10 text-[#ed8788] text-base font-bold text-center md:text-left md:w-[55%]">
            {t('heroTagline')}
          </p>

          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => document.getElementById('formularz')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="rounded-lg bg-[#ed8788] px-8 py-3.5 text-sm font-black text-white uppercase tracking-widest transition-all hover:bg-[#d4806b] active:scale-95"
            >
              {t('cta')}
            </button>
          </div>

          {/* Spacer so section has enough height for image */}
          <div className="hidden md:block h-12" />
        </div>

        {/* Bear — right side, absolute, full section height */}
        <div ref={bagRef} className="relative md:absolute md:right-8 lg:right-12 md:top-0 h-64 sm:h-80 md:h-full w-full md:w-[45%] pointer-events-none select-none order-2 mt-4 md:mt-0">
          <img
            src="/images/bear-firm.webp"
            alt="Niedźwiedź dla firm"
            className="h-full w-full object-contain object-bottom md:object-right-bottom"
          />
        </div>
      </section>

      {/* Kontener dla pływającego przycisku (aktywacja) */}
      <div ref={sectionsContentRef}>
        {/* TRUST BADGES */}
        <section className="bg-[#FDF6EC] px-6 py-12 md:py-16 border-b border-[#1B4332]/10">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  stat: t('trust1'),
                  sub: t('trust1Sub'),
                  icon: (
                    <svg className="w-10 h-10 mb-4 text-[#ed8788]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  stat: t('trust2'),
                  sub: t('trust2Sub'),
                  icon: (
                    <svg className="w-10 h-10 mb-4 text-[#ed8788]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  stat: t('trust3'),
                  sub: t('trust3Sub'),
                  icon: (
                    <svg className="w-10 h-10 mb-4 text-[#ed8788]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
              ].map((item, i) => (
                <div key={i} className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-white border border-[#1B4332]/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <p className="font-heading font-black text-2xl md:text-3xl text-[#1B4332] leading-tight mb-2">{item.stat}</p>
                  <p className="text-xs text-[#1B4332]/60 uppercase tracking-widest font-extrabold">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-[#FDF6EC] px-6 py-14 relative">
          <div className="mx-auto max-w-2xl relative z-10">
            <p className="text-[#ed8788] text-xs font-black uppercase tracking-[4px] mb-2">{t('howItWorksEyebrow')}</p>
            <h2 className="font-heading font-black text-3xl text-[#1B4332] mb-10">{t('howItWorksHeading')}</h2>

            <div className="flex flex-col gap-0 relative">
              {STEPS.map((step, i) => (
                <div key={step} className="flex gap-4 group" ref={el => { stepRefs.current[i] = el; }}>
                  {/* Line + circle */}
                  <div className="flex flex-col items-center" style={{ minWidth: '40px' }}>
                    <div
                      ref={el => { iconsRef.current[i] = el; }}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1B4332] text-[#ed8788] border-2 border-[#1B4332] relative z-10 transition-colors"
                      style={i > 0 ? { backgroundColor: '#FDF6EC', color: '#1B4332', transform: 'scale(0.8)' } : undefined}
                    >
                      {STEP_ICONS[i]}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 w-8 flex justify-center py-2 -my-2 relative z-0">
                        <svg width="30" height="100%" preserveAspectRatio="none" viewBox="0 0 30 100">
                          {/* Wavy faint background path */}
                          <path
                            d={i % 2 === 0 ? "M 15 0 C 45 30, -15 70, 15 100" : "M 15 0 C -15 30, 45 70, 15 100"}
                            stroke="#1B4332"
                            strokeWidth="2"
                            strokeDasharray="4 6"
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                            className="opacity-20"
                          />
                          {/* Wavy active path */}
                          <path
                            d={i % 2 === 0 ? "M 15 0 C 45 30, -15 70, 15 100" : "M 15 0 C -15 30, 45 70, 15 100"}
                            stroke="#ed8788"
                            strokeWidth="2.5"
                            strokeDasharray="4 6"
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                            clipPath={`url(#reveal-${i})`}
                          />
                          <clipPath id={`reveal-${i}`}>
                            <rect ref={el => { lineMasksRef.current[i] = el; }} x="0" y="0" width="30" height="0" />
                          </clipPath>
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-12 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-[#ed8788] uppercase tracking-widest">0{i + 1}</span>
                      <h3 className="font-heading font-black text-base text-[#1B4332]">{t(`${step}Title`)}</h3>
                    </div>
                    <p className="text-sm text-[#1B4332]/60 leading-relaxed">{t(`${step}Desc`)}</p>
                    {i === 3 && (
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        {[
                          { el: <img src="/images/ideal.svg" alt="iDEAL" className="h-5 w-auto" /> },
                          { el: <Icon icon="logos:apple-pay" height={14} /> },
                          { el: <Icon icon="logos:google-pay" height={14} /> },
                          { el: <Icon icon="logos:visa" height={10} /> },
                          { el: <Icon icon="logos:mastercard" height={16} /> },
                        ].map((item, idx) => (
                          <span key={idx} className="inline-flex items-center justify-center h-7 px-2 rounded-md bg-white border border-[#1B4332]/10">
                            {item.el}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wyraźniejszy gładki fade-out tła na końcu sekcji */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-48 sm:h-64 z-20 bg-gradient-to-t from-[#FDF6EC] via-[#FDF6EC]/80 to-transparent" />
        </section>
      </div>

      {/* LEAD FORM */}
      <section id="formularz" className="bg-[#1B4332] px-6 py-14">
        <div className="mx-auto max-w-2xl">
          <p className="text-[#ed8788] text-xs font-black uppercase tracking-[4px] mb-2">{t('eyebrow')}</p>
          <h2 className="font-heading font-black text-3xl text-white mb-2">{t('formTitle')}</h2>
          <p className="text-white/50 text-sm mb-8">{t('formSub')}</p>
          <LeadForm />
          <p className="text-center text-white/30 text-xs mt-6">
            {t('callDirectly')} <a href={`tel:${t('directPhone').replace(/\s/g, '')}`} className="text-white/60 font-semibold hover:text-white transition-colors">{t('directPhone')}</a>
          </p>
        </div>
      </section>

      <FooterSection />

      {/* FLOATING CTA */}
      <button
        ref={floatingCtaRef}
        onClick={() => document.getElementById('formularz')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        className="fixed bottom-6 left-1/2 z-50 rounded-full bg-[#ed8788] px-8 py-3.5 text-sm font-black text-white uppercase tracking-widest shadow-[0_10px_40px_-5px_rgba(237,135,136,0.5)] transition-colors hover:bg-[#d4806b] active:scale-95 opacity-0 pointer-events-none"
      >
        {t('cta')}
      </button>
    </div>
  );
}
