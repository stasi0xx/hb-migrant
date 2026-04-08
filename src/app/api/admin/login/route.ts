import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createSessionToken, COOKIE_NAME } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: 'Nieprawidłowe hasło' }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}
