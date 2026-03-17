export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-\-+/g, '-')
    .trim();
}

export function parseMenuDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDisplayDate(dateStr: string, locale: string): string {
  const date = parseMenuDate(dateStr);
  return date.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getDayName(dateStr: string, locale: string): string {
  const date = parseMenuDate(dateStr);
  return date.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    weekday: 'long',
  });
}

export function getShortDayName(dateStr: string, locale: string): string {
  const date = parseMenuDate(dateStr);
  return date.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    weekday: 'short',
  });
}

export function isDateAvailable(dateStr: string): boolean {
  const menuDate = parseMenuDate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return menuDate >= tomorrow;
}

export function getAvailableDates(menuDates: string[]): string[] {
  return menuDates.filter(isDateAvailable);
}
