'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { AlertCircle, Mail, CheckCircle } from 'lucide-react';

function BearLogo() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8967A]">
      <svg viewBox="0 0 64 64" fill="none" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
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
  );
}

type Step = 'email' | 'code' | 'success';

function LinkAccountForm() {
  const t = useTranslations('auth.linkAccount');
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationToken = searchParams.get('token') ?? '';

  const [step, setStep] = useState<Step>('email');
  const [orderEmail, setOrderEmail] = useState('');
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryAfter, setRetryAfter] = useState(0);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setGoogleEmail(user.email ?? '');
      }
    });
  }, [supabase]);

  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = setInterval(() => setRetryAfter((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(timer);
  }, [retryAfter]);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: orderEmail, userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === 'rate_limited') {
        setRetryAfter(data.retryAfter ?? 60);
        setError(t('rateLimited', { seconds: data.retryAfter ?? 60 }));
      } else {
        setError(t('sendError'));
      }
      setLoading(false);
      return;
    }

    setStep('code');
    setLoading(false);
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: orderEmail,
        code,
        userId,
        registrationToken: registrationToken || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error === 'code_expired' ? t('codeExpired') : t('invalidCode'));
      setLoading(false);
      return;
    }

    setStep('success');
    setTimeout(() => {
      router.push('/pl/account');
      router.refresh();
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-3">
        <BearLogo />
        <div className="text-center">
          <p className="font-heading text-xl text-[#1C3D1C] leading-none">Głodny Niedźwiedź</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8967A]">
            EST. 2018 CATERING
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lg">
        {step === 'success' ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="font-heading text-xl text-[#1C3D1C] mb-2">{t('successTitle')}</h2>
            <p className="text-sm text-[#1C3D1C]/60">{t('successMessage')}</p>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-2xl text-[#1C3D1C] mb-1">{t('title')}</h1>
            <p className="text-sm text-[#1C3D1C]/60 mb-5">{t('subtitle')}</p>

            {googleEmail && (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#FDF6EC] px-4 py-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#1C3D1C]/40" />
                <div>
                  <p className="text-xs text-[#1C3D1C]/50">{t('googleEmailLabel')}</p>
                  <p className="text-sm font-semibold text-[#1C3D1C]">{googleEmail}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleSendCode} className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/70">
                    {t('emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                    placeholder="twoj@email.pl"
                    required
                    className="w-full rounded-xl border border-[#1C3D1C]/15 bg-[#FDF6EC] px-4 py-3 text-sm text-[#1C3D1C] outline-none transition focus:border-[#1C3D1C]/40 focus:ring-2 focus:ring-[#1C3D1C]/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || retryAfter > 0}
                  className="w-full rounded-2xl bg-[#1C3D1C] py-3.5 font-heading text-base text-white shadow transition hover:bg-[#2d5a2d] disabled:opacity-50"
                >
                  {loading
                    ? t('sending')
                    : retryAfter > 0
                    ? t('retryIn', { seconds: retryAfter })
                    : t('sendCode')}
                </button>
              </form>
            )}

            {step === 'code' && (
              <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
                <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
                  {t('codeSent', { email: orderEmail })}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/70">
                    {t('codeLabel')}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    className="w-full rounded-xl border border-[#1C3D1C]/15 bg-[#FDF6EC] px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-[#1C3D1C] outline-none transition focus:border-[#1C3D1C]/40 focus:ring-2 focus:ring-[#1C3D1C]/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full rounded-2xl bg-[#1C3D1C] py-3.5 font-heading text-base text-white shadow transition hover:bg-[#2d5a2d] disabled:opacity-50"
                >
                  {loading ? t('verifying') : t('verifyButton')}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setCode(''); setError(''); }}
                  className="text-sm text-[#1C3D1C]/50 hover:text-[#1C3D1C] transition"
                >
                  {t('changeEmail')}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PowiazKontoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center"><span className="text-4xl">🐻</span></div>}>
      <LinkAccountForm />
    </Suspense>
  );
}
