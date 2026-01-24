import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jockibox26';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase not configured');
  }
  return createClient(url, key);
}

// Verify admin password
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const password = authHeader.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// GET - Fetch admin data
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'users': {
        const { data: users, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ users });
      }

      case 'purchases': {
        const { data: purchases, error } = await supabase
          .from('purchases')
          .select('*, profiles(username, email)')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        return NextResponse.json({ purchases });
      }

      case 'stats': {
        const { data: users } = await supabase
          .from('profiles')
          .select('tokens, total_tokens_purchased, total_games, total_wins, vip_level');

        const { data: purchases } = await supabase
          .from('purchases')
          .select('amount_cents, tokens_added');

        const totalUsers = users?.length || 0;
        const totalTokensInCirculation = users?.reduce((sum, u) => sum + (u.tokens || 0), 0) || 0;
        const totalTokensPurchased = users?.reduce((sum, u) => sum + (u.total_tokens_purchased || 0), 0) || 0;
        const totalGamesPlayed = users?.reduce((sum, u) => sum + (u.total_games || 0), 0) || 0;
        const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0;
        const totalPurchases = purchases?.length || 0;
        const vipUsers = users?.filter(u => u.vip_level > 0).length || 0;

        return NextResponse.json({
          stats: {
            totalUsers,
            totalTokensInCirculation,
            totalTokensPurchased,
            totalGamesPlayed,
            totalRevenue: totalRevenue / 100, // Convert cents to dollars
            totalPurchases,
            vipUsers,
          }
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Admin actions
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const body = await request.json();
  const { action } = body;

  try {
    switch (action) {
      case 'grantTokens': {
        const { userId, amount } = body;
        if (!userId || !amount) {
          return NextResponse.json({ error: 'Missing userId or amount' }, { status: 400 });
        }

        // Get current tokens
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('tokens')
          .eq('id', userId)
          .single();

        if (fetchError) throw fetchError;

        // Update tokens
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ tokens: (profile?.tokens || 0) + amount })
          .eq('id', userId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, newBalance: (profile?.tokens || 0) + amount });
      }

      case 'setVIP': {
        const { userId, level } = body;
        if (!userId || level === undefined) {
          return NextResponse.json({ error: 'Missing userId or level' }, { status: 400 });
        }

        const { error } = await supabase
          .from('profiles')
          .update({ vip_level: level })
          .eq('id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      case 'resetTokens': {
        const { userId, amount } = body;
        if (!userId) {
          return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const { error } = await supabase
          .from('profiles')
          .update({ tokens: amount || 100 })
          .eq('id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      case 'deleteUser': {
        const { userId } = body;
        if (!userId) {
          return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // Delete from profiles (will cascade to purchases due to FK)
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
