export type SiteId =
  | 'glodny-niedzwiedz'
  | 'hongige-beer-migrant'
  | 'hongige-beer-office';

export type Currency = 'PLN' | 'EUR';
export type OrderingFlow = 'weekly' | 'daily-4day' | 'package-2x-week';
export type PaymentMethod = 'card' | 'ideal' | 'blik' | 'p24';

export interface DeliveryConfig {
  type: 'free' | 'per-order' | 'per-day';
  /** EUR per day — migrant site: €1.66 */
  costPerDay?: number;
  /** EUR per order — office site: €5.00 */
  costPerOrder?: number;
}

export interface PaymentConfig {
  methods: PaymentMethod[];
  cashOption: boolean;
}

export interface CheckoutConfig {
  /** City list shown in dropdown */
  cities: string[];
  /** Phone input placeholder */
  phonePlaceholder: string;
  /** Street input placeholder */
  streetPlaceholder: string;
  /** Which tax ID field to show, or null if none */
  vatField: 'nip-pl' | 'vat-nl' | null;
  /** Whether to show the company name field */
  showCompanyName: boolean;
  /** Run Nominatim street validation (PL-specific) */
  addressValidation: boolean;
  /** ISO country code for Nominatim (e.g. 'pl', 'nl') */
  nominatimCountryCode: string;
  /** Fixed food cost per day for package-based flows (migrant). Undefined for other flows. */
  packageFoodCostPerDay?: number;
}

export interface SiteConfig {
  id: SiteId;
  name: string;
  domain: string;
  currency: Currency;
  /** Fraction (0.05 = 5%). 0 = no discount. */
  onlineDiscount: number;
  payment: PaymentConfig;
  delivery: DeliveryConfig;
  orderingFlow: OrderingFlow;
  /** Which subset of menu.json to show */
  menuKey: 'full' | 'migrant';
  locales: readonly string[];
  defaultLocale: string;
  /** Path relative to /public */
  logo: string;
  checkout: CheckoutConfig;
  /** Browser tab title */
  siteTitle: string;
  /** Page description for SEO */
  siteDescription: string;
  /** Path relative to /public — used as favicon */
  favicon: string;
}

const SITES: Record<SiteId, SiteConfig> = {
  'glodny-niedzwiedz': {
    id: 'glodny-niedzwiedz',
    name: 'Głodny Niedźwiedź',
    domain: 'glodnyniedzwiedz.pl',
    currency: 'PLN',
    onlineDiscount: 0.05,
    payment: { methods: ['card', 'blik', 'p24'], cashOption: true },
    delivery: { type: 'free' },
    orderingFlow: 'weekly',
    menuKey: 'full',
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    logo: '/logos/gn.svg',
    siteTitle: 'Głodny Niedźwiedź – Catering',
    siteDescription: 'Zamów pyszne jedzenie z dostawą do biura. Tygodniowe menu, dostawa 8:00–10:00.',
    favicon: '/favicon.ico',
    checkout: {
      cities: ['Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Łódź', 'Katowice'],
      phonePlaceholder: '+48 500 123 456',
      streetPlaceholder: 'ul. Marszałkowska 1/10',
      vatField: 'nip-pl',
      showCompanyName: true,
      addressValidation: true,
      nominatimCountryCode: 'pl',
    },
  },

  // Migrant workers in NL — 9 languages, package ordering, 2 deliveries/week
  'hongige-beer-migrant': {
    id: 'hongige-beer-migrant',
    name: 'Hongige Beer',
    domain: 'hongigebeer.nl',
    currency: 'EUR',
    onlineDiscount: 0,
    payment: { methods: ['card', 'ideal'], cashOption: false },
    delivery: { type: 'per-day', costPerDay: 1.66 },
    orderingFlow: 'package-2x-week',
    menuKey: 'migrant',
    locales: ['en', 'pl', 'ro', 'hu', 'bg', 'cs', 'es', 'pt', 'it'],
    defaultLocale: 'en',
    logo: '/logos/hb.svg',
    siteTitle: 'Hongige Beer – Maaltijden voor migranten',
    siteDescription: 'Bestel dagelijkse maaltijden bezorgd aan huis. Verse gerechten, 2x per week bezorgd.',
    favicon: '/favicons/hb.ico',
    checkout: {
      cities: ['Tilburg', 'Den Bosch', 'Eindhoven', 'Venlo'],
      phonePlaceholder: '+31 6 12345678',
      streetPlaceholder: 'Stationsstraat 1',
      vatField: null,
      showCompanyName: false,
      addressValidation: false,
      nominatimCountryCode: 'nl',
      packageFoodCostPerDay: 9.98,
    },
  },

  // Office staff in NL — 4 languages, daily delivery Mon–Fri, 4-day lead time
  'hongige-beer-office': {
    id: 'hongige-beer-office',
    name: 'Hongige Beer',
    domain: 'office.hongigebeer.nl',
    currency: 'EUR',
    onlineDiscount: 0,
    payment: { methods: ['card', 'ideal'], cashOption: false },
    delivery: { type: 'per-order', costPerOrder: 5.0 },
    orderingFlow: 'daily-4day',
    menuKey: 'full',
    locales: ['nl', 'en', 'fr', 'de'],
    defaultLocale: 'nl',
    logo: '/logos/hb.svg',
    siteTitle: 'Hongerige Beer',
    siteDescription: 'Bestel verse kantoormaaltijden met bezorging. Dagelijks menu, levering 8:00–10:00.',
    favicon: '/favicons/hb.png',
    checkout: {
      cities: ['Tilburg', 'Den Bosch', 'Eindhoven'],
      phonePlaceholder: '+31 6 12345678',
      streetPlaceholder: 'Stationsstraat 1',
      vatField: 'vat-nl',
      showCompanyName: true,
      addressValidation: true,
      nominatimCountryCode: 'nl',
    },
  },
};

export function getSiteConfig(): SiteConfig {
  const siteId = (process.env.NEXT_PUBLIC_SITE ?? 'glodny-niedzwiedz') as SiteId;
  return SITES[siteId] ?? SITES['glodny-niedzwiedz'];
}

export function getSiteId(): SiteId {
  return (process.env.NEXT_PUBLIC_SITE ?? 'glodny-niedzwiedz') as SiteId;
}

/** Stripe-supported locale codes. Falls back to 'en' if not in the list. */
const STRIPE_LOCALES = new Set([
  'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi',
  'fr', 'hu', 'id', 'it', 'ja', 'lt', 'lv', 'ms', 'mt',
  'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv',
  'th', 'tr', 'vi', 'zh',
]);

export function toStripeLocale(locale: string): import('stripe').Stripe.Checkout.SessionCreateParams['locale'] {
  return (STRIPE_LOCALES.has(locale) ? locale : 'en') as import('stripe').Stripe.Checkout.SessionCreateParams['locale'];
}
