import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendOrderEmails } from '@/lib/resend';

export const dynamic = 'force-dynamic';

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  date: string;
  quantity: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  city: string;
  floorRoom?: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customer,
      paymentMethod,
      deliveryDates,
      locale,
    }: {
      items: OrderItem[];
      customer: CustomerData;
      paymentMethod: 'stripe' | 'cash';
      deliveryDates: string[];
      locale: string;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const supabase = createServerSupabaseClient();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (paymentMethod === 'stripe') {
      // Create Stripe checkout session
      const lineItems = items.map((item) => ({
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.name,
            description: `${item.category} – dostawa ${item.date}`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Save order to Supabase first to get ID
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_first_name: customer.firstName,
          customer_last_name: customer.lastName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          company_name: customer.companyName,
          address: customer.address,
          city: customer.city,
          floor_room: customer.floorRoom || null,
          notes: customer.notes || null,
          items: items,
          total_amount: totalAmount,
          payment_method: 'stripe',
          payment_status: 'pending',
          stripe_session_id: 'PENDING',
          status: 'new',
          delivery_dates: deliveryDates,
        })
        .select()
        .single();

      if (error || !order) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card', 'blik', 'p24'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${baseUrl}/${locale}/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/${locale}/checkout`,
        customer_email: customer.email,
        metadata: {
          order_id: order.id,
        },
        locale: locale === 'pl' ? 'pl' : 'en',
      });

      // Update order with stripe session id
      await supabase
        .from('orders')
        .update({ stripe_session_id: session.id as string })
        .eq('id', order.id);

      // Send emails immediately (webhook handles production confirmation)
      try {
        await sendOrderEmails({
          orderId: order.id,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          companyName: customer.companyName,
          address: customer.address,
          city: customer.city,
          floorRoom: customer.floorRoom,
          notes: customer.notes,
          items,
          totalAmount,
          paymentMethod: 'stripe',
          deliveryDates,
        });
        console.log('Stripe order emails sent for:', order.id);
      } catch (emailErr) {
        console.error('Email send error:', JSON.stringify(emailErr));
      }

      return NextResponse.json({ url: session.url });
    } else {
      // Cash order – save immediately
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_first_name: customer.firstName,
          customer_last_name: customer.lastName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          company_name: customer.companyName,
          address: customer.address,
          city: customer.city,
          floor_room: customer.floorRoom || null,
          notes: customer.notes || null,
          items: items,
          total_amount: totalAmount,
          payment_method: 'cash',
          payment_status: 'pending',
          status: 'confirmed',
          delivery_dates: deliveryDates,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      // Send confirmation emails
      try {
        await sendOrderEmails({
          orderId: order.id,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          companyName: customer.companyName,
          address: customer.address,
          city: customer.city,
          floorRoom: customer.floorRoom,
          notes: customer.notes,
          items: items,
          totalAmount,
          paymentMethod: 'cash',
          deliveryDates,
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
        // Don't fail the order for email issues
      }

      return NextResponse.json({ orderId: order.id });
    }
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
