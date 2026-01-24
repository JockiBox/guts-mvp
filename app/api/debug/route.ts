import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY || '';
  return NextResponse.json({
    keyPrefix: key.substring(0, 8),
    keyLength: key.length,
    keyEndsCorrectly: key.endsWith('Si'),
    hasWhitespace: key !== key.trim(),
    nodeEnv: process.env.NODE_ENV,
  });
}
