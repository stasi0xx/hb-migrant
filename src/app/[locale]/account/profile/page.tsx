import { createAuthServerClient, createServerSupabaseClient } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import ProfileForm from '@/components/account/ProfileForm';
import DeleteAccountTrigger from '@/components/account/DeleteAccountTrigger';

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('auth.konto.profil');

  const supabase = await createAuthServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = createServerSupabaseClient();
  const { data: profile } = await db
    .from('profiles')
    .select('full_name, phone')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 font-heading text-2xl text-[#1C3D1C]">{t('title')}</h1>

      <div className="space-y-5">
        <ProfileForm
          locale={locale}
          fullName={profile?.full_name ?? ''}
          email={user.email ?? ''}
          phone={profile?.phone ?? ''}
        />

        <DeleteAccountTrigger locale={locale} />
      </div>
    </div>
  );
}
