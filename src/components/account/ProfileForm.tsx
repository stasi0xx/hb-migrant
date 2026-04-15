'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { User, Mail, Phone, Lock, Loader2, Check, AlertCircle, KeyRound } from 'lucide-react';
import { updateProfile, sendPasswordReset } from '@/app/[locale]/account/profile/actions';

interface Props {
  locale: string;
  fullName: string;
  email: string;
  phone: string;
}

const inputClass =
  'w-full rounded-xl border border-[#1C3D1C]/15 bg-[#F5F0E8]/50 px-4 py-2.5 text-sm text-[#1C3D1C] placeholder:text-[#1C3D1C]/30 outline-none focus:border-[#E8967A] focus:ring-2 focus:ring-[#E8967A]/15 transition';

const inputClassDisabled =
  'w-full rounded-xl border border-[#1C3D1C]/10 bg-[#1C3D1C]/4 px-4 py-2.5 text-sm text-[#1C3D1C]/40 cursor-not-allowed';

export default function ProfileForm({ locale, fullName, email, phone }: Props) {
  const t = useTranslations('auth.konto.profil');

  const [name, setName] = useState(fullName);
  const [phoneVal, setPhoneVal] = useState(phone);

  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [resetState, setResetState] = useState<'idle' | 'sent' | 'error'>('idle');

  const [isPending, startTransition] = useTransition();
  const [isResetting, startResetTransition] = useTransition();

  function handleSave() {
    setSaveState('idle');
    startTransition(async () => {
      const result = await updateProfile(locale, {
        full_name: name.trim(),
        phone: phoneVal.trim(),
      });
      setSaveState(result?.error ? 'error' : 'saved');
    });
  }

  function handleResetPassword() {
    setResetState('idle');
    startResetTransition(async () => {
      const result = await sendPasswordReset(email);
      setResetState(result?.error ? 'error' : 'sent');
    });
  }

  const isDirty = name !== fullName || phoneVal !== phone;

  return (
    <div className="space-y-5">

      {/* ── Dane konta ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-[#1C3D1C]/40" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#1C3D1C]/40">
            {t('personalData')}
          </p>
        </div>

        <div className="space-y-4">
          {/* Imię i nazwisko */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
              {t('fullName')}
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder={t('fullNamePlaceholder')}
              value={name}
              onChange={(e) => { setName(e.target.value); setSaveState('idle'); }}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
              {t('email')}
            </label>
            <div className="relative">
              <input
                type="email"
                className={inputClassDisabled}
                value={email}
                disabled
                readOnly
              />
              <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1C3D1C]/20" />
            </div>
            <p className="mt-1 text-[11px] text-[#1C3D1C]/35">{t('emailHint')}</p>
          </div>

          {/* Telefon */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
              {t('phone')}
            </label>
            <div className="relative">
              <input
                type="tel"
                className={inputClass}
                placeholder={t('phonePlaceholder')}
                value={phoneVal}
                onChange={(e) => { setPhoneVal(e.target.value); setSaveState('idle'); }}
              />
              <Phone className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1C3D1C]/20" />
            </div>
          </div>
        </div>

        {/* Feedback */}
        {saveState === 'error' && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t('errorGeneric')}
          </div>
        )}
        {saveState === 'saved' && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            <Check className="h-4 w-4 shrink-0" />
            {t('saved')}
          </div>
        )}

        {/* Save button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isPending || !isDirty}
            className="flex items-center gap-2 rounded-xl bg-[#E8967A] px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#d4785e] disabled:opacity-40 active:scale-[0.98]"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? t('saving') : t('save')}
          </button>
        </div>
      </div>

      {/* ── Bezpieczeństwo ─────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#1C3D1C]/40" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#1C3D1C]/40">
            {t('security')}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#1C3D1C]">{t('resetPasswordTitle')}</p>
            <p className="mt-0.5 text-xs text-[#1C3D1C]/45">{t('resetPasswordSub')}</p>
          </div>
          <button
            onClick={handleResetPassword}
            disabled={isResetting || resetState === 'sent'}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-[#1C3D1C]/15 px-4 py-2.5 text-sm font-semibold text-[#1C3D1C] transition hover:bg-[#F5F0E8] disabled:opacity-50 active:scale-[0.98]"
          >
            {isResetting
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <KeyRound className="h-4 w-4" />
            }
            {resetState === 'sent' ? t('resetPasswordSent') : t('resetPasswordButton')}
          </button>
        </div>

        {resetState === 'error' && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t('errorGeneric')}
          </div>
        )}
      </div>

    </div>
  );
}
