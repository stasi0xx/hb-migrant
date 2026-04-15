'use client';

import { useState, useTransition } from 'react';
import { Plus, MapPin, Star, Pencil, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Address } from '@/app/[locale]/account/addresses/page';
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressInput,
} from '@/app/[locale]/account/addresses/actions';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  locale: string;
  addresses: Address[];
}

interface FormValues {
  label: string;
  street: string;
  zip: string;
  city: string;
  floor_room: string;
  is_default: boolean;
}

const EMPTY_FORM: FormValues = {
  label: '',
  street: '',
  zip: '',
  city: '',
  floor_room: '',
  is_default: false,
};

// ─── Form Modal ───────────────────────────────────────────────────────────────

function AddressFormModal({
  mode,
  initial,
  onClose,
  onSave,
  isPending,
  error,
}: {
  mode: 'add' | 'edit';
  initial: FormValues;
  onClose: () => void;
  onSave: (values: FormValues) => void;
  isPending: boolean;
  error: string | null;
}) {
  const t = useTranslations('auth.konto.addresses');
  const [values, setValues] = useState<FormValues>(initial);

  function set(field: keyof FormValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  const inputClass =
    'w-full rounded-xl border border-[#1C3D1C]/15 bg-[#F5F0E8]/50 px-4 py-2.5 text-sm text-[#1C3D1C] placeholder:text-[#1C3D1C]/30 outline-none focus:border-[#E8967A] focus:ring-2 focus:ring-[#E8967A]/15 transition';

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Card */}
      <div className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white sm:max-w-lg sm:rounded-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C3D1C]/8 px-5 py-4">
          <h2 className="font-heading text-lg text-[#1C3D1C]">
            {mode === 'add' ? t('form.addTitle') : t('form.editTitle')}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#1C3D1C]/40 transition hover:bg-[#1C3D1C]/8 hover:text-[#1C3D1C]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {/* Label */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
              {t('form.labelField')} *
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder={t('form.labelPlaceholder')}
              value={values.label}
              onChange={(e) => set('label', e.target.value)}
              autoFocus
            />
          </div>

          {/* Street */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
              {t('form.street')} *
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder={t('form.streetPlaceholder')}
              value={values.street}
              onChange={(e) => set('street', e.target.value)}
            />
          </div>

          {/* Zip + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
                {t('form.zip')} *
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder={t('form.zipPlaceholder')}
                value={values.zip}
                onChange={(e) => set('zip', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
                {t('form.city')} *
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder={t('form.cityPlaceholder')}
                value={values.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </div>
          </div>

          {/* Floor / Room */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1C3D1C]/60">
              {t('form.floorRoom')}
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder={t('form.floorRoomPlaceholder')}
              value={values.floor_room}
              onChange={(e) => set('floor_room', e.target.value)}
            />
          </div>

          {/* Default checkbox */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#1C3D1C]/10 px-4 py-3 transition hover:bg-[#F5F0E8]/50">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-[#E8967A]"
              checked={values.is_default}
              onChange={(e) => set('is_default', e.target.checked)}
            />
            <span className="text-sm font-medium text-[#1C3D1C]">{t('form.isDefault')}</span>
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#1C3D1C]/8 px-5 py-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#1C3D1C]/50 transition hover:bg-[#1C3D1C]/5 hover:text-[#1C3D1C] disabled:opacity-40"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => onSave(values)}
            disabled={isPending || !values.label || !values.street || !values.zip || !values.city}
            className="flex items-center gap-2 rounded-xl bg-[#E8967A] px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#d4785e] disabled:opacity-50 active:scale-[0.98]"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? t('form.saving') : t('form.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isPending,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isPending: boolean;
}) {
  const t = useTranslations('auth.konto.addresses');
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className={`flex flex-col rounded-2xl bg-white shadow-sm transition ${
        address.is_default ? 'ring-2 ring-[#E8967A]/40' : ''
      }`}
    >
      {/* Body */}
      <div className="flex-1 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E8967A]" />
            <p className="font-semibold text-[#1C3D1C]">{address.label}</p>
          </div>
          {address.is_default && (
            <span className="flex items-center gap-1 rounded-full bg-[#E8967A]/12 px-2.5 py-1 text-[11px] font-bold text-[#E8967A]">
              <Star className="h-3 w-3 fill-[#E8967A]" />
              {t('defaultBadge')}
            </span>
          )}
        </div>
        <div className="mt-2.5 space-y-0.5 pl-6 text-sm text-[#1C3D1C]/60">
          <p>{address.street}</p>
          <p>
            {address.zip} {address.city}
          </p>
          {address.floor_room && <p className="text-[#1C3D1C]/40">{address.floor_room}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#1C3D1C]/5 px-4 py-3">
        {/* Left: set default */}
        {!address.is_default && !confirmDelete && (
          <button
            onClick={onSetDefault}
            disabled={isPending}
            className="text-xs font-semibold text-[#1C3D1C]/40 transition hover:text-[#E8967A] disabled:opacity-40"
          >
            {t('setDefault')}
          </button>
        )}
        {(address.is_default || confirmDelete) && <div />}

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {confirmDelete ? (
            <>
              <span className="mr-2 text-xs font-semibold text-[#1C3D1C]/60">
                {t('deleteConfirmQuestion')}
              </span>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1C3D1C]/50 transition hover:bg-[#1C3D1C]/5"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => { setConfirmDelete(false); onDelete(); }}
                disabled={isPending}
                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-40"
              >
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                {t('deleteConfirmYes')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1C3D1C]/50 transition hover:bg-[#1C3D1C]/5 hover:text-[#1C3D1C] disabled:opacity-40"
              >
                <Pencil className="h-3.5 w-3.5" />
                {t('edit')}
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1C3D1C]/50 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t('delete')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AddressManager({ locale, addresses }: Props) {
  const t = useTranslations('auth.konto.addresses');
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<
    null | { mode: 'add' } | { mode: 'edit'; address: Address }
  >(null);
  const [formError, setFormError] = useState<string | null>(null);

  function openAdd() {
    setFormError(null);
    setFormState({ mode: 'add' });
  }

  function openEdit(address: Address) {
    setFormError(null);
    setFormState({ mode: 'edit', address });
  }

  function closeForm() {
    setFormState(null);
    setFormError(null);
  }

  function handleSave(values: FormValues) {
    const input: AddressInput = {
      label: values.label.trim(),
      street: values.street.trim(),
      zip: values.zip.trim(),
      city: values.city.trim(),
      floor_room: values.floor_room.trim() || null,
      is_default: values.is_default,
    };

    startTransition(async () => {
      const result =
        formState?.mode === 'edit'
          ? await updateAddress(locale, formState.address.id, input)
          : await createAddress(locale, input);

      if (result?.error) {
        setFormError(t('form.errorGeneric'));
      } else {
        closeForm();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteAddress(locale, id);
    });
  }

  function handleSetDefault(id: string) {
    startTransition(async () => {
      await setDefaultAddress(locale, id);
    });
  }

  const initialFormValues: FormValues =
    formState?.mode === 'edit'
      ? {
          label: formState.address.label,
          street: formState.address.street,
          zip: formState.address.zip,
          city: formState.address.city,
          floor_room: formState.address.floor_room ?? '',
          is_default: formState.address.is_default,
        }
      : EMPTY_FORM;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl text-[#1C3D1C]">{t('title')}</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-[#E8967A] px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#d4785e] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {t('addButton')}
        </button>
      </div>

      {/* ── Empty state ─────────────────────────────────────── */}
      {addresses.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-[#1C3D1C]/15 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF6EC]">
            <MapPin className="h-8 w-8 text-[#E8967A]" />
          </div>
          <div>
            <p className="font-heading text-xl text-[#1C3D1C]">{t('empty')}</p>
            <p className="mt-1 text-sm text-[#1C3D1C]/45">{t('emptySub')}</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-[#E8967A] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#d4785e] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            {t('addButton')}
          </button>
        </div>
      )}

      {/* ── Address grid ─────────────────────────────────────── */}
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => openEdit(address)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
              isPending={isPending}
            />
          ))}
        </div>
      )}

      {/* ── Form modal ───────────────────────────────────────── */}
      {formState && (
        <AddressFormModal
          mode={formState.mode}
          initial={initialFormValues}
          onClose={closeForm}
          onSave={handleSave}
          isPending={isPending}
          error={formError}
        />
      )}
    </>
  );
}
