'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/store/cart';
import { parseMenuDate } from '@/lib/utils';
import { getSiteConfig } from '@/config/sites';
import { formatDeliveryDate } from '@/lib/migrant-delivery';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  street: string;
  city: string;
  floorRoom: string;
  vatNumber: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

const site = getSiteConfig();
const isMigrant = site.orderingFlow === 'package-2x-week';

const formatAmount = (amount: number) => {
  if (site.currency === 'EUR') {
    return `€${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2).replace('.', ',')} zł`;
};

export default function CheckoutForm() {
  const t = useTranslations('checkout');
  const tCat = useTranslations('categories');
  const tCart = useTranslations('cart');
  const locale = useLocale();
  const { items, total, clearCart, packageMeta, deliveryCost, grandTotal } = useCartStore();

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    street: '',
    city: '',
    floorRoom: '',
    vatNumber: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const totalAmount = total();
  const deliveryCostAmount = deliveryCost();

  // Eating dates (DD.MM.YYYY) — used for non-migrant delivery display and item grouping
  const eatingDates = [...new Set(items.map((i) => i.date))].sort((a, b) => {
    const da = parseMenuDate(a).getTime();
    const db = parseMenuDate(b).getTime();
    return da - db;
  });

  // Actual Trunkrs delivery event dates for migrant, eating dates for other flows
  const apiDeliveryDates = isMigrant && packageMeta
    ? packageMeta.deliveryEventDates.map(iso => {
        const d = new Date(iso);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return `${dd}.${mm}.${d.getFullYear()}`;
      })
    : eatingDates;

  // Migrant: delivery event Date objects for display
  const migrantDeliveryEvents = isMigrant && packageMeta
    ? packageMeta.deliveryEventDates.map(iso => new Date(iso))
    : [];

  // For migrant: use the actual package size (3 or 6), not unique dates in cart
  const eatingDaysCount = (isMigrant && packageMeta) ? packageMeta.eatingDays : eatingDates.length;
  // Fixed box prices from config — not derived from individual item prices
  const foodCostPerDay = site.checkout.packageFoodCostPerDay ?? 0;
  const deliveryCostPerDay = site.delivery.type === 'per-day' ? (site.delivery.costPerDay ?? 0) : 0;
  const migrantGrandTotal = eatingDaysCount * (foodCostPerDay + deliveryCostPerDay);

  const formatDate = (dateStr: string) => {
    const d = parseMenuDate(dateStr);
    return d.toLocaleDateString(locale, {
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
    } else if (site.checkout.nominatimCountryCode === 'nl') {
      // Dutch numbers: 10 digits (06xxxxxxxx) or +31 followed by 9 digits
      const nlPhone = form.phone.trim().replace(/[\s\-]/g, '');
      if (!/^(\+31|0)\d{9}$/.test(nlPhone)) {
        newErrors.phone = t('invalidPhone');
      }
    } else if (!/^[\d\s\+\-\(\)]{7,}$/.test(form.phone)) {
      newErrors.phone = t('invalidPhone');
    }
    if (site.checkout.showCompanyName && !form.companyName.trim()) {
      newErrors.companyName = t('requiredField');
    }
    if (site.checkout.vatField === 'vat-nl' && form.vatNumber.trim()) {
      const nlVat = form.vatNumber.trim().toUpperCase().replace(/[\s.]/g, '');
      if (!/^NL\d{9}B\d{2}$/.test(nlVat)) {
        newErrors.vatNumber = t('invalidVatNl');
      }
    }
    if (!form.street.trim()) newErrors.street = t('requiredField');
    if (!form.city.trim()) {
      newErrors.city = t('requiredField');
    } else if (!site.checkout.cities.includes(form.city.trim())) {
      newErrors.city = t('invalidCity');
    }
    if (form.floorRoom.trim() && /\d{2}-\d{3}/.test(form.floorRoom.trim())) {
      newErrors.floorRoom = t('invalidFloorRoom') || 'Wpisz piętro/pokój, nie kod pocztowy';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      // Address validation via Nominatim — only for sites that need it (PL)
      if (site.checkout.addressValidation) {
        try {
          const cleanStreet = form.street
            .replace(/^(ul\.|ulica|ul|al\.|aleja|al|pl\.|plac|pl)\s+/i, '')
            .replace(/\s*\d+.*$/, '')
            .trim();

          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(
              cleanStreet
            )}&city=${encodeURIComponent(form.city)}&format=json&addressdetails=1&countrycodes=${site.checkout.nominatimCountryCode}`,
            { headers: { 'User-Agent': 'Glodny-Niedzwiedz-App/1.0' } }
          );

          if (nomRes.ok) {
            const nomData = await nomRes.json();
            if (!nomData || nomData.length === 0) {
              setErrors((prev) => ({ ...prev, street: t('invalidStreetForCity') }));
              setIsLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Address validation failed:', err);
          // Proceed with order if validation API fails
        }
      }

      // Build notes: append VAT/NIP if provided
      const vatSuffix =
        site.checkout.vatField && form.vatNumber.trim()
          ? `${site.checkout.vatField === 'nip-pl' ? 'NIP' : 'VAT'}: ${form.vatNumber.trim()}`
          : '';
      const combinedNotes = [form.notes.trim(), vatSuffix].filter(Boolean).join('\n');

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
            notes: combinedNotes,
          },
          paymentMethod: 'stripe',
          deliveryDates: apiDeliveryDates,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.url) {
        clearCart();
        window.location.href = data.url;
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;

    if (e.key === 'Enter') {
      if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON' || target.tagName === 'SELECT') {
        return;
      }

      e.preventDefault();

      const form = e.currentTarget;
      const elements = Array.from(form.elements) as HTMLElement[];
      const focusable = elements.filter(
        (el) =>
          (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') &&
          !el.hasAttribute('disabled') &&
          (el as HTMLInputElement).type !== 'hidden'
      );

      const index = focusable.indexOf(target);
      if (index > -1 && index < focusable.length - 1) {
        focusable[index + 1].focus();
      } else {
        target.blur();
      }
    }
  };

  const filteredCities = site.checkout.cities.filter((city) =>
    city.toLowerCase().includes(form.city.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col gap-4">
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
              enterKeyHint="next"
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
              enterKeyHint="next"
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
            enterKeyHint="next"
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
            enterKeyHint="next"
            placeholder={site.checkout.phonePlaceholder}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        {site.checkout.showCompanyName && (
          <div className="mt-3">
            <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('companyName')}</label>
            <input
              type="text"
              className={inputClass('companyName')}
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              enterKeyHint="next"
              placeholder="Nazwa firmy sp. z o.o."
            />
            {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
          </div>
        )}

        {site.checkout.vatField && (
          <div className="mt-3">
            <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">
              {site.checkout.vatField === 'nip-pl' ? t('nipLabel') : t('vatNlLabel')}
            </label>
            <input
              type="text"
              className={inputClass('vatNumber')}
              value={form.vatNumber}
              onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
              enterKeyHint="next"
              placeholder={site.checkout.vatField === 'nip-pl' ? t('nipPlaceholder') : t('vatNlPlaceholder')}
            />
            {errors.vatNumber && <p className="mt-1 text-xs text-red-500">{errors.vatNumber}</p>}
          </div>
        )}

        <div className="mt-3">
          <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('street')}</label>
          <input
            type="text"
            className={inputClass('street')}
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            enterKeyHint="next"
            placeholder={site.checkout.streetPlaceholder}
          />
          {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="relative">
            <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('city')}</label>
            <input
              type="text"
              className={inputClass('city')}
              value={form.city}
              onChange={(e) => {
                setForm({ ...form, city: e.target.value });
                setIsCityDropdownOpen(true);
              }}
              onFocus={() => setIsCityDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsCityDropdownOpen(false), 200)}
              enterKeyHint="next"
              autoComplete="address-level2"
              placeholder={t('cityPlaceholder')}
            />
            {isCityDropdownOpen && form.city.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border-2 border-[#1C3D1C]/20 bg-white shadow-xl">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <div
                      key={city}
                      className="cursor-pointer px-4 py-3 text-sm font-600 text-[#1C3D1C] transition-all hover:bg-[#E8967A] hover:text-white"
                      onClick={() => {
                        setForm({ ...form, city });
                        setIsCityDropdownOpen(false);
                      }}
                    >
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm font-600 text-[#1C3D1C]/50">
                    {t('cityNoResults')}
                  </div>
                )}
              </div>
            )}
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('floorRoom')}</label>
            <input
              type="text"
              className={inputClass('floorRoom')}
              value={form.floorRoom}
              onChange={(e) => setForm({ ...form, floorRoom: e.target.value })}
              enterKeyHint="next"
              autoComplete="off"
              placeholder={t('floorRoomPlaceholder')}
            />
            {errors.floorRoom && <p className="mt-1 text-xs text-red-500">{errors.floorRoom}</p>}
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-700 text-[#1C3D1C]/70 uppercase tracking-wide">{t('notes')}</label>
          <textarea
            className={inputClass('notes') + ' resize-none'}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('notesPlaceholder')}
            rows={2}
          />
        </div>
      </div>

      {/* Delivery dates */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-heading text-xl text-[#1C3D1C] mb-3">{t('deliveryDates')}</h2>
        <div className="flex flex-col gap-2">
          {isMigrant && migrantDeliveryEvents.length > 0 ? (
            // Migrant: show actual Trunkrs delivery events (Sunday / Wednesday evenings)
            migrantDeliveryEvents.map((eventDate, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-[#FDF6EC] px-4 py-3"
              >
                <svg className="h-5 w-5 flex-shrink-0 text-[#E8967A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <div>
                  <p className="text-sm font-700 text-[#1C3D1C] capitalize">
                    {formatDeliveryDate(eventDate, locale)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            // Other flows: show individual eating / delivery dates
            eatingDates.map((date: string) => (
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
            ))
          )}
        </div>
      </div>

      {/* Order summary */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-heading text-xl text-[#1C3D1C] mb-3">{t('orderSummary')}</h2>

        {isMigrant ? (
          // Migrant: itemized dishes grouped by category + delivery line
          <div className="flex flex-col gap-3">
            {/* Dishes grouped by category */}
            {(() => {
              const grouped: Record<string, typeof items> = {};
              items.forEach(item => {
                const cat = item.category || t('migrantFood');
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(item);
              });
              return Object.entries(grouped).map(([category, catItems]) => (
                <div key={category}>
                  <p className="text-xs font-700 text-[#1C3D1C]/50 uppercase tracking-wide mb-1.5">{tCat(category as Parameters<typeof tCat>[0])}</p>
                  <div className="flex flex-col gap-1">
                    {catItems.map(item => (
                      <div key={`${item.id}-${item.date}`} className="flex items-start justify-between text-sm gap-2">
                        <span className="text-[#1C3D1C]/80 flex-1 leading-snug">{item.name}</span>
                        <span className="text-[#1C3D1C]/50 flex-shrink-0">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
            {/* Food cost calculation line */}
            <div className="flex items-center justify-between text-sm pt-1 border-t border-[#1C3D1C]/10">
              <span className="text-[#1C3D1C]/70">
                {t('migrantFoodCost', { days: eatingDaysCount })}
              </span>
              <span className="font-700 text-[#1C3D1C]">
                {eatingDaysCount} × {formatAmount(foodCostPerDay)} = {formatAmount(foodCostPerDay * eatingDaysCount)}
              </span>
            </div>
            {/* Delivery cost line */}
            <div className="flex items-center justify-between text-sm border-t border-[#1C3D1C]/10">
              <span className="text-[#1C3D1C]/70">
                {t('migrantDeliveryCost')} ({eatingDaysCount} ×)
              </span>
              <span className="font-700 text-[#1C3D1C]">
                {formatAmount(deliveryCostPerDay * eatingDaysCount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[#1C3D1C]/10 pt-3">
              <span className="font-700 text-[#1C3D1C]">{t('total')}</span>
              <span className="font-heading text-2xl text-[#1C3D1C]">
                {formatAmount(migrantGrandTotal)}
              </span>
            </div>
          </div>
        ) : (
          // Other flows: itemized list
          <>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.date}`} className="flex items-center justify-between text-sm">
                  <span className="text-[#1C3D1C]/80 flex-1 pr-2 leading-snug">{item.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[#1C3D1C]/50">×{item.quantity}</span>
                    <span className="font-700 text-[#1C3D1C]">
                      {formatAmount(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {deliveryCostAmount > 0 && (
              <div className="flex items-center justify-between text-sm mt-3 border-t border-[#1C3D1C]/10 pt-3">
                <span className="text-[#1C3D1C]/70">{tCart('deliveryCost')}</span>
                <span className="font-700 text-[#1C3D1C]">{formatAmount(deliveryCostAmount)}</span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-[#1C3D1C]/10 pt-3">
              <span className="font-700 text-[#1C3D1C]">
                {deliveryCostAmount > 0 ? tCart('grandTotal') : t('total')}
              </span>
              <span className="font-heading text-2xl text-[#1C3D1C]">
                {formatAmount(deliveryCostAmount > 0 ? grandTotal() : totalAmount)}
              </span>
            </div>
          </>
        )}
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
