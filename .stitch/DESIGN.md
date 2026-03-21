# Głodny Niedźwiedź — Design System

## 1. Brand Identity

**Głodny Niedźwiedź** (Hungry Bear) is a premium office catering brand. The aesthetic is warm, confident, and appetite-inducing. Think: a high-end bistro that doesn't take itself too seriously. Premium without pretension.

## 2. Color Palette

| Role | Name | Hex |
|------|------|-----|
| Primary / Background dark | Bottle green | `#1B4332` |
| CTA / Accent / Logo | Salmon pink | `#E8927C` |
| Page background / Cards | Cream | `#FDF6EC` |
| Badges / Highlights | Mustard yellow | `#D4A017` |
| Text on dark | Off-white | `#F9F6F0` |
| Text on light | Deep charcoal | `#1A1A1A` |

## 3. Typography

- **Headlines:** Bold, large, expressive. Use weight contrast (heavy headlines, lighter body).
- **Body:** Clean, readable. 16–18px base. Good line-height (1.6).
- **Hierarchy:** H1 very large (48–64px mobile), H2 medium (28–36px), body 16px.
- **Font feel:** Modern humanist sans-serif (think Inter or DM Sans style). Warm, not cold.

## 4. Components

### Buttons
- **Primary CTA:** Salmon pink background `#E8927C`, white text, rounded-full (pill shape), bold, large padding. Slight shadow.
- **Secondary:** Bottle green background `#1B4332`, white text, rounded-full.
- **Ghost:** Transparent, bottle green border, bottle green text.

### Cards
- Cream background `#FDF6EC`, subtle shadow, rounded-2xl (16px radius).
- Food item cards: image top, name + price, "Add to cart" button.
- On dark sections: white cards with salmon accent.

### Badges / Tags
- Mustard yellow `#D4A017` background, dark text. Rounded-full, small.
- Used for: "INAO Certified", "24h Fresh", category tags.

### Navigation
- Mobile: sticky top bar, bottle green background, logo left, hamburger right (or cart icon).
- Logo: bear icon + "Głodny Niedźwiedź" wordmark in salmon pink on dark.

## 5. Layout Principles (Mobile-First)

- **Mobile viewport:** 390px wide.
- Full-bleed hero sections with dark (bottle green) or cream background.
- Large whitespace between sections — generous padding (32–64px vertical).
- Section alternation: dark → cream → dark → cream for visual rhythm.
- Sticky "Order now" CTA bar at bottom on mobile (floating action button style).

## 6. Design System Notes for Stitch Generation

**ALWAYS include this block verbatim in every Stitch prompt:**

```
DESIGN SYSTEM:
- Device: Mobile (390px wide)
- Primary background sections: deep bottle green #1B4332
- Accent/CTA color: salmon pink #E8927C
- Secondary background sections: warm cream #FDF6EC
- Highlight/badge color: mustard yellow #D4A017
- Text on dark: off-white #F9F6F0
- Text on light: deep charcoal #1A1A1A
- Buttons: pill-shaped (rounded-full), bold, large
- Primary CTA button: salmon pink background, white text
- Cards: rounded-2xl, cream background, subtle shadow
- Typography: bold expressive headlines (Inter/DM Sans style), large H1
- Badges: mustard yellow, rounded-full, small caps
- Tone: warm, confident, appetite-inducing, premium without pretension
- Style: modern food brand — think upscale bistro meets street food energy
- Bear mascot: can be used as subtle icon/watermark
- Navigation: sticky top, bottle green, logo + cart icon
- Mobile sticky bottom: floating "Zamów teraz" CTA button in salmon pink
```

## 7. Visual Mood

- **Photography style (placeholder):** Overhead food shots, warm lighting, rustic wooden surfaces.
- **Illustrations:** Minimal bear icon, clean line art.
- **Micro-animations:** Subtle hover states, smooth cart additions.
- **Overall feel:** Makes you hungry. Feels trustworthy and premium. Has personality.
