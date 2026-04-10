'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gn_cookie_consent');
    if (!consent) {
      setMounted(true);
      // Slight delay for animation to trigger smoothly after load
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gn_cookie_consent', 'accepted');
    setShow(false);
    setTimeout(() => setMounted(false), 500);
    // You can listen to this event in _app.tsx or analytics scripts to initialize GA4/PostHog
    window.dispatchEvent(new Event('cookie_consent_accepted'));
  };

  const handleReject = () => {
    localStorage.setItem('gn_cookie_consent', 'rejected');
    setShow(false);
    setTimeout(() => setMounted(false), 500);
  };

  if (!mounted) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:px-6 md:pb-6 pointer-events-none flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
      <div
        className="bg-[#FDF6EC] border border-[#1B4332]/5 shadow-[0_20px_60px_-15px_rgba(27,67,50,0.5)] rounded-3xl p-6 md:p-8 w-full max-w-5xl pointer-events-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden relative"
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -m-8 pointer-events-none opacity-[0.03]">
          <svg className="h-48 w-48 text-[#1B4332]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        </div>

        <div className="flex-1 space-y-3 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl drop-shadow-sm">🍪</span>
            <h3 className="font-heading font-black text-[#1B4332] text-xl">
              {t('title')}
            </h3>
          </div>
          <p className="text-sm text-[#1B4332]/70 leading-relaxed max-w-3xl">
            {t('description')}{' '}
            <Link href="/privacy-policy" className="text-[#ed8788] hover:text-[#d4806b] font-bold transition-colors">
              {t('privacyPolicy')}
            </Link>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 relative z-10">
          <button
            onClick={handleReject}
            className="rounded-full px-6 py-3.5 text-xs font-extrabold text-[#1B4332] bg-white hover:bg-[#1B4332]/5 border border-[#1B4332]/10 transition-colors uppercase tracking-widest w-full sm:w-auto text-center"
          >
            {t('essentialOnly')}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-full px-8 py-3.5 text-xs font-black text-white bg-[#ed8788] hover:bg-[#d4806b] shadow-xl shadow-[#ed8788]/20 transition-all active:scale-95 uppercase tracking-widest w-full sm:w-auto text-center"
          >
            {t('acceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
