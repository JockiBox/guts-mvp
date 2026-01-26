'use client';

import { useState, useEffect } from 'react';
import { getRankedBots, getTopBots, getBotsAtRisk, getBotLeaderboardStats, loadRetiredBots, getBotLossThreshold, type RankedBot } from '@/lib/profiles';

interface BotLeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BotLeaderboard({ isOpen, onClose }: BotLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'rankings' | 'atRisk' | 'retired' | 'stats'>('rankings');
  const [rankedBots, setRankedBots] = useState<RankedBot[]>([]);
  const [atRiskBots, setAtRiskBots] = useState<RankedBot[]>([]);
  const [retiredBots, setRetiredBots] = useState<ReturnType<typeof loadRetiredBots>>([]);
  const [stats, setStats] = useState<ReturnType<typeof getBotLeaderboardStats> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRankedBots(getTopBots(100));
      setAtRiskBots(getBotsAtRisk(20));
      setRetiredBots(loadRetiredBots());
      setStats(getBotLeaderboardStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatWinRate = (rate: number) => `${(rate * 100).toFixed(1)}%`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '20px',
          padding: '24px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #14b8a6',
          boxShadow: '0 0 30px rgba(20, 184, 166, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#14b8a6', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            🤖 Bot Arena
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { id: 'rankings', label: '🏆 Rankings' },
            { id: 'atRisk', label: '⚠️ At Risk' },
            { id: 'retired', label: '💀 Retired' },
            { id: 'stats', label: '📊 Stats' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                flex: 1,
                padding: '10px',
                background: activeTab === tab.id ? '#14b8a6' : 'rgba(30, 41, 59, 0.8)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? '#14b8a6' : '#334155',
                borderRadius: '8px',
                color: activeTab === tab.id ? '#0f172a' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'rankings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rankedBots.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  No bot stats yet! Play some games to see rankings.
                </div>
              ) : (
                rankedBots.slice(0, 50).map((bot) => (
                  <div
                    key={bot.profile.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: bot.rank <= 3 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: bot.rank === 1 ? '#fbbf24' : bot.rank === 2 ? '#94a3b8' : bot.rank === 3 ? '#cd7f32' : '#334155',
                    }}
                  >
                    {/* Rank */}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: bot.rank === 1 ? '#fbbf24' : bot.rank === 2 ? '#94a3b8' : bot.rank === 3 ? '#cd7f32' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: bot.rank <= 3 ? '#0f172a' : '#94a3b8',
                      }}
                    >
                      {bot.rank}
                    </div>

                    {/* Avatar */}
                    <div style={{ fontSize: '28px' }}>{bot.profile.avatar}</div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '14px' }}>
                        {bot.profile.name}
                        {bot.winMilestones > 0 && (
                          <span style={{ color: '#fbbf24', marginLeft: '6px' }}>
                            {'⭐'.repeat(Math.min(bot.winMilestones, 5))}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '11px' }}>
                        {bot.wins}W / {bot.losses}L
                        {(bot.wins + bot.losses) >= 10 && ` • ${formatWinRate(bot.winRate)} win rate`}
                      </div>
                    </div>

                    {/* Health bar */}
                    <div style={{ width: '60px' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>
                        Lives: {bot.lossesUntilRetirement}
                      </div>
                      <div
                        style={{
                          height: '6px',
                          background: '#1e293b',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.max(0, (bot.lossesUntilRetirement / getBotLossThreshold(bot.winMilestones)) * 100)}%`,
                            background: bot.lossesUntilRetirement <= 10 ? '#ef4444' : bot.lossesUntilRetirement <= 25 ? '#f59e0b' : '#22c55e',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'atRisk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>
                ⚠️ These bots are close to being retired!
              </div>
              {atRiskBots.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  No bots at risk currently!
                </div>
              ) : (
                atRiskBots.map((bot) => (
                  <div
                    key={bot.profile.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '10px',
                      border: '1px solid #ef4444',
                    }}
                  >
                    <div style={{ fontSize: '28px' }}>{bot.profile.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '14px' }}>
                        {bot.profile.name}
                      </div>
                      <div style={{ color: '#ef4444', fontSize: '12px' }}>
                        Only {bot.lossesUntilRetirement} losses until retirement!
                      </div>
                      <div style={{ color: '#64748b', fontSize: '11px' }}>
                        {bot.wins}W / {bot.losses}L
                      </div>
                    </div>
                    <div style={{ fontSize: '24px' }}>💀</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'retired' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>
                💀 These bots have been eliminated from the arena
              </div>
              {retiredBots.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  No retired bots yet. Bots retire after 100 losses!
                </div>
              ) : (
                retiredBots.slice(0, 50).map((entry, index) => (
                  <div
                    key={`${entry.profile.id}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '10px',
                      border: '1px solid #334155',
                      opacity: 0.7,
                    }}
                  >
                    <div style={{ fontSize: '28px', filter: 'grayscale(50%)' }}>{entry.profile.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '14px' }}>
                        {entry.profile.name}
                        {entry.stats.winMilestones > 0 && (
                          <span style={{ color: '#64748b', marginLeft: '6px' }}>
                            {'⭐'.repeat(Math.min(entry.stats.winMilestones, 5))}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '11px' }}>
                        Final: {entry.stats.wins}W / {entry.stats.losses}L
                      </div>
                      {entry.stats.retiredAt && (
                        <div style={{ color: '#475569', fontSize: '10px' }}>
                          Retired: {new Date(entry.stats.retiredAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '20px' }}>⚰️</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    border: '1px solid #14b8a6',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: '#14b8a6', fontSize: '28px', fontWeight: 'bold' }}>
                    {stats.totalActiveBots}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>Active Bots</div>
                </div>
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: '#ef4444', fontSize: '28px', fontWeight: 'bold' }}>
                    {stats.totalRetiredBots}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>Retired Bots</div>
                </div>
              </div>

              {/* Highlights */}
              {stats.topWinRate && (
                <div
                  style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ color: '#fbbf24', fontSize: '12px', marginBottom: '8px' }}>🏆 Highest Win Rate</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>{stats.topWinRate.profile.avatar}</div>
                    <div>
                      <div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{stats.topWinRate.profile.name}</div>
                      <div style={{ color: '#fbbf24', fontSize: '14px' }}>
                        {formatWinRate(stats.topWinRate.winRate)} ({stats.topWinRate.wins}W / {stats.topWinRate.losses}L)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stats.mostWins && (
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #22c55e',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ color: '#22c55e', fontSize: '12px', marginBottom: '8px' }}>💪 Most Wins</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>{stats.mostWins.profile.avatar}</div>
                    <div>
                      <div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{stats.mostWins.profile.name}</div>
                      <div style={{ color: '#22c55e', fontSize: '14px' }}>
                        {stats.mostWins.wins} victories
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stats.mostMilestones && stats.mostMilestones.winMilestones > 0 && (
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid #8b5cf6',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div style={{ color: '#8b5cf6', fontSize: '12px', marginBottom: '8px' }}>⭐ Most Milestones</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px' }}>{stats.mostMilestones.profile.avatar}</div>
                    <div>
                      <div style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{stats.mostMilestones.profile.name}</div>
                      <div style={{ color: '#8b5cf6', fontSize: '14px' }}>
                        {stats.mostMilestones.winMilestones} milestones ({stats.mostMilestones.winMilestones * 100}+ wins)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rules */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#64748b',
                  fontSize: '12px',
                }}
              >
                <div style={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '8px' }}>Arena Rules:</div>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.6 }}>
                  <li>Bots start with 100 lives (losses allowed)</li>
                  <li>Every 100 wins = 100 extra lives</li>
                  <li>When a bot runs out of lives, they&apos;re retired</li>
                  <li>New bots take their place in the arena</li>
                  <li>Rankings based on win rate (min 10 games)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Small badge to show in the UI
export function BotArenaButton({ onClick }: { onClick: () => void }) {
  const [atRiskCount, setAtRiskCount] = useState(0);

  useEffect(() => {
    setAtRiskCount(getBotsAtRisk(10).length);
  }, []);

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid #334155',
        borderRadius: '8px',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '12px',
      }}
    >
      🤖 Bot Arena
      {atRiskCount > 0 && (
        <span
          style={{
            background: '#ef4444',
            color: 'white',
            borderRadius: '10px',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 'bold',
          }}
        >
          {atRiskCount}
        </span>
      )}
    </button>
  );
}
