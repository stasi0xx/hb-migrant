import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin/auth';
import { createServerSupabaseClient } from '@/lib/supabase';

// PATCH /api/admin/menu/[id] — publish or unpublish a week
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !await verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!['draft', 'published'].includes(status)) {
    return NextResponse.json({ error: 'Nieprawidłowy status' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // If publishing, unpublish all other weeks first
  if (status === 'published') {
    await supabase
      .from('menu_weeks')
      .update({ status: 'draft' })
      .neq('id', id);
  }

  const { error } = await supabase
    .from('menu_weeks')
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/menu/[id] — delete a week (cascade deletes items)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !await verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('menu_weeks').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// PATCH items — update a single item (name, price, is_vege, is_spicy)
// PUT /api/admin/menu/[id]/items handled separately
