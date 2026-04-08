import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin/auth';
import { createServerSupabaseClient } from '@/lib/supabase';

interface ParsedItem {
  name: string;
  name_translations: Record<string, string>;
  price_pln: number;
  price_eur: number;
  is_vege: boolean;
  is_spicy: boolean;
}

interface ParsedCategory {
  name: string;
  items: ParsedItem[];
}

interface ParsedDay {
  date: string;
  day_name: string;
  categories: ParsedCategory[];
}

interface SaveDraftBody {
  days: ParsedDay[];
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !await verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: SaveDraftBody = await request.json();
  const { days } = body;

  if (!days || days.length === 0) {
    return NextResponse.json({ error: 'Brak danych' }, { status: 400 });
  }

  // Determine week range from day dates
  const dates = days.map((d) => {
    const [day, month, year] = d.date.split('.').map(Number);
    return new Date(year, month - 1, day);
  });
  const weekStart = new Date(Math.min(...dates.map((d) => d.getTime())));
  const weekEnd = new Date(Math.max(...dates.map((d) => d.getTime())));

  const toIso = (d: Date) => d.toISOString().split('T')[0];

  const supabase = createServerSupabaseClient();

  // Create week record
  const { data: week, error: weekError } = await supabase
    .from('menu_weeks')
    .insert({ week_start: toIso(weekStart), week_end: toIso(weekEnd), status: 'draft' })
    .select('id')
    .single();

  if (weekError || !week) {
    return NextResponse.json({ error: weekError?.message ?? 'DB error' }, { status: 500 });
  }

  // Flatten all items
  const rows = days.flatMap((day, dayIdx) =>
    day.categories.flatMap((cat, catIdx) =>
      cat.items.map((item, itemIdx) => ({
        week_id: week.id,
        date: day.date,
        day_name: day.day_name,
        category: cat.name,
        name: item.name,
        name_translations: item.name_translations || { pl: item.name },
        price_pln: item.price_pln,
        price_eur: item.price_eur,
        price: item.price_pln || 0, // Fallback for old schema
        is_vege: item.is_vege,
        is_spicy: item.is_spicy,
        position: dayIdx * 1000 + catIdx * 100 + itemIdx,
      }))
    )
  );

  const { error: itemsError } = await supabase.from('menu_items').insert(rows);

  if (itemsError) {
    // Clean up the week if items insert failed
    await supabase.from('menu_weeks').delete().eq('id', week.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ id: week.id });
}
