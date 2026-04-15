import { createAuthServerClient, createServerSupabaseClient } from '@/lib/supabase';
import AddressManager from '@/components/account/AddressManager';

export interface Address {
  id: string;
  label: string;
  street: string;
  zip: string;
  city: string;
  floor_room: string | null;
  is_default: boolean;
}

export default async function AdresyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = createServerSupabaseClient();
  const { data } = await db
    .from('addresses')
    .select('id, label, street, zip, city, floor_room, is_default')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true });

  return <AddressManager locale={locale} addresses={(data as Address[]) ?? []} />;
}
