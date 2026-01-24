'use client';

import { supabase, getUserProfile, type UserProfile } from './supabase';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  entry_fee: number;
  prize_pool: number;
  max_players: number;
  status: 'upcoming' | 'active' | 'completed';
  starts_at: string;
  ends_at: string | null;
  participant_count?: number;
  created_at: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  user_id: string;
  username: string;
  position: number | null;
  prize_won: number;
  eliminated_at: string | null;
  joined_at: string;
}

// Get all tournaments
export async function getTournaments(): Promise<Tournament[]> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, tournament_participants(count)')
      .order('starts_at', { ascending: true });

    if (error) throw error;

    return (
      data?.map((t) => ({
        ...t,
        participant_count: t.tournament_participants?.[0]?.count || 0,
      })) || []
    );
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  }
}

// Get single tournament with participants
export async function getTournament(
  tournamentId: string
): Promise<{ tournament: Tournament | null; participants: TournamentParticipant[] }> {
  try {
    const [tournamentResult, participantsResult] = await Promise.all([
      supabase.from('tournaments').select('*').eq('id', tournamentId).single(),
      supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('position', { ascending: true, nullsFirst: false }),
    ]);

    return {
      tournament: tournamentResult.data,
      participants: participantsResult.data || [],
    };
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return { tournament: null, participants: [] };
  }
}

// Check if user is registered for tournament
export async function isUserRegistered(tournamentId: string, userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('tournament_participants')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

// Join a tournament
export async function joinTournament(
  tournamentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get tournament details
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (tournamentError || !tournament) {
      return { success: false, error: 'Tournament not found' };
    }

    // Check if tournament is still open
    if (tournament.status !== 'upcoming') {
      return { success: false, error: 'Tournament is no longer accepting registrations' };
    }

    // Check start time
    const startsAt = new Date(tournament.starts_at);
    if (startsAt <= new Date()) {
      return { success: false, error: 'Tournament has already started' };
    }

    // Check if already registered
    const registered = await isUserRegistered(tournamentId, userId);
    if (registered) {
      return { success: false, error: 'Already registered for this tournament' };
    }

    // Check participant count
    const { count } = await supabase
      .from('tournament_participants')
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', tournamentId);

    if ((count || 0) >= tournament.max_players) {
      return { success: false, error: 'Tournament is full' };
    }

    // Get user profile
    const profile = await getUserProfile(userId);
    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    // Check if user has enough tokens for entry fee
    if (tournament.entry_fee > 0 && profile.tokens < tournament.entry_fee) {
      return { success: false, error: `Need ${tournament.entry_fee} tokens to enter` };
    }

    // Deduct entry fee
    if (tournament.entry_fee > 0) {
      const { error: deductError } = await supabase
        .from('profiles')
        .update({ tokens: profile.tokens - tournament.entry_fee })
        .eq('id', userId);

      if (deductError) {
        return { success: false, error: 'Failed to process entry fee' };
      }
    }

    // Add participant
    const { error: joinError } = await supabase.from('tournament_participants').insert({
      tournament_id: tournamentId,
      user_id: userId,
      username: profile.username,
      position: null,
      prize_won: 0,
    });

    if (joinError) {
      // Refund entry fee on failure
      if (tournament.entry_fee > 0) {
        await supabase
          .from('profiles')
          .update({ tokens: profile.tokens })
          .eq('id', userId);
      }
      return { success: false, error: 'Failed to join tournament' };
    }

    // Update prize pool
    await supabase
      .from('tournaments')
      .update({ prize_pool: tournament.prize_pool + tournament.entry_fee })
      .eq('id', tournamentId);

    return { success: true };
  } catch (error) {
    console.error('Error joining tournament:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Leave a tournament (before it starts)
export async function leaveTournament(
  tournamentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get tournament details
    const { data: tournament } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();

    if (!tournament) {
      return { success: false, error: 'Tournament not found' };
    }

    // Check if tournament has started
    if (tournament.status !== 'upcoming') {
      return { success: false, error: 'Cannot leave a tournament that has started' };
    }

    // Remove participant
    const { error } = await supabase
      .from('tournament_participants')
      .delete()
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: 'Failed to leave tournament' };
    }

    // Refund entry fee
    if (tournament.entry_fee > 0) {
      const profile = await getUserProfile(userId);
      if (profile) {
        await supabase
          .from('profiles')
          .update({ tokens: profile.tokens + tournament.entry_fee })
          .eq('id', userId);

        // Update prize pool
        await supabase
          .from('tournaments')
          .update({ prize_pool: Math.max(0, tournament.prize_pool - tournament.entry_fee) })
          .eq('id', tournamentId);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error leaving tournament:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get user's tournament history
export async function getUserTournaments(
  userId: string
): Promise<Array<Tournament & { participant: TournamentParticipant }>> {
  try {
    const { data } = await supabase
      .from('tournament_participants')
      .select('*, tournament:tournaments(*)')
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });

    return (
      data?.map((p) => ({
        ...(p.tournament as Tournament),
        participant: {
          id: p.id,
          tournament_id: p.tournament_id,
          user_id: p.user_id,
          username: p.username,
          position: p.position,
          prize_won: p.prize_won,
          eliminated_at: p.eliminated_at,
          joined_at: p.joined_at,
        },
      })) || []
    );
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    return [];
  }
}

// Get tournament leaderboard
export async function getTournamentLeaderboard(
  tournamentId: string
): Promise<TournamentParticipant[]> {
  try {
    const { data } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('position', { ascending: true, nullsFirst: false })
      .order('prize_won', { ascending: false });

    return data || [];
  } catch (error) {
    console.error('Error fetching tournament leaderboard:', error);
    return [];
  }
}

// Create a tournament (admin only)
export async function createTournament(
  tournament: Omit<Tournament, 'id' | 'created_at' | 'participant_count'>
): Promise<Tournament | null> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .insert(tournament)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating tournament:', error);
    return null;
  }
}
