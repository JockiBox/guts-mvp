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
          .select('tokens, total_tokens_purchased, total_games, total_wins, vip_level, is_blocked, created_at');

        const { data: purchases } = await supabase
          .from('purchases')
          .select('amount_cents, tokens_added, created_at');

        const { data: gameSessions } = await supabase
          .from('game_sessions')
          .select('rounds_played, tokens_won, tokens_lost');

        const totalUsers = users?.length || 0;
        const activeUsers = users?.filter(u => !u.is_blocked).length || 0;
        const blockedUsers = users?.filter(u => u.is_blocked).length || 0;
        const totalTokensInCirculation = users?.reduce((sum, u) => sum + (u.tokens || 0), 0) || 0;
        const totalTokensPurchased = users?.reduce((sum, u) => sum + (u.total_tokens_purchased || 0), 0) || 0;
        const totalGamesPlayed = users?.reduce((sum, u) => sum + (u.total_games || 0), 0) || 0;
        const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0;
        const totalPurchases = purchases?.length || 0;
        const vipUsers = users?.filter(u => u.vip_level > 0).length || 0;

        // Today's stats
        const today = new Date().toISOString().split('T')[0];
        const todayUsers = users?.filter(u => u.created_at?.startsWith(today)).length || 0;
        const todayRevenue = purchases?.filter(p => p.created_at?.startsWith(today))
          .reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0;
        const todayPurchases = purchases?.filter(p => p.created_at?.startsWith(today)).length || 0;

        // This week's stats
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const weekUsers = users?.filter(u => u.created_at >= weekAgo).length || 0;
        const weekRevenue = purchases?.filter(p => p.created_at >= weekAgo)
          .reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0;

        return NextResponse.json({
          stats: {
            totalUsers,
            activeUsers,
            blockedUsers,
            totalTokensInCirculation,
            totalTokensPurchased,
            totalGamesPlayed,
            totalRevenue: totalRevenue / 100,
            totalPurchases,
            vipUsers,
            todayUsers,
            todayRevenue: todayRevenue / 100,
            todayPurchases,
            weekUsers,
            weekRevenue: weekRevenue / 100,
          }
        });
      }

      case 'leaderboard': {
        const type = searchParams.get('type') || 'tokens';
        let orderBy = 'tokens';
        if (type === 'wins') orderBy = 'total_wins';
        if (type === 'games') orderBy = 'total_games';
        if (type === 'streak') orderBy = 'daily_streak';

        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_emoji, avatar_color, tokens, total_wins, total_games, daily_streak, vip_level')
          .eq('is_blocked', false)
          .order(orderBy, { ascending: false })
          .limit(100);

        if (error) throw error;
        return NextResponse.json({ leaderboard: data });
      }

      case 'announcements': {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error && error.code !== 'PGRST116') throw error;
        return NextResponse.json({ announcements: data || [] });
      }

      case 'referrals': {
        const { data, error } = await supabase
          .from('referrals')
          .select('*, referrer:profiles!referrer_id(username), referred:profiles!referred_id(username)')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error && error.code !== 'PGRST116') throw error;
        return NextResponse.json({ referrals: data || [] });
      }

      case 'activityLog': {
        const userId = searchParams.get('userId');
        let query = supabase
          .from('activity_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (error && error.code !== 'PGRST116') throw error;
        return NextResponse.json({ activities: data || [] });
      }

      case 'export': {
        const exportType = searchParams.get('type') || 'users';
        let data;

        if (exportType === 'users') {
          const { data: users } = await supabase.from('profiles').select('*');
          data = users;
        } else if (exportType === 'purchases') {
          const { data: purchases } = await supabase.from('purchases').select('*');
          data = purchases;
        }

        return NextResponse.json({ data, exportType });
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
        const { userId, amount, reason } = body;
        if (!userId || amount === undefined) {
          return NextResponse.json({ error: 'Missing userId or amount' }, { status: 400 });
        }

        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('tokens')
          .eq('id', userId)
          .single();

        if (fetchError) throw fetchError;

        const newBalance = Math.max(0, (profile?.tokens || 0) + amount);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ tokens: newBalance })
          .eq('id', userId);

        if (updateError) throw updateError;

        // Log activity (ignore errors if table doesn't exist yet)
        try {
          await supabase.from('activity_log').insert({
            user_id: userId,
            action: amount >= 0 ? 'tokens_granted' : 'tokens_removed',
            details: { amount, reason: reason || 'Admin action', newBalance },
          });
        } catch {
          // Activity log table may not exist yet
        }

        return NextResponse.json({ success: true, newBalance });
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

        try {
          await supabase.from('activity_log').insert({
            user_id: userId,
            action: 'vip_changed',
            details: { level },
          });
        } catch {
          // Activity log table may not exist yet
        }

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

        try {
          await supabase.from('activity_log').insert({
            user_id: userId,
            action: 'tokens_reset',
            details: { newAmount: amount || 100 },
          });
        } catch {
          // Activity log table may not exist yet
        }

        return NextResponse.json({ success: true });
      }

      case 'blockUser': {
        const { userId, blocked, reason } = body;
        if (!userId) {
          return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const { error } = await supabase
          .from('profiles')
          .update({ is_blocked: blocked, block_reason: reason || null })
          .eq('id', userId);

        if (error) throw error;

        try {
          await supabase.from('activity_log').insert({
            user_id: userId,
            action: blocked ? 'user_blocked' : 'user_unblocked',
            details: { reason },
          });
        } catch {
          // Activity log table may not exist yet
        }

        return NextResponse.json({ success: true });
      }

      case 'deleteUser': {
        const { userId } = body;
        if (!userId) {
          return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      case 'bulkGrantTokens': {
        const { userIds, amount, reason } = body;
        if (!userIds?.length || amount === undefined) {
          return NextResponse.json({ error: 'Missing userIds or amount' }, { status: 400 });
        }

        for (const userId of userIds) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('tokens')
            .eq('id', userId)
            .single();

          if (profile) {
            await supabase
              .from('profiles')
              .update({ tokens: Math.max(0, profile.tokens + amount) })
              .eq('id', userId);
          }
        }

        return NextResponse.json({ success: true, updated: userIds.length });
      }

      case 'createAnnouncement': {
        const { title, message, type, expiresAt } = body;
        if (!title || !message) {
          return NextResponse.json({ error: 'Missing title or message' }, { status: 400 });
        }

        const { data, error } = await supabase
          .from('announcements')
          .insert({
            title,
            message,
            type: type || 'info',
            expires_at: expiresAt || null,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json({ success: true, announcement: data });
      }

      case 'deleteAnnouncement': {
        const { announcementId } = body;
        if (!announcementId) {
          return NextResponse.json({ error: 'Missing announcementId' }, { status: 400 });
        }

        const { error } = await supabase
          .from('announcements')
          .delete()
          .eq('id', announcementId);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      case 'sendNotification': {
        const { userId, title, message } = body;
        if (!userId || !title || !message) {
          return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title,
            message,
            read: false,
          });

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      case 'broadcastNotification': {
        const { title, message } = body;
        if (!title || !message) {
          return NextResponse.json({ error: 'Missing title or message' }, { status: 400 });
        }

        const { data: users } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_blocked', false);

        if (users) {
          const notifications = users.map(u => ({
            user_id: u.id,
            title,
            message,
            read: false,
          }));

          await supabase.from('notifications').insert(notifications);
        }

        return NextResponse.json({ success: true, sent: users?.length || 0 });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
