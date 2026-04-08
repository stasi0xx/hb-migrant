import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin/auth';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !await verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  const { data: weeks, error } = await supabase
    .from('menu_weeks')
    .select('id, week_start, week_end, status, created_at')
    .order('week_start', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add item counts
  const weeksWithCount = await Promise.all(
    (weeks ?? []).map(async (week) => {
      const { count } = await supabase
        .from('menu_items')
        .select('id', { count: 'exact', head: true })
        .eq('week_id', week.id);
      return { ...week, item_count: count ?? 0 };
    })
  );

  return NextResponse.json({ weeks: weeksWithCount });
}
