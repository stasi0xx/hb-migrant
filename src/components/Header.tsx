'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cart';
import { Link } from '@/i18n/navigation';
import LanguageToggle from '@/components/LanguageToggle';

export default function Header() {
  const t = useTranslations('nav');
  const { openCart, itemCount } = useCartStore();
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const count = hasMounted ? itemCount() : 0;

  const anchorLinks = [
    { label: t('menu'), href: '#menu-section' },
    { label: t('howItWorks'), href: '#how-it-works' },
    { label: t('faq'), href: '#faq' },
    { label: t('contact'), href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 h-16 overflow-visible bg-[#1B4332] shadow-lg [transform:translateZ(0)] [backface-visibility:hidden]">
      <div className="mx-auto max-w-2xl px-5 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <img src="/images/hb-logo.png" alt="Głodny Niedźwiedź" className="h-9 w-auto" />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3 relative" ref={menuRef}>
            <LanguageToggle />
            <button
              onClick={openCart}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ed8788] text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Menu nawigacyjne"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
            >
              <span className="flex flex-col gap-[5px]">
                <span className={`block h-[2px] w-5 bg-white rounded-full transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-[2px] w-5 bg-white rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-[2px] w-5 bg-white rounded-full transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </span>
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 z-50 w-52 rounded-2xl bg-[#1B4332] border border-white/10 shadow-2xl overflow-hidden">
                {anchorLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full px-5 py-3.5 text-left text-sm font-semibold text-white hover:bg-white/10 transition-colors border-b border-white/5"
                  >
                    {link.label}
                  </button>
                ))}
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-5 py-3.5 text-left text-sm font-semibold text-white hover:bg-white/10 transition-colors border-b border-white/5"
                >
                  <svg className="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {t('myAccount')}
                  <svg className="h-3.5 w-3.5 ml-auto opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/for-business"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 px-5 py-3.5 text-left text-sm font-semibold text-[#ed8788] hover:bg-white/10 transition-colors"
                >
                  {t('forBusiness')}
                  <svg className="h-3.5 w-3.5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
