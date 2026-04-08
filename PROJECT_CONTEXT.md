# Projekt: Głodny Niedźwiedź / Hongige Beer

Ten plik zawiera kluczowe założenia architektoniczne i kontekst całego projektu.
Służy on asystentowi AI jako szybkie wprowadzenie w układ i logikę działania aplikacji przy każdym nowym czacie.

## Struktura wariacji projektowych (Multi-tenant)
Projekt obsługuje 3 niezależne wersje stron dla różnych grup docelowych, które współdzielą ten sam kod źródłowy. Wariacja aplikacji jest determinowana przez zmienną środowiskową konfiguracji: `NEXT_PUBLIC_SITE`.

Konfiguracje poszczególnych wariantów znajdują się w `src/config/sites.ts`.

### 1. Głodny Niedźwiedź (`glodny-niedzwiedz`)
*   **Grupa docelowa:** Pracownicy biurowi z Polski.
*   **Domena główna:** `glodnyniedzwiedz.pl`
*   **Charakterystyka biznesowa:** 
    * Zamówienia tygodniowe (`orderingFlow: 'weekly'`).
    * Darmowa dostawa.
    * 5% zniżki na stronę online.
    * Obsługuje płatności gotówką, blikiem oraz p24.
*   **Waluta:** PLN.
*   **Widok Strony Głównej:** Renderuje `<WeeklyOrderPage />`.

### 2. Hongige Beer - Office (`hongige-beer-office`)
*   **Grupa docelowa:** Pracownicy biurowi z Holandii.
*   **Domena główna:** `office.hongigebeer.nl`
*   **Charakterystyka biznesowa:**
    * Codzienne zamówienia z 4-dniowym wyprzedzeniem (`orderingFlow: 'daily-4day'`).
    * Koszt dostawy na poziomie zamówienia (5 EUR).
    * Brak płatności gotówkowej. Obsługa płatności: karty i iDEAL.
*   **Waluta:** EUR.
*   **Widok Strony Głównej:** Renderuje `<OfficeOrderPage />`.

### 3. Hongige Beer - Migrant (`hongige-beer-migrant`)
*   **Grupa docelowa:** Migranci pracujący w Holandii (społeczność wielojęzyczna).
*   **Domena główna:** `hongigebeer.nl`
*   **Charakterystyka biznesowa:**
    * Zamówienia pakietowe 2x w tygodniu (`orderingFlow: 'package-2x-week'`).
    * Zmodyfikowane, ograniczone menu (`menuKey: 'migrant'`).
    * Obsługa aż 9 różnych języków (m.in. EN, PL, RO, HU, BG, CS, ES, PT, IT).
    * Koszt dostawy w ujęciu per-day (1.66 EUR).
    * Obsługa płatności bezgotówkowych (karty, iDEAL).
*   **Waluta:** EUR.
*   **Widok Strony Głównej:** Renderuje `<MigrantOrderPage />`.

## Kluczowe ścieżki i lokalizacje plików
*   `src/app/[locale]/page.tsx` – główny router decydujący o tym, jaki komponent sprzedażowy wyrenderować na podstawie wartości z `orderingFlow` w konfiguracji instancji.
*   `src/config/sites.ts` – jedno i główne "źródło prawdy" dla obsługi logiki domen ("site configuration").
*   `src/features/` – komponenty widokowe per specyficzne flow. Główne flow: `order-weekly`, `order-office`, `order-migrant`.

## Stos Technologiczny
*   **Next.js** z systemem ścieżek `app` routing (`src/app/`)
*   **TypeScript** (ścisłe typowanie)
*   **i18n:** Routing międzynarodowy oparty o dynamiczne parametry np. `[locale]`
*   **Stylizacja:** Prawdopodobnie Tailwind CSS i SCSS / moduły (w zależności od zawartości repozytorium) 

> *Instrukcja dla AI:* Czytając ten plik na starcie nowej konwersacji, pamiętaj, aby zawsze dostosowywać logikę i warunkowania pod właściwe id instancji w `sites.ts` i unikać psucia kodu dla innej instancji strony. Zawsze upewniaj się z jakiej instancji korzysta aktualnie użytkownik podczas debugowania.
