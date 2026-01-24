import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { TOKEN_PACKAGES } from '@/lib/shop';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe secret key not configured');
  }
  return new Stripe(key, {
    maxNetworkRetries: 3,
    timeout: 30000,
  });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { packageId, userId } = await request.json();

    const tokenPackage = TOKEN_PACKAGES.find(p => p.id === packageId);
    if (!tokenPackage) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const totalTokens = tokenPackage.tokens + tokenPackage.bonus;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tokenPackage.name} - ${totalTokens.toLocaleString()} Tokens`,
              description: tokenPackage.bonus > 0
                ? `${tokenPackage.tokens.toLocaleString()} tokens + ${tokenPackage.bonus.toLocaleString()} bonus!`
                : `${tokenPackage.tokens.toLocaleString()} tokens for GUTS`,
              images: ['https://guts-mvp.vercel.app/og-image.png'],
            },
            unit_amount: tokenPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://guts-mvp.vercel.app'}/?purchase=success&tokens=${totalTokens}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://guts-mvp.vercel.app'}/?purchase=cancelled`,
      metadata: {
        userId,
        packageId: tokenPackage.id,
        tokens: totalTokens.toString(),
      },
      client_reference_id: userId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Checkout error:', errorMessage, error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
