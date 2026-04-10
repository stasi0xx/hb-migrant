/**
 * Delivery date logic for Hongige Beer — Office Staff site.
 *
 * Rule: Order by 10:00 AM on day D → delivery on day D+4 (Mon–Fri only).
 * Cancel until 14:00 on the order day.
 *
 * Order deadlines by delivery day:
 *   Thursday 10:00  → Monday
 *   Friday 10:00    → Tuesday
 *   Saturday 10:00  → Wednesday
 *   Sunday 10:00    → Thursday
 *   Monday 10:00    → Friday
 */

const LEAD_DAYS = 4;
const CUTOFF_HOUR = 10;

function toMenuDateStr(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}.${m}.${date.getFullYear()}`;
}

/** Returns the earliest mathematically possible delivery date regardless of menu data */
export function getEarliestDeliveryDate(now: Date = new Date()): string {
  for (let i = 0; i <= 14; i++) {
    const orderDay = new Date(now);
    orderDay.setHours(0, 0, 0, 0);
    orderDay.setDate(orderDay.getDate() + i);

    if (i === 0 && now.getHours() >= CUTOFF_HOUR) continue;

    const deliveryDay = new Date(orderDay);
    deliveryDay.setDate(deliveryDay.getDate() + LEAD_DAYS);

    const dow = deliveryDay.getDay();
    if (dow >= 1 && dow <= 5) {
      return toMenuDateStr(deliveryDay);
    }
  }
  return '';
}

/**
 * Returns menu date strings (DD.MM.YYYY) that are valid delivery dates
 * for the HB Office site, filtered against the available menu dates.
 */
export function getOfficeDeliveryDates(
  menuDates: string[],
  now: Date = new Date()
): string[] {
  const available: string[] = [];

  for (let i = 0; i <= 14; i++) {
    const orderDay = new Date(now);
    orderDay.setHours(0, 0, 0, 0);
    orderDay.setDate(orderDay.getDate() + i);

    // Today's deadline has passed — skip
    if (i === 0 && now.getHours() >= CUTOFF_HOUR) continue;

    const deliveryDay = new Date(orderDay);
    deliveryDay.setDate(deliveryDay.getDate() + LEAD_DAYS);

    // Only Mon–Fri deliveries
    const dow = deliveryDay.getDay();
    if (dow < 1 || dow > 5) continue;

    const dateStr = toMenuDateStr(deliveryDay);
    if (menuDates.includes(dateStr) && !available.includes(dateStr)) {
      available.push(dateStr);
    }

    if (available.length >= 5) break;
  }

  return available;
}

/**
 * Returns all Mon–Fri menu dates regardless of deadline.
 * Used to show all tabs (available + disabled) in the UI.
 */
export function getAllOfficeMenuDates(menuDates: string[]): string[] {
  return menuDates.filter((dateStr) => {
    const [dd, mm, yyyy] = dateStr.split('.').map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    const dow = date.getDay();
    return dow >= 1 && dow <= 5;
  });
}

/** Order deadline: D-4 days at 10:00 AM. */
export function getOrderDeadline(menuDateStr: string): Date {
  const [dd, mm, yyyy] = menuDateStr.split('.').map(Number);
  const delivery = new Date(yyyy, mm - 1, dd);
  delivery.setDate(delivery.getDate() - LEAD_DAYS);
  delivery.setHours(CUTOFF_HOUR, 0, 0, 0);
  return delivery;
}

/** Cancellation deadline: 14:00 on the order day. */
export function getCancellationDeadline(menuDateStr: string): Date {
  const deadline = getOrderDeadline(menuDateStr);
  deadline.setHours(14, 0, 0, 0);
  return deadline;
}
