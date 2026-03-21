import { buildCustomerEmailHtml, buildRestaurantEmailHtml, OrderEmailData } from '../resend';

// ─────────────────────────────────────────────
// Dane testowe
// ─────────────────────────────────────────────
const mockOrderData: OrderEmailData = {
  orderId: 'abc12345-6789-abcd-ef01-234567890abc',
  customerFirstName: 'Jan',
  customerLastName: 'Kowalski',
  customerEmail: 'jan.kowalski@example.com',
  customerPhone: '600100200',
  companyName: 'Firma Testowa Sp. z o.o.',
  address: 'ul. Testowa 10',
  city: 'Kraków',
  floorRoom: 'Piętro 3, pokój 301',
  notes: 'Brak soli proszę',
  items: [
    {
      name: 'Kanapka z łososiem',
      category: 'Kanapki i wrapy',
      price: 14.25,
      date: '25.03.2026',
      quantity: 2,
    },
    {
      name: 'Zupa dnia',
      category: 'Zupy',
      price: 11.4,
      date: '25.03.2026',
      quantity: 1,
    },
  ],
  totalAmount: 40.0,
  paymentMethod: 'stripe',
  deliveryDates: ['25.03.2026', '26.03.2026'],
};

const mockOrderDataCash: OrderEmailData = {
  ...mockOrderData,
  paymentMethod: 'cash',
  floorRoom: undefined,
  notes: undefined,
};

// ─────────────────────────────────────────────
// buildCustomerEmailHtml
// ─────────────────────────────────────────────
describe('buildCustomerEmailHtml', () => {
  let html: string;

  beforeAll(() => {
    process.env.RESTAURANT_EMAIL = 'kontakt@glodnyniedz.pl';
    html = buildCustomerEmailHtml(mockOrderData);
  });

  it('zwraca niepusty string HTML', () => {
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('zaczyna się od DOCTYPE html', () => {
    expect(html.trim()).toMatch(/^<!DOCTYPE html>/i);
  });

  it('zawiera imię klienta', () => {
    expect(html).toContain('Jan');
  });

  it('zawiera skrócony numer zamówienia (8 znaków, wielkie litery)', () => {
    expect(html).toContain('#ABC12345');
  });

  it('zawiera nazwę firmy', () => {
    expect(html).toContain('Firma Testowa Sp. z o.o.');
  });

  it('zawiera adres dostawy z piętrem', () => {
    expect(html).toContain('ul. Testowa 10');
    expect(html).toContain('Piętro 3, pokój 301');
    expect(html).toContain('Kraków');
  });

  it('zawiera daty dostawy', () => {
    expect(html).toContain('25.03.2026');
    expect(html).toContain('26.03.2026');
  });

  it('zawiera nazwy zamawianych dań', () => {
    expect(html).toContain('Kanapka z łososiem');
    expect(html).toContain('Zupa dnia');
  });

  it('zawiera całkowitą kwotę zamówienia sformatowaną po polsku', () => {
    expect(html).toContain('40,00 zł');
  });

  it('zawiera informację o metodzie płatności online', () => {
    expect(html).toContain('Karta / online');
  });

  it('zawiera uwagi do zamówienia', () => {
    expect(html).toContain('Brak soli proszę');
  });

  it('zawiera email restauracji', () => {
    expect(html).toContain('kontakt@glodnyniedz.pl');
  });

  it('wyświetla "Gotówka przy dostawie" dla płatności gotówkowej', () => {
    const cashHtml = buildCustomerEmailHtml(mockOrderDataCash);
    expect(cashHtml).toContain('Gotówka przy dostawie');
  });

  it('nie zawiera sekcji uwag gdy notes jest undefined', () => {
    const noNotesHtml = buildCustomerEmailHtml(mockOrderDataCash);
    expect(noNotesHtml).not.toContain('Uwagi');
  });

  it('nie zawiera piętra/pokoju gdy floorRoom jest undefined', () => {
    const noFloorHtml = buildCustomerEmailHtml(mockOrderDataCash);
    // adres bez piętra – brak przecinka po adresie przed miastem
    expect(noFloorHtml).toContain('ul. Testowa 10');
    expect(noFloorHtml).not.toContain('Piętro 3');
  });

  it('wyświetla cenę jako (price * quantity) dla każdego dania', () => {
    // Kanapka: 14.25 * 2 = 28.50
    expect(html).toContain('28,50 zł');
    // Zupa: 11.40 * 1 = 11.40
    expect(html).toContain('11,40 zł');
  });
});

// ─────────────────────────────────────────────
// buildRestaurantEmailHtml
// ─────────────────────────────────────────────
describe('buildRestaurantEmailHtml', () => {
  let html: string;

  beforeAll(() => {
    html = buildRestaurantEmailHtml(mockOrderData);
  });

  it('zwraca niepusty string HTML', () => {
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('zaczyna się od DOCTYPE html', () => {
    expect(html.trim()).toMatch(/^<!DOCTYPE html>/i);
  });

  it('zawiera skrócony numer zamówienia', () => {
    expect(html).toContain('#ABC12345');
  });

  it('zawiera pełne imię i nazwisko klienta', () => {
    expect(html).toContain('Jan');
    expect(html).toContain('Kowalski');
  });

  it('zawiera email klienta', () => {
    expect(html).toContain('jan.kowalski@example.com');
  });

  it('zawiera telefon klienta', () => {
    expect(html).toContain('600100200');
  });

  it('zawiera nazwę firmy', () => {
    expect(html).toContain('Firma Testowa Sp. z o.o.');
  });

  it('zawiera adres z piętrem', () => {
    expect(html).toContain('ul. Testowa 10');
    expect(html).toContain('Piętro 3, pokój 301');
  });

  it('zawiera daty dostawy', () => {
    expect(html).toContain('25.03.2026 · 26.03.2026');
  });

  it('zawiera kolumnę kategorii dań', () => {
    expect(html).toContain('Kanapki i wrapy');
    expect(html).toContain('Zupy');
  });

  it('zawiera nazwy dań', () => {
    expect(html).toContain('Kanapka z łososiem');
    expect(html).toContain('Zupa dnia');
  });

  it('zawiera całkowitą kwotę zamówienia', () => {
    expect(html).toContain('40,00 zł');
  });

  it('wyświetla metodę płatności w nagłówku', () => {
    expect(html).toContain('Karta / online');
  });

  it('wyświetla "Gotówka" dla płatności gotówkowej', () => {
    const cashHtml = buildRestaurantEmailHtml(mockOrderDataCash);
    expect(cashHtml).toContain('Gotówka');
  });

  it('zawiera uwagi do zamówienia', () => {
    expect(html).toContain('Brak soli proszę');
  });

  it('nie zawiera sekcji uwag gdy notes jest undefined', () => {
    const noNotesHtml = buildRestaurantEmailHtml(mockOrderDataCash);
    expect(noNotesHtml).not.toContain('Brak soli');
  });

  it('wyświetla cenę jako (price * quantity) dla każdego dania', () => {
    expect(html).toContain('28,50 zł');
    expect(html).toContain('11,40 zł');
  });
});
