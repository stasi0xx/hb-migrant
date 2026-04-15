import FooterSection from '@/components/FooterSection';
import { Link } from '@/i18n/navigation';

export const metadata = {
  title: 'Regulamin - Głodny Niedźwiedź',
  description: 'Regulamin sklepu internetowego i sprzedaży obwoźnej (vansellingu) prowadzonej przez Głodny Niedźwiedź.',
};

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      <div className="h-16" />
      <section className="bg-[#1B4332] px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/40 text-xs font-semibold uppercase tracking-widest mb-10 hover:text-white/70 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Strona główna
          </Link>
          <h1 className="font-heading font-black text-3xl md:text-5xl text-white mb-4">
            Regulamin sklepu
          </h1>
          <p className="text-[#ed8788] text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed">
            Regulamin serwisu internetowego oraz vansellingu<br />
            prowadzonych przez Głodny Niedźwiedź
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-[#1B4332]/80 leading-relaxed text-sm md:text-base">
          
          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">§ 1 Postanowienia ogólne</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Niniejszy Regulamin skierowany jest do osób fizycznych oraz podmiotów zawierających umowę sprzedaży na odległość (poprzez Serwis internetowy) oraz w ramach sprzedaży obwoźnej (vansellingu) gotowych posiłków, dań i produktów spożywczych, prowadzonej przez firmę cateringową Głodny Niedźwiedź.</li>
            <li>Działalność, o której mowa powyżej prowadzona jest przez Katarzynę Głuchowską, przedsiębiorczynię prowadzącą działalność gospodarczą pod firmą „Two Squares Katarzyna Głuchowska” z siedzibą w Bojanie (84-207) przy ul. Partyzantów Kaszubskich 19, wpisaną do Centralnej Ewidencji i Informacji o Działalności Gospodarczej, NIP: 534-217-20-08, REGON: 367356273, właścicielkę przedsiębiorstwa cateringowego działającego pod marką Głodny Niedźwiedź. Sprzedawca posiada indywidualny numer rejestrowy w rejestrze podmiotów wprowadzających produkty, produkty w opakowaniach i gospodarujących odpadami (tzw. rejestr – BDO) – 000216527.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">§ 2 Definicje</h2>
          <p>Użyte w niniejszym Regulaminie zwroty i wyrażenia oznaczają:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Regulamin</strong> – oznacza niniejszy regulamin określający zasady zawierania umów sprzedaży pomiędzy Sprzedawcą a Klientem, w tym na odległość oraz z wykorzystaniem vansellingu.</li>
            <li><strong>Serwis internetowy</strong> – serwis internetowy Sprzedawcy, dostępny pod adresem: https://www.glodnyniedzwiedz.pl, umożliwiający składanie Zamówień na odległość.</li>
            <li><strong>Zamówienie internetowe</strong> – oświadczenie woli Klienta składane za pomocą Serwisu internetowego, zmierzające bezpośrednio do zawarcia Umowy sprzedaży na odległość.</li>
            <li><strong>Vanselling</strong> – sprzedaż obwoźna, prowadzona z samochodu dostawczego w ramach, której przedstawiciel handlowy (tzw. vanseller) realizuje sprzedaż w wyznaczonych miejscach.</li>
            <li><strong>Produkt</strong> – gotowe posiłki lub dania, napoje i inne artykuły przeznaczone do spożycia przez ludzi, oferowane przez Sprzedawcę.</li>
            <li><strong>Umowa sprzedaży</strong> – umowa sprzedaży Produktu zawierana lub już zawarta pomiędzy Klientem a Sprzedawcą przez Serwis internetowy lub w ramach Vansellingu.</li>
            <li><strong>Klient (w tym Konsument)</strong> – każdy podmiot nabywający Produkty od Sprzedawcy. Konsumentem jest osoba fizyczna dokonująca zakupu niezwiązanego z jej strefą profesjonalno-zawodową.</li>
            <li><strong>E-paragon</strong> – elektroniczny paragon fiskalny wysyłany za pomocą linku, wiadomości sms/e-mail, zastępujący wersję papierową.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">§ 3 Zamówienia w Serwisie internetowym</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Klient może składać Zamówienia w Serwisie internetowym przez 24 godziny na dobę, 7 dni w tygodniu.</li>
            <li>Zamówienia na dany dzień są przyjmowane z minimalnym, jednodniowym wyprzedzeniem (najpóźniej do dnia poprzedzającego dostawę). Dokładne informacje o terminach wyznaczane są w koszyku w trakcie składania zamówienia.</li>
            <li>Aby skutecznie złożyć Zamówienie interenetowe Klient musi poprawnie wypełnić elektroniczny formularz Zamówienia, wskazując adres dostawy, dane kontaktowe (imię, nazwisko, e-mail, telefon) i wybrać termin dostawy.</li>
            <li>Po poprawnej weryfikacji danych, Klient klika przycisk „Zamów z obowiązkiem zapłaty” (lub tożsamy), co stanowi prawnie wiążącą ofertę zakupu. Klient podaje prawidłowy adres, a po stronie Sprzedawcy e-mail wysyła przyjęcie Zamówienia do realizacji (potwierdzenie transakcji). W tym momencie zostaje zawarta Umowa sprzedaży na odległość.</li>
            <li>Dostawa Zamówień internetowych odbywa się zazwyczaj we wczesnych godzinach porannych i przedpołudniowych, ze szczególnym uwzględnieniem przedziału 08:00 – 10:00, pod drzwi podanego w Zamówieniu biura/domu.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">§ 4 Sprzedaż bezpośrednia (Vanselling)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Sprzedawca umożliwia Klientowi również zakup Produktów bezpośrednio za pośrednictwem Dostawcy (vansellera), bazując m.in. na bieżącym asortymencie u przewoźnika.</li>
            <li>W celu dokonania zakupu Klient dokonuje na żywo wskazania Produktu, spośród dostępnych "od ręki".</li>
            <li>Zawarcie Umowy sprzedaży oraz wydanie Produktu w tej formie następuje natychmiast po zapłaceniu.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">§ 5 Metody Płatności i e-Paragony</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>W przypadku zamówień internetowych, Sprzedawca udostępnia płatność elektroniczną (np. szybki przelew online, BLIK, Apple Pay, Google Pay) lub płatność z góry przy pomocy odpowiedniego operatora (wspieranego na stronie) i/lub, jeśli wybrano, „płatność przy dostawie gotówką”.</li>
            <li>Dla Vansellingu Klient może uiszczać opłaty używając płatności gotówkowej, karty płatniczej (w tym zbliżeniowo przez Apple Pay i Google Pay) przez terminal lub BLIK-a na miejscu.</li>
            <li>Ceny określone w Serwisie lub bezpośrednio u Sprzedawcy uznaje się za kwoty brutto (zawierają podatek VAT).</li>
            <li>Sprzedawca prowadzi ewidencję za pomocą systemu online, zatem wydaje swoim Klientom E-paragony. Kod E-paragonu jest wydawany bezpośrednio na urządzeniu lub na podany na stronie adres e-mail. Klient akceptuje ten format.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">§ 6 Prawo odstąpienia od umowy</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Zgodnie z art. 38 pkt. 4 Ustawy o prawach konsumenta Konsumentowi <strong>nie przysługuje prawo odstąpienia od umowy zawartej na odległość</strong> w odniesieniu do umów, w których przedmiotem świadczenia jest m.in. towar ulegający szybkiemu zepsuciu lub mający krótki termin przydatności do spożycia.</li>
            <li>Posiłki produkowane przez Głodnego Niedźwiedzia objęte są krótkim okresem spożycia (szczególnie świeże kanapki, dania i sałatki ze świeżymi składnikami), co w rezultacie znosi podstawowe przywileje czternastodniowego odstąpienia od umowy bez przyczyny.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">§ 7 Reklamacje</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Reklamacje związane z niepełnym zamówieniem internetowym lub wadą Produktu podczas vansellingu można składać:
              <ul className="list-[circle] pl-5 mt-2 space-y-1">
                <li>drogą mailową na adres: <a href="mailto:biuro@glodnyniedzwiedz.pl" className="text-[#ed8788] hover:underline font-semibold">biuro@glodnyniedzwiedz.pl</a>,</li>
                <li>pisemnie na adres siedziby Sprzedawcy.</li>
              </ul>
            </li>
            <li>Z uwagi na naturę Produktów gastronomicznych – w razie stwierdzenia wad (np. widoczne ślady pleśni, zepsutego produktu w wyniku rygoru łańcucha chłodniczego), prosimy o kontakt tego samego lub pierwszego kolejnego dnia.</li>
            <li>Reklamacja powinna zawierać w miarę krótki opis usterki, dane klienta, obligatoryjnie zdjęcie, które wykazuje ubytki jakości.</li>
            <li>Sprawy będą załatwiane do 7 do 14 dni z pierwszeństwem zwrotu środków na konto, wady oczywiste są najszybciej koncesjonowane na plus Klienta.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">§ 8 Przetwarzanie danych i Postanowienia końcowe</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Rozporządzenie PE i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO) - regulacja ta ma w pełni u nas odzwierciedlenie, więcej informacji jest o tym zawarte pod hasłem /privacy w witrynie internetowej Sprzedawcy.</li>
            <li>W sprawach nieuregulowanych zastosowanie mają odpowiednie zapisy Kodeksu cywilnego, a Sprzedawca zachowuje prawo edycji niniejszego tekstu bez nadmiernych ograniczeń z poszanowaniem praw aktualnie obsługiwanych Klientów do starszej weryfikacji.</li>
            <li>Regulamin wchodzi w życie z dniem jego publikacji na docelowej witrynie Serwisu internetowego oraz podczas objazdu z Vansellingiem począwszy od roku 2025.</li>
          </ul>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
