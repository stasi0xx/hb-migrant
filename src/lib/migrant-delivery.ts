/**
 * Delivery window logic for Hongerige Beer — Migrant Workers site.
 *
 * Two delivery events per week:
 *   Sunday    → eating Mon–Wed → deadline: preceding Thursday 10:00
 *   Wednesday → eating Thu–Sat → deadline: preceding Sunday 10:00
 *
 * At any moment there are 3 upcoming slots whose deadlines haven't passed:
 *
 *   Period A (Sun 10:00 → Thu 10:00):
 *     3-day options: this Sun · next Wed · next Sun
 *     6-day options: (this Sun + next Wed) · (next Wed + next Sun)
 *
 *   Period B (Thu 10:00 → Sun 10:00):
 *     3-day options: next Wed · next Sun · Wed in 2 weeks
 *     6-day options: (next Wed + next Sun) · (next Sun + Wed in 2 weeks)
 *
 * Menu week = Mon–Fri of the ISO week containing the delivery date,
 *             filtered to dates present in the published menu.
 * For 6-day packages: menu comes from the LATER slot's week.
 * Slots without any published menu days are hidden.
 */

export type DeliveryType = 'sunday' | 'wednesday';

export interface MigrantWindow {
  id: string;
  deliveryType: DeliveryType;
  /** Physical delivery date (Sunday or Wednesday evening) */
  deliveryDate: Date;
  /** Eating days shown to customer (Mon–Wed or Thu–Sat), DD.MM.YYYY */
  deliveryDays: string[];
  /** Mon–Fri of the ISO week containing deliveryDate, filtered to published menu dates */
  menuDays: string[];
  /** Order must be placed before this moment */
  deadline: Date;
  /** "Mon – Wed" | "Thu – Sat" */
  dayRangeLabel: string;
}

export interface MigrantWeekSlot {
  id: string;
  /** e.g. "20–26 Apr" or "30 Apr – 6 May" */
  weekLabel: string;
  /** Earlier delivery */
  windowA: MigrantWindow;
  /** Later delivery */
  windowB: MigrantWindow;
  /** Menu comes from windowB (the later delivery's week) */
  menuDays: string[];
  /** Binding deadline = windowA's deadline (the earlier of the two) */
  deadline: Date;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** Monday of the ISO week containing `date`. */
function getMondayOf(date: Date): Date {
  const d = startOfDay(date);
  const dow = d.getDay(); // 0 = Sun
  d.setDate(d.getDate() + (dow === 0 ? -6 : 1 - dow));
  return d;
}

function buildWindow(deliveryDate: Date, menuDates: string[]): MigrantWindow {
  const isSunday = deliveryDate.getDay() === 0;

  // Eating days: Mon–Wed (day after Sunday) or Thu–Sat (day after Wednesday)
  const firstEatingDay = addDays(deliveryDate, 1);
  const deliveryDays = [0, 1, 2].map(i => toDateStr(addDays(firstEatingDay, i)));

  // Menu week: Mon–Fri of the ISO week that STARTS after the delivery.
  // For Sunday delivery: the week starting the next day (Monday).
  // For Wednesday delivery: the ISO week containing that Wednesday.
  // This ensures Sunday + following Wednesday share the same menu week.
  const monday = isSunday ? getMondayOf(addDays(deliveryDate, 1)) : getMondayOf(deliveryDate);
  const menuDays = [0, 1, 2, 3, 4]
    .map(i => toDateStr(addDays(monday, i)))
    .filter(d => menuDates.includes(d));

  // Deadline: 3 days before delivery at 10:00
  //   Sunday    → preceding Thursday 10:00
  //   Wednesday → preceding Sunday 10:00
  const deadline = addDays(deliveryDate, -3);
  deadline.setHours(10, 0, 0, 0);

  return {
    id: `${isSunday ? 'SUN' : 'WED'}-${toDateStr(deliveryDate)}`,
    deliveryType: isSunday ? 'sunday' : 'wednesday',
    deliveryDate,
    deliveryDays,
    menuDays,
    deadline,
    dayRangeLabel: isSunday ? 'Mon – Wed' : 'Thu – Sat',
  };
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * Returns up to 3 available 3-day delivery windows.
 *
 * Scans upcoming Sundays and Wednesdays in chronological order.
 * A slot is included when: deadline > now AND menu has at least one published day.
 */
export function getAvailableMigrantWindows(
  menuDates: string[],
  now: Date = new Date()
): MigrantWindow[] {
  const result: MigrantWindow[] = [];

  for (let daysAhead = 0; daysAhead <= 28 && result.length < 3; daysAhead++) {
    const candidate = startOfDay(addDays(now, daysAhead));
    const dow = candidate.getDay();

    // Only check Sundays (0) and Wednesdays (3)
    if (dow !== 0 && dow !== 3) continue;

    const deadline = addDays(candidate, -3);
    deadline.setHours(10, 0, 0, 0);

    if (deadline <= now) continue; // Deadline already passed

    const win = buildWindow(candidate, menuDates);
    if (win.menuDays.length > 0) {
      result.push(win);
    }
  }

  return result;
}

/**
 * Returns up to 2 available 6-day slots (consecutive pairs of 3-day windows).
 * Menu comes from the later window. Binding deadline = the earlier window's deadline.
 */
export function getAvailableMigrantWeekSlots(
  menuDates: string[],
  now: Date = new Date()
): MigrantWeekSlot[] {
  const windows = getAvailableMigrantWindows(menuDates, now);
  const result: MigrantWeekSlot[] = [];

  for (let i = 0; i < windows.length - 1 && result.length < 2; i++) {
    const first = windows[i];
    const second = windows[i + 1];
    const firstDay = first.deliveryDays[0];
    const lastDay = second.deliveryDays[second.deliveryDays.length - 1];

    result.push({
      id: `WEEK-${first.id}-${second.id}`,
      weekLabel: formatEatingRangeLabel(firstDay, lastDay),
      windowA: first,
      windowB: second,
      menuDays: second.menuDays, // Menu from the later delivery's week
      deadline: first.deadline,  // Earlier deadline is binding
    });
  }

  return result;
}

// ─── formatters ──────────────────────────────────────────────────────────────

/** "16–22 Apr" or "30 Apr – 6 May" from two DD.MM.YYYY strings */
function formatEatingRangeLabel(firstDate: string, lastDate: string): string {
  const [dd1, mm1, yyyy1] = firstDate.split('.');
  const [dd2, mm2, yyyy2] = lastDate.split('.');
  const d1 = new Date(+yyyy1, +mm1 - 1, +dd1);
  const d2 = new Date(+yyyy2, +mm2 - 1, +dd2);
  const month1 = d1.toLocaleString('en', { month: 'short' });
  if (d1.getMonth() === d2.getMonth()) {
    return `${d1.getDate()}–${d2.getDate()} ${month1}`;
  }
  return `${d1.getDate()} ${month1} – ${d2.getDate()} ${d2.toLocaleString('en', { month: 'short' })}`;
}

/** "Thursday, 16 Apr – 10:00" */
export function formatWindowDeadline(deadline: Date, locale = 'en'): string {
  return (
    deadline.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }) + ' – 10:00'
  );
}

