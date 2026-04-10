/**
 * Delivery window logic for Hongige Beer — Migrant Workers site.
 *
 * Two fixed delivery events per week (production-based logic):
 *
 *   WINDOW A — eating Mon / Tue / Wed:
 *     Physical delivery: Sunday 18:00–21:00 (the evening before Monday)
 *     Order deadline:    Wednesday 10:00 (4 days before that Sunday)
 *     Menu:              produced the PREVIOUS week
 *
 *   WINDOW B — eating Thu / Fri / Sat:
 *     Physical delivery: Wednesday 18:00–21:00 (the evening before Thursday)
 *     Order deadline:    Sunday 10:00 (3 days before that Wednesday)
 *     Menu:              produced the SAME week as delivery
 *
 * For a 6-day package (Thu–Sat + following Mon–Wed):
 *   One production batch covers Window B (Thu–Sat) AND the following Window A (Mon–Wed).
 *   Both windows share the same menu upload ("next week's production").
 *   The binding deadline is Window B's Sunday deadline (the earlier of the two).
 */

export type WindowType = 'A' | 'B';

export interface MigrantWindow {
  id: string;
  windowType: WindowType;
  /** Eating-day dates (DD.MM.YYYY) that exist in the menu */
  deliveryDays: string[];
  /** The physical delivery event date (Sunday or Wednesday evening) */
  deliveryDate: Date;
  /** Order must be placed before this moment */
  deadline: Date;
  /** "Mon – Wed" | "Thu – Sat" */
  dayRangeLabel: string;
}

export interface MigrantWeekSlot {
  id: string;
  /** e.g. "16–22 Apr" (first eating day of windowA through last eating day of windowB) */
  weekLabel: string;
  /** First delivery: Window B (Thu–Sat eating, delivery Wednesday) */
  windowA: MigrantWindow;
  /** Second delivery: Window C (Mon–Wed eating, delivery following Sunday) */
  windowB: MigrantWindow;
  /** Binding deadline = windowA's Sunday deadline (earlier of the two) */
  deadline: Date;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function toMenuDateStr(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Returns the Monday of the ISO week containing `date`, shifted by `weekOffset` weeks. */
function getMondayOf(date: Date, weekOffset = 0): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0 = Sun
  const daysToMonday = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + daysToMonday + weekOffset * 7);
  return d;
}


function buildWindowA(monday: Date, menuDates: string[]): MigrantWindow {
  const sundayDelivery = addDays(monday, -1);
  const deadline = addDays(sundayDelivery, -4); // Wednesday 4 days before
  deadline.setHours(10, 0, 0, 0);

  const eatingDays = [0, 1, 2]
    .map(i => toMenuDateStr(addDays(monday, i)))
    .filter(d => menuDates.includes(d));

  return {
    id: `A-${toMenuDateStr(monday)}`,
    windowType: 'A',
    deliveryDays: eatingDays,
    deliveryDate: sundayDelivery,
    deadline,
    dayRangeLabel: 'Mon – Wed',
  };
}

function buildWindowB(monday: Date, menuDates: string[]): MigrantWindow {
  const wednesdayDelivery = addDays(monday, 2); // Wednesday of this week
  const sundayBefore = addDays(monday, -1);
  const deadline = new Date(sundayBefore);
  deadline.setHours(10, 0, 0, 0); // Sunday 10:00 = same day Window A food arrives

  const thursday = addDays(monday, 3);
  const eatingDays = [0, 1, 2]
    .map(i => toMenuDateStr(addDays(thursday, i)))
    .filter(d => menuDates.includes(d));

  return {
    id: `B-${toMenuDateStr(monday)}`,
    windowType: 'B',
    deliveryDays: eatingDays,
    deliveryDate: wednesdayDelivery,
    deadline,
    dayRangeLabel: 'Thu – Sat',
  };
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * Returns available individual 3-day windows (up to 4, covering ~2 weeks ahead).
 * A window is open when its deadline has not passed and the menu has dates for it.
 */
export function getAvailableMigrantWindows(
  menuDates: string[],
  now: Date = new Date()
): MigrantWindow[] {
  const result: MigrantWindow[] = [];

  for (let weekOffset = 0; weekOffset <= 3 && result.length < 4; weekOffset++) {
    const monday = getMondayOf(now, weekOffset);

    const winA = buildWindowA(monday, menuDates);
    if (winA.deadline > now && winA.deliveryDays.length > 0) {
      result.push(winA);
    }

    const winB = buildWindowB(monday, menuDates);
    if (winB.deadline > now && winB.deliveryDays.length > 0) {
      result.push(winB);
    }
  }

  return result;
}

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

/**
 * Returns available 6-day slots, each covering one production batch:
 *   windowA = Window B of week N   (Thu–Sat eating, delivery Wednesday, deadline Sunday)
 *   windowB = Window C of week N+1 (Mon–Wed eating, delivery Sunday,    deadline Wednesday)
 * Binding deadline = windowA's Sunday deadline (the earlier of the two).
 */
export function getAvailableMigrantWeekSlots(
  menuDates: string[],
  now: Date = new Date()
): MigrantWeekSlot[] {
  const result: MigrantWeekSlot[] = [];

  for (let weekOffset = 0; weekOffset <= 3 && result.length < 2; weekOffset++) {
    const monday = getMondayOf(now, weekOffset);
    const nextMonday = addDays(monday, 7);

    // Window B: Thu–Sat eating, delivery Wednesday, deadline the preceding Sunday
    const winB = buildWindowB(monday, menuDates);
    // Window C: Mon–Wed eating of following week, delivery Sunday, deadline Wednesday
    const winC = buildWindowA(nextMonday, menuDates);

    if (
      winB.deadline > now &&
      winB.deliveryDays.length > 0 &&
      winC.deadline > now &&
      winC.deliveryDays.length > 0
    ) {
      const firstDay = winB.deliveryDays[0];
      const lastDay = winC.deliveryDays[winC.deliveryDays.length - 1];
      result.push({
        id: `WEEK-${toMenuDateStr(monday)}`,
        weekLabel: formatEatingRangeLabel(firstDay, lastDay),
        windowA: winB,
        windowB: winC,
        deadline: winB.deadline,
      });
    }
  }

  return result;
}

// ─── formatters ──────────────────────────────────────────────────────────────

/** "Wednesday, 8 Apr – 10:00" */
export function formatWindowDeadline(deadline: Date, locale = 'en'): string {
  return (
    deadline.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }) + ' – 10:00'
  );
}

/** "Sunday 12 Apr, 18:00–21:00" */
export function formatDeliveryDate(date: Date, locale = 'en'): string {
  return (
    date.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }) + ', 18:00–21:00'
  );
}

/** "Mon 13 · Tue 14 · Wed 15 Apr" from ["13.04.2026", ...] */
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
