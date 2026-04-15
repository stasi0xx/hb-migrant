import FooterSection from '@/components/FooterSection';
import { Link } from '@/i18n/navigation';

export const metadata = {
  title: 'Polityka prywatności - Głodny Niedźwiedź',
  description: 'Ochrona Państwa danych osobowych oraz zasady przetwarzania danych w Głodny Niedźwiedź.',
};

export default function PrivacyPolicyPage() {
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
            Polityka prywatności
          </h1>
          <p className="text-[#ed8788] text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed">
            Zasady przetwarzania i ochrony danych osobowych
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-[#1B4332]/80 leading-relaxed text-sm md:text-base">
          <p>
            Ochrona Państwa danych osobowych oraz poszanowanie prywatności ma dla nas priorytetowe znaczenie, w związku z czym zapewniamy odpowiednią ochronę Państwa danych. Niniejsza polityka prywatności stanowi dokument, który określa zasady przetwarzania danych osobowych oraz prawa, które Państwu przysługują.
          </p>
          <p>
            Polityka prywatności uwzględnia regulacje dotyczące przetwarzania danych osobowych wynikające z rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych) (dalej „RODO”).
          </p>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">1. Administrator danych osobowych</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Administratorem Państwa danych osobowych jest Katarzyna Głuchowska przedsiębiorczyni prowadząca działalność gospodarczą pod firmą „Two Squares Katarzyna Głuchowska” z siedzibą w Bojanie (84-207) przy ul. Partyzantów Kaszubskich 19, wpisaną do Centralnej Ewidencji i Informacji o Działalności Gospodarczej, NIP: 5342172008, REGON: 367356273.</li>
            <li>Administrator Państwa danych osobowych zbiera Państwa dane osobowe m.in. za pośrednictwem prowadzonego serwisu internetowego https://www.glodnyniedzwiedz.pl oraz Aplikacji LunchApp.</li>
            <li>Administrator dochowa szczególnej staranności w celu ochrony Państwa interesów. Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę przetwarzanych danych osobowych, w szczególności zabezpiecza dane osobowe przed udostępnieniem osobom nieupoważnionym, utratą i uszkodzeniem.</li>
            <li>W sprawach związanych z przetwarzaniem Państwa danych osobowych prosimy o kontakt bezpośrednio pod adresem mailowym <a href="mailto:biuro@glodnyniedzwiedz.pl" className="text-[#ed8788] hover:underline font-semibold">biuro@glodnyniedzwiedz.pl</a>.</li>
            <li>Przetwarzane dane pochodzą bezpośrednio od Państwa w celu korzystania z serwisu i w celach zakupu towarów od Administratora lub podmiotów powiązanych.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">2. Cele przetwarzania danych osobowych</h2>
          <p>Państwa dane osobowe takie jak w szczególności: (i) imię i nazwisko, (ii) adres e-mail, (iii) numer telefonu, (iv) adres zamieszkania/siedziby, (v) adres dostawy, (vi) numer rachunku bankowego, (vii) numer NIP (w przypadku przedsiębiorców oraz podmiotów posiadających NIP), będą przetwarzane w celu:</p>
          <ul className="list-[lower-alpha] pl-5 space-y-2">
            <li>zawarcia umów z Administratorem oraz ich wykonywania, w tym ustalania warunków współpracy, terminów płatności, terminów dostawny oraz bieżącej komunikacji w ramach wykonania umów na podstawie art. 6 ust. 1 lit. b RODO;</li>
            <li>realizacji umowy na świadczenie usług drogą elektroniczną, na podstawie art. 6 ust. 1 lit. b RODO;</li>
            <li>prawidłowe wypełnianie obowiązków Administratora – w tym realizacja obowiązków ciążących na Administratorze, w tym m.in. obowiązków rachunkowych (wystawianie i księgowanie faktur), podatkowych, archiwizacji dokumentów (umów i dokumentów rozliczeniowych) oraz wszelkich innych obowiązków wynikających z powszechnie obowiązujących przepisów prawa, na podstawie art. 6 ust. 1 lit. c RODO;</li>
            <li>zabezpieczenie roszczeń Administratora – dochodzenia roszczeń wynikających z przepisów powszechnie obowiązujących, w tym przepisów prawa cywilnego, jeżeli takie się pojawią lub obrony przed takimi roszczeniami (także prowadzenia postępowania reklamacyjnego z tytułu gwarancji i rękojmi), a także prowadzenia marketingu bezpośredniego sprzedawanych towarów i usług przez Administratora (w tym przedstawienia oferty), na podstawie art. 6 ust. 1 lit. f RODO;</li>
            <li>na podstawie zgody – w przypadku wyrażenia przez Państwa zgody na przetwarzanie danych osobowych takich jak: numer telefonu, adres e-mail, adres do korespondencji, w celu przesyłania informacji handlową drogą elektroniczną (marketing elektroniczny, newsletter) lub innych celach wskazanych bezpośrednio w treści zgody, na podstawie art. 6 ust. 1 lit. a RODO.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">3. Odbiorcy danych osobowych</h2>
          <p>Informujemy, że odbiorcami Państwa danych osobowych będą m.in.:</p>
          <ul className="list-[lower-roman] pl-5 space-y-1">
            <li>kontrahenci Administratora, w tym podwykonawcy,</li>
            <li>pracownicy oraz współpracownicy Administratora,</li>
            <li>podmioty świadczące na rzecz Administratora usługi doradcze, konsultacyjne, audytowe, rachunkowe, podatkowe, informatyczne, a także pomoc prawną,</li>
            <li>podmioty świadczące działalność pocztową lub kurierską,</li>
            <li>podmioty obsługujące płatności elektroniczne lub płatności kartą płatniczą (w tym Stripe), w zakresie niezbędnym do realizacji płatności,</li>
            <li>dostawcy systemów informatycznych, bazodanowych (w tym Supabase) i usług IT,</li>
            <li>dostawcy usług wysyłkowych i transakcyjnych e-mail (w tym Resend),</li>
            <li>dostawcy usług analitycznych i śledzenia błędów (w tym PostHog, Sentry),</li>
            <li>podmioty świadczące usługi telekomunikacyjne,</li>
            <li>organy uprawnione do otrzymania Państwa danych na podstawie powszechnie obowiązujących przepisów prawa.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">4. Obowiązek podania danych osobowych</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Podanie przez Państwa danych osobowych nie jest obowiązkowe. Jednakże, podanie przez Państwa danych osobowych może być niezbędne do zawarcia i realizacji umowy z Administratorem (w tym do złożenia i realizacji zamówienia) lub podjęcia przez Administratora działań na Państwa żądanie, w szczególności przed zawarciem umowy lub po jej zawarciu (np. rozpoznanie reklamacji).</li>
            <li>Dane niezbędne są również w celu przygotowywania odpowiednich dokumentów księgowych, dokumentów zamówienia. Brak podania obowiązkowych danych, tj. takich, które są wymagane do realizacji umowy spowoduje, że nie będzie możliwe zawarcie z Państwem umowy.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">5. Prawa w stosunku do przetwarzanych danych</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Mają Państwo prawo do żądania dostępu do Państwa danych osobowych, ich sprostowania, usunięcia, ograniczenia ich przetwarzania lub wniesienia sprzeciwu wobec przetwarzania Państwa danych osobowych, a także do przenoszenia Państwa danych osobowych. Prawo to można wykonywać poprzez wysłanie wiadomości e-mail do Administratora na adres: <a href="mailto:biuro@glodnyniedzwiedz.pl" className="text-[#ed8788] hover:underline font-semibold">biuro@glodnyniedzwiedz.pl</a>.</li>
            <li>W każdym wypadku mają Państwo prawo wniesienia skargi na przetwarzanie przez Administratora Państwa danych osobowych do odpowiedniego organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00 – 193 Warszawa).</li>
            <li>W przypadku wyrażenia przez Państwa zgody na przetwarzanie Państwa danych osobowych w konkretnym celu mają Państwo prawo w każdej chwili wycofać zgodę na przetwarzanie Państwa danych osobowych bez wpływu na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej cofnięciem.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">6. Przekazywanie danych do Państw oraz Narzędzia Zewnętrzne</h2>
          <p>W ramach korzystania przez Administratora z narzędzi wspierających bieżącą działalność dane mogą być przetwarzane przez partnerów zewnętrznych m.in.:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Google Ireland Limited</strong> – Google Analytics 4, Google Ads, Google Tag Manager;</li>
            <li><strong>Facebook Ireland Limited</strong> – Meta Pixel, Meta Ads;</li>
            <li><strong>TikTok Technology Limited</strong> – TikTok Pixel;</li>
            <li><strong>GetResponse S.A.</strong> – e-marketing;</li>
            <li><strong>Supabase, Inc.</strong> – usługi backendowe, hostowanie bazy danych oraz uwierzytelnianie użytkowników;</li>
            <li><strong>Stripe, Inc.</strong> – operator systemu płatności online, w tym usług Apple Pay i Google Pay;</li>
            <li><strong>PostHog, Inc.</strong> – narzędzie do analityki produktowej i śledzenia ruchu;</li>
            <li><strong>Functional Software, Inc. (Sentry)</strong> – usługa do monitorowania wydajności aplikacji i wykrywania błędów;</li>
            <li><strong>Resend, Inc.</strong> – usługa do wysyłki e-maili transakcyjnych;</li>
            <li>oraz inne podmioty na mocy umów powierzenia przetwarzania ujęte w §3.</li>
          </ul>
          <p className="mt-4">
            W przypadku przekazywania danych osobowych do państw spoza Europejskiego Obszaru Gospodarczego (EOG) — np. do Stanów Zjednoczonych w kontekście firm takich jak Stripe, Supabase, PostHog, Sentry, Resend czy Google — zapewniamy, że odbywa się to zgodnie z obowiązującymi przepisami RODO (najczęściej na bazie standardowych klauzul umownych [SCC] zatwierdzonych przez Komisję Europejską lub mechanizmu Data Privacy Framework). W każdym przypadku przekazywanie danych odbywa się z zachowaniem należytych środków bezpieczeństwa oraz w sposób gwarantujący ochronę praw osób, których dane dotyczą.
          </p>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">7. Prawo do wniesienia sprzeciwu</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Mają Państwo prawo w dowolnym momencie wnieść sprzeciw – z przyczyn związanych z Państwa szczególną sytuacją – wobec przetwarzania przez Administratora danych osobowych, gdy dane te przetwarzane są w związku z wykonaniem zadania realizowanego w interesie publicznym lub w ramach sprawowania władzy publicznej powierzonej administratorowi danych oraz, gdy dane osobowe przetwarzane są ze względu na cele wynikające z prawnie uzasadnionych interesów realizowanych przez administratora lub przez stronę trzecią, w tym profilowania na tych podstawach.</li>
            <li>W przypadku wniesienia uzasadnionego sprzeciwu Administratorowi danych nie wolno będzie już przetwarzać tych danych osobowych, chyba że wykaże on istnienie ważnych prawnie uzasadnionych podstaw do przetwarzania, nadrzędnych wobec interesów, praw i wolności osoby, której dane dotyczą, lub podstaw do ustalenia, dochodzenia lub obrony roszczeń.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">8. Okres przetwarzania danych osobowych</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Dane osobowe będą przetwarzane przez Administratora przez okres trwania zawartej z Administratorem umowy oraz po zakończeniu umowy w celu wypełnienia obowiązków ciążących na Administratorze.</li>
            <li>Ponadto po zakończeniu umowy Państwa dane osobowe będą przechowywane do upływu terminu przedawnienia roszczeń lub do momentu wygaśnięcia obowiązku przechowywania danych osobowych wynikających z obowiązujących przepisów prawa m.in. obowiązku przechowywania dokumentów księgowych i finansowych.</li>
            <li>W przypadku wyrażenia przez Państwa zgody na przetwarzanie podanych danych osobowych będziemy przetwarzali te dane osobowe do momentu wycofania przez Państwa zgody na przetwarzanie danych osobowych.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">9. Zautomatyzowane podejmowanie decyzji i profilowanie</h2>
          <p>Dane osobowe nie będą podlegały zautomatyzowanemu podejmowaniu decyzji oraz istotnemu profilowaniu.</p>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">10. Pliki cookies oraz Technologie Śledzące</h2>
          <p>Na stronie internetowej Administratora, w celu zapewnienia Państwu komfortu w korzystaniu ze sklepu internetowego oraz ulepszania naszych usług, w sposób zautomatyzowany zbieramy informacje w plikach cookies oraz przy pomocy skryptów stron trzecich (np. PostHog, Sentry, GA4).</p>
          <ul className="list-disc pl-5 mt-4 space-y-4">
            <li>
              <strong>Techniczne (niezbędne):</strong> Są to pliki konieczne do prawidłowego działania strony internetowej (w tym sesji logowania Supabase, zachowania stanu koszyka czy płatności Stripe). Umożliwiają podstawowe funkcje, takie jak nawigacja po stronie, dostęp do zabezpieczonych obszarów czy zapamiętywanie preferencji dotyczących zgody na pliki cookies. 
            </li>
            <li>
              <strong>Analityczne/statystyczne:</strong> Służą do zbierania anonimowych informacji statystycznych (m.in. przy pomocy Google Analytics 4 oraz PostHog) na temat sposobu korzystania ze strony przez użytkowników. Umożliwiają monitorowanie ewentualnych błędów działania aplikacji (Sentry).
            </li>
            <li>
              <strong>Funkcjonalne:</strong> Umożliwiają zapamiętanie wyborów dokonanych przez użytkownika (np. język, rozmiar czcionki) oraz świadczenie bardziej spersonalizowanych usług. 
            </li>
            <li>
              <strong>Marketingowe/reklamowe:</strong> Wykorzystywane są w celu dostarczania użytkownikom treści reklamowych dostosowanych do ich zainteresowań, również poza naszą stroną.
            </li>
          </ul>
          <p className="mt-4">
            Użytkownik może w każdej chwili zmienić ustawienia dotyczące plików cookies za pośrednictwem ustawień swojej przeglądarki lub klikając w baner zarządzania zgodą dostępny na stronie.
          </p>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">11. Newsletter</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Mogą Państwo wyrazić zgodę na otrzymywanie informacji handlowych, w tym informacji handlowych drogą elektroniczną, poprzez zaznaczenie odpowiedniej opcji w formularzu.</li>
            <li>W przypadku wyrażenia takiej zgody, Klient otrzymywać będzie na podany przez siebie adres poczty elektronicznej biuletyn informacyjny (Newsletter) sklepu internetowego, a także inne komunikaty wysyłane z użyciem zaufanych narzędzi dystrybucyjnych (jak GetResponse czy Resend).</li>
            <li>Klient może w dowolnym momencie zrezygnować z subskrypcji poprzez kliknięcie w link wypisania na dole otrzymanego maila.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">12. Zmiany niniejszego dokumentu</h2>
          <p>Z uwagi na to, że przejrzystość stanowi stały obowiązek Administratora, Administrator będzie regularnie dokonywać przeglądu i aktualizacji (modyfikacji) niniejszego dokumentu z uwzględnieniem powszechnie obowiązujących przepisów prawa oraz stosów technologicznych wykorzystywanych na platformie.</p>

          <h2 className="text-xl md:text-2xl font-black text-[#1B4332] mt-10 mb-4">13. Kontakt</h2>
          <p>
            W przypadku jakichkolwiek pytań dotyczących niniejszego dokumentu, przetwarzania Państwa danych osobowych, prosimy o kontakt pod adresem strony <a href="https://www.glodnyniedzwiedz.pl" className="text-[#ed8788] hover:underline font-semibold" target="_blank" rel="noopener noreferrer">https://www.glodnyniedzwiedz.pl</a> lub bezpośrednio przez asystę mailową: <a href="mailto:biuro@glodnyniedzwiedz.pl" className="text-[#ed8788] hover:underline font-semibold">biuro@glodnyniedzwiedz.pl</a>.
          </p>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
