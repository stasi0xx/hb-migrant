# Głodny Niedźwiedź — Project Context for Claude

## Co to jest ten projekt

Strona e-commerce dla **Głodny Niedźwiedź** (glodnyniedzwiedz.pl) — catering biurowy z dostawą gotowych posiłków prosto do biura. Trwa przebudowa strony. Celem jest sprzedaż posiłków online i budowa bazy klientów pod przyszłą aplikację lojalnościową.

---

## Stack techniczny

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand (koszyk, `src/store/cart.ts`)
- **Płatności:** Stripe (checkout session + webhook)
- **Backend/DB:** Supabase
- **Email:** Resend
- **i18n:** next-intl (PL + EN)
- **Testy:** Jest + ts-jest

### Kluczowe pliki
- `src/data/menu.json` — menu tygodniowe (struktura: `{ "DD.MM.YYYY": { "Kategoria": [{ nazwa, cena }] } }`)
- `src/store/cart.ts` — logika koszyka z Zustand + persist; rabat online 5% (`ONLINE_DISCOUNT = 0.05`)
- `src/app/api/checkout/route.ts` — tworzenie Stripe checkout session
- `src/app/api/webhook/route.ts` — Stripe webhook (zapis zamówienia do Supabase, wysyłka emaila przez Resend)
- `src/i18n/messages/pl.json` + `en.json` — wszystkie teksty UI

---

## Marka — Brand Identity

### Pozycjonowanie
**"Prawdziwe jedzenie dla prawdziwych ludzi. Bez ściemy."**

Głodny Niedźwiedź to **anty-Żabka** i **anty-dieta-catering**. Nie sprzedajemy diety, nie moralizujemy o kaloriach. Sprzedajemy przyjemność z dobrego lunchu w pracy.

Konkurencja (Body Chief, Brokuł, Ślimak) walczy na rynku diet i celów zdrowotnych — my zajmujemy inną pozycję: **jakość bez pretensji**.

### Wyróżniki (USP)
1. **Składniki z certyfikatem INAO** (French National Institute of Origin and Quality)
2. **Świeżość 24h** — dania trafiają do klienta w ciągu 24h od wyprodukowania, zero sztucznego podtrzymywania
3. **Szeroki wybór** — od kanapek po sushi i tradycyjne polskie dania (schabowy, bigos)
4. **Dla każdego** — mięsożercy, wegetarianie, miłośnicy ostrego. Bez specjalistycznych diet.
5. **Dostawa prosto do biura**

### Czego NIE robimy
- Nie oferujemy sztucznych produktów / konserwantów
- Nie sprzedajemy diet specjalistycznych (keto, odchudzające itp.)
- Nie moralizujemy o zdrowym trybie życia

### Paleta kolorów (z logo)
| Kolor | Hex | Użycie |
|-------|-----|--------|
| Zieleń butelkowa | `#1B4332` | Dominanta, tła, nagłówki |
| Łososiowy róż | `#E8927C` | Akcenty, CTA, logo |
| Kremowy | `#FDF6EC` | Tła sekcji, karty |
| Musztardowy żółty | `#D4A017` | Wyróżnienia, badge'e, sekcje promocyjne |

### Ton komunikacji (Brand Voice)
| Jesteśmy | NIE jesteśmy |
|----------|--------------|
| Bezpośredni i ciepły | Korporacyjni i chłodni |
| Pewni siebie bez arogancji | Nachalni |
| Trochę zabawni | Głupawo śmieszni |
| Eksperccy w jedzeniu | Dietetyczni kaznodzieje |

### Inspiracje brandingowe (do utrzymania klimatu)
- **Duolingo** — z nudnego procesu zrobili grę z realnymi efektami
- **Apple** — dominacja przez percepcję i brand, nie tylko produkt
- **Coca-Cola** — emocje i tożsamość ponad samym produktem

---

## Idealny Klient (ICP)

**Kuba / Ola, 28-38 lat, pracownik biurowy**
- Zarabia 6-12k netto, stać go na jakość
- Gotuje okazjonalnie w weekend, w tygodniu nie ma czasu
- Ma za sobą fazę Żabki i już tego nie chce
- Nie jest na diecie — lubi schabowego, ale też sushi
- Ceni autentyczność, brzydzi się marketingową ściemą
- Jego ból: *"Znowu smutna kanapka z marketu"*
- Jego marzenie: *"Chcę żeby lunch był najlepszą częścią dnia w pracy"*

---

## Model biznesowy

### Aktualnie (v1)
- Jednorazowe zamówienia online
- Klient wybiera dania z menu tygodniowego (plik `menu.json` aktualizowany co tydzień)
- Płatność przez Stripe
- Dostawa do biura

### Planowane (v2 — aplikacja lojalnościowa)
- Konta użytkowników z historią zamówień
- Zbieranie punktów za każde zamówienie
- Punkty za zaproszenie kolegi z biura (viral loop — kluczowy mechanizm wzrostu)
- Nagrody za punkty (np. darmowy posiłek)
- **Ważne:** już teraz budujemy z myślą o tej przyszłości — rejestracja konta powinna być opcjonalna przy checkout z komunikatem o nadchodzącym programie lojalnościowym

### Proponowana mechanika punktów (do decyzji właściciela)
- Pierwsze zamówienie: 2x punkty
- Każde zamówienie: 1 pkt / 1 zł
- Zaproszenie kolegi który zamówi: 200 pkt
- 500 pkt = darmowy posiłek (~30 zł)

---

## Struktura strony (cel konwersji)

```
HERO → mocny headline + CTA "Zamów teraz"
SOCIAL PROOF → liczba biur / ocena Google
WYRÓŻNIKI → INAO | 24h świeżość | Dostawa do biura
MENU → z filtrem kategoria/dieta, zdjęcia, ceny, koszyk
HISTORIA → skąd składniki, INAO, misja
FAQ → dostawa, alergie, zamówienia dla biura
FOOTER CTA → ostatnia szansa konwersji
```

---

## Konkurencja (do odróżnienia się)
- **Body Chief** — dieta pudełkowa, kalorie, odchudzanie
- **slimak.com.pl** — catering dietetyczny
- **Diety od Brokuła** — plany żywieniowe

My NIE konkurujemy w kategorii "dieta". Jesteśmy w kategorii "dobre jedzenie w pracy".

---

## Dane kontaktowe (z materiałów)
- Telefon: +48 732 999 072
- Email: biuro@glodnyniedzwiedz.pl
- Domena: glodnyniedzwiedz.pl
- Est. 2018

---

## Notatki deweloperskie

### Menu JSON
Menu jest pogrupowane po dacie (`DD.MM.YYYY`), potem kategorii. Ceny są stringami z "zł" i polskim przecinkiem. Funkcja `parsePrice()` w `cart.ts` konwertuje je na number.

### Rabat online
5% rabatu przy zakupie online (`ONLINE_DISCOUNT = 0.05` w `cart.ts`). Pokazujemy oryginalną cenę przekreśloną i cenę po rabacie.

### i18n
Strona ma PL i EN. Wszystkie teksty UI muszą być w `src/i18n/messages/pl.json` i `en.json`. Nigdy nie hardkoduj polskiego tekstu w komponentach.

### Testy
Jest skonfigurowany Jest. Testy są w `src/lib/__tests__/` i `src/store/__tests__/`. Uruchamianie: `npm test`.