'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/store/cart';
import { useRouter } from '@/i18n/navigation';
import { parseMenuDate } from '@/lib/utils';

const POLISH_CITIES = [
  'Warszawa',
  'Kraków',
  'Wrocław',
  'Poznań',
  'Gdańsk',
  'Łódź',
  'Katowice',
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  street: string;
  city: string;
  floorRoom: string;
  notes: string;
  paymentMethod: 'stripe' | 'cash';
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutForm() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    street: '',
    city: '',
    floorRoom: '',
    notes: '',
    paymentMethod: 'stripe',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = total();

  const deliveryDates = [...new Set(items.map((i) => i.date))].sort((a, b) => {
    const da = parseMenuDate(a).getTime();
    const db = parseMenuDate(b).getTime();
    return da - db;
  });

  const formatDate = (dateStr: string) => {
    const d = parseMenuDate(dateStr);
    return d.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = t('requiredField');
    if (!form.lastName.trim()) newErrors.lastName = t('requiredField');
    if (!form.email.trim()) {
      newErrors.email = t('requiredField');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t('invalidEmail');
    }
    if (!form.phone.trim()) {
      newErrors.phone = t('requiredField');
    } else if (!/^[\d\s\+\-\(\)]{7,}$/.test(form.phone)) {
      newErrors.phone = t('invalidPhone');
    }
    if (!form.companyName.trim()) newErrors.companyName = t('requiredField');
    if (!form.street.trim()) newErrors.street = t('requiredField');
    if (!form.city.trim()) newErrors.city = t('requiredField');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            date: item.date,
            quantity: item.quantity,
          })),
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            companyName: form.companyName,
            address: form.street,
            city: form.city,
            floorRoom: form.floorRoom,
            notes: form.notes,
          },
          paymentMethod: form.paymentMethod,
          deliveryDates,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (form.paymentMethod === 'stripe' && data.url) {
        window.location.href = data.url;
      } else if (form.paymentMethod === 'cash' && data.orderId) {
        clearCart();
        router.push(`/success?orderId=${data.orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Error processing order');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border-2 px-4 py-3 text-sm font-600 text-[#1C3D1C] placeholder-[#1C3D1C]/30 outline-none transition-all focus:border-[#1C3D1C] bg-white ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-[#1C3D1C]/20'
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Delivery section */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-heading text-xl text-[#1C3D1C] mb-4">{t('deliveryDetails')}</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('firstName')}</label>
            <input
              type="text"
              className={inputClass('firstName')}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Jan"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('lastName')}</label>
            <input
              type="text"
              className={inputClass('lastName')}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Kowalski"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('email')}</label>
          <input
            type="email"
            className={inputClass('email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jan@firma.pl"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('phone')}</label>
          <input
            type="tel"
            className={inputClass('phone')}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+48 500 123 456"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('companyName')}</label>
          <input
            type="text"
            className={inputClass('companyName')}
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            placeholder="Nazwa firmy sp. z o.o."
          />
          {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('street')}</label>
          <input
            type="text"
            className={inputClass('street')}
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            placeholder="ul. Marszałkowska 1/10"
          />
          {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('city')}</label>
            <select
              className={inputClass('city')}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            >
              <option value="">{locale === 'pl' ? 'Wybierz miasto' : 'Select city'}</option>
              {POLISH_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('floorRoom')}</label>
            <input
              type="text"
              className={inputClass('floorRoom')}
              value={form.floorRoom}
              onChange={(e) => setForm({ ...form, floorRoom: e.target.value })}
              placeholder="5 piętro, p. 512"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('notes')}</label>
          <textarea
            className={inputClass('notes') + ' resize-none'}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={locale === 'pl' ? 'Np. zadzwoń przed dostawą...' : 'E.g. call before delivery...'}
            rows={2}
          />
        </div>
      </div>

      {/* Delivery dates */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-heading text-xl text-[#1C3D1C] mb-3">{t('deliveryDates')}</h2>
        <div className="flex flex-col gap-2">
          {deliveryDates.map((date) => (
            <div
              key={date}
              className="flex items-center gap-3 rounded-xl bg-[#FDF6EC] px-4 py-3"
            >
              <svg className="h-5 w-5 flex-shrink-0 text-[#E8967A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <div>
                <p className="text-sm font-700 text-[#1C3D1C] capitalize">{formatDate(date)}</p>
                <p className="text-xs text-[#1C3D1C]/60">{t('deliveryWindow')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-heading text-xl text-[#1C3D1C] mb-3">{t('orderSummary')}</h2>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={`${item.id}-${item.date}`} className="flex items-center justify-between text-sm">
              <span className="text-[#1C3D1C]/80 flex-1 pr-2 leading-snug">{item.name}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[#1C3D1C]/50">×{item.quantity}</span>
                <span className="font-700 text-[#1C3D1C]">
                  {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#1C3D1C]/10 pt-3">
          <span className="font-700 text-[#1C3D1C]">{t('total')}</span>
          <span className="font-heading text-2xl text-[#1C3D1C]">
            {totalAmount.toFixed(2).replace('.', ',')} zł
          </span>
        </div>
      </div>

      {/* Payment method */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-heading text-xl text-[#1C3D1C] mb-3">{t('paymentMethod')}</h2>
        <div className="flex flex-col gap-3">
          <label
            className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
              form.paymentMethod === 'stripe'
                ? 'border-[#1C3D1C] bg-[#1C3D1C]/5'
                : 'border-[#1C3D1C]/20 hover:border-[#1C3D1C]/40'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={form.paymentMethod === 'stripe'}
              onChange={() => setForm({ ...form, paymentMethod: 'stripe' })}
              className="sr-only"
            />
            <div
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                form.paymentMethod === 'stripe' ? 'border-[#1C3D1C]' : 'border-gray-300'
              }`}
            >
              {form.paymentMethod === 'stripe' && (
                <div className="h-2.5 w-2.5 rounded-full bg-[#1C3D1C]" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-700 text-[#1C3D1C]">{t('payStripe')}</p>
              <p className="text-xs text-[#1C3D1C]/60">Visa, Mastercard, BLIK</p>
            </div>
            <svg className="h-6 w-6 flex-shrink-0 text-[#1C3D1C]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </label>

          <label
            className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
              form.paymentMethod === 'cash'
                ? 'border-[#1C3D1C] bg-[#1C3D1C]/5'
                : 'border-[#1C3D1C]/20 hover:border-[#1C3D1C]/40'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={form.paymentMethod === 'cash'}
              onChange={() => setForm({ ...form, paymentMethod: 'cash' })}
              className="sr-only"
            />
            <div
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                form.paymentMethod === 'cash' ? 'border-[#1C3D1C]' : 'border-gray-300'
              }`}
            >
              {form.paymentMethod === 'cash' && (
                <div className="h-2.5 w-2.5 rounded-full bg-[#1C3D1C]" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-700 text-[#1C3D1C]">{t('payCash')}</p>
              <p className="text-xs text-[#1C3D1C]/60">
                {locale === 'pl' ? 'Gotówka przy odbiorze' : 'Cash on delivery'}
              </p>
            </div>
            <svg className="h-6 w-6 flex-shrink-0 text-[#1C3D1C]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || items.length === 0}
        className="w-full rounded-2xl bg-[#E8967A] py-5 font-heading text-2xl text-white shadow-lg transition-all hover:bg-[#d4755a] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('processing')}
          </span>
        ) : (
          `${t('placeOrder')} →`
        )}
      </button>
    </form>
  );
}
