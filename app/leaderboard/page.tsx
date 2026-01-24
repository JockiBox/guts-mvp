'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_emoji: string;
  avatar_color: string;
  tokens: number;
  total_wins: number;
  total_games: number;
  daily_streak: number;
  vip_level: number;
}

type LeaderboardType = 'tokens' | 'wins' | 'games' | 'streak';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<LeaderboardType>('tokens');

  useEffect(() => {
    fetchLeaderboard(activeType);
  }, [activeType]);

  const fetchLeaderboard = async (type: LeaderboardType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?type=${type}`);
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: LeaderboardType; label: string; icon: string }[] = [
    { id: 'tokens', label: 'Richest', icon: '🪙' },
    { id: 'wins', label: 'Most Wins', icon: '🏆' },
    { id: 'games', label: 'Most Games', icon: '🎮' },
    { id: 'streak', label: 'Top Streak', icon: '🔥' },
  ];

  const getValue = (entry: LeaderboardEntry): number | string => {
    switch (activeType) {
      case 'tokens':
        return entry.tokens.toLocaleString();
      case 'wins':
        return entry.total_wins;
      case 'games':
        return entry.total_games;
      case 'streak':
        return entry.daily_streak;
      default:
        return entry.tokens;
    }
  };

  const getValueLabel = (): string => {
    switch (activeType) {
      case 'tokens':
        return 'Tokens';
      case 'wins':
        return 'Wins';
      case 'games':
        return 'Games';
      case 'streak':
        return 'Day Streak';
      default:
        return 'Value';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#14b8a6', fontSize: '32px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>🏆</span> Leaderboard
            </h1>
            <p style={{ color: '#64748b', margin: '4px 0 0' }}>Top players in GUTS</p>
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeType === tab.id ? '#14b8a6' : 'transparent',
                color: activeType === tab.id ? '#0f172a' : '#94a3b8',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <span>{tab.icon}</span>
              <span style={{ display: 'none' }}>{tab.label}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        {!loading && leaderboard.length >= 3 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: '16px',
              marginBottom: '24px',
              padding: '20px 0',
            }}
          >
            {/* 2nd Place */}
            <PodiumCard entry={leaderboard[1]} rank={2} valueLabel={getValueLabel()} getValue={getValue} />
            {/* 1st Place */}
            <PodiumCard entry={leaderboard[0]} rank={1} valueLabel={getValueLabel()} getValue={getValue} />
            {/* 3rd Place */}
            <PodiumCard entry={leaderboard[2]} rank={3} valueLabel={getValueLabel()} getValue={getValue} />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'pulse 1s ease-in-out infinite' }}>🎮</div>
            <div style={{ color: '#64748b' }}>Loading leaderboard...</div>
          </div>
        )}

        {/* Leaderboard List */}
        {!loading && (
          <div
            style={{
              background: '#1e293b',
              borderRadius: '16px',
              border: '1px solid #334155',
              overflow: 'hidden',
            }}
          >
            {leaderboard.slice(3).map((entry, index) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: index < leaderboard.length - 4 ? '1px solid #334155' : 'none',
                  gap: '16px',
                }}
              >
                {/* Rank */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontWeight: '700',
                    fontSize: '14px',
                  }}
                >
                  {index + 4}
                </div>

                {/* Avatar */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: entry.avatar_color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    border: '2px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {entry.avatar_emoji}
                </div>

                {/* Name */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#cbd5e1', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {entry.username}
                    {entry.vip_level > 0 && (
                      <span style={{ fontSize: '12px' }}>
                        {entry.vip_level === 1 ? '🥉' : entry.vip_level === 2 ? '🥈' : '🥇'}
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>
                    {entry.total_wins}W / {entry.total_games}G
                    {entry.total_games > 0 && ` · ${Math.round((entry.total_wins / entry.total_games) * 100)}%`}
                  </div>
                </div>

                {/* Value */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#fbbf24', fontWeight: '700', fontSize: '18px' }}>
                    {activeType === 'tokens' && '🪙 '}
                    {activeType === 'streak' && '🔥 '}
                    {getValue(entry)}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>{getValueLabel()}</div>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No players yet. Be the first!
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @media (max-width: 600px) {
          .tab-label { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function PodiumCard({
  entry,
  rank,
  valueLabel,
  getValue,
}: {
  entry: LeaderboardEntry;
  rank: number;
  valueLabel: string;
  getValue: (e: LeaderboardEntry) => number | string;
}) {
  const heights = { 1: '160px', 2: '130px', 3: '110px' };
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const colors = { 1: '#fbbf24', 2: '#94a3b8', 3: '#cd7f32' };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: rank === 1 ? '140px' : '120px',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: rank === 1 ? '72px' : '60px',
          height: rank === 1 ? '72px' : '60px',
          borderRadius: '50%',
          background: entry.avatar_color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: rank === 1 ? '36px' : '28px',
          border: `3px solid ${colors[rank as keyof typeof colors]}`,
          boxShadow: `0 0 20px ${colors[rank as keyof typeof colors]}40`,
          marginBottom: '8px',
        }}
      >
        {entry.avatar_emoji}
      </div>

      {/* Medal */}
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{medals[rank as keyof typeof medals]}</div>

      {/* Name */}
      <div
        style={{
          color: '#cbd5e1',
          fontWeight: '700',
          fontSize: rank === 1 ? '16px' : '14px',
          textAlign: 'center',
          marginBottom: '4px',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.username}
      </div>

      {/* Value */}
      <div style={{ color: colors[rank as keyof typeof colors], fontWeight: '700', fontSize: rank === 1 ? '20px' : '16px' }}>
        {getValue(entry)}
      </div>
      <div style={{ color: '#64748b', fontSize: '11px' }}>{valueLabel}</div>

      {/* Podium */}
      <div
        style={{
          width: '100%',
          height: heights[rank as keyof typeof heights],
          background: `linear-gradient(180deg, ${colors[rank as keyof typeof colors]}40, ${colors[rank as keyof typeof colors]}10)`,
          borderRadius: '8px 8px 0 0',
          marginTop: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '12px',
          fontSize: '32px',
          fontWeight: '900',
          color: colors[rank as keyof typeof colors],
        }}
      >
        {rank}
      </div>
    </div>
  );
}
