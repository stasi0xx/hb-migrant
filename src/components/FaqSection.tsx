'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const faqs = [
  { q: 'q1', a: 'a1' },
  { q: 'q2', a: 'a2' },
  { q: 'q3', a: 'a3' },
  { q: 'q4', a: 'a4' },
  { q: 'q5', a: 'a5' },
] as const;

export default function FaqSection() {
  const t = useTranslations('faq');
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#FDF6EC] px-6 py-14">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-heading font-black text-4xl text-[#1B4332] text-center mb-10">
          {t('title')}
        </h2>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white shadow-sm overflow-hidden border border-[#1B4332]/5"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-bold text-[#1B4332] text-sm pr-4 leading-snug">
                  {t(faq.q)}
                </span>
                <span
                  className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
                    open === i ? 'bg-[#E8927C] text-white' : 'bg-[#1B4332]/10 text-[#1B4332]'
                  }`}
                >
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  open === i ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-sm text-[#1B4332]/60 leading-relaxed">
                  {t(faq.a)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
