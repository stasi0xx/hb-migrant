import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendOrderEmails } from '@/lib/resend';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createServerSupabaseClient();

    // Find order by stripe session id
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single();

    if (fetchError || !order) {
      console.error('Order not found for session:', session.id);
      return NextResponse.json({ received: true });
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    // Send confirmation emails
    console.log('Sending emails for order:', order.id, 'to:', order.customer_email);
    try {
      await sendOrderEmails({
        orderId: order.id,
        customerFirstName: order.customer_first_name,
        customerLastName: order.customer_last_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        companyName: order.company_name,
        address: order.address,
        city: order.city,
        floorRoom: order.floor_room,
        notes: order.notes,
        items: order.items,
        totalAmount: Number(order.total_amount),
        paymentMethod: 'stripe',
        deliveryDates: order.delivery_dates,
      });
      console.log('Emails sent successfully');
    } catch (emailErr) {
      console.error('Email send error:', JSON.stringify(emailErr));
    }
  }

  return NextResponse.json({ received: true });
}

export const runtime = 'nodejs';
