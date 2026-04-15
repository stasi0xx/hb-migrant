import { createAuthServerClient, createServerSupabaseClient } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { ShoppingBag, Star, CalendarDays, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { MealCard } from '@/components/account/MealCard';

interface OrderItem {
  name: string;
  category: string;
  price: number;
  quantity: number;
  date: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  delivery_dates: string[];
  status: string;
  payment_status: string;
  created_at: string;
  address: string;
  city: string;
  floor_room: string | null;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function parseDateStr(dateStr: string): Date {
  const [d, m, y] = dateStr.split('.').map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateFull(dateStr: string, dayNames: string[], months: string[]) {
  const [d, m, y] = dateStr.split('.').map(Number);
  const date = new Date(y, m - 1, d);
  return {
    dayName: dayNames[date.getDay()],
    day: d,
    month: months[m - 1],
  };
}

// Returns Mon-Fri of the current week; if today is Sat/Sun returns next week instead
function getCurrentWeekDays(nowIso: string): string[] {
  const [y, m, d] = nowIso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = date.getDay(); // 0=Sun … 6=Sat

  const monday = new Date(date);
  if (dow === 0) monday.setDate(date.getDate() + 1);       // Sun → next Mon
  else if (dow === 6) monday.setDate(date.getDate() + 2);  // Sat → next Mon
  else monday.setDate(date.getDate() - (dow - 1));         // weekday → this Mon

  return Array.from({ length: 5 }, (_, i) => {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const dd = String(cur.getDate()).padStart(2, '0');
    const mm = String(cur.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}.${cur.getFullYear()}`;
  });
}

// Convert YYYY-MM-DD → DD.MM.YYYY
function isoToDDMMYYYY(iso: string): string {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
}

// ─── meal image pool (cycles through available food photos) ─────────────────

const FOOD_IMAGES = [
  '/images/food-1.webp',
  '/images/food-2.webp',
  '/images/food-3.webp',
  '/images/food-4.webp',
  '/images/food-5.webp',
  '/images/food-6.webp',
  '/images/food-7.webp',
  '/images/food-8.webp',
];

// ─── sub-components (server-safe, no hooks) ──────────────────────────────────

function CalendarGrid({
  workingDays,
  deliveryDates,
  todayDDMMYYYY,
  dayHeaders,
  thisWeekLabel,
  labels,
}: {
  workingDays: string[];
  deliveryDates: Set<string>;
  todayDDMMYYYY: string;
  dayHeaders: string[];
  thisWeekLabel: string;
  labels: { delivery: string; edit: string; order: string };
}) {
  const [td, tm, ty] = todayDDMMYYYY.split('.').map(Number);
  const tomorrowDate = new Date(ty, tm - 1, td + 1);
  const tomorrowDDMMYYYY = `${String(tomorrowDate.getDate()).padStart(2, '0')}.${String(tomorrowDate.getMonth() + 1).padStart(2, '0')}.${tomorrowDate.getFullYear()}`;

  function isPast(dayStr: string): boolean {
    const [d, m, y] = dayStr.split('.').map(Number);
    return new Date(y, m - 1, d) < new Date(ty, tm - 1, td);
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays className="h-3.5 w-3.5 text-[#1C3D1C]/40" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#1C3D1C]/40">
          {thisWeekLabel}
        </p>
      </div>

      {/* Header */}
      <div className="mb-1 grid grid-cols-5 gap-1">
        {dayHeaders.map((h) => (
          <div key={h} className="py-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-[#1C3D1C]/30">
            {h}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-5 gap-1">
        {workingDays.map((day) => {
          const isToday = day === todayDDMMYYYY;
          const isTomorrow = day === tomorrowDDMMYYYY;
          const hasOrder = deliveryDates.has(day);
          const past = !isToday && isPast(day);
          const isFuture = !isToday && !past;
          const dayNum = parseInt(day.slice(0, 2), 10);
          return (
            <div
              key={day}
              className={`flex flex-col items-center rounded-lg py-2 text-xs font-semibold transition ${isToday
                ? 'bg-[#1C3D1C] text-white'
                : hasOrder
                  ? 'bg-[#E8967A]/10 text-[#1C3D1C]'
                  : past
                    ? 'text-[#1C3D1C]/20'
                    : 'text-[#1C3D1C]/55'
                }`}
            >
              <span>{dayNum}</span>
              {isTomorrow && hasOrder ? (
                <span className="mt-1.5 rounded-full bg-[#E8967A] px-2 py-1 text-[9px] font-bold leading-none text-white">
                  {labels.delivery}
                </span>
              ) : isFuture && hasOrder ? (
                <span className="mt-1.5 rounded-full bg-[#E8967A] px-2 py-1 text-[9px] font-bold leading-none text-white">
                  {labels.edit}
                </span>
              ) : isFuture && !hasOrder ? (
                <span className="mt-1.5 rounded-full bg-[#E8967A]/20 px-2 py-1 text-[9px] font-bold leading-none text-[#E8967A]">
                  {labels.order}
                </span>
              ) : (
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-transparent" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function KontoDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations('auth.konto.dashboard');
  const tShell = await getTranslations('auth.konto.shell');

  const dayNames = t('dayNames').split(',');
  const months = t('months').split(',');

  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const serviceClient = createServerSupabaseClient();
  const [, { data: orders }] = await Promise.all([
    serviceClient.from('profiles').select('full_name').eq('user_id', user.id).single(),
    serviceClient
      .from('orders')
      .select('id, items, total_amount, delivery_dates, status, payment_status, created_at, address, city, floor_room')
      .eq('user_id', user.id)
      .in('status', ['new', 'confirmed'])
      .order('created_at', { ascending: false })
      .limit(30),
  ]);

  const nowIso = new Date().toISOString().slice(0, 10);
  const [ny, nm, nd] = nowIso.split('-').map(Number);
  const todayMidnight = new Date(ny, nm - 1, nd);
  todayMidnight.setHours(0, 0, 0, 0);
  const todayDDMMYYYY = isoToDDMMYYYY(nowIso);

  const upcomingOrders: Order[] = (orders ?? []).filter((o: Order) =>
    o.delivery_dates?.some((d: string) => parseDateStr(d) >= todayMidnight)
  );

  const nextOrder = upcomingOrders[0] as Order | undefined;
  const nextDeliveryDate = nextOrder?.delivery_dates
    .filter((d) => parseDateStr(d) >= todayMidnight)
    .sort()[0];

  const nextItems = nextOrder && nextDeliveryDate
    ? nextOrder.items.filter((item: OrderItem) => item.date === nextDeliveryDate)
    : [];

  const nextDateFmt = nextDeliveryDate ? formatDateFull(nextDeliveryDate, dayNames, months) : null;

  // Calendar — current week Mon-Fri (or next week if weekend)
  const workingDays = getCurrentWeekDays(nowIso);
  const allDeliveryDates = new Set(
    upcomingOrders.flatMap((o: Order) => o.delivery_dates ?? [])
  );

  const dayHeaders = t('weekDayHeaders').split(',');
  const calendarLabels = {
    delivery: t('calendarLabels.delivery'),
    edit: t('calendarLabels.edit'),
    order: t('calendarLabels.order'),
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-5">

      {/* ── HERO: Następne zamówienie ─────────────────────────────── */}
      <div className="lg:col-span-3">
        {nextOrder && nextDeliveryDate && nextDateFmt ? (
          <div className="overflow-hidden rounded-2xl bg-[#1C3D1C] shadow-lg">

            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/35">
                  {t('nextDelivery')}
                </p>
                <p className="mt-1 font-heading text-sm font-bold text-white leading-snug">
                  {nextDateFmt.dayName}, {nextDateFmt.day} {nextDateFmt.month}
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-0.5 pt-0.5 text-right">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/35">{nextOrder.city}</p>
                <p className="text-sm font-bold text-white leading-snug">
                  {nextOrder.address}{nextOrder.floor_room ? `, ${nextOrder.floor_room}` : ''}
                </p>
              </div>
            </div>

            {/* Photo mosaic */}
            {nextItems.length > 0 && (
              <div className="mt-4 px-5">
                <div
                  className={`overflow-hidden rounded-xl ${nextItems.length === 1
                    ? 'grid grid-cols-1'
                    : nextItems.length === 2
                      ? 'grid grid-cols-2 gap-0.5'
                      : 'grid grid-cols-3 gap-0.5'
                    }`}
                  style={{ minHeight: '200px' }}
                >
                  {nextItems.slice(0, 3).map((item, i) => (
                    <MealCard
                      key={i}
                      name={item.name}
                      image={FOOD_IMAGES[i % FOOD_IMAGES.length]}
                      quantity={item.quantity}
                      count={Math.min(nextItems.length, 3)}
                    />
                  ))}
                </div>
                {nextItems.length > 3 && (
                  <p className="mt-1.5 text-right text-xs text-white/35">
                    {t('moreItems', { count: nextItems.length - 3 })}
                  </p>
                )}
              </div>
            )}

            {/* Price footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/30">
                {t('totalAmount')}
              </p>
              <p className="font-heading text-xl font-extrabold text-white">
                {nextOrder.total_amount.toFixed(2)} zł
              </p>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#1C3D1C]/15 bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF6EC]">
              <ShoppingBag className="h-8 w-8 text-[#E8967A]" />
            </div>
            <div>
              <p className="font-heading text-xl text-[#1C3D1C]">{t('noOrders')}</p>
              <p className="mt-1 text-sm text-[#1C3D1C]/45">
                {t('noOrdersSub')}
              </p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-[#E8967A] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#d4785e] active:scale-[0.98]"
            >
              {t('browseMenu')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-5">
        {/* Points */}
        <div className="rounded-2xl bg-[#1C3D1C] p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[#D4A017]" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                {t('points')}
              </p>
            </div>
            <span className="rounded-full bg-[#D4A017]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#D4A017]">
              {tShell('comingSoon')}
            </span>
          </div>
          <p className="mt-3 font-heading text-5xl font-extrabold text-white">0</p>
          <p className="mt-0.5 text-xs text-white/30">{t('loyaltyPoints')}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-0 rounded-full bg-[#D4A017]" />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-white/25">
            <span>0 pkt</span>
            <span>{t('pointsGoal')}</span>
          </div>
        </div>

        {/* Calendar */}
        <CalendarGrid
          workingDays={workingDays}
          deliveryDates={allDeliveryDates}
          todayDDMMYYYY={todayDDMMYYYY}
          dayHeaders={dayHeaders}
          thisWeekLabel={t('thisWeek')}
          labels={calendarLabels}
        />

        {/* New order CTA */}
        <Link
          href="/"
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#E8967A] p-6 text-center shadow-lg transition hover:bg-[#d4785e] active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white/30">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-heading text-lg text-white">{t('orderNext')}</p>
            <p className="mt-0.5 text-sm text-white/65">{t('orderNextSub')}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white transition group-hover:bg-white/30">
            {t('checkMenu')}
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

    </div>
  );
}
