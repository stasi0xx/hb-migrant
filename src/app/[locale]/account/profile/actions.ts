'use server';

import { createAuthServerClient, createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getUser() {
  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function updateProfile(
  locale: string,
  data: { full_name: string; phone: string }
) {
  const { user } = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const db = createServerSupabaseClient();
  const { error } = await db
    .from('profiles')
    .update({ full_name: data.full_name, phone: data.phone })
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/account/profile`);
  return { success: true };
}

export async function sendPasswordReset(email: string) {
  const { supabase, user } = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/account/profile`,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteAccount(locale: string) {
  const { user } = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const db = createServerSupabaseClient();
  const { error } = await db.auth.admin.deleteUser(user.id);

  if (error) return { error: error.message };

  redirect(`/${locale}`);
}