/** "Sunday 19 Apr, 18:00–21:00" */
export function formatDeliveryDate(date: Date, locale = 'en'): string {
  return (
    date.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }) + ', 18:00–21:00'
  );
}

/** "Mon 20 · Tue 21 · Wed 22 Apr" from ["20.04.2026", ...] */
export function formatEatingDays(dates: string[], locale = 'en'): string {
  return dates
    .map(d => {
      const [dd, mm, yyyy] = d.split('.');
      const date = new Date(+yyyy, +mm - 1, +dd);
      return date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
    })
    .join(' · ');
}

// ─── Menu Filtering ───────────────────────────────────────────────────────────

type CategoryData = { nazwa: string; name_translations?: Record<string, string>; cena: string; is_vege?: boolean; is_spicy?: boolean }[];
type MenuData = Record<string, Record<string, CategoryData>>;

/**
 * Filters out unwanted categories and specific items for the migrant flow.
 */
export function filterMigrantMenu(menu: MenuData): MenuData {
  const EXCLUDED_CATEGORIES = ['kanapk', 'sałatk', 'sushi'];
  const EXCLUDED_KEYWORDS = ['ramen', 'poke', 'sushi'];

  const filtered: MenuData = {};

  for (const [date, categories] of Object.entries(menu)) {
    const dayFiltered: Record<string, CategoryData> = {};
    for (const [catName, dishes] of Object.entries(categories)) {
      const catLower = catName.toLowerCase();
      if (EXCLUDED_CATEGORIES.some(ex => catLower.includes(ex))) continue;

      const filteredDishes = dishes.filter(
        dish => !EXCLUDED_KEYWORDS.some(kw => dish.nazwa.toLowerCase().includes(kw))
      );

      if (filteredDishes.length > 0) {
        dayFiltered[catName] = filteredDishes;
      }
    }
    if (Object.keys(dayFiltered).length > 0) {
      filtered[date] = dayFiltered;
    }
  }

  return filtered;
}
