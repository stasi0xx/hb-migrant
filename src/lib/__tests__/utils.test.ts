import {
  slugify,
  parseMenuDate,
  isDateAvailable,
  getAvailableDates,
  formatDisplayDate,
  getDayName,
  getShortDayName,
} from '../utils';

// ─────────────────────────────────────────────
// slugify
// ─────────────────────────────────────────────
describe('slugify', () => {
  it('zamienia spacje na myślniki', () => {
    expect(slugify('kanapki i wrapy')).toBe('kanapki-i-wrapy');
  });

  it('konwertuje do małych liter', () => {
    expect(slugify('OBIADY')).toBe('obiady');
  });

  it('usuwa znaki specjalne (nie alfanumeryczne)', () => {
    // spacje→myślniki, potem usunięcie !, +, ł (spoza \w), redukcja --→-
    expect(slugify('zupa! + sałatka')).toBe('zupa-saatka');
  });

  it('redukuje wielokrotne myślniki do jednego', () => {
    expect(slugify('hello---world')).toBe('hello-world');
  });

  it('obsługuje pusty string', () => {
    expect(slugify('')).toBe('');
  });

  it('nie zmienia już poprawnego sluga', () => {
    expect(slugify('desery-i-napoje')).toBe('desery-i-napoje');
  });

  it('obsługuje pojedyncze słowo', () => {
    expect(slugify('Zupy')).toBe('zupy');
  });
});

// ─────────────────────────────────────────────
// parseMenuDate
// ─────────────────────────────────────────────
describe('parseMenuDate', () => {
  it('poprawnie parsuje format DD.MM.YYYY', () => {
    const date = parseMenuDate('23.03.2026');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2); // 0-indexed
    expect(date.getDate()).toBe(23);
  });

  it('zwraca instancję Date', () => {
    expect(parseMenuDate('01.01.2025')).toBeInstanceOf(Date);
  });

  it('poprawnie parsuje pierwszy dzień roku', () => {
    const date = parseMenuDate('01.01.2026');
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
  });

  it('poprawnie parsuje ostatni dzień roku', () => {
    const date = parseMenuDate('31.12.2025');
    expect(date.getMonth()).toBe(11);
    expect(date.getDate()).toBe(31);
  });
});

// ─────────────────────────────────────────────
// isDateAvailable
// ─────────────────────────────────────────────
describe('isDateAvailable', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 20, 12, 0, 0)); // 20.03.2026
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('zwraca false dla dzisiaj', () => {
    expect(isDateAvailable('20.03.2026')).toBe(false);
  });

  it('zwraca true dla jutra', () => {
    expect(isDateAvailable('21.03.2026')).toBe(true);
  });

  it('zwraca false dla dat z przeszłości', () => {
    expect(isDateAvailable('15.03.2026')).toBe(false);
    expect(isDateAvailable('01.01.2026')).toBe(false);
  });

  it('zwraca true dla dat daleko w przyszłości', () => {
    expect(isDateAvailable('25.03.2026')).toBe(true);
    expect(isDateAvailable('30.03.2026')).toBe(true);
  });
});

// ─────────────────────────────────────────────
// getAvailableDates
// ─────────────────────────────────────────────
describe('getAvailableDates', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 20, 12, 0, 0)); // 20.03.2026
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('odfiltrowuje daty przeszłe i dzisiejszą', () => {
    const dates = ['18.03.2026', '19.03.2026', '20.03.2026', '21.03.2026', '22.03.2026'];
    expect(getAvailableDates(dates)).toEqual(['21.03.2026', '22.03.2026']);
  });

  it('zwraca pustą tablicę gdy żadna data nie jest dostępna', () => {
    expect(getAvailableDates(['17.03.2026', '18.03.2026', '20.03.2026'])).toEqual([]);
  });

  it('zwraca wszystkie daty gdy wszystkie są w przyszłości', () => {
    const dates = ['25.03.2026', '26.03.2026', '27.03.2026'];
    expect(getAvailableDates(dates)).toEqual(dates);
  });

  it('obsługuje pustą tablicę wejściową', () => {
    expect(getAvailableDates([])).toEqual([]);
  });

  it('zachowuje kolejność oryginalną', () => {
    const dates = ['24.03.2026', '22.03.2026', '23.03.2026'];
    expect(getAvailableDates(dates)).toEqual(['24.03.2026', '22.03.2026', '23.03.2026']);
  });
});

// ─────────────────────────────────────────────
// formatDisplayDate / getDayName / getShortDayName
// ─────────────────────────────────────────────
describe('formatDisplayDate', () => {
  it('zwraca niepusty string dla locale pl', () => {
    const result = formatDisplayDate('23.03.2026', 'pl');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('zwraca niepusty string dla locale en', () => {
    const result = formatDisplayDate('23.03.2026', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('zwraca różne wyniki dla różnych dat', () => {
    const date1 = formatDisplayDate('23.03.2026', 'en');
    const date2 = formatDisplayDate('24.03.2026', 'en');
    expect(date1).not.toBe(date2);
  });
});

describe('getDayName', () => {
  it('zwraca niepusty string', () => {
    const result = getDayName('23.03.2026', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('dla 23.03.2026 (poniedziałek) zwraca Monday po angielsku', () => {
    const result = getDayName('23.03.2026', 'en');
    expect(result.toLowerCase()).toContain('mon');
  });

  it('zwraca różne nazwy dla różnych dni', () => {
    const monday = getDayName('23.03.2026', 'en');
    const tuesday = getDayName('24.03.2026', 'en');
    expect(monday).not.toBe(tuesday);
  });
});

describe('getShortDayName', () => {
  it('zwraca niepusty string', () => {
    const result = getShortDayName('23.03.2026', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('jest krótszy lub równy pełnej nazwie dnia', () => {
    const short = getShortDayName('23.03.2026', 'en');
    const full = getDayName('23.03.2026', 'en');
    expect(short.length).toBeLessThanOrEqual(full.length);
  });

  it('zwraca różne skróty dla różnych dni', () => {
    const mon = getShortDayName('23.03.2026', 'en');
    const tue = getShortDayName('24.03.2026', 'en');
    expect(mon).not.toBe(tue);
  });
});
