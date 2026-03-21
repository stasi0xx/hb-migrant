'use client';

import { useTranslations } from 'next-intl';

const steps = [
  {
    number: '1',
    titleKey: 'step1Title' as const,
    descKey: 'step1Desc' as const,
    icon: '🛒',
  },
  {
    number: '2',
    titleKey: 'step2Title' as const,
    descKey: 'step2Desc' as const,
    icon: '👨‍🍳',
  },
  {
    number: '3',
    titleKey: 'step3Title' as const,
    descKey: 'step3Desc' as const,
    icon: '🚀',
  },
];

export default function HowItWorks() {
  const t = useTranslations('howItWorks');

  return (
    <section className="bg-[#1B4332] px-6 py-16 text-[#FDF6EC]">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-heading font-black text-4xl text-center mb-12">
          {t('title')}
        </h2>

        <div className="flex flex-col gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-5">
              {/* Number circle */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#E8927C] flex items-center justify-center font-heading font-black text-2xl text-white shadow-lg">
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{step.icon}</span>
                  <h3 className="font-heading font-bold text-xl">{t(step.titleKey)}</h3>
                </div>
                <p className="text-[#FDF6EC]/65 text-sm leading-relaxed">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
