# Hongige Beer — Project Context for Claude

## Co to jest ten projekt

Strona e-commerce dla **Hongige Beer** (hongigebeer.nl) — catering z dostawą gotowych posiłków dla migrantów pracujących w Holandii. Dania są gotowane w Polsce i dostarczane 2x w tygodniu. Celem MVP jest sprawne przyjmowanie zamówień online.

Główna grupa docelowa to polscy migranci w NL, ale obsługujemy wszystkie narodowości — stąd 9 wersji językowych.

---

## Stack techniczny

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand (koszyk, `src/store/cart.ts`)
- **Płatności:** Stripe (checkout session + webhook); metody: `card` + `ideal`
- **Backend/DB:** Supabase
- **Email:** Resend
- **i18n:** next-intl — 9 lokalizacji: `en`, `pl`, `ro`, `hu`, `bg`, `cs`, `es`, `pt`, `it`; domyślna: `en`
- **Testy:** Jest + ts-jest

### Kluczowe pliki
- `src/data/menu.json` — menu z daniami; klucz `migrant` (patrz `menuKey` w sites.ts)
- `src/store/cart.ts` — logika koszyka z Zustand + persist; brak rabatu online (`onlineDiscount: 0`)
- `src/config/sites.ts` — konfiguracja serwisu (waluta EUR, miasta, flow zamówień, itd.)
- `src/app/api/checkout/route.ts` — tworzenie Stripe checkout session
- `src/app/api/webhook/route.ts` — Stripe webhook (zapis zamówienia do Supabase, wysyłka emaila przez Resend)
- `src/i18n/messages/` — pliki tłumaczeń dla każdego języka (np. `en.json`, `pl.json`, `ro.json`)

### Konfiguracja serwisu (sites.ts)
- **ID:** `hongige-beer-migrant`
- **Domena:** `hongigebeer.nl`
- **Waluta:** EUR
- **Flow zamówień:** `package-2x-week` — klient zamawia pakiet posiłków, dostawa 2x w tygodniu
- **Koszt jedzenia:** €9.98/dzień
- **Koszt dostawy:** €1.66/dzień (typ `per-day`)
- **Miasta (MVP):** Tilburg, Den Bosch, Eindhoven, Venlo
- **Płatności:** karta + iDEAL; brak gotówki
- **Walidacja adresu:** wyłączona (Nominatim dla NL)

---

## Marka — Brand Identity

### Pozycjonowanie
**"Smak domu, gdzie jesteś."**

Hongige Beer to catering dla migrantów — ludzi, którzy pracują ciężko, żyją z dala od domu i zasługują na porządne, znane im jedzenie bez przepłacania. Nie sprzedajemy diety, nie moralizujemy. Sprzedajemy komfort smaku w trudnych warunkach.

Konkurencja (uitgekookt.nl i lokalne cateringserwisy NL) skierowana jest do Holendrów i nie uwzględnia potrzeb migrantów — języka, kultury jedzenia, niskiej ceny. My wypełniamy tę lukę.

### Wyróżniki (USP)
1. **Gotowane w Polsce** — smak który znasz, nie holenderskie kompromisy
2. **Niska cena** — €9.98/dzień za posiłki wysokiej jakości, dostawa €1.66/dzień
3. **Bez bariery językowej** — strona w 9 językach (PL, EN, RO, HU, BG, CS, ES, PT, IT)
4. **Dostawa do domu** — 2x w tygodniu, bez wychodzenia
5. **Dla każdego migranta** — nie tylko Polacy; wszystkie narodowości pracujące w NL

### Czego NIE robimy
- Nie oferujemy diet specjalistycznych
- Nie moralizujemy o zdrowym trybie życia
- Nie celujemy w zamożnych Holendrów — jesteśmy dla pracowników

### Paleta kolorów
Kolory i logo są już zaimplementowane na stronie. Nie zmieniaj ich bez wyraźnego polecenia.

