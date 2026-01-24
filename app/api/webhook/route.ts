import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe secret key not configured');
  }
  return new Stripe(key, {
    apiVersion: '2025-12-15.clover',
  });
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase not configured');
  }
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId || session.client_reference_id;
    const tokens = parseInt(session.metadata?.tokens || '0', 10);

    if (userId && tokens > 0) {
      try {
        // Get current user profile
        const { data: profile, error: fetchError } = await supabaseAdmin
          .from('profiles')
          .select('tokens, total_tokens_purchased')
          .eq('id', userId)
          .single();

        if (fetchError) {
          console.error('Error fetching profile:', fetchError);
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Update user tokens
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            tokens: (profile?.tokens || 0) + tokens,
            total_tokens_purchased: (profile?.total_tokens_purchased || 0) + tokens,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating tokens:', updateError);
          return NextResponse.json({ error: 'Failed to update tokens' }, { status: 500 });
        }

        // Log the purchase
        await supabaseAdmin.from('purchases').insert({
          user_id: userId,
          stripe_session_id: session.id,
          amount_cents: session.amount_total,
          tokens_added: tokens,
          package_id: session.metadata?.packageId,
        });

        console.log(`Added ${tokens} tokens to user ${userId}`);
      } catch (error) {
        console.error('Error processing payment:', error);
        return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
