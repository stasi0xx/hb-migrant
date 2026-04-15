'use server';

import { createAuthServerClient, createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface AddressInput {
  label: string;
  street: string;
  zip: string;
  city: string;
  floor_room?: string | null;
  is_default: boolean;
}

async function getUser() {
  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function createAddress(locale: string, data: AddressInput) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const db = createServerSupabaseClient();

  if (data.is_default) {
    await db.from('addresses').update({ is_default: false }).eq('user_id', user.id);
  }

  const { error } = await db.from('addresses').insert({ ...data, user_id: user.id });

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/account/addresses`);
  return { success: true };
}

export async function updateAddress(locale: string, id: string, data: AddressInput) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const db = createServerSupabaseClient();

  if (data.is_default) {
    await db
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .neq('id', id);
  }

  const { error } = await db
    .from('addresses')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/account/addresses`);
  return { success: true };
}

export async function deleteAddress(locale: string, id: string) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const db = createServerSupabaseClient();

  const { error } = await db
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/account/addresses`);
  return { success: true };
}

export async function setDefaultAddress(locale: string, id: string) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const db = createServerSupabaseClient();

  await db.from('addresses').update({ is_default: false }).eq('user_id', user.id);

  const { error } = await db
    .from('addresses')
    .update({ is_default: true })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/account/addresses`);
  return { success: true };
}
