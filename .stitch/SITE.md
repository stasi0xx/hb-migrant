# Głodny Niedźwiedź — Site Vision & Roadmap

## 1. Vision

E-commerce site for **Głodny Niedźwiedź** (glodnyniedzwiedz.pl) — office catering delivering fresh, quality meals directly to workplaces. The brand positioning is "real food for real people — no BS". Anti-diet-catering, anti-corporate. Think Duolingo energy meets Apple polish meets Coca-Cola emotional resonance, but for office lunch.

**Target user:** Kuba/Ola, 28–38, office worker earning 6-12k PLN net. Done with sad supermarket sandwiches. Wants the best part of their workday to be lunch.

## 2. Brand

- **Primary:** Bottle green `#1B4332`
- **Accent:** Salmon pink `#E8927C`
- **Background:** Cream `#FDF6EC`
- **Highlight:** Mustard yellow `#D4A017`
- **Voice:** Direct, warm, confident, a little funny. Never preachy.
- **USPs:** INAO-certified ingredients | 24h freshness | Wide variety (meat/vege/sushi) | Office delivery

## 3. Tech Stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Zustand (cart state)
- Stripe (payments)
- Supabase (DB)
- Resend (email)
- next-intl (PL + EN)

## 4. Sitemap

- [x] `index` — Landing page (Hero → Trust Bar → Differentiators → Menu preview → How it works → FAQ → Footer CTA)
- [ ] `menu` — Full weekly menu with filters, cart
- [ ] `checkout` — Stripe checkout + optional account creation CTA

## 5. Roadmap

1. `index` — Full landing page (mobile-first, high conversion)
2. `menu` — Weekly menu browser
3. `checkout` — Checkout flow with loyalty teaser

## 6. Creative Freedom

- Loyalty program teaser page (v2 preview — "Coming soon: earn points, get free meals")
- "Our Story" — INAO sourcing story, bear mascot origin
- Corporate orders landing page
