import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { verifySessionToken, COOKIE_NAME } from './lib/admin/auth';

const handleI18nRouting = createIntlMiddleware(routing);

const PROTECTED_PATH = /^\/(pl|en)\/account/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — skip i18n, handle admin session auth
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isAuthenticated = token ? await verifySessionToken(token) : false;

    if (!isAuthenticated && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/menu', request.url));
    }

    return NextResponse.next();
  }

  // Regular routes — i18n + Supabase auth
  const response = handleI18nRouting(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (PROTECTED_PATH.test(pathname) && !user) {
    const locale = pathname.split('/')[1] || 'pl';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|auth|monitoring|.*\\..*).*)'],
};
