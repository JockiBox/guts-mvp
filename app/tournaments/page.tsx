'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/useUser';
import { useAdminSettings } from '@/lib/useAdminSettings';
import { getTournaments, joinTournament, leaveTournament, isUserRegistered, type Tournament } from '@/lib/tournaments';
import { playClick, playSuccess, playError, playTokens } from '@/lib/sounds';

export default function TournamentsPage() {
  const { user, fetchProfile } = useUser();
  const { isEnabled } = useAdminSettings();
  const tournamentsEnabled = isEnabled('tournamentsEnabled');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed'>('upcoming');
  const [registeredTournaments, setRegisteredTournaments] = useState<Set<string>>(new Set());
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTournamentsData = async () => {
    try {
      const data = await getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrations = async () => {
    if (!user) return;
    const registered = new Set<string>();
    for (const t of tournaments) {
      if (await isUserRegistered(t.id, user.id)) {
        registered.add(t.id);
      }
    }
    setRegisteredTournaments(registered);
  };

  useEffect(() => {
    if (tournamentsEnabled) {
      fetchTournamentsData();
    }
  }, [tournamentsEnabled]);

  // Check registered tournaments when user changes
  useEffect(() => {
    if (tournamentsEnabled && user && tournaments.length > 0) {
      checkRegistrations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentsEnabled, user, tournaments]);

  // Check if tournaments are disabled
  if (!tournamentsEnabled) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#1e293b',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid #334155',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ color: '#94a3b8', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Tournaments Coming Soon
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Tournaments are currently being prepared. Check back soon for exciting competitions!
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              borderRadius: '10px',
              color: 'white',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            Back to Game
          </Link>
        </div>
      </div>
    );
  }

  const handleJoin = async (tournament: Tournament) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to join tournaments' });
      return;
    }

    playClick();
    setJoiningId(tournament.id);
    setMessage(null);

    const result = await joinTournament(tournament.id, user.id);

    if (result.success) {
      playSuccess();
      playTokens();
      setMessage({ type: 'success', text: `Successfully joined ${tournament.name}!` });
      setRegisteredTournaments((prev) => new Set([...prev, tournament.id]));
      fetchProfile(); // Refresh user tokens
      fetchTournamentsData(); // Refresh tournament data
    } else {
      playError();
      setMessage({ type: 'error', text: result.error || 'Failed to join tournament' });
    }

    setJoiningId(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLeave = async (tournament: Tournament) => {
    if (!user) return;

    playClick();
    setJoiningId(tournament.id);

    const result = await leaveTournament(tournament.id, user.id);

    if (result.success) {
      setMessage({ type: 'success', text: `Left ${tournament.name}. Entry fee refunded.` });
      setRegisteredTournaments((prev) => {
        const next = new Set(prev);
        next.delete(tournament.id);
        return next;
      });
      fetchProfile();
      fetchTournamentsData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to leave tournament' });
    }

    setJoiningId(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredTournaments = tournaments.filter(t => t.status === activeTab);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTimeUntil = (dateStr: string) => {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = target.getTime() - now.getTime();

    if (diff < 0) return 'Started';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#14b8a6', fontSize: '32px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>🏆</span> Tournaments
            </h1>
            <p style={{ color: '#64748b', margin: '4px 0 0' }}>Compete for massive prize pools</p>
          </div>
          <Link
            href="/"
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              borderRadius: '10px',
              color: 'white',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            🎮 Play
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: message.type === 'success' ? '#4ade80' : '#f87171',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            background: '#1e293b',
            borderRadius: '12px',
            padding: '6px',
          }}
        >
          {(['upcoming', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#14b8a6' : 'transparent',
                color: activeTab === tab ? '#0f172a' : '#94a3b8',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'upcoming' && '📅 '}
              {tab === 'active' && '🔴 '}
              {tab === 'completed' && '✅ '}
              {tab}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'pulse 1s ease-in-out infinite' }}>🏆</div>
            <div style={{ color: '#64748b' }}>Loading tournaments...</div>
          </div>
        )}

        {/* Tournament List */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredTournaments.length === 0 ? (
              <div
                style={{
                  background: '#1e293b',
                  borderRadius: '16px',
                  padding: '60px 20px',
                  textAlign: 'center',
                  border: '1px solid #334155',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {activeTab === 'upcoming' ? '📅' : activeTab === 'active' ? '🎮' : '🏅'}
                </div>
                <div style={{ color: '#64748b', fontSize: '16px' }}>
                  No {activeTab} tournaments
                </div>
                <p style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>
                  Check back soon for new tournaments!
                </p>
              </div>
            ) : (
              filteredTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  style={{
                    background: '#1e293b',
                    borderRadius: '16px',
                    border: tournament.status === 'active' ? '2px solid #14b8a6' : '1px solid #334155',
                    overflow: 'hidden',
                    boxShadow: tournament.status === 'active' ? '0 0 20px rgba(20, 184, 166, 0.2)' : 'none',
                  }}
                >
                  {/* Tournament Header */}
                  <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ color: '#cbd5e1', fontSize: '20px', fontWeight: '700', margin: 0 }}>
                            {tournament.name}
                          </h3>
                          {tournament.status === 'active' && (
                            <span
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                animation: 'pulse 1s ease-in-out infinite',
                              }}
                            >
                              LIVE
                            </span>
                          )}
                        </div>
                        {tournament.description && (
                          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                            {tournament.description}
                          </p>
                        )}
                      </div>
                      {tournament.status === 'upcoming' && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '700' }}>
                            {getTimeUntil(tournament.starts_at)}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '11px' }}>until start</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tournament Stats */}
                  <div style={{ padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 100px' }}>
                      <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>Prize Pool</div>
                      <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700' }}>
                        🪙 {tournament.prize_pool.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ flex: '1 1 100px' }}>
                      <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>Entry Fee</div>
                      <div style={{ color: '#14b8a6', fontSize: '20px', fontWeight: '700' }}>
                        {tournament.entry_fee === 0 ? 'FREE' : `🪙 ${tournament.entry_fee}`}
                      </div>
                    </div>
                    <div style={{ flex: '1 1 100px' }}>
                      <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>Players</div>
                      <div style={{ color: '#a855f7', fontSize: '20px', fontWeight: '700' }}>
                        {tournament.participant_count || 0}/{tournament.max_players}
                      </div>
                    </div>
                    <div style={{ flex: '1 1 100px' }}>
                      <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>
                        {tournament.status === 'completed' ? 'Ended' : 'Starts'}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
                        {formatDate(tournament.starts_at)}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {tournament.status === 'upcoming' && (
                    <div style={{ padding: '0 20px 20px' }}>
                      {registeredTournaments.has(tournament.id) ? (
                        <button
                          onClick={() => handleLeave(tournament)}
                          disabled={joiningId === tournament.id}
                          style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#f87171',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '2px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            opacity: joiningId === tournament.id ? 0.7 : 1,
                          }}
                        >
                          {joiningId === tournament.id ? 'Leaving...' : '✓ Registered - Click to Leave'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoin(tournament)}
                          disabled={(tournament.participant_count || 0) >= tournament.max_players || joiningId === tournament.id}
                          style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: 'white',
                            background: (tournament.participant_count || 0) >= tournament.max_players
                              ? '#475569'
                              : 'linear-gradient(135deg, #14b8a6, #0f766e)',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: (tournament.participant_count || 0) >= tournament.max_players
                              ? 'not-allowed'
                              : 'pointer',
                            boxShadow: (tournament.participant_count || 0) >= tournament.max_players
                              ? 'none'
                              : '0 4px 14px rgba(20, 184, 166, 0.4)',
                            opacity: joiningId === tournament.id ? 0.7 : 1,
                          }}
                        >
                          {joiningId === tournament.id
                            ? 'Joining...'
                            : (tournament.participant_count || 0) >= tournament.max_players
                              ? 'Tournament Full'
                              : tournament.entry_fee === 0
                                ? 'Join Free'
                                : `Join for ${tournament.entry_fee} tokens`}
                        </button>
                      )}
                    </div>
                  )}

                  {tournament.status === 'active' && (
                    <div style={{ padding: '0 20px 20px' }}>
                      <button
                        style={{
                          width: '100%',
                          padding: '14px',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: 'white',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                          animation: 'pulse 2s ease-in-out infinite',
                        }}
                      >
                        🎮 Play Now
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Coming Soon Banner */}
        <div
          style={{
            marginTop: '32px',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.05))',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚀</div>
          <h3 style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
            More Tournaments Coming Soon!
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            Daily, weekly, and special event tournaments are on the way. Stay tuned!
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
