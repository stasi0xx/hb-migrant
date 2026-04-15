import { redirect } from 'next/navigation';
import { createAuthServerClient } from '@/lib/supabase';
import { createServerSupabaseClient } from '@/lib/supabase';
import KontoPanelShell from '@/components/account/KontoPanelShell';

export default async function KontoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch profile data for the shell
  const serviceClient = createServerSupabaseClient();
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('user_id', user.id)
    .single();

  const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Klient';

  return (
    <KontoPanelShell
      locale={locale}
      displayName={displayName}
      avatarUrl={profile?.avatar_url ?? null}
      userEmail={user.email ?? ''}
    >
      {children}
    </KontoPanelShell>
  );
}