### Ton komunikacji (Brand Voice)
| Jesteśmy | NIE jesteśmy |
|----------|--------------|
| Ciepli i zrozumiali | Korporacyjni |
| Bliscy migrantom | Zadufani |
| Prości i bezpośredni | Marketingowo pompowani |
| Pomocni | Natrętni |

Klient jest daleko od domu, jest zmęczony, nie zna dobrze języka. Komunikacja musi być prosta, jasna i ludzka — w jego języku.

---

## Idealny Klient (ICP)

**Marek / Ana / Andrei, 24-42 lat, migrant pracujący w NL**
- Pracuje w logistyce, produkcji, budownictwie lub usługach
- Mieszka w wynajętym pokoju/akademiku, kuchni brak lub jest wspólna
- Nie ma czasu ani chęci gotować po 10h zmianie
- Tęskni za jedzeniem z domu — schabowy, bigos, zupa, pierogi
- Liczy pieniądze — każde euro ma znaczenie
- Jego ból: *"Znowu kebab albo frytki z automatu"*
- Jego marzenie: *"Normalny obiad jak w domu, bez wychodzenia"*

---

## Model biznesowy

### MVP (v1) — aktualny focus
- Klient zamawia pakiet posiłków online (flow: `package-2x-week`)
- Wybiera liczbę dni, miasto, adres dostawy
- Płaci przez Stripe (karta lub iDEAL)
- Dostawy 2x w tygodniu do wybranych miast: Tilburg, Den Bosch, Eindhoven, Venlo
- Brak kont użytkowników na start

### Planowane (v2)
- Zamówienia grupowe — pracodawca zamawia pakiet dla całego zespołu
- Konta użytkowników z historią zamówień
- Rozszerzenie na kolejne miasta w NL
- Program lojalnościowy (do decyzji właściciela)

---

## Struktura strony (cel konwersji)

```
HERO → mocny headline w języku klienta + CTA "Zamów teraz"
WYRÓŻNIKI → Smak domu | Niska cena | Dostawa 2x/tydzień | 9 języków
MENU/PAKIETY → co wchodzi w skład, cena dzienna, przykładowe dania
JAK TO DZIAŁA → 3 kroki: wybierz pakiet → zapłać → odbierz dostawę
OBSZAR DOSTAWY → mapa lub lista miast
FAQ → dostawa, alergeny, anulowanie, płatności
FOOTER CTA → ostatnia szansa konwersji
```

---

## Konkurencja (do odróżnienia się)
- **uitgekookt.nl** — lokalny catering NL, po holendersku, dla Holendrów, droższy
- Lokalne kebaby / fast food — tania alternatywa, ale brak domowego smaku

My NIE konkurujemy z fine dining ani dietą. Jesteśmy **domowym jedzeniem dla migranta w dobrej cenie**.

---

## Dane kontaktowe
- Domena: hongigebeer.nl
- Języki: EN (domyślny), PL, RO, HU, BG, CS, ES, PT, IT

---

## Notatki deweloperskie

### i18n
Strona obsługuje 9 lokalizacji. Wszystkie teksty UI muszą być w plikach `src/i18n/messages/[locale].json`. **Nigdy nie hardkoduj tekstu w komponentach.** Klucze tłumaczeń muszą istnieć we wszystkich 9 plikach.

### Flow zamówień: `package-2x-week`
Klient nie wybiera pojedynczych dań jak w klasycznym sklepie. Zamawia pakiet na X dni. Koszt = (foodCostPerDay + deliveryCostPerDay) × liczba dni. Szczegóły w `src/config/sites.ts`.

### Waluta
Wszystkie ceny w EUR. Brak rabatu online (`onlineDiscount: 0`).

### Płatności
iDEAL to popularna metoda płatności w Holandii — musi być zawsze dostępna obok karty.

### Testy
Jest skonfigurowany Jest. Testy są w `src/lib/__tests__/` i `src/store/__tests__/`. Uruchamianie: `npm test`.
