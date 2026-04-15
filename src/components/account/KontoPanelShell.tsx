'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  Gift,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

interface Props {
  children: React.ReactNode;
  locale: string;
  displayName: string;
  avatarUrl: string | null;
  userEmail: string;
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#E8967A]/30"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8967A] text-sm font-bold text-white ring-2 ring-[#E8967A]/30">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function KontoPanelShell({ children, locale, displayName, avatarUrl, userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const t = useTranslations('auth.konto.shell');

  const navItems: NavItem[] = [
    {
      label: t('nav.dashboard'),
      href: `/account`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: t('nav.history'),
      href: `/account/history`,
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      label: t('nav.addresses'),
      href: `/account/addresses`,
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      label: t('nav.points'),
      href: `/account/points`,
      icon: <Gift className="h-5 w-5" />,
      comingSoon: true,
    },
    {
      label: t('nav.profile'),
      href: `/account/profile`,
      icon: <User className="h-5 w-5" />,
    },
  ];

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  }

  function isActive(href: string) {
    if (href === `/${locale}/account`) return pathname === `/${locale}/account`;
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* ─── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:bg-[#1C3D1C] lg:shadow-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8967A] flex-shrink-0">
            <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="9" fill="white" opacity="0.9" />
              <circle cx="50" cy="14" r="9" fill="white" opacity="0.9" />
              <circle cx="14" cy="14" r="5" fill="#c47560" />
              <circle cx="50" cy="14" r="5" fill="#c47560" />
              <circle cx="32" cy="34" r="22" fill="white" opacity="0.95" />
              <ellipse cx="32" cy="42" rx="9" ry="6" fill="#c47560" />
              <circle cx="24" cy="30" r="3" fill="#1C3D1C" />
              <circle cx="40" cy="30" r="3" fill="#1C3D1C" />
              <ellipse cx="32" cy="39" rx="3" ry="2" fill="#1C3D1C" />
            </svg>
          </div>
          <div>
            <p className="font-heading text-sm text-white leading-none">Głodny Niedźwiedź</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#E8967A]/80">
              {t('clientPanel')}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href as `/${string}`}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive(item.href)
                    ? 'bg-[#E8967A] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.comingSoon && (
                    <span className="rounded-full bg-[#D4A017]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#D4A017]">
                      {t('comingSoon')}
                    </span>
                  )}
                  {isActive(item.href) && <ChevronRight className="h-4 w-4 opacity-60" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Language + User + Logout */}
        <div className="border-t border-white/10 px-3 py-4 space-y-2">
          <div className="px-3">
            <LanguageToggle />
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <Avatar name={displayName} url={avatarUrl} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{displayName}</p>
              <p className="truncate text-xs text-white/50">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            {loggingOut ? t('loggingOut') : t('logout')}
          </button>
        </div>
      </aside>

      {/* ─── MOBILE TOP BAR ──────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#1C3D1C]/10 bg-white/90 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8967A]">
            <svg viewBox="0 0 64 64" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="9" fill="white" opacity="0.9" />
              <circle cx="50" cy="14" r="9" fill="white" opacity="0.9" />
              <circle cx="14" cy="14" r="5" fill="#c47560" />
              <circle cx="50" cy="14" r="5" fill="#c47560" />
              <circle cx="32" cy="34" r="22" fill="white" opacity="0.95" />
              <ellipse cx="32" cy="42" rx="9" ry="6" fill="#c47560" />
              <circle cx="24" cy="30" r="3" fill="#1C3D1C" />
              <circle cx="40" cy="30" r="3" fill="#1C3D1C" />
              <ellipse cx="32" cy="39" rx="3" ry="2" fill="#1C3D1C" />
            </svg>
          </div>
          <span className="font-heading text-base text-[#1C3D1C]">{t('clientPanel')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Avatar name={displayName} url={avatarUrl} />
        </div>
      </header>

      {/* ─── MAIN CONTENT ────────────────────────────────────────── */}
      <main className="pb-24 lg:pl-64 lg:pb-8">
        <div className="px-4 py-6 lg:px-6 lg:py-6">
          {children}
        </div>
      </main>

      {/* ─── MOBILE BOTTOM NAV ───────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex items-stretch border-t border-[#1C3D1C]/10 bg-white/95 backdrop-blur-sm lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href as `/${string}`}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wide transition ${isActive(item.href)
              ? 'text-[#E8967A]'
              : 'text-[#1C3D1C]/40 hover:text-[#1C3D1C]'
              }`}
          >
            <span className={`transition ${isActive(item.href) ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
