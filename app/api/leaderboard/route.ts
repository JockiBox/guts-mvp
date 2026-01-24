import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ leaderboard: [] });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'tokens';

  let orderBy = 'tokens';
  if (type === 'wins') orderBy = 'total_wins';
  if (type === 'games') orderBy = 'total_games';
  if (type === 'streak') orderBy = 'daily_streak';

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_emoji, avatar_color, tokens, total_wins, total_games, daily_streak, vip_level, is_blocked')
      .or('is_blocked.is.null,is_blocked.eq.false')
      .order(orderBy, { ascending: false })
      .limit(50);

    if (error) {
      console.error('Leaderboard error:', error);
      return NextResponse.json({ leaderboard: [] });
    }

    return NextResponse.json({ leaderboard: data || [] });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ leaderboard: [] });
  }
}
