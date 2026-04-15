import { NextRequest, NextResponse } from 'next/server';
import { buildCustomerEmailHtml, buildRestaurantEmailHtml, OrderEmailData } from '@/lib/resend';

export const dynamic = 'force-dynamic';

const SAMPLE_DATA: OrderEmailData = {
  orderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  customerFirstName: 'Marek',
  customerLastName: 'Kowalski',
  customerEmail: 'marek.kowalski@example.com',
  customerPhone: '+31 6 12345678',
  companyName: '',
  address: 'Stationsstraat 42',
  city: 'Tilburg',
  floorRoom: 'Room 3B',
  notes: 'Please ring the bell twice.',
  items: [
    { name: 'Pork schnitzel with potatoes', category: 'Obiady', price: 9.98, date: 'Mon 21 Apr', quantity: 1 },
    { name: 'Tomato soup with bread', category: 'Zupy', price: 9.98, date: 'Mon 21 Apr', quantity: 1 },
    { name: 'Pierogi ruskie', category: 'Obiady', price: 9.98, date: 'Thu 24 Apr', quantity: 1 },
    { name: 'Barszcz czerwony', category: 'Zupy', price: 9.98, date: 'Thu 24 Apr', quantity: 1 },
  ],
  totalAmount: 45.56,
  paymentMethod: 'stripe',
  deliveryDates: ['Mon 21 Apr', 'Thu 24 Apr'],
  registrationToken: 'preview-token-1234',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'customer';

  const html =
    type === 'restaurant'
      ? buildRestaurantEmailHtml(SAMPLE_DATA)
      : buildCustomerEmailHtml(SAMPLE_DATA);

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
