'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const ERROR_MESSAGES: Record<string, string> = {
  auth: 'Błąd logowania. Spróbuj ponownie.',
  no_code: 'Nieprawidłowy link autoryzacyjny.',
};


function LoginForm() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const urlError = searchParams.get('error');
  const next = searchParams.get('next') ?? '/pl/account';

  useEffect(() => {
    if (urlError) setError(ERROR_MESSAGES[urlError] ?? t('genericError'));
  }, [urlError, t]);

  const supabase = getSupabaseBrowserClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(t('invalidCredentials'));
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          // If user has email/password account with same email, Supabase will link them
          prompt: 'select_account',
        },
      },
    });

    if (authError) {
      setError(t('genericError'));
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand */}
      <div className="mb-8 flex flex-col items-center">
        <Image src="/images/hb-logo.png" alt="Głodny Niedźwiedź" width={180} height={80} priority />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="font-heading text-2xl text-[#1C3D1C] mb-1">{t('title')}</h1>
        <p className="text-sm text-[#1C3D1C]/60 mb-6">{t('subtitle')}</p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#1C3D1C]/15 bg-white px-4 py-3 text-sm font-semibold text-[#1C3D1C] shadow-sm transition hover:bg-[#FDF6EC] disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {googleLoading ? t('loading') : t('googleButton')}
        </button>

        {/* Divider */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1C3D1C]/10" />
          <span className="text-xs text-[#1C3D1C]/40">{t('orDivider')}</span>
          <div className="h-px flex-1 bg-[#1C3D1C]/10" />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/70">
              {t('emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
              className="w-full rounded-xl border border-[#1C3D1C]/15 bg-[#FDF6EC] px-4 py-3 text-sm text-[#1C3D1C] outline-none transition focus:border-[#1C3D1C]/40 focus:ring-2 focus:ring-[#1C3D1C]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/70">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                required
                className="w-full rounded-xl border border-[#1C3D1C]/15 bg-[#FDF6EC] px-4 py-3 pr-11 text-sm text-[#1C3D1C] outline-none transition focus:border-[#1C3D1C]/40 focus:ring-2 focus:ring-[#1C3D1C]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C3D1C]/40 hover:text-[#1C3D1C]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="mt-1 w-full rounded-2xl bg-[#1C3D1C] py-3.5 font-heading text-base text-white shadow transition hover:bg-[#2d5a2d] disabled:opacity-50"
          >
            {loading ? t('loading') : t('submitButton')}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#1C3D1C]/50">
          {t('noAccount')}{' '}
          <Link href="/" className="font-semibold text-[#E8967A] hover:underline">
            {t('orderFirst')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LogowaniePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center"><span className="text-4xl">🐻</span></div>}>
      <LoginForm />
    </Suspense>
  );
}
