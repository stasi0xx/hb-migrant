import { createAuthServerClient, createServerSupabaseClient } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { ShoppingBag } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import OrderHistoryCard, { type HistoryCardOrder, type HistoryT } from '@/components/account/OrderHistoryCard';

interface OrderItem {
  name: string;
  category: string;
  price: number;
  quantity: number;
  date: string;
}

interface Order {
  id: string;
  created_at: string;
  items: OrderItem[];
  total_amount: number;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
  payment_method: 'stripe' | 'cash';
  city: string;
  address: string;
  floor_room: string | null;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function formatOrderDate(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoDate));
}

function formatMonthYear(yearMonth: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(yearMonth + '-01'));
}

function groupByMonth(
  orders: Order[],
  locale: string,
): Array<{ monthLabel: string; orders: Order[] }> {
  const groups = new Map<string, Order[]>();
  for (const order of orders) {
    const key = order.created_at.slice(0, 7); // "YYYY-MM"
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(order);
  }
  return Array.from(groups.entries()).map(([key, grpOrders]) => ({
    monthLabel: formatMonthYear(key, locale),
    orders: grpOrders,
  }));
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function HistoriaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('auth.konto.history');

  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const serviceClient = createServerSupabaseClient();
  const { data: rawOrders } = await serviceClient
    .from('orders')
    .select('id, created_at, items, total_amount, status, payment_method, city, address, floor_room')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const orders: Order[] = rawOrders ?? [];
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const groups = groupByMonth(orders, locale);

  const cardT: HistoryT = {
    statusLabels: {
      new: t('status.new'),
      confirmed: t('status.confirmed'),
      delivered: t('status.delivered'),
      cancelled: t('status.cancelled'),
    },
    paymentLabels: {
      stripe: t('payment.stripe'),
      cash: t('payment.cash'),
    },
    total: t('total'),
    itemsSuffix: t('itemsSuffix'),
    collapseItems: t('collapseItems'),
  };

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl text-[#1C3D1C]">{t('title')}</h1>
        {orders.length > 0 && (
          <p className="text-sm text-[#1C3D1C]/45">
            {orders.length} {t('ordersCount')} · {totalSpent.toFixed(2)} zł {t('totalSpent')}
          </p>
        )}
      </div>

      {/* ── Empty state ────────────────────────────────────────── */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-[#1C3D1C]/15 bg-white p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF6EC]">
            <ShoppingBag className="h-8 w-8 text-[#E8967A]" />
          </div>
          <div>
            <p className="font-heading text-xl text-[#1C3D1C]">{t('empty')}</p>
            <p className="mt-1 text-sm text-[#1C3D1C]/45">{t('emptySub')}</p>
          </div>
          <Link
            href="/"
            className="rounded-xl bg-[#E8967A] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#d4785e] active:scale-[0.98]"
          >
            {t('browseMenu')}
          </Link>
        </div>
      )}

      {/* ── Orders grouped by month ────────────────────────────── */}
      {groups.map(({ monthLabel, orders: monthOrders }) => (
        <section key={monthLabel} className="mb-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#1C3D1C]/40">
            {monthLabel}
          </p>
          <div className="space-y-3">
            {monthOrders.map((order) => {
              const cardOrder: HistoryCardOrder = {
                shortId: order.id.slice(0, 8),
                createdAtLabel: formatOrderDate(order.created_at, locale),
                status: order.status,
                paymentMethod: order.payment_method,
                city: order.city,
                items: order.items.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                })),
                total: Number(order.total_amount),
              };
              return <OrderHistoryCard key={order.id} order={cardOrder} t={cardT} />;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
