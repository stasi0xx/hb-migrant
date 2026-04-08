import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin/auth';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !await verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data: items, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('week_id', id)
    .order('position');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by day → category
  const daysMap = new Map<string, { date: string; day_name: string; cats: Map<string, typeof items> }>();

  for (const item of items ?? []) {
    if (!daysMap.has(item.date)) {
      daysMap.set(item.date, { date: item.date, day_name: item.day_name, cats: new Map() });
    }
    const day = daysMap.get(item.date)!;
    if (!day.cats.has(item.category)) {
      day.cats.set(item.category, []);
    }
    day.cats.get(item.category)!.push(item);
  }

  const days = Array.from(daysMap.values()).map((d) => ({
    date: d.date,
    day_name: d.day_name,
    categories: Array.from(d.cats.entries()).map(([name, catItems]) => ({
      name,
      items: catItems,
    })),
  }));

  return NextResponse.json({ days });
}
