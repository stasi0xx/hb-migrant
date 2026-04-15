import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createServerSupabaseClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/pl/account';

  if (!code) {
    return NextResponse.redirect(`${origin}/pl/login?error=no_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Strip provider_token from session cookie to avoid HTTP 431
            // (Google OAuth token is huge and exceeds header size limits)
            try {
              const parsed = JSON.parse(value);
              if (parsed?.provider_token) delete parsed.provider_token;
              if (parsed?.provider_refresh_token) delete parsed.provider_refresh_token;
              cookieStore.set(name, JSON.stringify(parsed), options);
            } catch {
              cookieStore.set(name, value, options);
            }
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('OAuth callback error:', error.message);
    // Email already exists as password account — redirect to link account page
    if (error.message.includes('provider_email_needs_verification') || error.message.includes('already registered')) {
      return NextResponse.redirect(`${origin}/pl/link-account`);
    }
    return NextResponse.redirect(`${origin}/pl/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/pl/login?error=auth`);
  }

  const serviceClient = createServerSupabaseClient();

  // Check if profile already exists
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    // Init user data (profile + preferences + analytics + order linking)
    await serviceClient.rpc('init_user_data', {
      p_user_id: user.id,
      p_email: user.email,
      p_full_name: user.user_metadata?.full_name ?? null,
    });
  }

  // Check for pending registration token (set before Google OAuth)
  const registrationToken = cookieStore.get('pending_registration_token')?.value;

  if (registrationToken) {
    const { data: tokenRow } = await serviceClient
      .from('registration_tokens')
      .select('email, used, expires_at')
      .eq('id', registrationToken)
      .single();

    if (tokenRow && !tokenRow.used && new Date(tokenRow.expires_at) > new Date()) {
      if (tokenRow.email === user.email) {
        // Emails match — mark token used, link orders
        await serviceClient
          .from('registration_tokens')
          .update({ used: true })
          .eq('id', registrationToken);

        await serviceClient.rpc('link_orders_to_user', {
          p_user_id: user.id,
          p_email: tokenRow.email,
        });

        // Clear the pending token cookie
        cookieStore.delete('pending_registration_token');
      } else {
        // Email mismatch — send to account linking page
        const linkUrl = new URL(`${origin}/pl/link-account`);
        linkUrl.searchParams.set('token', registrationToken);
        return NextResponse.redirect(linkUrl);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
